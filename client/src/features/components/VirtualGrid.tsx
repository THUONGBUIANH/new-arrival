import type { Product } from '@/types/product';
import { useCallback } from 'react';
import { AutoSizer, List as VirtualList, WindowScroller } from 'react-virtualized';
import ProductCard from './ProductCard';

const VirtualGrid = ({ products }: { products: Product[] }) => {
  const ITEMS_PER_ROW = 4;
  const ROW_HEIGHT = 420;

  const rowRenderer = useCallback(
    ({ index, key, style }: any) => {
      const startIndex = index * ITEMS_PER_ROW;
      const rowProducts = products.slice(startIndex, startIndex + ITEMS_PER_ROW);

      return (
        <div key={key} style={style} className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rowProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      );
    },
    [products]
  );

  const rowCount = Math.ceil(products.length / ITEMS_PER_ROW);

  return (
    <div className="mb-8">
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <VirtualList
                autoHeight
                height={height}
                width={width}
                rowCount={rowCount}
                rowHeight={ROW_HEIGHT}
                rowRenderer={rowRenderer}
                overscanRowCount={2}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                style={{
                  outline: 'none',
                }}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </div>
  );
};

export default VirtualGrid;
