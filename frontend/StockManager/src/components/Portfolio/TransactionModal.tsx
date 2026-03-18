import { useEffect, useState } from 'react';
import {
  TransactionType,
  type PortfolioItemDto,
  type StockDto,
} from '../../../generated-sources/openapi';
import StockSelectModal from './StockSelectModal';
import api from '../../api/api';
import { COLORS } from '../../constants/colors';
import { useSnackbar } from 'notistack';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (createDto: {
    price: number;
    quantity: number;
    fee: number;
    transactionType: TransactionType;
    stockId?: number;
    portfolioId: number;
    note: string;
    date: string;
  }) => void;
  portfolioId: number | undefined;
  selectedStock?: StockDto;
  portfolioItems: PortfolioItemDto[];
};

type TransactionCreateData = {
  price: string;
  quantity: string;
  date: string;
  fee: string;
  note: string;
};

const TransactionModal = ({
  open,
  onClose,
  onCreate,
  portfolioId,
  portfolioItems,
  selectedStock: selectedStockProp,
}: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [transactionType, setTransactionType] = useState<'Buy' | 'Sell'>('Buy');
  const [selectedStock, setSelectedStock] = useState<StockDto>();
  const [transactionCreateData, setTransactionCreateData] =
    useState<TransactionCreateData>({
      price: '',
      quantity: '0',
      date: new Date().toISOString().split('T')[0],
      fee: '0',
      note: '',
    });
  const [stocks, setStocks] = useState<StockDto[]>([]);
  const [stockModalOpen, setStockModalOpen] = useState(false);

  useEffect(() => {
    if (selectedStockProp) {
      setSelectedStock(selectedStockProp);
      setTransactionCreateData((prev) => ({
        ...prev,
        price: selectedStockProp.price?.toString() ?? '0',
      }));
    }
  }, [selectedStockProp]);

  useEffect(() => {
    if (open) {
      loadStocks();
    } else {
      clearTransactionData();
    }
  }, [transactionType, open]);

  useEffect(() => {
    const available = portfolioItems.find(
      (x) => x.stock?.id == selectedStock?.id
    )?.quantity;

    if (available) {
      if (Number(transactionCreateData.quantity) > available) {
        enqueueSnackbar(
          'The quantity cannot be greater than you have in your portfolio!',
          { variant: 'warning' }
        );
        setTransactionCreateData({
          ...transactionCreateData,
          quantity: available.toString(),
        });
      }
    }
  }, [transactionCreateData.quantity]);

  const loadStocks = async () => {
    try {
      if (transactionType == 'Buy') {
        const res = await api.Stock.apiStockGetAllGet();
        setStocks(res.data);
      } else if (transactionType == 'Sell') {
        const portfolioStocks =
          portfolioItems
            .filter((item) => item.stock !== undefined)
            .map((item) => item.stock as StockDto) ?? [];

        setStocks(portfolioStocks);
      }
    } catch (error) {
      console.error('Error while loading stocks: ', error);
    }
  };

  const clearTransactionData = () => {
    setTransactionCreateData({
      price: '',
      quantity: '0',
      date: new Date().toISOString().split('T')[0],
      fee: '0',
      note: '',
    });
    setSelectedStock(undefined);
    setTransactionType('Buy');
  };

  const create = () => {
    if (!selectedStock) {
      enqueueSnackbar('Please select a stock.', { variant: 'warning' });
      return;
    }

    if (portfolioId == null) {
      enqueueSnackbar('Please select a portfolio.', { variant: 'warning' });
      return;
    }

    onCreate({
      price: Number(transactionCreateData.price),
      quantity: Number(transactionCreateData.quantity),
      fee: Number(transactionCreateData.fee),
      transactionType:
        transactionType === 'Buy'
          ? TransactionType.NUMBER_0
          : TransactionType.NUMBER_1,
      stockId: selectedStock.id,
      portfolioId,
      note: transactionCreateData.note,
      date: transactionCreateData.date,
    });

    clearTransactionData();
    onClose();
  };

  return (
    <>
      <div className={`modal ${open ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={onClose}></div>
        <div className="modal-content">
          <div className="card p-6">
            <h1 className="title is-4 mb-6">Add transaction</h1>
            <div className="mt-1 mx-0 columns mb-5">
              <div className="column p-0 mr-3">
                <button
                  className={
                    'button is-normal is-fullwidth has-text-weight-bold '
                  }
                  style={{
                    backgroundColor:
                      transactionType == 'Buy'
                        ? COLORS.successButton
                        : COLORS.background,
                  }}
                  onClick={() => setTransactionType('Buy')}
                >
                  Buy
                </button>
              </div>
              <div className="column p-0">
                <button
                  className={
                    'button is-normal is-fullwidth has-text-weight-bold '
                  }
                  style={{
                    backgroundColor:
                      transactionType == 'Sell'
                        ? COLORS.errorButton
                        : COLORS.background,
                  }}
                  onClick={() => setTransactionType('Sell')}
                >
                  Sell
                </button>
              </div>
            </div>

            <div className="columns mb-0">
              <div className="field column is-6 mb-0">
                <label className="label">Symbol</label>
                <div
                  className="select is-fullwidth"
                  onClick={() => setStockModalOpen(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <button className="button is-fullwidth is-justify-content-start">
                    <span>{selectedStock?.symbol ?? 'Select symbol'}</span>
                  </button>
                </div>
              </div>

              <div className="field column mb-0 is-6">
                <label className="label">Price</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    value={transactionCreateData.price}
                    onChange={(e) =>
                      setTransactionCreateData({
                        ...transactionCreateData,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="columns mb-0">
              <div className="field column mb-0">
                <label className="label">Quantity</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    value={transactionCreateData.quantity}
                    onChange={(e) =>
                      setTransactionCreateData({
                        ...transactionCreateData,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              {transactionType == 'Sell' && (
                <div className="field column mb-0 mt-auto is-narrow pl-0">
                  <button
                    className="button"
                    style={{ backgroundColor: COLORS.infoBox }}
                    onClick={() => {
                      const available = portfolioItems
                        .find((x) => x.stock?.id == selectedStock?.id)
                        ?.quantity?.toFixed(2);
                      if (available) {
                        setTransactionCreateData({
                          ...transactionCreateData,
                          quantity: available,
                        });
                      }
                    }}
                  >
                    Max (
                    {portfolioItems
                      .find((x) => x.stock?.id == selectedStock?.id)
                      ?.quantity?.toFixed(2)}
                    )
                  </button>
                </div>
              )}
            </div>
            {transactionType == 'Sell' && (
              <p
                style={{ color: COLORS.infoText, marginTop: -10 }}
                className="is-size-7 mb-3"
              >
                Available:{' '}
                {portfolioItems
                  .find((x) => x.stock?.id == selectedStock?.id)
                  ?.quantity?.toFixed(2)}{' '}
                shares
              </p>
            )}

            <div className="columns mb-0">
              <div className="field column mb-0 is-6">
                <label className="label">Date</label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    value={transactionCreateData.date}
                    onChange={(e) =>
                      setTransactionCreateData({
                        ...transactionCreateData,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="field column mb-0">
                <label className="label">Fee</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min={0}
                    value={transactionCreateData.fee}
                    onChange={(e) =>
                      setTransactionCreateData({
                        ...transactionCreateData,
                        fee: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Notes</label>
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Type notes..."
                  value={transactionCreateData.note}
                  onChange={(e) =>
                    setTransactionCreateData({
                      ...transactionCreateData,
                      note: e.target.value,
                    })
                  }
                  style={{ height: '100px', minHeight: '0px' }}
                ></textarea>
              </div>
            </div>

            <div className="mt-5">
              <button
                className="button button-navy is-fullwidth"
                onClick={create}
              >
                Add transaction
              </button>
            </div>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={onClose}
        ></button>
      </div>

      <StockSelectModal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        stocks={stocks}
        onSelectStock={(stock) => {
          setSelectedStock(stock);
          setTransactionCreateData({
            ...transactionCreateData,
            price: stock?.price?.toString() ?? '0',
          });
          setStockModalOpen(false);
        }}
      />
    </>
  );
};

export default TransactionModal;
