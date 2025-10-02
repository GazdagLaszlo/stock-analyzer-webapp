import type { StockDto } from "../../generated-sources/openapi";
import api from "../api/api";
import { useState, useEffect } from "react";
import './Stock.scss';
import { useNavigate } from "react-router-dom";


const Stock = () => {
    const navigate = useNavigate();
    const [stocks, setStocks] = useState<StockDto[]>([]);
    

    useEffect(() => {
        api.Stock.apiStockGetAllGet().then(res => {
            setStocks(res.data);
        }).catch(error => {
            console.error("Error while loading stocks: ", error);
        });


    }, []);




    const sortedStocks = [...stocks].sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));

    const filteredStocks = sortedStocks.filter(stock => 
        stock.symbol?.toLowerCase().startsWith(searchInput.toLowerCase()) ||
        stock.companyName?.toLowerCase().startsWith(searchInput.toLowerCase())
    );

    const rows = filteredStocks.map((stock) => (
        <tr key={stock.id} className="table-row" onClick={() => navigate(`${stock.symbol}`, { state: { stockId: stock.id } })}>            
            <td>
                <figure className='image is-24x24'>
                    <img src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock.symbol}.png`}/>
                </figure>
            </td>
            <td>{stock.symbol}</td>
            <td>{stock.companyName}</td>
            <td>{stock.sector}</td>
            <td>${stock.price}</td>
            <td>{stock.marketCap?.toFixed(0)}</td>
        </tr>
    ));
    

    return (
        <div className=" is-flex is-flex-direction-column is-align-items-center">
            <h1 className="title has-text-centered my-6">Stocks by market capitalization</h1>
            <div className="field" style={{width: "70%"}}>
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
            <table className="table is-fullwidth mt-6"> 
                <thead>
                    <tr>
                        <th></th>
                        <th>Symbol</th>
                        <th>Company name</th>
                        <th>Sector</th>
                        <th>Price</th>
                        <th>Market capitalization</th>
                    </tr>                    
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
}

export default Stock;