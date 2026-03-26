import { NavLink, useNavigate, useParams } from 'react-router-dom';
import TraderStatistics from './TraderStatistics';
import InvestorStatistics from './InvestorStatistics';
import { useEffect } from 'react';

const Statistics = () => {
  const navigate = useNavigate();
  const { tab } = useParams();

  useEffect(() => {
    if (!tab) {
      navigate('/app/statistics/investor-statistics', { replace: true });
    }
  }, [tab, navigate]);

  return (
    <div className="mt-5">
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
      <div>{tab === 'investor-statistics' && <InvestorStatistics />}</div>
      <div>{tab === 'trader-statistics' && <TraderStatistics />}</div>
    </div>
  );
};

export default Statistics;
