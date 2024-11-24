import React from 'react';
import { useWebSocketMessages } from './Webhooktypeprocess';

type ActionResponse = {
  type: 'action';
  message: string;
  status: boolean;
};

type VariableResponse = {
  type: 'variable';
  message: string;
  status: boolean;
};

type IndexResponse = {
  type: 'index';
  data: {
    t: string;
    e: string;
    tk: string;
    ts: string;
    pp: string;
    ls: string;
    ti: string;
    lp: string;
    pc: string;
    o: string;
    h: string;
    l: string;
    c: string;
    toi: string;
  };
  status: boolean;
};

type OrderResponse = {
  type: 'order';
  data: {
    index: number;
    orderType: string;
    contractType: string;
    contractToken: string;
    indexLtp: string;
    contractTsym: string;
    lotSize: number;
    price: number;
    contractLp: string;
  };
  message: string;
  status: boolean;
};

type WebhookResponse = ActionResponse | VariableResponse | IndexResponse | OrderResponse;

export const Webhooktyperesponse = (): WebhookResponse[] => {
  const webhookData = useWebSocketMessages();

  // Flatten and process data
  const webhookMessages = webhookData.flat();

  // Log the responses based on type
  webhookMessages.forEach((message: WebhookResponse) => {
    switch (message.type) {
      case 'action':
        console.log('Type: action', message);
        break;
      case 'variable':
        console.log('Type: variable', message);
        break;
      case 'index':
        console.log('Type: index', message);
        break;
      case 'order':
        console.log('Type: order', message);
        break;
      default:
        console.warn('Unknown type:', message);
    }
  });

  return webhookMessages; // Return the processed messages
};

export default Webhooktyperesponse;
