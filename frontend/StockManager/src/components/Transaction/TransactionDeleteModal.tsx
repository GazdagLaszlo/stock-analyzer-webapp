import { COLORS } from '../../constants/colors';

type Props = {
  open: boolean;
  selectedTransactionId?: number;
  onClose: () => void;
  onDelete: (id?: number) => void;
};

const DeleteModal = ({
  open,
  onClose,
  selectedTransactionId,
  onDelete,
}: Props) => {
  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <h1 className="modal-card-title">Delete transaction</h1>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          Are you sure you want to delete the transaction?
        </section>
        <footer className="modal-card-foot is-justify-content-right">
          <button className="button mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button"
            style={{ backgroundColor: COLORS.error, color: COLORS.text }}
            onClick={() => {
              onDelete(selectedTransactionId);
              onClose();
            }}
          >
            Delete
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DeleteModal;
