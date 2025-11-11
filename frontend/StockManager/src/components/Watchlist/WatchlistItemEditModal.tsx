import { useEffect, useState } from "react";
import type { WatchListItemDto, WatchListItemUpdateDto } from "../../../generated-sources/openapi";

type Props = {
    open: boolean,
    onClose: () => void,
    selectedItem?: WatchListItemDto,
    onEdit: (id: number | undefined, updateDto: WatchListItemUpdateDto) => void,
}

const WatchlistItemEditModal = ({open, onClose, selectedItem, onEdit} : Props) => {
    const [watchlistItem, setWatchlistItem] = useState<WatchListItemUpdateDto>({entryPrice: selectedItem?.entryPrice, note: selectedItem?.note});

    useEffect(() => {
        if (open) {
            setWatchlistItem({ entryPrice: selectedItem?.entryPrice, note: selectedItem?.note });
        }
    }, [open]);

    return (
        <div className={`modal ${open ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="card p-6">
                    <h1 className='title is-4 mb-6'>Edit selected item - {selectedItem?.stock?.symbol}</h1>
                    <div className="field">
                        <label className="label">Entry price</label>
                        <div className="control">
                            <input className="input" type="number" value={watchlistItem?.entryPrice ?? ""}
                            onChange={(e) => setWatchlistItem({ ...watchlistItem, entryPrice: e.target.value == "" ? undefined : Number(e.target.value) })}/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Notes</label>
                        <div className="control">
                            <textarea className="textarea" placeholder="Type notes..." value={watchlistItem?.note ?? ""}
                            onChange={(e) => setWatchlistItem({...watchlistItem, note: e.target.value})}
                            style={{height: "100px", minHeight: "0px"}}></textarea>
                        </div>
                    </div>

                    <div className='is-flex is-justify-content-center mt-5'>
                        <button className='button button-navy' onClick={() => {onEdit(selectedItem?.id, watchlistItem); onClose()}}>
                            Edit
                        </button>
                    </div>
                </div>                    
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div> 
    )
};

export default WatchlistItemEditModal;