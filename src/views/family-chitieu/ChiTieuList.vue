<template>
  <v-row class="match-height">
    <v-col>
      <!-- Theo doi suc khoe -->
      <v-card>
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          <v-col cols="12" sm="12" md="12" class="pa-0 ma-0">
            <v-row>
              <v-col cols="12" md="12" sm="12">
                <h3> Chi tiêu </h3>
              </v-col>
              <v-col
                cols="12" md="12" 
                sm="12"
              >
                <v-row>
                  <v-col cols="12" md="4" sm="6"  class="d-inline-flex">
                    <v-menu
                        ref="startMenu"
                        :close-on-content-click="false"
                        :return-value.sync="trip.start"
                        offset-y
                      >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="trip.start"
                          label="Start date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          hide-details
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
                    <v-menu
                      ref="endMenu"
                      :close-on-content-click="false"
                      :return-value.sync="trip.end"
                      offset-y
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="trip.end"
                          label="End date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          hide-details
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
                  <v-col cols="12" md="3" sm="4" class="d-inline-flex">
                    <v-autocomplete
                        ref="refInputFile"
                        v-model="trip.status"
                        :items="trip.statusList"
                        label="Status"
                        class="text-left mr-4"
                        item-text="name"
                        item-value="code"
                        return-object
                        clearable
                        hide-details
                    />
                    <v-autocomplete
                        ref="refInputFile"
                        v-model="trip.bank"
                        :items="trip.bank_list"
                        label="Bank"
                        item-text="name"
                        item-value="code"
                        return-object
                        clearable
                        @change="loadFileInFolder()"
                        hide-details
                      />
                  </v-col>
                  
                  <v-col cols="12" md="5" sm="4" class="d-inline-flex">
                    <v-checkbox v-model="allKyChi" 
                      @click="getListKyChi()"
                      class="ml-0 mr-5 pl-0 pr-0"
                      label="Tất cả kỳ"
                      >
                    </v-checkbox>
                      <v-autocomplete
                        ref="refInputFile"
                        v-model="trip.kychi"
                        :items="items_ky_chi"
                        width="100vh"
                        label="Kỳ chi"
                        class="text-left"
                        item-text="title"
                        item-value="code"
                        return-object
                        clearable
                        hide-details
                      />
                  </v-col>
                  
                  
                </v-row>
              </v-col>
            </v-row>
            
            <v-row class="mb-0 mt-5 mr-0">
              <v-btn
                color="info"
                class="mr-2"
                small
                @click="loadChiTieu()"
              >
                <!-- <v-icon>
                    {{ icons.mdiReload }}
                </v-icon> -->
                Search
              </v-btn>
              <v-btn
                  color="success"
                  class="mr-2"
                  small
                  @click="confirmChangeStatus(null, 'CSK', true)"
                >
                  Cập nhật trạng thái
                  
              </v-btn>
              <v-btn
                color="warning"
                class=""
                small
                :disabled="!(saokeObject.file_name != undefined && saokeObject.file_name != null && saokeObject.file_name != '')"

                @click="compareSaoKe()"
              >
                Compare
              </v-btn>
              <v-spacer/>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" sm="12" class="ma-0 pa-0">
                <v-checkbox 
                  v-model="isShowColumnSaoKe"
                  label="Hiển thị (Số tiền, Ngày giao dịch... trong sao kê)">
                 
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row class="mt-1 pa-2" v-show="isShowColumnSaoKe">
              <v-col cols="12" md="2" sm="12" class="mt-1 mb-0 pt-0 pb-0 d-inline-flex">
                <v-file-input
                  v-model="file" 
                  show-size
                  counter
                  multiple
                  accept="application/pdf" 
                  label="File input"
                ></v-file-input>
                <v-btn
                  color="blue-grey"
                  class="mt-3 text-right"
                  :disabled="!(trip.bank == 'HSBC' ||  this.trip.bank == 'VIB' || trip.bank =='CITI' || trip.bank =='SC')"
                  @click="onUpload"
                  >
                  <v-icon icon>
                    {{ icons.mdiUpload }}
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" md="3" sm="12" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Folder Path"
                  value=""
                  v-model="saokeObject.folder_path"
                  hide-details
                  @change="loadFileInFolder()"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="3" sm="12" class="mt-1 mb-0 pt-0 pb-0">
                <v-autocomplete
                    ref="refInputFile"
                    v-model="saokeObject.file_name"
                    :items="saokeObject.listFile"
                    label="Input file"
                    class="text-left"
                    item-text="name"
                    item-value="code"
                    clearable
                    @change="procesFileName()"
                >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        No results matching "<strong>data</strong>". Press <kbd>enter</kbd> to create a new one
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="2" sm="12" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Password"
                  v-model="saokeObject.pwd"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2" sm="12" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Output file"
                  v-model="saokeObject.file_name_output"
                  hide-details
                ></v-text-field>
              </v-col>
           
              
            </v-row>
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
                :row-style-class="rowStyleClassFn"
                :search-options="{
                  enabled: true,
                  placeholder: 'Search this table',
                }"
                :group-options="{
                  enabled: true,
                  headerPosition: 'top',
                }"
                :select-options="{ enabled: true }"
                styleClass="vgt-table bordered"
                max-height="700px"
                @on-row-dblclick="onRowDoubleClick"
                @on-column-filter="onColumnFilter"
                @on-cell-click="onCellClick"
                @on-selected-rows-change="selectionChanged"
              >
              <template slot="table-row" slot-scope="props">
                <span v-if="props.column.field == 'id'">
                   <!-- && props.formattedRow['status'] == 'DN' -->
                  <v-btn
                    v-if="props.formattedRow['status'] == 'DN'"
                    color="info"
                    depressed
                    @click="confirmChangeStatus(props, 'CSK')"
                  >
                   <span>
                    CSK
                   </span>
                  </v-btn>
                  <v-btn
                    v-else-if="props.formattedRow['status'] == 'CSK'"
                    color="primary"
                    @click="confirmChangeStatus(props, 'DTCSK')"
                  >
                   <span>
                    ĐTRẢ
                   </span>
                  </v-btn>
                  <v-btn
                    v-else-if="props.formattedRow['status'] !== 'DTCSK' && (props.formattedRow['id_tra_gop'] == undefined || props.formattedRow['id_tra_gop'] == null || props.formattedRow['id_tra_gop'] == '')"
                    color="info"
                    @click="addTraGop(props)"
                  >
                   <span>
                    GÓP {{props.formattedRow['id_tra_gop']}}
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
          <v-row class="mt-3 pa-2">
            <v-col cols="12" md="2" sm="12" class="mt-1 mb-0 pt-0 pb-0">
              <v-text-field
                label="Folder Path"
                value=""
                v-model="saokeObject.folder_path"
                hide-details
                @change="loadFileInFolder()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="1" sm="12" class="mt-1 mb-0 pt-0 pb-0">
              <v-text-field
                label="Start Number"
                value=""
                v-model="saokeObject.startNumber"
                :disabled="true"
                hide-details
                @change="loadFileInFolder()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" sm="12" class="mt-1 mb-0 pt-0 pb-0">
              <v-text-field
                label="Giảm phần cuối"
                value=""
                v-model="saokeObject.subEnd"
                hide-details
                @change="loadFileInFolder()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="1" sm="12" class="mt-1 mb-0 pt-0 pb-0">
              <v-autocomplete
                  ref="refInputFile"
                  v-model="saokeObject.file_name"
                  :items="saokeObject.listFile"
                  label="Input file"
                  class="text-left"
                  item-text="name"
                  item-value="code"
                  clearable
                  @change="procesFileName()"
              >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      No results matching "<strong>data</strong>". Press <kbd>enter</kbd> to create a new one
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="2" sm="12" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Password"
                  v-model="saokeObject.pwd"
                  hide-details
                ></v-text-field>
              </v-col>
            <v-col cols="12" md="2" sm="12" class="mt-1 mb-0 pt-0 pb-0">
              <v-text-field
                label="Output file"
                v-model="saokeObject.file_name_output"
                hide-details
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="1" sm="12" class="mt-1 mb-0 pt-0 pb-0 text-right">
              <v-btn
                color="info"
                :disabled="!(saokeObject.file_name != undefined && saokeObject.file_name != null && saokeObject.file_name != '')"
                @click="loadSaoKe()"
              >
                Load Sao Ke
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 mt-5">
            <v-col cols="12" md="12" class="pa-0 ma-0 text-right">
              <vue-good-table
                title="Danh sách chi tiêu"
                :columns="colChiTIeuSaoKe"
                :rows="tblChiTieuSaoKe"
                :paginate="true"
                :lineNumbers="true"
                max-height="700px"
                :search-options="{
                  enabled: true,
                  placeholder: 'Search this table SaoKe',
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
                    CSK
                   </span>
                  </v-btn>
                  <v-btn
                    v-else-if="props.formattedRow['status'] == 'CSK'"
                    color="primary"
                    @click="confirmChangeStatus(props, 'DTCSK')"
                  >
                   <span>
                    HT
                   </span>
                  </v-btn>
                  <v-btn
                    v-else-if="props.formattedRow['id_tra_gop'] == undefined || props.formattedRow['id_tra_gop'] == null || props.formattedRow['id_tra_gop'] == ''"
                    color="info"
                    @click="addTraGop(props)"
                  >
                   <span>
                    CĐ {{props.formattedRow['id_tra_gop']}}
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


