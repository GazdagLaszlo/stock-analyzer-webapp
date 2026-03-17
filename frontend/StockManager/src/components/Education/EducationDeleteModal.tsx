import { COLORS } from '../../constants/colors';

type Props = {
  open: boolean;
  selectedContentId?: number;
  onClose: () => void;
  onDelete: (id?: number) => void;
};

const EducationDeleteModal = ({
  open,
  onClose,
  selectedContentId,
  onDelete,
}: Props) => {
  return (
    <div className={`modal ${open ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <h1 className="modal-card-title">Delete content</h1>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          Are you sure you want to delete this content?
        </section>
        <footer className="modal-card-foot is-justify-content-right">
          <button className="button mr-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button"
            style={{ backgroundColor: COLORS.error, color: COLORS.text }}
            onClick={() => {
              onDelete(selectedContentId);
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

export default EducationDeleteModal;
