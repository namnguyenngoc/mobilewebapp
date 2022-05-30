<template>
  <v-col cols="12" class="ma-0 pa-0">
    
    <v-col cols="12" class="ma-0 pa-0">
      <v-card height="100%">
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          <v-col md="10" sm="10" class="pa-0 ma-0">
            ĐĂNG KHÔI
          </v-col>
          <v-col md="2" sm="2" class="pa-0 ma-0 text-right">
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
        <v-card-text class="mt-0 mb-0 pt-1 pb-1 ma-0 pa-0" height="100%">
          <!-- Row 1 -->
          <v-col cols="12" class="mt-0 pt-0 mb-0 pb-0">
            <v-subheader>Trước mấy ngày?</v-subheader>
            <v-slider
              inverse-label
              v-model="itemMonitoring.slider.model"
              :thumb-size="30"
              thumb-label="always"
              :max="itemMonitoring.slider.max"
              :min="itemMonitoring.slider.min"
              class="pt-0 pb-0 mb-0"
              :append-icon="icons.mdiMagnifyPlusOutline"
              :prepend-icon="icons.mdiMagnifyMinusOutline"
              @click:append="nextDate"
              @click:prepend="preDate"
            >
              <template v-slot:thumb-label="{ value }">
                {{ value }}
              </template>
            </v-slider>
          </v-col>
          <div class="layout-ls">
            <grid-layout
              :layout.sync="layout"
              :col-num="layoutSize.col_num"
              :row-height="68"
              :is-draggable="false"
              :is-resizable="false"
              :vertical-compact="true"
              :responsive="true"
              :margin="[10, 10]"
              :use-css-transforms="false"
              @breakpoint-changed="breakpointChangedEvent"
            >
                <grid-item v-for="item in layout" :key="item.i"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    :object="item.object">
                    <itemList 
                      :item="item.object"
                      @loadItemDetail="loadItemDetail(item.object.ma_cv)"
                      />
                    
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
        :title="lstDetail.title"
        :date="lstDetail.date"
        :item="lstDetail.item"
        :v-model="lstDetail.vmodel"
      />
    </v-col>
  </v-col>
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

import itemList from '../../layouts/components/family/itemList.vue'
// import { GridLayout } from 'vue-grid-layout';
// import { GridItem } from 'vue-grid-layout';

