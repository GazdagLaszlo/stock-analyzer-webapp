import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import type { StockDto } from '../../generated-sources/openapi';

export const useStockHub = (symbols: string[]) => {
  const [stocks, setStocks] = useState<StockDto[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const subscribedSymbolsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7024/stockPriceHub')
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on('ReceiveRate', (symbol: string, price: number) => {
      setStocks((prev) => {
        const existing = prev.find((s) => s.symbol === symbol);
        if (existing) {
          return prev.map((s) => (s.symbol === symbol ? { ...s, price } : s));
        } else {
          return [...prev, { symbol, price } as StockDto];
        }
      });
    });

    connection.onreconnected(() => {
      console.log('SignalR reconnected');
      subscribedSymbolsRef.current.forEach((symbol) => {
        connection
          .invoke('Subscribe', symbol)
          .catch((err) =>
            console.error('Subscribe error after reconnect:', err)
          );
      });
    });

    connection.onclose(async () => {
      console.log('SignalR connection closed. Trying to reconnect...');
      try {
        await connection.start();
        console.log('SignalR reconnected after close');
        subscribedSymbolsRef.current.forEach((symbol) => {
          connection
            .invoke('Subscribe', symbol)
            .catch((err) =>
              console.error('Subscribe error after reconnect:', err)
            );
        });
      } catch (err) {
        console.error('Failed to reconnect SignalR:', err);
      }
    });

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR connected');

        symbols.forEach((symbol) => {
          connection
            .invoke('Subscribe', symbol)
            .then(() => subscribedSymbolsRef.current.add(symbol))
            .catch((err) => console.error('Subscribe error:', err));
        });
      } catch (err) {
        console.error('SignalR connection error:', err);
      }
    };
    startConnection();

    return () => {
      if (connectionRef.current) {
        subscribedSymbolsRef.current.forEach((symbol) => {
          connectionRef
            .current!.invoke('Unsubscribe', symbol)
            .catch((err) => console.error('Unsubscribe error:', err));
        });
        connectionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (
      !connectionRef.current ||
      connectionRef.current.state !== signalR.HubConnectionState.Connected
    ) {
      return;
    }

    const newSymbols = symbols.filter(
      (s) => !subscribedSymbolsRef.current.has(s)
    );
    newSymbols.forEach((symbol) => {
      connectionRef
        .current!.invoke('Subscribe', symbol)
        .then(() => subscribedSymbolsRef.current.add(symbol))
        .catch((err) => console.error('Subscribe error:', err));
    });

    const removedSymbols = Array.from(subscribedSymbolsRef.current).filter(
      (s) => !symbols.includes(s)
    );
    removedSymbols.forEach((symbol) => {
      connectionRef
        .current!.invoke('Unsubscribe', symbol)
        .then(() => subscribedSymbolsRef.current.delete(symbol))
        .catch((err) => console.error('Unsubscribe error:', err));
    });
  }, [symbols]);

  return stocks;
};
