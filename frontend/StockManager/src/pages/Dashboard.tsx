import { useEffect, useState } from "react";
import type { PortfolioDto, StockNews } from "../../generated-sources/openapi";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [stockNews, setStockNews] = useState<StockNews[]>([]);
    const [portfolios, setPortfolios] = useState<PortfolioDto[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        api.StockNews.apiStockNewsGetNewsGet().then(res => {
            setStockNews(res.data);
        }).catch(error => {
            console.error("Error while loading news: ", error);
        });
    }, []);

    useEffect(() => {
        api.Portfolio.apiPortfolioGetAllGet().then(res => {
            setPortfolios(res.data);
        }).catch(error => {
            console.error("Error while loading portfolios: ", error);
        });
    }, []);

    return (
        <div className="dashboard">
            <p className="subtitle mt-6">Portfolios</p>
            <div className="columns mt-5 is-variable is-0 data-boxes">
                {portfolios.map((portfolio) => {
                    const value = portfolio.portfolioItems?.reduce((sum, item) => {
                        return sum + ((item.quantity ?? 0) * (item.stock?.price ?? 0));
                    }, 0);

                    const profit = portfolio.portfolioItems?.reduce((sum, item) => {
                        const itemProfit = ((item.stock?.price ?? 0) - (item.averagePurchasePrice ?? 0)) * (item.quantity ?? 0);
                        return sum + itemProfit;
                    }, 0)

                    const invested = portfolio.portfolioItems?.reduce((sum, item) => {                        
                        return sum + ((item.averagePurchasePrice ?? 0) * (item.quantity ?? 0));
                    }, 0)

                    const changePercent = (profit ?? 0) / (invested ?? 1) * 100;

                    return <>
                        <div className="data-box is-flex is-flex-direction-column is-justify-content-space-between p-5" style={{height:"23vh", cursor:"pointer"}}
                            onClick={() => navigate(`/portfolio/${portfolio.id}`)}>
                            <p className="is-size-5 mb-4">{portfolio.name}</p>
                            <div className="is-flex flex-direction-row is-justify-content-space-between">
                                <div className="mr-6">
                                    <p className="box-title">Total value</p>
                                    <span className='subtitle mt- is-size-4'>{value?.toFixed(2)} <span className="is-size-6">USD</span></span>
                                </div>
                                <div>
                                    <p className="box-title">Unrealized profit</p>
                                    <span className='subtitle mt- is-size-4'
                                        style={{ color: (profit ?? 0) > 0 ? 'green' : (profit ?? 0) < 0 ? 'red' : 'black'}}>
                                        {(profit ?? 0) > 0 ? `+${profit?.toFixed(2)}` : profit?.toFixed(2)}
                                        <span className="is-size-6" style={{color:"inherit"}}> USD</span>
                                        <span style={{color:"inherit"}} className="ml-4 is-size-6">
                                            {(changePercent ?? 0) > 0 ? `+${changePercent.toFixed(2)}` : changePercent.toFixed(2)}%    
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>  
                    </>
                })}
            </div>
            
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