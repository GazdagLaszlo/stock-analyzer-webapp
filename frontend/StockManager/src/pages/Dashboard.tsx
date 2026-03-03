import { useContext } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { useQuery } from '@tanstack/react-query';
import { PortfolioContext } from '../context/PortfolioContext';

const Dashboard = () => {
  const portfolioContext = useContext(PortfolioContext);
  if (!portfolioContext) {
    throw new Error('PortfolioContext not found');
  }
  const { portfolios, getPortfolioValue, getTotalInvested, getTotalProfit } =
    portfolioContext;

  const navigate = useNavigate();

  const { data: stockNews = [], isLoading: stockNewsLoading } = useQuery({
    queryKey: ['stockNews'],
    queryFn: async () => {
      const res = await api.StockNews.apiStockNewsGetNewsGet();
      return res.data;
    },
  });

  return (
    <div className="dashboard">
      {/*<p>Itt kellene egy rövid bemutató a fő funkciókról, kiemelendő elemekről. (Miért a StockManager?)</p>*/}

      {portfolios.length > 0 && (
        <p className="subtitle mt-6 pb-3 box-header">Portfolios</p>
      )}
      <div
        className="columns mt-5 is-variable is-0 data-boxes"
        style={{ overflowX: 'auto' }}
      >
        {portfolios.length > 0 &&
          portfolios.map((portfolio) => {
            const portfolioValue = getPortfolioValue(portfolio);
            const totalProfit = getTotalProfit(portfolio);
            const totalInvested = getTotalInvested(portfolio);

            const changePercent =
              ((totalProfit ?? 0) / (totalInvested ?? 1)) * 100;

            return (
              <div
                key={portfolio.id}
                className="box is-flex is-flex-direction-column is-justify-content-space-between p-5"
                style={{ height: '23vh', cursor: 'pointer' }}
                onClick={() => navigate(`/app/portfolio/${portfolio.id}`)}
              >
                <p className="is-size-5 mb-4">{portfolio.name}</p>
                <div className="is-flex flex-direction-row is-justify-content-space-between">
                  <div className="mr-6">
                    <p className="box-title">Total value</p>
                    {portfolioValue ? (
                      <span className="subtitle mt- is-size-4">
                        {portfolioValue?.toFixed(2)}{' '}
                        <span className="is-size-6">USD</span>
                      </span>
                    ) : (
                      <span className="subtitle mt-3 is-size-4">-</span>
                    )}
                  </div>
                  <div>
                    <p className="box-title">Unrealized profit</p>
                    {totalProfit ? (
                      <span
                        className="subtitle mt- is-size-4"
                        style={{
                          color:
                            (totalProfit ?? 0) > 0
                              ? 'green'
                              : (totalProfit ?? 0) < 0
                                ? 'red'
                                : 'black',
                        }}
                      >
                        {(totalProfit ?? 0) > 0
                          ? `+${totalProfit?.toFixed(2)}`
                          : totalProfit?.toFixed(2)}
                        <span
                          className="is-size-6"
                          style={{ color: 'inherit' }}
                        >
                          {' '}
                          USD
                        </span>
                        <span
                          style={{ color: 'inherit' }}
                          className="ml-4 is-size-6"
                        >
                          {(changePercent ?? 0) > 0
                            ? `+${changePercent.toFixed(2)}`
                            : changePercent.toFixed(2)}
                          %
                        </span>
                      </span>
                    ) : (
                      <span className="subtitle mt-3 is-size-4">-</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-6">
        <p className="subtitle pb-3 box-header">News</p>
        <div className="columns is-multiline is-flex is-0 news-container">
          {!stockNewsLoading
            ? stockNews.slice(0, 6).map((newsItem, index) => (
                <div
                  key={index}
                  className="column box news-box p-3"
                  style={{ backgroundColor: COLORS.boxBackground }}
                >
                  <a
                    href={newsItem.url ?? ''}
                    className="is-flex is-flex-direction-column"
                    target="_blank"
                  >
                    <figure className="image is-16by9">
                      <img
                        className="border-radius-5"
                        src={newsItem.image ?? ''}
                      />
                    </figure>
                    <p className="is-size-6 has-text-weight-bold py-3">
                      {newsItem.headline}
                    </p>
                    <p style={{ flex: '1' }}>{newsItem.summary}</p>
                    <p className="has-text-right vertical-align-end is-italic mt-3">
                      {new Date((newsItem.datetime ?? 0) * 1000).toLocaleString(
                        'hu-HU'
                      )}
                    </p>
                  </a>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="column is-one-third"
                  style={{
                    minHeight: '10rem',
                    maxWidth: 'calc(33.333% - 20px)',
                  }}
                >
                  <div
                    className="box p-3"
                    style={{
                      backgroundColor: COLORS.boxBackground,
                      height: '100%',
                    }}
                  >
                    <div className="skeleton skeleton-box"></div>
                    <div className="skeleton skeleton-title my-2"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="is-flex justify-content-right">
                      <div
                        className="skeleton skeleton-title"
                        style={{ marginLeft: 'auto' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
