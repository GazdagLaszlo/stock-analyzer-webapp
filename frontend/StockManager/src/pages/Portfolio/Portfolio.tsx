import { useEffect, useState } from 'react';
import './Portfolio.scss';
import { TransactionType, type PortfolioCreateDto, type PortfolioDto, type PortfolioItemDto, type StockDto } from '../../../generated-sources/openapi';
import api from "../../api/api";
import PortfolioItemMenu from '../../components/Portfolio/PortfolioItemMenu';
import PortfolioItemDeleteModal from '../../components/Portfolio/PortfolioItemDeleteModal';
import NewPortfolioModal from '../../components/Portfolio/NewPortfolioModal';
import TransactionModal from '../../components/Portfolio/TransactionModal';

const Portfolio = () => {
    const [portfolios, setPortfolios] = useState<PortfolioDto[]>([]);    
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>();
    const [itemProfits, setItemProfits] = useState<{[id: number]: number}>({});
    const [portfolioValue, setPortfolioValue] = useState<number | null>();    
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

    const createTransaction = async (dto : {
            price: number,
            quantity: number,
            fee: number,
            transactionType: TransactionType,
            stockId?: number,
            portfolioId: number,
            note: string,
            date: string
        }) => {         
        if(dto.transactionType == TransactionType.NUMBER_1){
            const portfolioItem = selectedPortfolio?.portfolioItems?.find(x => x.stock?.id === dto.stockId);

            if(dto.quantity > (portfolioItem?.quantity ?? 0)){
                alert("You cannot sell more stock, than you have in your portfolio.");
                return;
            }            
        }
        await api.Transaction.apiTransactionCreatePost(dto);
        
        const response = await api.Portfolio.apiPortfolioGetAllGet();
        setPortfolios(response.data);
        
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

            <TransactionModal
                open={transactionModalOpen}
                onClose={() => {
                    setTransactionModalOpen(false);
                }}
                onCreate={createTransaction}
                portfolioId={selectedPortfolioId!}                
                selectedStock={selectedStock}
                portfolioItems={selectedPortfolio?.portfolioItems ?? []}
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