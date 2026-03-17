import { useQuery } from '@tanstack/react-query';
import api from '../api/api';

export function useStockQuote(symbol?: string) {
  return useQuery({
    queryKey: ['stockQuote', symbol],
    queryFn: async () => {
      if (!symbol) return null;
      const res = await api.Stock.apiStockGetStockQuoteGet(symbol);
      return res.data;
    },
    enabled: !!symbol,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 30,
  });
}
