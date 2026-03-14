import { useEffect } from 'react';
import HeaderComp from '../components/HeaderComp';
import ProductList from '../components/ProductList';
import { useFunnel } from '../context/FunnelContext';
import { configuration } from '../configuration';

export default function FunnelView() {
  const { initFunnel, shopData, loading } = useFunnel();

  useEffect(() => {
    if (configuration.APP_NAMESPACE) {
      initFunnel(configuration.APP_NAMESPACE);
    }
  }, []);

  if (loading && !shopData) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="w-8 h-8 border-4 border-input border-t-primary rounded-full animate-spin"></div>
        <div className="text-text-muted text-sm font-medium">Loading...</div>
      </div>
    );
  }

  if (!shopData) return null;

  return (
    <div className="bg-background min-h-screen">
       <HeaderComp title={shopData.businessName} isVerified={shopData.kycStatus === 'APPROVED'} />

       <div className="px-6 py-6 text-sm text-text-muted leading-relaxed max-w-7xl mx-auto">{shopData.description}</div>

       <ProductList />

    </div>
  );
}