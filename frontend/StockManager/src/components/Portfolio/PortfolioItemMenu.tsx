import { useEffect, useState } from "react";

type Props = {
    onAddTransaction: () => void;
    onDeleteItem: () => void;
};

const PortfolioItemMenu = ({ onAddTransaction, onDeleteItem }: Props) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.addEventListener("click", () => setOpen(false));
        }
        return () => document.removeEventListener("click", () => setOpen(false));
    }, [open]);

    return (
        <div className={`dropdown ${open ? "is-active" : ""}`}>
            <div className="dropdown-trigger">
                <button className="button is-small" aria-haspopup="true" aria-controls="dropdown-menu"
                    onClick={(e) => { e.stopPropagation(); setOpen(!open) }}>
                    <span>⋮</span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{ left: "auto", right: 0 }}>
                <div className="dropdown-content">
                    <a className="dropdown-item" onClick={() => {onAddTransaction(); setOpen(false);}}>
                        Add transaction
                    </a>
                    <a className="dropdown-item has-text-danger" onClick={() => {onDeleteItem(); setOpen(false);}}>
                        Delete
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PortfolioItemMenu;