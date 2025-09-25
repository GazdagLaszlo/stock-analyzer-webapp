import { useEffect, useState } from 'react';
import './Portfolio.scss';
import type { PortfolioDto } from '../../generated-sources/openapi';
import api from "../api/api";

const Portfolio = () => {
    const [portfolios, setPortfolios] = useState<PortfolioDto[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>();
    const [itemProfits, setItemProfits] = useState<{[id: number]: number}>({});
    const [portfolioValue, setPortfolioValue] = useState<number | null>();

    useEffect(() => {
        api.Portfolio.apiPortfolioGetAllGet().then(res => {
            setPortfolios(res.data);
            if (res.data.length > 0) {
                setSelectedId(res.data[0].id);
            }            
        }).catch(error => {
            console.error("Error while loading stocks: ", error);
        });
    }, []);

    const selectedPortfolio = portfolios.find((p) => p.id === selectedId);
    
    useEffect(() => {
        if (!selectedPortfolio?.portfolioItems) {
             return;
        }

        setItemProfits({});

        selectedPortfolio.portfolioItems.forEach(async (item) => {
            try {
                api.PortfolioItem.apiPortfolioItemGetPortfolioItemProfitPortfolioItemIdGet(item.id!).then(res => {
                    setItemProfits(prev => ({ ...prev, [item.id!.toString()]: res.data }));
                })
            } catch (err) {
                console.error(`Error loading profit for item ${item.id!.toString()}:`, err);
                setItemProfits(prev => ({ ...prev, [item.id!]: 0 }));
            }
        });
    }, [selectedPortfolio]);    

    useEffect(() => {
        if (!selectedPortfolio?.portfolioItems) return;

            const sum = selectedPortfolio.portfolioItems.reduce((acc, item) => {
                return acc + ((item.quantity ?? 0) * (item.stock?.price ?? 0));
            }, 0);

        setPortfolioValue(sum);
    }, [selectedPortfolio]);

    const buttons = portfolios.map((portfolio) => (
        <button key={portfolio.id} className='button mr-2' onClick={() => setSelectedId(portfolio.id)}>
            {portfolio.name}
        </button>
    ));
        
    const portfolioItems = selectedPortfolio?.portfolioItems?.map((item, i) => (        
        <tr key={i}>
            <td>{item.stock?.companyName}</td>
            <td>{item.stock?.symbol}</td>
            <td>{item.stock?.price} USD</td>
            <td>{((item.quantity ?? 0)*(item.stock?.price ?? 0)).toFixed(2)} USD ({item.quantity?.toFixed(2)} {item.stock?.symbol})</td>
            <td>{itemProfits[item.id!] !== undefined ? itemProfits[item.id!].toFixed(2) : 'N/A'} USD</td>
            <td>{(item.stock?.price && item.purchasePrice) ? (((item.stock.price / item.purchasePrice)-1)*100).toFixed(2) : "N/A"} %</td>        
        </tr>
    ));

    const getTotalProfit = (itemProfits: {[id: number]: number}) =>{
        let sum = 0;
        for (const profit of Object.values(itemProfits)) {
            sum += profit;
        }
        return sum;
    }    

    return (
        <div className='mt-5'>
            <div className=''>
                {buttons}
            </div>

            <div className="columns mt-5 is-variable is-0 data-boxes">
                <div className="column is-one-quarter data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">Portfolio value</p>
                    <span className='subtitle mt-3 is-size-4'>{portfolioValue?.toFixed(2)} <span className="is-size-6">USD</span></span>
                </div>
                <div className="column is-one-quarter data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">Total profit</p>
                    <p className='subtitle mt-3 is-size-4'>{getTotalProfit(itemProfits).toFixed(2)} <span className="is-size-6">USD</span></p>
                </div>
            </div>
            <hr className='has-background-grey-light'/>

            <div className="is-flex is-flex-direction-column mt-6">
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Symbol</th>
                            <th>Price</th>
                            <th>Holdings</th>
                            <th>Profit (USD)</th>
                            <th>Profit (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfolioItems}
                    </tbody>
                </table>                
            </div>            
        </div>
    );
}

export default Portfolio;