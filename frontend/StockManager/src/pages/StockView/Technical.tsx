import type { StockDto } from "../../../generated-sources/openapi";

const Technical = ({ stock }: { stock?: StockDto }) => {
    return (
        <div>
            <h2 className="title is-4">Technikai adatok</h2>
            <p>RSI</p>
            <p>200 napos mozgóátlag</p>
            <p>Ár változások (Napi, Heti, Havi, Éves)</p>
        </div>
    );
};

export default Technical;
