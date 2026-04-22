export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';
import { sendPaymentFailedEmail, sendAccountSuspendedEmail } from '@/lib/email';
import { welcomeEmail, sendEmail } from '@/lib/emails/templates';

function planTierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) return 'pro';
  if (priceId === process.env.STRIPE_STARTER_MONTHLY_PRICE_ID) return 'starter';
  if (priceId === process.env.STRIPE_ELITE_MONTHLY_PRICE_ID) return 'elite';
  return 'starter';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_email || session.customer_details?.email;
        const priceId = session.line_items?.data[0]?.price?.id || session.metadata?.priceId;

        if (customerEmail) {
          const tier = priceId ? planTierFromPriceId(priceId) : 'starter';
          await supabaseAdmin
            .from('users')
            .update({
              subscription_status: 'active',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              tier,
              trial_ends_at: null,
              updated_at: new Date().toISOString(),
            })
            .eq('email', customerEmail);

          const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('owner_name, business_name, plan, twilio_number, email')
            .eq('email', customerEmail)
            .single();

          if (error || !user) {
            console.error('User not found for checkout session:', customerEmail);
            break;
          }

          const html = welcomeEmail({
            ownerName: user.owner_name || 'there',
            businessName: user.business_name || 'your business',
            twilioNumber: user.twilio_number || 'Assigning shortly',
            planName: user.plan || 'Starter',
          });

          try {
            await sendEmail(
              customerEmail,
              "Welcome to LeadCapture Pro — you're live 🎉",
              html
            );
            console.log('Welcome email sent to', customerEmail);
          } catch (err) {
            console.error('Welcome email failed:', err);
          }
        } else {
          console.error('No customer email on checkout session');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          const { data: users } = await supabaseAdmin
            .from('users')
            .select('id, email')
            .eq('stripe_customer_id', invoice.customer as string)
            .limit(1);
          const user = users?.[0];
          if (user) {
            await supabaseAdmin
              .from('users')
              .update({ subscription_status: 'past_due', updated_at: new Date().toISOString() })
              .eq('id', user.id);
            await sendPaymentFailedEmail(user.email);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.customer) {
          const { data: users } = await supabaseAdmin
            .from('users')
            .select('id, email')
            .eq('stripe_customer_id', sub.customer as string)
            .limit(1);
          const user = users?.[0];
          if (user) {
            await supabaseAdmin
              .from('users')
              .update({ subscription_status: 'canceled', tier: 'starter', updated_at: new Date().toISOString() })
              .eq('id', user.id);
            await sendAccountSuspendedEmail(user.email);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id;
        if (sub.customer && priceId) {
          const tier = planTierFromPriceId(priceId);
          const updateData: Record<string, unknown> = { tier, updated_at: new Date().toISOString() };
          if (sub.status === 'active') {
            updateData.subscription_status = 'active';
          }
          await supabaseAdmin
            .from('users')
            .update(updateData)
            .eq('stripe_customer_id', sub.customer as string);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          await supabaseAdmin
            .from('users')
            .update({ subscription_status: 'active', updated_at: new Date().toISOString() })
            .eq('stripe_customer_id', invoice.customer as string);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
