import { pgTable, text, timestamp, boolean, integer, decimal, varchar, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  businessName: varchar('business_name', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  tier: varchar('tier', { length: 50 }).default('basic').notNull(), // basic, pro, elite
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('trial'), // trial, active, canceled, past_due
  trialEndsAt: timestamp('trial_ends_at'),
  billingCycleStart: timestamp('billing_cycle_start'),
  billingCycleEnd: timestamp('billing_cycle_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Phone numbers assigned to users
export const phoneNumbers = pgTable('phone_numbers', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  twilioPhoneNumber: varchar('twilio_phone_number', { length: 20 }).notNull(),
  twilioSid: varchar('twilio_sid', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Calls received
export const calls = pgTable('calls', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  phoneNumberId: text('phone_number_id').notNull().references(() => phoneNumbers.id, { onDelete: 'cascade' }),
  callerNumber: varchar('caller_number', { length: 20 }).notNull(),
  callerName: varchar('caller_name', { length: 255 }),
  duration: integer('duration').default(0), // in seconds
  recordingUrl: text('recording_url'),
  transcriptText: text('transcript_text'),
  missedCall: boolean('missed_call').default(true).notNull(),
  smsNotificationSent: boolean('sms_notification_sent').default(false).notNull(),
  leadCaptured: boolean('lead_captured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Leads captured from missed calls
export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  callId: text('call_id').references(() => calls.id, { onDelete: 'set null' }),
  callerName: varchar('caller_name', { length: 255 }).notNull(),
  callerPhone: varchar('caller_phone', { length: 20 }).notNull(),
  callerEmail: varchar('caller_email', { length: 255 }),
  serviceNeeded: text('service_needed'),
  urgency: varchar('urgency', { length: 50 }), // low, medium, high
  status: varchar('status', { length: 50 }).default('new'), // new, contacted, qualified, lost, converted
  notes: text('notes'),
  formData: jsonb('form_data'), // Store all form responses
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// SMS templates
export const smsTemplates = pgTable('sms_templates', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  templateType: varchar('template_type', { length: 50 }).notNull(), // basic_missed_call, pro_lead_form, etc
  content: text('content').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Team members
export const teamMembers = pgTable('team_members', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('member'), // admin, member
  inviteToken: varchar('invite_token', { length: 255 }),
  inviteAccepted: boolean('invite_accepted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Subscription history for tracking
export const subscriptionHistory = pgTable('subscription_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fromTier: varchar('from_tier', { length: 50 }),
  toTier: varchar('to_tier', { length: 50 }).notNull(),
  stripeEventId: varchar('stripe_event_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  phoneNumbers: many(phoneNumbers),
  calls: many(calls),
  leads: many(leads),
  smsTemplates: many(smsTemplates),
  teamMembers: many(teamMembers),
  subscriptionHistory: many(subscriptionHistory),
}));

export const phoneNumbersRelations = relations(phoneNumbers, ({ one, many }) => ({
  user: one(users, {
    fields: [phoneNumbers.userId],
    references: [users.id],
  }),
  calls: many(calls),
}));

export const callsRelations = relations(calls, ({ one, many }) => ({
  user: one(users, {
    fields: [calls.userId],
    references: [users.id],
  }),
  phoneNumber: one(phoneNumbers, {
    fields: [calls.phoneNumberId],
    references: [phoneNumbers.id],
  }),
  lead: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  user: one(users, {
    fields: [leads.userId],
    references: [users.id],
  }),
  call: one(calls, {
    fields: [leads.callId],
    references: [calls.id],
  }),
}));
