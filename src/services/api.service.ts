import axios from 'axios';
import { configuration } from '../configuration';
import type { OrderRequest, OrderResponse, PollResponse, ShopDetails } from '../types';

const BASE_URL = configuration.BASE_URL;

class ApiService {
  private nonce: string;
  private token: string | null = null;

  constructor() {
    this.nonce = new Date().getTime().toString();
  }

  /**
   * Generates headers for every request.
   * Injects the Guest Nonce and Bearer Token if available.
   */
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Funnel-Guest-Nounce': this.nonce,
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  /**
   * Sets the JWT token retrieved from loadFunnel
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Fetches shop configuration and items
   */
  async loadFunnel(permaLink: string): Promise<ShopDetails> {
    const response = await axios.post(
      `${BASE_URL}/funnels/load-funnel`,
      { permaLink },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  /**
   * Submits the order
   */
  async createOrder(payload: OrderRequest): Promise<{ data: OrderResponse }> {
    const response = await axios.post(
      `${BASE_URL}/funnels/orders/create`,
      payload,
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  /**
   * Checks MMQR payment status
   */
  async pollOrder(orderId: string): Promise<PollResponse> {
    const response = await axios.post(
      `${BASE_URL}/funnels/orders/polling`,
      { orderId },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  /**
   * Fetches order details for Receipt/Thank You page
   */
  async showOrder(orderId: string): Promise<{ data: OrderResponse } & Partial<ShopDetails>> {
    const response = await axios.post(
      `${BASE_URL}/funnels/orders/show`,
      { orderId },
      { headers: this.getHeaders() }
    );
    return response.data;
  }
}

export const apiService = new ApiService();