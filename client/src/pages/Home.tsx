import FilterSection from '@/features/FilterSection';
import FooterSection from '@/features/FooterSection';
import HeaderSection from '@/features/HeaderSection';
import ProductGrid from '@/features/ProductGrid';
import { FilterProvider } from '@/contexts/FilterContext';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      <FilterProvider>
        <FilterSection>
          <ProductGrid />
        </FilterSection>
      </FilterProvider>
      <FooterSection />
    </div>
  );
};

export default HomePage;
