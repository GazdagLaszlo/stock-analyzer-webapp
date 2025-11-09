import type { Earningscalendar, StockDto } from "../../../generated-sources/openapi";
import { formatMoney } from "../../utils/formatMoney";
import { useEffect, useState } from "react";
import api from "../../api/api";

const Overview = ({ stock }: { stock?: StockDto }) => {
    const [earnings, setEarnings] = useState<Earningscalendar>({});

    useEffect(() => {
        if(stock?.symbol){
            api.Stock.apiStockGetNextEarningsEventGet(stock?.symbol)
            .then(res => {
                setEarnings(res.data);                
            }).catch(error => {            
                console.error("Error while loading earnings: ", error);
            });
        }        
    }, [stock])

    return (
        <div className="stockview">
            <div className="data-box-2 p-5">
                <p className='title is-5'>Company data</p>
                <p>Market capitalization: {formatMoney(stock?.marketCap ?? 0)} USD</p>
                <p>Sector: {stock?.sector}</p>
                <p>Sharesoutstanding: {stock?.shareOutstanding}</p>
                <p>Website: <a href={stock?.website ?? ""} target="_blank">{stock?.website}</a></p>
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Upcoming earnings report</p>
                <p>Period - Q{earnings.quarter} {earnings.year}</p>
                <p>Report date: {earnings.date}</p>
                <p>EPS estimate: {earnings.epsEstimate} USD</p>
            </div>
        </div>
    );
};

export default Overview;