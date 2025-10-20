import { useState } from "react";
import type { PortfolioCreateDto } from "../../../generated-sources/openapi";

type Props = {
    open: boolean,
    onClose: () => void,
    onCreate: (createDto: PortfolioCreateDto) => void
};

const NewPortfolioModal = ({open, onClose, onCreate} : Props) => {    
    const [newPortfolio, setNewPortfolio] = useState<PortfolioCreateDto>({});

    const create = () => {
        onCreate(newPortfolio);
        setNewPortfolio({});
        onClose();
    }
    return (
        <div className={`modal ${open ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="card p-6">
                    <h1 className='title is-4 mb-6'>Create portfolio</h1>
                    <div className="field">
                        <label className="label">Portfolio name</label>
                        <div className="control">
                            <input className="input" type="text"
                            onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}/>
                        </div>
                    </div>
                    <div className='is-flex is-justify-content-center mt-6'>
                        <button className='button is-dark' onClick={create}>
                            Create
                        </button>
                    </div>
                </div>                    
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div>  
    )
}

export default NewPortfolioModal;