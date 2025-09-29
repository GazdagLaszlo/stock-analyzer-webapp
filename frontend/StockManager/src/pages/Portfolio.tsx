import { useEffect, useState } from 'react';
import './Portfolio.scss';
import { TransactionType, type PortfolioDto, type StockDto } from '../../generated-sources/openapi';
import api from "../api/api";

const Portfolio = () => {
    const [portfolios, setPortfolios] = useState<PortfolioDto[]>([]);
    const [stocks, setStocks] = useState<StockDto[]>([]);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>();
    const [itemProfits, setItemProfits] = useState<{[id: number]: number}>({});
    const [portfolioValue, setPortfolioValue] = useState<number | null>();
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState("Buy");
    const [selectedStock, setSelectedStock] = useState<StockDto>();

    const [transactionCreateData, setTransactionCreateData] = useState({
        price: '',
        quantity: '',
        date: new Date().toISOString().split("T")[0],
        fee: '',
        note: "",
    });

    useEffect(() => {
        api.Portfolio.apiPortfolioGetAllGet().then(res => {
            setPortfolios(res.data);
            if (res.data.length > 0) {
                setSelectedPortfolioId(res.data[0].id);
            }            
        }).catch(error => {
            console.error("Error while loading portfolios: ", error);
        });
    }, []);

    const selectedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId);
    
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

    const createTransaction = async () => {        
        const dto = {
            ...transactionCreateData,
            price: Number(transactionCreateData.price),
            quantity: Number(transactionCreateData.quantity),
            fee: Number(transactionCreateData.fee),
            transactionType: transactionType === "Buy" ? TransactionType.NUMBER_0 : TransactionType.NUMBER_1,
            stockId: selectedStock?.id,
            portfolioId: selectedPortfolioId ?? -1
        };

        await api.Transaction.apiTransactionCreatePost(dto);
        
        const response = await api.Portfolio.apiPortfolioGetAllGet();
        setPortfolios(response.data);        

        setTransactionCreateData({
            price: '',
            quantity: '',
            date: new Date().toISOString().split("T")[0],
            fee: '',
            note: "",
        });
        setSelectedStock({});
        
        setTransactionModalOpen(false);
    }

    const loadStocks = async () => {
        api.Stock.apiStockGetAllGet().then(res => {
            setStocks(res.data);
        })
        .catch(error => {
            console.error("Error while loading stocks: ", error);
        });       
    }

    const sortedStocks = [...stocks].sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));

    const rows = sortedStocks.map((stock, index) => (
        <tr 
            key={stock.id} 
            className="table-row" 
            onClick={() => {setSelectedStock(stock); setStockModalOpen(false)}}
        >
            <td>{index + 1}</td>
            <td>{stock.symbol}</td>
            <td>{stock.companyName}</td>                                    
        </tr>
    ));
    

    const buttons = portfolios.map((portfolio) => (
        <button key={portfolio.id} className={"button mr-2 " + (selectedPortfolioId == portfolio.id ? "is-dark" : "")} onClick={() => setSelectedPortfolioId(portfolio.id)}>
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
            <td>{(item.stock?.price && item.averagePurchasePrice) ? (((item.stock.price / item.averagePurchasePrice)-1)*100).toFixed(2) : "N/A"} %</td>        
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
            <div className='is-flex is-justify-content-space-between'>
                <div>
                    {buttons}
                </div>
                <div>
                    <button className='button is-dark' onClick={() => setTransactionModalOpen(true)}>
                        Add transaction
                    </button>
                </div>
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

            <div className={`modal ${transactionModalOpen ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={() => setTransactionModalOpen(false)}></div>
                <div className="modal-content">
                    <div className="card p-6">
                        <h1 className='title is-4 mb-6'>Add transaction</h1>
                        <label className='label'>Transaction type</label>
                        <div className='mt-1 mx-0 columns'>
                            <div className='column p-0 mr-3'>
                                <button className={"button is-normal is-fullwidth has-text-weight-bold "
                                     + (transactionType === "Buy" ? "is-success" : "is-light")}
                                     onClick={() => setTransactionType("Buy")}>Buy</button>
                            </div>
                            <div className='column p-0'>
                                <button className={"button is-normal is-fullwidth has-text-weight-bold "
                                     + (transactionType === "Sell" ? "is-danger" : "is-light")}
                                     onClick={() => setTransactionType("Sell")}>Sell</button>
                            </div>                                            
                        </div>                        

                        <div className="field mt-5">
                            <label className='label'>Symbol</label>
                            <div className="select is-fullwidth" onClick={() => setStockModalOpen(true)} style={{ cursor: "pointer" }}>
                                <button className="button is-fullwidth is-justify-content-start" onClick={loadStocks}>
                                    <span>
                                        {selectedStock?.symbol ?? "Select symbol"}
                                    </span>                                    
                                </button>
                            </div>
                        </div>                        

                        <div className='columns mt-4'>
                            <div className="field column">
                                <label className="label">Price</label>
                                <div className="control">
                                    <input className="input" type="number" value={transactionCreateData.price}
                                    onChange={(e) => setTransactionCreateData({...transactionCreateData, price: e.target.value})}/>
                                </div>
                            </div>
                            <div className="field column">
                                <label className="label">Quantity</label>
                                <div className="control">
                                    <input className="input" type="number" min={1} value={transactionCreateData.quantity}
                                    onChange={(e) => setTransactionCreateData({...transactionCreateData, quantity: e.target.value})}/>
                                </div>
                            </div>                            
                        </div>    

                        <div className="columns">
                            <div className="field column">
                                <label className="label">Date</label>
                                <div className="control">
                                    <input className="input" type="date" value={transactionCreateData.date}
                                    onChange={(e) => setTransactionCreateData({...transactionCreateData, date: e.target.value})}/>
                                </div>
                            </div>
                            <div className="field column">
                                <label className="label">Fee</label>
                                <div className="control">
                                    <input className="input" type="number" min={0} value={transactionCreateData.fee}
                                    onChange={(e) => setTransactionCreateData({...transactionCreateData, fee: e.target.value})}/>
                                </div>
                            </div>
                        </div>                         

                        <div className="field">
                            <label className="label">Notes</label>
                            <div className="control">
                                <textarea className="textarea" placeholder="Type notes..." value={transactionCreateData.note}
                                onChange={(e) => setTransactionCreateData({...transactionCreateData, note: e.target.value})}></textarea>
                            </div>
                        </div>

                        <div className='is-flex is-justify-content-center mt-6'>
                            <button className='button is-dark' onClick={createTransaction}>
                                Add transaction
                            </button>
                        </div>                                                
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={() => setTransactionModalOpen(false)}></button>
            </div>

            <div className={`modal ${stockModalOpen ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={() => setStockModalOpen(false)}></div>
                <div className="modal-content">
                    <div className="card p-6">
                        <table className="table is-fullwidth mt-6">
                            <thead>
                                <tr>
                                    <th>Sorszám</th>
                                    <th>Szimbólum</th>
                                    <th>Név</th>                                
                                </tr>                    
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>                    
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={() => setStockModalOpen(false)}></button>
            </div>

        </div>
    );
}

export default Portfolio;