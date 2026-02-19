const TradeSummary = () => {

    return (
        <div>
            <p>Itt lehetne egy statisztika (Adott időszak tranzakciói, megtérülés,...)</p>
            <p>Lezárt ügyletek eredményei</p>
            <p>Profit arányt megjeleniteni</p>
            <p>Legjobb/legrosszabb trade</p>


            <table className="table mt-6">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th>Selling price</th>
                        <th>Buy price (avg)</th>
                        <th>Fees</th>
                        <th>Profit</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>        
    )
}

export default TradeSummary;