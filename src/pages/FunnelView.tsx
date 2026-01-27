import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import HeaderComp from '../components/HeaderComp';
import { useFunnel } from '../context/FunnelContext';
import { useLanguage } from '../context/LanguageContext';
import { configuration } from '../configuration';

const formatPrice = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function FunnelView() {
  const navigate = useNavigate();
  const { initFunnel, shopData, loading, cart, cartTotal, updateQty, userInfo, setUserInfo, submitOrder, cartItems } = useFunnel();
  const { t, locale } = useLanguage();
  
  const [paymentMethod, setPaymentMethod] = useState<'MMQR' | 'COD'>('MMQR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    if (configuration.APP_NAMESPACE) {
      initFunnel(configuration.APP_NAMESPACE);
    }
  }, []);

  const handleCheckout = async () => {
    const newErrors = { name: '', phone: '', address: '' };
    let hasError = false;
    if (!userInfo.name) { newErrors.name = 'Required'; hasError = true; }
    if (!userInfo.phone) { newErrors.phone = 'Required'; hasError = true; }
    if (!userInfo.address) { newErrors.address = 'Required'; hasError = true; }
    setErrors(newErrors);

    if (hasError) return;
    if (cartTotal === 0) {
        alert(t('FUNNEL_PG_TITLE_00') + " is empty");
        return;
    }

    setIsSubmitting(true);
    try {
      const order = await submitOrder(paymentMethod);
      if (order) {
         if (paymentMethod === 'MMQR') navigate(`/payment/${order.orderId}`);
         else navigate(`/order?orderId=${order.orderId}`);
      }
    } catch (e) {
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMethodAvailable = (method: string) => {
    if (method === 'MMQR') return true;
    if (!shopData?.data?.paySetting) return false;
    return shopData.data.paySetting.includes(method.toLowerCase());
  };

  const handleInputChange = (field: keyof typeof userInfo, value: string) => {
      setUserInfo({ ...userInfo, [field]: value });
      if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  if (loading && !shopData) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="w-8 h-8 border-4 border-input border-t-primary rounded-full animate-spin"></div>
        <div className="text-text-muted text-sm font-medium">{t('LOADING_TEXT')}</div>
      </div>
    );
  }

  if (!shopData) return null;

  return (
    <div className="pb-40 bg-background min-h-screen">
       {isSubmitting && (
         <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/50 dark:bg-black/70 backdrop-blur-md">
            <div className="w-10 h-10 border-4 border-input border-t-primary rounded-full animate-spin"></div>
         </div>
       )}

       <HeaderComp title={shopData.businessName} isVerified={shopData.kycStatus === 'APPROVED'} />

       <div className="px-5 py-6 text-sm text-text-muted leading-relaxed">{shopData.description}</div>

       <div className="flex flex-col gap-4 px-4">
          {shopData.data.items.map((item) => (
             <div key={item.itemCode} className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden flex flex-row h-32">
                <div className="relative w-32 min-w-[128px] bg-input h-full">
                   {item.itemOriginPrice && item.itemOriginPrice > item.itemPrice && (
                     <div className="absolute top-2 left-2 bg-error text-white px-2 py-1 rounded-md text-[10px] font-bold z-10">SALE</div>
                   )}
                   <img src={item.itemImage} alt={item.itemName} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex flex-col flex-1 justify-between">
                   <div>
                      <div className="font-bold text-text text-sm mb-1 leading-tight line-clamp-2">{item.itemName}</div>
                   </div>
                   <div className="flex flex-col gap-2 mt-auto">
                      <div className="font-bold text-text text-lg">{formatPrice(item.itemPrice)} Ks</div>
                      <div className="flex items-center justify-between bg-input rounded-lg p-1">
                         <button className="w-8 h-8 flex items-center justify-center bg-surface rounded shadow-sm text-text font-bold active:scale-95 text-lg" 
                           onClick={() => updateQty(item.itemCode, -1)}>−</button>
                         <span className="text-sm font-bold text-text">{cart[String(item.itemCode)] || 0}</span>
                         <button className="w-8 h-8 flex items-center justify-center bg-surface rounded shadow-sm text-text font-bold active:scale-95 text-lg" 
                           onClick={() => updateQty(item.itemCode, 1)}>+</button>
                      </div>
                   </div>
                </div>
             </div>
          ))}
       </div>
       
       {cartTotal > 0 && (
          <div className="px-5 mt-6">
             <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{t('FUNNEL_PG_TITLE_00')}</div>
             <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2">
                {cartItems.map(item => (
                   <div key={item.itemCode} className="flex justify-between text-sm">
                      <span className="text-text font-medium truncate max-w-[200px]">{item.itemName}</span>
                      <span className="font-bold text-text">{formatPrice(item.total)} Ks</span>
                   </div>
                ))}
             </div>
          </div>
       )}

       <div className="px-5 mt-6">
            <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3"> 
                {locale === 'en' ? 'Payment Method' : 'ငွေပေးချေမှု နည်းလမ်း'} 
            </div>
            <div className="grid grid-cols-1 gap-3">
                <div 
                  className={clsx(
                    "border rounded-2xl p-4 cursor-pointer flex items-center gap-4 transition-all duration-200 active:scale-95",
                    paymentMethod === 'MMQR' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'border-border bg-surface text-text-muted'
                  )}
                  onClick={() => setPaymentMethod('MMQR')}
                >
                    <div className={clsx("w-5 h-5 rounded-full border flex items-center justify-center", paymentMethod === 'MMQR' ? 'border-primary' : 'border-border')}>
                        {paymentMethod === 'MMQR' && <div className="w-3 h-3 bg-primary rounded-full" />}
                    </div>
                    <div className="font-bold text-sm">MMQR (KBZPay, KPay, AYA...)</div>
                </div>

                <div 
                  className={clsx(
                    "border rounded-2xl p-4 relative overflow-hidden flex items-center gap-4 transition-all duration-200",
                    paymentMethod === 'COD' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'border-border bg-surface text-text-muted',
                    !isMethodAvailable('COD') ? 'opacity-60 grayscale pointer-events-none' : 'cursor-pointer active:scale-95'
                  )}
                  onClick={() => isMethodAvailable('COD') && setPaymentMethod('COD')}
                >
                     <div className={clsx("w-5 h-5 rounded-full border flex items-center justify-center", paymentMethod === 'COD' ? 'border-primary' : 'border-border')}>
                        {paymentMethod === 'COD' && <div className="w-3 h-3 bg-primary rounded-full" />}
                    </div>
                    <div className="font-bold text-sm">{locale === 'en' ? 'Cash on Delivery' : 'ပစ္စည်းရောက်ငွေချေ'}</div>
                    {!isMethodAvailable('COD') && (
                       <div className="ml-auto bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-md">Unavailable</div>
                    )}
                </div>
            </div>
        </div>

       <div className="px-5 mt-6">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{t('FUNNEL_PG_TITLE_01')}</div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text ml-1">{t('FUNNEL_PG_LABEL_00')}</label>
              <input 
                value={userInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                type="text" 
                className={clsx(
                    "w-full bg-input border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all text-text",
                    errors.name ? 'border-error ring-1 ring-error' : 'border-border'
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text ml-1">{t('FUNNEL_PG_LABEL_01')}</label>
              <input 
                value={userInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                type="tel" 
                className={clsx(
                    "w-full bg-input border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all text-text",
                    errors.phone ? 'border-error ring-1 ring-error' : 'border-border'
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text ml-1">{t('FUNNEL_PG_LABEL_02')}</label>
              <textarea 
                value={userInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className={clsx(
                    "w-full bg-input border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-text",
                    errors.address ? 'border-error ring-1 ring-error' : 'border-border'
                )}
              ></textarea>
            </div>
          </div>
       </div>
       
       <div className="fixed bottom-0 left-0 w-full z-30 flex justify-center pointer-events-none">
         <div className="w-full max-w-md bg-surface/90 backdrop-blur-lg border-t border-border p-4 flex items-center justify-between pointer-events-auto shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
           <div className="flex flex-col">
             <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('FUNNEL_PG_LABEL_03')}</span>
             <span className="text-xl font-bold text-primary">{formatPrice(cartTotal)} Ks</span>
           </div>
           <button 
             className="bg-text text-background px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
             onClick={handleCheckout}
             disabled={isSubmitting || loading}
           >
             {isSubmitting ? 'Processing...' : t('BUTTON_CHECKOUT')}
           </button>
         </div>
       </div>

    </div>
  );
}