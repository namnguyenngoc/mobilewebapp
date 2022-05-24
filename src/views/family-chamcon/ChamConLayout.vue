<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          <v-col cols="10" md="10" class="pa-0 ma-0">
            CHĂM CON LAYOUT
          </v-col>
          <v-col cols="12" md="12" class="pa-0 ma-0 text-right">
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
        
          <!-- Row 1 -->
          <v-col cols="12" md="12">
            <grid-layout
              :layout="layout"
              :col-num="layoutSize.col_num"
              :row-height="30"
              :is-draggable="false"
              :is-resizable="false"
              :vertical-compact="true"
              :margin="[5, 5]"
              :use-css-transforms="true"
            >

              <grid-item v-for="item in layout" :key="item.i"
                  :x="item.x"
                  :y="item.y"
                  :w="item.w"
                  :h="item.h"
                  :i="item.i"
                  :object="item.object">
                  <v-row>
                    <v-col cols="12" class="mt-2 pb-0 mb-0">
                      {{item.object.ngay_group}}
                    </v-col>
                    <v-col cols="12" class="mt-0 pt-0">
                      {{item.object.ten_cong_viec}}
                    </v-col>
                  </v-row>
              </grid-item>
            </grid-layout>
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
    <v-col cols="12">
      <ChamConListDialog
        ref="chamConListDialog"
        :title="titleList"
        :date="dateList"
        :item="chamConItem"
        :v-model="chamConListDialog"
        @refeshList="showChartKCBS()"
      />
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
import ChamConListDialog from './ChamConListDialog.vue'
import VueGridLayout from 'vue-grid-layout';

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
    chamConDetail,
    ChamConListDialog,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  data() {
    return {
      loadingInstance: null,
      chamConListDialog: false,
      
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
      rowSelected: [],
      titleList: "",
      dateList: "",
      layoutSize: {
        col_num: 12,
      },
      layout: [
        // https://github.com/jbaysolutions/vue-grid-layout
        // {"x":0,"y":0,"w":2,"h":2,"i":"H2"},
        // {"x":2,"y":0,"w":2,"h":2,"i":"H4"},
        // {"x":4,"y":0,"w":2,"h":2,"i":"2"},
        // {"x":6,"y":0,"w":2,"h":2,"i":"3"},
        // {"x":8,"y":0,"w":2,"h":2,"i":"4"},
        // {"x":10,"y":0,"w":2,"h":2,"i":"5"},
        // {"x":0,"y":5,"w":2,"h":2,"i":"6"},
        // {"x":2,"y":5,"w":2,"h":2,"i":"7"},
        // {"x":4,"y":5,"w":2,"h":2,"i":"8"},
        // {"x":6,"y":4,"w":2,"h":2,"i":"9"},
        // {"x":8,"y":4,"w":2,"h":2,"i":"10"},
        // {"x":10,"y":10,"w":2,"h":2,"i":"5"},
      ]
    }
  },
  created() {
    if(this.isMobile()){
      this.layoutSize.col_num = 1;
    }
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
    isMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
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
          let x = 0;
          let y = 0;
          let ifor = 0;
          for(let i = 0; i < unique.length; i ++){
            let arr = data.filter(function(item){
              if(item.ngay_group == unique[i]) return true;
            });
            for(let j = 0; j < arr.length; j ++){
              let item = {
                "x":x,
                "y":y,
                "w":2,
                "h":2,
                "i": ifor++,
                "object": arr[j]
              };
              self.layout.push(item);
              
              x += 2;
             
            }            
            // self.tblDataCongViec.push({
            //   // mode: "span",
            //   ngay_group:  moment(unique[i]).format(config.DATE_FM),
            //   total: 0,
            //   children: arr, 
            // });
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
    async onRowDoubleClick(params) {
    // params.row - row object 
    // params.pageIndex - index of this row on the current page.
    // params.selected - if selection is enabled this argument 
    // indicates selected or not
    // params.event - click event
      this.rowSelected = [];
      let self = this;
      console.log('row', params.row);
      this.rowSelected =  params.row;
      this.chamConItem = {
        ma_cv: params.row.ma_cv,
        gio_bat_dau:  moment(params.row.ngay_group).format(config.DATE_TIME_FULL_FM),
        status: params.row.status,
        working_time: params.row.working_time,
        the_tich_sua: params.row.the_tich_sua,
        item_time_lbl: params.row.ma_cv == 'BSB_UONG' ? `${params.row.the_tich_sua} ml` : `${Math.floor(params.row.working_time / 60) } giờ ${(Math.floor(params.row.working_time / 60)) % 24} phút`,
        row_item: params.row,
      }
      // this.chamConTitle = `${params.row.ten_cong_viec} ngày ${moment(params.row.ngay_thuc_hien).format(config.DATE_TIME_FM)}`;
      this.titleList = params.row.ten_cong_viec;
      this.dateList = moment(params.row.ngay_group).format(config.DATE_FM);
      await axios
      .get(`${config.API_URL}/selectCongViecByDate/'${self.chamConItem.ma_cv}'/${moment(self.chamConItem.gio_bat_dau).format(config.DATE_FM)}`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        let arr = [];
        let total = 0;
        for(let i = 0; i < data.length; i ++){
          data[i].item_time_lbl = data[i].ma_cv == 'BSB_UONG' ? `${data[i].the_tich_sua} ml` : `${Math.floor(data[i].working_time / 60) } giờ ${data[i].working_time % 60} phút`;
          total += data[i].ma_cv == 'BSB_UONG' ? data[i].the_tich_sua : data[i].working_time;
          arr.push(data[i]);
           console.log('data[i]', data[i]);
        }
        self.chamConItem = {
          tblDataCongViec: arr,
         
        }
        self.$refs.chamConListDialog.total  =  params.row.ma_cv == 'BSB_UONG' ? `${total} ml` : `${Math.floor(total / 60) } giờ ${total % 60} phút`;
        self.$refs.chamConListDialog.dialog = true;
        
        // self.tblDataCongViec = data;
        console.log('item-data', data);
      });
      
//  moment.tz(new Date(), tzString).format("YYYY-MM-DD HH:mm:ss"),
      // this.$refs.chamConDetail.dialog = true;
    },
    openDetail(ngay){
      console.log('ngày', ngay);
      this.$refs.chamConListDialog.dialog = true;
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
  
  .cssTransforms{
    background: #ff0000;
  }
</style>
