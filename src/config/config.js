/* eslint-disable no-unused-vars */

 const API_URL = 'http://anvatchibeo.ddns.net'; //  platform server

// Only developing application connect to local ip ,another applications connect to developement server ip.
const config = {
  API_URL: `${API_URL}:81/api/appsuckhoe`,
  API_FAMILY: `${API_URL}:81/api`,
  wcCountDay:0,
  NAM_THONG_KE: [
    // '2020',
    '2021',
    '2022',
  ],
}


export default config
