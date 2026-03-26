import type { WatchListItemDto } from '../../../generated-sources/openapi';
import { COLORS } from '../../constants/colors';

type Props = {
  open: boolean;
  watchlistItem?: WatchListItemDto;
  onClose: () => void;
  onDelete: (id?: number) => void;
};

const WatchlistItemDeleteModal = ({
  open,
  watchlistItem,
  onClose,
  onDelete,
}: Props) => {
  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <h1 className="modal-card-title">Delete stock from watchlist</h1>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          Are you sure you want to delete {watchlistItem?.stock?.symbol} from
          watchlist? Saved notes and entry price will be lost.
        </section>
        <footer className="modal-card-foot is-justify-content-right">
          <button className="button mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button"
            onClick={() => {
              onDelete(watchlistItem?.id);
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

export default WatchlistItemDeleteModal;
