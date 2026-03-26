import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import type {
  StockDto,
  StockQuote,
  WatchListItemCreateDto,
} from '../../../generated-sources/openapi';

import Overview from './Overview';
import Financial from './Financials/Financial';
import { useLivePrice } from '../../hooks/useLivePrice';

const StockView = () => {
  const { symbol, tab, subtab } = useParams<{
    symbol: string;
    tab?: string;
    subtab?: string;
  }>();

  const [stock, setStock] = useState<StockDto>();
  const [stockQuote, setStockQuote] = useState<StockQuote>();
  const [onWatchlist, setOnWatchlist] = useState<true | false>(false);
  const [imageError, setImageError] = useState(false);

  const activeTab = tab || 'overview';

  useEffect(() => {
    if (!symbol) {
      return;
    }

    api.Stock.apiStockGetBySymbolSymbolGet(symbol)
      .then((res) => setStock(res.data))
      .catch((err) => console.error(err));
  }, [symbol]);

  useEffect(() => {
    if (!symbol) {
      return;
    }

    api.Stock.apiStockGetStockQuoteGet(symbol)
      .then((res) => setStockQuote(res.data))
      .catch((err) => console.error(err));
  }, [symbol]);

  useEffect(() => {
    checkWatchListItem();
  }, [stock]);

  const checkWatchListItem = async () => {
    const watchlist = await api.WatchList.apiWatchListGetByUserIdGet();
    const response = watchlist.data;

    if (response.watchListItems) {
      for (const item of response.watchListItems) {
        if (item.stock?.id == stock?.id) {
          setOnWatchlist(true);
          break;
        }
      }
    }
  };

  const addToWatchlist = async () => {
    try {
      if (!onWatchlist && stock?.id) {
        api.WatchListItem.apiWatchListItemCreatePost({
          StockId: stock?.id,
        } as WatchListItemCreateDto);

        setOnWatchlist(true);
      }
    } catch (error) {
      console.error('Error while adding stock to watchlist:', error);
    }
  };

  const removeFromWatchlist = async () => {
    try {
      if (onWatchlist && stock?.id) {
        api.WatchList.apiWatchListGetByUserIdGet().then((res) => {
          if (res.data.watchListItems) {
            const item = res.data.watchListItems.find(
              (x) => x.stock?.id == stock.id
            );

            if (item?.id) {
              api.WatchListItem.apiWatchListItemDeleteIdDelete(item.id);

              setOnWatchlist(false);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error while adding stock to watchlist:', error);
    }
  };

  const getLivePrice = useLivePrice(symbol ? [symbol] : []);

  const livePrice = symbol
    ? getLivePrice(symbol) || (stock?.price ?? 0)
    : (stock?.price ?? 0);

  const previousClose = stockQuote?.pc ?? stock?.price ?? 0;
  const liveDiff = livePrice - previousClose;
  const livePercentage =
    previousClose !== 0 ? (liveDiff / previousClose) * 100 : 0;

  return (
    <div className="stockview">
      <nav className="breadcrumb mt-6" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/app/stocks">Stocks</Link>
          </li>
          <li className="is-active">
            <Link to="#" aria-current="page">
              {stock?.symbol}
            </Link>
          </li>
        </ul>
      </nav>

      <nav className="panel" style={{ boxShadow: 'none' }}>
        <div
          className="panel-block is-flex is-justify-content-space-between is-align-items-center has-text-weight-bold py-6 px-5"
          style={{ height: '40vh' }}
        >
          <div className="is-flex is-align-items-flex-end">
            {!imageError ? (
              <figure className="image">
                <img
                  className="border-radius-10"
                  style={{ height: '25vh' }}
                  src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock?.symbol}.png`}
                  alt={`${stock?.symbol} logo`}
                  onError={() => setImageError(true)}
                />
              </figure>
            ) : (
              <span
                className="icon is-small has-text-grey-light has-background-light border-radius-5"
                style={{ height: '25vh', width: '15vw' }}
              >
                <i className="fas fa-chart-line fa-4x"></i>
              </span>
            )}
            <div className="ml-5">
              <p className="is-size-3 has-font-weight-bold">
                {stock?.companyName} ({stock?.symbol})
              </p>
              <p className="is-size-6">{stock?.exchange}</p>
            </div>
          </div>
          <div
            className="is-flex is-justify-content-space-between is-flex-direction-column"
            style={{ height: '25vh' }}
          >
            <div className="is-flex is-justify-content-end">
              {onWatchlist ? (
                <button
                  className="button button-navy"
                  onClick={removeFromWatchlist}
                >
                  <span className="icon mr-2" style={{ color: 'yellow' }}>
                    <i className="fas fa-star"></i>
                  </span>
                  In Watchlist
                </button>
              ) : (
                <button className="button button-navy" onClick={addToWatchlist}>
                  <span className="icon mr-2" style={{ color: 'white' }}>
                    <i className="fas fa-star"></i>
                  </span>
                  Add to Watchlist
                </button>
              )}
            </div>
            <div className="is-flex is-flex-direction-row is-align-items-center">
              <p className="is-size-1">
                $
                {livePrice.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}
              </p>
              <div
                className="ml-4"
                style={{
                  color:
                    liveDiff !== undefined && liveDiff !== null
                      ? liveDiff > 0
                        ? 'green'
                        : liveDiff < 0
                          ? 'red'
                          : 'black'
                      : 'black',
                }}
              >
                <p style={{ color: 'inherit' }}>
                  {liveDiff == null
                    ? '-'
                    : liveDiff > 0
                      ? `+${liveDiff.toFixed(2)}`
                      : `${liveDiff.toFixed(2)}`}
                </p>
                <p style={{ color: 'inherit' }}>
                  {livePercentage == null
                    ? '-'
                    : livePercentage > 0
                      ? `+${livePercentage.toFixed(2)}%`
                      : `${livePercentage.toFixed(2)}%`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="panel-tabs is-justify-content-flex-start">
          <Link
            to={`/app/stocks/${symbol}/overview`}
            className={activeTab === 'overview' ? 'is-active' : ''}
          >
            Overview
          </Link>
          <Link
            to={`/app/stocks/${symbol}/financials/overview`}
            className={activeTab === 'financials' ? 'is-active' : ''}
          >
            Financials
          </Link>
        </p>

        <div className="main-box p-5">
          {activeTab === 'overview' && <Overview stock={stock} />}
          {activeTab === 'financials' && (
            <Financial stock={stock} activeSubTab={subtab} />
          )}
        </div>
      </nav>
    </div>
  );
};

export default StockView;
