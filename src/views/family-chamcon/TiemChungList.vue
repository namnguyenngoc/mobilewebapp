<template>
  <v-row class="match-height">
    <v-col>
      <v-card>
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          <v-col cols="10" md="10" class="pa-0 ma-0">
            Lịch tiêm chủng
          </v-col>
          <v-col cols="2" md="2" class="pa-0 ma-0 text-right">
            <v-btn
              color="info"
              icon
              @click="insert('TC')"
            >
              <v-icon>
                  {{ icons.mdiPlus }}
                </v-icon>
            </v-btn>
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
              max-height="700px"
            >
            <template slot="table-row" slot-scope="props">
              <div v-if="props.column.field == 'id'">
                <v-btn
                  :disabled="props.formattedRow['status'] !== null"
                  color="info"
                  icon
                  small
                  class="d-inline"
                >
                  <v-icon dark>
                    {{icons.mdiPencil}}
                  </v-icon>
                </v-btn>
                <v-btn
                  :color="props.formattedRow['status'] == null ? 'error': ''"
                  icon
                  small
                  class="d-inline"
                  :disabled="props.formattedRow['status'] !== null"
                  @click="update(props, 'TC', props.formattedRow['status'])"
                >
                  <v-icon>
                    {{props.formattedRow['status'] == null ? icons.mdiCheckAll : icons.mdiCheck}}
                  </v-icon>
                </v-btn>
                <v-btn
                  color="error"
                  icon
                  small
                  class="d-inline"
                >
                  <v-icon>
                    {{icons.mdiTrashCan}}
                  </v-icon>
                </v-btn>
                
              </div>
              <div v-else-if="props.column.field == 'thong_tin_them'">
                <pre>
                  {{ JSON.parse(props.formattedRow['thong_tin_them']) }}
                </pre>
              </div>
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
            <v-col cols="12">
            <chamConAdd
              ref="chamConAdd"
              :title="chamConTitle"
              :item="chamConItem"
              :v-model="chamConAddDialog"
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
import chamConAdd from "./ChamConAdd";

import {
  mdiMinus,
  mdiOneUp,
  mdiPlus,
  mdiDeleteOutline,
  mdiCircleEditOutline,
  mdiSleep,
  mdiReload,
  mdiCheckAll,
  mdiCheck,
  mdiPencil,
  mdiTrashCan
} from '@mdi/js';
import { reactive } from '@vue/composition-api';

export default {
  name: 'SucKhoe',
  components: {
    VueGoodTable,
    chamConDetail,
    chamConAdd
  },
  data() {
    return {
      loadingInstance: null,
      colCongViec: [
        // {
        //   label: 'Mã CV',
        //   field: 'ma_cv',
        //   filterable: true,
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Mã CV', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        // },
        {
          label: 'Tên mũi tiêm',
          field: 'ten_cv',
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
          label: 'Ngày tiêm',
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
              return value != null ? moment(value).format(config.DATE_FM) : null
          },
        },
        {
          label: 'Mũi tiếp theo',
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
              return value != null ? moment(value).format(config.DATE_FM) : null
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
          label: 'Action',
          field: 'id',
          width: '120px',
          filterable: true,
        },
        
      ],
      tblDataCongViec: [
      ],
      chamConTitle: '',
      chamConItem: {},
      chamConDetaillDialog: false,
      chamConAddDialog: false,
      icons: {
        mdiMinus,
        mdiOneUp,
        mdiPlus,
        mdiDeleteOutline,
        mdiCircleEditOutline,
        mdiSleep,
        mdiReload,
        mdiCheckAll,
        mdiCheck,
        mdiPencil,
        mdiTrashCan
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
      .get(`${config.API_URL}/getChamSocList/'TC'`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.tblDataCongViec = data;
        self.close();
      });
    },

    async update(item, maCv, currentStatus){
      if(item.row.status !== '' && item.row.status == 'DA TIEM'){
        return;
      }
      let self = this;
      let chamsocModal = {
        id : item.row.id,
        ma_cv : maCv,
        status: 'DA TIEM',
        working_time: "0"
      }
      await axios
        .post(config.API_URL + '/updateChamCon', chamsocModal)
        .then(async function (response) {
        
         self.loadData();
        })
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
    },
    async insert(maCV){
      this.$refs.chamConAdd.dialog = true;
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

  .theme--dark.v-btn.v-btn--disabled .v-icon, .theme--dark.v-btn.v-btn--disabled .v-btn__loading{
    color: #cccccc !important
  }
  pre {
    width: 10em;
    height: 1em;
    overflow: hidden;
    white-space: pre;
    text-overflow: ellipsis;
    background-color: lightgreen;
    border-radius: 8px;
    border: 2px solid #6c6;
    transition: width 1s ease;
  }
  pre:hover {
      width: 100%;
      height: auto;
      overflow: auto;
      text-overflow: clip;
  } 
</style>
