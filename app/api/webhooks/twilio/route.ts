export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { getDb } from '@/lib/db';
import { calls, phoneNumbers, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateId, generateToken } from '@/lib/auth';
import { generateSmartSMS, transcribeVoicemail } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const callSid = params.get('CallSid');
    const from = params.get('From');
    const to = params.get('To');
    const callStatus = params.get('CallStatus');
    const recordingUrl = params.get('RecordingUrl');

    console.log('Twilio webhook received:', { callSid, from, to, callStatus });

    if ((callStatus === 'no-answer' || callStatus === 'busy' || callStatus === 'failed') && from && to) {
      // Look up the phone number record and user
      const phoneRecord = await getDb()
        .select({
          id: phoneNumbers.id,
          userId: phoneNumbers.userId,
        })
        .from(phoneNumbers)
        .where(eq(phoneNumbers.twilioPhoneNumber, to))
        .limit(1);

      if (phoneRecord.length === 0) {
        return NextResponse.json({ success: true });
      }

      const { id: phoneNumberId, userId } = phoneRecord[0];

      const userRecord = await getDb()
        .select({
          businessName: users.businessName,
          name: users.name,
          phone: users.phone,
          email: users.email,
          tier: users.tier,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (userRecord.length === 0) {
        return NextResponse.json({ success: true });
      }

      const owner = userRecord[0];
      const businessName = owner.businessName || owner.name || 'us';

      // Create call record
      const callId = generateId();
      await getDb().insert(calls).values({
        id: callId,
        userId,
        phoneNumberId,
        callerNumber: from,
        missedCall: true,
        smsNotificationSent: false,
        leadCaptured: false,
        recordingUrl: recordingUrl || null,
      });

      // Transcribe voicemail if recording exists
      if (recordingUrl) {
        try {
          const transcription = await transcribeVoicemail(recordingUrl);
          await getDb()
            .update(calls)
            .set({ transcriptText: transcription })
            .where(eq(calls.id, callId));
        } catch (transcribeError) {
          console.error('Voicemail transcription error:', transcribeError);
        }
      }

      // Generate lead form link with a short-lived token
      const formToken = generateToken({ userId, email: owner.email || '', tier: owner.tier });
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      const formLink = `${appUrl}/lead?userId=${userId}&callId=${callId}&token=${formToken}`;

      // Generate AI-powered SMS for the caller
      const hourOfDay = new Date().getHours();
      const rawSms = await generateSmartSMS(businessName, from, hourOfDay);
      const smsBody = rawSms.replace('[FORM_LINK]', formLink);

      // Send SMS to caller
      const twilioClient = twilio(
        process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await twilioClient.messages.create({
        body: smsBody,
        from: to,
        to: from,
      });

      // Mark SMS as sent
      await getDb()
        .update(calls)
        .set({ smsNotificationSent: true })
        .where(eq(calls.id, callId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
