<template>
  <v-row class="match-height">
    <v-col>
      <v-card>
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          <v-col cols="10" md="10" class="pa-0 ma-0">
            Theo dõi sức khỏe định kì
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
            <suckhoeDetail
              ref="suckhoeDetail"
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
import suckhoeDetail from "./SucKhoeDetail";

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
    suckhoeDetail
  },
  data() {
    return {
      loadingInstance: null,
      colCongViec: [
        // {
        //   label: 'id',
        //   field: 'id',
        //   filterable: true,
        // },
        {
          label: 'Họ tên',
          field: 'ho_ten',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Mã CV', // placeholder for filter input
              filterValue: 'NGUYỄN ĐĂNG KHÔI',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Ngày',
          field: 'ngay_bat_dau',
          filterable: true,
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
            return value != null ? moment(value).format(config.DATE_FM) : null
          },
        },
        {
          label: 'Cân nặng',
          field: 'can_nang',
          filterable: false,
          type: 'number',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Cân nặng', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
            return value != null ? `${value / 1000} kg` : null
          },
          
        },
        {
          label: 'Chiều cao',
          field: 'chieu_cao',
          filterable: false,
          type: 'number',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Chiều cao', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
            return value != null ? `${value / 100} cm` : null
          },
        },
        // {
        //   label: 'Giờ kế tiếp',
        //   field: 'gio_ke_tiep',
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
      await axios
      .get(`${config.API_URL}/selectSucKhoe`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.tblDataCongViec = data;
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
        ngay_thuc_hien:  moment(params.row.ngay_thuc_hien).format(config.DATE_TIME_FM),
        can_nang: params.row.can_nang,
        chieu_cao: params.row.chieu_cao,
      }
//  moment.tz(new Date(), tzString).format("YYYY-MM-DD HH:mm:ss"),
      this.$refs.suckhoeDetail.dialog = true;
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
