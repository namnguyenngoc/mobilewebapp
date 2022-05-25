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
        <v-card-text class="mt-0 mb-0 pt-1 pb-1 ma-0 pa-0">
          <!-- Row 1 -->
          <div class="layout-ls">
            <grid-layout
              :responsive-layouts="layout"
              :layout.sync="layout"
              :col-num="layoutSize.col_num"
              :row-height="50"
              :is-draggable="true"
              :is-resizable="true"
              :vertical-compact="true"
              :responsive="true"
              :margin="[10, 10]"
              :use-css-transforms="true"
              @breakpoint-changed="breakpointChangedEvent"
            >
                <grid-item v-for="item in layout" :key="item.i"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    :object="item.object">
                    <v-col cols="12" sm="12" class="ma-0 pa-0 pl-1 pr-1 mt-1 ml-1">
                      <h4>{{item.object.ngay.split(",")[0]}}</h4>
                    </v-col>
                    <v-col cols="12" sm="12" class="ma-0 pa-0 pl-1 pr-1 mt-1 ml-1" v-for="item2 in item.object.item" :key="item2.ma_cv">
                      <div>{{item2.ten_cong_viec}}: {{'BSB_UONG' == item2.ma_cv ? `${item2.the_tich_sua}ml` : `${Math.floor(item2.working_time / 60) } giờ ${item2.working_time % 60} phút`}}</div>
                    </v-col>
                </grid-item>
              </grid-layout>
            </div>
          </v-card-text>
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
// import { GridLayout } from 'vue-grid-layout';
// import { GridItem } from 'vue-grid-layout';

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
        // {"x":0,"y":0,"w":2,"h":2,"i":"1"},
        // {"x":2,"y":0,"w":2,"h":2,"i":"2"},
        // {"x":4,"y":0,"w":2,"h":2,"i":"3"},
        // {"x":6,"y":0,"w":2,"h":2,"i":"4"},
        // {"x":8,"y":0,"w":2,"h":2,"i":"5"},
        // {"x":10,"y":0,"w":2,"h":2,"i":"6"},
        // {"x":0,"y":5,"w":2,"h":2,"i":"7"},
        // {"x":2,"y":5,"w":2,"h":2,"i":"8"},
        // {"x":4,"y":5,"w":2,"h":2,"i":"9"},
        // {"x":6,"y":4,"w":2,"h":2,"i":"11"},
        // {"x":8,"y":4,"w":2,"h":2,"i":"12"},
        // {"x":10,"y":10,"w":2,"h":2,"i":"13"},
      ],
      lsCongViec: [],
      is_Mobile: false,
    }
  },
  async created() {
    this.is_Mobile = this.isMobile();
    await this.loadData();
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
        let arrA = [];
        if(undefined != unique){
          let x = 0;
          let k = 0;
          let ifor = 0;
          let yIndex = 0;
          let obj = {};
          let item2 = {};
          
          for(let i = 0; i < unique.length; i ++){
            let arr = data.filter(function(item){
              if(item.ngay_group == unique[i]) return true;
            });
           
            obj = {};
            item2 = {
                "x": self.is_Mobile ? 0 : i % 6 * 2,
                // "x": i % 6 * 2,
                "y": k,
                "w":2,
                "h":2,
                "i": ifor++,
                "object": {
                  ngay: moment(unique[i]).format(config.DATE_TIME_FM_1),
                  item: arr,
                }
              };

            console.log(item2, item2);
              arrA.push(item2);
            self.layout.push(item2);
            if(i % 6 * 2 == 10){
              k ++;
            }    
           
          }
        }
        console.log(`self.arrA`, arrA.toString());

        
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
    },
    breakpointChangedEvent: function(newBreakpoint, newLayout){
        console.log("BREAKPOINT CHANGED breakpoint=", newBreakpoint, ", layout: ", newLayout );
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
    border: 1px solid;
    border-radius: 5px;
  }
  .theme--dark .cssTransforms{
    // background: #E6E6FA;
    
    border-color: rgba(231, 227, 252, 0.14) !important
  }
  .theme--light .cssTransforms{
    background: #E6E6FA;
    border-color: #dcdcdc !important
  }

  // .layout-ls{
  //   width:100%;
  //   margin-top: 10px;
  //   height:700px;
  //   min-height:100px;
  //   max-height: 700px;
  //   overflow: auto; 
  // }


  // .vue-grid-layout {
  //   background: #312d4b;
  // }
  // .vue-grid-item:not(.vue-grid-placeholder) {
  //     background:#312d4b;
  //     border: 1px solid black;
  // }
  // .vue-grid-item .resizing {
  //     opacity: 0.9;
  // }
  // .vue-grid-item .static {
  //     background: #cce;
  // }
  // .vue-grid-item .text {
  //     font-size: 24px;
  //     text-align: center;
  //     position: absolute;
  //     top: 0;
  //     bottom: 0;
  //     left: 0;
  //     right: 0;
  //     margin: auto;
  //     height: 100%;
  //     width: 100%;
  // }
  // .vue-grid-item .no-drag {
  //     height: 100%;
  //     width: 100%;
  // }
  // .vue-grid-item .minMax {
  //     font-size: 12px;
  // }
  // .vue-grid-item .add {
  //     cursor: pointer;
  // }
  // .vue-draggable-handle {
  //     position: absolute;
  //     width: 20px;
  //     height: 20px;
  //     top: 0;
  //     left: 0;
  //     background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
  //     background-position: bottom right;
  //     padding: 0 8px 8px 0;
  //     background-repeat: no-repeat;
  //     background-origin: content-box;
  //     box-sizing: border-box;
  //     cursor: pointer;
  // }
</style>
