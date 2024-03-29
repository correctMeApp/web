import { Product, Price, PricingPlanInterval, PricingType } from '@/app/types/models';

// Product fixture
const testProduct: Product = {
  id: "prod_PgLr25WCTxjaOK",
  active: true,
  description: null,
  name: "CorrectMe",
  image: null,
  metadata: null,
};

// Price fixtures
const testMonthlyPrice: Price = {
  id: "price_1Oqz9aD61ZIsxTUtbAtQONlG",
  active: true,
  currency: "usd",
  product_id: testProduct.id,
  unit_amount: 590,
  interval: PricingPlanInterval.Month,
  interval_count: 1,
  trial_period_days: 3,
  type: PricingType.Recurring,
};

const testYearlyPrice: Price = {
  id: "price_1Oqz9aD61ZIsxTUt3UiqACKb",
  active: true,
  currency: "usd",
  product_id: testProduct.id,
  unit_amount: 4990,
  interval: PricingPlanInterval.Year,
  interval_count: 1,
  trial_period_days: 3,
  type: PricingType.Recurring,
};

const testData = {
  product: testProduct,
  prices: [testMonthlyPrice, testYearlyPrice],
};

const product: Product = {
  id: "prod_PpJCon8qCQyvdi",
  active: true,
  description: "Subscription fee for Duck it!",
  name: "Duck it!",
  image: "https://files.stripe.com/links/MDB8YWNjdF8xT21OT25ENjFaSXN4VFV0fGZsX3Rlc3Rfb0VEazMwOVlxdG95OVpGaERCQjlHd25n00woHNXcBc",
  metadata: null,
};

const monthlyPrice: Price = {
  id: "price_1OzeaLD61ZIsxTUtCNxaomrT",
  active: true,
  currency: "usd",
  product_id: product.id,
  unit_amount: 490,
  interval: PricingPlanInterval.Month,
  interval_count: 1,
  trial_period_days: 3,
  type: PricingType.Recurring,
};

const yearlyPrice: Price = {
  id: "price_1OzeaLD61ZIsxTUtkt8O5tpR",
  active: true,
  currency: "usd",
  product_id: product.id,
  unit_amount: 4990,
  interval: PricingPlanInterval.Year,
  interval_count: 1,
  trial_period_days: 3,
  type: PricingType.Recurring,
};

const productionData = {
  product: product,
  prices: [monthlyPrice, yearlyPrice],
};

type ProductData = {
  product: Product,
  prices: Price[],
};

export let productData: ProductData | typeof productionData;

if (process.env.VERCEL_ENV === 'development') {
  productData = testData;
} else {
  // Replace 'productionData' with your actual production data
  productData = productionData;
}