import type { StockDataDto, StockDto } from "../../../../generated-sources/openapi";
//import Dividend from "./Dividend";
import '../StockView.scss';
import { formatMoney } from "../../../utils/formatMoney";
import { useEffect, useState } from "react";
import api from "../../../api/api";

const Summary = ({ stock }: { stock?: StockDto }) => {
    const [stockData, setStockData] = useState<StockDataDto>();

    useEffect(() =>{
        if(stock?.symbol){
            api.StockData.apiStockDataGetBySymbolGet(stock?.symbol)
                .then(res => {
                    setStockData(res.data);
                }).catch(error => {
                console.error("Error while loading stockData: ", error);
            });
        }        
    }, [stock]);

    return (
        <div> 
            <div className="columns mt-5 is-variable is-0 data-boxes">
                <div className="column data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">Market Capitalization</p>
                    <span className='subtitle mt-3 is-size-4'>{formatMoney(stock?.marketCap ?? 0)} <span className="is-size-6">USD</span></span>
                </div>
                <div className="column data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">EPS (TTM)</p>
                    <p className='subtitle mt-3 is-size-4'>{stockData?.epsTTM?.toFixed(2)} <span className="is-size-6">USD</span></p>
                </div>  
                <div className="column data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">P/E (TTM)</p>
                    <p className='subtitle mt-3 is-size-4'>{stockData?.pettm?.toFixed(2)}</p>
                </div>
                <div className="column data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">Current dividend yield (TTM)</p>
                    <p className='subtitle mt-3 is-size-4'>{stockData?.currentDividendYieldTTM != 0 ? stockData?.currentDividendYieldTTM?.toFixed(2)+"%" : "-"}</p>
                </div>
            </div>

            <div className="data-box-2 p-5">
                <p className='title is-5'>Company data</p>
                <p>52 hetes range-ben hol vagyunk jelenleg</p>            
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Jövedelmezőség és növekedés</p>
                <p>EPS</p>
                <p>Net income</p>
                <p>Free cash flow növekedés</p>
                <p>Árbevétel növekedés</p>
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Pénzügyi stabilitás</p>
                <p>Debt/Equity</p>
                <p>Dividend yield</p>
                <p>Kifizetési ráta</p>
                <p>Osztalék növekedés</p>
                <p>Free cash flow</p>
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Értékeltségi mutatók</p>
                <p>P/E hányados</p>
                <p>P/B hányados</p>
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Technikai mutatók</p>
                <p>RSI</p>
                <p>200 napos mozgóátlag</p>
                <p>Változás (Napi, Heti, Havi, Éves) %-ban kifejezve</p>
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Piaci események</p>
                <p>Earnings report date</p>
                <p>Osztalékfizetés</p>
            </div>     
        </div>         
    )
};

export default Summary;
