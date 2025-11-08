import { useEffect, useState } from 'react';
import './Portfolio.scss';
import { TransactionType, type PortfolioCreateDto, type PortfolioDto, type PortfolioItemDto, type PortfolioUpdateDto, type StockDto } from '../../../generated-sources/openapi';
import api from "../../api/api";
import PortfolioItemMenu from '../../components/Portfolio/PortfolioItemMenu';
import PortfolioItemDeleteModal from '../../components/Portfolio/PortfolioItemDeleteModal';
import NewPortfolioModal from '../../components/Portfolio/NewPortfolioModal';
import TransactionModal from '../../components/Portfolio/TransactionModal';
import PortfolioMenu from '../../components/Portfolio/PortfolioMenu';
import PortfolioDeleteModal from '../../components/Portfolio/PortfolioDeleteModal';
import RenamePortfolioModal from '../../components/Portfolio/RenamePortfolioModal';
import { useNavigate, useParams } from 'react-router-dom';

const Portfolio = () => {
    const { portfolioId } = useParams<{ portfolioId?: string }>();

    const [portfolios, setPortfolios] = useState<PortfolioDto[]>([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioDto | undefined>(undefined);
    const [itemProfits, setItemProfits] = useState<{[id: number]: number}>({});
    const [portfolioValue, setPortfolioValue] = useState<number | null>();
    const [selectedStock, setSelectedStock] = useState<StockDto>();
    const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItemDto>();

    const navigate = useNavigate();

    const [transactionCreateData, setTransactionCreateData] = useState({
        price: '',
        quantity: '1',
        date: new Date().toISOString().split("T")[0],
        fee: '0',
        note: "",
    });

    const [transactionModalOpen, setTransactionModalOpen] = useState<true | false>(false);
    const [portfolioAddModalOpen, setPortfolioAddModalOpen] = useState<true | false>(false);
    const [portfolioItemDeleteModalOpen, setPortfolioItemDeleteModalOpen] = useState<true | false>(false);    
    const [portfolioDeleteModalOpen, setPortfolioDeleteModalOpen] = useState<true | false>(false);
    const [renamePortfolioModalOpen, setRenamePortfolioModalOpen] = useState<true | false>(false);
    
    useEffect(() => {
        api.Portfolio.apiPortfolioGetAllGet().then(res => {
            setPortfolios(res.data);
            if (res.data.length > 0) {
                if(portfolioId != null){
                    const id = res.data.find(p => p.id === parseInt(portfolioId));
                    setSelectedPortfolio(id);
                }
                else{
                    setSelectedPortfolio(res.data[0]);
                }                
            }            
        }).catch(error => {
            console.error("Error while loading portfolios: ", error);
        });
    }, []);
    
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

    useEffect(() => {
        if (selectedPortfolio) {
            const updated = portfolios.find(p => p.id === selectedPortfolio.id);
            if (updated){
                setSelectedPortfolio(updated);
            }
            else{
                setSelectedPortfolio(undefined);
            }
        }
    }, [portfolios]);

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
        const createResponse = await api.Portfolio.apiPortfolioCreatePost(createDto);
        const createdPortfolioId = createResponse.data;

        const response = await api.Portfolio.apiPortfolioGetAllGet();
        setPortfolios(response.data);

        const newPortfolio = response.data.find(x => x.id === createdPortfolioId);
        setSelectedPortfolio(newPortfolio);
    }

    const deletePortfolioItem = async (id: number | undefined ) => {
        if(id){
            await api.PortfolioItem.apiPortfolioItemDeleteIdDelete(id)
        }

        const response = await api.Portfolio.apiPortfolioGetAllGet();
        setPortfolios(response.data);
    }

    const renamePortfolio = async (portfolio : PortfolioUpdateDto) => {        
        if(portfolio.name && selectedPortfolio?.id){
            await api.Portfolio.apiPortfolioUpdateIdPut(selectedPortfolio.id, portfolio)
        }

        const response = await api.Portfolio.apiPortfolioGetAllGet();
        setPortfolios(response.data);
    }    

    const deletePortfolio = async () => {
        if(selectedPortfolio?.id){
            await api.Portfolio.apiPortfolioDeleteIdDelete(selectedPortfolio.id);
        }

        const response = await api.Portfolio.apiPortfolioGetAllGet();
        setPortfolios(response.data);

        setSelectedPortfolio(response.data[0])
    }

    const portfolioButtons = portfolios.map((portfolio) => (
        <button key={portfolio.id} className={"button mr-2 " + (selectedPortfolio == portfolio ? "is-dark" : "")} onClick={() => setSelectedPortfolio(portfolio)}>
            {portfolio.name}
        </button>
    ));
        
    const portfolioItems = selectedPortfolio?.portfolioItems?.map((item, i) => (
        <tr key={i} onClick={() => navigate(`/stocks/${item.stock?.symbol}`)} className='table-row'>
            <td>{item.stock?.companyName}</td>
            <td>{item.stock?.symbol}</td>
            <td>{item.stock?.price} USD</td>
            <td>{((item.quantity ?? 0)*(item.stock?.price ?? 0)).toFixed(2)} USD ({item.quantity?.toFixed(2)} {item.stock?.symbol})</td>
            <td style={{color: 
                    (itemProfits[item.id!] !== undefined)
                        ? itemProfits[item.id!] > 0 ? 'green'
                        : itemProfits[item.id!] < 0 ? 'red'
                        : 'black' : 'black'}}>

                {itemProfits[item.id!] !== undefined ? itemProfits[item.id!].toFixed(2) : '0'} USD

                <span className='ml-3 is-size-7' style={{color:"inherit"}}>

                    {(item.averagePurchasePrice && item.quantity)
                        ? ((itemProfits[item.id!] / (item.averagePurchasePrice * item.quantity)) * 100).toFixed(2)+' %' : ""}
                </span>
            </td>

            <td className='is-narrow'>
                <PortfolioItemMenu
                    onAddTransaction={() => {
                        setSelectedStock(item.stock);
                        setTransactionModalOpen(true);
                        setTransactionCreateData({...transactionCreateData, price: item.stock?.price?.toString() ?? "0"                            
                    })}}
                    onDeleteItem={() => {  if (item.id != null) {
                        setSelectedPortfolioItem(item);
                        setPortfolioItemDeleteModalOpen(true)}
                    }}
                />
            </td>
        </tr>
    ));

    const getTotalProfit = (itemProfits: {[id: number]: number}) =>{
        if (!selectedPortfolio?.portfolioItems) {
            return { profit: 0, profitDisplay: "0 ", isPositive: false, isNegative: false, percentDisplay: "" };
        }

        let totalProfit = 0;
        let totalInvested = 0;

        for (const item of selectedPortfolio.portfolioItems) {
            const profit = itemProfits[item.id!] ?? 0;
            const invested = (item.averagePurchasePrice ?? 0) * (item.quantity ?? 0);

            totalProfit += profit;
            totalInvested += invested;
        }
        
        const isPositive = totalProfit > 0;
        const isNegative = totalProfit < 0;
        let profitDisplay = `${isPositive ? '+' : '-'}${Math.abs(totalProfit).toFixed(2)} `;
        const percentChange = totalProfit / totalInvested * 100;
        let percentDisplay = `${percentChange > 0 ? '+' : '-'}${Math.abs(percentChange).toFixed(2)}%`

        if(totalProfit == 0){
            profitDisplay = "0 ";
            percentDisplay = "";
        }

        return { profit: totalProfit, profitDisplay, isPositive, isNegative, percentDisplay};
    }

    return (
        <div className='mt-5'>
            <div className='is-flex is-justify-content-space-between'>
                <div>
                    {portfolioButtons}
                    <button className='button' onClick={() => setPortfolioAddModalOpen(true)}>
                        +
                    </button>
                </div>
                <div>
                    <button className='button is-dark' onClick={() => setTransactionModalOpen(true)}>
                        Add transaction
                    </button>

                    <PortfolioMenu
                        onRename={() => {
                            setRenamePortfolioModalOpen(true)
                        }}
                        onDelete={() => {
                            setPortfolioDeleteModalOpen(true)
                        }}
                    />
                </div>                
            </div>

            <div className="columns mt-5 is-variable is-0 data-boxes">
                <div className="column is-one-quarter data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">Portfolio value</p>
                    <span className='subtitle mt-3 is-size-4'>{portfolioValue?.toFixed(2)} <span className="is-size-6">USD</span></span>
                </div>
                <div className="column is-one-quarter data-box is-flex is-flex-direction-column is-justify-content-center pl-5">
                    <p className="box-title">Total profit</p>
                    <p className='subtitle mt-3 is-size-4' 
                        style={{ color: getTotalProfit(itemProfits).isPositive ? 'green' : getTotalProfit(itemProfits).isNegative ? 'red' : 'black'}}>
                            {getTotalProfit(itemProfits).profitDisplay}
                            <span className="is-size-6" style={{color:"inherit"}}>
                                USD
                            </span>
                            <span className='is-size-6 ml-3' style={{color:"inherit"}}>
                                {getTotalProfit(itemProfits).percentDisplay}
                            </span>
                    </p>
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
                            <th>Unrealized profit</th>
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
                portfolioId={selectedPortfolio?.id}
                selectedStock={selectedStock}
                portfolioItems={selectedPortfolio?.portfolioItems ?? []}
            />

            <PortfolioItemDeleteModal
                open={portfolioItemDeleteModalOpen}
                onClose={() => setPortfolioItemDeleteModalOpen(false)}
                portfolioItem={selectedPortfolioItem}
                onDelete={deletePortfolioItem}
            />

            <NewPortfolioModal
                open={portfolioAddModalOpen}
                onClose={() => setPortfolioAddModalOpen(false)}
                onCreate={createPortfolio}
            />

            <PortfolioDeleteModal
                open={portfolioDeleteModalOpen}
                onClose={() => setPortfolioDeleteModalOpen(false)}
                selectedPortfolio={selectedPortfolio!}
                onDelete={deletePortfolio}
            />

            <RenamePortfolioModal
                open={renamePortfolioModalOpen}
                onClose={() => setRenamePortfolioModalOpen(false)} 
                oldName={selectedPortfolio?.name}
                onUpdate={renamePortfolio}
            />
        </div>
    );
}

export default Portfolio;