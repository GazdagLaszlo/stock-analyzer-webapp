import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import api from "../../api/api";
import type { StockDto, StockQuote } from "../../../generated-sources/openapi";

import Overview from "./Overview";
import Technical from "./Technical";
import Financial from "./Financials/Financial";

const StockView = () => {
    const { symbol, tab, subtab } = useParams<{ symbol: string; tab?: string; subtab?: string }>();

    const [stock, setStock] = useState<StockDto>();
    const [stockQuote, setStockQuote] = useState<StockQuote>();

    /*
    const location = useLocation();
    const paths = location.pathname.split("/").filter((x) => x);
    */
    
    const activeTab = tab || "overview";

    useEffect(() => {
        if (!symbol){
            return;
        }

        api.Stock.apiStockGetBySymbolSymbolGet(symbol)
            .then(res => setStock(res.data))
            .catch(err => console.error(err));
    }, [symbol]);

    useEffect(() => {
        if(!symbol){
            return;
        }

        api.Stock.apiStockGetStockQuoteGet(symbol)
            .then(res => setStockQuote(res.data))
            .catch(err => console.error(err));
    }, [symbol]);

    return <>
        <nav className="breadcrumb mt-6" aria-label="breadcrumbs">
            <ul>
                <li>
                    <Link to="/stocks">Részvények</Link>
                </li>
                <li className="is-active">
                    <Link to="#" aria-current="page">{stock?.symbol}</Link>
                </li>
            </ul>
        </nav>

        <nav className='panel'>
            <div className='panel-block is-flex is-justify-content-space-between is-align-items-center has-text-weight-bold py-6'>
                <div className='is-flex is-align-items-flex-end'>
                    <figure className='image is-128x128'>
                        <img src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock?.symbol}.png`} alt={`${stock?.symbol} logo`} />
                    </figure>
                    <div className='ml-3'>
                        <p className='is-size-3 has-font-weight-bold'>{stock?.companyName} ({stock?.symbol})</p>
                        <p className='is-size-6'>{stock?.exchange}</p>
                    </div>
                </div>
                <div className='is-flex is-flex-direction-row is-align-items-center'>
                    <p className='is-size-1'>${stock?.price}</p>
                    <div className='ml-4'
                        style={{color: (stockQuote?.d !== undefined && stockQuote?.d !== null)
                            ? stockQuote.d > 0 ? "green"
                            : stockQuote.d! < 0 ? 'red'
                            : 'black' : 'black'
                        }}>
                        <p style={{color:"inherit"}}>
                            {stockQuote?.d == null ? "-"
                            : stockQuote.d > 0
                            ? `+${stockQuote.d.toFixed(2)}`
                            : `${stockQuote.d.toFixed(2)}`}
                        </p>
                        <p style={{color:"inherit"}}>
                            {stockQuote?.dp == null ? "-"
                            : stockQuote.dp > 0
                            ? `+${stockQuote.dp.toFixed(2)}%`
                            : `${stockQuote.dp.toFixed(2)}%`}
                        </p>
                    </div>
                </div>                
            </div>

            <p className="panel-tabs is-justify-content-flex-start">
                <Link to={`/stocks/${symbol}/overview`} className={activeTab === "overview" ? "is-active" : ""}>Overview</Link>
                <Link to={`/stocks/${symbol}/financials/overview`} className={activeTab === "financials" ? "is-active" : ""}>Financials</Link>
                <Link to={`/stocks/${symbol}/technical`} className={activeTab === "technical" ? "is-active" : ""}>Technicals</Link>
            </p>

            <div className="main-box mt-5">
                {activeTab === "overview" && <Overview stock={stock} />}
                {activeTab === "financials" && <Financial stock={stock} activeSubTab={subtab} />}
                {activeTab === "technical" && <Technical stock={stock} />}
            </div>
        </nav>
    </>
};

export default StockView;
