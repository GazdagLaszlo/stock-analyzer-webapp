import { PeriodType, type StockDataDto, type StockDto } from "../../../../generated-sources/openapi";
import { formatMoney } from "../../../utils/formatMoney";
import { useEffect, useMemo, useState } from "react";
import api from "../../../api/api";

const Summary = ({ stock }: { stock?: StockDto }) => {
    const [stockData, setStockData] = useState<StockDataDto>();
    const [ PEIndustryAvg, setPEIndustryAvg] = useState<number | null>(null);

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

    useEffect(() => {
        getPEIndustryAvg();
    }, [stock]);

    const getEPSGrowthYoY = useMemo(() => {
        const currentEPSData = stockData?.stockDataItems?.filter(x => x.periodType == 1 && x.metricName?.toLowerCase() == "eps");
        if(currentEPSData){
            currentEPSData.sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
        }

        const currentEPS = currentEPSData ? currentEPSData[currentEPSData.length-1] : null;
        const previousEPS = currentEPSData ? currentEPSData[currentEPSData.length-5] : null;

        console.log("current:"+currentEPS?.v);
        console.log("prev:"+previousEPS?.v);

        if(currentEPS?.v && previousEPS?.v) {
            if(previousEPS.v < 0 || currentEPS.v < 0){
                return { type: 'absolute', value: currentEPS.v - previousEPS.v };
            }
            else{
                return { type: 'percent', value: ((currentEPS.v / previousEPS.v) - 1) * 100 };                
            }            
        }
    }, [stockData]);

    const getPEIndustryAvg = async () => {
        if(!stock?.symbol){
            return;
        }
        
        const getPeers = await api.Stock.apiStockGetCompanyPeersGet(stock?.symbol);
        const peers = getPeers.data;

        const pePromises = peers.map(async (symbol) => {
            try{
                const getStockData = await api.StockData.apiStockDataGetBySymbolGet(symbol);
                return getStockData.data.pettm ?? null;
            }catch(error){
                console.log("No stockData found to "+symbol, error);
                return null;
            }            
        });
        const peValues = await Promise.all(pePromises);
        const validPeValues = peValues.filter((pe): pe is number => pe !== null);

        if(validPeValues.length > 5){
            const sum = validPeValues.reduce((acc, val) => acc + val, 0);        
            setPEIndustryAvg(sum/validPeValues.length);
        }        
    }

    return (
        <div className="stockview"> 
            <div className="columns mt-5 is-variable is-0 data-boxes">
                <div className="column data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">Market Capitalization</p>
                    <span className='subtitle mt-3 is-size-4'>{formatMoney(stock?.marketCap ?? 0)} <span className="is-size-6">USD</span></span>
                </div>
                <div className="column data-box px-3 is-flex is-flex-direction-column is-justify-content-center">
                    <p className="box-title ml-3 mb-4" style={{color:""}}>EPS Analysis</p>
                    
                    <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between">
                        <div style={{borderRight:"1px solid lightgrey"}}  className="column p-2 is-flex is-flex-direction-column is-align-items-center">                            
                            <p className='subtitle is-size-4 mb-3'>{stockData?.epsTTM?.toFixed(2)} <span className="is-size-6">USD</span></p>
                            <p className="box-title">EPS (TTM)</p>
                        </div>                    
                        <div className="column p-2 is-flex is-flex-direction-column is-align-items-center">                            
                            <p style={{color: getEPSGrowthYoY ? (getEPSGrowthYoY.value > 0 ? "green" : "red") : "black"}}
                                className="is-size-4 subtitle has-text-centered mb-3">{getEPSGrowthYoY ? 
                                    (getEPSGrowthYoY?.type == "percent"
                                        ? ((getEPSGrowthYoY.value >= 0 ? "+" : "") + getEPSGrowthYoY?.value?.toFixed(2)+"%") 
                                        : (<>
                                        {(getEPSGrowthYoY.value >= 0 ? "+" : "") + getEPSGrowthYoY.value.toFixed(2)}<span className="is-size-6" style={{color:"inherit"}}> USD</span></>)):("-")}                            </p>
                            <p className="box-title">EPS Growth (YoY)</p>
                        </div>
                    </div>                    
                </div>
                <div className="column data-box px-3 is-flex is-flex-direction-column is-justify-content-center">
                    <p className="box-title ml-3 mb-4" style={{color:""}}>P/E Analysis</p>

                    <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between">
                        <div style={{borderRight:"1px solid lightgrey"}} className="column p-2 is-flex is-flex-direction-column is-align-items-center">                            
                            <p className='subtitle is-size-4 mb-3'>{stockData?.pettm?.toFixed(2)}</p>
                            <p className="box-title">P/E (TTM)</p>
                        </div>
                        <div className="column p-2 is-flex is-flex-direction-column is-align-items-center">                            
                            <p className="is-size-4 subtitle has-text-centered mb-3">
                                {PEIndustryAvg ? PEIndustryAvg.toFixed(2) : "-"}
                            </p>
                            <p className="box-title">Sector Avg P/E</p>
                        </div>
                    </div>                    
                </div>
                <div className="column data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">Current dividend yield (TTM)</p>
                    <p className='subtitle mt-3 is-size-4'>{stockData?.currentDividendYieldTTM != 0 ? stockData?.currentDividendYieldTTM?.toFixed(2)+"%" : "-"}</p>
                </div>
            </div>            

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Profitability</p>
                <p>Net income</p>
                <p>Free cash flow növekedés</p>
                <p>Árbevétel növekedés</p>                
            </div>                                    

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Financial stability</p>
                <table className="table financials-table is-fullwidth">
                    <tbody>
                        <tr>
                            <td>Long-Term Debt to Equity:</td>
                            <td>{stockData?.longTermDebtToEquityAnnual*100}%</td>
                        </tr>
                        <tr>
                            <td>Cash flow per Share:</td>
                            <td>{stockData?.cashFlowPerShareTTM.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                {/*
                <p>Kifizetési ráta</p>
                <p>Osztalék növekedés</p>
                <p>Free cash flow</p>*/}
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5 mb-6'>Valuation metrics</p>
                <table className="table financials-table is-fullwidth">
                    <tbody>
                        <tr>
                            <td className="">52 week range:</td>
                            <td style={{height:"10vh"}}>
                                <div className="is-flex">                            
                                    <span className="has-text-weight-bold">{stockData?.yearLow}</span>
                                    <div className="range-box mx-2 is-flex is-align-items-center">
                                        <div className="range"></div>
                                        <div className="current-position-marker" 
                                            style={{left: `${(stock?.price && stockData?.yearHigh && stockData?.yearLow)
                                                    ? ((stock.price - stockData.yearLow) /
                                                    (stockData.yearHigh - stockData.yearLow) * 100)
                                                    : 0}%`
                                            }}>
                                        </div>
                                        <span className="current-value has-text-weight-bold"
                                            style={{left: `${(stock?.price && stockData?.yearHigh && stockData?.yearLow)
                                                    ? ((stock.price - stockData.yearLow) /
                                                    (stockData.yearHigh - stockData.yearLow) * 100)
                                                    : 0}%`}}>
                                                {stock?.price}
                                        </span>
                                    </div>
                                    <span className="has-text-weight-bold">{stockData?.yearHigh}</span>
                                </div>
                            </td>
                        </tr>                        

                        <tr>
                            <td>Price to Earnings (TTM):</td>
                            <td>{stockData?.pettm}</td>
                        </tr>
                        <tr>
                            <td>Price to Book:</td>
                            <td>{stockData?.priceToBookvalue}</td>
                        </tr>
                        <tr>
                            <td>Price to Sales (TTM):</td>
                            <td>{stockData?.psttm}</td>
                        </tr>
                        <tr>
                            <td>Dividend yield per Share:</td>
                            <td>{stockData?.dividendPerShareTTM ? 0 : "-"}</td>
                        </tr>
                    </tbody>
                </table>                
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Technical metrics</p>
                <p>RSI</p>
                <p>200 napos mozgóátlag</p>
                <p>Változás (Napi, Heti, Havi, Éves) %-ban kifejezve</p>
            </div>
        </div>         
    )
};

export default Summary;
