import { createContext, useContext, useState, type ReactNode } from 'react';

type Locale = 'en' | 'mm';

interface LanguageContextType {
  locale: Locale;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const messages: Record<Locale, Record<string, string>> = {
  en: {
    LOADING_TEXT: 'Loading Please Wait ...',
    BUTTON_CHECKOUT: 'Checkout',
    BUTTON_SAVE: 'Save QR',
    BUTTON_PRINT: 'Print Receipt',
    BUTTON_BACK: "Go Back",
    FUNNEL_PG_TITLE_00: 'Selected Items',
    FUNNEL_PG_TITLE_01: 'Customer Information',
    FUNNEL_PG_TITLE_02: 'Contact Us',
    FUNNEL_PG_LABEL_00: 'Full Name',
    FUNNEL_PG_LABEL_01: 'Phone Number',
    FUNNEL_PG_LABEL_02: 'Delivery Address',
    FUNNEL_PG_LABEL_03: 'Total',
    PAYMENT_PG_TITLE_01: 'Please Complete Payment In 5 Minutes',
    PAYMENT_PG_TITLE_02: 'Scan With Your MMQR Supported Wallet Or Banking Application',
    PAYMENT_PG_LABEL_01: 'Order ID',
    PAYMENT_PG_LABEL_02: 'Amount',
    PAYMENT_TIMEOUT_TITLE: "Payment Expired",
    PAYMENT_TIMEOUT_MSG: "The payment window has closed. Please try placing the order again.",
    SUCCESS_PG_TEXT_00: 'Payment Successful',
    SUCCESS_PG_TEXT_01: 'Thank you for your purchase',
    SUCCESS_PG_TITLE_00: 'Transaction Receipt',
    SUCCESS_PG_TITLE_01: 'Items',
    SUCCESS_PG_TITLE_02: 'Delivery',
    SUCCESS_PG_LABEL_00: 'Order ID',
    SUCCESS_PG_LABEL_01: 'Date',
    SUCCESS_PG_LABEL_02: 'Status',
    SUCCESS_PG_LABEL_03: 'Total Paid',
    SUCCESS_PG_LABEL_04: 'Name',
    SUCCESS_PG_LABEL_05: 'Phone',
    SUCCESS_PG_LABEL_06: 'Address',
  },
  mm: {
    LOADING_TEXT: 'ခဏစောင့်ပေးပါ...',
    BUTTON_CHECKOUT: 'ငွေပေးချေမည်',
    BUTTON_SAVE: 'QR သိမ်းဆည်းမည်',
    BUTTON_PRINT: 'ဘောက်ချာထုတ်မည်',
    BUTTON_BACK: "ပြန်သွားမည်",
    FUNNEL_PG_TITLE_00: 'ရွေးချယ်ထားသော ပစ္စည်းများ',
    FUNNEL_PG_TITLE_01: 'ဝယ်ယူသူ အချက်အလက်',
    FUNNEL_PG_TITLE_02: 'ဆက်သွယ်ရန်',
    FUNNEL_PG_LABEL_00: 'အမည် အပြည့်အစုံ',
    FUNNEL_PG_LABEL_01: 'ဖုန်းနံပါတ်',
    FUNNEL_PG_LABEL_02: 'ပို့ဆောင်ရမည့် လိပ်စာ',
    FUNNEL_PG_LABEL_03: 'စုစုပေါင်း',
    PAYMENT_PG_TITLE_01: 'ကျေးဇူးပြု၍ ၅ မိနစ်အတွင်း ငွေပေးချေမှုကို အပြီးသတ်ပေးပါ',
    PAYMENT_PG_TITLE_02: 'MMQR ဖြင့် Scan ဖတ်၍ ငွေပေးချေနိုင်ပါသည်',
    PAYMENT_PG_LABEL_01: 'အော်ဒါအမှတ်',
    PAYMENT_PG_LABEL_02: 'ကျသင့်ငွေ',
    PAYMENT_TIMEOUT_TITLE: "သတ်မှတ်ချိန် ကုန်သွားပါပြီ",
    PAYMENT_TIMEOUT_MSG: "ငွေပေးချေရန် သတ်မှတ်ချိန် ကုန်ဆုံးသွားပါသဖြင့် အော်ဒါပြန်လည်တင်ပေးပါ။",
    SUCCESS_PG_TEXT_00: 'ငွေပေးချေမှု အောင်မြင်ပါသည်',
    SUCCESS_PG_TEXT_01: 'ဝယ်ယူအားပေးမှုကို အထူးကျေးဇူးတင်ရှိပါသည်',
    SUCCESS_PG_TITLE_00: 'ငွေရပြေစာ (ဘောက်ချာ)',
    SUCCESS_PG_TITLE_01: 'ပစ္စည်းများ',
    SUCCESS_PG_TITLE_02: 'ပို့ဆောင်မှု',
    SUCCESS_PG_LABEL_00: 'အော်ဒါအမှတ်',
    SUCCESS_PG_LABEL_01: 'နေ့စွဲ',
    SUCCESS_PG_LABEL_02: 'အခြေအနေ',
    SUCCESS_PG_LABEL_03: 'ပေးချေပြီး စုစုပေါင်း',
    SUCCESS_PG_LABEL_04: 'အမည်',
    SUCCESS_PG_LABEL_05: 'ဖုန်းနံပါတ်',
    SUCCESS_PG_LABEL_06: 'လိပ်စာ',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('lang') as Locale) || 'mm');

  const toggleLang = () => {
    const newLang = locale === 'en' ? 'mm' : 'en';
    setLocale(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key: string) => messages[locale][key] || key;

  return (
    <LanguageContext.Provider value={{ locale, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};