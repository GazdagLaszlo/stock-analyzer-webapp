import type { StockDto } from "../../../generated-sources/openapi";
import './StockView.scss';

const Overview = ({ stock }: { stock?: StockDto }) => {
    return (
        <div>
            <div className="data-box-2 p-5">
                <p className='title is-5'>Overview</p>
                <p>Piaci kapitalizáció: {stock?.marketCap} USD</p>
                <p>Szektor: {stock?.sector}</p>
                <p>Részvények száma: {stock?.shareOutstanding}</p>
                <p>CEO</p>
                <p>Alkalmazottak száma</p>
                <p>Alapítés éve</p>
                <p>Website: <a href={stock?.website ?? ""} target="_blank">{stock?.website}</a></p>
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Teljesítmény</p>
                <p>Napi, Heti, Havi, Éves árfolyammozgás</p>
            </div>

            <div className="data-box-2 p-5 mt-5">
                <p className='title is-5'>Események</p>
                <p>Next report date - period</p>
                <p>Dividend payment date</p>
            </div>
        </div>
    );
};

export default Overview;