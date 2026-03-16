import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FunnelView from './pages/FunnelView';
import ProductsPage from './pages/ProductsPage';
import PaymentView from './pages/PaymentView'; // Implement similar to Vue
import OrderView from './pages/OrderView';     // Implement similar to Vue
import Navigation from './components/Navigation';
import { LanguageProvider } from './context/LanguageContext';
import { FunnelProvider } from './context/FunnelContext';
import OfferView from './pages/OfferView';
import NotFound from './pages/NotFound';
import AuthView from './pages/AuthView';
import CartView from './pages/CartView';

function App() {
  return (
    <LanguageProvider>
      <FunnelProvider>
        <BrowserRouter>
          <div className="w-full bg-background min-h-screen relative font-sans">
            <Navigation />

            {/* Main Content with responsive padding */}
            <div className="lg:pl-64">
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<FunnelView />} />
                <Route path="/offer" element={<OfferView />} />
                <Route path="/sign-in" element={<AuthView />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/payment/:orderId" element={<PaymentView />} />
                <Route path="/order" element={<OrderView />} />
                <Route path="/cart" element={<CartView />} />


              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </FunnelProvider>
    </LanguageProvider>
  );
}

export default App;