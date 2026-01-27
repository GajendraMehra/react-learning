import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx'; // Optional: Use clsx or just template literals
import HeaderComp from '../components/HeaderComp';
import { useFunnel } from '../context/FunnelContext';
import { useLanguage } from '../context/LanguageContext';

const formatPrice = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const formatDate = (dateString?: string) => {
  if (!dateString) return new Date().toLocaleDateString();
  return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function OrderView() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  
  const { loadOrderContext, shopData, currentOrder } = useFunnel();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    
    const init = async () => {
        try {
            const order = await loadOrderContext(orderId);
            // Redirect back to payment if pending and MMQR
            if (order.paySetting === 'MMQR' && order.status === 'PENDING') {
                navigate(`/payment/${orderId}`);
                return;
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };
    init();
  }, [orderId]);

  const statusLabel = useMemo(() => {
    if (currentOrder?.paySetting === 'COD') return 'COD';
    return 'PAID';
  }, [currentOrder]);

  const statusClass = useMemo(() => {
    if (currentOrder?.paySetting === 'COD') return 'text-warning bg-warning/10 border-warning/20';
    return 'text-success bg-success/10 border-success/20';
  }, [currentOrder]);

  const captureReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-20 print:hidden h-screen bg-background">
            <div className="w-8 h-8 border-4 border-input border-t-primary rounded-full animate-spin mb-2"></div>
            <div className="text-sm font-medium text-text-muted">{t('LOADING_TEXT')}</div>
        </div>
    );
  }

  if (!currentOrder) return null;

  return (
    <div className="bg-background min-h-screen print:bg-white print:text-black print:p-0 print:h-auto">
      <div className="print:hidden">
         <HeaderComp 
            title={shopData?.businessName || 'My Orders'} 
            isVerified={shopData?.kycStatus === 'APPROVED'} 
         />
      </div>

      <div className="p-5 flex flex-col gap-4 animate-[fadeIn_0.5s_ease-out]" id="receipt-area">

        {/* Print Only Header */}
        <div className="hidden print:block text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-2xl font-black uppercase m-0">{shopData?.businessName}</h1>
          <p className="text-xs uppercase mt-1">Official Receipt</p>
        </div>

        <div className="text-center text-[10px] text-text-muted uppercase tracking-wider print:hidden">
          {t('SUCCESS_PG_TEXT_02')}
        </div>

        <div className="text-center mb-4 print:hidden">
          <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center text-3xl mx-auto mb-3">✓</div>
          <h2 className="text-xl font-bold text-text mb-1">{t('SUCCESS_PG_TEXT_00')}</h2>
          <p className="text-sm text-text-muted">{t('SUCCESS_PG_TEXT_01')}</p>
        </div>

        {/* Main Receipt Card */}
        <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border print:border-none print:shadow-none print:p-0 print:rounded-none print:border-b print:border-dashed print:border-black print:mb-4">
          <div className="text-xs font-bold text-text uppercase mb-4 print:text-black">
             {t('SUCCESS_PG_TITLE_00')}
          </div>
          
          <div className="flex justify-between py-2 border-b border-dashed border-border print:border-gray-300">
            <span className="text-sm text-text-muted print:text-black">{t('SUCCESS_PG_LABEL_00')}</span>
            <span className="text-sm font-mono text-text print:text-black">{currentOrder.orderId}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-dashed border-border print:border-gray-300">
            <span className="text-sm text-text-muted print:text-black">{t('SUCCESS_PG_LABEL_01')}</span>
            <span className="text-sm font-medium text-text print:text-black">{formatDate(currentOrder.createdAt)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-dashed border-border print:border-gray-300">
            <span className="text-sm text-text-muted print:text-black">{t('SUCCESS_PG_LABEL_02')}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border print:border-black print:text-black print:bg-transparent ${statusClass}`}>
              {statusLabel}
            </span>
          </div>

          <div className="flex justify-between pt-3 mt-1">
            <span className="text-base font-bold text-text print:text-black">{t('SUCCESS_PG_LABEL_03')}</span>
            <span className="text-lg font-bold text-primary print:text-black">
              MMK {formatPrice(currentOrder.grandTotal)}
            </span>
          </div>
        </div>

        {/* Items Card */}
        <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border print:border-none print:shadow-none print:p-0 print:rounded-none print:border-b print:border-dashed print:border-black print:mb-4">
          <div className="text-xs font-bold text-text uppercase mb-3 print:text-black">
            {t('SUCCESS_PG_TITLE_01')}
          </div>
          {currentOrder.cartItems.map((item:any) => (
            <div key={item.itemCode} className="flex justify-between py-2 text-sm">
              <span className="text-text font-medium print:text-black">
                {item.itemName}
                <small className="text-text-muted ml-1 print:text-gray-600">x{item.qty}</small>
              </span>
              <span className="text-text font-bold print:text-black">
                MMK {formatPrice(item.total)}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery Info */}
        <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border print:border-none print:shadow-none print:p-0">
          <div className="text-xs font-bold text-text uppercase mb-3 print:text-black">
             {t('SUCCESS_PG_TITLE_02')}
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-text-muted print:text-black">{t('SUCCESS_PG_LABEL_04')}</span>
            <span className="text-sm font-medium text-text print:text-black">{currentOrder.customerName}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-sm text-text-muted print:text-black">{t('SUCCESS_PG_LABEL_05')}</span>
            <span className="text-sm font-medium text-text print:text-black">{currentOrder.customerPhone}</span>
          </div>
          <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-border border-dashed print:border-gray-300">
            <span className="text-sm text-text-muted print:text-black">{t('SUCCESS_PG_LABEL_06')}</span>
            <span className="text-sm font-medium text-text print:text-black text-left">
              {currentOrder.customerAddress}
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-text-muted mt-2 print:hidden">
            အော်ဒါအတည်ပြုခြင်းပြေစာ ကို SMS ဖြင့်ပို့ထားပါသည်။
        </div>

        {/* Print Only Footer */}
        <div className="hidden print:block text-center text-[10px] mt-8">
           <p>Thank you for shopping with {shopData?.businessName}!</p>
           <p>Powered by MyanMyanPay</p>
        </div>

        <div className="flex justify-center mt-6 print:hidden pb-10">
          <button 
            className="bg-text text-background w-full py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            onClick={captureReceipt}
          >
            {t('BUTTON_PRINT')}
          </button>
        </div>
      </div>
    </div>
  );
}