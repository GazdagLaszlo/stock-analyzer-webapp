import { useQuery } from '@tanstack/react-query';
import api from '../api/api';
import { type TradeSummaryDto } from '../../generated-sources/openapi';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import InfoButton from '../components/InfoButton';

const TradeSummary = () => {
  const { data: tradeSummary } = useQuery<TradeSummaryDto>({
    queryKey: ['getTradeSummary'],
    queryFn: async () => {
      const res =
        await api.Transaction.apiTransactionGetTransactionsSummaryGet();
      return res.data;
    },
  });

  const data = [
    {
      name: 'Results',
      win: tradeSummary?.winRate,
      loss: 30,
    },
  ];

  return (
    <div>
      <div className="columns mt-5 is-variable is-0 data-boxes">
        <div className="column is-one-third data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
          <p className="box-title">Total P/L</p>
          <p
            className="subtitle mt-3 is-size-4"
            style={{
              color: tradeSummary?.totalProfitLoss
                ? tradeSummary?.totalProfitLoss > 0
                  ? 'green'
                  : tradeSummary.totalProfitLoss < 0
                    ? 'red'
                    : 'black'
                : 'black',
            }}
          >
            {tradeSummary?.totalProfitLoss
              ? tradeSummary.totalProfitLoss.toFixed(2) + ' '
              : ''}
            <span className="is-size-6" style={{ color: 'inherit' }}>
              USD
            </span>
          </p>
        </div>
        <div
          className="column is-one-third data-box is-flex is-flex-direction-column is-justify-content-center pl-5"
          style={{ paddingRight: 20 }}
        >
          <div className="is-flex is-flex-direction-row is-justify-content-space-between">
            <p className="box-title" style={{ marginBottom: 10 }}>
              Win Rate
            </p>
            <p className="box-title">{tradeSummary?.winRate?.toFixed(2)} %</p>
          </div>
          <div style={{ height: 40 }}>
            <ResponsiveContainer>
              <BarChart layout="vertical" data={data} stackOffset="expand">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />

                <Bar
                  dataKey="win"
                  stackId="a"
                  fill="#48c774"
                  radius={[4, 0, 0, 4]}
                />

                <Bar
                  dataKey="loss"
                  stackId="a"
                  fill="#ff3860"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div
        className="data-box p-4"
        style={{ width: '70%', marginBottom: '30vh' }}
      >
        <div
          className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
          style={{ height: 50, borderBottom: '1px solid lightgrey' }}
        >
          <div className="is-flex is-flex-direction-row">
            <p className="mr-1">Avg. Winning Trade</p>
            <InfoButton text="test" />
          </div>
          <p>${tradeSummary?.averageGain}</p>
        </div>
        <div
          className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
          style={{ height: 50, borderBottom: '1px solid lightgrey' }}
        >
          <div className="is-flex is-flex-direction-row">
            <p className="mr-1">Avg. Losing Trade</p>
            <InfoButton text="test" />
          </div>
          <p>${tradeSummary?.averageLoss}</p>
        </div>
        <div
          className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
          style={{ height: 50, borderBottom: '1px solid lightgrey' }}
        >
          <div className="is-flex is-flex-direction-row">
            <p className="mr-1">Avg. RRR</p>
            <InfoButton text="test" />
          </div>
          <p>1:{tradeSummary?.averageRRR?.toFixed(2)}</p>
        </div>
        <div
          className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
          style={{ height: 50, borderBottom: '1px solid lightgrey' }}
        >
          <div className="is-flex is-flex-direction-row">
            <p className="mr-1">Profit Factor</p>
            <InfoButton text="test" />
          </div>
          <p>{tradeSummary?.profitFactor?.toFixed(2)}</p>
        </div>
        <div
          className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
          style={{ height: 50, borderBottom: '1px solid lightgrey' }}
        >
          <div className="is-flex is-flex-direction-row">
            <p className="mr-1">Trades</p>
            <InfoButton text="test" />
          </div>
          <p>{tradeSummary?.totalClosedTrades}</p>
        </div>
        <div
          className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
          style={{ height: 50, borderBottom: '1px solid lightgrey' }}
        >
          <div className="is-flex is-flex-direction-row">
            <p className="mr-1">Winning Trades</p>
            <InfoButton text="test" />
          </div>
          <p>{tradeSummary?.profitableTradesCount}</p>
        </div>
        <div
          className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
          style={{ height: 50, borderBottom: '1px solid lightgrey' }}
        >
          <div className="is-flex is-flex-direction-row">
            <p className="mr-1">Losing Trades</p>
            <InfoButton text="test" />
          </div>
          <p>{tradeSummary?.losingTradesCount}</p>
        </div>
      </div>
      <div>
        <p>Total Closed Trades: {tradeSummary?.totalClosedTrades}</p>
        <p>Winning Trades: {tradeSummary?.profitableTradesCount} </p>
        <p>Losing Trades: {tradeSummary?.losingTradesCount}</p>
        <p>Win Rate: {tradeSummary?.winRate?.toFixed(2)} %</p>
        <br />
        <p>Average Gain: ${tradeSummary?.averageGain}</p>
        <p>Average Loss: ${tradeSummary?.averageLoss}</p>
        <p>Average RRR: 1 : {tradeSummary?.averageRRR?.toFixed(2)}</p>
        <br />
        <p>Profit Factor: {tradeSummary?.profitFactor}</p>
        <p>
          Best Trade: {tradeSummary?.bestTrade?.date} -{' '}
          {tradeSummary?.bestTrade?.stock?.companyName}
        </p>
        <p>
          Worst Trade: {tradeSummary?.worstTrade?.date} -{' '}
          {tradeSummary?.worstTrade?.stock?.companyName}
        </p>
      </div>

      <p style={{ marginTop: '20vh' }}>
        Itt lehetne egy statisztika (Adott időszak tranzakciói, megtérülés,...)
      </p>
      <p>Lezárt ügyletek eredményei</p>
      <p>Profit arányt megjeleniteni</p>
      <p>Legjobb/legrosszabb trade</p>

      <br />
      <br />
      <p>Vesztes/győztes tranzakciók száma</p>
      <p>Összes tranzakció száma</p>
      <p>3 legjobb tranzakció</p>

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
