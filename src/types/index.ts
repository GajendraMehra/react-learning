export interface FunnelItem {
  itemCode: string;
  itemName: string;
  itemImage: string;
  itemOriginPrice?: number;
  itemPrice: number;
  maxOrderQty: number;
  minOrderQty: number;
  limitStock: number;
  itemDescription: string;
}

export interface CartItem extends FunnelItem {
  qty: number;
  total: number;
}

export interface FunnelData {
  title: string;
  permaLink: string;
  linkStyle: 'card' | 'list';
  platform: 'online' | 'pos';
  status: 'DRAFT' | 'PUBLISHED';
  items: FunnelItem[];
  paySetting: string[];
  minAmount?: number;
}

export interface ShopDetails {
  token: string;
  businessName: string;
  businessLogo: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  data: FunnelData;
}

export interface OrderRequest {
  subTotal: number;
  taxTotal: number;
  delTotal: number;
  grandTotal: number;
  orderId: string;
  paySetting: 'MMQR' | 'COD' | 'CASH';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  cartItems: {
    itemImage: string;
    itemCode: string;
    itemName: string;
    itemPrice: number;
    qty: number;
    total: number;
  }[];
}

export interface OrderResponse {
  _id: string;
  payQr: string;
  createdAt: string;
  subTotal: number;
  taxTotal: number;
  delTotal: number;
  grandTotal: number;
  orderId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paySetting: 'MMQR' | 'COD' | 'CASH';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  cartItems: {
    itemCode: string;
    itemName: string;
    price: number;
    qty: number;
    total: number;
  }[];
}

export interface PollResponse {
  status: 'PENDING' | 'FAILED' | 'SUCCESS';
  orderId: string;
}
