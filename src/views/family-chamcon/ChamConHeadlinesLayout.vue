<template>
  <v-row class="match-height">
    <v-col>
      <v-card>
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          <v-col cols="10" md="10" class="pa-0 ma-0">
            Danh sách công việc [Layout]
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
              :group-options="{
                enabled: true,
                headerPosition: 'top',
                collapsable: false
              }"
              :fixed-header="true"
              @on-row-dblclick="onRowDoubleClick"
              max-height="700px"
              
            >
              <template slot="table-header-row" slot-scope="props">
                <div v-if="props.column.field == 'ten_cong_viec'">
                  <v-btn text color="primary" class="text-bold" @click="openDetail(props.formattedRow['ngay_group'])">
                  Ngày {{props.formattedRow['ngay_group']}}
                  </v-btn>
                </div>
                <!-- <div v-else>
                  {{ props.formattedRow }}
                </div> -->
              </template>
            </vue-good-table>
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
import chamConDetail from "./ChamConDetail";

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
          label: 'Ngày',
          field: 'ngay_group',
          filterable: true,
          type: 'date',
          formatFn: function (value) {
            return value != null ? moment(value).format(config.DATE_FM) : null
          },
          hidden: true,
        },
        {
          label: 'Công việc',
          field: 'ten_cong_viec',
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
          label: 'Ngủ',
          field: 'working_time',
          type: 'number',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Tổng', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (val) {
            return `${Math.floor(val / 60) } giờ ${(Math.floor(val / 60)) % 24} phút`
          },
        },
        {
          label: 'Bú',
          field: 'the_tich_sua',
          type: 'number',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Tổng', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
            return `${value} ml`
          },
        },
        {
          label: 'Số cữ',
          field: 'count_ma_cv',
          type: 'number',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Tổng', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        // {
        //   label: 'Ngày thực hiện',
        //   field: 'ngay_thuc_hien',
        //   filterable: false,
        //   type: 'date',
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Ngày', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        //   formatFn: function (value) {
        //       return value != null ? moment(value).format(config.DATE_TIME_FM) : null
        //   },
        // },
        // {
        //   label: 'Giờ bắt đầu',
        //   field: 'gio_bat_dau',
        //   filterable: false,
        //   type: 'date',
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Ngày', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        //   formatFn: function (value) {
        //       return value != null ? moment(value).format(config.DATE_TIME_FM) : null
        //   },
         
        // },
        // {
        //   label: 'Thể tích sữa',
        //   field: 'the_tich_sua',
        //   filterable: false,
        //   type: 'number',
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Thể tích sữa', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        //   formatFn: function (value) {
        //       const val = (value / 1).toFixed(0).replace(',', '.');
        //       return val;
        //   },
        // },
        // {
        //   label: 'Thông tin thêm',
        //   field: 'thong_tin_them',
        //   filterable: false,
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Thông tin', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        // },
        // {
        //   label: 'Trạng thái',
        //   field: 'status',
        //   filterable: false,
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Trạng thái', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        // },
        // {
        //   label: 'Tổng thời gian',
        //   field: 'working_time',
        //   type: 'number',
        //   filterable: true,
        //   formatFn: this.formatPrice,
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Số Tiền', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        // },
        // {
        //   label: 'Ghi chú',
        //   field: 'ghi_chu',
        //   filterable: false,
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Ghi chú', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        // },
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
    async loadData(){
      let self = this;
      let param = {
        ma_cv: ['WC'],

      }
      await axios
      .post(`${config.API_URL}/selectChamConGroup`, param)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        console.log('selectChamConGroup-data', data);
        const unique = [...new Set(data.map(item => item.ngay_group))]; // [ 'A', 'B']
        console.log('selectChamConGroup-unique', unique);
        if(undefined != unique){
          for(let i = 0; i < unique.length; i ++){
            let arr = data.filter(function(item){
              if(item.ngay_group == unique[i]) return true;
            });
            self.tblDataCongViec.push({
              // mode: "span",
              ngay_group:  moment(unique[i]).format(config.DATE_FM),
              total: 0,
              children: arr, 
            });
          }
        }
        self.close();
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
        ngay_thuc_hien:  moment(params.row.ngay_thuc_hien).format(config.DATE_TIME_FULL_FM),
        gio_bat_dau:  moment(params.row.gio_bat_dau).format(config.DATE_TIME_FULL_FM),
        gio_ke_tiep:  moment(params.row.gio_ke_tiep).format(config.DATE_TIME_FULL_FM),
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
    },
    openDetail(ngay){
      console.log('ngày', ngay);
    }
    
  },
};
</script>
<style lang="scss">
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

  .vgt-row-header > span {
    color: #606266 !important;
  }
</style>
