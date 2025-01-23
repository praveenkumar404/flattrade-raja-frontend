import axios from "axios";


export const fetchPosition = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/positions`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching request token', error);
    throw error;
  }
};

export const fetchpostplaceholder = async (obj:any) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders/placeSellOrder`,obj, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching request token', error);
      throw error;
    }
  };


  export const fetchchartapi = async (obj:any) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/variables/getTimePriceData`,obj, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching request token', error);
      throw error;
    }
  };