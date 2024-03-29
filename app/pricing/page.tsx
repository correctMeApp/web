import Pricing from '@/components/ui/Pricing/Pricing';
import { productData } from '@/fixtures/testFixtures';

export default async function PricingPage() {

  return (
    <>
      <Pricing product={productData.product} prices={productData.prices} />
    </>
  );
}