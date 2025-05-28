import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';
import type { Product } from '@/types/product';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ETH`;
  };

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
        {/* Favorite Badge */}
        {product.isFavorite && (
          <div className="absolute top-2 right-2">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900">{product.title}</h3>
            <p className="text-sm text-gray-600">{product.tier}</p>
            <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
              <span>{product.theme}</span>
            </div>
            <div className="text-xs text-gray-600">
              by {product.author.firstName} {product.author.lastName}
            </div>
            {product.createdAt && (
              <div className="text-xs text-gray-500">Created: {formatDate(product.createdAt)}</div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
