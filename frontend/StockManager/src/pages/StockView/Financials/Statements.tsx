import { useEffect, useRef, useState } from "react";
import type { StockDto, StockReportDto } from "../../../../generated-sources/openapi";
import api from "../../../api/api";
import { formatMoney } from "../../../utils/formatMoney";

const Statements = ({ stock }: { stock?: StockDto }) => {
    const [reports, setReports] = useState<StockReportDto[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(stock?.symbol){
            api.StockReports.apiStockReportGetStockReportsToSymbolSymbolGet(stock?.symbol).then(res => {
                setReports(res.data);
            }).catch(error => {            
                console.error("Error while loading reports: ", error);
            });
        }
    }, [stock?.symbol]);

    useEffect(() => {
        console.log("Updated reports:", reports);
    }, [reports]);

    const itemLabels = (reportSection : string) => {
        /*
        const labelSet = new Set<string>();
        
        reports.forEach(report => {
            const items = report.stockReportItems?.filter(item => item.reportSection == reportSection) || [];
            items.forEach(item => labelSet.add(item.label ?? "-"));
        });

        const labels = Array.from(labelSet);
        console.log(labels);
        return labels;                        
        */        
        
        const labels = ["Net income", "Total revenues", "Pretax income"];
        const concepts1 = [
            "us-gaap_NetIncomeLoss",
            "us-gaap_Revenues",
            "us-gaap_IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest"
        ];
        const concepts2 = [
            "NetIncomeLoss",
            "Revenues"
        ];

        return labels.map((label, i) => ({ label, concept1: concepts1[i], concept2: concepts2[i] }));
    }

    useEffect(() => {    
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [reports]);

    return (
        <div className="statements">
            <p className="is-size-5 has-text-weight-bold">{stock?.symbol} income statement</p>

            <div style={{overflowX: "auto"}} ref={scrollRef}>
                <table className="table is-fullwidth">
                <thead>
                    <tr>
                        <th className="sticky-col"></th>
                        {reports.sort((a, b) => (a.year ?? 0) - (b.year ?? 0)).map((report) => (
                            <th>{report.year}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>

                    {/*JPM-nél jól van mentve a netincome, de valamiért nem tölti be */}
                    {
                        itemLabels("ic").map(({label, concept1, concept2}) => (
                            <tr key={label}>
                                <td className="sticky-col" style={{minWidth: "250px"}}>{label}</td>
                                {reports.map(report => {
                                    const item = report.stockReportItems?.find(x => x.reportSection === "ic" && (x.concept === concept1 || x.concept === concept2));
                                        return <td key={report.year} style={{minWidth:"100px"}}>{item?.value != undefined ? formatMoney(item.value) : "-"}</td>;
                                })}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            </div>
        </div>
    )
};

export default Statements;