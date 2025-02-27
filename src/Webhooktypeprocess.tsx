import React, { useEffect, useState } from 'react';

export const useWebSocketMessages = () => {
  const [whLatestValues, setwhLatestValues] = useState<any[]>([]);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      ws = new WebSocket('wss://rajaapp.in/'); // Replace with your WebSocket URL

      ws.onopen = () => {
        // console.log('WebSocket connection established.');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // console.log('Received message from WebSocket:', data);
          setwhLatestValues([data]); // Replace with the latest message
        } catch (error) {
          // console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        // console.error('WebSocket error:', error);
        reconnect();
      };

      ws.onclose = () => {
        // console.log('WebSocket connection closed.');
        reconnect();
      };
    };

    const reconnect = () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      reconnectTimeout = setTimeout(() => {
        // console.log('Attempting to reconnect...');
        connectWebSocket();
      }, 2000);
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      ws?.close();
    };
  }, []);

  return whLatestValues; // Return the extracted values
};
