import { useEffect, useState } from "react";

type Props = {
    onRename: () => void,
    onDelete: () => void,
};

const PortfolioMenu = (({onRename, onDelete}: Props ) => {
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
                <button className="button ml-3" aria-haspopup="true" aria-controls="dropdown-menu"
                    onClick={(e) => { e.stopPropagation(); setOpen(!open)}}>
                    <span>⋮</span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{ left: "auto", right: 0 }}>
                <div className="dropdown-content">
                    <a className="dropdown-item" onClick={() => {onRename(); setOpen(false)}}>
                        Rename Portfolio
                    </a>
                    <a className="dropdown-item has-text-danger" onClick={() => { onDelete(); setOpen(false)}}>
                        Delete Portfolio
                    </a>
                </div>
            </div>
        </div>
    )    
})

export default PortfolioMenu;