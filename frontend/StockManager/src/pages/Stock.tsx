import type { StockDto } from '../../generated-sources/openapi';
import api from '../api/api';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../utils/formatMoney';
import { useStockHub } from '../hooks/useStockHub';
import { List, AutoSizer } from 'react-virtualized';

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

  const liveStocks = useStockHub(visibleSymbols);

  const getLivePrice = (symbol: string) => {
    if (symbol != '') {
      const stock = liveStocks.find((x) => x.symbol === symbol);
      return stock ? (stock.price ?? 0) : 0;
    } else return 0;
  };

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
          className="table-row is-flex pl-2"
          style={{ ...style }}
          onClick={() =>
            navigate(`${stock.symbol}`, { state: { stockId: stock.id } })
          }
        >
          <div style={{ flex: '1' }} className="is-flex is-align-items-center">
            <figure className="image is-24x24">
              <img
                className="border-radius-5"
                src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock?.symbol}.png`}
              />
            </figure>
          </div>
          <div className="cell">{stock.symbol}</div>
          <div style={{ flex: '3' }} className="cell">
            {stock.companyName}
          </div>
          <div className="cell">{stock.sector}</div>
          <div className="cell">${price.toFixed(2)}</div>
          <div className="cell">{formatMoney(stock.marketCap ?? 0)}</div>
        </div>
      );
    },
    [filteredStocks]
  );

  return (
    <div className="stocks is-flex is-flex-direction-column is-align-items-center">
      <h1 className="title has-text-centered my-6">
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
      <div className="table-header is-flex has-text-weight-bold py-3 mt-6 pl-2">
        <div style={{ flex: '1' }}></div>
        <div className="cell">Symbol</div>
        <div style={{ flex: '3' }}>Company name</div>
        <div className="cell">Sector</div>
        <div className="cell">Price</div>
        <div className="cell">Market Cap</div>
      </div>
      <div className="table-div">
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <List
              width={width}
              height={height}
              rowCount={filteredStocks.length}
              rowHeight={45}
              rowRenderer={rowRenderer}
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
