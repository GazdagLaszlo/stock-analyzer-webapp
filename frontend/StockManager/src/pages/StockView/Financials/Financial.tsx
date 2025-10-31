import { Link } from "react-router-dom";
import type { StockDto } from "../../../../generated-sources/openapi";

import Dividend from "./Dividend";
import Overview from "./Overview";
import Statements from "./Statements";

const Financial = ({ stock, activeSubTab }: { stock?: StockDto, activeSubTab?: string }) => {
    const subTab = activeSubTab || "summary";

    return (
        <div>
            <p className="buttons mt-3 pl-5">
                <Link to={`/stocks/${stock?.symbol}/financials/overview`} className={`button ${subTab === "overview" ? "is-dark" : "is-light"}`}>Overview</Link>
                <Link to={`/stocks/${stock?.symbol}/financials/statements`} className={`button ${subTab === "statements" ? "is-dark" : "is-light"}`}>Statements</Link>
                <Link to={`/stocks/${stock?.symbol}/financials/dividend`} className={`button ${subTab === "dividend" ? "is-dark" : "is-light"}`}>Dividend</Link>
            </p>

            <div className="p-5">
                {subTab === "overview" && <Overview stock={stock} />}
                {subTab === "statements" && <Statements stock={stock} />}
                {subTab === "dividend" && <Dividend stock={stock} />}
            </div>
        </div>
    );
};

export default Financial;
