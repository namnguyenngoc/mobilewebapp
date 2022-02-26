/* eslint-disable no-unused-vars */

 const API_URL = 'http://anvatchibeo.ddns.net'; //  platform server

// Only developing application connect to local ip ,another applications connect to developement server ip.
const config = {
  API_URL: `${API_URL}:81/api/appsuckhoe`,
  API_FAMILY: `${API_URL}:81/api`,
  API_WORKING: {
    JR_API_JIRA: `${API_URL}:81/workingapi`,

  },
  wcCountDay:0,
  NAM_THONG_KE: [
    // '2020',
    '2021',
    '2022',
  ],
  CHITIEU_ITEMS_STATUS: [
    //  {
    //     id: "DCHI",
    //     name: "Dự Chi",
    //   },
    //   {
    //     id: "CHM",
    //     name: "Cho Mượn",
    //   },
    //   {
    //     id: "DTT",
    //     name: "Đã Tất Toán",
    //   },
      {
        id: "DN",
        name: "Dư Nợ",
      },
      {
        id: "CSK",
        name: "Chốt sao kê",
      },
      {
        id: "DTCSK",
        name: "Gạch nợ",
      },
      // {
      //   id: "DTN",
      //   name: "Đã trả nợ",
      // },
      // {
      //   id: "NHT",
      //   name: "Nhận tiền",
      // },
      {
        id: "HTN",
        name: "Hoàn Tiền",
      },
      // {
      //   id: "MNT",
      //   name: "Mượn Tiền",
      // },
      {
        id: "FAIL",
        name: "Giao dịch lỗi",
      },
      { id: "TG", name: "Trả Góp" },
    ],
    // status: 'DN',
    // itemData: null,
    // statusMoi: null,
    // title: '',
    // item: Object,
    DATE_TIME_FM: 'YYYY-MM-DD HH:mm:ss',
    DATE_FM: 'YYYY-MM-DD'
    
}


export default config
