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
























// import React, { useState } from "react";

// // WebSocket URL
// const flattradeWsUrl = 'wss://piconnect.flattrade.in/PiConnectWSTp/';
// let flattradeWs: WebSocket | null = null;

// // Connect to WebSocket & subscribe
// const connectFlattradeWebSocket = (
//   userId: any,
//   sessionToken: any,
//   accountId: any,
//   scripList: any
// ): WebSocket | null => {
//   try {
//     // Initialize WebSocket
//     flattradeWs = new WebSocket(flattradeWsUrl);

//     // WebSocket onopen handler
//     flattradeWs.onopen = () => {
//       console.log('Flattrade WebSocket connection established.');
//       sendConnectionRequest(userId, sessionToken, accountId);
//     };

//     // WebSocket onmessage handler
//     flattradeWs.onmessage = (event) => {
//       const messageString = event.data;
//       const message = JSON.parse(messageString);
//       handleIncomingMessage(message, scripList);
//     };

//     // WebSocket onclose handler
//     flattradeWs.onclose = () => {
//       console.log('Flattrade WebSocket connection closed. Attempting reconnect...');
//       setTimeout(() => connectFlattradeWebSocket(userId, sessionToken, accountId, scripList), 5000);
//     };

//     // WebSocket onerror handler
//     flattradeWs.onerror = (error) => {
//       console.error('Flattrade WebSocket error:', error);
//     };

//     return flattradeWs;
//   } catch (error) {
//     console.error('Failed to connect to WebSocket:', error);
//     return null;
//   }
// };

// // Send connection request to the server
// const sendConnectionRequest = (userId: string, sessionToken: string, accountId: string) => {
//   // Ensure the WebSocket connection is open before sending
//   if (flattradeWs && flattradeWs.readyState === WebSocket.OPEN) {
//     const connectPayload = {
//       t: 'c',           // 'c' represents connect task
//       uid: userId,      // User ID
//       actid: accountId, // Account ID
//       source: 'API',    // Source should be 'API' as per login request
//       susertoken: sessionToken, // User Session Token
//     };

//     console.log('Sending connection request:', connectPayload);
//     flattradeWs.send(JSON.stringify(connectPayload));
//   } else {
//     console.warn('WebSocket is not open. Unable to send connection request.');
//   }
// };

// // Handle incoming WebSocket messages
// const handleIncomingMessage = (message: any, scripList: string) => {
//   console.log('Received message:', message);

//   switch (message.t) {
//     case 'ck':
//       if (message.s === 'OK') {
//         console.log('Connection acknowledged for user:', message.uid);
//         subscribeTouchline(scripList);
//       } else {
//         console.error('Connection failed: Invalid user ID or session token.');
//       }
//       break;

//     case 'tk':
//       console.log('Subscription acknowledged:', message);
//       break;

//     case 'tf':
//       console.log('Touchline feed:', message);
//       break;

//     case 'uk':
//       console.log('Unsubscription acknowledged:', message);
//       break;

//     default:
//       console.log('Unknown message type:', message);
//   }
// };

// // Subscribe to touchline data
// const subscribeTouchline = (scripList: string) => {
//   const subscribePayload = {
//     t: 't',        // 't' represents touchline subscription
//     k: scripList,  // Example: 'NSE|NIFTY#NSE|BANKNIFTY'
//   };

//   console.log('Subscribing to touchline data for:', scripList);
//   if (flattradeWs && flattradeWs.readyState === WebSocket.OPEN) {
//     flattradeWs.send(JSON.stringify(subscribePayload));
//   } else {
//     console.warn('WebSocket is not open. Unable to send subscription request.');
//   }
// };

// export {
//   connectFlattradeWebSocket,
// };
















// import React,{ useState } from "react";

// const flattradeWsUrl = 'wss://piconnect.flattrade.in/PiConnectWSTp/';
// let flattradeWs:any;

// // Connect to WebSocket & subscribe
// const connectFlattradeWebSocket:any = (userId:any, sessionToken:any, accountId:any, scripList:any) => {
  

//   flattradeWs = new WebSocket(flattradeWsUrl);

