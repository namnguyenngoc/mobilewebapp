<template>
  <v-row class="match-height">
    <v-col>
      <!-- Theo doi suc khoe -->
      <v-card>
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          <v-col cols="12" sm="12" md="11" class="pa-0 ma-0">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row>
                    <v-col cols="12" md="12" sm="12">
                      <h3> Chi tiêu </h3>
                    </v-col>
                    <v-col
                      cols="12" md="12" 
                      sm="12"
                    >
                      <v-row
                      >
                        <v-col cols="12" md="5" sm="6" >
                          <v-menu
                            ref="startMenu"
                            :close-on-content-click="false"
                            :return-value.sync="trip.start"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="trip.start"
                                label="Start date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              no-title
                              scrollable
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.startMenu.isActive = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.startMenu.save(date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>

                        <v-col cols="12" md="5" sm="6">
                          <v-menu
                            ref="endMenu"
                            :close-on-content-click="false"
                            :return-value.sync="trip.end"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="trip.end"
                                label="End date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              no-title
                              scrollable
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.endMenu.isActive = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.endMenu.save(date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col cols="12" sm="2" md="2" class="text-right">
                    Test
                    </v-col>
                    <v-col cols="12" sm="1" md="1" class="ma-0 pb-0 pt-0">
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          
          <v-col
              cols="12" md="1" sm="12"
            class="text--secondary pr-2"
          >
            <v-btn
              color="info"
              @click="loadChiTieu()"
            >
              <!-- <v-icon>
                  {{ icons.mdiReload }}
              </v-icon> -->
              Search
            </v-btn>
          </v-col>
        </v-card-title>
        <v-card-text class="mt-0 mb-0 pt-1 pb-1 ma-0 pa-0">
          <v-row class="ma-0 pa-0">
            <v-col cols="12" md="12" class="pa-0 ma-0 text-right">
              <vue-good-table
              title="Danh sách chi tiêu"
              :columns="colChiTIeu"
              :rows="tblChiTieu"
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
                <span v-if="props.column.field == 'id'">
                   <!-- && props.formattedRow['status'] == 'DN' -->
                  <v-btn
                    v-if="props.formattedRow['status'] == 'DN'"
                    color="info"
                    @click="confirmChangeStatus(props, 'CSK')"
                  >
                   <span>
                    Chốt SK
                   </span>
                  </v-btn>
                  <v-btn
                    v-else-if="props.formattedRow['status'] == 'CSK'"
                    color="primary"
                    @click="confirmChangeStatus(props, 'DTCSK')"
                  >
                   <span>
                    Gạch nợ
                   </span>
                  </v-btn>
                  <v-btn
                    v-else-if="props.formattedRow['id_tra_gop'] == undefined || props.formattedRow['id_tra_gop'] == null || props.formattedRow['id_tra_gop'] == ''"
                    color="info"
                    @click="addTraGop(props)"
                  >
                   <span>
                    Chuyển đổi {{props.formattedRow['id_tra_gop']}}
                   </span>
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
      <ChiTieuDetail
        ref="chitieuDetail"
        :title="chitieuTitle"
        :item="chitieuItem"
        :v-model="chiTieuDetailDialog"
        @refeshList="loadChiTieu()"
      />

      <ChiTieuChangeKyChi
        ref="ChiTieuChangeKyChi"
        :title="chitieuTitle"
        :item="chitieuItem"
        :itemData="itemData"
        :kyChiMoi="kyChiMoi"
        :v-model="chiTieuChangeKyChiDialog"
        @refeshList="loadChiTieu()"
      />

      <ChiTieuChangeStatus
        ref="ChiTieuChangeStatus"
        :title="chitieuTitle"
        :item="chitieuItem"
        :itemData="itemDataStatus"
        :statusMoi="itemStatusMoi"
        :v-model="chiTieuChangeStatusDialog"
        @refeshList="loadChiTieu()"
      />
        
      <TraGopAdd
        ref="tragopAdd"
        :v-model="dialogTraGop"
        :item="itemGop"
        @refeshList="loadChiTieu()"
      />

    </v-col>
  </v-row>
  
</template>
<script>
import axios from 'axios';
import config from '../../config/config';
import common from '../../common/common';
import moment from 'moment';
import { VueGoodTable } from 'vue-good-table';


import { mdiReload, mdiMinus, mdiOneUp, mdiPlus, mdiDeleteOutline, mdiCircleEditOutline, mdiSleep, mdiConsoleNetworkOutline } from '@mdi/js'
import { reactive } from '@vue/composition-api'
import ChiTieuDetail from "./ChiTieuDetail";
import ChiTieuChangeKyChi from "./ChiTieuChangeKyChi";
import ChiTieuChangeStatus from "./ChiTieuChangeStatus";
import TraGopAdd from "./TraGopAdd";

export default {
  name: 'ChiTieuGiaDinh',
  components: {
    VueGoodTable,
    ChiTieuDetail,
    ChiTieuChangeKyChi,
    ChiTieuChangeStatus,
    TraGopAdd,
    mdiReload
  },
  data() {
    let self = this;
    return {
      sliderSK: 12,
      colChiTIeu: [
        {
          label: 'Action',
          field: 'id',
         
        },
        {
          label: 'Số tiền',
          field: 'so_tien',
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
          headerField: this.sumCount,
        },
        {
          label: 'Status',
          field: 'status',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Status', // placeholder for filter input
              filterValue: (new Date()).getDate() > 21 ? 'CSK' : 'DN', // initial populated value for this filter
              filterDropdownItems: ['DN', 'CSK', 'DTCSK', 'TG', 'HT'], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Bank',
          field: 'bank_code',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Bank', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: ['HSBC', 'VIB', 'SC BANK','VPBANK'], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Kỳ',
          field: 'ky_chi',
          width: '120px',
          filterable: true,
          type: 'number',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Kỳ Chi', // placeholder for filter input
              filterValue: ((new Date()).getMonth() + ((new Date()).getDate() > 27 ? 2 : 1)).toString().concat((new Date()).getFullYear()), // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Nội dung',
          field: 'noi_dung',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Nội dung', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Ngày chi',
          field: 'ngay_chi',
          type: 'date',
          // dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
          // dateOutputFormat: 'dd-MM-yyyy',
          formatFn: function (value) {
              return value != null ? moment(value).format('DD-MM-yyyy') : null
          },
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Ngày chi', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
      ],
      tblChiTieu:[ 
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
      dialogTraGop: false,
      itemGop: {
        tong_tien: 0,
      },
      loadingInstance: null,
      icons: {
        mdiMinus,
        mdiOneUp,
        mdiPlus,
        mdiDeleteOutline,
        mdiCircleEditOutline,
        mdiSleep,
        mdiReload
      },
      date: null,
      trip: {
        name: '',
        location: null,
        start: moment().subtract(24, 'months').format(config.DATE_FM),
        end: new Date().toISOString().substr(0, 10),
      },
    }
  },
  created() {
    //  let dateStartWeek2 = momentBiz(momentBiz(new Date('2021-06-09')).startOf('isoWeek').isoWeekday(2), "YYYY-MM-DD").businessSubtract(-7);
    // let dateEndWeek = momentBiz(momentBiz(new Date()).startOf('isoWeek').isoWeekday(2), "YYYY-MM-DD").businessSubtract(-1);
    // console.log("from", new Date(momentBiz(dateStartWeek2, 'YYYY-MM-DD')._d).toISOString().substr(0, 10));
    // console.log("to", new Date(momentBiz(dateEndWeek, 'YYYY-MM-DD')._d).toISOString().substr(0, 10));

    // this.trip.start = new Date(momentBiz(dateStartWeek2, 'YYYY-MM-DD')._d).toISOString().substr(0, 10);
    // this.trip.end = new Date(momentBiz(dateEndWeek, 'YYYY-MM-DD')._d).toISOString().substr(0, 10);
    
    this.loadingInstance = this.$veLoading({
        target: document.querySelector("#loading-container"),
        // 等同于
        // target:"#loading-container"
        name: "wave",
    });
    this.loadChiTieu();
     
  },
  mounted() {
    // // this.loadingChart();
    
    // this.show();
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
    },
    loadChiTieu(){
      // this.loadingInstance.show();
      this.show();
      // this.show();
      let self = this;
      self.tblChiTieu = 
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
      axios
      .get(`${config.API_FAMILY}/api/chitieus/${JSON.stringify(kyChi)}/${this.allStatusChecked}/${this.includeGop}/${this.trip.start}/${this.trip.end}`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.tblChiTieu = 
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
        console.log(self.tblChiTieu);
        self.close();
      });
    },

    columnFilterFn(){

    },
    onColumnFilter(){
      console.log('-------------onColumnFilter---------------');
      console.log(this.tblChiTieu);

    },
    sumCount(rowObj) {
    	console.log('sumCount', rowObj);
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
      this.$refs.chitieuDetail.dialog = true;
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

    confirmChangeStatus (props, status){
      console.log("props", props);
      console.log("status", status);
      this.itemStatusMoi = config.CHITIEU_ITEMS_STATUS.find(({id}) => id == status);
      
      console.log("this.itemStatusMoi", this.itemStatusMoi);
      this.changeChiTieuStatus(props.row.noi_dung, props.row, props.row, props.row, true);
    },
    addTraGop (props) {
      let item =  props.row;
      let kyObj = common.getKyTinh(item.bank_code, new Date(item.ngay_chi), new Date().getDate(), true);
      console.log("kyObj", kyObj);
      console.log("item", item);
      let ky_dau = moment(new Date(kyObj.year, kyObj.month, kyObj.day)).format("YYYY-MM-DD");
      this.itemGop = {
          san_pham:  item.noi_dung,
          bank: item.bank_code,
          tong_tien: item.tong_tien,
          gia_san_pham: item.so_tien,
          moi_ky: 0,
          tong_so_ky: 0,
          ky_da_tra: 0,
          ky_con_lai: 0,
          tien_do_tra_gop: 0,
          phi_chuyen: 0,
          noi_mua: item.noi_mua,
          ngay_mua: moment(item.ngay_chi).format("YYYY-MM-DD"),
          ghi_chu: `CHUYỂN ĐỔI TRẢ GÓP ${item.noi_dung}`,
          ky_cuoi: "",
          trang_thai: "",
          ky_dau: ky_dau,
          chitieulist: ""
      };
      
      // props.row.noi_dung, props.row, props.row, props.row
      this.$refs.tragopAdd.dialog = true
      
    },
    destroyed() {
      this.loadingInstance.destroy();

    }, // end method
    show() {
        this.loadingInstance.show();
    },
    close() {
        this.loadingInstance.close();
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

.class-filter input[name='vgt-ky_chi'], .class-filter input[name='vgt-so_tien'] {
  text-align: right;
}
</style>