import { mdiReload, mdiMinus, mdiOneUp, mdiPlus, mdiDeleteOutline, mdiCircleEditOutline, mdiSleep
, mdiConsoleNetworkOutline, mdiUpload } from '@mdi/js'
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
          with: '200px',
          hidden: this.isMobile(),
         
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
              return value != null ? moment(value).format('DD-MM-yyyy HH:mm') : null
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
        {
          label: 'Status',
          field: 'status',
          filterable: true,
          // filterOptions: {
          //   styleClass: 'class-filter', // class to be added to the parent th element
          //     enabled: true, // enable filter for this column
          //     placeholder: 'Status', // placeholder for filter input
          //     filterValue: (new Date()).getDate() > 21 ? 'CSK' : 'DN', // initial populated value for this filter
          //     filterDropdownItems: ['DN', 'CSK', 'DTCSK', 'TG', 'HT', 'EMAIL_CSK'], // dropdown (with selected values) instead of text input
          //     // filterFn: this.columnFilterFn, //custom filter function that
          //     trigger: 'enter', //only trigger on enter not on keyup 
          // },
          // hidden: this.isMobile(),
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
              filterDropdownItems: ['HSBC', 'VIB', 'SC','VPBANK'], // dropdown (with selected values) instead of text input
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
          // filterOptions: {
          //   styleClass: 'class-filter', // class to be added to the parent th element
          //     enabled: true, // enable filter for this column
          //     placeholder: 'Kỳ Chi', // placeholder for filter input
          //     filterValue: ((new Date()).getMonth() + ((new Date()).getDate() > 27 ? 2 : 1)).toString().concat((new Date()).getFullYear()), // initial populated value for this filter
          //     filterDropdownItems: [], // dropdown (with selected values) instead of text input
          //     // filterFn: this.columnFilterFn, //custom filter function that
          //     trigger: 'enter', //only trigger on enter not on keyup 
          // },
          hidden: this.isMobile(),
        },
        {
          label: 'Created Date',
          field: 'create_date',
          type: 'date',
          // dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
          // dateOutputFormat: 'dd-MM-yyyy',
          formatFn: function (value) {
              return value != null ? moment(value).format('DD-MM-yyyy HH:mm') : null
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
          hidden: true,
        },

        {
          label: 'Nội dung SK',
          field: 'saoke_noi_dung',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Nội dung SK', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          hidden: true,
        },

        {
          label: 'Số tiền SK',
          field: 'saoke_so_tien',
          type: 'number',
          filterable: true,
          formatFn: this.formatPrice,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'saoke_so_tien', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          hidden: true,
          headerField: this.sumSaoKe,
        },

        {
          label: 'Ngày giao dịch',
          field: 'saoke_ngay_giao_dich',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Ngày giao dịch', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          hidden: true,
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
      colChiTIeuSaoKe: [
        {
          label: 'Ngày giao dịch',
          field: 'ngay_giao_dich',
          width: '120px',
        },
        {
          label: 'Ngày hệ thống',
          field: 'ngay_he_thong',
          width: '120px',
        },
        {
          label: 'Nơi giao dịch',
          field: 'noi_giao_dich',
        },
        {
          label: 'Số tiền',
          field: 'so_tien',
          // type: 'number',
          // formatFn: this.convertAndFormatPrice,
          // headerField: this.sumSaoKe,
        },
        {
          label: 'Type',
          field: 'type',
        },
        {
          label: 'Page',
          field: 'page',
        },
       
      ],
      tblChiTieuSaoKe:[ 
        {
        //   // name: 'Animals Total',
        //   bank_code: '',
        //   ky_chi: '',
        //   so_tien: '',
        //   noi_dung: '',
        //   ngay_chi: '',
        //   status: '',
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
        end: moment().subtract(-5, 'days').format(config.DATE_FM),
        status: (new Date()).getDate() > 21 ? 'CSK' : 'DN',
        statusList: ['DN', 'CSK', 'DTCSK', 'TG', 'HT', 'EMAIL_CSK'],
        kychi: {
          code: ((new Date()).getMonth() + ((new Date()).getDate() > 27 ? 2 : 1)).toString().concat((new Date()).getFullYear()),
          title: ((new Date()).getMonth() + ((new Date()).getDate() > 27 ? 2 : 1)).toString().concat((new Date()).getFullYear())
        },
        kychi_list: this.getListKyChi(),
        bank: 'ALL',
        bank_list:  ['All','HSBC', 'VIB', 'SC', 'CITT','VPBANK'],
        // new Date().toISOString().substr(0, 10),
      },
      saokeObject: {
        folder_path: './',
        file_name: '',
        file_name_output: '',
        pwd: '27069944',
        listFile: [],
        startNumber: 16,
        subEnd: 18
      },
      allKyChi: false,
      isShowColumnSaoKe: false,
      icons: {
        mdiMinus,
        mdiOneUp,
        mdiPlus,
        mdiDeleteOutline,
        mdiCircleEditOutline,
        mdiSleep,
        mdiReload,
        mdiUpload
      },
      file: null,
      imageUrl: null,
      rowSelected: [],
      conditionCompare: false,
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
    // this.loadSaoKe();
    this.loadFileInFolder();
    this.procesFileName();
     
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
    },
    items_ky_chi_list: function() {
        let month = "";
        console.log("month_");
        let monList = moment.months();
        let yearList = config.NAM_THONG_KE;
        let items_ky_chi_new = [];
        let currentNow = new Date();
        // console.log("currentNow.getMonth()", currentNow.getMonth())
        // console.log("currentNow.getFullYear()", currentNow.getFullYear())
        for (var i in yearList) {
          for (var j in monList) {
            let value = moment()
              .month(monList[j])
              .format("M")
              .concat(yearList[i]);
            const isShowAll = this.allKyChi
                ? false
                : yearList[i] < currentNow.getFullYear() ||
                  (moment().month(monList[j]).format("M") <
                    currentNow.getMonth() + 1 &&
                    yearList[i] == currentNow.getFullYear());

            let obj = {
              code: value,
              title: value,
              disabled: this.allKyChi
                ? false
                : yearList[i] < currentNow.getFullYear() ||
                  (moment().month(monList[j]).format("M") <
                    currentNow.getMonth() + 1 &&
                    yearList[i] == currentNow.getFullYear()),
              // divider: this.allKyChi ? false : moment().month(monList[j]).format("M") < currentNow.getMonth() + 1
              //           && yearList[i] < currentNow.getFullYear(),
              // header: this.allKyChi ? false : (moment().month(monList[j]).format("M") < currentNow.getMonth() + 1
              //           && yearList[i] < currentNow.getFullYear()) ? "Paste": ""
            };
            if(isShowAll){
              items_ky_chi_new.push(obj);

            }
          }
        }
        // console.log(moment().month().format("M"));
        // console.log(moment.monthsShort().format("M"));
        console.log("new Month");
        console.log(items_ky_chi_new);
        this.items_ky_chi = items_ky_chi_new;
        return this.items_ky_chi;
      },
  }, // end method
  methods: {
    isMobile () {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        )
      ) {
        return true
      } else {
        return false
      }
    },
    isDisplayCompareColumn(){
      return !this.isDisplayCompareColumn;
    },
    getListKyChi() {
        let month = "";
        console.log("month_");
        let monList = moment.months();
        let yearList = config.NAM_THONG_KE;
        let items_ky_chi_new = [];
        let currentNow = new Date();
        // console.log("currentNow.getMonth()", currentNow.getMonth())
        // console.log("currentNow.getFullYear()", currentNow.getFullYear())
        for (var i in yearList) {
          for (var j in monList) {
            let value = moment()
              .month(monList[j])
              .format("M")
              .concat(yearList[i]);

            const isShowAll = this.allKyChi
              ? false
              : yearList[i] < currentNow.getFullYear() ||
                (moment().month(monList[j]).format("M") <
                  currentNow.getMonth() + 1 &&
                  yearList[i] == currentNow.getFullYear());
                  
            let obj = {
              code: value,
              title: value,
              disabled: this.allKyChi
                ? false
                : yearList[i] < currentNow.getFullYear() ||
                  (moment().month(monList[j]).format("M") <
                    currentNow.getMonth() + 1 &&
                    yearList[i] == currentNow.getFullYear()),
              // divider: this.allKyChi ? false : moment().month(monList[j]).format("M") < currentNow.getMonth() + 1
              //           && yearList[i] < currentNow.getFullYear(),
              // header: this.allKyChi ? false : (moment().month(monList[j]).format("M") < currentNow.getMonth() + 1
              //           && yearList[i] < currentNow.getFullYear()) ? "Paste": ""
            };
            if(!isShowAll){
             items_ky_chi_new.push(obj);
            }
          }
        }
        // console.log(moment().month().format("M"));
        // console.log(moment.monthsShort().format("M"));
        console.log("new Month");
        console.log(items_ky_chi_new);
        this.items_ky_chi = items_ky_chi_new;
        return this.items_ky_chi;
      },
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
    convertAndFormatPrice(value, tofix) {
      try {
        var number = Number(value.replace(/[^0-9.-]+/g,""));
        // value = parseFloat(number);
        if (!number) {
          return ''
        }
        const val = (number / 1).toFixed(tofix).replace(',', '.')
        if (!val) {
          return ''
        }

        
      }catch(error){

      }
      

      return value
    },
    onRowDoubleClick(params) {
      // params.row - row object 
      // params.pageIndex - index of this row on the current page.
      // params.selected - if selection is enabled this argument 
      // indicates selected or not
      // params.event - click event
      console.log('row', params.row);
    },
    async loadChiTieu(){
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
      console.log('ky_chi', this.trip.kychi);
      this.includeGop = 'ALL';
      let param = [
        JSON.stringify([`${this.trip.kychi.code == undefined ? "ALLINONE" : this.trip.kychi.code}`]),
        this.trip.status.toString(),
        this.includeGop.toString(),
        this.trip.start.toString(),
        this.trip.end.toString(),
        this.trip.bank.toString()
      ];
      await axios
      .get(`${config.API_FAMILY}/api/chitieus/${param.join("/")}`)
      .then(async function(response) {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        // for(let i = 0; i < data.length; i++){
        //   data[i].saoke_noi_dung = '11111111';
        // }
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

        if(self.saokeObject.file_name != undefined 
          && self.saokeObject.file_name != null 
          && self.saokeObject.file_name.trim().length > 0){
          await self.compareSaoKe();

        }
        self.close();
      });
    },
    loadFileInFolder(){
      // saokeObject.listFile
      this.saokeObject.file_name = '';
      this.saokeObject.file_name_output = '';
      this.saokeObject.pwd = '';

      if(this.trip.bank != undefined && this.trip.bank != 'ALL' && this.trip.bank != 'All' && this.trip.bank != ''){
        this.saokeObject.folder_path = `./public/saoketindung/${this.trip.bank.toString().toLowerCase()}`;

      }
      let self = this;
      axios
      .post(`${config.API_FAMILY}/api/pdf/getFileList`, this.saokeObject)
      .then(response => {
        console.log("response.data", response.data);
        self.saokeObject.listFile = response.data.data;
       

      });

      
    },
    procesFileName(){
      //  file_name: '20170423.pdf',
      //   file_name_output: '20170423',
      let arr = [];
      console.log("this.saokeObject", this.saokeObject);
      if(this.saokeObject.file_name != undefined && this.saokeObject.file_name != null){
        let arr = this.saokeObject.file_name.split(".");
        console.log("procesFileName", arr);
        if(arr.length == 2){
          this.saokeObject.file_name_output = arr[0];
          
          // return;
        }

      }
    },
    async loadSaoKe(){
      // this.loadingInstance.show();
      this.show();
      // this.show();
      const self = this;
      self.tblChiTieuSaoKe = 
          [ 
            {
              // name: 'Animals Total',
              // bank_code: '',
              // ky_chi: '',
              // so_tien: '',
              // noi_dung: '',
              // ngay_chi: '',
              // status: '',
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
      // let param = {
      //   "bank": "hsbc",
      //   "file_name": "20220721.pdf",
      //   "file_name_output": "20220721"
      //   };
      this.saokeObject.bank = this.trip.bank.toString().toLowerCase();
      axios
      .post(`${config.API_FAMILY}/api/pdf/pdf2json`, this.saokeObject)
      .then(response =>  {
        // seft.hotSettings.data = response.data.data;
        let newTable = [];
        console.log('self.trip.bank', self.trip.bank);
        if('HSBC' == self.trip.bank){
          newTable = self.parseJsonDataBankHSBC(response);
          self.tblChiTieuSaoKe = 
          [ 
            {
              children: newTable,
            }
          ];
          self.close();
        } else if('VIB' == self.trip.bank){
         
          const vibDataList = [];
          self.tblChiTieuSaoKe = 
          [ 
            {
              children: [],
            }
          ];
          newTable = self.parseJsonDataBankVIB(response);
          
          self.tblChiTieuSaoKe = 
          [ 
            {
              children: newTable,
            }
          ];
          self.close();
        } else {
          alert('Vui lòng chọn bank');
          self.close();
        }
        
        
      });
        
    },
    async compareSaoKe(){
      // this.loadingInstance.show();
      this.show();
      // this.show();
      let self = this;
      try{
        self.colChiTIeu[7].hidden = !this.isShowColumnSaoKe;
        self.colChiTIeu[8].hidden = !this.isShowColumnSaoKe;
        self.colChiTIeu[9].hidden = !this.isShowColumnSaoKe;
        self.colChiTIeu[10].hidden = !this.isShowColumnSaoKe;
        self.tblChiTieuSaoKe = 
            [ 
              {
                // name: 'Animals Total',
                // bank_code: '',
                // ky_chi: '',
                // so_tien: '',
                // noi_dung: '',
                // ngay_chi: '',
                // status: '',
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
        // let param = {
        //   "bank": "hsbc",
        //   "file_name": "20220721.pdf",
        //   "file_name_output": "20220721"
        //   };
        this.saokeObject.bank = this.trip.bank.toString().toLowerCase();
        await axios
        .post(`${config.API_FAMILY}/api/pdf/pdf2json`, this.saokeObject)
        .then(response => {
          // seft.hotSettings.data = response.data.data;
          if(response.data.status == 'FAIL'){
            self.close();
            alert(response.data.message);
            return;
          }
          let data = response.data.body.Pages; //Texts
          let tblData = [];
          let flagStart = false;
          let isStartPage = false;
          let flagEnd = false;
          let newTable = [];
          if('hsbc' == self.trip.bank.toString().toLowerCase()){
            newTable = self.parseJsonDataBankHSBC(response);
            let oldChiTieuData = self.tblChiTieu[0].children;
            for(let i = 0; i < self.tblChiTieu[0].children.length; i ++){
              let so_tien_sk = Number(self.tblChiTieu[0].children[i].so_tien.toString().replace(/[^0-9.-]+/g,""));
              
              var inSaoKe = newTable.find(({so_tien}) => so_tien == so_tien_sk);
              if(inSaoKe != undefined){
                console.log('inSaoKe', self.tblChiTieu[0].children[i]);
                self.tblChiTieu[0].children[i].saoke_noi_dung = inSaoKe.noi_giao_dich;
                self.tblChiTieu[0].children[i].saoke_so_tien = inSaoKe.so_tien;
                self.tblChiTieu[0].children[i].saoke_ngay_giao_dich =inSaoKe.ngay_giao_dich;
              }
            }
          }
          if('vib' == self.trip.bank.toString().toLowerCase()){
            newTable = self.parseJsonDataBankVIB(response);
            let oldChiTieuData = self.tblChiTieu[0].children;
            for(let i = 0; i < self.tblChiTieu[0].children.length; i ++){
              let so_tien_sk = Number(self.tblChiTieu[0].children[i].so_tien.toString().replace(/[^0-9.-]+/g,""));
              
              var inSaoKe = newTable.find(({so_tien}) => so_tien == so_tien_sk);
              if(inSaoKe != undefined){
                console.log('inSaoKe', self.tblChiTieu[0].children[i]);
                self.tblChiTieu[0].children[i].saoke_noi_dung = inSaoKe.noi_giao_dich;
                self.tblChiTieu[0].children[i].saoke_so_tien = inSaoKe.so_tien;
                self.tblChiTieu[0].children[i].saoke_ngay_giao_dich =inSaoKe.ngay_giao_dich;
              }
            }
          }
          self.close();
        });
      } catch(error){
        console.log(error);
         self.close();
      }
    },
    columnFilterFn(){

    },
    onColumnFilter(){
      console.log('-------------onColumnFilter---------------');
      console.log(this.tblChiTieu);

    },
    sumCount(rowObj) {
    	// console.log('sumCount', rowObj);
    	let sum = 0;
      for (let i = 0; i < rowObj.children.length; i++) {
        sum += parseFloat(rowObj.children[i].so_tien);
      }
      return sum;
    },
    sumSaoKe(rowObj) {
    	// console.log('sumCount', rowObj);
    	let sum = 0;
      for (let i = 0; i < rowObj.children.length; i++) {
        var number = Number(rowObj.children[i].saoke_so_tien);
        
        sum += number == undefined ? 0 : number;
      }
      // const val = (sum / 1).toFixed(2).replace(',', '.')
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
    async changeChiTieuStatus(title, item, itemData, statusMoi, isDoiSoat, isList) {
      console.log("changeChiTieuStatus");
      this.chitieuTitle = title;
      this.chitieuItem = item;
      this.itemDataStatus = item;
      this.statusMoi = statusMoi;

      for(let i = 0; i < this.$refs.ChiTieuChangeStatus.items; i++){
        this.$refs.ChiTieuChangeStatus.items.splice(i, 1);
      }
      if(!isList){
        let arr = [];
        arr.push(item);
        this.$refs.ChiTieuChangeStatus.items = arr;
      }else {
        this.$refs.ChiTieuChangeStatus.items = [...this.rowSelected.selectedRows];

      }

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

    confirmChangeStatus (props, status, isList){
      console.log("this.rowSelected.selectedRows", this.rowSelected.selectedRows);
      this.itemStatusMoi = config.CHITIEU_ITEMS_STATUS.find(({id}) => id == status);
      if(props == null){
        props = this.rowSelected.selectedRows[0];
        this.changeChiTieuStatus(props.noi_dung, props, props, props, true, isList);
      } else {
        if(this.rowSelected != undefined && this.rowSelected.selectedRows != undefined){
          for(let i = 0; i < this.rowSelected.selectedRows.length; i ++){
            this.rowSelected.selectedRows.slice(i, 1);
          }
        }
        
        this.changeChiTieuStatus(props.row.noi_dung, props.row, props.row, props.row, true, isList);

      }
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

    dataValid(item){
      if(item != undefined && item != null && item.T != undefined){
        return item.T;
      }
      return "";
    },
    dataValid2(item){
      if(item != undefined && item != null && item != ""){
        return item;
      }
      return "";
    },
    rowStyleClassFn(row){
      if(row.children != undefined) return "";
      if((row.saoke_so_tien == undefined || row.saoke_so_tien == null || row.saoke_so_tien == "")
          && (row.so_tien != undefined && row.so_tien && row.so_tien != null)){
            return "difference-sk";
      }
      
      //Compare conent
      if(!row.saoke_noi_dung.includes(row.noi_dung) ) return 'difference-nd';
      return row.so_tien != row.saoke_so_tien ? 'difference-sk' : '';
    },
    capitalizeFirstLetter(str) {

        // converting first letter to uppercase
        const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

        return capitalized;
    },
    async onUpload(){
      console.log(this.file);
      let self = this;
      var formData = new FormData();
      formData.append('myFile', this.file[0], this.file[0].name);
      formData.append('bank', this.trip.bank.toString().toLowerCase());
      formData.append('filename', 'hsbc.pdf');
      self.show();
      await axios.post(`${config.API_FAMILY}/uploadfile${this.capitalizeFirstLetter(this.trip.bank.toString().toLowerCase())}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=' + formData._boundary
          }
      }).then((response) => {
          console.log(response);
          self.close();
        })
     
    },

    parseJsonDataBankHSBC(response){
      let newTable = [];
      let data = response.data.body.Pages; //Texts
      let tblData = [];
      let flagStart = false;
      let isStartPage = false;
      let flagEnd = false;
      for(let page = 0; page < data.length - 1; page++){

        for(let i = 0; i < data[page].Texts.length; i ++) {
          let textLine = data[page].Texts;
          for(let j = 0; j < textLine[i].R.length; j ++){
            if(!isStartPage && "Page" == textLine[i].R[j].T.toString().trim()){
              isStartPage = true;
              // i = i + 1;
            }

            if("ab" == textLine[i].R[j].T.toString().trim()){
              isStartPage = false;
              flagStart = false;
              // i = i + 1;
            }
            if(!flagStart && "Ngày giao dịch" == textLine[i].R[j].T.toString().trim()){
              flagStart = true;
              if(page == 0){
                i = i + 14;

              } else {
                i = i + 8; //	ACCOUNT BALANCE AS IN LAST STATEMENT
              }
              // i = i + 1;
            }
            if(isStartPage && flagStart){
              textLine[i].R[j].start = `Page-${page + 1}`;
              textLine[i].R[j].page =  `PAGE_${page}`;
              tblData.push(textLine[i].R[j]);
              
            }
          }
          
        }
      };

      //process dataraw:
      //  var number = Number(value.replace(/[^0-9.-]+/g,""));
      
      for(let i = 0; i < tblData.length - 6; i = i+4){
        let so_tien_sk = this.dataValid(tblData[i + 3]);
        let item = {
          ngay_giao_dich: this.dataValid(tblData[i]),
          ngay_he_thong: this.dataValid(tblData[i + 1]),
          noi_giao_dich: this.dataValid(tblData[i + 2]),
          so_tien: Number(so_tien_sk.toString().replace(/[^0-9.-]+/g,"")).toFixed(0),
          type: "",
          page: tblData[i].page,
        }
        if(tblData[i + 4] != undefined && tblData[i + 4] != null && tblData[i + 4].T != undefined && "CR" == tblData[i + 4].T.trim()){
          item.type = "CR";
          i++;
        }
        newTable.push(item);
      }
      

      console.log("newTable", newTable);
      return newTable;
    },
    parseJsonDataBankVIB(response){
      let newTable = [];
      let data = response.data.body.Pages; //Texts
      let tblDataVIB = [];
      let flagStart = false;
      let isStartPage = false;
      let flagEnd = false;
      // let iEnd = 
      let isStop = false;
      let idxStartLoadGrid = 0;

      for(let page = 0; page < data.length; page++){
        if(!isStop){
          for(let i = 0; i < data[page].Texts.length; i ++) {
            if(!isStop){
              const textLine = data[page].Texts;
              // console.log(`textLine[${page}][${i}]`, textLine[i]);
              if(textLine != undefined && textLine[i] != "undefined" && textLine[i].R != undefined){
                try{
                  for(let j = 0; j < textLine[i].R.length; j ++){
                    if(!isStop){
                      
                      const text = textLine[i].R[j].T.toString().trim();
                      // if(!isStartPage && "Page" == textLine[i].R[j].T.toString().trim()){
                      //   isStartPage = true;
                      //   // i = i + 1;
                      // }

                      // if("ab" == textLin].R[j].T.toString().trim()){
                      //   isStartPage = false;
                      //   flagStart = false;
                      //   // i = i + 1;
                      // }
                      // console.log( textLine[i].R[j].T.toString().trim());
                      if("Quý khách vui lòng đọc trang tiếp theo để xem chi tiết về cách đọc và hiểu Bảng Sao Kê và hướng dẫn cách thức thanh toán thẻ tín dụng." == text){
                        isStop = true;
                      } 
                        
                      if(!flagStart && "Ngày giao dịch" == text){
                        flagStart = true;
                        // if(page == 0){
                        //   i = i + 14;

                        // } else {
                          // if( i + this.saokeObject.startNumber < textLine[i].R.length ){
                          //   i = i + this.saokeObject.startNumber; //	ACCOUNT BALANCE AS IN LAST STATEMENT
                          // }
                        // }
                        // i = i + 1;
                      }
                      if(flagStart){
                        // textLine[i].R[j].start = `Page-${page + 1}`;
                        textLine[i].R[j].page =  page;
                        if(textLine[i] != undefined && textLine[i].R != undefined){
                          let value = textLine[i].R[j].T;
                          let obj = {
                            value: value,
                            page: textLine[i].R[j].page
                          }
                          if(value.includes("000000000435688-L_Thanh toan the lien ngan hang-")){
                            console.log("value", value);
                            obj.value = `${textLine[i].R[j].T}${textLine[i + 1].R[j].T}`;
                            i++;
                          }
                          tblDataVIB.push(obj);
                          if(value.includes("526887xxxxxx9944")){
                            idxStartLoadGrid = tblDataVIB.length;
                          }

                        }
                        
                      }
                    }
                  }
                } catch(error){
                  console.log(error);
                }
              }
            }
          }
        }
      }
      tblDataVIB = this.processRawData('vib', tblDataVIB);
      console.log("tblDataVIB", tblDataVIB);
      this.saokeObject.startNumber = idxStartLoadGrid;
      // parseInt(this.saokeObject.startNumber)
      for(var i = idxStartLoadGrid; i < tblDataVIB.length - parseInt(this.saokeObject.subEnd); i = i+3){
        
        if(tblDataVIB[i] != undefined && tblDataVIB[i] != null  && tblDataVIB[i + 1] != undefined && tblDataVIB[i + 1] != null
        && tblDataVIB[i + 2] != undefined && tblDataVIB[i + 2] != null ){
          let so_tien_sk = this.dataValid2(tblDataVIB[i + 2]);
          let so_tien = so_tien_sk.value;
          let type = "";
          if(so_tien_sk != undefined && so_tien_sk != null && so_tien_sk != ""){
            let arr = so_tien_sk.value.trim().toString().split(" ");
            if(arr != undefined && arr.length == 2){
              so_tien = arr[0];
              type = arr[1];
            }
          }
            
          let item = {
            ngay_giao_dich: this.dataValid2(tblDataVIB[i].value),
            ngay_he_thong: this.dataValid2(tblDataVIB[i].value),
            noi_giao_dich: this.dataValid2(tblDataVIB[i + 1].value),
            so_tien:Number(so_tien.toString().replace(/[^0-9.-]+/g,"")).toFixed(0),
            type: type,
            // page: tblDataVIB[i].page,
          }
          // if(tblDataVIB[i + 4] != undefined && tblDataVIB[i + 4] != null && tblDataVIB[i + 4].T != undefined && "CR" == tblDataVIB[i + 4].T.trim()){
          //   item.type = "CR";
          //   i++;
          // }
          newTable.push(item);
        }
      }
      
      return newTable;
    },
    processRawData(bank, data){
      let regexRemove = ['Vietnam International Bank', 'www.vib.com.vn'];
      let newArr =[...data];
      if('vib' == bank){
        let isRemove = false;
        for(let i = 0; i < newArr.length; i ++){
          isRemove = false;
          let item = newArr[i];
          for(let j = 0; j < regexRemove.length; j++){
            if(item.value.trim().includes(regexRemove[j].trim())){
              isRemove = true;
            }
          }
          if(isRemove){
            newArr.splice(i, 1)
          }
        }
      }
      return newArr;
    },
    selectionChanged(params){
      this.rowSelected = params;
      console.log('a');
    }
    //End
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
.difference-sk
{
      background: #FFC0CB;
}
.difference-nd {
   background: #FFF5EE
}
</style>
