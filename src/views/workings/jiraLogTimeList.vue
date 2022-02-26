<template>
  <v-row class="match-height">
    <v-col>
      <v-card>
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          <v-col cols="10" md="10" class="pa-0 ma-0">
            jiraLogTimeList.vue
          </v-col>
          <v-col cols="2" md="2" class="pa-0 ma-0 text-right">
            <v-btn
              color="info"
              icon
              @click="loadData()"
            >
              <v-icon>
                  {{ icons.mdiReload }}
                </v-icon>
            </v-btn>
          </v-col>
        </v-card-title>
        
        <v-card-text class="mt-0 mb-0 pt-1 pb-1 ma-0 pa-0">
          <!-- Row 1 -->
          <v-col cols="12" md="12" class="ma-0 pa-0" >
            <vue-good-table
              title="Công việc chăm con"
              styleClass="vgt-table bordered"
              :columns="colCongViec"
              :rows="tblDataCongViec"
              :paginate="true"
              :lineNumbers="true"
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              @on-row-dblclick="onRowDoubleClick"
              max-height="700px"
              />
          </v-col>
           <v-col cols="12">
            <chamConDetail
              ref="chamConDetail"
              :title="chamConTitle"
              :item="chamConItem"
              :v-model="chamConDetaillDialog"
              @refeshList="loadData()"
            />
                </v-col>
          <!-- Row 3 -->
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
       
      </v-card>
    </v-col>
  </v-row>

</template>
<script>
import axios from 'axios';
import config from '../../config/config';
import moment from "moment";
import "vue-easytable/libs/theme-dark/index.css";
import { VueGoodTable } from 'vue-good-table';
import chamConDetail from "../family-chamcon/ChamConDetail";

import {
  mdiMinus,
  mdiOneUp,
  mdiPlus,
  mdiDeleteOutline,
  mdiCircleEditOutline,
  mdiSleep,
  mdiReload
} from '@mdi/js';
import { reactive } from '@vue/composition-api';

