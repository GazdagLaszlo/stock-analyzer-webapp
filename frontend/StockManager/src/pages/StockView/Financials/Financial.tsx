import { Link } from 'react-router-dom';
import type { StockDto } from '../../../../generated-sources/openapi';

import Overview from './Overview';
import Statements from './Statements';

const Financial = ({
  stock,
  activeSubTab,
  data,
}: {
  stock?: StockDto;
  activeSubTab?: string;
  data?: { [key: string]: number | null };
}) => {
  const subTab = activeSubTab || 'summary';

  return (
    <div>
      <p className="buttons mt-3">
        <Link
          to={`/app/stocks/${stock?.symbol}/financials/overview`}
          className={`button ${subTab === 'overview' ? 'button-navy' : 'is-light'}`}
        >
          Overview
        </Link>
        <Link
          to={`/app/stocks/${stock?.symbol}/financials/statements`}
          className={`button ${subTab === 'statements' ? 'button-navy' : 'is-light'}`}
        >
          Statements
        </Link>
      </p>

      <div>
        {subTab === 'overview' && <Overview stock={stock} data={data} />}
        {subTab === 'statements' && <Statements stock={stock} />}
      </div>
    </div>
  );
};

export default Financial;
