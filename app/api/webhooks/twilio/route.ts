import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // Verify Twilio webhook signature
    const signature = request.headers.get('x-twilio-signature') || '';
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/twilio`;
    const body = await request.text();

    // TODO: Verify signature
    // const isValid = twilio.validateRequest(
    //   TWILIO_AUTH_TOKEN,
    //   signature,
    //   url,
    //   body
    // );

    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    // }

    const params = new URLSearchParams(body);
    const callSid = params.get('CallSid');
    const from = params.get('From');
    const to = params.get('To');
    const callStatus = params.get('CallStatus');

    console.log('Twilio webhook received:', {
      callSid,
      from,
      to,
      callStatus,
    });

    // TODO: Handle different call statuses
    // - ringing: Call is ringing
    // - in-progress: Call is active
    // - completed: Call ended
    // - no-answer: Call was not answered (MISSED CALL)
    // - busy: Line was busy
    // - failed: Call failed

    if (callStatus === 'no-answer') {
      // This is a missed call
      // TODO: 
      // 1. Find the user by the 'to' phone number
      // 2. Get their SMS template
      // 3. Send SMS to caller with lead form link (for Pro) or callback notification (for Basic)
      // 4. Store call record in database
      // 5. Send notification SMS to company
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
