import { useEffect, useState } from 'react';
import {
  TransactionType,
  type PortfolioItemDto,
  type PortfolioUpdateDto,
  type StockDto,
} from '../../generated-sources/openapi';
import api from '../api/api';
import PortfolioItemMenu from '../components/Portfolio/PortfolioItemMenu';
import PortfolioItemDeleteModal from '../components/Portfolio/PortfolioItemDeleteModal';
import NewPortfolioModal from '../components/Portfolio/NewPortfolioModal';
import TransactionModal from '../components/Portfolio/TransactionModal';
import PortfolioMenu from '../components/Portfolio/PortfolioMenu';
import PortfolioDeleteModal from '../components/Portfolio/PortfolioDeleteModal';
import RenamePortfolioModal from '../components/Portfolio/RenamePortfolioModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';

const Portfolio = () => {
  const portfolioContext = useContext(PortfolioContext);
  if (!portfolioContext) {
    throw new Error('PortfolioContext not found');
  }
  const {
    portfolios,
    selectedPortfolio,
    getPortfolioValue,
    getTotalInvested,
    getTotalProfit,
    createPortfolio,
    selectPortfolio,
    deletePortfolio,
    fetchPortfolios,
    getLivePrice,
    getItemProfit,
  } = portfolioContext;

  const { portfolioId } = useParams<{ portfolioId?: string }>();

  const [selectedStock, setSelectedStock] = useState<StockDto>();
  const [selectedPortfolioItem, setSelectedPortfolioItem] =
    useState<PortfolioItemDto>();
  const [totalProfit, setTotalProfit] = useState<number | null>(0);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [totalInvested, setTotalInvested] = useState<number>(0);

  const navigate = useNavigate();

  const [transactionCreateData, setTransactionCreateData] = useState({
    price: '',
    quantity: '1',
    date: new Date().toISOString().split('T')[0],
    fee: '0',
    note: '',
  });

  const [transactionModalOpen, setTransactionModalOpen] = useState<
    true | false
  >(false);
  const [portfolioAddModalOpen, setPortfolioAddModalOpen] = useState<
    true | false
  >(false);
  const [portfolioItemDeleteModalOpen, setPortfolioItemDeleteModalOpen] =
    useState<true | false>(false);
  const [portfolioDeleteModalOpen, setPortfolioDeleteModalOpen] = useState<
    true | false
  >(false);
  const [renamePortfolioModalOpen, setRenamePortfolioModalOpen] = useState<
    true | false
  >(false);

  useEffect(() => {
    if (selectedPortfolio) {
      const totalProfit = getTotalProfit(selectedPortfolio);

      setTotalProfit(totalProfit ? totalProfit : null);
      setPortfolioValue(getPortfolioValue(selectedPortfolio));
      setTotalInvested(getTotalInvested(selectedPortfolio));
    }
  }, [selectedPortfolio?.portfolioItems]);

  useEffect(() => {
    if (portfolioId) {
      const portfolio = portfolios.find((p) => p.id === parseInt(portfolioId));
      if (portfolio?.id) {
        selectPortfolio(portfolio?.id);
      }
    } else if (portfolios.length > 0) {
      navigate(`/app/portfolio/${portfolios[0].id}`);
    }
  }, [portfolioId, portfolios]);

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
    if (dto.transactionType == TransactionType.NUMBER_1) {
      const portfolioItem = selectedPortfolio?.portfolioItems?.find(
        (x) => x.stock?.id === dto.stockId
      );

      if (dto.quantity > (portfolioItem?.quantity ?? 0)) {
        console.log(dto.quantity);
        console.log(portfolioItem?.quantity);
        alert('You cannot sell more stock, than you have in your portfolio.');
        return;
      }
    }
    await api.Transaction.apiTransactionCreatePost(dto);
    await fetchPortfolios();

    setTransactionModalOpen(false);
  };

  const deletePortfolioItem = async (id: number | undefined) => {
    if (!id || !selectedPortfolio) return;

    await api.PortfolioItem.apiPortfolioItemDeleteIdDelete(id);

    await fetchPortfolios();
  };

  const renamePortfolio = async (portfolio: PortfolioUpdateDto) => {
    if (portfolio.name && selectedPortfolio?.id) {
      await api.Portfolio.apiPortfolioUpdateIdPut(
        selectedPortfolio.id,
        portfolio
      );
    }

    await fetchPortfolios();
  };

  const sortedItems = selectedPortfolio?.portfolioItems
    ?.slice()
    .sort(
      (a, b) =>
        (b.stock?.price ?? 0) * (b.quantity ?? 0) -
        (a.stock?.price ?? 0) * (a.quantity ?? 0)
    );

  return (
    <div className="portfolio mt-5">
      {portfolios.length > 0 ? (
        <>
          <div className="is-flex is-justify-content-space-between">
            <div>
              {portfolios.map((portfolio) => (
                <button
                  key={portfolio.id}
                  className={
                    'button mr-2 ' +
                    (selectedPortfolio?.id == portfolio.id ? 'button-navy' : '')
                  }
                  onClick={() => {
                    navigate(`/app/portfolio/${portfolio.id}`);
                    selectPortfolio(portfolio.id!);
                  }}
                >
                  {portfolio.name}
                </button>
              ))}
              <button
                className="button"
                onClick={() => setPortfolioAddModalOpen(true)}
              >
                +
              </button>
            </div>
            <div>
              <button
                className="button button-navy"
                onClick={() => setTransactionModalOpen(true)}
              >
                Add transaction
              </button>

              <PortfolioMenu
                onRename={() => {
                  setRenamePortfolioModalOpen(true);
                }}
                onDelete={() => {
                  setPortfolioDeleteModalOpen(true);
                }}
              />
            </div>
          </div>

          <div className="columns mt-5 is-variable is-0 data-boxes">
            <div className="column is-one-quarter data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
              <p className="box-title">Portfolio value</p>
              {portfolioValue ? (
                <span className="subtitle mt-3 is-size-4">
                  {portfolioValue.toFixed(2)}{' '}
                  <span className="is-size-6">USD</span>
                </span>
              ) : (
                <span className="subtitle mt-3 is-size-4">-</span>
              )}
            </div>
            <div className="column is-one-quarter data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
              <p className="box-title">Unrealized profit</p>
              {totalProfit ? (
                <p
                  className="subtitle mt-3 is-size-4"
                  style={{
                    color:
                      totalProfit > 0
                        ? 'green'
                        : totalProfit < 0
                          ? 'red'
                          : 'black',
                  }}
                >
                  {totalProfit.toFixed(2) + ' '}
                  <span className="is-size-6" style={{ color: 'inherit' }}>
                    USD
                  </span>
                  <span className="is-size-6 ml-3" style={{ color: 'inherit' }}>
                    {totalInvested !== 0
                      ? ((totalProfit / totalInvested) * 100).toFixed(2)
                      : 0}
                    %
                  </span>
                </p>
              ) : (
                <span className="subtitle mt-3 is-size-4">-</span>
              )}
            </div>
          </div>

          {sortedItems && sortedItems.length > 0 ? (
            <div className="is-flex is-flex-direction-column mt-6">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Symbol</th>
                    <th>Company</th>
                    <th>Allocation</th>
                    <th>Avg price</th>
                    <th>Holdings</th>
                    <th>Invested</th>
                    <th>Unrealized profit</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems?.map((item, i) => {
                    const livePrice =
                      getLivePrice(item.stock?.symbol ?? '') ||
                      (item.stock?.price ?? 0);
                    const profit = getItemProfit(item, livePrice);
                    const percentage =
                      profit !== 0
                        ? (profit /
                            ((item.averagePurchasePrice ?? 0) *
                              (item.quantity ?? 0))) *
                          100
                        : 0;

                    return (
                      <tr
                        key={i}
                        onClick={() =>
                          navigate(`/app/stocks/${item.stock?.symbol}`)
                        }
                      >
                        <td className="is-narrow" style={{ width: '3vw' }}>
                          <figure className="image is-24x24">
                            <img
                              className="border-radius-5"
                              src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${item.stock?.symbol}.png`}
                            />
                          </figure>
                        </td>
                        <td style={{ width: '8vw' }}>{item.stock?.symbol}</td>
                        <td style={{ width: '20vw' }}>
                          {item.stock?.companyName}
                        </td>
                        <td style={{ width: '8vw' }}>
                          {(
                            (((item.quantity ?? 0) * (livePrice ?? 0)) /
                              (getPortfolioValue(selectedPortfolio) ?? 1)) *
                            100
                          ).toFixed(2)}
                          %
                        </td>
                        <td style={{ width: '8vw' }}>
                          {item.averagePurchasePrice?.toFixed(2)} USD
                        </td>
                        <td style={{ width: '20vw' }}>
                          {((item.quantity ?? 0) * (livePrice ?? 0)).toFixed(2)}{' '}
                          USD ({item.quantity?.toFixed(2)} {item.stock?.symbol})
                        </td>
                        <td>
                          {(
                            (item.averagePurchasePrice ?? 0) *
                            (item.quantity ?? 0)
                          ).toFixed(2)}{' '}
                          USD
                        </td>
                        <td
                          style={{
                            color:
                              profit > 0
                                ? 'green'
                                : profit < 0
                                  ? 'red'
                                  : 'black',
                          }}
                        >
                          {profit.toFixed(2)} USD
                          <span
                            className="ml-3 is-size-7"
                            style={{ color: 'inherit' }}
                          >
                            {percentage.toFixed(2) + ' %'}
                          </span>
                        </td>
                        <td className="is-narrow">
                          <PortfolioItemMenu
                            onAddTransaction={() => {
                              setSelectedStock(item.stock);
                              setTransactionModalOpen(true);
                              setTransactionCreateData({
                                ...transactionCreateData,
                                price: livePrice.toString() ?? '0',
                              });
                            }}
                            onDeleteItem={() => {
                              if (item.id != null) {
                                setSelectedPortfolioItem(item);
                                setPortfolioItemDeleteModalOpen(true);
                              }
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
              <div className="has-text-centered py-6">
                <span className="icon is-large has-text-grey-light mb-5">
                  <i className="fas fa-chart-pie fa-3x"></i>
                </span>
                <h3 className="title is-4 pb-2">
                  Your portfolio is currently empty
                </h3>
                <p className="subtitle is-6 has-text-grey">
                  Start your investment journey! Add your first transaction to
                  track your holdings.
                </p>
                <div className="buttons is-centered mt-5">
                  <button
                    className="button button-navy"
                    onClick={() => setTransactionModalOpen(true)}
                  >
                    Add first transaction
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
          <div className="has-text-centered py-6">
            <span className="icon is-large has-text-grey-light mb-5">
              <i className="fas fa-briefcase fa-3x"></i>
            </span>
            <h3 className="title is-4 pb-2">No portfolios found</h3>
            <p className="subtitle is-6 has-text-grey">
              You need to create a portfolio before you can start tracking your
              transactions.
            </p>
            <div className="buttons is-centered mt-5">
              <button
                className="button button-navy"
                onClick={() => setPortfolioAddModalOpen(true)}
              >
                Create Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
      <TransactionModal
        open={transactionModalOpen}
        onClose={() => {
          setTransactionModalOpen(false);
        }}
        onCreate={createTransaction}
        portfolioId={selectedPortfolio?.id}
        selectedStock={selectedStock}
        portfolioItems={selectedPortfolio?.portfolioItems ?? []}
      />

      <PortfolioItemDeleteModal
        open={portfolioItemDeleteModalOpen}
        onClose={() => setPortfolioItemDeleteModalOpen(false)}
        portfolioItem={selectedPortfolioItem}
        onDelete={deletePortfolioItem}
      />

      <NewPortfolioModal
        open={portfolioAddModalOpen}
        onClose={() => setPortfolioAddModalOpen(false)}
        onCreate={createPortfolio}
      />

      <PortfolioDeleteModal
        open={portfolioDeleteModalOpen}
        onClose={() => setPortfolioDeleteModalOpen(false)}
        selectedPortfolio={selectedPortfolio!}
        onDelete={deletePortfolio}
      />

      <RenamePortfolioModal
        open={renamePortfolioModalOpen}
        onClose={() => setRenamePortfolioModalOpen(false)}
        oldName={selectedPortfolio?.name}
        onUpdate={renamePortfolio}
      />
    </div>
  );
};

export default Portfolio;
