import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { apiService } from '../services/api.service';
import type { ShopDetails, CartItem, OrderResponse, OrderRequest } from '../types';

interface UserInfo {
  name: string;
  phone: string;
  address: string;
}

interface FunnelContextType {
  shopData: ShopDetails | null;
  cart: Record<string, number>;
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  loading: boolean;
  cartItems: CartItem[];
  cartTotal: number;
  currentOrder: OrderResponse | null;
  initFunnel: (permaLink: string) => Promise<void>;
  updateQty: (itemCode: string, delta: number) => void;
  submitOrder: (paySetting: 'MMQR' | 'COD') => Promise<OrderResponse | null>;
  loadOrderContext: (orderId: string) => Promise<OrderResponse>;
}

const FunnelContext = createContext<FunnelContextType | undefined>(undefined);

export const FunnelProvider = ({ children }: { children: ReactNode }) => {
  const [shopData, setShopData] = useState<ShopDetails | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [currentOrder, setCurrentOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    const saved = localStorage.getItem('user_cache');
    return saved ? JSON.parse(saved) : { name: '', phone: '', address: '' };
  });

  // Cart Logic
  const cartItems = useMemo(() => {
    if (!shopData?.data?.items) return [];
    return shopData.data.items
      .filter(item => (cart[String(item.itemCode)] || 0) > 0)
      .map(item => {
        const qty = cart[String(item.itemCode)];
        return { ...item, qty, total: item.itemPrice * qty };
      });
  }, [shopData, cart]);

  const cartTotal = useMemo(() => cartItems.reduce((sum, i) => sum + i.total, 0), [cartItems]);

  // Actions
  const initFunnel = async (permaLink: string) => {
    setLoading(true);
    try {
      const data = await apiService.loadFunnel(permaLink);
      setShopData(data);
      if (data.token) apiService.setToken(data.token);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = (itemCode: string, delta: number) => {
    setCart(prev => {
      const code = String(itemCode);
      const current = prev[code] || 0;
      const newVal = Math.max(0, current + delta);
      const next = { ...prev };
      if (newVal === 0) delete next[code];
      else next[code] = newVal;
      return next;
    });
  };

  const submitOrder = async (paySetting: 'MMQR' | 'COD') => {
    if (!shopData) return null;
    setLoading(true);
    localStorage.setItem('user_cache', JSON.stringify(userInfo));
    
    // Logic for Tax/Del (Example: 0 for now)
    const taxTotal = 0;
    const delTotal = 0;
    const grandTotal = cartTotal + taxTotal + delTotal;
    const orderId = `MMP-${Date.now()}`;

    const payload: OrderRequest = {
      orderId,
      paySetting,
      subTotal: cartTotal,
      taxTotal,
      delTotal,
      grandTotal,
      customerName: userInfo.name,
      customerPhone: userInfo.phone,
      customerAddress: userInfo.address,
      cartItems: cartItems.map(i => ({
        itemCode: i.itemCode,
        itemName: i.itemName,
        itemImage: i.itemImage,
        itemPrice: i.itemPrice,
        qty: i.qty,
        total: i.total
      }))
    };

    try {
      const res = await apiService.createOrder(payload);
      setCurrentOrder(res.data);
      return res.data;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const loadOrderContext = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await apiService.showOrder(orderId);
      setCurrentOrder(res.data);
      
      // Cold Reload Logic
      if (!shopData && res.businessName) {
        setShopData({
          token: '',
          businessName: res.businessName,
          businessLogo: '',
          description: '',
          contactPhone: '',
          contactEmail: '',
          address: '',
          kycStatus: 'PENDING',
          data: {
             title: '', permaLink: '', items: [], linkStyle: 'card', 
             paySetting: [], status: 'PUBLISHED', platform: 'online'
          }
        });
      }
      return res.data;
    } catch (e) {
        throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FunnelContext.Provider value={{
      shopData, cart, userInfo, setUserInfo, loading,
      cartItems, cartTotal, currentOrder,
      initFunnel, updateQty, submitOrder, loadOrderContext
    }}>
      {children}
    </FunnelContext.Provider>
  );
};

export const useFunnel = () => {
  const context = useContext(FunnelContext);
  if (!context) throw new Error("useFunnel must be used within FunnelProvider");
  return context;
};