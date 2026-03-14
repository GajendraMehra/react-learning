import ProductList from '../components/ProductList';

export default function ProductsPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-text mb-4">All Products</h1>
          <p className="text-text-muted mb-8">
            Explore our complete collection of products from the Fake Store API
          </p>
        </div>
      </div>

      <ProductList />
    </div>
  );
}