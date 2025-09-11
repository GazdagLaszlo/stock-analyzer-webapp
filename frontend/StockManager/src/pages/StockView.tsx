import { useLocation } from 'react-router-dom';
import api from "../api/api";
import { useState, useEffect } from "react";
import type { StockDto } from "../../generated-sources/openapi";
import './StockView.scss';

const StockView = () => {
    const location = useLocation();
    const { stockId } = location.state || {};
    const [stock, setStock] = useState<StockDto>();
    const [activeTab, setActiveTab] = useState("overview");    

    useEffect(() => {
        if (!stockId){
            console.log("stockId:"+stockId);
            return
        } ;
        api.Stock.apiStockGetByIdIdGet(stockId)
            .then(res => setStock(res.data))
            .catch(error => console.error("Error while loading stock: ", error));
    }, [stockId]);

    return<>        
        <nav className='panel'>
            <div className='panel-block is-flex is-justify-content-space-between is-align-items-center has-text-weight-bold py-6'>
                <div className='is-flex is-align-items-flex-end is-justify-content-center'>
                    <figure className='image is-128x128'>
                        <img
                            src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${stock?.symbol}.png`}
                            alt={`${stock?.symbol} logo`}
                        />
                    </figure>
                    <div className='ml-3'>
                        <p className='is-size-3 has-font-weight-bold'>{stock?.companyName} ({stock?.symbol})</p>
                        <p className='is-size-6'>{stock?.exchange}</p>
                    </div>                    
                </div>                
                <p className='is-size-2'>${stock?.price}</p>
            </div>

            <p className="panel-tabs is-justify-content-flex-start">
                <a href='#' className={activeTab === "overview" ? "is-active" : ""} onClick={() => setActiveTab("overview")}>Áttekintés</a>
                <a href='#' className={activeTab === "item" ? "is-active" : ""} onClick={() => setActiveTab("item")}>Pénzügyi mutatók</a>
                <a href='#'>Technikai adatok</a>                
            </p>
            <div className="main-box">
                {activeTab === "overview" && (
                    <>
                        <div className="columns mt-5 is-variable is-0 data-boxes">
                            <div className="column data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                                <p>Piaci kapitalizáció</p>
                                <p className='subtitle mt-3 is-size-4'>{stock?.marketCap} USD</p>
                            </div>
                            <div className="column data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                                <p>EPS (TTM)</p>
                                <p className='subtitle mt-3 is-size-4'>6.61 USD</p>
                            </div>  
                            <div className="column data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                                <p>P/E (TTM)</p>
                                <p className='subtitle mt-3 is-size-4'>36.53</p>
                            </div>
                        </div>

                        <div className="data-box-2 p-5">
                            <p className='title is-4'>Cég adatok</p>
                            <p>Cégnév: {stock?.companyName}</p>
                            <p>Piaci kapitalizáció: {stock?.marketCap} USD</p>
                            <p>Szektor: {stock?.sector}</p>
                            <p>Részvények száma: {stock?.shareOutstanding}</p>
                            <p>CEO</p>
                            <p>Alkalmazottak száma</p>
                            <p>Alapítés éve</p>
                        </div>

                        <div className="data-box-2 p-5 mt-5">
                            <p className='title is-4'>Jövedelmezőség és növekedés</p>
                            <p>EPS</p>
                            <p>Net income</p>
                            <p>Free cash flow növekedés</p>
                            <p>Árbevétel növekedés</p>
                        </div>

                        <div className="data-box-2 p-5 mt-5">
                            <p className='title is-4'>Pénzügyi stabilitás</p>
                            <p>Debt/Equity</p>
                            <p>Dividend yield</p>
                            <p>Kifizetési ráta</p>
                            <p>Osztalék növekedés</p>
                            <p>Free cash flow</p>
                        </div>

                        <div className="data-box-2 p-5 mt-5">
                            <p className='title is-4'>Értékeltségi mutatók</p>
                            <p>P/E hányados</p>
                            <p>P/B hányados</p>
                        </div>

                        <div className="data-box-2 p-5 mt-5">
                            <p className='title is-4'>Technikai mutatók</p>
                            <p>RSI</p>
                            <p>200 napos mozgóátlag</p>
                            <p>Változás (Napi, Heti, Havi, Éves) %-ban kifejezve</p>
                        </div>

                        <div className="data-box-2 p-5 mt-5">
                            <p className='title is-4'>Piaci események</p>
                            <p>Earnings report date</p>
                            <p>Osztalékfizetés</p>
                        </div>              
                    </>
                )}


                {activeTab === "item" && (
                    <>
                        <p>Item</p>
                    </>
                )}                
            </div>
        </nav>
    </>
}

export default StockView;