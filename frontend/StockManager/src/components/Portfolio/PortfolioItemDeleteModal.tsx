import type { PortfolioItemDto } from '../../../generated-sources/openapi';
import { COLORS } from '../../constants/colors';

type Props = {
  open: boolean;
  portfolioItem?: PortfolioItemDto;
  onClose: () => void;
  onDelete: (id?: number) => void;
};

const PortfolioItemDeleteModal = ({
  open,
  portfolioItem,
  onClose,
  onDelete,
}: Props) => {
  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <h1 className="modal-card-title">Delete position</h1>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          Are you sure you want to delete {portfolioItem?.stock?.symbol}? All
          transactions history will be lost.
        </section>
        <footer className="modal-card-foot is-justify-content-right">
          <button className="button mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button"
            onClick={() => {
              onDelete(portfolioItem?.id);
              onClose();
            }}
            style={{ backgroundColor: COLORS.error, color: COLORS.text }}
          >
            Delete
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PortfolioItemDeleteModal;
