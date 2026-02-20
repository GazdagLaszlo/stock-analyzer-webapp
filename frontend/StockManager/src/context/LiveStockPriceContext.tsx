import { createContext } from 'react';
import { useStockHub } from '../hooks/useStockHub';
//import type { StockDto } from "../../generated-sources/openapi";

interface LiveStockPriceContextType {
  //liveStocks: StockDto[];
  getLivePrice: (symbol: string) => number;
}

const LiveStockPriceContext = createContext<
  LiveStockPriceContextType | undefined
>(undefined);

export const LiveStockPriceProvider = ({
  symbols,
  children,
}: {
  symbols: string[];
  children: React.ReactNode;
}) => {
  const liveStocks = useStockHub(symbols);

  const getLivePrice = (symbol: string) => {
    if (!symbol) return 0;
    const stock = liveStocks.find((s) => s.symbol === symbol);
    return stock?.price ?? 0;
  };

  return (
    <LiveStockPriceContext.Provider value={{ /*liveStocks,*/ getLivePrice }}>
      {children}
    </LiveStockPriceContext.Provider>
  );
};
