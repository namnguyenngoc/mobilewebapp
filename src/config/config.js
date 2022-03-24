/* eslint-disable no-unused-vars */

const API_URL = 'http://ec2-3-85-219-4.compute-1.amazonaws.com'; //  platform server

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
    DATE_TIME_FULL_FM: 'YYYY-MM-DD HH:mm:ss.SSS',
    DATE_FM: 'YYYY-MM-DD',
    CLV_PIM_ACCOUNT: {
      COUNT_CONTRACT: 3,
      SML_TEAM: ['163189', 'nam.nguyenngoc', '213960', '213979', '203728', '213898'],
      MEM_LIST: [
        {
            id: 'nam.nguyenngoc',
            email: 'nam.nguyenngoc@cyberlogitec.com',
            isBackup: 'N',
        },
        // {
        //     id: '203737',
        //     email: 'dung.cao@cyberlogitec.com',
        // },
        {
            id: '203728',
            email: 'khanh.vn@cyberlogitec.com',
            isBackup: 'N',
        },
        {
            id: '213960',
            email: 'trang.ng@cyberlogitec.com',
            isBackup: 'N',
        },
        {
          id: '213979',
          email: 'thanh.nc@cyberlogitec.com',
          isBackup: 'Y',
        },
        {
          id: 'TruongDo',
          email: 'edidev@cyberlogitec.comm',
          isBackup: 'N',
        },
        {
          id: '193521',
          email: 'duan.la@cyberlogitec.com',
          isBackup: 'N',
        },
        {
          id: '213898',
          email: 'hieu.lnt@cyberlogitec.com',
          isBackup: 'N',
        },
      ]
    },
    WORKING: {
      holidays:[
        { holidayDate: "2021-09-02", description: "Quoc Khanh" },
        { holidayDate: "2021-09-03", description: "Quoc Khanh" },
        { holidayDate: "2022-01-03", description: "Tet Duong Lich" },
      ],
      blueprintConfig: {
        pointaHour: 25,
        pointaDay: 200
      },
    }
}


export default config
