import {
  type StockDataDto,
  type StockDto,
} from '../../../../generated-sources/openapi';
import { formatMoney } from '../../../utils/formatMoney';
import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/api';

const Summary = ({
  stock,
  data,
}: {
  stock?: StockDto;
  data?: { [key: string]: number | null };
}) => {
  const [stockData, setStockData] = useState<StockDataDto>();
  const [PEIndustryAvg, setPEIndustryAvg] = useState<number | null>(null);

  useEffect(() => {
    if (stock?.symbol) {
      api.StockData.apiStockDataGetBySymbolGet(stock?.symbol)
        .then((res) => {
          setStockData(res.data);
        })
        .catch((error) => {
          console.error('Error while loading stockData: ', error);
        });
    }
  }, [stock]);

  useEffect(() => {
    getPEIndustryAvg();
  }, [stock]);

  const getEPSGrowthYoY = useMemo(() => {
    const currentEPSData = stockData?.stockDataItems?.filter(
      (x) => x.periodType == 1 && x.metricName?.toLowerCase() == 'eps'
    );
    if (currentEPSData) {
      currentEPSData.sort(
        (a, b) =>
          new Date(a.period ?? 0).getTime() - new Date(b.period ?? 0).getTime()
      );
    }

    const currentEPS = currentEPSData
      ? currentEPSData[currentEPSData.length - 1]
      : null;
    const previousEPS = currentEPSData
      ? currentEPSData[currentEPSData.length - 5]
      : null;

    if (currentEPS?.v && previousEPS?.v) {
      if (previousEPS.v < 0 || currentEPS.v < 0) {
        return { type: 'absolute', value: currentEPS.v - previousEPS.v };
      } else {
        return {
          type: 'percent',
          value: (currentEPS.v / previousEPS.v - 1) * 100,
        };
      }
    }
  }, [stockData]);

  const getPEIndustryAvg = async () => {
    if (!stock?.symbol) {
      return;
    }

    const getPeers = await api.Stock.apiStockGetCompanyPeersGet(stock?.symbol);
    const peers = getPeers.data;

    const pePromises = peers.map(async (symbol) => {
      try {
        const getStockData =
          await api.StockData.apiStockDataGetBySymbolGet(symbol);
        return getStockData.data.pettm ?? null;
      } catch (error) {
        console.log('No stockData found to ' + symbol, error);
        return null;
      }
    });
    const peValues = await Promise.all(pePromises);
    const validPeValues = peValues.filter((pe): pe is number => pe !== null);

    if (validPeValues.length > 5) {
      const sum = validPeValues.reduce((acc, val) => acc + val, 0);
      setPEIndustryAvg(sum / validPeValues.length);
    }
  };

  return (
    <div className="stockview">
      <div className="columns mt-5 is-variable is-0 data-boxes is-flex-wrap-wrap">
        <div
          className="column box is-flex is-flex-direction-column p-5"
          style={{ height: 160 }}
        >
          <p className="box-title">MARKET CAPITALIZATION</p>
          <div
            className="is-flex is-align-items-center"
            style={{ height: '100%' }}
          >
            <span className="subtitle is-size-4">
              {formatMoney(stock?.marketCap ?? 0)}{' '}
              <span className="is-size-6">USD</span>
            </span>
          </div>
        </div>
        <div
          className="column box px-3 is-flex is-flex-direction-column p-5"
          style={{ height: 160, minWidth: 320 }}
        >
          <p className="box-title" style={{ color: '' }}>
            EPS ANALYSIS
          </p>

          <div
            className="is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between"
            style={{ height: '100%' }}
          >
            <div
              style={{ borderRight: '1px solid lightgrey' }}
              className="column p-2 is-flex is-flex-direction-column is-align-items-center"
            >
              <p className="subtitle is-size-4 mb-3">
                {stockData?.epsTTM?.toFixed(2)}{' '}
                <span className="is-size-6">USD</span>
              </p>
              <p className="box-title">EPS (TTM)</p>
            </div>
            <div className="column p-2 is-flex is-flex-direction-column is-align-items-center">
              <p
                style={{
                  color: getEPSGrowthYoY
                    ? getEPSGrowthYoY.value > 0
                      ? 'green'
                      : 'red'
                    : 'black',
                }}
                className="is-size-4 subtitle has-text-centered mb-3"
              >
                {getEPSGrowthYoY ? (
                  getEPSGrowthYoY?.type == 'percent' ? (
                    (getEPSGrowthYoY.value >= 0 ? '+' : '') +
                    getEPSGrowthYoY?.value?.toFixed(2) +
                    '%'
                  ) : (
                    <>
                      {(getEPSGrowthYoY.value >= 0 ? '+' : '') +
                        getEPSGrowthYoY.value.toFixed(2)}
                      <span className="is-size-6" style={{ color: 'inherit' }}>
                        {' '}
                        USD
                      </span>
                    </>
                  )
                ) : (
                  '-'
                )}{' '}
              </p>
              <p className="box-title">EPS GROWTH (YoY)</p>
            </div>
          </div>
        </div>
        <div
          className="column box px-3 is-flex is-flex-direction-column p-5"
          style={{ height: 160, minWidth: 300 }}
        >
          <p className="box-title ml-3" style={{ color: '' }}>
            P/E ANALYSIS
          </p>

          <div
            className="is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between"
            style={{ height: '100%' }}
          >
            <div
              style={{ borderRight: '1px solid lightgrey' }}
              className="column p-2 is-flex is-flex-direction-column is-align-items-center"
            >
              <p className="subtitle is-size-4 mb-3">
                {stockData?.pettm?.toFixed(2)}
              </p>
              <p className="box-title">P/E (TTM)</p>
            </div>
            <div className="column p-2 is-flex is-flex-direction-column is-align-items-center">
              <p className="is-size-4 subtitle has-text-centered mb-3">
                {PEIndustryAvg ? PEIndustryAvg.toFixed(2) : '-'}
              </p>
              <p className="box-title">SECTOR AVG P/E</p>
            </div>
          </div>
        </div>
        <div
          className="column box is-flex is-flex-direction-column p-5"
          style={{ height: 160 }}
        >
          <p className="box-title">CURRENT DIVIDEND YIELD (TTM)</p>
          <div
            className="is-flex is-align-items-center"
            style={{ height: '100%' }}
          >
            <p className="subtitle is-size-4">
              {stockData?.currentDividendYieldTTM != 0
                ? stockData?.currentDividendYieldTTM?.toFixed(2) + '%'
                : '-'}
            </p>
          </div>
        </div>
      </div>
      {/*Fejlesztési lehetőség lesz, hogy minden negyedéves és éves eredmény megjelenítésre kerül.*/}
      {/*Jelenleg az utolsó negyedéves adatok megjelenítve*/}
      <div className="box p-5 mt-5">
        <p className="subtitle is-5 has-text-weight-bold">Profitability</p>
        <hr />
        <table className="table financials-table is-fullwidth">
          <tbody>
            <tr>
              <td>Net Margin</td>
              <td>
                {data?.netMargin != null
                  ? (data?.netMargin * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Gross Margin</td>
              <td>
                {data?.grossMargin != null
                  ? (data.grossMargin * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Operating Margin</td>
              <td>
                {data?.operatingMargin != null
                  ? (data.operatingMargin * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Pretax Margin</td>
              <td>
                {data?.pretaxMargin != null
                  ? (data.pretaxMargin * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Free Cash Flow Margin</td>
              <td>
                {data?.fcfMargin != null
                  ? (data.fcfMargin * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Return on Equity (TTM)</td>
              <td>
                {data?.roeTTM != null
                  ? (data.roeTTM * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Return on Assets (TTM)</td>
              <td>
                {data?.roaTTM != null
                  ? (data.roaTTM * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Return on Invested Capital (TTM)</td>
              <td>
                {data?.roicTTM != null
                  ? (data.roicTTM * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Return on Total Capital (TTM)</td>
              <td>
                {data?.rotcTTM != null
                  ? (data.rotcTTM * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Earnings per Share</td>
              <td>
                {data?.eps != null
                  ? data.eps.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
                {data?.eps != null && (
                  <span className="is-size-6 ml-1">USD</span>
                )}
              </td>
            </tr>
            <tr>
              <td>EBIT per Share</td>
              <td>
                {data?.ebitPerShare != null
                  ? data.ebitPerShare.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
                {data?.ebitPerShare != null && (
                  <span className="is-size-6 ml-1">USD</span>
                )}
              </td>
            </tr>
            <tr>
              <td>SG&A to Sales</td>
              <td>
                {data?.sgaToSale != null
                  ? (data.sgaToSale * 100).toFixed(2) + '%'
                  : '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="box p-5 mt-5">
        <p className="subtitle is-5 has-text-weight-bold">
          Financial stability
        </p>
        <hr />
        <div>
          <table className="table financials-table is-fullwidth">
            <tbody>
              <tr>
                <td>Current Ratio</td>
                <td>
                  {data?.currentRatio != null
                    ? data.currentRatio.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Quick Ratio</td>
                <td>
                  {data?.quickRatio != null
                    ? data.quickRatio.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Cash Ratio</td>
                <td>
                  {data?.cashRatio != null
                    ? data.cashRatio.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Total Ratio</td>
                <td>
                  {data?.totalRatio != null
                    ? data.totalRatio.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Total Debt to Equity</td>
                <td>
                  {data?.totalDebtToEquity != null
                    ? data.totalDebtToEquity.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Total Debt to Total Assets</td>
                <td>
                  {data?.totalDebtToTotalAsset != null
                    ? data.totalDebtToTotalAsset.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Total Debt to Total Capital</td>
                <td>
                  {data?.totalDebtToTotalCapital != null
                    ? data.totalDebtToTotalCapital.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Long-term Debt to Equity</td>
                <td>
                  {data?.longtermDebtTotalEquity != null
                    ? data.longtermDebtTotalEquity.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Long-term Debt to Assets</td>
                <td>
                  {data?.longtermDebtTotalAsset != null
                    ? data.longtermDebtTotalAsset.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Long-term Debt to Capital</td>
                <td>
                  {data?.longtermDebtTotalCapital != null
                    ? data.longtermDebtTotalCapital.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Net Debt to Equity</td>
                <td>
                  {data?.netDebtToTotalEquity != null
                    ? data.netDebtToTotalEquity.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Net Debt to Capital</td>
                <td>
                  {data?.netDebtToTotalCapital != null
                    ? data.netDebtToTotalCapital.toLocaleString('en-US', {
                        maximumFractionDigits: 4,
                      })
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>Book Value</td>
                <td>
                  {data?.bookValue != null
                    ? data.bookValue.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                      })
                    : '-'}
                  {data?.bookValue != null && (
                    <span className="is-size-6 ml-1">USD</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>Tangible Book Value</td>
                <td>
                  {data?.tangibleBookValue != null
                    ? data.tangibleBookValue.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                      })
                    : '-'}
                  {data?.tangibleBookValue != null && (
                    <span className="is-size-6 ml-1">USD</span>
                  )}
                </td>
              </tr>

              {/************************** */}
              <tr>
                <td>Cash flow per Share</td>
                <td>{stockData?.cashFlowPerShareTTM?.toFixed(4)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="box p-5 mt-5">
        <p className="subtitle is-5 has-text-weight-bold">Valuation metrics</p>
        <hr />
        <table className="table financials-table is-fullwidth mt-6">
          <tbody>
            <tr>
              <td className="">52 week range:</td>
              <td style={{ height: '10vh' }}>
                <div className="is-flex">
                  <span className="has-text-weight-bold">
                    {stockData?.yearLow}
                  </span>
                  <div className="range-box mx-2 is-flex is-align-items-center">
                    <div className="range"></div>
                    <div
                      className="current-position-marker"
                      style={{
                        left: `${
                          stock?.price &&
                          stockData?.yearHigh &&
                          stockData?.yearLow
                            ? ((stock.price - stockData.yearLow) /
                                (stockData.yearHigh - stockData.yearLow)) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                    <span
                      className="current-value has-text-weight-bold"
                      style={{
                        left: `${
                          stock?.price &&
                          stockData?.yearHigh &&
                          stockData?.yearLow
                            ? ((stock.price - stockData.yearLow) /
                                (stockData.yearHigh - stockData.yearLow)) *
                              100
                            : 0
                        }%`,
                      }}
                    >
                      {stock?.price}
                    </span>
                  </div>
                  <span className="has-text-weight-bold">
                    {stockData?.yearHigh}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>P/E (TTM)</td>
              <td>
                {data?.peTTM != null
                  ? data.peTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Price to Book Value</td>
              <td>
                {data?.pb != null
                  ? data.pb.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Price to Tangible Book Value</td>
              <td>
                {data?.ptbv != null
                  ? data.ptbv.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Price to Sales (TTM)</td>
              <td>
                {data?.psTTM != null
                  ? data.psTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Price to Cash Flow (TTM)</td>
              <td>
                {data?.pcfTTM != null
                  ? data.pcfTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Enterprise Value</td>
              <td>
                {data?.ev != null ? formatMoney(data?.ev * 1000000) : '-'}
              </td>
            </tr>
            <tr>
              <td>Enterprise Value to EBITDA (TTM)</td>
              <td>
                {data?.evEbitdaTTM != null
                  ? data.evEbitdaTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Enterprise Value to Revenue (TTM)</td>
              <td>
                {data?.evRevenueTTM != null
                  ? data.evRevenueTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Free Cash Flow per Share (TTM)</td>
              <td>
                {data?.fcfPerShareTTM != null
                  ? data.fcfPerShareTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })
                  : '-'}
                {data?.fcfPerShareTTM != null && (
                  <span className="is-size-6 ml-1">USD</span>
                )}
              </td>
            </tr>
            <tr>
              <td>Revenue per Share</td>
              <td>
                {data?.salesPerShare != null
                  ? data.salesPerShare.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })
                  : '-'}
                {data?.salesPerShare != null && (
                  <span className="is-size-6 ml-1">USD</span>
                )}
              </td>
            </tr>
            <tr>
              <td>Dividend yield per Share</td>
              <td>
                {stockData?.dividendPerShareTTM != null
                  ? stockData.dividendPerShareTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })
                  : '-'}
                {stockData?.dividendPerShareTTM != null && (
                  <span className="is-size-6 ml-1">USD</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="box p-5 mt-5">
        <p className="subtitle is-5 has-text-weight-bold">
          Efficiency & Activity
        </p>
        <hr />
        <table className="table financials-table is-fullwidth mt-6">
          <tbody>
            <tr>
              <td>Asset Turnover (TTM)</td>
              <td>
                {data?.assetTurnoverTTM != null
                  ? data.assetTurnoverTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Inventory Turnover (TTM)</td>
              <td>
                {data?.inventoryTurnoverTTM != null
                  ? data.inventoryTurnoverTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Receivables Turnover (TTM)</td>
              <td>
                {data?.receivablesTurnoverTTM != null
                  ? data.receivablesTurnoverTTM.toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Payout Ratio (TTM)</td>
              <td>
                {data?.payoutRatioTTM != null
                  ? (data.payoutRatioTTM * 100).toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    }) + '%'
                  : '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Summary;
