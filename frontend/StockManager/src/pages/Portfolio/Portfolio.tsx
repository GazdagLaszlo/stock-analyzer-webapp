import { useEffect, useState } from 'react';
import './Portfolio.scss';
import { TransactionType, type PortfolioCreateDto, type PortfolioDto, type PortfolioItemDto, type StockDto } from '../../../generated-sources/openapi';
import api from "../../api/api";
import PortfolioItemMenu from '../../components/Portfolio/PortfolioItemMenu';
import StockSelectModal from '../../components/Portfolio/StockSelectModal';
import PortfolioItemDeleteModal from '../../components/Portfolio/PortfolioItemDeleteModal';
import NewPortfolioModal from '../../components/Portfolio/NewPortfolioModal';

const Portfolio = () => {
    const [portfolios, setPortfolios] = useState<PortfolioDto[]>([]);
    const [stocks, setStocks] = useState<StockDto[]>([]);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>();
    const [itemProfits, setItemProfits] = useState<{[id: number]: number}>({});
    const [portfolioValue, setPortfolioValue] = useState<number | null>();
    const [transactionType, setTransactionType] = useState("Buy");
    const [selectedStock, setSelectedStock] = useState<StockDto>();    
    const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItemDto>();

    const [transactionCreateData, setTransactionCreateData] = useState({
        price: '',
        quantity: '1',
        date: new Date().toISOString().split("T")[0],
        fee: '0',
        note: "",
    });

    const [transactionModalOpen, setTransactionModalOpen] = useState(false);
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);    

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

    const clearTransactionData = () => {
        setTransactionCreateData({
            price: '',
            quantity: '1',
            date: new Date().toISOString().split("T")[0],
            fee: '0',
            note: "",
        });
        setSelectedStock({});

        setTransactionType("Buy");
    };

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
        
        if(transactionType == "Sell"){
            const portfolioItem = selectedPortfolio?.portfolioItems?.find(x => x.stock?.symbol === selectedStock?.symbol);

            if(Number(transactionCreateData.quantity) > (portfolioItem?.quantity ?? 0)){
                alert("You cannot sell more stock, than you have in your portfolio.");
                return;
            }            
        }
        await api.Transaction.apiTransactionCreatePost(dto);
        
        const response = await api.Portfolio.apiPortfolioGetAllGet();
        setPortfolios(response.data);        

        clearTransactionData();
        
        setTransactionModalOpen(false);
    }

    const createPortfolio = async (createDto: PortfolioCreateDto) => {
        await api.Portfolio.apiPortfolioCreatePost(createDto);

        const response = await api.Portfolio.apiPortfolioGetAllGet();
        setPortfolios(response.data);
    }

    const deletePortfolioItem = async (id: number | undefined ) => {
        if(id){
            await api.PortfolioItem.apiPortfolioItemDeleteIdDelete(id)
        }

        const response = await api.Portfolio.apiPortfolioGetAllGet();
        setPortfolios(response.data);
    }

    const loadStocks = async () => {
        if(transactionType == "Buy"){
            api.Stock.apiStockGetAllGet().then(res => {
                setStocks(res.data);
            })
            .catch(error => {
                console.error("Error while loading stocks: ", error);
            });
        }
        else if(transactionType == "Sell"){
            const portfolioStocks = selectedPortfolio?.portfolioItems?.filter(item => item.stock !== undefined)
                .map(item => item.stock as StockDto) ?? [];

            setStocks(portfolioStocks);
        }
    }    

    const portfolioButtons = portfolios.map((portfolio) => (
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
            <td className='is-narrow'>
                <PortfolioItemMenu
                    onAddTransaction={() => {
                        setSelectedStock(item.stock);
                        setTransactionModalOpen(true);
                        setTransactionCreateData({...transactionCreateData, price: item.stock?.price?.toString() ?? "0"                            
                    })}}
                    onDeleteItem={() => {  if (item.id != null) { 
                        setSelectedPortfolioItem(item);
                        setDeleteModalOpen(true)}
                    }}
                />
            </td>
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
                    {portfolioButtons}
                    <button className='button' onClick={() => setPortfolioModalOpen(true)}>
                        +
                    </button>
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfolioItems}
                    </tbody>
                </table>                
            </div>            


            {/*Transaction modal*/}
            <div className={`modal ${transactionModalOpen ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={() => {setTransactionModalOpen(false); clearTransactionData()}}></div>
                <div className="modal-content">
                    <div className="card p-6">
                        <h1 className='title is-4 mb-6'>Add transaction</h1>
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

                        <div className="field">
                            <label className='label'>Symbol</label>
                            <div className="select is-fullwidth" onClick={() => setStockModalOpen(true)} style={{ cursor: "pointer" }}>
                                <button className="button is-fullwidth is-justify-content-start" onClick={loadStocks}>
                                    <span>
                                        {selectedStock?.symbol ?? "Select symbol"}
                                    </span>                                    
                                </button>
                            </div>
                        </div>                        

                        <div className='columns mb-0'>
                            <div className="field column mb-0">
                                <label className="label">Price</label>
                                <div className="control">
                                    <input className="input" type="number" value={transactionCreateData.price}
                                    onChange={(e) => setTransactionCreateData({...transactionCreateData, price: e.target.value})}/>
                                </div>
                            </div>
                            <div className="field column mb-0">
                                <label className="label">Quantity</label>
                                <div className="control">
                                    <input className="input" type="number" value={transactionCreateData.quantity}
                                    onChange={(e) => setTransactionCreateData({...transactionCreateData, quantity: e.target.value})}/>
                                </div>
                            </div>                            
                        </div>    

                        <div className="columns mb-0">
                            <div className="field column mb-0">
                                <label className="label">Date</label>
                                <div className="control">
                                    <input className="input" type="date" value={transactionCreateData.date}
                                    onChange={(e) => setTransactionCreateData({...transactionCreateData, date: e.target.value})}/>
                                </div>
                            </div>
                            <div className="field column mb-0">
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
                                onChange={(e) => setTransactionCreateData({...transactionCreateData, note: e.target.value})}
                                style={{height: "100px", minHeight: "0px"}}></textarea>
                            </div>
                        </div>

                        <div className='is-flex is-justify-content-center mt-5'>
                            <button className='button is-dark' onClick={createTransaction}>
                                Add transaction
                            </button>
                        </div>                                                
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={() => {setTransactionModalOpen(false); clearTransactionData()} }></button>
            </div>
            
            <StockSelectModal
                open={stockModalOpen}
                onClose={() => setStockModalOpen(false)}
                stocks={stocks}
                onSelectStock={(stock) => {
                    setSelectedStock(stock);
                    setTransactionCreateData({ ...transactionCreateData, price: stock?.price?.toString() ?? "0" });
                    setStockModalOpen(false);
                }}
            />

            <PortfolioItemDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                portfolioItem={selectedPortfolioItem}
                onDelete={deletePortfolioItem}
            />

            <NewPortfolioModal
                open={portfolioModalOpen}
                onClose={() => setPortfolioModalOpen(false)}
                onCreate={createPortfolio}
            />
        </div>
    );
}

export default Portfolio;