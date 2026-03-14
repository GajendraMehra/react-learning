import { useProducts } from '../hooks/useProducts';
import { useLocation } from 'react-router-dom';
import type { Product } from '../types';

const formatPrice = (price: number) => price.toFixed(2);

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
    <div className="relative h-48 bg-input">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-contain p-4"
      />
    </div>
    <div className="p-4">
      <h3 className="font-bold text-text text-sm mb-2 line-clamp-2">{product.title}</h3>
      <p className="text-text-muted text-xs mb-2 line-clamp-3">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-primary text-lg">${formatPrice(product.price)}</span>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          <span className="text-text-muted text-xs">{product.rating.rate} ({product.rating.count})</span>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-text-muted text-xs bg-input px-2 py-1 rounded-full">
          {product.category}
        </span>
      </div>
    </div>
  </div>
);

export default function ProductList() {
  const { data: products, isLoading, error } = useProducts();
  const location = useLocation();

  // Show all products on products page, limited on home page
  const isProductsPage = location.pathname === '/products';
  const displayProducts = isProductsPage ? products : products?.slice(0, 8);
  const title = isProductsPage ? '' : 'Featured Products from Fake Store API';

  if (isLoading) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {title && <h2 className="text-2xl font-bold text-text mb-6">{title}</h2>}
          <div className="flex flex-col items-center justify-center h-40 gap-4">
            <div className="w-8 h-8 border-4 border-input border-t-primary rounded-full animate-spin"></div>
            <div className="text-text-muted text-sm font-medium">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {title && <h2 className="text-2xl font-bold text-text mb-6">{title}</h2>}
          <div className="text-center p-6 bg-surface rounded-lg border border-border">
            <p className="text-error">Failed to load products. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {title && <h2 className="text-2xl font-bold text-text mb-6">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayProducts?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};