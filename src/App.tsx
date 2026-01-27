import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FunnelView from './pages/FunnelView';
import PaymentView from './pages/PaymentView'; // Implement similar to Vue
import OrderView from './pages/OrderView';     // Implement similar to Vue
import { LanguageProvider } from './context/LanguageContext';
import { FunnelProvider } from './context/FunnelContext';

function App() {
  return (
    <LanguageProvider>
      <FunnelProvider>
        <BrowserRouter>
           <div className="max-w-md mx-auto bg-background min-h-screen shadow-2xl relative overflow-hidden font-sans">
              <Routes>
                <Route path="/" element={<FunnelView />} />
                <Route path="/payment/:orderId" element={<PaymentView />} />
                <Route path="/order" element={<OrderView />} />
              </Routes>
           </div>
        </BrowserRouter>
      </FunnelProvider>
    </LanguageProvider>
  );
}

export default App;