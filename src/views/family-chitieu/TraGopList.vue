<template>
  <v-row class="match-height">
    <v-col>
      <!-- Theo doi suc khoe -->
      <v-card>
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          Trả góp List
        </v-card-title>
        <v-card-text class="ma-0 pa-0">
          <v-row class="ma-0 pa-0">
            <v-col cols="12" md="12" class="pa-0 ma-0 text-right">
              <vue-good-table
              title="Danh sách chi tiêu"
              :columns="colTraGop"
              :rows="tblTraGop"
              :paginate="true"
              :lineNumbers="true"
              max-height="700px"
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :group-options="{
                enabled: true,
                headerPosition: 'top',
              }"
              styleClass="vgt-table bordered"
              @on-row-dblclick="onRowDoubleClick"
              @on-column-filter="onColumnFilter"
              @on-cell-click="onCellClick"
              >
              <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field == 'status' && props.formattedRow[props.column.field] == 'TG'">
                  <v-btn
                    color="primary"
                    text
                    @click="save()"
                  >
                    {{props.formattedRow[props.column.field]}}
                  </v-btn>
                </span>
                <span v-else>
                  {{props.formattedRow[props.column.field]}}
                </span>
              </template>
              <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field == 'chitieulist'">
                  <v-btn
                    v-if="(props.formattedRow[props.column.field] == undefined || props.formattedRow[props.column.field] == null) && props.formattedRow['trang_thai'] != 'KT' "
                    color="success light-1"
                    @click="save()"
                  >
                   Process
                  </v-btn>
                </span>
                <span v-else>
                  {{props.formattedRow[props.column.field]}}
                </span>
              </template>
              </vue-good-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- CHART-->
    <v-col cols="12">
      <TraGopDetail
        ref="traGopDetail"
        :title="chitieuTitle"
        :item="chitieuItem"
        :v-model="chiTieuDetailDialog"
        @refeshList="loadData()"
      />

      <ChiTieuChangeKyChi
        ref="ChiTieuChangeKyChi"
        :title="chitieuTitle"
        :item="chitieuItem"
        :itemData="itemData"
        :kyChiMoi="kyChiMoi"
        :v-model="chiTieuChangeKyChiDialog"
        @refeshList="loadData()"
      />

      <ChiTieuChangeStatus
        ref="ChiTieuChangeStatus"
        :title="chitieuTitle"
        :item="chitieuItem"
        :itemData="itemDataStatus"
        :kyChiMoi="itemStatusMoi"
        :v-model="chiTieuChangeStatusDialog"
        @refeshList="loadData()"
      />
      
    </v-col>
  </v-row>
  
</template>
<script>
import axios from 'axios';
import config from '../../config/config';
import moment from 'moment';
import { VueGoodTable } from 'vue-good-table';


import { mdiMinus, mdiOneUp, mdiPlus, mdiDeleteOutline, mdiCircleEditOutline, mdiSleep, mdiConsoleNetworkOutline } from '@mdi/js'
import { reactive } from '@vue/composition-api'
import TraGopDetail from "./TraGopDetail";
import ChiTieuChangeKyChi from "./ChiTieuChangeKyChi";
import ChiTieuChangeStatus from "./ChiTieuChangeStatus";

