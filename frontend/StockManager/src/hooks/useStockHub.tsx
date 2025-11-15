import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import type { StockDto } from "../../generated-sources/openapi";

export const useStockHub = (symbols: string[]) => {
    const [stocks, setStocks] = useState<StockDto[]>([]);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7024/stockPriceHub")
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        const startConnection = async () => {
            try {
                await connection.start();
                console.log("SignalR connected");

                symbols.forEach(symbol => {
                    connection.invoke("Subscribe", symbol)
                        .then(() => subscribedSymbolsRef.current.add(symbol))
                        .catch(err => console.error("Subscribe error:", err));
                });
            } catch (err) {
                console.error("SignalR connection error:", err);
            }
        };

        startConnection();

        connection.on("ReceiveRate", (symbol: string, price: number) => {
            setStocks(prev => {
                const existing = prev.find(s => s.symbol === symbol);
                if (existing) {
                    return prev.map(s => s.symbol === symbol ? { ...s, price } : s);
                } else {
                    return [...prev, { symbol, price } as StockDto];
                }
            });
        });

        return () => {
            connection.stop();
        };
    }, [symbols]);

    const subscribedSymbolsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
            symbols.forEach(symbol => {
                if (!subscribedSymbolsRef.current.has(symbol)) {
                connectionRef.current!.invoke("Subscribe", symbol)
                    .then(() => subscribedSymbolsRef.current.add(symbol))
                    .catch(err => console.error("Subscribe error:", err));
                }
            });
        }
    }, [symbols]);

    return stocks;
};
