import { useEffect, useState } from "react";
import type { StockDto, WatchListDto, WatchListItemDto, WatchListItemUpdateDto } from "../../generated-sources/openapi";
import api from "../api/api";
import WatchlistItemMenu from "../components/Watchlist/WatchlistItemMenu";
import { formatMoney } from "../utils/formatMoney";
import StockSelectModal from "../components/Portfolio/StockSelectModal";
import WatchlistItemDeleteModal from "../components/Watchlist/WatchListItemDeleteModal";
import WatchlistItemEditModal from "../components/Watchlist/WatchlistItemEditModal";
import { useNavigate } from "react-router-dom";

const Watchlist = () => {
    const navigate = useNavigate();
    const [stocks, setStocks] = useState<StockDto[]>([]);
    const [watchlist, setWatchlist] = useState<WatchListDto>();
    const [selectedWatchlistItem, setSelectedWatchlistItem] = useState<WatchListItemDto>(); 

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
        })
        .catch(error => {
            console.error("Error while loading watchlist: ", error);
        });


    }, []);

    const rows = watchlist?.watchListItems?.map((item) => (
        <tr key={item.id} className="table-row" onClick={() => navigate(`/stocks/${item.stock?.symbol}`)}>
            <td style={{width: "70px"}}>
                <figure className='image is-24x24'>
                    <img className="border-radius-5" src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${item.stock?.symbol}.png`}/>
                </figure>
            </td>
            <td>{item.stock?.symbol}</td>
            <td>{item.stock?.companyName}</td>            
            <td>{item.stock?.price} USD</td>
            <td className="pl-6">{item.entryPrice != null ? item.entryPrice + " USD" : "-"}</td>
            <td>{item.note ?? "-"}</td>
            <td className='is-narrow'>
                <WatchlistItemMenu
                    onEdit={() => {
                        setSelectedWatchlistItem(item);
                        setEditModalOpen(true);
                    }}
                    onDeleteItem={() => {  if (item.id != null) {
                        setSelectedWatchlistItem(item);
                        setDeleteModalOpen(true)}
                    }}
                />
            </td>
        </tr>
    ));

    const createWatchlistItem = async (stockId?:number) => {
        if (!stockId) {
            console.log("StockId is undefined");
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

    const editWatchlistItem = async (id: number | undefined, updateDto: WatchListItemUpdateDto) => {
        if(id){
            await api.WatchListItem.apiWatchListItemUpdateIdPut(id, updateDto);

            const response = await api.WatchList.apiWatchListGetByUserIdGet();
            setWatchlist(response.data);
        }
    }

    return (
        <div>
            <h1 className="title has-text-centered my-6">My Watchlist</h1>
            <div className="is-flex is-justify-content-right my-5">                                
                <button className="button button-navy is-dark" onClick={() => setStockModalOpen(true)}>
                    Add stocks
                </button>
            </div>            

            <div className="is-flex is-flex-direction-column mt-6">
                <table className='table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Symbol</th>
                            <th>Company</th>                            
                            <th>Price</th>
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

            <StockSelectModal
                open={stockModalOpen}
                onClose={() => setStockModalOpen(false)}
                stocks={stocks}
                onSelectStock={(stock) => {
                    setStockModalOpen(false);
                    createWatchlistItem(stock.id);
                }}
            />

            <WatchlistItemDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                watchlistItem={selectedWatchlistItem}
                onDelete={deleteWatchlistItem}
            />

            <WatchlistItemEditModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                selectedItem={selectedWatchlistItem}
                onEdit={editWatchlistItem}
            />
        </div>
    );
}

export default Watchlist;