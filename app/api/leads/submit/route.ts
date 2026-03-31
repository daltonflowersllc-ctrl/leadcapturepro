export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import webpush from 'web-push';
import { getDb } from '@/lib/db';
import { leads, users, calls } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken, generateId } from '@/lib/auth';
import { scoreLead, generateOwnerSMS } from '@/lib/ai';
import { sendNewLeadEmail } from '@/lib/email';

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:admin@leadcapturepro.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const token = formData.get('token') as string | null;
    const userId = formData.get('userId') as string | null;
    const callId = formData.get('callId') as string | null;
    const callerName = formData.get('callerName') as string | null;
    const callerEmail = formData.get('callerEmail') as string | null;
    const serviceType = formData.get('serviceType') as string | null;
    const urgency = formData.get('urgency') as string | null;
    const budget = formData.get('budget') as string | null;
    const description = formData.get('description') as string | null;
    const callbackTime = formData.get('callbackTime') as string | null;
    const photo = formData.get('photo') as File | null;

    if (!token || !userId || !callerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payload = verifyToken(token);
    if (!payload || payload.userId !== userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Look up caller phone from call record if callId provided
    let callerPhone = '';
    let voicemailTranscription: string | null = null;
    if (callId) {
      const callRecord = await getDb()
        .select({ callerNumber: calls.callerNumber, transcriptText: calls.transcriptText })
        .from(calls)
        .where(eq(calls.id, callId))
        .limit(1);
      if (callRecord.length > 0) {
        callerPhone = callRecord[0].callerNumber;
        voicemailTranscription = callRecord[0].transcriptText || null;
      }
    }

    // Build formData JSON for storage
    const storedFormData: Record<string, string> = {};
    if (serviceType) storedFormData.serviceType = serviceType;
    if (budget) storedFormData.budget = budget;
    if (description) storedFormData.description = description;
    if (callbackTime) storedFormData.callbackTime = callbackTime;
    if (photo) storedFormData.photoName = photo.name;
    if (voicemailTranscription) storedFormData.transcription = voicemailTranscription;

    // Score the lead with AI
    const aiScore = await scoreLead(
      serviceType || '',
      urgency || '',
      budget || '',
      description || ''
    );
    storedFormData.aiScore = aiScore.score;
    storedFormData.aiEmoji = aiScore.emoji;
    storedFormData.aiReason = aiScore.reason;
    storedFormData.aiConfidence = String(aiScore.confidence);

    // Save lead to database
    const leadId = generateId();
    await getDb().insert(leads).values({
      id: leadId,
      userId,
      callId: callId || null,
      callerName,
      callerPhone,
      callerEmail: callerEmail || null,
      serviceNeeded: serviceType || null,
      urgency: urgency || null,
      status: 'new',
      notes: description || null,
      formData: storedFormData,
    });

    // Fetch business owner info for SMS, email, webhook, and push notifications
    const userRecord = await getDb()
      .select({ email: users.email, phone: users.phone, businessName: users.businessName, name: users.name, tier: users.tier, webhookUrl: users.webhookUrl, pushSubscription: users.pushSubscription })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userRecord.length > 0) {
      const owner = userRecord[0];
      // Send email notification as backup to SMS (non-fatal)
      try {
        await sendNewLeadEmail(owner.email, owner.businessName || owner.name || 'Your business', {
          callerName,
          callerPhone,
          serviceNeeded: serviceType || null,
          urgency: urgency || null,
          notes: description || null,
          aiScore: aiScore.score,
          leadId,
        });
      } catch (emailError) {
        console.error('Lead email notification failed:', emailError);
      }
    }

    if (userRecord.length > 0 && userRecord[0].phone) {
      const owner = userRecord[0];
      const businessLabel = owner.businessName || owner.name || 'Your business';

      // Generate AI owner SMS
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      const rawOwnerSms = await generateOwnerSMS(
        businessLabel,
        callerName,
        callerPhone,
        serviceType || '',
        urgency || '',
        budget || '',
        description || '',
        aiScore.score,
        aiScore.emoji
      );
      const smsBody = rawOwnerSms.replace('[APP_URL]', appUrl);

      const twilioClient = twilio(
        process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await twilioClient.messages.create({
        body: smsBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: owner.phone,
      });
    }

    // Fire Zapier webhook if user is Pro or Elite and has a webhook URL set
    if (userRecord.length > 0) {
      const owner = userRecord[0];
      if ((owner.tier === 'pro' || owner.tier === 'elite') && owner.webhookUrl) {
        const webhookPayload = {
          leadId,
          callerName,
          callerPhone,
          callerEmail: callerEmail || null,
          serviceType: serviceType || null,
          urgency: urgency || null,
          budget: budget || null,
          description: description || null,
          callbackTime: callbackTime || null,
          photoUrl: photo ? storedFormData.photoName : null,
          businessName: owner.businessName || owner.name || null,
          aiScore: aiScore.score,
          aiEmoji: aiScore.emoji,
          aiReason: aiScore.reason,
          receivedAt: new Date().toISOString(),
        };
        try {
          await fetch(owner.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload),
          });
        } catch (webhookError) {
          console.error('Webhook delivery error:', webhookError);
          // Non-fatal — lead is saved even if webhook fails
        }
      }
    }

    // Send web push notification to business owner if they have a subscription
    if (userRecord.length > 0 && userRecord[0].pushSubscription && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      try {
        const subscription = JSON.parse(userRecord[0].pushSubscription);
        const urgencyLabel = urgency ? ` (${urgency} urgency)` : '';
        const serviceLabel = serviceType ? serviceType : 'a service';
        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title: `${aiScore.emoji} New Lead!`,
            body: `${callerName} needs ${serviceLabel}${urgencyLabel}`,
            url: '/dashboard',
          })
        );
      } catch (pushError) {
        console.error('Push notification error:', pushError);
        // Non-fatal — lead is saved even if push fails
      }
    }

    return NextResponse.json(
      { success: true, message: 'Lead captured successfully', leadId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
