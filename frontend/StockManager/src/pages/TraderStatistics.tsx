import {
  TradeInsightType,
  type TradeInsightDto,
  type TradeSummaryDto,
} from '../../generated-sources/openapi';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import InfoButton from '../components/InfoButton';
import { COLORS } from '../constants/colors';
import { useState } from 'react';
import StockImage from './StockImage';

type Props = {
  transactionsSummary?: TradeSummaryDto;
  tradeInsights?: TradeInsightDto[];
};

const TraderStatistics = ({ transactionsSummary, tradeInsights }: Props) => {
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  const toggleExpand = (tradeId: string) => {
    setSelectedTradeId((prev) => (prev === tradeId ? null : tradeId));
  };

  const data = [
    {
      name: 'Results',
      win: transactionsSummary?.winRate ?? 0,
      loss:
        transactionsSummary?.winRate != null
          ? 100 - transactionsSummary.winRate
          : 0,
    },
  ];

  const trades = [...(transactionsSummary?.closedTrades ?? [])].sort(
    (a, b) =>
      new Date(b.endDate ?? 0).getTime() - new Date(a.endDate ?? 0).getTime()
  );

  return (
    <div>
      <div className="is-flex is-flex-direction-row mt-5">
        <div
          className="is-flex is-flex-direction-column"
          style={{ width: '50%' }}
        >
          <div className="is-flex is-flex-direction-row mr-5">
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
                  color: transactionsSummary?.totalProfitLoss
                    ? transactionsSummary?.totalProfitLoss > 0
                      ? 'green'
                      : transactionsSummary.totalProfitLoss < 0
                        ? 'red'
                        : 'black'
                    : 'black',
                }}
              >
                {transactionsSummary?.totalProfitLoss == null ? (
                  '-'
                ) : (
                  <>
                    {transactionsSummary.totalProfitLoss > 0
                      ? '+' +
                        transactionsSummary.totalProfitLoss.toLocaleString(
                          'en-US',
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )
                      : transactionsSummary.totalProfitLoss.toLocaleString(
                          'en-US',
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}{' '}
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
                  {transactionsSummary?.winRate !== null
                    ? transactionsSummary?.winRate?.toFixed(2) + '%'
                    : '-'}
                </p>
              </div>
              <div style={{ height: 30 }}>
                {transactionsSummary?.winRate == null && (
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
                      fill={COLORS.success}
                      radius={[4, 0, 0, 4]}
                    />

                    <Bar
                      dataKey="loss"
                      stackId="a"
                      fill={COLORS.error}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div
            className="box mr-5 pt-0"
            style={{
              height: '60vh',
              overflowY: 'auto',
              backgroundColor: 'white',
            }}
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
              }}
            >
              <h2 className="subtitle is-5 has-text-weight-bold pt-5">
                Trade Insights
              </h2>
              <hr />
            </div>
            {tradeInsights?.length === 0 || tradeInsights === null ? (
              <div
                className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
                style={{ marginTop: '5vh' }}
              >
                <div className="has-text-centered py-6">
                  <span className="icon is-large has-text-grey-light mb-5">
                    <i className="fas fa-lightbulb fa-3x"></i>
                  </span>
                  <h3 className="is-size-4 pb-2 has-text-weight-bold">
                    No trade insights
                  </h3>
                  <p className="subtitle is-6 has-text-grey">
                    Your trading behavior looks consistent. No insights to
                    report.
                  </p>
                </div>
              </div>
            ) : (
              tradeInsights?.map((item) => (
                <div
                  className="block p-3"
                  style={{
                    borderRadius: '0px 10px 10px 0px',
                    backgroundColor:
                      item.type === TradeInsightType.NUMBER_0
                        ? COLORS.header
                        : item.type === TradeInsightType.NUMBER_1
                          ? COLORS.orangeLight
                          : COLORS.errorLight,
                    borderLeft:
                      item.type === TradeInsightType.NUMBER_0
                        ? `3px solid ${COLORS.secondaryButton}`
                        : item.type === TradeInsightType.NUMBER_1
                          ? `3px solid ${COLORS.orange}`
                          : `3px solid ${COLORS.error}`,
                  }}
                >
                  <p
                    className="has-text-weight-bold"
                    style={{ color: COLORS.text }}
                  >
                    {item.title}
                  </p>
                  <p>{item.explanation}</p>
                  <div className="is-flex is-flex-direction-row mt-2">
                    <span className="icon is-large mb-5">
                      <i className="fas fa-lightbulb"></i>
                    </span>
                    <p>{item.explanation}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div
          className="box p-5"
          style={{ width: '50%', backgroundColor: COLORS.boxBackground }}
        >
          <h2 className="subtitle is-5 has-text-weight-bold">
            Performance Summary
          </h2>
          <hr />
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Avg. Profit on Trade</p>
              <InfoButton text="Average profit from all winning trades." />
            </div>
            <p className="mr-2">
              {transactionsSummary?.averageGain
                ? '$' +
                  transactionsSummary?.averageGain?.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Avg. Loss on Trade</p>
              <InfoButton text="Average loss from all losing trades." />
            </div>
            <p className="mr-2">
              {transactionsSummary?.averageLoss
                ? '$' +
                  transactionsSummary?.averageLoss?.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })
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
              {transactionsSummary?.averageRRR
                ? '1:' + transactionsSummary?.averageRRR?.toFixed(2)
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Total Win</p>
              <InfoButton text="The total loss on unprofitable trades." />
            </div>
            <p className="mr-2">
              {transactionsSummary?.totalWin
                ? '$' + transactionsSummary?.totalWin?.toFixed(2)
                : '-'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Total Loss</p>
              <InfoButton text="The total gain on profitable trades." />
            </div>
            <p className="mr-2">
              {transactionsSummary?.totalLoss
                ? '$' + transactionsSummary?.totalLoss?.toFixed(2)
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
              {transactionsSummary?.profitFactor
                ? transactionsSummary?.profitFactor?.toFixed(2)
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
              {transactionsSummary?.totalClosedTrades
                ? transactionsSummary?.totalClosedTrades
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
              {transactionsSummary?.profitableTradesCount
                ? transactionsSummary?.profitableTradesCount
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
              {transactionsSummary?.losingTradesCount
                ? transactionsSummary?.losingTradesCount
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
              {transactionsSummary?.totalVolume
                ? '$' +
                  transactionsSummary?.totalVolume?.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {transactionsSummary?.closedTrades?.length !== 0 && (
        <div
          className="box is-flex is-justify-content-center is-flex-direction-column p-5 mt-6"
          style={{ backgroundColor: COLORS.boxBackground }}
        >
          <h2 className="subtitle is-5 has-text-weight-bold">Closed Trades</h2>
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
                  backgroundColor: COLORS.header,
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
                            <StockImage symbol={trade.stockSymbol ?? ''} />
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
                          {trade.realizedProfit?.toLocaleString('en-US', {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}{' '}
                          USD
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr key={`${trade.tradeId}-transactions`}>
                          <td
                            colSpan={7}
                            style={{
                              padding: 0,
                              backgroundColor: COLORS.header,
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
      {transactionsSummary?.bestTrade !== null && (
        <div
          className="box is-flex is-justify-content-center is-flex-direction-column p-5"
          style={{ backgroundColor: COLORS.boxBackground }}
        >
          <h2 className="subtitle is-5 has-text-weight-bold">Best Trade</h2>
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
                  backgroundColor: COLORS.header,
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
                <tr key={transactionsSummary?.bestTrade?.tradeId}>
                  <td style={{ width: '4vw' }}>
                    <figure className="image is-24x24">
                      <StockImage
                        symbol={
                          transactionsSummary?.bestTrade?.stockSymbol ?? ''
                        }
                      />
                    </figure>
                  </td>
                  <td style={{ width: '8vw' }}>
                    {transactionsSummary?.bestTrade?.stockSymbol}
                  </td>
                  <td style={{ width: '18vw' }}>
                    {transactionsSummary?.bestTrade?.stockName}
                  </td>
                  <td style={{ width: '10vw' }}>
                    {new Date(
                      transactionsSummary?.bestTrade?.startDate == undefined
                        ? '-'
                        : transactionsSummary?.bestTrade?.startDate
                    ).toLocaleDateString()}
                  </td>
                  <td style={{ width: '10vw' }}>
                    {new Date(
                      transactionsSummary?.bestTrade?.endDate == undefined
                        ? '-'
                        : transactionsSummary?.bestTrade?.endDate
                    ).toLocaleDateString()}
                  </td>
                  <td style={{ width: '10vw' }}>
                    {transactionsSummary?.bestTrade?.totalQuantity?.toFixed(4)}
                  </td>
                  <td
                    style={{
                      width: '10vw',
                      color:
                        (transactionsSummary?.bestTrade?.realizedProfit ?? 0) >
                        0
                          ? COLORS.success
                          : COLORS.error,
                    }}
                  >
                    {transactionsSummary?.bestTrade?.realizedProfit?.toLocaleString(
                      'en-US',
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }
                    )}{' '}
                    USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {transactionsSummary?.worstTrade !== null && (
        <div
          className="box is-flex is-justify-content-center is-flex-direction-column p-5"
          style={{ backgroundColor: COLORS.boxBackground }}
        >
          <h2 className="subtitle is-5 has-text-weight-bold">Worst Trade</h2>
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
              <thead style={{ backgroundColor: COLORS.header }}>
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
                <tr key={transactionsSummary?.worstTrade?.tradeId}>
                  <td style={{ width: '4vw' }}>
                    <figure className="image is-24x24">
                      <StockImage
                        symbol={
                          transactionsSummary?.worstTrade?.stockSymbol ?? ''
                        }
                      />
                    </figure>
                  </td>
                  <td style={{ width: '8vw' }}>
                    {transactionsSummary?.worstTrade?.stockSymbol}
                  </td>
                  <td style={{ width: '18vw' }}>
                    {transactionsSummary?.worstTrade?.stockName}
                  </td>
                  <td style={{ width: '10vw' }}>
                    {new Date(
                      transactionsSummary?.worstTrade?.startDate == undefined
                        ? '-'
                        : transactionsSummary?.worstTrade?.startDate
                    ).toLocaleDateString()}
                  </td>
                  <td style={{ width: '10vw' }}>
                    {new Date(
                      transactionsSummary?.worstTrade?.endDate == undefined
                        ? '-'
                        : transactionsSummary?.worstTrade?.endDate
                    ).toLocaleDateString()}
                  </td>
                  <td style={{ width: '10vw' }}>
                    {transactionsSummary?.worstTrade?.totalQuantity?.toFixed(4)}
                  </td>
                  <td
                    style={{
                      width: '10vw',
                      color:
                        (transactionsSummary?.worstTrade?.realizedProfit ?? 0) >
                        0
                          ? COLORS.success
                          : COLORS.error,
                    }}
                  >
                    {transactionsSummary?.worstTrade?.realizedProfit?.toLocaleString(
                      'en-US',
                      {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }
                    )}{' '}
                    USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraderStatistics;
