import { useContext, useEffect } from 'react';
import { LiveStockPriceContext } from '../context/LiveStockPriceContext';

export const useLivePrice = (symbols: string[]) => {
  const ctx = useContext(LiveStockPriceContext);
  if (!ctx) throw new Error('LiveStockPriceContext not found');

  const { registerSymbols, unregisterSymbols, getLivePrice } = ctx;

  useEffect(() => {
    const valid = symbols.filter(Boolean);
    if (valid.length === 0) return;

    registerSymbols(valid);
    return () => unregisterSymbols(valid);
  }, [symbols.join(',')]);

  return getLivePrice;
};
