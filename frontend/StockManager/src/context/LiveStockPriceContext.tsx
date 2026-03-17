/* eslint-disable react-refresh/only-export-components */
// context/LiveStockPriceContext.tsx

import { createContext, useState, useCallback, useRef, useEffect } from 'react';
import { useStockHub } from '../hooks/useStockHub';

interface LiveStockPriceContextType {
  getLivePrice: (symbol: string) => number;
  registerSymbols: (symbols: string[]) => void;
  unregisterSymbols: (symbols: string[]) => void;
}

export const LiveStockPriceContext = createContext<
  LiveStockPriceContextType | undefined
>(undefined);

export const LiveStockPriceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [symbols, setSymbols] = useState<string[]>([]);
  //Számolni, hogy hányszor regisztrálok egy szimbólumot
  const refCountRef = useRef<Map<string, number>>(new Map());

  const registerSymbols = useCallback((newSymbols: string[]) => {
    const toAdd: string[] = [];

    newSymbols.forEach((s) => {
      const count = refCountRef.current.get(s) ?? 0;
      refCountRef.current.set(s, count + 1);
      if (count === 0) toAdd.push(s);
    });

    if (toAdd.length > 0) {
      setSymbols((prev) => [...new Set([...prev, ...toAdd])]);
    }
  }, []);

  useEffect(() => {
    console.log('Active symbols:', symbols);
  }, [symbols]);

  const unregisterSymbols = useCallback((oldSymbols: string[]) => {
    const toRemove: string[] = [];

    oldSymbols.forEach((s) => {
      const count = (refCountRef.current.get(s) ?? 1) - 1;
      refCountRef.current.set(s, count);
      if (count === 0) toRemove.push(s);
    });

    if (toRemove.length > 0) {
      setSymbols((prev) => prev.filter((s) => !toRemove.includes(s)));
    }
  }, []);

  const liveStocks = useStockHub(symbols);

  const getLivePrice = useCallback(
    (symbol: string) => {
      if (!symbol) return 0;
      return liveStocks.find((s) => s.symbol === symbol)?.price ?? 0;
    },
    [liveStocks]
  );

  return (
    <LiveStockPriceContext.Provider
      value={{ getLivePrice, registerSymbols, unregisterSymbols }}
    >
      {children}
    </LiveStockPriceContext.Provider>
  );
};
