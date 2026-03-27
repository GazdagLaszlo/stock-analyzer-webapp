import type { TradeSummaryDto } from '../../generated-sources/openapi';
import InfoButton from '../components/InfoButton';
import { COLORS } from '../constants/colors';

type SectorWithNumberOfTrades = {
  sector: string;
  count: number;
};

type Props = {
  transactionsSummary?: TradeSummaryDto;
};

const InvestorStatistics = ({ transactionsSummary }: Props) => {
  const trades = transactionsSummary?.closedTrades;

  const holdingDays = trades?.map((trade) => {
    const start = new Date(trade.startDate ?? 0).getTime();
    const end = new Date(trade.endDate ?? 0).getTime();

    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return 1;
    } else {
      return days;
    }
  });

  const dayTermCount = holdingDays?.reduce(
    (x, day) => {
      if (day > 180) x.term5++;
      else if (day > 30) x.term4++;
      else if (day > 7) x.term3++;
      else if (day > 1) x.term2++;
      else x.term1++;
      return x;
    },
    { term1: 0, term2: 0, term3: 0, term4: 0, term5: 0 }
  );

  const totalHoldingDays = holdingDays?.reduce((sum, day) => {
    return sum + day;
  }, 0);

  const avgHoldingDays = (totalHoldingDays ?? 0) / (trades?.length ?? 1);

  const sectorsWithNumberOfTrades = trades?.reduce((x, trade) => {
    const sector = trade.sector || '';
    const existing = x.find((x) => x.sector === sector);
    if (existing) {
      existing.count++;
    } else {
      x.push({ sector, count: 1 });
    }

    return x;
  }, [] as SectorWithNumberOfTrades[]);

  const topSectorsWithNumberOfTrades = sectorsWithNumberOfTrades
    ?.sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const avgPositionSize =
    trades && trades.length
      ? trades?.reduce((x, trade) => {
          return x + (trade.positionSize ?? 0);
        }, 0) / trades?.length
      : 0;

  const expectedGain =
    ((transactionsSummary?.winRate ?? 0) / 100) *
    (transactionsSummary?.averageGain ?? 0);

  const expectedLoss =
    (1 - (transactionsSummary?.winRate ?? 0) / 100) *
    (transactionsSummary?.averageLoss ?? 0);

  const expectancyOnTrade = expectedGain - expectedLoss;

  return (
    <div>
      <div
        style={{ height: '20vh', width: '100%', gap: 20 }}
        className="mb-5 is-flex"
      >
        <div
          className="box is-flex is-flex-direction-column is-justify-content-center pl-5"
          style={{
            backgroundColor: COLORS.boxBackground,
            height: '20vh',
            flex: 4,
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
          className="box is-flex is-flex-direction-column is-justify-content-center pl-5  "
          style={{
            backgroundColor: COLORS.boxBackground,
            height: '20vh',
            flex: 4,
          }}
        >
          <div className="is-flex is-flex-direction-row">
            <p className="mr-1">Avg. Position Size</p>
            <InfoButton text="The average size of the positions" />
          </div>
          <p className="subtitle mt-3 is-size-4">
            {avgPositionSize.toLocaleString('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}{' '}
            <span className="is-size-6">USD</span>{' '}
          </p>
        </div>
        <div
          className="box is-flex is-flex-direction-column is-justify-content-center pl-5 "
          style={{
            backgroundColor: COLORS.boxBackground,
            height: '20vh',
            flex: 4,
          }}
        >
          <div className="is-flex is-flex-direction-row">
            <p className="mr-1">Expected return on trade</p>
            <InfoButton text="The expected on trade, based on the average gain, average loss and win rate" />
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
            {expectancyOnTrade > 0
              ? '+' +
                expectancyOnTrade.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })
              : expectancyOnTrade.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}{' '}
            <span className="is-size-6" style={{ color: 'inherit' }}>
              USD
            </span>
          </p>
        </div>
      </div>
      <div className="columns is-variable is-0 mb-6" style={{ gap: 20 }}>
        <div
          className="column box p-5 mb-0"
          style={{ backgroundColor: COLORS.boxBackground }}
        >
          <h2 className="subtitle is-5 has-text-weight-bold">Holding Time</h2>
          <hr />

          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center p-3 mb-3"
            style={{
              height: 50,
              backgroundColor: COLORS.infoBox,
              borderRadius: 10,
            }}
          >
            <div className="is-flex is-flex-direction-row">
              <p
                className="mr-1 has-text-weight-semibold is-size-6"
                style={{ color: COLORS.navy }}
              >
                Avg. Holding Time
              </p>
            </div>
            <p
              className="mr-2 has-text-weight-semibold"
              style={{ color: COLORS.navy }}
            >
              {avgHoldingDays.toFixed(0)} days
            </p>
          </div>

          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center px-3"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Intraday</p>
              <InfoButton text="0-1 days" />
            </div>
            <p className="mr-2">
              {dayTermCount?.term1}{' '}
              {dayTermCount?.term1 == 1 || dayTermCount?.term1 == 0
                ? 'trade'
                : 'trades'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center px-3"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Short-Term Trades</p>
              <InfoButton text="2-7 days" />
            </div>
            <p className="mr-2">
              {dayTermCount?.term2}{' '}
              {dayTermCount?.term2 == 1 || dayTermCount?.term2 == 0
                ? 'trade'
                : 'trades'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center px-3"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Short-Term Investments</p>
              <InfoButton text="8-30 days" />
            </div>
            <p className="mr-2">
              {dayTermCount?.term3}{' '}
              {dayTermCount?.term3 == 1 || dayTermCount?.term3 == 0
                ? 'trade'
                : 'trades'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center px-3"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Mid-Term Investment</p>
              <InfoButton text="31-180 days" />
            </div>
            <p className="mr-2">
              {dayTermCount?.term4}{' '}
              {dayTermCount?.term4 == 1 || dayTermCount?.term4 == 0
                ? 'trade'
                : 'trades'}
            </p>
          </div>
          <div
            className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center px-3"
            style={{ height: 50, borderBottom: '1px solid lightgrey' }}
          >
            <div className="is-flex is-flex-direction-row">
              <p className="mr-1">Long-Term Investments</p>
              <InfoButton text="180+ days" />
            </div>
            <p className="mr-2">
              {dayTermCount?.term5}{' '}
              {dayTermCount?.term5 == 1 || dayTermCount?.term5 == 0
                ? 'trade'
                : 'trades'}
            </p>
          </div>
        </div>
        <div
          className="column box p-5"
          style={{ backgroundColor: COLORS.boxBackground }}
        >
          <h2 className="subtitle is-5 has-text-weight-bold">Top sectors</h2>
          <hr />
          {topSectorsWithNumberOfTrades?.map((item) => (
            <div
              className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
              style={{ height: 50, borderBottom: '1px solid lightgrey' }}
            >
              <div className="is-flex is-flex-direction-row">
                <p className="mr-1">{item.sector}</p>
              </div>
              <p className="mr-2">
                {item.count}{' '}
                {item.count == 1 || item.count == 0 ? 'trade' : 'trades'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorStatistics;
