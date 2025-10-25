import { useEffect, useState } from "react";
import type { StockNews, StockQuote } from "../../generated-sources/openapi";
import api from "../api/api";

const Dashboard = () => {
    const [stockQuote, setStockQuote] = useState<StockQuote>();
    const [stockNews, setStockNews] = useState<StockNews[]>([]);

    useEffect(() => {
        api.Stock.apiStockGetStockQuoteGet("AAPL").then(res => {
            setStockQuote(res.data);
        })
    }, []);

    useEffect(() => {
        api.StockNews.apiStockNewsGetNewsGet().then(res => {
            setStockNews(res.data);
        }).catch(error => {
            console.error("Error while loading news: ", error);
        });
    }, []);

    return (
        <div className="dashboard">
            <b>AAPL</b> <br />
            Current Price:  {stockQuote?.c} <br />
            Change: {stockQuote?.d} <br />
            Percent Change: {stockQuote?.dp}% <br />
            Previous close: {stockQuote?.pc}
            <br /><br />
            
            <div className="mt-6">
                <p className="subtitle pb-3 box-header">News</p>                                 
                <div className="columns is-multiline is-flex is-0 news-container">
                    {stockNews.slice(0, 6).map((newsItem, index) => (
                        <div key={index} className="column news-box p-3">                            
                            <a href={newsItem.url ?? ""} className="is-flex is-flex-direction-column">
                                <figure className="image is-16by9">
                                    <img src={newsItem.image ?? ""}/>
                                </figure>
                                <p className="is-size-6 has-text-weight-bold py-3">{newsItem.headline}</p>
                                <p style={{flex:'1'}}>{newsItem.summary}</p>
                                <p className="has-text-right vertical-align-end is-italic mt-3">
                                    {new Date((newsItem.datetime ?? 0) * 1000).toLocaleString("hu-HU")}
                                </p>                            
                            </a>
                        </div>                        
                    ))}
                </div>
            </div>            
        </div>        
    );
}

export default Dashboard;