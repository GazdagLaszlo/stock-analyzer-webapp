import { useEffect, useRef, useState } from 'react';
import { type StockDto } from '../../../generated-sources/openapi';

type Props = {
  open: boolean;
  stocks: StockDto[];
  onClose: () => void;
  onSelectStock: (stock: StockDto) => void;
};

const StockSelectModal = ({ open, onClose, stocks, onSelectStock }: Props) => {
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setSearchInput('');
  }, [open]);

  const sortedStocks = [...stocks].sort(
    (a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0)
  );

  const filteredStocks = sortedStocks.filter(
    (stock) =>
      stock.symbol?.toLowerCase().startsWith(searchInput.toLowerCase()) ||
      stock.companyName?.toLowerCase().startsWith(searchInput.toLowerCase())
  );

  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content" style={{ width: '60%' }}>
        <div className="card p-6">
          <div className="field">
            <div className="control">
              <input
                type="text"
                className="input pl-5"
                placeholder="Keresés..."
                value={searchInput}
                ref={inputRef}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
          <div style={{ height: '500px', overflowY: 'auto' }} className="mt-6">
            <table className="table is-fullwidth">
              <thead>
                <tr></tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock, index) => (
                  <tr
                    key={stock.id}
                    className="table-row"
                    onClick={() => {
                      onSelectStock(stock);
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <figure className="image is-24x24">
                        <img
                          className="border-radius-5"
                          src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock.symbol}.png`}
                        />
                      </figure>
                    </td>
                    <td>{stock.symbol}</td>
                    <td>{stock.companyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default StockSelectModal;
