import { useEffect, useRef, useState } from "react";
import type { PortfolioCreateDto } from "../../../generated-sources/openapi";

type Props = {
    open: boolean,
    onClose: () => void,
    onCreate: (createDto: PortfolioCreateDto) => void
};

const NewPortfolioModal = ({open, onClose, onCreate} : Props) => {    
    const [newPortfolio, setNewPortfolio] = useState<PortfolioCreateDto>({});
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [open]);

    return (
        <div className={`modal ${open ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={()=>{onClose(); setNewPortfolio({})}}></div>
            <div className="modal-content">
                <div className="card p-6">
                    <h1 className='title is-4 mb-6'>Create portfolio</h1>
                    <div className="field">
                        <label className="label">Portfolio name</label>
                        <div className="control">
                            <input className="input" type="text" value={newPortfolio.name ?? ""} ref={inputRef}
                            onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })} autoFocus/>
                        </div>
                    </div>
                    <div className='is-flex is-justify-content-center mt-6'>
                        <button className='button button-navy' onClick={()=>{onCreate(newPortfolio); setNewPortfolio({}); onClose()}}>
                            Create
                        </button>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={()=>{onClose(); setNewPortfolio({})}}></button>
        </div>  
    )
}

export default NewPortfolioModal;