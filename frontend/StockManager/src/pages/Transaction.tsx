import { useEffect, useState } from "react";
import type { TransactionDto } from "../../generated-sources/openapi";
import api from "../api/api";
import { formatMoney } from "../utils/formatMoney";
import TransactionDeleteModal from "../components/Transaction/TransactionDeleteModal";

const Transaction = () => {
    const [transactions, setTransactions] = useState<TransactionDto[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDto>();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        api.Transaction.apiTransactionGetAllGet().then(res => {
            setTransactions(res.data);
        }).catch(error => {
            console.error("Error while loading transactions: ", error);
        });
    }, []);

    const deleteTransaction = async (id : number | undefined) => {
        if(!id){
            return;
        }

        try{
            await api.Transaction.apiTransactionDeleteIdDelete(id)

            const response = await api.Transaction.apiTransactionGetAllGet();
            setTransactions(response.data);
        } catch(error){
            alert("Cannot delete this the transaction because some of the shares have already been sold.");        
            console.log(error)
        }
    };

    const rows = transactions.map((transaction) => (
        <tr key={transaction.id} className="table-row">
            <td>
                <figure className='image is-24x24'>
                    <img className="border-radius-5" src={`https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${transaction.stock?.symbol}.png`}/>
                </figure>
            </td>
            <td>{transaction.stock?.symbol}</td>
            <td>{transaction.stock?.companyName}</td>
            <td>{new Date(transaction.date == undefined ? "-" : transaction.date).toLocaleDateString()}</td>
            <td>{transaction.price} USD</td>
            <td>{transaction.quantity}</td>
            <td>{formatMoney(transaction.fee ?? 0)} USD</td>
            <td>{formatMoney((transaction.price ?? 0)*(transaction.quantity ?? 0) + (transaction.fee ?? 0))} USD</td>
            <td style={{ color: transaction.transactionType === 0 ? 'green' : 'red' }}>{transaction.transactionType === 0 ? "Buy" : "Sell"}</td>            
            <td>{transaction.note == "" ? "-" : transaction.note}</td>
            <td>
                <button className="button is-small" onClick={() => {setDeleteModalOpen(true); setSelectedTransaction(transaction)}}>
                    <span className="icon">
                        <i className="fas fa-trash"></i>
                    </span>
                </button>
            </td>
        </tr>
    ));

    return (
        <div className="transaction is-flex is-flex-direction-column is-align-items-center">
            <h1 className="title has-text-centered my-6">Transactions</h1>
            
            <div className="table-div mt-6">
                <table className="table is-fullwidth"> 
                    <thead>
                        <tr>
                            <th></th>
                            <th>Symbol</th>
                            <th>Company name</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Fee</th>
                            <th>Total</th>                            
                            <th>Transaction</th>                            
                            <th>Note</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>

            <TransactionDeleteModal
                open={deleteModalOpen}                
                selectedTransactionId={selectedTransaction?.id}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={deleteTransaction}
            />
        </div>        
    );
}

export default Transaction;