<template>
  <v-col cols="12" class="ma-0 pa-0">
    
    <v-col cols="12" class="ma-0 pa-0">
      <v-card height="100%">
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
          <v-col md="12" sm="12" class="pa-0 ma-0">
            <v-row class="full-width mb-0 mt-1"> 
              <v-col md="4" sm="4" xs="12" class="mb-0 mt-0 pb-0 pt-1 bold" @click="openDetail()"><h3>Đăng Khôi</h3></v-col>
              <v-col md="8" sm="8" xs="12" class="mb-0 mt-0 pb-0 pt-0 text-right">{{ tuan_tuoi.date }}</v-col>
            </v-row>
          </v-col>
          
        </v-card-title>
        <v-card-text class="mt-0 mb-0 pt-1 pb-0 ma-0 pa-0" height="100%">
          <!-- Row 1 -->
          <v-col cols="12" class="mb-0 pb-0">
            <v-btn-toggle v-model="toggle_exclusive">
              <v-btn
                @click="preDate()"
                :disabled="disabledPreDate"
                >
                <v-icon>
                  {{ icons.mdiArrowLeft }}
                </v-icon>
              </v-btn>
              <v-menu
                ref="startMenu"
                :close-on-content-click="false"
                :return-value.sync="lstDetail.date"
                offset-yaxi
                class="new_calendar"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="lstDetail.date"
                    :prepend-icon="icons.mdiCalendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    dense
                    class="new_calendar"
                    hide-details
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="itemMonitoring.condition.vmodelStart"
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
                    @click="$refs.startMenu.save(itemMonitoring.condition.vmodelStart)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-btn
                @click="nextDate()"
                :disabled="itemMonitoring.slider.model == undefined || itemMonitoring.slider.model <= 0">
                <v-icon>
                  {{ icons.mdiArrowRight }}
                </v-icon>
              </v-btn>

              <v-btn color="success" @click="today()">
                TODAY
              </v-btn>
            </v-btn-toggle>
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
                      v-model="sinhhoat.selectedModel"
                      :item="item.object"
                      @loadItemDetail="loadItemDetail(item.object.ma_cv)"
                      @openPopup="openpopup(item.object.ma_cv, item.object)"
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
      <SinhHoatAddDialog
        ref="SinhHoatAddDialog"
        :item="congviec"
        @refesh="loadingData()"
      />

      <DialogHoatDong
        ref="dialogHoatDong"
        :v-model="dialogHoatDong"
        :item = "nguThucModal"
        @updateStatusBtn="updateNgu()"
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
import SinhHoatAddDialog from './SinhHoatAddDialog.vue'
import VueGridLayout from 'vue-grid-layout';
import DialogHoatDong from './DialogHoatDong.vue'


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
  mdiMagnifyMinusOutline,
  mdiArrowLeft,
  mdiArrowRight ,
  mdiCalendar
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
    itemList,
    SinhHoatAddDialog,
    DialogHoatDong
  },
  data() {
    return {
      loadingInstance: null,
      chamConListDialog: false,
      tuan_tuoi: {dialog:false},
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
        mdiMagnifyMinusOutline,
        mdiArrowLeft,
        mdiArrowRight ,
        mdiCalendar
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

        },
        condition: {
          startDate: moment().subtract(0, 'month').format(config.DATE_FM),
          endDate:  moment().subtract(0, 'days').format(config.DATE_FM),
          vmodeldate: null,
        }
      },
      toggle_exclusive: [1,2,3],
      ti_me_model: {
        ti_binh_gan_nhat: '',
        timeTiBinh: null,
        menuTiBinh: false,
        modalTiBinh: false,
        timeTiBinh1: null,
        timeTiBinh1Org: null,
        menuTiBinh1: false,
        modalTiBinh1: false,
        the_tich_sua: '',
        the_tich_sua_new: '',
        loai_sua: 'BSB',
        isEditTimeTiBinh: false
      },
      tichSuaType: [
        {
          code: 'BSB_UONG',
          name: 'Uống sữa'
        },
        {
          code: 'BSB_HUT',
          name: 'Tích sữa'
        },
        {
          code: 'BENH',
          name: 'Bệnh'
        }
      ],
      cuSuaModel: {
        title: 'Uống sữa',
        ma_cv: 'BSB_UONG', //
        gio_thuc_hien: moment(new Date()).format('HH:mm:ss'),
        ngay_thuc_hien: moment(new Date()).format("YYYY-MM-DD"),
        gio_bat_dau: new Date(),
        the_tich_sua: 0,
        the_tich_sua_new: 100,
        ghi_chu_them: 'Sữa mẹ',
        showTheTich: true,
      },
      emptyRules: {
        text:   [v => !!v || "Item is required"],
        select: [(v) => !!v || "Item is required"],
        can_nang: [(v) =>  v > 0 || "Cân nặng phải lón hơn 0"],
        chieu_cao: [(v) =>  v > 0 || "Chiều cao lón hơn 0"],
      },
      congviec: {
        title: 'Uống sữa',
        ma_cv: 'BSB_UONG', //
        gio_thuc_hien: moment(new Date()).format('HH:mm:ss'),
        ngay_thuc_hien: moment(new Date()).format("YYYY-MM-DD"),
        gio_bat_dau: new Date(),
        the_tich_sua: 0,
        the_tich_sua_new: 100,
        ghi_chu_them: 'Sữa mẹ',
        showTheTich: true,
      },
      sinhhoat: {
        selectedModel: {
          title: 'Uống sữa',
          ma_cv: 'BSB_UONG', //
          gio_thuc_hien: moment(new Date()).format('HH:mm:ss'),
          ngay_thuc_hien: moment(new Date()).format("YYYY-MM-DD"),
          gio_bat_dau: new Date(),
          the_tich_sua: 0,
          the_tich_sua_new: 100,
          ghi_chu_them: 'Sữa mẹ',
          showTheTich: true,
        }
      },
      dialogHoatDong: false,
      nguThucModal: {
        name: 'Ngủ',
        code: 'T',
        orgDate: new Date(),
        lastTime: moment(new Date()).format(config.DATE_TIME_FM_1)
      },
      layout_key: 0,
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
    await this.getCurrentDate();
  },
  computed: {
    disabledPreDate() {
    //   if(this.itemMonitoring.slider.min <= this.itemMonitoring.slider.model){
    //     return false;
    //   }
    //  return false;
    },
    disabledNextDate (){
      console.log("disabledNextDate", this.itemMonitoring.slider.model);
      if(this.itemMonitoring.slider.model == undefined || this.itemMonitoring.slider.model <= 0){
        return true;
      }
      return false;
    },
    
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
            "i": this.layout_key++,
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
      let self = this;
      this.lstDetail = {
        title:"DETAIL",
        date: moment().subtract(this.itemMonitoring.slider.model, 'day').format(config.DATE_FM),
        item: {},
        vmodel:true,
      };
      let object = {};
      let sum = 0;
      console.log('loadListDetail', type);
      await axios
        .get(`${config.API_URL}/selectCongViecByDate/'${type}'/${this.lstDetail.date}`)
        .then(response => {
          // seft.hotSettings.data = response.data.data;
          let data = response.data.data;
          console.log('data[i]', data);
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
              
            } 
            if(type == 'BSB_UONG') {
                object = {
                title: `${this.tichSuaType.find(({ code }) => code == type).name} - ${this.calcWorkingTime(data[0])}`,
                ma_cv: data.length == 0 ? type : data[0].ma_cv,
                total: `${data[0].the_tich_sua}ml / ${sum}`,
                total_lbl:  data[0].item_time_lbl,
                type: "",
                last_time: moment(data[0].gio_bat_dau).format(config.DATE_TIME_FM_1)
              }
            } else {
              if(type == 'NGU') {
                object = {
                  title: type,
                  ma_cv:  data.length == 0 ? type : data[0].ma_cv,
                  lastWorking: data[0].status, 
                  total: sum,
                  total_lbl:  data[0].item_time_lbl,
                  type: "",
                  working_time_lbl: (data[0].ma_cv == 'NGU' && data[0].status == 'T') ? `${Math.floor(data[0].working_time / 60) } giờ ${(Math.floor(data[0].working_time % 60))} phút` :  self.calcWorkingTime(data[0]),
                  last_time: moment(data[0].gio_bat_dau).format(config.DATE_TIME_FM_1)
                }
              } else{
                object = {
                  title: type,
                  ma_cv:  data.length == 0 ? type : data[0].ma_cv,
                  lastWorking: data[0].status, 
                  total: sum,
                  total_lbl:  data[0].item_time_lbl,
                  so_lan: (arr == undefined || arr == null) ? 0 : arr.length,
                  type: "",
                  last_time: moment(data[0].gio_bat_dau).format(config.DATE_TIME_FM_1)
                }
              }
            }
          } else {
             object = {
                title: type,
                ma_cv: type,
                total: 0,
                total_lbl:  "",
                lastWorking: 0,
                working_time_lbl: "",
                type: "",
                so_lan: 0,
                last_time: moment().format(config.DATE_TIME_FM_1)
              }
          }
          
        });
      
      return object;
      
    },

    nextDate() {
      this.itemMonitoring.slider.model = this.itemMonitoring.slider.model - 1;
      this.loadingData();
       console.log('itemMonitoring.slider.model', this.itemMonitoring.slider.model);

    },
    preDate(){
      this.itemMonitoring.slider.model = this.itemMonitoring.slider.model + 1;
      this.loadingData();
      console.log('itemMonitoring.slider.model', this.itemMonitoring.slider.model);
    },

    today() {
      this.itemMonitoring.slider.model = 0;
      this.loadingData();

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
     async getCurrentDate() {
      const self = this

      await axios.get(`${config.API_URL}/getCurrentDate/2021-11-30`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.tuan_tuoi.value = response.data.data[0].ngay_bat_dau_group;
        let dateString = response.data.data[0].group_date;
        if(undefined != dateString && parseInt(dateString.split(" ")[0]) > 0){
          self.tuan_tuoi.date = response.data.data[0].group_date;
        } else{
          self.tuan_tuoi.date = (response.data.data[0].group_date).replace("0 năm", "");
        }
        
      })
    },

    async openpopup(ma_cv, item) {
      console.log('MA_CV', ma_cv);
      const self = this;
      let code_cv = ma_cv;
      let currentDate = new Date();
      let gio_bat_dau = moment(currentDate).format('YYYY-MM-DD');
      let thong_tin_them = '';
      let congviec = null;
      this.showTheTich = true;
      switch (code_cv) {
        case 'NGU':
          // var timeAndDate = moment(gio_bat_dau + ' ' + self.ngu_model.timeNgu);
          // if(!self.ngu_model.isEditTimeNgu){
          //   gio_bat_dau =  moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
          // } else {
          //   gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          // }
          // congviec = {
          //   ma_cv: code_cv,
          //   gio_bat_dau: gio_bat_dau,
          //   the_tich_sua: this.ti_me_model.the_tich_sua_new[0],
          //   thong_tin_them: thong_tin_them,
          // }
          // await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
          //   await self.updateBtn()
          // })

          this.nguProcess('OPEN', item);

          break;
        case 'BSB_HUT':
         
          this.cuSuaModel.title = "Tích sữa";
          this.cuSuaModel.ma_cv = 'BSB_HUT';
          this.cuSuaModel.showTheTich = true;
          this.dialogSua = true;

          break;
        case 'BSB_UONG':
          // var timeAndDate = moment(gio_bat_dau + ' ' + self.ti_me_model.timeTiBinh);
          // this.cuSuaModel.ma_cv = 'BSB_UONG';
          // this.cuSuaModel.title = "Uống sữa";
          // this.cuSuaModel.showTheTich = true;
          // this.dialogSua = true;
          this.$refs.SinhHoatAddDialog.dialog = true;

          break;
          case 'BENH':
          this.showTheTich = false;
          var timeAndDate = moment(gio_bat_dau + ' ' + self.ti_me_model.timeTiBinh);
          this.cuSuaModel.ma_cv = 'BENH';
          this.cuSuaModel.title = "GHI CHÚ BỆNH";
          this.cuSuaModel.showTheTich = false;
          this.dialogSua = true;

          break;
        case 'BSB_UONG_SAVE':
          console.log('BSB_UONG_SAVE', this.sinhhoat);
          var timeAndDate = moment(gio_bat_dau + ' ' + self.ti_me_model.timeTiBinh);
          gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          this.congviec = {
            ten_cv: this.tichSuaType.find(({ code }) => code == this.cuSuaModel.ma_cv).name,
            ma_cv: this.cuSuaModel.ma_cv,
            gio_bat_dau: moment(`${this.cuSuaModel.ngay_thuc_hien} ${this.cuSuaModel.gio_thuc_hien}`),
            the_tich_sua: this.cuSuaModel.the_tich_sua_new,
            thong_tin_them: this.cuSuaModel.ghi_chu_them,
            
          }


          // await axios.post(config.API_URL + '/insertChamCon', this.congviec).then(async function (response) {
           
          //   self.$refs.chamConListDialog.dialog = false;
          //    await self.loadingData();
          // })
          
          // this.cuSuaModel.gio_bat_dau = gio_bat_dau;
          // this.cuSuaModel.the_tich_sua = the_tich_sua;

          break;
        case 'WC':
          self.dialogWC = true;
          break;
        case 'WC_INFO':
           congviec = {
            ma_cv: this.be_wc_model.hinhthuc_wc,
            gio_bat_dau: moment(`${this.be_wc_model.ngay_thuc_hien} ${this.be_wc_model.gio_thuc_hien}`),
            the_tich_sua: this.ti_me_model.the_tich_sua_new,
            thong_tin_them:  this.be_wc_model.ghi_chu_them,
            ten_cv:  this.wcItem.find(({ code }) => code == this.be_wc_model.hinhthuc_wc).name,
          }
          await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
            self.dialogWC = false;
            self.loadingChartSK();
            self.countWorkInDay();
            await self.updateBtn();
          })
          break;
        case 'CN':
          self.thong_tin_suc_khoe.dialogCN = true;
          self.loadingChartSK();
          break;
        case 'THUC':
          // console.log('THUC');
          this.$refs.dialogHoatDong.dialog = true;
          break;

        default:
          gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          break;
      }

      

      if('WC' != code_cv){
       
      }
      
      this.$forceUpdate()
      // self.nguCountDown.circles  = 3;
    },
    async nguProcess(type, item) {
      console.log('Current status:', item);
      // this.loadNguThuc();
      if(item.lastWorking  == 'N'){
          // this.$refs.dialogHoatDong.modal.duration = 100000;
          this.$refs.dialogHoatDong.modal.loaiHoatDong = {
            name: 'Thức',
            code: 'THUC',
          };
          var durationTM = moment.duration(moment(new Date()).diff(moment(item.gio_bat_dau)));
          //  let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
          let value =  Math.floor((durationTM._milliseconds / (1000 * 60)));
          this.$refs.dialogHoatDong.modal.duration = value;
          this.$refs.dialogHoatDong.modal.durationStr = `${ Math.floor(value / 60) } giờ ${ (value % 60)} phút`
      }
      if('OPEN' == type){
        this.$refs.dialogHoatDong.dialog = true;

      }
    },
    calcWorkingTime(item){
      console.log('calcWorkingTime', item);
      var durationTM = moment.duration(moment(new Date()).diff(moment(item.gio_bat_dau)));
      let value =  Math.floor((durationTM._milliseconds / (1000 * 60)));
      let durationStr = `${ Math.floor(value / 60) } giờ ${ (value % 60)} phút`
      return durationStr;
    }

    // async loadNguThuc(){
    //   let self = this;
    //   console.log('cron');
    //   await axios.get(`${config.API_URL}/getGioBatDauByCV/NGU/COUNT_DOWN`).then(response => {
    //     // seft.hotSettings.data = response.data.data;
    //     let data = response.data.data;
    //     // var durationTM = moment.duration(moment(gio_bat_dau).diff(moment(data[0].gio_bat_dau)));
    //     //  let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
    //     console.log('data_THUC', data);
    //     console.log('data.gio_bat_dau', moment(data[0].gio_bat_dau));
    //     // console.log('gio_bat_dau', moment(gio_bat_dau));
    //     // console.log('durationTM', durationTM);
    //     // console.log('durationTM', durationTM._milliseconds);
    //     self.nguThucModal.name = data[0].status  == 'N' ? 'Thức' : 'Ngủ';
    //     self.nguThucModal.ten_cv = data[0].ten_cv;
    //     self.nguThucModal.data = data[0];
    //     self.nguThucModal.code = data[0].status;
    //     self.nguThucModal.orgDate = data[0].gio_bat_dau;
    //     self.nguThucModal.lastTime = moment(data[0].gio_bat_dau).format(config.DATE_TIME_FM_1);
        
    //     // self.modal.duration = Math.floor((durationTM._milliseconds / (1000 * 60)));
    //   })
    // },

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

  .new_calendar.v-input.v-text-field{
    border: 1px solid !important;
    border-color: rgba(231, 227, 252, 0.14) !important;
    height: 38px !important;
    border-radius: 0px 0px 0 0 !important;
    margin-top: 0px;
    background: #312d4b
   

  }

  .new-calendar > .v-input__control > 
  .new_calendar .v-text-field__slot, .new_calendar > .v-input__slot{
    height: 38px !important;
     text-align:center
  }

  .new_calendar > .v-input__slot::before, new_calendar > .v-input__slot::after{
    
  }

  .new_calendar.v-text-field > .v-input__control > .v-input__slot:before, 
  .new_calendar.v-text-field > .v-input__control > .v-input__slot:after{
    border: 0px none !important;
    bottom: 0px;
    text-align:center
  }

 .new_calendar.v-text-field > .v-input__control > .v-input__slot input{
   text-align:center;
   vertical-align: middle;
   line-height: 38px;
 }
 .new_calendar > .v-input__prepend-outer{
   display:none
 }
</style>