export default {
  name: 'ChiTieuGiaDinh',
  components: {
    VueGoodTable,
    TraGopDetail,
    ChiTieuChangeKyChi,
    ChiTieuChangeStatus
  },
  data() {
    let self = this;
    return {
      sliderSK: 12,
      colTraGop: [
        {
          label: 'Bank',
          field: 'bank',
          filterable: true,
          filterOptions: {
            styleClass: 'class1', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Bank', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: ['HSBC', 'VIB', 'SC BANK'], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Số kỳ góp',
          field: 'tong_so_ky',
          filterable: true,
          type: 'number',
          filterOptions: {
            styleClass: 'class1', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Kỳ Chi', // placeholder for filter input
              // filterValue: ((new Date()).getMonth() + ((new Date()).getDate() > 27 ? 2 : 1)).toString().concat((new Date()).getFullYear()), // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Mỗi kỳ',
          field: 'moi_ky',
          type: 'number',
          filterable: true,
          formatFn: this.formatPrice,
          filterOptions: {
            styleClass: 'class1', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Số Tiền', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          headerField: this.sumCount,
        },
        {
          label: 'Sản phẩm',
          field: 'san_pham',
          filterable: true,
          filterOptions: {
            styleClass: 'class1', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Nội dung', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Ngày mua',
          field: 'ngay_mua',
          type: 'date',
          dateInputFormat: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
          dateOutputFormat: 'dd-MM-yyyy',
          filterable: true,
          filterOptions: {
            styleClass: 'class1', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Ngày chi', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Kỳ đầu',
          field: 'ky_dau',
          type: 'date',
          dateInputFormat: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
          dateOutputFormat: 'dd-MM-yyyy',
          filterable: true,
          filterOptions: {
            styleClass: 'class1', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Ngày mua', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
         {
          label: 'Kỳ cuối',
          field: 'ky_cuoi',
          type: 'date',
          dateInputFormat: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
          dateOutputFormat: 'dd-MM-yyyy',
          filterable: true,
          filterOptions: {
            styleClass: 'class1', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Ngày mua', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Status',
          field: 'trang_thai',
          filterable: true,
          filterOptions: {
            styleClass: 'class1', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'tatus', // placeholder for filter input
              filterValue: 'IN', // initial populated value for this filter
              filterDropdownItems: ['IN', 'KT'], // dropdown (with selected values) instead of text input
              // // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Action',
          field: 'chitieulist',
          filterable: false,
          // filterOptions: {
          //   styleClass: 'class1', // class to be added to the parent th element
          //     enabled: true, // enable filter for this column
          //     placeholder: 'tatus', // placeholder for filter input
          //     filterValue: 'IN', // initial populated value for this filter
          //     filterDropdownItems: ['IN', 'KT'], // dropdown (with selected values) instead of text input
          //     // // filterFn: this.columnFilterFn, //custom filter function that
          //     trigger: 'enter', //only trigger on enter not on keyup 
          // },
        },
      ],
      tblTraGop:[ 
        {
          // name: 'Animals Total',
          bank_code: '',
          ky_chi: '',
          so_tien: '',
          noi_dung: '',
          ngay_chi: '',
          status: '',
          children: [],
        }
      ],
      allStatusChecked: false,
      includeGop: "WO_GOP",
      chitieuTitle: "",
      chitieuItem: null,
      chiTieuDetailDialog: false,
      chiTieuChangeKyChiDialog: false,
      itemData: {},
      kyChiMoi: {},
      chiTieuChangeStatusDialog: false,
      itemDataStatus: {},
      itemStatusMoi: {},

    }
  },
  async created() {
    await this.loadData();
     
  },
  mounted() {
    // this.loadingChart();
  },
  computed: {
  //  formatPrice(){
  //   const formattedVariations = this.formatVariations(this.variationOrders)
  //   return this.columns.map(c => {
  //     if (c.label === "Variations")
  //       return {label: "Variations", field: formattedVariations , html: true}

  //     return c
  //   })
  // }
    kyChiCurrent(){
      let currentNow = new Date();
      let kyChi = [
          this.selectDateCurrent == undefined ||
          this.selectDateCurrent == null ||
          this.selectDateCurrent == "" ||
          this.selectDateCurrent == undefined ||
          this.selectDateCurrent.code == undefined ||
          this.selectDateCurrent.code == ""
            ? (currentNow.getMonth() + (currentNow.getDate() > 27 ? 2 : 1))
                .toString()
                .concat(currentNow.getFullYear())
            : this.selectDateCurrent.code,
        ];
        console.log('kyChi', kyChi);
      return kyChi;
    }
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
    onRowDoubleClick(params) {
      // params.row - row object 
      // params.pageIndex - index of this row on the current page.
      // params.selected - if selection is enabled this argument 
      // indicates selected or not
      // params.event - click event
      console.log('row', params.row);
      let item = params.row;
      this.chitieuTitle = item.san_pham;
      this.chitieuItem = item;
      this.$refs.traGopDetail.dialog = true;

    },
    async loadData(){
      let self = this;
      self.tblTraGop = 
          [ 
            {
              // name: 'Animals Total',
              bank_code: '',
              ky_chi: '',
              so_tien: '',
              noi_dung: '',
              ngay_chi: '',
              status: '',
              children: [],
            }
          ];
      let currentNow = new Date();
      let kyChi = [
        this.selectDateCurrent == undefined ||
        this.selectDateCurrent == null ||
        this.selectDateCurrent == "" ||
        this.selectDateCurrent == undefined ||
        this.selectDateCurrent.code == undefined ||
        this.selectDateCurrent.code == ""
          ? (currentNow.getMonth() + (currentNow.getDate() > 27 ? 2 : 1))
              .toString()
              .concat(currentNow.getFullYear())
          : this.selectDateCurrent.code,
      ];
      kyChi = ['ALLINONE'];
      await axios
          .get(config.API_FAMILY + '/api/getListTraGop', this.saleOrder)
          .then(function (response) {
             // seft.hotSettings.data = response.data.data;
            let data = response.data.data;
            self.tblTraGop = 
              [ 
                {
                  // name: 'Animals Total',
                  bank_code: '',
                  ky_chi: '',
                  so_tien: '',
                  noi_dung: '',
                  ngay_chi: '',
                  status: '',
                  children: data,
                }
              ];
          })

    },

    columnFilterFn(){

    },
    onColumnFilter(){
      console.log('-------------onColumnFilter---------------');
      console.log(this.tblTraGop);

    },
    sumCount(rowObj) {
    	console.log(rowObj);
    	let sum = 0;
      for (let i = 0; i < rowObj.children.length; i++) {
        sum += parseFloat(rowObj.children[i].so_tien);
      }
      return sum;
    },
    chitieuDetail(title, item) {
      // this.$refs.chiTieuTotal.dialog = true;
      this.chitieuTitle = title;
      this.chitieuItem = item;
      console.log("item", item);
      this.$refs.traGopDetail.dialog = true;
    },
    chiTieuChangeKyChi(title, item, itemData, kyChiMoi) {
      // this.$refs.chiTieuTotal.dialog = true;
      this.chitieuTitle = title;
      this.chitieuItem = item;
      this.itemData = itemData;
      this.kyChiMoi = kyChiMoi;
      
      console.log("item", item);
      this.$refs.ChiTieuChangeKyChi.dialog = true;
    },
    async changeChiTieuStatus(title, item, itemData, statusMoi, isDoiSoat) {
      console.log("changeChiTieuStatus");
      this.chitieuTitle = title;
      this.chitieuItem = item;
      this.itemDataStatus = item;
      this.statusMoi = statusMoi;
      
      console.log("itemData", itemData);
      this.$refs.ChiTieuChangeStatus.dialog = true;
    },
    onCellClick(params) {
      // params.row - row object 
      // params.column - column object
      // params.rowIndex - index of this row on the current page.
      // params.event - click event
      // console.log(params.row);
      if('noi_dung' == params.column.field){
        this.chitieuDetail(params.row.noi_dung, params.row);

      }
      if('ky_chi' == params.column.field){
        this.chiTieuChangeKyChi(params.row.noi_dung, params.row, params.row);

      }

      if('status' == params.column.field){
        this.changeChiTieuStatus(params.row.noi_dung, params.row, params.row, params.row, true);
        
      }
      // this.chiTieuDetailDialog = true;
    },

    
    
   
  },
}
</script>
<style lang="scss">
.custom-row {
  height: 35px !important;
  button {
    height: 30px !important;
  }
}
.list-table {
  td {
    height: 35px !important;
  }
}
.text-right.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
  // .text-right > .v-text-field__slot > input{
  text-align: right !important;
}
// @import './Bebidas.scss';
.countdown {
  float: right;
}
.vgt-table th.vgt-row-header.vgt-right-align{
  color: #606266 !important;
  font-weight: bold;
}
</style>
