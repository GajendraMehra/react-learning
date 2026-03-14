import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Product } from '../types';

const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get('https://fakestoreapi.com/products');
  return response.data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (changed from cacheTime to gcTime for v5)
  });
};