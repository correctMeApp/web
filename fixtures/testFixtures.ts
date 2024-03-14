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
  trial_period_days: null,
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
  trial_period_days: null,
  type: PricingType.Recurring,
};

export const testData = {
  product: testProduct,
  prices: [testMonthlyPrice, testYearlyPrice],
};