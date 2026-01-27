import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import HeaderComp from '../components/HeaderComp';
import { useFunnel } from '../context/FunnelContext';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/api.service';

const formatPrice = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function PaymentView() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { loadOrderContext, shopData, currentOrder } = useFunnel();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  // Refs for intervals to clear them easily
  const timerRef = useRef<number | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const init = async () => {
      try {
        const order = await loadOrderContext(orderId);
        
        // If already paid, go to receipt
        if (order.status === 'SUCCESS') {
          navigate(`/order?orderId=${orderId}`);
          return;
        }

        // Generate QR
        if (order.payQr) {
          const url = await QRCode.toDataURL(order.payQr, { width: 300, margin: 1 });
          setQrDataUrl(url);
          startTimers();
        }
        setLoading(false);
      } catch (e) {
        handleTimeout();
      }
    };

    init();

    return () => stopTimers();
  }, [orderId]);

  const startTimers = () => {
    // 1. Countdown Timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Polling for Status
    pollRef.current = window.setInterval(async () => {
      if (!orderId) return;
      try {
        const res = await apiService.pollOrder(orderId);
        if (res.status === 'SUCCESS') {
          stopTimers();
          navigate(`/order?orderId=${orderId}`);
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);
  };

  const stopTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const handleTimeout = () => {
    stopTimers();
    setShowTimeoutModal(true);
  };

  const formattedTime = () => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `QR-${orderId}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  if (loading || !currentOrder) return null;

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <HeaderComp 
        title={shopData?.businessName || 'Checkout'} 
        isVerified={shopData?.kycStatus === 'APPROVED'} 
      />

      <div className="flex-1 p-6 flex flex-col gap-5 animate-[fadeIn_0.5s_ease-out]">
        
        {/* Timer Card */}
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm text-center">
          <div className="text-4xl font-mono font-bold text-primary mb-1 tracking-wider">
            {formattedTime()}
          </div>
          <div className="text-xs font-bold text-text-muted uppercase">
            {t('PAYMENT_PG_TITLE_01')}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-border border-dashed pb-3">
            <span className="text-sm text-text-muted">{t('PAYMENT_PG_LABEL_01')}</span>
            <span className="text-sm font-mono font-bold text-text">{orderId}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm text-text-muted">{t('PAYMENT_PG_LABEL_02')}</span>
            <span className="text-lg font-bold text-primary">
              MMK {formatPrice(currentOrder.grandTotal)}
            </span>
          </div>
        </div>

        {/* QR Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg flex flex-col items-center gap-4">
          <div className="flex justify-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/MMQR_Logo.svg/1566px-MMQR_Logo.svg.png" 
              className="h-8 object-contain" 
              alt="MMQR"
            />
          </div>
          <div className="w-full aspect-square bg-white p-2">
            <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
          </div>
          <div className="text-center text-xs font-medium text-gray-500">
            {t('PAYMENT_PG_TITLE_02')}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <button 
            className="bg-text text-background w-full py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            onClick={downloadQR}
          >
            {t('BUTTON_SAVE')}
          </button>
        </div>
      </div>

      {/* Timeout Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-surface border border-border w-full max-w-xs rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-text mb-2">{t('PAYMENT_TIMEOUT_TITLE')}</h3>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">{t('PAYMENT_TIMEOUT_MSG')}</p>
            <button 
              className="w-full py-3 bg-text text-background font-bold rounded-lg active:scale-95 transition-transform"
              onClick={() => navigate(-1)}
            >
              {t('BUTTON_BACK')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}