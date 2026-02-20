/*import { useEffect, useState, useRef } from "react";
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

                //await new Promise(resolve => setTimeout(resolve, 200));
                symbols.forEach(symbol => {
                    console.log(symbol);
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
       /*
       //Ezt a blokkot kivenni, nem volt benne 
       return () => {
            if (connectionRef.current) {
                subscribedSymbolsRef.current.forEach(symbol => {
                    connectionRef.current!.invoke("Unsubscribe", symbol)
                        .catch(err => console.error("Unsubscribe error:", err));
                });
                connectionRef.current.stop();
            }
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
*/

import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import type { StockDto } from "../../generated-sources/openapi";

export const useStockHub = (symbols: string[]) => {
    const [stocks, setStocks] = useState<StockDto[]>([]);
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const subscribedSymbolsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        // 1️⃣ Hub connection létrehozása
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7024/stockPriceHub")
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        // 2️⃣ Tick-ek kezelése
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

        // 3️⃣ Connection események kezelése
        connection.onreconnected(() => {
            console.log("SignalR reconnected");
            subscribedSymbolsRef.current.forEach(symbol => {
                connection.invoke("Subscribe", symbol)
                    .catch(err => console.error("Subscribe error after reconnect:", err));
            });
        });

        connection.onclose(async () => {
            console.log("SignalR connection closed. Trying to reconnect...");
            try {
                await connection.start();
                console.log("SignalR reconnected after close");
                subscribedSymbolsRef.current.forEach(symbol => {
                    connection.invoke("Subscribe", symbol)
                        .catch(err => console.error("Subscribe error after reconnect:", err));
                });
            } catch (err) {
                console.error("Failed to reconnect SignalR:", err);
            }
        });

        // 4️⃣ Kapcsolat indítása
        const startConnection = async () => {
            try {
                await connection.start();
                console.log("SignalR connected");

                // Első feliratkozás minden szimbólumra
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

        // 5️⃣ Cleanup: minden szimbólumról leiratkozás + kapcsolat stop
        return () => {
            if (connectionRef.current) {
                subscribedSymbolsRef.current.forEach(symbol => {
                    connectionRef.current!.invoke("Unsubscribe", symbol)
                        .catch(err => console.error("Unsubscribe error:", err));
                });
                connectionRef.current.stop();
            }
        };
    }, []);

    // 6️⃣ Új symbols-ek kezelése
    useEffect(() => {
        if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
            return;
        }

        // Új szimbólumokra feliratkozás
        const newSymbols = symbols.filter(s => !subscribedSymbolsRef.current.has(s));
        newSymbols.forEach(symbol => {
            connectionRef.current!.invoke("Subscribe", symbol)
                .then(() => subscribedSymbolsRef.current.add(symbol))
                .catch(err => console.error("Subscribe error:", err));
        });

        // Eltávolított szimbólumokról leiratkozás
        const removedSymbols = Array.from(subscribedSymbolsRef.current)
            .filter(s => !symbols.includes(s));
        removedSymbols.forEach(symbol => {
            connectionRef.current!.invoke("Unsubscribe", symbol)
                .then(() => subscribedSymbolsRef.current.delete(symbol))
                .catch(err => console.error("Unsubscribe error:", err));
        });
    }, [symbols]);

    return stocks;
};
