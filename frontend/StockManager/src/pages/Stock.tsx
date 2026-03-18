import type { StockDto } from '../../generated-sources/openapi';
import api from '../api/api';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../utils/formatMoney';
import { List, AutoSizer } from 'react-virtualized';
import StockImage from './StockImage';
import { useLivePrice } from '../hooks/useLivePrice';

const Stock = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<StockDto[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [visibleSymbols, setVisibleSymbols] = useState<string[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    api.Stock.apiStockGetAllGet()
      .then((res) => {
        setStocks(res.data);
      })
      .catch((error) => {
        console.error('Error while loading stocks: ', error);
      });
  }, []);

  const filteredStocks = useMemo(() => {
    const sorted = [...stocks].sort(
      (a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0)
    );
    return sorted.filter(
      (stock) =>
        stock.symbol?.toLowerCase().startsWith(searchInput.toLowerCase()) ||
        stock.companyName?.toLowerCase().startsWith(searchInput.toLowerCase())
    );
  }, [stocks, searchInput]);

  const getLivePrice = useLivePrice(visibleSymbols ? visibleSymbols : []);

  const rowRenderer = useCallback(
    ({
      key,
      index,
      style,
    }: {
      key: string;
      index: number;
      style: React.CSSProperties;
    }) => {
      const stock = filteredStocks[index];
      const price = getLivePrice(stock.symbol ?? '') || (stock.price ?? 0);

      return (
        <div
          key={key}
          className="table-row is-flex"
          style={{ ...style }}
          onClick={() =>
            navigate(`${stock.symbol}`, { state: { stockId: stock.id } })
          }
        >
          <div
            style={{ width: '4vw' }}
            className="is-flex is-align-items-center is-justify-content-center"
          >
            <figure className="image is-24x24">
              <StockImage symbol={stock.symbol ?? ''} />
            </figure>
          </div>
          <div className="" style={{ width: '8vw' }}>
            {stock.symbol}
          </div>
          <div style={{ width: '50vw' }}>{stock.companyName}</div>
          <div style={{ width: '15vw' }}>{stock.sector}</div>
          <div style={{ width: '10vw' }}>
            ${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </div>
          <div style={{ width: '10vw' }}>
            {formatMoney(stock.marketCap ?? 0)}
          </div>
        </div>
      );
    },
    [filteredStocks, getLivePrice]
  );

  return (
    <div className="stocks is-flex is-flex-direction-column is-align-items-center">
      <h1 className="is-size-3 has-text-weight-bold has-text-centered my-6">
        Stocks by market capitalization
      </h1>
      <div className="field" style={{ width: '70%' }}>
        <div className="control has-icons-left">
          <input
            type="text"
            className="input pl-6"
            placeholder="Keresés..."
            ref={inputRef}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <span className="icon is-left">
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>
      <div className="table-header is-flex has-text-weight-bold py-3 mt-6">
        <div style={{ width: '4vw' }}></div>
        <div className="" style={{ width: '8vw' }}>
          Symbol
        </div>
        <div style={{ width: '50vw' }}>Company name</div>
        <div className="" style={{ width: '15vw' }}>
          Sector
        </div>
        <div className="" style={{ width: '10vw' }}>
          Price
        </div>
        <div className="" style={{ width: '10vw' }}>
          Market Cap
        </div>
      </div>
      <div className="table-div">
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <List
              width={width}
              height={height}
              rowCount={filteredStocks.length}
              rowHeight={50}
              rowRenderer={rowRenderer}
              overscanRowCount={10}
              onRowsRendered={({
                startIndex,
                stopIndex,
              }: {
                startIndex: number;
                stopIndex: number;
              }) => {
                const visible = filteredStocks
                  .slice(startIndex, stopIndex + 1)
                  .map((s) => s.symbol ?? '');
                setVisibleSymbols(visible);
              }}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default Stock;
