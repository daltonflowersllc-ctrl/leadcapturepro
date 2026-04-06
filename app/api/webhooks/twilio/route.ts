export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { generateId, generateToken } from '@/lib/auth';
import { generateSmartSMS, transcribeVoicemail } from '@/lib/ai';
import { checkSmsLimit, incrementSmsCount, Tier } from '@/lib/limits';
import { sendEmail } from '@/lib/email';

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
      const { data: phoneRows } = await supabaseAdmin
        .from('phone_numbers')
        .select('id, user_id')
        .eq('twilio_phone_number', to)
        .limit(1);

      if (!phoneRows || phoneRows.length === 0) {
        return NextResponse.json({ success: true });
      }

      const { id: phoneNumberId, user_id: userId } = phoneRows[0];

      const { data: userRows } = await supabaseAdmin
        .from('users')
        .select('business_name, name, phone, email, tier')
        .eq('id', userId)
        .limit(1);

      if (!userRows || userRows.length === 0) {
        return NextResponse.json({ success: true });
      }

      const owner = userRows[0];
      const businessName = owner.business_name || owner.name || 'us';

      // Create call record
      const callId = generateId();
      await supabaseAdmin
        .from('calls')
        .insert({
          id: callId,
          user_id: userId,
          phone_number_id: phoneNumberId,
          caller_number: from,
          missed_call: true,
          sms_notification_sent: false,
          lead_captured: false,
          recording_url: recordingUrl || null,
        });

      // Transcribe voicemail if recording exists
      if (recordingUrl) {
        try {
          const transcription = await transcribeVoicemail(recordingUrl);
          await supabaseAdmin
            .from('calls')
            .update({ transcript_text: transcription })
            .eq('id', callId);
        } catch (transcribeError) {
          console.error('Voicemail transcription error:', transcribeError);
        }
      }

      // Generate lead form link with a short-lived token
      const formToken = generateToken({ userId, email: owner.email || '', tier: owner.tier });
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      const formLink = `${appUrl}/lead?userId=${userId}&callId=${callId}&token=${formToken}`;

      // Check SMS limit
      const { allowed, percentage } = await checkSmsLimit(userId, owner.tier as Tier);

      if (!allowed) {
        console.warn(`SMS limit reached for user ${userId}`);
        await supabaseAdmin
          .from('calls')
          .update({ sms_notification_sent: false })
          .eq('id', callId);

        // Send notification saying limit reached
        if (owner.email) {
          await sendEmail(
            owner.email,
            '🚨 SMS Limit Reached — Action Required',
            `<p>Hi ${owner.name},</p><p>You have reached 100% of your monthly SMS limit. We were unable to send an automated response to a missed call from ${from}.</p><p>Please <a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe">upgrade your plan</a> to continue providing instant responses to your customers.</p>`
          );
        }
      } else {
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

        // Increment count and mark as sent
        await incrementSmsCount(userId);
        await supabaseAdmin
          .from('calls')
          .update({ sms_notification_sent: true })
          .eq('id', callId);

        // Send warning if over 80%
        if (percentage >= 80 && owner.email) {
          await sendEmail(
            owner.email,
            '⚠️ SMS Limit Warning — 80% Used',
            `<p>Hi ${owner.name},</p><p>You have used ${Math.round(percentage)}% of your monthly SMS limit. To avoid any service interruption, consider upgrading your plan.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/subscribe">Upgrade to Pro →</a></p>`
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
