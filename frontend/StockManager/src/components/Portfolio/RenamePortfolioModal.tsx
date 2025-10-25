import { useEffect, useRef, useState } from "react";
import type { PortfolioUpdateDto } from "../../../generated-sources/openapi";

type Props = {
    open: boolean,
    onClose: () => void,
    oldName: string | null | undefined,
    onUpdate: (updateDto: PortfolioUpdateDto) => void,
};

const RenamePortfolioModal = ({open, onClose, oldName, onUpdate}: Props) => {    
    const [portfolio, setPortfolio] = useState<PortfolioUpdateDto>({name: oldName});
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setPortfolio({ name: oldName ?? "" });

            inputRef.current?.focus();
        }
    }, [open, oldName]);

    return (
        <div className={`modal ${open ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="card p-6">
                    <h1 className='title is-4 mb-6'>Rename portfolio</h1>
                    <div className="field">
                        <label className="label">Portfolio name</label>
                        <div className="control">
                            <input className="input" type="text" value={portfolio.name ?? ""} ref={inputRef}
                            onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })}/>
                        </div>
                    </div>
                    <div className='is-flex is-justify-content-center mt-6'>
                        <button className='button is-dark' onClick={() => {onUpdate(portfolio); onClose(); setPortfolio({})}}>
                            Rename
                        </button>
                    </div>
                </div>                    
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div> 
    )    
}

export default RenamePortfolioModal;