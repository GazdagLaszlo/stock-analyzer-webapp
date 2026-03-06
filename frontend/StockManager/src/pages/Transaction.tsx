import { useState } from 'react';
import type { TransactionDto } from '../../generated-sources/openapi';
import api from '../api/api';
import { formatMoney } from '../utils/formatMoney';
import TransactionDeleteModal from '../components/Transaction/TransactionDeleteModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Transaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDto>();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.Transaction.apiTransactionGetAllGet();
      return res.data;
    },
    select: (data) =>
      [...data].sort(
        (a, b) =>
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      ),
  });

  const deleteTransaction = async (id: number | undefined) => {
    if (!id) {
      return;
    }

    try {
      await api.Transaction.apiTransactionDeleteIdDelete(id);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (error) {
      alert(
        'Cannot delete this the transaction because some of the shares have already been sold.'
      );
      console.log(error);
    }
  };

  return (
    <div className="transaction is-flex is-flex-direction-column is-align-items-center">
      <h1 className="is-size-3 has-text-weight-bold has-text-centered my-6">
        Transactions
      </h1>
      {transactionsLoading ? (
        <div
          className="mt-6"
          style={{ overflowY: 'scroll', width: '100%', height: '50vh' }}
        >
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '4vw' }}></th>
                <th style={{ width: '8vw' }}>Symbol</th>
                <th style={{ width: '18vw' }}>Company name</th>
                <th style={{ width: '10vw' }}>Date</th>
                <th style={{ width: '10vw' }}>Price</th>
                <th style={{ width: '10vw' }}>Quantity</th>
                <th style={{ width: '8vw' }}>Fee</th>
                <th style={{ width: '10vw' }}>Total</th>
                <th style={{ width: '8vw' }}>Transaction</th>
                <th style={{ width: '5vw' }}>Note</th>
                <th style={{ width: '4vw' }}></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td style={{ width: '4vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '8vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '18vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '10vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '10vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '10vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '8vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '10vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '8vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '5vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                  <td style={{ width: '4vw' }}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : transactions.length === 0 ? (
        <div
          className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
          style={{ marginTop: '5vh' }}
        >
          <div className="has-text-centered py-6">
            <span className="icon is-large has-text-grey-light mb-5">
              <i className="fas fa-exchange-alt fa-3x"></i>
            </span>
            <h3 className="title is-4 pb-2">No transactions yet</h3>
            <p className="subtitle is-6 has-text-grey">
              You haven’t recorded any trades so far. <br /> Track your activity
              and start building your portfolio by adding transactions on the
              Portfolio page.
            </p>
            <button
              className="button button-navy"
              onClick={() => navigate('/app/portfolio')}
            >
              Go to Portfolio
            </button>
          </div>
        </div>
      ) : (
        <div
          className="mt-6"
          style={{ overflowY: 'scroll', width: '100%', height: '50vh' }}
        >
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '4vw' }}></th>
                <th style={{ width: '8vw' }}>Symbol</th>
                <th style={{ width: '18vw' }}>Company name</th>
                <th style={{ width: '10vw' }}>Date</th>
                <th style={{ width: '10vw' }}>Price</th>
                <th style={{ width: '10vw' }}>Quantity</th>
                <th style={{ width: '8vw' }}>Fee</th>
                <th style={{ width: '10vw' }}>Total</th>
                <th style={{ width: '8vw' }}>Transaction</th>
                <th style={{ width: '5vw' }}>Note</th>
                <th style={{ width: '4vw' }}></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
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
                  <td style={{ width: '8vw' }}>{transaction.stock?.symbol}</td>
                  <td style={{ width: '18vw' }}>
                    {transaction.stock?.companyName}
                  </td>
                  <td style={{ width: '10vw' }}>
                    {transaction.date
                      ? new Date(transaction.date).toLocaleDateString()
                      : '-'}
                  </td>
                  <td style={{ width: '10vw' }}>{transaction.price} USD</td>
                  <td style={{ width: '10vw' }}>{transaction.quantity}</td>
                  <td style={{ width: '8vw' }}>
                    {formatMoney(transaction.fee ?? 0)} USD
                  </td>
                  <td style={{ width: '10vw' }}>
                    {formatMoney(
                      (transaction.price ?? 0) * (transaction.quantity ?? 0) +
                        (transaction.fee ?? 0)
                    )}{' '}
                    USD
                  </td>
                  <td
                    style={{
                      color:
                        transaction.transactionType === 0 ? 'green' : 'red',
                      width: '8vw',
                    }}
                  >
                    {transaction.transactionType === 0 ? 'Buy' : 'Sell'}
                  </td>
                  <td style={{ width: '5vw' }}>
                    {transaction.note == '' ? '-' : transaction.note}
                  </td>
                  <td style={{ width: '4vw' }}>
                    <button
                      className="button is-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModalOpen(true);
                        setSelectedTransaction(transaction);
                      }}
                    >
                      <span className="icon">
                        <i className="fas fa-trash"></i>
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TransactionDeleteModal
        open={deleteModalOpen}
        selectedTransactionId={selectedTransaction?.id}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={deleteTransaction}
      />
    </div>
  );
};

export default Transaction;
