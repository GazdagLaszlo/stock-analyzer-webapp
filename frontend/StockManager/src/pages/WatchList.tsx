import { useEffect, useState } from "react";
import type { StockDto, WatchListDto, WatchListItemDto, WatchListItemUpdateDto } from "../../generated-sources/openapi";
import api from "../api/api";
import WatchlistItemMenu from "../components/Watchlist/WatchlistItemMenu";

const Watchlist = () => {
    const [stocks, setStocks] = useState<StockDto[]>([]);
    const [searchInput, setSearchInput] = useState("");    
    const [watchlist, setWatchlist] = useState<WatchListDto>();
    const [selectedWatchlistItem, setSelectedWatchlistItem] = useState<WatchListItemDto>();
    const [watchlistItemUpdate, setWatchlistItemUpdate] = useState<WatchListItemUpdateDto>();

    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const loadStocks = async () => {
        api.Stock.apiStockGetAllGet().then(res => {
            setStocks(res.data);
        })
        .catch(error => {
            console.error("Error while loading stocks: ", error);
        });
    }

    useEffect(() => {
        loadStocks();
    }, []);

    useEffect(() => {
        api.WatchList.apiWatchListGetByUserIdGet().then(res => {
            setWatchlist(res.data);
            console.log(res.data);
        })
        .catch(error => {
            console.error("Error while loading watchlist: ", error);
        });


    }, []);

    const sortedStocks = [...stocks].sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));

    const filteredStocks = sortedStocks.filter(stock => 
        stock.symbol?.toLowerCase().startsWith(searchInput.toLowerCase()) ||
        stock.companyName?.toLowerCase().startsWith(searchInput.toLowerCase())
    );

    const allStockRows = filteredStocks.map((stock, index) => (
        <tr key={stock.id} className="table-row" onClick={() => {
            createWatchlistItem(stock.id);
            setStockModalOpen(false)
        }}>            
            <td>{index + 1}</td>            
            <td>
                <figure className='image is-24x24'>
                    <img src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock.symbol}.png`}/>
                </figure>
            </td>
            <td>{stock.symbol}</td>
            <td>{stock.companyName}</td>
        </tr>
    ));

    const rows = watchlist?.watchListItems?.map((item) => (
        <tr key={item.id} className="table-row" onClick={() => {}}>
            <td style={{width: "70px"}}>
                <figure className='image is-24x24'>
                    <img src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${item.stock?.symbol}.png`}/>
                </figure>
            </td>
            <td>{item.stock?.companyName}</td>            
            <td>{item.stock?.symbol}</td>
            <td>{item.stock?.price} USD</td>
            <td style={{borderLeft: "1px solid grey"}} className="pl-6">{item.entryPrice != null ? item.entryPrice + " USD" : "-"}</td>
            <td>{item.note ?? "-"}</td>
            <td className='is-narrow'>
                <WatchlistItemMenu
                    onEdit={() => {
                        setSelectedWatchlistItem(item);
                        setWatchlistItemUpdate({entryPrice: item.entryPrice ?? undefined, note: item.note ?? ""});
                        setEditModalOpen(true);
                    }}
                    onDeleteItem={() => {  if (item.id != null) { setSelectedWatchlistItem(item); setDeleteModalOpen(true)} }}
                />
            </td>
        </tr>
    ));

    const createWatchlistItem = async (stockId?:number) => {
        if (!stockId) {
            console.log("StockID is undefined");
            return;
        }

        if(watchlist?.watchListItems?.find(item => item.stock?.id == stockId)){
            console.log("Stock is already on watchlist");
            return;
        }

        try{
            await api.WatchListItem.apiWatchListItemCreatePost({stockId});

            const response = await api.WatchList.apiWatchListGetByUserIdGet();
            setWatchlist(response.data);
        } catch(error){
            console.log("WatchlistItem create was not successful: ", error);
        }
    };    

    const deleteWatchlistItem = async (id: number | undefined ) => {
        if(id){
            await api.WatchListItem.apiWatchListItemDeleteIdDelete(id)

            const response = await api.WatchList.apiWatchListGetByUserIdGet();
            setWatchlist(response.data);
        }        
    }

    const editWatchlistItem = async (id: number | undefined) => {        
        if(id){
            await api.WatchListItem.apiWatchListItemUpdateIdPut(id, watchlistItemUpdate);

            setWatchlistItemUpdate({});

            const response = await api.WatchList.apiWatchListGetByUserIdGet();
            setWatchlist(response.data);
        }
    }

    return (
        <div>
            <div className="is-flex is-justify-content-right my-5">
                <button className="button is-dark" onClick={() => setStockModalOpen(true)}>
                    Add stocks
                </button>
            </div>            

            <div className="is-flex is-flex-direction-column mt-6">
                <table className='table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Company</th>
                            <th>Symbol</th>
                            <th style={{borderRight: "1px solid grey"}}>Price</th>
                            <th className="pl-6">Entry Price</th>
                            <th>Note</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>                
            </div>   

            {/*Stock select modal*/}
            <div className={`modal ${stockModalOpen ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={() => setStockModalOpen(false)}></div>
                <div className="modal-content" style={{width: "60%"}}>
                    <div className="card p-6">
                        <div className="field">
                            <div className="control">
                                <input type='text' className='input pl-5' placeholder='Keresés...'
                                onChange={(e) => setSearchInput(e.target.value)}/>
                                {/*
                                <span className="icon">
                                    <i className="fas fa-search has-background-dark"></i>
                                </span>
                                */}
                            </div>
                        </div>
                        <div style={{ height: "500px", overflowY: "auto" }} className='mt-6'>
                            <table className="table is-fullwidth">
                                <thead>
                                    <tr></tr>
                                </thead>
                                <tbody>
                                    {allStockRows}
                                </tbody>
                            </table>
                        </div>                        
                    </div>                    
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={() => setStockModalOpen(false)}></button>
            </div>     

            {/*Delete modal*/}
            <div className={`modal ${deleteModalOpen ? "is-active" : ""}`}>
                <div className="modal-background" onClick={() => setDeleteModalOpen(false)}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <h1 className='modal-card-title'>Delete stock</h1>
                        <button className="delete" aria-label="close" onClick={() => setDeleteModalOpen(false)}></button>
                    </header>
                    <section className="modal-card-body">
                        Are you sure you want to delete {selectedWatchlistItem?.stock?.symbol} from watchlist?
                    </section>
                    <footer className="modal-card-foot is-justify-content-right">
                        <button className="button mr-2" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </button>
                        <button className="button is-danger" onClick={() => { deleteWatchlistItem(selectedWatchlistItem?.id); setDeleteModalOpen(false) }}>
                            Delete
                        </button>
                    </footer>
                </div>
            </div>    

            {/*Edit modal*/}
            <div className={`modal ${editModalOpen ? "is-active" : ""}`}>
                <div className="modal-background" onClick={() => setEditModalOpen(false)}></div>
                <div className="modal-content" style={{width: "60%"}}>
                    <div className="card p-6">
                        <div className="field">
                            <label className="label">Entry price</label>
                            <div className="control">
                                <input className="input" type="number" value={watchlistItemUpdate?.entryPrice ?? ""}
                                onChange={(e) => setWatchlistItemUpdate({ ...watchlistItemUpdate, entryPrice: Number(e.target.value) })}/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Notes</label>
                            <div className="control">
                                <textarea className="textarea" placeholder="Type notes..." value={watchlistItemUpdate?.note ?? ""}
                                onChange={(e) => setWatchlistItemUpdate({...watchlistItemUpdate, note: e.target.value})}
                                style={{height: "100px", minHeight: "0px"}}></textarea>
                            </div>
                        </div>

                        <div className='is-flex is-justify-content-center mt-5'>
                            <button className='button is-dark' onClick={() => {editWatchlistItem(selectedWatchlistItem?.id); setEditModalOpen(false)}}>
                                Edit
                            </button>
                        </div>    
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={() => setStockModalOpen(false)}></button>
            </div>       
        </div>
    );
}

export default Watchlist;