import { useState } from 'react';
import type {
  PortfolioDto,
  TransactionDto,
  TransactionType,
} from '../../generated-sources/openapi';
import api from '../api/api';
import { formatMoney } from '../utils/formatMoney';
import TransactionDeleteModal from '../components/Transaction/TransactionDeleteModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import TransactionModal from '../components/Portfolio/TransactionModal';
import StockImage from './StockImage';

const Transaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDto>();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<
    number | undefined
  >();
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', selectedPortfolioId],
    queryFn: async () => {
      const res = await api.Transaction.apiTransactionGetAllGet(
        undefined,
        selectedPortfolioId !== undefined ? selectedPortfolioId?.toString() : ''
      );
      return res.data;
    },
    select: (data) =>
      [...data].sort(
        (a, b) =>
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      ),
  });

  const { data: allTransactions = [] } = useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: async () => {
      const res = await api.Transaction.apiTransactionGetAllGet();
      return res.data;
    },
  });

  const { data: portfolios = [] } = useQuery<PortfolioDto[]>({
    queryKey: ['portfolios'],
    queryFn: async () => {
      const res = await api.Portfolio.apiPortfolioGetAllGet();
      return res.data;
    },
  });

  const createTransaction = async (dto: {
    price: number;
    quantity: number;
    fee: number;
    transactionType: TransactionType;
    stockId?: number;
    portfolioId: number;
    note: string;
    date: string;
  }) => {
    await api.Transaction.apiTransactionCreatePost(dto);
    queryClient.invalidateQueries({
      queryKey: ['transactions'],
    });

    setTransactionModalOpen(false);
  };

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
        <>
          <div
            className="is-flex is-justify-content-space-between"
            style={{ width: '100%' }}
          >
            <div className="field mb-0">
              <div className="control">
                <div className="select is-fullwidth" style={{ width: '20vw' }}>
                  <select
                    value={selectedPortfolioId ?? ''}
                    onChange={(e) => {
                      setSelectedPortfolioId(
                        e.target.value ? Number(e.target.value) : undefined
                      );
                    }}
                  >
                    <option value="">All portfolios</option>
                    {portfolios.map((portfolio) => (
                      <option key={portfolio.id} value={portfolio.id ?? ''}>
                        {portfolio.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              className="button button-navy"
              onClick={() => setTransactionModalOpen(true)}
            >
              Add transaction
            </button>
          </div>
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
        </>
      ) : allTransactions.length === 0 ? (
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
        <>
          <div
            className="is-flex is-justify-content-space-between mb-5"
            style={{ width: '100%' }}
          >
            <div className="field mb-0">
              <div className="control">
                <div className="select is-fullwidth" style={{ width: '20vw' }}>
                  <select
                    value={selectedPortfolioId}
                    onChange={(e) => {
                      setSelectedPortfolioId(
                        e.target.value ? Number(e.target.value) : undefined
                      );
                    }}
                  >
                    <option value="">All portfolios</option>
                    {portfolios.map((portfolio) => (
                      <option key={portfolio.id} value={portfolio.id ?? ''}>
                        {portfolio.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              className="button button-navy"
              onClick={() => setTransactionModalOpen(true)}
            >
              Add transaction
            </button>
          </div>
          <div
            className="mt-5"
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
                  <th style={{ width: '15vw' }}>Total</th>
                  <th style={{ width: '8vw' }}>Transaction</th>
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
                        <StockImage symbol={transaction.stock?.symbol ?? ''} />
                      </figure>
                    </td>
                    <td style={{ width: '8vw' }}>
                      {transaction.stock?.symbol}
                    </td>
                    <td style={{ width: '18vw' }}>
                      {transaction.stock?.companyName}
                    </td>
                    <td style={{ width: '10vw' }}>
                      {transaction.date
                        ? new Date(transaction.date).toLocaleDateString()
                        : '-'}
                    </td>
                    <td style={{ width: '10vw' }}>
                      {transaction.price?.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                      })}{' '}
                      USD
                    </td>
                    <td style={{ width: '10vw' }}>
                      {transaction.quantity?.toFixed(4)}
                    </td>
                    <td style={{ width: '8vw' }}>
                      {formatMoney(transaction.fee ?? 0)} USD
                    </td>
                    <td style={{ width: '15vw' }}>
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
                          <i className="fa-regular fa-trash-can"></i>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <TransactionDeleteModal
        open={deleteModalOpen}
        selectedTransactionId={selectedTransaction?.id}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={deleteTransaction}
      />
      <TransactionModal
        open={transactionModalOpen}
        onClose={() => {
          setTransactionModalOpen(false);
        }}
        onCreate={createTransaction}
        portfolios={portfolios}
      />
    </div>
  );
};

export default Transaction;
