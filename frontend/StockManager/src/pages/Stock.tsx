import type { StockDto } from "../../generated-sources/openapi";
import api from "../api/api";
import { useState, useEffect } from "react";

const Stock = () => {

    const [stocks, setStocks] = useState<StockDto[]>([]);

    useEffect(() => {
        api.Stock.apiStockGetAllGet().then(res => {
            setStocks(res.data);
            console.log("Stock:"+res.data);
        }).catch(error => {
            console.error("Error while loading stocks: ", error);
        })        
    }, []);    

    const sortedStocks = [...stocks].sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));

    const rows = sortedStocks.map((stock) => (
        <tr key={stock.id}>
            <td>{stock.symbol}</td>
            <td>{stock.companyName}</td>
            <td>{stock.sector}</td>
            <td>{stock.price}</td>
            <td>{stock.marketCap}</td>
        </tr>
    ));
    

    return (
        <div>
            <h1 className="title has-text-centered mt-6">Teljes részvénylista</h1>
            <table className="table is-fullwidth mt-6">
                <thead>
                    <tr>
                        <th>Szimbólum</th>
                        <th>Név</th>
                        <th>Szektor</th>
                        <th>Árfolyam</th>
                        <th>Piaci kapitalizáció</th>
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