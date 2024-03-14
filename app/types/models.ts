// Customer model
export interface Customer {
  id: string;
  stripe_customer_id: string | null;
}

// Product model
export interface Product {
  active: boolean | null;
  description: string | null;
  id: string;
  image: string | null;
  metadata: JSON | null;
  name: string | null;
}

// Subscription model
export interface Subscription {
  cancel_at: string | null;
  cancel_at_period_end: boolean | null;
  canceled_at: string | null;
  created: string;
  current_period_end: string;
  current_period_start: string;
  ended_at: string | null;
  id: string;
  metadata: JSON | null;
  price_id: string | null;
  quantity: number | null;
  status: SubscriptionStatus | null;
  trial_end: string | null;
  trial_start: string | null;
  user_id: string;
}

// Price model
export interface Price {
  active: boolean | null;
  currency: string | null;
  id: string;
  interval: PricingPlanInterval | null;
  interval_count: number | null;
  product_id: string | null;
  trial_period_days: number | null;
  type: PricingType | null;
  unit_amount: number | null;
}

// User model
export interface User {
  avatar_url: string | null;
  billing_address: JSON | null;
  id: string;
  name: string;
  email: string;
  provider: string;
  payment_method: JSON | null;
  subscriptionType: UserSubscriptionInfo;
  stripeCustomerId: string | null;
}

export interface UserSubscriptionInfo {
  type: UserType;
  expirationDate: string | null;
  remainingUsage: number;
  _id: string;
}

// Enums
export enum PricingPlanInterval {
  Month = 'month',
  Year = 'year'
}

export enum PricingType {
  OneTime = 'one_time',
  Recurring = 'recurring'
}

export enum SubscriptionStatus {
  Trialing = 'trialing',
  Active = 'active',
  Canceled = 'canceled',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  PastDue = 'past_due',
  Unpaid = 'unpaid',
  Paused = 'paused'
}

export enum UserType {
  ADMIN = 'ADMIN',
  TRIAL = 'TRIAL',
  PAID = 'PAID',
  // Add other user types here
}