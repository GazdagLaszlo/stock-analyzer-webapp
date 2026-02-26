import { createContext } from 'react';
import type {
  PortfolioCreateDto,
  PortfolioDto,
  PortfolioItemDto,
  PortfolioUpdateDto,
} from '../../generated-sources/openapi';

export interface PortfolioContextType {
  portfolios: PortfolioDto[];
  selectedPortfolio: PortfolioDto | undefined;
  getPortfolioValue: (portfolio: PortfolioDto | undefined) => number;
  getTotalInvested: (portfolio: PortfolioDto | undefined) => number;
  getTotalProfit: (portfolio: PortfolioDto | undefined) => number | null;
  getItemProfit: (item: PortfolioItemDto, currentPrice: number) => number;
  getLivePrice: (symbol: string) => number;
  fetchPortfolios: () => Promise<PortfolioDto[] | undefined>;
  selectPortfolio: (id: number) => void;
  createPortfolio: (dto: PortfolioCreateDto) => Promise<void>;
  deletePortfolio: (id: number | undefined) => Promise<void>;
  updatePortfolio: (id: number, dto: PortfolioUpdateDto) => Promise<void>;
}

export const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);
