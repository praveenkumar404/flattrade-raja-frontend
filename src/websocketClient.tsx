import React from "react";

const flattradeWsUrl = 'wss://piconnect.flattrade.in/PiConnectWSTp/';
let flattradeWs: WebSocket | null = null;

// Connect to WebSocket & subscribe
const connectFlattradeWebSocket = (
  userId: any,
  sessionToken: any,
  accountId: any,
  scripList: any,
  onLpValueReceived: (message: number) => void // Callback to handle new lp value
): WebSocket | null => {
  try {
    flattradeWs = new WebSocket(flattradeWsUrl);

    flattradeWs.onopen = () => {
      console.log('Flattrade WebSocket connection established.');
      sendConnectionRequest(userId, sessionToken, accountId);
    };

    flattradeWs.onmessage = (event) => {
      const messageString = event.data;
      const message = JSON.parse(messageString);

      // Use switch-case to handle different message types
      switch (message.t) {
        case 'ck':
          if (message.s === 'OK') {
            console.log('Connection acknowledged for user:', message);
            subscribeTouchline(scripList); // Subscribing to touchline data
            // subscribeOrderUpdate(userId, sessionToken, accountId);
          } else {
            console.error('Connection failed: Invalid user ID or session token.');
          }
          break;

        case 'tk':
          console.log('Subscription acknowledged:', message);
          break;

        case 'tf':
            console.log('Received lp value:', message);
            onLpValueReceived(message); // Pass lp value to the chart
          break;

        case 'uk':
          console.log('Unsubscription acknowledged:', message);
          break;

        default:
          console.log('Unknown message type:', message);
      }
    };

    flattradeWs.onclose = () => {
      console.log('Flattrade WebSocket connection closed. Attempting reconnect...');
      setTimeout(() => connectFlattradeWebSocket(userId, sessionToken, accountId, scripList, onLpValueReceived), 5000);
    };

    flattradeWs.onerror = (error) => {
      console.error('Flattrade WebSocket error:', error);
    };

    return flattradeWs;
  } catch (error) {
    console.error('Failed to connect to WebSocket:', error);
    return null;
  }
};

// Send connection request
const sendConnectionRequest = (userId: string, sessionToken: string, accountId: string) => {
  if (flattradeWs && flattradeWs.readyState === WebSocket.OPEN) {
    const connectPayload = {
      t: 'c', // connect task
      uid: userId,
      actid: accountId,
      source: 'API',
      susertoken: sessionToken,
    };
    flattradeWs.send(JSON.stringify(connectPayload));
  } else {
    console.warn('WebSocket is not open.');
  }
};

const subscribeOrderUpdate = (userId: string,sessionToken: string, actid: string) => {
  if (flattradeWs && flattradeWs.readyState === WebSocket.OPEN) {
    const connectPayload = {
      t: 'o', // order task  
      userId,    
      actid,      
      susertoken: sessionToken
    };
    flattradeWs.send(JSON.stringify(connectPayload));
  } else {
    console.warn('Order subscribed');
  }
}

// Handle subscription to touchline data
const subscribeTouchline = (scripList: string) => {
  const subscribePayload = {
    t: 't', // touchline subscription
    k: scripList,
  };
  if (flattradeWs && flattradeWs.readyState === WebSocket.OPEN) {
    flattradeWs.send(JSON.stringify(subscribePayload));
  }
};

export {
  connectFlattradeWebSocket,
};