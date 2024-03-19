import Pricing from '@/components/ui/Pricing/Pricing';
import { testData } from '@/fixtures/testFixtures';

export default async function PricingPage() {

  return (
    <>
      <Pricing product={testData.product} prices={testData.prices} />
    </>
  );
}