//   flattradeWs.onopen = () => {
//     console.log('Flattrade WebSocket connection established.');
//     sendConnectionRequest(userId, sessionToken, accountId);
//   };

//   flattradeWs.onmessage = (event:any) => {
//     const messageString = event.data;
//     const message = JSON.parse(messageString);
//     handleIncomingMessage(message, scripList);
//     // handleIncomingMessage(message, scripList, setMarketData);
//   };

//   flattradeWs.onclose = () => {
//     console.log('Flattrade WebSocket connection closed. Attempting reconnect...');
//     setTimeout(() => connectFlattradeWebSocket(userId, sessionToken, accountId, scripList), 5000);
//   };

//   flattradeWs.onerror = (error:any) => {
//     console.error('Flattrade WebSocket error:', error);
//   };



  
// const sendConnectionRequest = (userId:any, sessionToken:any, accountId:any) => {
//   // Ensure the WebSocket connection is open before sending
//   if (flattradeWs.readyState === WebSocket.OPEN) {
//     const connectPayload = {
//       t: 'c',           // 'c' represents connect task
//       uid: userId,      // User ID
//       actid: accountId, // Account ID
//       source: 'API',    // Source should be 'API' as per login request
//       susertoken: sessionToken, // User Session Token
//     };

//     console.log('Sending connection request:', connectPayload);
//     flattradeWs.send(JSON.stringify(connectPayload));
//   } else {
//     console.warn('WebSocket is not open. Unable to send connection request.');
//   }
// };

// const handleIncomingMessage = (message:any, scripList:any) => {
//   console.log('Received message:', message);

//   switch (message.t) {
//     case 'ck':
//       if (message.s === 'OK') {
//         console.log('Connection acknowledged for user:', message.uid);
//         subscribeTouchline(scripList);
//       } else {
//         console.error('Connection failed: Invalid user ID or session token.');       
//       }
//       break;

//     case 'tk':
//       console.log('Subscription acknowledged:', message);
//       break;

//     case 'tf':
//       console.log('Touchline feed:', message);  
//       break;

//     case 'uk':
//       console.log('Unsubscription acknowledged:', message);
//       break;

//     default:
//       console.log('Unknown message type:', message);
//   }
// };

// const subscribeTouchline = (scripList:any) => {
//   const subscribePayload = {
//     t: 't',        // 't' represents touchline subscription
//     k: scripList,  // Example: 'NSE|NIFTY#NSE|BANKNIFTY'
//   };

//   console.log('Subscribing to touchline data for:', scripList);
//   flattradeWs.send(JSON.stringify(subscribePayload));
// };

// };


// export {
//   connectFlattradeWebSocket,
// };









// const flattradeWsUrl = 'wss://piconnect.flattrade.in/PiConnectWSTp/';
// let flattradeWs;

// // Connect to WebSocket & subscribe
// const connectFlattradeWebSocket = (userId, sessionToken, accountId, scripList) => {
//   flattradeWs = new WebSocket(flattradeWsUrl);

//   flattradeWs.onopen = () => {
//     console.log('Flattrade WebSocket connection established.');
//     sendConnectionRequest(userId, sessionToken, accountId);
//   };

//   flattradeWs.onmessage = (event) => {
//     const messageString = event.data;
//     const message = JSON.parse(messageString);
//     handleIncomingMessage(message, scripList);
//   };

//   flattradeWs.onclose = () => {
//     console.log('Flattrade WebSocket connection closed. Attempting reconnect...');
//     setTimeout(() => connectFlattradeWebSocket(userId, sessionToken, accountId, scripList), 5000);
//   };

//   flattradeWs.onerror = (error) => {
//     console.error('Flattrade WebSocket error:', error);
//   };
// };

// const sendConnectionRequest = (userId, sessionToken, accountId) => {
//   const connectPayload = {
//     t: 'c',           // 'c' represents connect task
//     uid: userId,      // User ID
//     actid: accountId, // Account ID
//     source: 'API',    // Source should be 'API' as per login request
//     susertoken: sessionToken, // User Session Token
//   };

