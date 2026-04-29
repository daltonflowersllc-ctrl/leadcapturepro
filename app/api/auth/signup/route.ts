export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { generateToken, hashPassword } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import twilio from 'twilio';
import { stripe } from '@/lib/stripe';
import { sendWelcomeEmail } from '@/lib/email';

function extractAreaCode(phone: string): number | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '1') {
    return parseInt(digits.substring(1, 4), 10);
  }
  if (digits.length === 10) {
    return parseInt(digits.substring(0, 3), 10);
  }
  return null;
}

async function provisionTwilioNumber(userId: string, userPhone: string | null): Promise<void> {
  const client = twilio(
    process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const webhookUrl = `${appUrl}/api/webhooks/twilio`;

  let availableNumber: string | null = null;

  if (userPhone) {
    const areaCode = extractAreaCode(userPhone);
    if (areaCode) {
      const numbers = await client.availablePhoneNumbers('US').local.list({ areaCode, limit: 1 });
      if (numbers.length > 0) {
        availableNumber = numbers[0].phoneNumber;
      }
    }
  }

  if (!availableNumber) {
    const numbers = await client.availablePhoneNumbers('US').local.list({ limit: 1 });
    if (numbers.length > 0) {
      availableNumber = numbers[0].phoneNumber;
    }
  }

  if (!availableNumber) {
    throw new Error('No available Twilio phone numbers found');
  }

  const purchased = await client.incomingPhoneNumbers.create({
    phoneNumber: availableNumber,
    voiceUrl: webhookUrl,
    voiceMethod: 'POST',
    statusCallback: webhookUrl,
    statusCallbackMethod: 'POST',
  });

  await supabaseAdmin
    .from('phone_numbers')
    .insert({ id: crypto.randomUUID(), user_id: userId, twilio_phone_number: purchased.phoneNumber, twilio_sid: purchased.sid, is_active: true });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, businessName, phone, plan } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();

    const tier = plan === 'premium' ? 'premium' : plan === 'elite' ? 'elite' : 'essential';

    // Insert with pending status — not activated until Stripe checkout completes
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        password: hashedPassword,
        name,
        business_name: businessName || null,
        phone: phone || null,
        tier,
        subscription_status: 'pending',
      });

    if (insertError) {
      console.error('User insert error:', insertError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { supabase_user_id: userId, business_name: businessName || '' },
    });

    // Persist the customer ID immediately so the webhook can look up the user
    await supabaseAdmin
      .from('users')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId);

    const priceIdMap: Record<string, string | undefined> = {
      essential: process.env.STRIPE_ESSENTIAL_MONTHLY_PRICE_ID,
      premium: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
      elite: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
    };
    const priceId = priceIdMap[tier];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

    // Require card entry even during trial; cancel trial automatically if card is absent
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
        metadata: { supabase_user_id: userId, plan: tier },
      },
      payment_method_collection: 'always',
      success_url: `${appUrl}/dashboard?welcome=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/signup?canceled=true`,
      allow_promotion_codes: true,
    });

    // Provision Twilio phone number (non-fatal)
    let twilioNumber = '';
    try {
      await provisionTwilioNumber(userId, phone || null);
      const { data: provisioned } = await supabaseAdmin
        .from('phone_numbers')
        .select('twilio_phone_number')
        .eq('user_id', userId)
        .limit(1);
      twilioNumber = provisioned?.[0]?.twilio_phone_number || '';
    } catch (twilioError) {
      console.error('Twilio provisioning failed — account created, flagged for manual assignment:', twilioError);
    }

    // Send welcome email (non-fatal)
    try {
      await sendWelcomeEmail(email, name, businessName || '', tier, twilioNumber);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }

    const token = generateToken({ userId, email, tier });

    const response = NextResponse.json(
      {
        success: true,
        user: { id: userId, email, name, businessName: businessName || null, tier },
        checkoutUrl: session.url,
      },
      { status: 201 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
