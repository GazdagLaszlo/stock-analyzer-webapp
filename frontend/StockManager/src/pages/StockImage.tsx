import { useState } from 'react';

const StockImage = ({ symbol }: { symbol: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !symbol) {
    return (
      <span
        className="icon is-small has-text-grey-light has-background-light border-radius-5"
        style={{ width: '24px', height: '24px' }}
      >
        <i className="fas fa-chart-line"></i>
      </span>
    );
  }

  return (
    <img
      className="border-radius-5"
      src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${symbol}.png`}
      onError={() => setHasError(true)}
      alt={symbol}
    />
  );
};

export default StockImage;