//   console.log('Sending connection request:', connectPayload);
//   flattradeWs.send(JSON.stringify(connectPayload));
// };

// const handleIncomingMessage = (message, scripList) => {
//   console.log('Received message:', message);

//   switch (message.t) {
//     case 'ck':
//       if (message.s === 'OK') {
//         console.log('Connection acknowledged for user:', message.uid);
//         subscribeTouchline(scripList);
//       } else {
//         console.error('Connection failed: Invalid user ID or session token.');       
//       }
//       break;

//     case 'tk':
//       console.log('Subscription acknowledged:', message);      
//       break;

//     case 'tf':
//       console.log('Touchline feed:', message);      
//       break;

//     case 'uk':
//       console.log('Unsubscription acknowledged:', message);
//       break;

//     default:
//       console.log('Unknown message type:', message);
//   }
// };

// const subscribeTouchline = (scripList) => {
//   const subscribePayload = {
//     t: 't',        // 't' represents touchline subscription
//     k: scripList,  // Example: 'NSE|NIFTY#NSE|BANKNIFTY'
//   };

//   console.log('Subscribing to touchline data for:', scripList);
//   flattradeWs.send(JSON.stringify(subscribePayload));
// };

// export {
//   connectFlattradeWebSocket,
// };













// const WebSocket = require('ws');

// const flattradeWsUrl = 'wss://piconnect.flattrade.in/PiConnectWSTp/';
// let flattradeWs;


// //Connect to Websocket & subscribe
// const connectFlattradeWebSocket = (userId, sessionToken, accountId, scripList) => {
  
//     flattradeWs = new WebSocket(flattradeWsUrl);
//     flattradeWs.on('open', () => {
//       console.log('Flattrade WebSocket connection established.');
//       sendConnectionRequest(userId, sessionToken, accountId);


//     flattradeWs.on('message', (data) => {
//       const messageString = Buffer.isBuffer(data) ? data.toString() : data;
//       // @ts-ignore
//       const message = JSON.parse(messageString);
//       handleIncomingMessage(message, scripList);
//     });

//     flattradeWs.on('close', () => {
//       console.log('Flattrade WebSocket connection closed. Attempting reconnect...');
//       setTimeout(() => connectFlattradeWebSocket(userId, sessionToken, accountId,scripList), 5000);
//     });

//     flattradeWs.on('error', (error) => {
//       console.error('Flattrade WebSocket error:', error);      
//     });
//   });
// };

// const sendConnectionRequest = (userId, sessionToken, accountId) => {
//   const connectPayload = {
//     t: 'c',           // 'c' represents connect task
//     uid: userId,      // User ID
//     actid: accountId, // Account ID
//     source: 'API',    // Source should be 'API' as per login request
//     susertoken: sessionToken, // User Session Token
//   };

//   console.log('Sending connection request:', connectPayload);
//   flattradeWs.send(JSON.stringify(connectPayload));
// };

// const handleIncomingMessage = (message, scripList) => {
//   console.log('Received message:', message);

//   switch (message.t) {
//     case 'ck':
//       if (message.s == 'OK') {
//         console.log('Connection acknowledged for user:', message.uid);
//         subscribeTouchline(scripList);
//       } else {
//         console.error('Connection failed: Invalid user ID or session token.');       
//       }
//       break;

//     case 'tk':
//       console.log('Subscription acknowledged:', message);      
//       break;

//     case 'tf':
//       console.log('Touchline feed:', message);      
//       break;

//     case 'uk':
//       console.log('Unsubscription acknowledged:', message);
//       break;

//     default:
//       console.log('Unknown message type:', message);
//   }
// };

// const subscribeTouchline = (scripList) => {
//   const subscribePayload = {
//     t: 't',        // 't' represents touchline subscription
//     k: scripList,  // Example: 'NSE|NIFTY#NSE|BANKNIFTY'
//   };

//   console.log('Subscribing to touchline data for:', scripList);
//   flattradeWs.send(JSON.stringify(subscribePayload));
// };



// module.exports = {
//   connectFlattradeWebSocket,
// };
