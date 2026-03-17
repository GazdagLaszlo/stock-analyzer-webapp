import { useEffect, useMemo, useState } from 'react';
import type {
  StockDto,
  WatchListDto,
  WatchListItemDto,
  WatchListItemUpdateDto,
} from '../../generated-sources/openapi';
import api from '../api/api';
import WatchlistItemMenu from '../components/Watchlist/WatchlistItemMenu';
import StockSelectModal from '../components/Portfolio/StockSelectModal';
import WatchlistItemDeleteModal from '../components/Watchlist/WatchListItemDeleteModal';
import WatchlistItemEditModal from '../components/Watchlist/WatchlistItemEditModal';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useQueries } from '@tanstack/react-query';
import { COLORS } from '../constants/colors';
import { useLivePrice } from '../hooks/useLivePrice';

const Watchlist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [stocks, setStocks] = useState<StockDto[]>([]);
  const [selectedWatchlistItem, setSelectedWatchlistItem] =
    useState<WatchListItemDto>();

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const loadStocks = async () => {
    api.Stock.apiStockGetAllGet()
      .then((res) => {
        setStocks(res.data);
      })
      .catch((error) => {
        console.error('Error while loading stocks: ', error);
      });
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const { data: watchlist, isLoading: watchlistLoading } =
    useQuery<WatchListDto>({
      queryKey: ['watchlistGet'],
      queryFn: async () => {
        const res = await api.WatchList.apiWatchListGetByUserIdGet();
        return res.data;
      },
    });

  const stockQuotesQueries = useQueries({
    queries:
      watchlist?.watchListItems?.map((item) => ({
        queryKey: ['stockQuote', item.stock?.symbol],
        queryFn: async () => {
          if (!item.stock?.symbol) return null;
          const res = await api.Stock.apiStockGetStockQuoteGet(
            item.stock.symbol
          );
          return res.data;
        },
        enabled: !!item.stock?.symbol,
        staleTime: 1000 * 60,
        refetchInterval: 1000 * 30,
      })) ?? [],
  });

  const createWatchlistItem = async (stockId?: number) => {
    if (!stockId) {
      console.log('StockId is undefined');
      return;
    }

    if (watchlist?.watchListItems?.find((item) => item.stock?.id == stockId)) {
      console.log('Stock is already on watchlist');
      return;
    }

    try {
      await api.WatchListItem.apiWatchListItemCreatePost({ stockId });

      queryClient.invalidateQueries({ queryKey: ['watchlistGet'] });
    } catch (error) {
      console.log('WatchlistItem create was not successful: ', error);
    }
  };

  const deleteWatchlistItem = async (id: number | undefined) => {
    if (id) {
      await api.WatchListItem.apiWatchListItemDeleteIdDelete(id);

      queryClient.invalidateQueries({ queryKey: ['watchlistGet'] });
    }
  };

  const editWatchlistItem = async (
    id: number | undefined,
    updateDto: WatchListItemUpdateDto
  ) => {
    if (id) {
      await api.WatchListItem.apiWatchListItemUpdateIdPut(id, updateDto);

      queryClient.invalidateQueries({ queryKey: ['watchlistGet'] });
    }
  };

  const symbols = useMemo(
    () => watchlist?.watchListItems?.map((x) => x.stock?.symbol ?? ''),
    [watchlist]
  );
  const getLivePrice = useLivePrice(symbols ? symbols : []);

  return (
    <div>
      <h1 className="is-size-3 has-text-weight-bold has-text-centered my-6">
        My Watchlist
      </h1>
      {watchlistLoading ? (
        <>
          <div className="is-flex is-justify-content-right my-5">
            <button
              className="button button-navy is-dark"
              onClick={() => setStockModalOpen(true)}
            >
              Add stocks
            </button>
          </div>
          <div className="is-flex is-flex-direction-column mt-6">
            <table className="custom-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Entry Price</th>
                  <th>Note</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="table-row">
                    <td style={{ width: '3vw' }}></td>
                    <td style={{ width: '8vw' }}>
                      <div className="skeleton skeleton-text"></div>
                    </td>
                    <td style={{ width: '20vw' }}>
                      <div className="skeleton skeleton-text"></div>
                    </td>
                    <td style={{ width: '10vw' }}>
                      <div className="skeleton skeleton-text"></div>
                    </td>
                    <td style={{ width: '10vw' }}>
                      <div className="skeleton skeleton-text"></div>
                    </td>
                    <td style={{ width: '44vw' }}>
                      <div className="skeleton skeleton-text"></div>
                    </td>
                    <td style={{ width: '5vw' }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : watchlist?.watchListItems && watchlist.watchListItems.length > 0 ? (
        <>
          <div className="is-flex is-justify-content-right my-5">
            <button
              className="button button-navy is-dark"
              onClick={() => setStockModalOpen(true)}
            >
              Add stocks
            </button>
          </div>

          <div className="mt-6">
            <table className="custom-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Entry Price</th>
                  <th>Note</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {watchlist?.watchListItems?.map((item, i) => {
                  //const changePercent = stockQuotesQueries[i].data?.dp ?? 0;

                  const previousClose =
                    stockQuotesQueries[i].data?.pc ?? item.stock?.price ?? 0;
                  const livePrice = getLivePrice(item.stock?.symbol ?? '');

                  const changePercent =
                    previousClose !== 0 && livePrice
                      ? ((livePrice - previousClose) / previousClose) * 100
                      : (stockQuotesQueries[i].data?.dp ?? 0);

                  return (
                    <tr
                      key={item.id}
                      onClick={() =>
                        navigate(`/app/stocks/${item.stock?.symbol}`)
                      }
                    >
                      <td style={{ width: '3vw' }}>
                        <figure className="image is-24x24 ">
                          <img
                            className="border-radius-5"
                            src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${item.stock?.symbol}.png`}
                          />
                        </figure>
                      </td>
                      <td style={{ width: '8vw' }}>{item.stock?.symbol}</td>
                      <td style={{ width: '20vw' }}>
                        {item.stock?.companyName}
                      </td>
                      <td style={{ width: '10vw' }}>
                        {livePrice || item.stock?.price} USD
                      </td>
                      <td
                        style={{
                          width: '10vw',
                          fontSize: 14,
                          color:
                            changePercent > 0
                              ? COLORS.success
                              : changePercent < 0
                                ? COLORS.error
                                : 'inherit',
                        }}
                      >
                        {changePercent > 0
                          ? '+' + changePercent.toFixed(2)
                          : changePercent.toFixed(2)}
                        %
                      </td>
                      <td style={{ width: '10vw' }}>
                        {item.entryPrice != null
                          ? item.entryPrice + ' USD'
                          : '-'}
                      </td>
                      <td style={{ width: '44vw' }}>{item.note ?? '-'}</td>
                      <td style={{ width: '5vw' }}>
                        <WatchlistItemMenu
                          onEdit={() => {
                            setSelectedWatchlistItem(item);
                            setEditModalOpen(true);
                          }}
                          onDeleteItem={() => {
                            if (item.id != null) {
                              setSelectedWatchlistItem(item);
                              setDeleteModalOpen(true);
                            }
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div
          className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
          style={{ marginTop: '10vh' }}
        >
          <div className="has-text-centered py-6">
            <span className="icon is-large has-text-grey-light mb-5">
              <i className="fas fa-eye fa-3x"></i>
            </span>
            <h3 className="title is-4 pb-2">
              Your Watchlist is currently empty
            </h3>
            <p className="subtitle is-6 has-text-grey">
              Keep track of interesting companies without committing capital.
              Monitor price movements and set your strategy before you trade.
            </p>
            <div className="buttons is-centered mt-5">
              <button
                className="button button-navy"
                onClick={() => setStockModalOpen(true)}
              >
                Add stocks
              </button>
            </div>
          </div>
        </div>
      )}

      <StockSelectModal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        stocks={stocks}
        onSelectStock={(stock) => {
          setStockModalOpen(false);
          createWatchlistItem(stock.id);
        }}
      />

      <WatchlistItemDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        watchlistItem={selectedWatchlistItem}
        onDelete={deleteWatchlistItem}
      />

      <WatchlistItemEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        selectedItem={selectedWatchlistItem}
        onEdit={editWatchlistItem}
      />
    </div>
  );
};

export default Watchlist;
