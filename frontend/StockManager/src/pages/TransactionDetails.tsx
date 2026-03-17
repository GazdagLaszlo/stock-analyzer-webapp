import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';
import { formatMoney } from '../utils/formatMoney';
import { useContext, useState } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import TransactionDeleteModal from '../components/Transaction/TransactionDeleteModal';
import { COLORS } from '../constants/colors';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const portfolioContext = useContext(PortfolioContext);
  if (!portfolioContext) {
    throw new Error('PortfolioContext not found');
  }
  const { getLivePrice } = portfolioContext;
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const res = await api.Transaction.apiTransactionGetByIdIdGet(Number(id));
      return res.data;
    },
    enabled: !!id,
  });

  const { data: stockQuote } = useQuery({
    queryKey: ['getStockQuote', transaction?.stock?.symbol],
    queryFn: async () => {
      if (transaction?.stock?.symbol) {
        const res = await api.Stock.apiStockGetStockQuoteGet(
          transaction?.stock?.symbol
        );
        return res.data;
      }
    },
    enabled: !!transaction?.stock,
  });

  const { data: relatedTransactions } = useQuery({
    queryKey: ['getRelatedTransactions', transaction?.tradeId],
    queryFn: async () => {
      if (transaction?.tradeId) {
        const resp = await api.Transaction.apiTransactionGetWithSameTradeIdGet(
          transaction.tradeId
        );
        return resp.data;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="section has-text-centered">
        <button className="button is-ghost is-loading">Loading...</button>
      </div>
    );
  }

  const deleteTransaction = async (id: number | undefined) => {
    if (!id) {
      return;
    }

    try {
      await api.Transaction.apiTransactionDeleteIdDelete(id);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      navigate(-1);
    } catch (error) {
      alert(
        'Cannot delete this the transaction because some of the shares have already been sold.'
      );
      console.log(error);
    }
  };

  if (!transaction)
    return <div className="notification is-danger">Transaction not found.</div>;

  const isBuy = transaction.transactionType === 0;
  const totalValue = (transaction.price || 0) * (transaction.quantity || 0);
  const totalCost = isBuy
    ? totalValue + (transaction.fee || 0)
    : totalValue - (transaction.fee || 0);

  const costBasis = totalCost - (transaction.realizedProfit ?? 0);
  const profitPercentage =
    ((transaction.realizedProfit ?? 0) / costBasis) * 100;

  const livePrice =
    getLivePrice(transaction.stock?.symbol ?? '') ||
    (transaction.stock?.price ?? 0);

  const previousClose = stockQuote?.pc ?? transaction.stock?.price ?? 0;
  const liveDiff = livePrice - previousClose;
  const livePercentage =
    previousClose !== 0
      ? Number(((liveDiff / previousClose) * 100).toFixed(2))
      : 0;

  return (
    <div className="container mt-5 px-4">
      <div className="level mb-6">
        <div className="level-left">
          <div>
            <button
              className="button is-small is-ghost pl-0 mb-2"
              onClick={() => navigate(-1)}
            >
              <span className="icon">
                <i className="fas fa-arrow-left"></i>
              </span>
              <span>Back to Transactions</span>
            </button>
            <h1 className="title is-3">
              {isBuy ? 'Buy' : 'Sell'}: {transaction.stock?.symbol}
            </h1>
            <p className="subtitle is-6" style={{ color: COLORS.infoText }}>
              {transaction.stock?.companyName}
            </p>
          </div>
        </div>
        <div className="level-right">
          <div className="tags has-addons">
            <span
              className="tag"
              style={{
                backgroundColor: COLORS.subtext,
                color: COLORS.background,
              }}
            >
              Transaction ID
            </span>
            <span
              className="tag"
              style={{ backgroundColor: COLORS.secondaryButton }}
            >
              #{transaction.id}
            </span>
          </div>
        </div>
      </div>

      <div className="columns is-multiline">
        <div className="column is-12">
          <div
            className={`p-5 border-radius-10`}
            style={{
              backgroundColor: COLORS.header,
            }}
          >
            <div className="level is-mobile">
              <div className="level-item has-text-centered">
                <div>
                  <p>Type</p>
                  <span
                    className={`tag`}
                    style={{
                      color: isBuy ? COLORS.success : COLORS.error,
                    }}
                  >
                    {isBuy ? 'BUY' : 'SELL'}
                  </span>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p>Total Value</p>
                  <p className="title is-4">{formatMoney(totalCost)} USD</p>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p>Quantity</p>
                  <p className="title is-4">
                    {transaction.quantity?.toFixed(4)} Shares
                  </p>
                </div>
              </div>
              <div className="level-item has-text-centered">
                <div>
                  <p>Status</p>
                  <span
                    className={`tag`}
                    style={{
                      color: transaction.isActive
                        ? COLORS.success
                        : COLORS.error,
                    }}
                  >
                    {transaction.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="column is-8">
          <div className="box border-radius-10">
            <h2 className="subtitle is-5 has-text-weight-bold">Core Details</h2>
            <hr />
            <div className="columns is-multiline">
              <div className="column is-6">
                <p
                  className="is-size-7 is-uppercase"
                  style={{ color: COLORS.infoText }}
                >
                  Date & Time
                </p>
                <p className="is-size-6 mt-1">
                  {new Date(transaction.date || '').toLocaleString()}
                </p>
              </div>
              <div className="column is-6">
                <p
                  className="is-size-7 is-uppercase"
                  style={{ color: COLORS.infoText }}
                >
                  Price per Share
                </p>
                <p className="is-size-6 mt-1 has-text-weight-semibold">
                  {formatMoney(transaction.price || 0)} USD
                </p>
              </div>
              <div className="column is-6">
                <p
                  className="is-size-7 is-uppercase"
                  style={{ color: COLORS.infoText }}
                >
                  Total Amount
                </p>
                <p className="is-size-6 mt-1">{formatMoney(totalValue)} USD</p>
              </div>
              <div className="column is-6">
                <p
                  className="is-size-7 is-uppercase"
                  style={{ color: COLORS.infoText }}
                >
                  Total Fee
                </p>
                <p className="is-size-6 mt-1" style={{ color: COLORS.error }}>
                  {formatMoney(transaction.fee || 0)} USD
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p
                className="is-size-7 is-uppercase"
                style={{ color: COLORS.infoText }}
              >
                Notes
              </p>
              <div className="notification is-light mt-2 py-3 px-4">
                {transaction.note || (
                  <span
                    className="is-italic"
                    style={{ color: COLORS.infoText }}
                  >
                    No notes added to this transaction.
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isBuy && transaction.realizedProfit != null && (
            <div
              className="box border-radius-10"
              style={{
                backgroundColor:
                  transaction.realizedProfit > 0
                    ? COLORS.successLight
                    : COLORS.errorLight,
              }}
            >
              <h2 className="subtitle is-5 has-text-weight-bold">
                Realized Performance
              </h2>
              <div className="level">
                <div className="level-left">
                  <div>
                    <p>Realized Profit/Loss</p>
                    <p
                      className={`title is-4`}
                      style={{
                        color:
                          transaction.realizedProfit > 0
                            ? COLORS.success
                            : COLORS.error,
                      }}
                    >
                      {transaction.realizedProfit > 0 ? '+' : ''}
                      {formatMoney(transaction.realizedProfit)} USD
                      <span
                        style={{ color: 'inherit', fontWeight: '600' }}
                        className="is-size-6 ml-2"
                      >
                        {profitPercentage > 0
                          ? '+' + profitPercentage.toFixed(2)
                          : profitPercentage.toFixed(2)}
                        {'%'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {relatedTransactions && (
            <div className="box border-radius-10">
              <h2 className="subtitle is-5 has-text-weight-bold">
                Related Transactions
              </h2>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '4vw' }}></th>
                    <th style={{ width: '8vw' }}>Symbol</th>
                    <th style={{ width: '10vw' }}>Date</th>
                    <th style={{ width: '10vw' }}>Price</th>
                    <th style={{ width: '10vw' }}>Quantity</th>
                    <th style={{ width: '10vw' }}>Total</th>
                    <th style={{ width: '8vw' }}>Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedTransactions
                    .filter((x) => x.id !== transaction.id)
                    .map((transaction) => (
                      <tr
                        key={transaction.id}
                        onClick={() =>
                          navigate(`/app/transactions/${transaction.id}`)
                        }
                      >
                        <td style={{ width: '4vw' }}>
                          <figure className="image is-24x24">
                            <img
                              className="border-radius-5"
                              src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${transaction.stock?.symbol}.png`}
                            />
                          </figure>
                        </td>
                        <td style={{ width: '8vw' }}>
                          {transaction.stock?.symbol}
                        </td>
                        <td style={{ width: '10vw' }}>
                          {transaction.date
                            ? new Date(transaction.date).toLocaleDateString()
                            : '-'}
                        </td>
                        <td style={{ width: '10vw' }}>
                          {transaction.price} USD
                        </td>
                        <td style={{ width: '10vw' }}>
                          {transaction.quantity}
                        </td>
                        <td style={{ width: '10vw' }}>
                          {formatMoney(
                            (transaction.price ?? 0) *
                              (transaction.quantity ?? 0) +
                              (transaction.fee ?? 0)
                          )}{' '}
                          USD
                        </td>
                        <td
                          style={{
                            color:
                              transaction.transactionType === 0
                                ? 'green'
                                : 'red',
                            width: '8vw',
                          }}
                        >
                          {transaction.transactionType === 0 ? 'Buy' : 'Sell'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="column is-4">
          <div className="box border-radius-10">
            <h2 className="subtitle is-5 has-text-weight-bold">Actions</h2>
            {/*
            <button className="button is-link is-fullwidth mb-3">
              <span className="icon">
                <i className="fas fa-edit"></i>
              </span>
              <span>Edit Transaction</span>
            </button>
            */}
            <button
              className="button is-fullwidth"
              style={{ border: `1px solid ${COLORS.error}` }}
              onClick={() => setDeleteModalOpen(true)}
            >
              <span className="icon">
                <i className="fas fa-trash"></i>
              </span>
              <span>Delete Transaction</span>
            </button>
          </div>

          <div className="box border-radius-10">
            <div className="is-flex is-align-items-center mb-3">
              <figure className="image is-32x32 mr-3">
                <img
                  style={{ borderRadius: 5 }}
                  src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${transaction.stock?.symbol}.png`}
                  alt="logo"
                />
              </figure>
              <h2 className="subtitle is-5 mb-0">
                {transaction.stock?.symbol} Market
              </h2>
            </div>
            <div className="has-text-centered py-4">
              <p>Last Known Price</p>
              <p className="title is-4">${transaction.stock?.price}</p>
              <p
                className={`is-size-7 has-text-weight-semibold`}
                style={{
                  color:
                    livePercentage > 0
                      ? COLORS.success
                      : livePercentage < 0
                        ? COLORS.error
                        : COLORS.text,
                }}
              >
                {livePercentage}% Today
              </p>
            </div>
            <button
              className="button is-small is-fullwidth"
              style={{ backgroundColor: COLORS.infoBox }}
              onClick={() =>
                navigate(`/app/stocks/${transaction.stock?.symbol}`)
              }
            >
              View Stock Details
            </button>
          </div>
        </div>
      </div>
      <TransactionDeleteModal
        open={deleteModalOpen}
        selectedTransactionId={transaction?.id}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={deleteTransaction}
      />
    </div>
  );
};

export default TransactionDetails;
