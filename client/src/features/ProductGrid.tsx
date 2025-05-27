import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetProductsQuery } from '@/queries/product.queries';

interface ProductCardProps {
  name: string;
  tier: string;
  price: string;
}

const ProductCard = ({ name, tier, price }: ProductCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Product Image Placeholder */}
      <div className="aspect-square border-b border-gray-200 bg-gray-50 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full relative">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-300 rotate-45 origin-top-left transform translate-y-[50%]"></div>
            <div className="absolute top-0 right-0 w-full h-0.5 bg-gray-300 -rotate-45 origin-top-right transform translate-y-[50%]"></div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{tier}</p>
            <p className="text-sm font-medium text-gray-900">{price}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = () => {
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: 'Name',
    tier: 'Tier',
    price: '0:00 ETH',
  }));

  const { data: productDataList, isError, error } = useGetProductsQuery();

  console.log('productDataList', productDataList);

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              tier={product.tier}
              price={product.price}
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button variant="outline" className="px-8 border-gray-300">
            View More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
