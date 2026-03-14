import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FunnelView from './pages/FunnelView';
import ProductsPage from './pages/ProductsPage';
import PaymentView from './pages/PaymentView'; // Implement similar to Vue
import OrderView from './pages/OrderView';     // Implement similar to Vue
import Navigation from './components/Navigation';
import { LanguageProvider } from './context/LanguageContext';
import { FunnelProvider } from './context/FunnelContext';

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
                  <Route path="/" element={<FunnelView />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/payment/:orderId" element={<PaymentView />} />
                  <Route path="/order" element={<OrderView />} />
                </Routes>
              </div>
           </div>
        </BrowserRouter>
      </FunnelProvider>
    </LanguageProvider>
  );
}

export default App;