export default {
  name: 'SucKhoe',
  components: {
    VueGoodTable,
    chamConDetail
  },
  data() {
    return {
      loadingInstance: null,
      colCongViec: [
        {
          label: 'id',
          field: 'id',
          filterable: true,
        },
        {
          label: 'Mã CV',
          field: 'ma_cv',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Mã CV', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Nội dung',
          field: 'ten_cong_viec',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Nội dung', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Ngày thực hiện',
          field: 'ngay_thuc_hien',
          filterable: false,
          type: 'date',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Ngày', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
              return value != null ? moment(value).format(config.DATE_TIME_FM) : null
          },
        },
        {
          label: 'Giờ bắt đầu',
          field: 'gio_bat_dau',
          filterable: false,
          type: 'date',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Ngày', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
              return value != null ? moment(value).format(config.DATE_TIME_FM) : null
          },
         
        },
        {
          label: 'Giờ kế tiếp',
          field: 'gio_ke_tiep',
          filterable: false,
          type: 'date',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Ngày', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
              return value != null ? moment(value).format(config.DATE_TIME_FM) : null
          },
        },
        {
          label: 'Thông tin thêm',
          field: 'thong_tin_them',
          filterable: false,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Thông tin', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Trạng thái',
          field: 'status',
          filterable: false,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Trạng thái', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Tổng thời gian',
          field: 'working_time',
          type: 'number',
          filterable: true,
          formatFn: this.formatPrice,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Số Tiền', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Ghi chú',
          field: 'ghi_chu',
          filterable: false,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Ghi chú', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
      ],
      tblDataCongViec: [
      ],
      chamConTitle: '',
      chamConItem: {},
      chamConDetaillDialog: false,
      icons: {
        mdiMinus,
        mdiOneUp,
        mdiPlus,
        mdiDeleteOutline,
        mdiCircleEditOutline,
        mdiSleep,
        mdiReload
      },
    }
  },
  created() {
   this.loadData();
  },
  computed: {
     
  }, // end method
  mounted() {
    this.loadingInstance = this.$veLoading({
        target: document.querySelector("#loading-container"),
        // 等同于
        // target:"#loading-container"
        name: "wave",
    });
    this.show();
  }, // end method
  destroyed() {
    this.loadingInstance.destroy();

  }, // end method

  methods: {
    formatPrice(value, tofix) {
      if (!value) {
        return ''
      }
      const val = (value / 1).toFixed(tofix).replace(',', '.')
      if (!val) {
        return ''
      }

      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    async loadData(ticketList) {
      if (!this.$refs.jrTicketLogTime.validate()) {
        return;
      }
      const seft = this; //Current

      seft.workCount = 0;
      seft.strMemberTotalCLV= 0;
      seft.strMemberTotal = 1;
      seft.strMemberTotalCLV = 0,
      seft.sKPICLV = 0.0,
      seft.sWloadPercent = 0,
      seft.strMemberEffort = "";

      seft.isBtnDisable = true;
      seft.overlay = true;
      // seft.$refs.hotTableComponent.hotInstance.loadData([]);
      this.efforJsonList.from =  this.date;
      this.efforJsonList.to = this.date2;
      // this.efforJsonList.itemsProject = this.itemsProject;
      this.efforJsonList.team = this.team;
      // this.projectsName = 'SmartLink [Internal]'
      this.efforJsonList.itemsMember = this.member;

      //Count working day
      let countWD = this.workday_count(moment(this.date), moment(this.date2));
      this.workCount = countWD;
      console.log("countWD",countWD);

      if(seft.valueProject.key != undefined && seft.valueProject.key.length > 0){
        this.efforJsonList.itemsProject = seft.valueProject.key;

      } else {
        this.efforJsonList.itemsProject = this.itemsProject;
      }

      let url = `${config.JR_API_JIRA}/api/jiraWorklogs`;
      let parameter = this.efforJsonList;

      if(ticketList != undefined){
        this.efforJsonList.tickets = ticketList;
      }

      await axios
        .post(url, parameter)
        .then(async function (response) {
          // seft.hotSettings.data = response.data.data;
          // console.log('pimDATA', seft.pimDATA);
          // seft.pimDATA = response.data.data;
          //lstMember
          let data = response.data.data;
          let lsMemberNames = [
              {
                  id: 'nam.nguyenngoc',
                  name: 'Nam Nguyen Ngoc',
                  total: 0
              },
              {
                  id: 'doudevnn',
                  name: 'Nam Nguyen Ngoc OLD',
                  total: 0
              },
              // {
              //     id: '203737',
              //     name: 'Dung Cao',
              //     total: 0
              // },
              {
                  id: '203728',
                  name: 'Khanh Nguyen',
                  total: 0
              },
              {
                  id: '213960',
                  name: 'Trang Nguyen',
                  total: 0
              },
              {
                id: '213979',
                email: 'thanh.nc@cyberlogitec.com',
                name: 'Nguyen Chau Thanh',
                total: 0
              },
              
            ];
          let lsCLV = config.CLV_PIM_ACCOUNT.MEM_LIST;

          if(data != undefined && data.length > 0){
            //Total
            let flagMember = "";
            let total;
            seft.strMemberTotalCLV = 0;
            seft.strMemberTotal = 0;
            self.sKPICLV = 0;
            let emailSeen = new Set();

            //Get email
            for(var i = 0; i < data.length; i++){
              // data[i].assignee;
              emailSeen.add(data[i].emailAddress);
            }
            let userTotal = [];
            for(var i = 0; i < data.length; i++){
              // data[i].assignee;
              // emailSeen.add(data[i].emailAddress);
              for(let email of emailSeen){
                
                if(data[i].emailAddress == email){
                  
                  let user = userTotal.find( ({ email }) => email  === data[i].emailAddress);
                  if(user != undefined && user != null){
                    let memberContract = lsCLV.find( ({ email }) => email  === data[i].emailAddress);
                    console.log('memberContract',memberContract);
                    if(memberContract != undefined && memberContract != null && memberContract.isBackup == 'N'){
                      user.total += data[i].actualEffort;
                    }
                      // user.total += data[i].actualEffort;
                  }else{
                    userTotal.push({
                      email: data[i].emailAddress,
                      name: data[i].displayName,
                      total: data[i].actualEffort,
                    })
                  }
                }
              }
              // if(data[i].emailAddress == "nam.nguyenngoc@cyberlogitec.com"){
              //   lsMemberNames[0].total += data[i].actualEffort;
              // }
              // else if(data[i].assignee == "Dung Cao"){
              //   lsMemberNames[1].total += data[i].actualEffort;
              // }else if(data[i].assignee == "Khanh Nguyen"){
              //   lsMemberNames[2].total += data[i].actualEffort;
              // }
              
              // if(lsMemberNames.find( ({ name }) => name === data[i].assignee)){
              //   seft.strMemberTotalCLV += data[i].actualEffort;

              // }
              if(lsCLV.find( ({ email }) => email  === data[i].emailAddress)){
                let memberContract = lsCLV.find( ({ email }) => email  === data[i].emailAddress);
                console.log('memberContract',memberContract);
                if(memberContract != undefined && memberContract != null && memberContract.isBackup == 'N'){
                  seft.strMemberTotalCLV += data[i].actualEffort; //Need to check
                }

              }
              seft.strMemberTotal += data[i].actualEffort;
              

            }
            console.log("userTotal", userTotal);
            seft.sKPICLV = seft.strMemberTotalCLV/(countWD*8);
            seft.sWloadPercent = (seft.strMemberTotalCLV / (countWD * config.CLV_PIM_ACCOUNT.COUNT_CONTRACT * 8))*100;
            // console.log('KPICLV', self.sKPICLV.toFixed(1));
            let hWeek = countWD*8;
            if(seft.isChangeHour == true){
              hWeek = seft.totalHourWeek;
            }
            seft.strMemberEffort = userTotal.map(mem => `${mem.name}:${mem.total}h - ${mem.total * config.blueprintConfig.pointaHour}p (${Math.round(((mem.total/parseInt(hWeek))*100))}%)`).join(', ');
            // console.log("lsMemberNames", lsMemberNames.map(mem => `${mem.name}:${mem.total}`).join(', '));
            console.log("hWeek", hWeek);
            console.log("self.isChangeHour", self.isChangeHour);
            self.wordloadData = data;
            console.log("wordloadData", self.wordloadData);
            
            // await seft.$refs.hotTableComponent.hotInstance.loadData(
            //   data
            // );

            seft.tblDataWorklog = data;

            // //set data to dialog
            // // seft.sogDataItem = data;
            //  seft.sogDataItem  = [];
            // for(let i = 0; i < data.length; i ++){
            //   let item = data[i];
            //   let ob = {
            //     title : item.ticketSubject,
            //     month : item.effortDate,
            //     issue :item.key,
            //     projectName: 'SMARTLINK [Internal]',
            //     worklog : item.actualEffort,
            //     taskType : item.taskType,
            //     new : 'N',
            //     team : 'SML PF',
            //     name : item.displayName,
            //     employeeNumber : item.name,
            //   }
            //     // seft.sogDataItem.title = item.ticketSubject;
            //     // seft.sogDataItem.month = item.effortDate;
            //     // seft.sogDataItem.issue = item.ticketSubject;
            //     // seft.sogDataItem.projectName = item.project;
            //     // seft.sogDataItem.worklog = item.actualEffort;
            //     // seft.sogDataItem.taskType = item.taskType;
            //     // seft.sogDataItem.new = item.ticketSubject;
            //     // seft.sogDataItem.team = item.ticketSubject;
            //     // seft.sogDataItem.name = item.displayName;
            //     // seft.sogDataItem.employeeNumber = item.name;
            //     seft.sogDataItem.push(ob);
            // };
            // for(let i = 0; i < data.length; i++)
            console.log("seft.sogDataItem ", seft.sogDataItem);

                      
          }else{
            
          }
          seft.isBtnDisable = false;
          seft.overlay = false;

          
          // seft.$refs.hotTableComponent.hotInstance.loadData(seft.pimDATA);
        }).catch((error) => {
            if( error.response ){
                console.log(error.response.data); // => the response payload 
                seft.isBtnDisable = false;
                seft.overlay = false;
            }
        });
    },
    show() {
        this.loadingInstance.show();
    },
    close() {
        this.loadingInstance.close();
    },
    onRowDoubleClick(params) {
    // params.row - row object 
    // params.pageIndex - index of this row on the current page.
    // params.selected - if selection is enabled this argument 
    // indicates selected or not
    // params.event - click event

      console.log('row', params.row);
      this.chamConTitle = `${params.row.ten_cong_viec} ngày ${moment(params.row.ngay_thuc_hien).format(config.DATE_TIME_FM)}`;
      this.chamConItem = {
       	id: params.row.id,
        ho_ten: params.row.ho_ten,
        nam_sinh: params.row.nam_sinh,
        ma_cv: params.row.ma_cv,
        ghi_chu: params.row.ghi_chu,
        ngay_thuc_hien:  moment(params.row.ngay_thuc_hien).format(config.DATE_TIME_FM),
        gio_bat_dau:  moment(params.row.gio_bat_dau).format(config.DATE_TIME_FM),
        gio_ke_tiep:  moment(params.row.gio_ke_tiep).format(config.DATE_TIME_FM),
        thong_tin_them: params.row.thong_tin_them,
        status: params.row.status,
        working_time: params.row.working_time,
        can_nang: params.row.can_nang,
        chieu_cao: params.row.chieu_cao,
        tinh_trang_suc_khoe: params.row.tinh_trang_suc_khoe,
        updated_date: params.row.updated_date,
        create_date: params.row.create_date,
        the_tich_sua: params.row.the_tich_sua,
        ten_cong_viec: params.row.ten_cong_viec,
        vgt_id: params.row.vgt_id,
        originalIndex:params.row.originalIndex 
      }
//  moment.tz(new Date(), tzString).format("YYYY-MM-DD HH:mm:ss"),
      this.$refs.chamConDetail.dialog = true;
    }
  },
};
</script>
<style lang="scss" scoped>
  .custom-row{
    height: 35px !important;
    button{
      height: 30px !important;
    }
  }
  .list-table {
    td {
      height: 35px !important;
    }
  }
  .text-right.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot{
  // .text-right > .v-text-field__slot > input{
    text-align: right !important;
  }
  // @import './Bebidas.scss';
  .countdown {
    float: right;
  }
</style>
