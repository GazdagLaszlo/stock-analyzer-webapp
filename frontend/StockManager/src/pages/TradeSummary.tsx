import { useQuery } from '@tanstack/react-query';
import api from '../api/api';
import { TransactionType } from '../../generated-sources/openapi';
import { useMemo } from 'react';

const TradeSummary = () => {
  const {
    data: transactions = [],
    /*
    isLoading,
    isError,
    error,
    refetch,
    */
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.Transaction.apiTransactionGetAllGet(
        TransactionType.NUMBER_1
      );
      return res.data;
    },
  });

  const stats = useMemo(() => {
    const totalProfit = transactions.reduce(
      (sum, t) => sum + (t.realizedProfit ?? 0),
      0
    );

    const sortedByRealizedProfit = [...transactions].sort(
      (a, b) => (b.realizedProfit ?? 0) - (a.realizedProfit ?? 0)
    );
    const bestTrade = sortedByRealizedProfit[0];
    const worstTrade =
      sortedByRealizedProfit[sortedByRealizedProfit.length - 1];

    const wins = transactions.filter((t) => (t.realizedProfit ?? 0) > 0).length;
    const winRate =
      transactions.length > 0 ? (wins / transactions.length) * 100 : 0;

    return { totalProfit, bestTrade, worstTrade, winRate };
  }, [transactions]);
  return (
    <div>
      <div className="columns mt-5 is-variable is-0 data-boxes">
        <div className="column is-one-third data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
          <p className="box-title">Total Profit/Loss</p>
          <p
            className="subtitle mt-3 is-size-4"
            style={{
              color:
                stats.totalProfit > 0
                  ? 'green'
                  : stats.totalProfit < 0
                    ? 'red'
                    : 'black',
            }}
          >
            {stats.totalProfit.toFixed(2) + ' '}
            <span className="is-size-6" style={{ color: 'inherit' }}>
              USD
            </span>
          </p>
        </div>
      </div>

      <p style={{ marginTop: '20vh' }}>
        Itt lehetne egy statisztika (Adott időszak tranzakciói, megtérülés,...)
      </p>
      <p>Lezárt ügyletek eredményei</p>
      <p>Profit arányt megjeleniteni</p>
      <p>Legjobb/legrosszabb trade</p>

      <table className="table mt-6">
        <thead>
          <tr>
            <th>Date</th>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Selling price</th>
            <th>Buy price (avg)</th>
            <th>Fees</th>
            <th>Profit</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default TradeSummary;
