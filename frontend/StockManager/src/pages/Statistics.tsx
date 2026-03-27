import { NavLink, useNavigate, useParams } from 'react-router-dom';
import TraderStatistics from './TraderStatistics';
import InvestorStatistics from './InvestorStatistics';
import { useEffect } from 'react';
import type { TradeSummaryDto } from '../../generated-sources/openapi';
import { useQuery } from '@tanstack/react-query';
import api from '../api/api';

const Statistics = () => {
  const navigate = useNavigate();
  const { tab } = useParams();

  useEffect(() => {
    if (!tab) {
      navigate('/app/statistics/investor-statistics', { replace: true });
    }
  }, [tab, navigate]);

  const { data: tradeSummary } = useQuery<TradeSummaryDto>({
    queryKey: ['getTransactionsSummary'],
    queryFn: async () => {
      const res =
        await api.Transaction.apiTransactionGetTransactionsSummaryGet();
      return res.data;
    },
  });

  return (
    <div className="container mt-5">
      <div className="tabs is-left is-toggle">
        <ul>
          <li className={tab === 'investor-statistics' ? `is-active` : ''}>
            <NavLink to="/app/statistics/investor-statistics">
              <span>Investor Statistics</span>
            </NavLink>
          </li>
          <li className={tab === 'trader-statistics' ? `is-active` : ''}>
            <NavLink to="/app/statistics/trader-statistics">
              <span>Trader Statistics</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {tab === 'investor-statistics' && (
        <InvestorStatistics transactionsSummary={tradeSummary} />
      )}

      {tab === 'trader-statistics' && (
        <TraderStatistics transactionsSummary={tradeSummary} />
      )}
    </div>
  );
};

export default Statistics;
