import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { PortfolioContext } from './PortfolioContext';
import { AuthContext } from './AuthContext';
import api from '../api/api';
import type {
  PortfolioDto,
  PortfolioCreateDto,
  PortfolioItemDto,
} from '../../generated-sources/openapi';
import { useStockHub } from '../hooks/useStockHub';

export const PortfolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useContext(AuthContext);
  const [portfolios, setPortfolios] = useState<PortfolioDto[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<
    PortfolioDto | undefined
  >();

  const fetchPortfolios = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.Portfolio.apiPortfolioGetAllGet();
      setPortfolios(res.data);
      if (selectedPortfolio) {
        const updated = res.data.find((p) => p.id === selectedPortfolio.id);
        if (updated) {
          setSelectedPortfolio(updated);
        }
      }
      return res.data;
    } catch (error) {
      console.error('Error while loading portfolios', error);
    }
  }, [token]);

  const symbols = useMemo(
    () =>
      selectedPortfolio?.portfolioItems?.map(
        (item) => item.stock?.symbol ?? ''
      ) ?? [],
    [selectedPortfolio]
  );
  const liveStocks = useStockHub(symbols);

  const getLivePrice = useCallback(
    (symbol: string) => {
      if (symbol != '') {
        const stock = liveStocks.find((s) => s.symbol === symbol);
        return stock ? (stock.price ?? 0) : 0;
      } else return 0;
    },
    [liveStocks]
  );

  const getPortfolioValue = useCallback(
    (portfolio: PortfolioDto | undefined) => {
      if (!portfolio?.portfolioItems) return 0;

      return portfolio.portfolioItems.reduce((sum, item) => {
        const currentPrice =
          getLivePrice(item.stock?.symbol ?? '') || (item.stock?.price ?? 0);
        return sum + (item.quantity ?? 0) * currentPrice;
      }, 0);
    },
    [getLivePrice]
  );

  const getTotalInvested = useCallback(
    (portfolio: PortfolioDto | undefined) => {
      if (!portfolio?.portfolioItems) return 0;

      return portfolio.portfolioItems.reduce((total, item) => {
        return total + (item.averagePurchasePrice ?? 0) * (item.quantity ?? 0);
      }, 0);
    },
    []
  );

  const getItemProfit = (item: PortfolioItemDto, currentPrice: number) => {
    if (!item.averagePurchasePrice || !item.quantity || currentPrice == 0) {
      return 0;
    }
    return (currentPrice - item.averagePurchasePrice) * item.quantity;
  };

  const getTotalProfit = useCallback(
    (portfolio: PortfolioDto | undefined) => {
      const value = getPortfolioValue(portfolio);
      const invested = getTotalInvested(portfolio);
      return value - invested;
    },
    [getPortfolioValue, getTotalInvested]
  );

  const selectPortfolio = (id: number) => {
    const p = portfolios.find((x) => x.id === id);
    setSelectedPortfolio(p);
  };

  const createPortfolio = async (createDto: PortfolioCreateDto) => {
    const createResponse =
      await api.Portfolio.apiPortfolioCreatePost(createDto);
    const createdPortfolioId = createResponse.data;

    const refreshedPortfolios = await fetchPortfolios();

    const newPortfolio = refreshedPortfolios?.find(
      (x) => x.id === createdPortfolioId
    );
    if (newPortfolio) {
      setSelectedPortfolio(newPortfolio);
    }
  };

  const deletePortfolio = async (id: number | undefined) => {
    if (id) {
      await api.Portfolio.apiPortfolioDeleteIdDelete(id);
      const refreshedPortfolios = await fetchPortfolios();
      if (refreshedPortfolios && refreshedPortfolios.length > 0) {
        setSelectedPortfolio(refreshedPortfolios[0]);
      } else {
        setSelectedPortfolio(undefined);
      }
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        selectedPortfolio,
        getPortfolioValue,
        getTotalInvested,
        getTotalProfit,
        getItemProfit,
        getLivePrice,
        fetchPortfolios,
        selectPortfolio,
        createPortfolio,
        deletePortfolio,
        updatePortfolio: async (id, dto) => {
          await api.Portfolio.apiPortfolioUpdateIdPut(id, dto);
          await fetchPortfolios();
        },
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