import {
  mdiMinus,
  mdiOneUp,
  mdiPlus,
  mdiDeleteOutline,
  mdiCircleEditOutline,
  mdiSleep,
  mdiReload,
  mdiMagnifyPlusOutline,
  mdiMagnifyMinusOutline
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
    itemList
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
        mdiReload,
        mdiMagnifyPlusOutline,
        mdiMagnifyMinusOutline
      },
      rowSelected: [],
      titleList: "",
      dateList: "",
      layoutSize: {
        col_num: 12,
      },
      layout: [
      ],
      lsCongViec: [],
      is_Mobile: false,
      lstDetail: {
        title:"DETAIL",
        date: moment(new Date()).format(config.DATE_FM),
        item: {},
        vmodel:true,
      },

      itemMonitoring: {
        deltaDate: 0,
        slider: {
          model: 0,
          max:30,
          min:0,

        }
      }

    }
  },
  async created() {
    this.loadingInstance = this.$veLoading({
        target: document.querySelector("#loading-container"),
        // 等同于
        // target:"#loading-container"
        name: "wave",
    });
    this.is_Mobile = this.isMobile();
    // await this.loadData();
    await this.loadingData();
  },
  computed: {
     
  }, // end method
  mounted() {
    // this.loadingInstance = this.$veLoading({
    //     target: document.querySelector("#loading-container"),
    //     // 等同于
    //     // target:"#loading-container"
    //     name: "wave",
    // });
    // this.show();
    this.loadingInstance.close();
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

    },
    show() {
       
    },
    close() {
        this.loadingInstance.close();
    },
    async onRowDoubleClick(params) {
      
    },
    openDetail(ngay){
      console.log('ngày', ngay);
      this.$refs.chamConListDialog.dialog = true;
    },
    breakpointChangedEvent: function(newBreakpoint, newLayout){
        console.log("BREAKPOINT CHANGED breakpoint=", newBreakpoint, ", layout: ", newLayout );
    },

    async loadingData(){
      //  this.loadingInstance.show();
      this.layout = [];
      let param = {
        ma_cv: 'WC',
        ho_ten: 'NGUYEN DANG KHOI',
        limit: this.sliderBS,
      }
      const self = this;
      let buSuaItem = null;
      let nguItem = null;
      let wcItem = null;

      // await axios.post(`${config.API_URL}/selectBuSua`, param)
      //   .then(async function (response){
          
      //     let arr = response.data.data;
      //     buSuaItem = arr[arr.length-1];
      //     console.log('Lasted-ITem', arr[arr.length-1]);

      // });

     

      buSuaItem =  await this.loadListDetail('BSB_UONG');
      nguItem = await this.loadListDetail('NGU');
      wcItem = await this.loadListDetail('WC');
      let arr = [];
      arr.push(buSuaItem);
      arr.push(nguItem);
      arr.push(wcItem);
      let k = 0;
      let ifor = 0;
      
      for(let i= 0; i < arr.length; i ++){
        const item2 = {
            "x": self.is_Mobile ? 0 : i % 6 * 2,
            "y": k,
            "w":2,
            "h":2,
            "i": ifor++,
            "object":  arr[i],
            "moved": false
          };
        console.log('item2', item2);
        self.layout.push(item2);
        if(i % 6 * 2 == 10){
          k ++;
        }   
        ////
      }
      

    },

    async loadListDetail(type) {
      this.lstDetail = {
        title:"DETAIL",
        date: moment().subtract(this.itemMonitoring.slider.model, 'day').format(config.DATE_FM),
        item: {},
        vmodel:true,
      };
      let object = {};
      let sum = 0;
      await axios
        .get(`${config.API_URL}/selectCongViecByDate/'${type}'/${this.lstDetail.date}`)
        .then(response => {
          // seft.hotSettings.data = response.data.data;
          let data = response.data.data;
          if(data != undefined && data.length > 0){
            let arr = [];
            for(let i = 0; i < data.length; i ++){
              data[i].item_time_lbl = data[i].ma_cv == type ? `${data[i].the_tich_sua} ml` : `${Math.floor(data[i].working_time / 60) } giờ ${(Math.floor(data[i].working_time / 60)) % 24} phút`;
              if(type == 'BSB_UONG') {
                sum += parseInt(data[i].the_tich_sua);
              } else {
                sum += parseInt(data[i].working_time);
              }
              arr.push(data[i]);
              console.log('data[i]', data[i]);
            }
            
            if(type == 'BSB_UONG') {
                object = {
                title: `${type} - ${data[0].the_tich_sua}ml`,
                ma_cv: data[0].ma_cv,
                total: sum,
                total_lbl:  data[0].item_time_lbl,
                type: "",
                last_time: moment(data[0].gio_bat_dau).format(config.DATE_TIME_FM_1)
              }
            } else {
              if(type == 'NGU') {
                object = {
                  title: type,
                  ma_cv: data[0].ma_cv,
                  lastWorking: data[0].status, 
                  total: sum,
                  total_lbl:  data[0].item_time_lbl,
                  type: "",
                  working_time_lbl: `${Math.floor(data[0].working_time / 60) } giờ ${(Math.floor(data[0].working_time / 60)) % 24} phút`,
                  last_time: moment(data[0].gio_bat_dau).format(config.DATE_TIME_FM_1)
                }
              } else{
                object = {
                  title: type,
                  ma_cv: data[0].ma_cv,
                  lastWorking: data[0].status, 
                  total: sum,
                  total_lbl:  data[0].item_time_lbl,
                  so_lan: (arr == undefined || arr == null) ? 0 : arr.length,
                  type: "",
                  last_time: moment(data[0].gio_bat_dau).format(config.DATE_TIME_FM_1)
                }
              }
            }
          }
          
        });
      
      return object;
      
    },

    nextDate() {
      this.itemMonitoring.slider.model = (this.itemMonitoring.slider.model + 1) || this.itemMonitoring.slider.max;
      if(this.itemMonitoring.slider.max >= this.itemMonitoring.slider.model){
        this.loadingData();

      }
      this.loadingData();

    },
    preDate(){
      this.itemMonitoring.slider.model = (this.itemMonitoring.slider.model - 1) || this.itemMonitoring.slider.min;
      if(this.itemMonitoring.slider.min <= this.itemMonitoring.slider.model){
        this.loadingData();

      }
    },

    async loadItemDetail(ma_cv) {
      console.log('loadListDetail');
      let self = this;
      await axios
        .get(`${config.API_URL}/selectCongViecByDate/'${ma_cv}'/${moment(this.lstDetail.date).format(config.DATE_FM)}`)
        .then(response => {
          // seft.hotSettings.data = response.data.data;
          let data = response.data.data;
          let arr = [];
          for(let i = 0; i < data.length; i ++){
            data[i].item_time_lbl = data[i].ma_cv == 'BSB_UONG' ? `${data[i].the_tich_sua} ml` : `${Math.floor(data[i].working_time / 60) } giờ ${(Math.floor(data[i].working_time / 60)) % 24} phút`;
            arr.push(data[i]);
            console.log('data[i]', data[i]);
          }
          self.lstDetail = {
            title: 'Uống sữa',
            date: moment(new Date()).format(config.DATE_FM),
            item: {
              tblDataCongViec: [
                {
                  children: arr,
                }
              ]
            },
            
          }
          self.$refs.chamConListDialog.dialog = true;
          
          // self.tblDataCongViec = data;
          console.log('item-data', data);
        });
        
      this.$refs.chamConListDialog.dialog = true;
    },
  }
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

  .layout-ls{
    width:100%;
    margin-top: 0px;
    height:100vh;
    min-height:100px;
    max-height: 100vh;
    overflow: auto; 
  }


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
