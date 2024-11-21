import axios from "axios";

const API_BASE_URL = 'https://rajaapp.in/api';
const AUTH_ENDPOINT = '/authentications';

export const fetchUserToken = async (authToken: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${AUTH_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data?.data[0];
  } catch (error) {
    console.error('Error fetching request token', error);
    throw error;
  }
};




// import axios from "axios";
// //Use only for testing
// // import { Agent } from 'https';

// const API_BASE_URL = 'https://srv640728.hstgr.cloud/api';
// const AUTH_ENDPOINT = '/authentications';
// // const agent = new Agent({
// //   rejectUnauthorized: false,
// // });
// export const fetchUserToken = async (authToken: string) => {
//   try {
//     let data;
//     const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINT}`, {
//       method: 'GET',
//       // httpsAgent: agent,
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     }).then(res => res.json()).then(data =>  data);
//     return response.data?.data[0];
//   } catch (error) {
//     console.error('Error fetching request token', error);
//     throw error;
//   }
// };
