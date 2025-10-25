import type { PortfolioDto } from "../../../generated-sources/openapi";

type Props = {
    open: boolean,
    onClose: () => void,
    selectedPortfolio?: PortfolioDto,
    onDelete: (id: number | undefined) => void,
}

const PortfolioDeleteModal = ({open, onClose, selectedPortfolio, onDelete}: Props) => {
    return (
        <div className={`modal ${open ? "is-active" : ""}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <h1 className='modal-card-title'>Delete portfolio</h1>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    Are you sure you want to delete <b>{selectedPortfolio?.name}</b>? <br />
                    All portfolio investments and transactions will be lost.
                </section>
                <footer className="modal-card-foot is-justify-content-right">
                    <button className="button mr-2" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="button is-danger" onClick={() => { onDelete(selectedPortfolio?.id); onClose() }}>
                        Delete
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default PortfolioDeleteModal;