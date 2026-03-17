import { useQuery } from '@tanstack/react-query';
import api from '../api/api';
import { type TradeSummaryDto } from '../../generated-sources/openapi';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import InfoButton from '../components/InfoButton';
import { COLORS } from '../constants/colors';
import { useState } from 'react';

const TradeSummary = () => {
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  const toggleExpand = (tradeId: string) => {
    setSelectedTradeId((prev) => (prev === tradeId ? null : tradeId));
  };

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
      win: tradeSummary?.winRate ?? 0,
      loss: tradeSummary?.winRate != null ? 100 - tradeSummary.winRate : 0,
    },
  ];

  const trades = [...(tradeSummary?.closedTrades ?? [])].sort(
    (a, b) =>
      new Date(b.endDate ?? 0).getTime() - new Date(a.endDate ?? 0).getTime()
  );

  return (
    <div>
      <div className="is-flex is-flex-direction-row mt-5">
        <div
          style={{ flex: 6, height: '20vh' }}
          className="is-flex is-flex-direction-row mr-5"
        >
          <div
            className="box is-flex is-flex-direction-column is-justify-content-center pl-5 mr-4"
            style={{
              flex: 6,
              backgroundColor: COLORS.boxBackground,
              height: '20vh',
            }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Total P/L</p>
              <InfoButton text="Total profit/loss on closed trades." />
            </div>
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
              {tradeSummary?.totalProfitLoss == null ? (
                '-'
              ) : (
                <>
                  {tradeSummary.totalProfitLoss.toFixed(2)}{' '}
                  <span className="is-size-6" style={{ color: 'inherit' }}>
                    USD
                  </span>
                </>
              )}
            </p>
          </div>
          <div
            className="is-one-third box is-flex is-flex-direction-column is-justify-content-center pl-5"
            style={{
              paddingRight: 20,
              flex: 6,
              backgroundColor: COLORS.boxBackground,
              height: '20vh',
            }}
          >
            <div className="is-flex is-flex-direction-row is-justify-content-space-between">
              <p className="box-title ml-1" style={{ marginBottom: 10 }}>
                Win Rate
              </p>
              <p className="box-title mr-2">
                {tradeSummary?.winRate !== null
                  ? tradeSummary?.winRate?.toFixed(2) + '%'
                  : '-'}
              </p>
            </div>
            <div style={{ height: 30 }}>
              {tradeSummary?.winRate == null && (
                <p
                  style={{
                    color: COLORS.infoText,
                    textAlign: 'center',
                    marginTop: 10,
                  }}
                >
                  No data yet
                </p>
              )}
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
          className="box p-5"
          style={{ flex: 6, backgroundColor: COLORS.boxBackground }}
        >
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Avg. Winning Trade</p>
              <InfoButton text="Average profit from all winning trades." />
            </div>
            <p className="mr-2">
              {tradeSummary?.averageGain
                ? '$' + tradeSummary?.averageGain?.toFixed(2)
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Avg. Losing Trade</p>
              <InfoButton text="Average loss from all losing trades." />
            </div>
            <p className="mr-2">
              {tradeSummary?.averageLoss
                ? '$' + tradeSummary?.averageLoss?.toFixed(2)
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Avg. RRR</p>
              <InfoButton text="Average Risk/Reward Ratio of closed trades." />
            </div>
            <p className="mr-2">
              {tradeSummary?.averageRRR
                ? '1:' + tradeSummary?.averageRRR?.toFixed(2)
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Profit Factor</p>
              <InfoButton text="Ratio of gross profit to gross loss. Values above 1 indicate profitability." />
            </div>
            <p className="mr-2">
              {tradeSummary?.profitFactor
                ? tradeSummary?.profitFactor?.toFixed(2)
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Trades</p>
              <InfoButton text="Total number of closed trades." />
            </div>
            <p className="mr-2">
              {tradeSummary?.totalClosedTrades
                ? tradeSummary?.totalClosedTrades
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Winning Trades</p>
              <InfoButton text="Number of profitable closed trades." />
            </div>
            <p className="mr-2">
              {tradeSummary?.profitableTradesCount
                ? tradeSummary?.profitableTradesCount
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Losing Trades</p>
              <InfoButton text="Number of losing closed trades." />
            </div>
            <p className="mr-2">
              {tradeSummary?.losingTradesCount
                ? tradeSummary?.losingTradesCount
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Total Volume</p>
              <InfoButton text="Total traded value across all transactions, including fees." />
            </div>
            <p className="mr-2">
              {tradeSummary?.totalVolume
                ? '$' + tradeSummary?.totalVolume?.toFixed(2)
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {tradeSummary?.closedTrades?.length !== 0 && (
        <div
          className="box is-flex is-justify-content-center is-flex-direction-column p-5 mt-6"
          style={{ backgroundColor: COLORS.boxBackground }}
        >
          <p className="has-text-centered subtitle is-size-5 mb-3">Trades</p>
          <div
            style={{
              borderRadius: 10,
              border: '1px solid lightgrey',
              overflow: 'hidden',
              backgroundColor: COLORS.background,
            }}
          >
            <table
              className="table"
              style={{
                backgroundColor: COLORS.background,
                width: '100%',
              }}
            >
              <thead
                style={{
                  backgroundColor: COLORS.tableHeader,
                }}
              >
                <tr>
                  <th></th>
                  <th>Symbol</th>
                  <th>Company name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Quantity</th>
                  <th>Realized P/L</th>
                </tr>
              </thead>
              <tbody>
                {trades?.map((trade) => {
                  const isExpanded = selectedTradeId === trade.tradeId;
                  return (
                    <>
                      <tr
                        key={trade.tradeId}
                        onClick={() => toggleExpand(trade.tradeId!)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ width: '4vw' }}>
                          <figure className="image is-24x24">
                            <img
                              className="border-radius-5"
                              src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${trade.stockSymbol}.png`}
                            />
                          </figure>
                        </td>
                        <td style={{ width: '8vw' }}>{trade.stockSymbol}</td>
                        <td style={{ width: '18vw' }}>{trade.stockName}</td>
                        <td style={{ width: '10vw' }}>
                          {new Date(
                            trade.startDate == undefined ? '-' : trade.startDate
                          ).toLocaleDateString()}
                        </td>
                        <td style={{ width: '10vw' }}>
                          {new Date(
                            trade.endDate == undefined ? '-' : trade.endDate
                          ).toLocaleDateString()}
                        </td>
                        <td style={{ width: '10vw' }}>
                          {trade.totalQuantity?.toFixed(4)}
                        </td>
                        <td
                          style={{
                            width: '10vw',
                            color:
                              trade.realizedProfit! > 0
                                ? COLORS.success
                                : COLORS.error,
                          }}
                        >
                          {trade.realizedProfit?.toFixed(2)} USD
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${trade.tradeId}-transactions`}>
                          <td
                            colSpan={7}
                            style={{
                              padding: 0,
                              backgroundColor: COLORS.tableHeader,
                            }}
                          >
                            <div
                              style={{ animation: 'expandRow 0.2s ease-out' }}
                            >
                              <table
                                className="table is-fullwidth is-size-7"
                                style={{
                                  backgroundColor: 'transparent',
                                  margin: 0,
                                }}
                              >
                                <thead>
                                  <tr style={{ opacity: 0.6 }}>
                                    <th
                                      style={{
                                        width: '4vw',
                                        background: 'transparent',
                                      }}
                                    />
                                    <th
                                      style={{
                                        width: '8vw',
                                        background: 'transparent',
                                      }}
                                    >
                                      Type
                                    </th>
                                    <th
                                      style={{
                                        width: '18vw',
                                        background: 'transparent',
                                      }}
                                    >
                                      Date
                                    </th>
                                    <th
                                      style={{
                                        width: '10vw',
                                        background: 'transparent',
                                      }}
                                    >
                                      Price
                                    </th>
                                    <th
                                      style={{
                                        width: '10vw',
                                        background: 'transparent',
                                      }}
                                    >
                                      Quantity
                                    </th>
                                    <th
                                      style={{
                                        width: '10vw',
                                        background: 'transparent',
                                      }}
                                    >
                                      Fee
                                    </th>
                                    <th
                                      style={{
                                        width: '10vw',
                                        background: 'transparent',
                                      }}
                                    >
                                      Realized P/L
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {trade.transactions?.map((transaction) => (
                                    <tr key={transaction.id}>
                                      <td
                                        style={{
                                          width: '4vw',
                                        }}
                                      />
                                      <td
                                        style={{
                                          width: '8vw',
                                        }}
                                      >
                                        <span
                                          style={{
                                            color:
                                              transaction.transactionType === 0
                                                ? COLORS.success
                                                : COLORS.error,
                                          }}
                                        >
                                          {transaction.transactionType === 0
                                            ? 'Buy'
                                            : 'Sell'}
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          width: '18vw',
                                        }}
                                      >
                                        {new Date(
                                          transaction.date!
                                        ).toLocaleDateString()}
                                      </td>
                                      <td
                                        style={{
                                          width: '10vw',
                                        }}
                                      >
                                        {transaction.price?.toFixed(2)} USD
                                      </td>
                                      <td
                                        style={{
                                          width: '10vw',
                                        }}
                                      >
                                        {transaction.quantity?.toFixed(4)}
                                      </td>
                                      <td
                                        style={{
                                          width: '10vw',
                                        }}
                                      >
                                        {transaction.fee != null
                                          ? `${transaction.fee.toFixed(2)} USD`
                                          : '—'}
                                      </td>
                                      <td
                                        style={{
                                          width: '10vw',
                                          color:
                                            (transaction.realizedProfit ?? 0) >
                                            0
                                              ? COLORS.success
                                              : COLORS.error,
                                        }}
                                      >
                                        {transaction.transactionType === 1
                                          ? `${transaction.realizedProfit?.toFixed(2)} USD`
                                          : '—'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(tradeSummary?.bestTrade !== null ||
        tradeSummary.worstTrade !== null) && (
        <div
          className="box is-flex is-justify-content-center is-flex-direction-column p-5 mt-6"
          style={{ backgroundColor: COLORS.boxBackground }}
        >
          {tradeSummary?.bestTrade !== null && (
            <>
              <p className="has-text-centered subtitle is-size-5 mb-3">
                Best Trade
              </p>
              <div
                style={{
                  borderRadius: 10,
                  border: '1px solid lightgrey',
                  overflow: 'hidden',
                  backgroundColor: COLORS.background,
                }}
              >
                <table
                  className="table"
                  style={{
                    backgroundColor: COLORS.background,
                    width: '100%',
                  }}
                >
                  <thead
                    style={{
                      backgroundColor: COLORS.tableHeader,
                    }}
                  >
                    <tr>
                      <th></th>
                      <th>Symbol</th>
                      <th>Company name</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Quantity</th>
                      <th>Realized P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={tradeSummary?.bestTrade?.tradeId}>
                      <td style={{ width: '4vw' }}>
                        <figure className="image is-24x24">
                          <img
                            className="border-radius-5"
                            src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${tradeSummary?.bestTrade?.stockSymbol}.png`}
                          />
                        </figure>
                      </td>
                      <td style={{ width: '8vw' }}>
                        {tradeSummary?.bestTrade?.stockSymbol}
                      </td>
                      <td style={{ width: '18vw' }}>
                        {tradeSummary?.bestTrade?.stockName}
                      </td>
                      <td style={{ width: '10vw' }}>
                        {new Date(
                          tradeSummary?.bestTrade?.startDate == undefined
                            ? '-'
                            : tradeSummary?.bestTrade?.startDate
                        ).toLocaleDateString()}
                      </td>
                      <td style={{ width: '10vw' }}>
                        {new Date(
                          tradeSummary?.bestTrade?.endDate == undefined
                            ? '-'
                            : tradeSummary?.bestTrade?.endDate
                        ).toLocaleDateString()}
                      </td>
                      <td style={{ width: '10vw' }}>
                        {tradeSummary?.bestTrade?.totalQuantity?.toFixed(4)}
                      </td>
                      <td style={{ width: '10vw' }}>
                        {tradeSummary?.bestTrade?.realizedProfit?.toFixed(2)}{' '}
                        USD
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          {tradeSummary?.worstTrade !== null && (
            <>
              <p className="has-text-centered subtitle is-size-5 mb-3 mt-5">
                Worst Trade
              </p>
              <div
                className="py-1"
                style={{
                  borderRadius: 10,
                  border: '1px solid lightgrey',
                  overflow: 'hidden',
                  backgroundColor: COLORS.background,
                }}
              >
                <table
                  className="table"
                  style={{
                    backgroundColor: COLORS.background,
                    width: '100%',
                  }}
                >
                  <thead>
                    <tr>
                      <th></th>
                      <th>Symbol</th>
                      <th>Company name</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Quantity</th>
                      <th>Realized P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={tradeSummary?.worstTrade?.tradeId}>
                      <td style={{ width: '4vw' }}>
                        <figure className="image is-24x24">
                          <img
                            className="border-radius-5"
                            src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${tradeSummary?.worstTrade?.stockSymbol}.png`}
                          />
                        </figure>
                      </td>
                      <td style={{ width: '8vw' }}>
                        {tradeSummary?.worstTrade?.stockSymbol}
                      </td>
                      <td style={{ width: '18vw' }}>
                        {tradeSummary?.worstTrade?.stockName}
                      </td>
                      <td style={{ width: '10vw' }}>
                        {new Date(
                          tradeSummary?.worstTrade?.startDate == undefined
                            ? '-'
                            : tradeSummary?.worstTrade?.startDate
                        ).toLocaleDateString()}
                      </td>
                      <td style={{ width: '10vw' }}>
                        {new Date(
                          tradeSummary?.worstTrade?.endDate == undefined
                            ? '-'
                            : tradeSummary?.worstTrade?.endDate
                        ).toLocaleDateString()}
                      </td>
                      <td style={{ width: '10vw' }}>
                        {tradeSummary?.worstTrade?.totalQuantity?.toFixed(4)}
                      </td>
                      <td style={{ width: '10vw' }}>
                        {tradeSummary?.worstTrade?.realizedProfit?.toFixed(2)}{' '}
                        USD
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TradeSummary;
