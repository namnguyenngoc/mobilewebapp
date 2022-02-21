<template>
    <!-- <v-card-title class="pb-0">
      ChiTieuHeadlines
    </v-card-title> -->
    <!-- Theo doi suc khoe -->

      <v-col cols="12" md="12" class="ma-1 ml-0">
        <v-col cols="12" md="12" class="pa-0 ma-0 text-right">
          <v-card>
            <v-card-title class="pt-5 pb-2">
              <v-col cols="12" md="12" class="ma-0 text-right pt-4 pb-0 mb-0">
                <v-slider
                  inverse-label
                  label="Số tháng"
                  v-model="sliderSK"
                  :thumb-size="24"
                  thumb-label="always"
                  max="15"
                  min="1"
                  class="pt-0 pb-0 mb-0"
                  hide-details
                  @change="changeSliderSK()"
                >
                  <template v-slot:thumb-label="{ value }">
                    {{ value }}
                  </template>
                </v-slider>
              </v-col>
              
            </v-card-title>
            <v-card-text class="ma-0 pa-0">
              <v-row class="ma-0 pa-0">
                <v-col cols="12" md="12" class="pa-0 ma-0 text-right">
                  <apexchart type="bar" :options="chartChiTieu" :series="serialsChiTieu" ref="refchartChiTieu" ></apexchart>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="12" class="pa-0 ma-0 text-right mt-5">
          <apexchart type="bar" :options="chartTraGop" :series="serialsTraGop" ref="refChartTraGop" ></apexchart>
        </v-col>
      </v-col>
      
    <!-- CHART-->
    
</template>
<script>
import axios from 'axios'
import config from '../../config/config'
import moment from 'moment'

import { mdiMinus, mdiOneUp, mdiPlus, mdiDeleteOutline, mdiCircleEditOutline, mdiSleep, mdiConsoleNetworkOutline } from '@mdi/js'
import { reactive } from '@vue/composition-api'

export default {
  name: 'ChiTieuGiaDinh',
  components: {},
  data() {
    return {
      //Chart 2 end
      thong_tin_suc_khoe:{
        dialogCN: false,
        ho_ten: 'NGUYỄN ĐĂNG KHÔI',
        nam_sinh: '30/11/2021',
        ngay_bat_dau: moment().format('YYYY-MM-DD HH:mm'),
        muc_tieu: 8,
        can_nang: 0,
        chieu_cao: 0,
        can_nang_bo: 0,
        can_nang_total: 0,
        muc_dich: 'KTSKDK',
        spo2: 0,
        valid: true,
        chart_type_x: 'NGAY', 
      },
      emptyRules: {
        text:   [v => !!v || "Item is required"],
        select: [(v) => !!v || "Item is required"],
        can_nang: [(v) =>  v > 0 || "Cân nặng phải lón hơn 0"],
        chieu_cao: [(v) =>  v > 0 || "Chiều cao lón hơn 0"],
      },

      chartChiTieu: {
        ...this.chartChiTieu,
        ...{
          chart: {
            height: 150,
            width: "100%",
            type: 'bar',
            stacked: true,
            show: false
          },
          dataLabels: {
            enabled: true,
            style: {
                colors: ['#ff0000',"#0000ff"]
              },
          },
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          stroke: {
            // curve: 'smooth'
          },
          title: {
            style: {
              color: '#FFFFFF',
              fontFamily: 'roboto',
              fontSize: '18pt',
            },
            text: 'Thống kê chi tiêu',
          },
          xaxis: {
            type: 'string',
            categories: [],
            lines: {
                show: true
            },
          },
          yaxis: {
            categories: [],
            labels: {
              formatter: function (val) {
                const val2 = (val / 1000).toFixed(0).replace(',', '.')
                return val2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'K'
              },
              hideOverlappingLabels: true,
            },
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true
            },
          },
          tooltip: {
            fixed: {
              enabled: true,
              position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
              offsetY: 30,
              offsetX: 60,
            },
          },
          legend: {
            horizontalAlign: 'right',
            position: 'top',
            
          },
          grid: {
            padding: {
              left: 13.5,
              right: 0
            },
            xaxis: {
                lines: {
                    show: true
                }
            }, 
           
          },
          markers: {
            size: 3
          },
          plotOptions: {
            bar: {
              dataLabels: {
                maxItems: 2,
                position: 'auto'
              }
            }
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [0,1,2],
            formatter: function(value, { seriesIndex, dataPointIndex, w}) {
              let indices = w.config.series.map((item, i) => i);
              console.log("seriesIndex", seriesIndex);
              console.log("dataPointIndex", dataPointIndex);
              console.log("w", w);
              indices = indices.filter(i => !w.globals.collapsedSeriesIndices.includes(i) 
                && _.get(w.config.series, `${i}.data.${dataPointIndex}`) > 0);
              console.log("indices", indices);
              if (seriesIndex == _.max(indices)){
                const totalFm = (w.globals.stackedSeriesTotals[dataPointIndex] / 1).toFixed(0).replace(',', '.');
                return totalFm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

              }
              return '';
            },
           
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: ['#304758'],
            },
          },
        }
      },
      serialsChiTieu:[],
      sliderSK: 5,
      countDownValue:[],
      itemsTotal: [],

      chartTraGop: {
        ...this.chartraGop,
        ...{
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ['#fff'],
          },
          title: {
            style: {
              color: '#FFFFFF',
              fontFamily: 'roboto',
              fontSize: '18pt',
            },
            text: 'Tiến độ trả góp',
          },
          xaxis: {
            categories: [],
            labels: {
              formatter: function (val) {
                return val + ' kỳ'
              },
            },
          },
          yaxis: {
            title: {
              text: undefined,
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + ' kỳ'
              },
            },
          },
          
          fill: {
            opacity: 1,
            // colors: ['#4caf50', '#E91E63']
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetX: 40,
          },
          dataLabels: {
            enabled: true,
            textAnchor: 'middle',
            enabledOnSeries: [0,1,2,3],
            formatter: function(value, { seriesIndex, dataPointIndex, w}) {
              let indices = w.config.series.map((item, i) => i);
              indices = indices.filter(i => !w.globals.collapsedSeriesIndices.includes(i) 
                && _.get(w.config.series, `${i}.data.${dataPointIndex}`) > 0);
              console.log("indices", indices);
              const totalFm = (w.globals.stackedSeriesTotals[dataPointIndex] / 1).toFixed(0).replace(',', '.');
              if (seriesIndex == _.max(indices)){
                return Math.round((value / totalFm)*100) + "%";

              }
              return value;
            },
            // offsetY: -20,
            style: {
              fontSize: '12px',
              colors: ['#000000'],
            },
            
          },
        }
      },
      serialsTraGop:[],
    }
  },
  async created() {
    this.getCurrentDate()
    await this.loadingChartChiTieu();
    await this.loadingChartTraGop();
     
  },
  mounted() {
   
    // this.loadingChart();
  },
  computed: {
    //   ...bankState("bank", {
    //     bankList: "bankList",
    // })
    isNgu() {
      // let nextTime = this.ngu_model.timeNgu1Org;
      // let currentDate = new Date();
      // let status = true;
      console.log('cong_viec_model', this.ngu_model)
      // status = moment(currentDate).isAfter(moment(nextTime));
      if (this.ngu_model != undefined && this.ngu_model != null) {
        if (
          this.ngu_model.id != undefined &&
          this.ngu_model.status != undefined &&
          this.ngu_model.status == 'T'
        ) {
          return true
        }
      }
      return false
    },
    wcCountDay() {
      return 1000;
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
    async getCurrentDate() {
      const self = this

      await axios.get(`${config.API_URL}/getCurrentDate/2021-11-30`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.tuan_tuoi = response.data.data[0].ngay_bat_dau_group
      })
    },

    async countWorkInDay() {
      const self = this

      await axios.get(`${config.API_URL}/countWorkInDay/WC/now()`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.be_wc_model.so_lan_i = response.data.data[0]._count
      })
    },
    
    async loadingChartChiTieu() {
      const self = this;
      this.serialsChiTieu = [];
      this.serialsChiTieu = []
      this.serialsChiTieu = [];
      while (self.chartChiTieu.xaxis.categories.length) {
        self.chartChiTieu.xaxis.categories.pop();
      }
      await axios
        .get(`${config.API_FAMILY}/api/totalChiTieu`)
        .then(function (response) {
          self.itemsTotal = response.data.data;
        // console.log("totalChiTieuChitietAS");
        // console.log(self.itemsTotal)
        })
      await axios
        .get(`${config.API_FAMILY}/api/getChiTieuByStatus/DN`)
        .then(function (response) {
          var data = response.data.data;
          console.log('data-DN', data);
          let hsbcData = [];
          let vibData = [];
          let scBankData = [];
          let serialSet = new Set();
          for (var idx in data) {
            // if(idx <= self.sliderSK){
              serialSet.add(data[idx].ky_chi);

            // }
          }

          //Set lable
          console.log("------------Set lable----------------");
          console.log("data", data);
          console.log("serialSet", serialSet);
          let limit = 1;
          for(let ser of serialSet){
            if(limit <= self.sliderSK){
              self.chartChiTieu.xaxis.categories.push(ser);
              let ctOfMonth = data.filter(function(item) { 
                return item.ky_chi === ser; 
              });
              let objHSBC = ctOfMonth.find(({bank_code}) => bank_code == 'HSBC');
              if(objHSBC != undefined && objHSBC != null){
                hsbcData.push(objHSBC.total);
              }else{
                hsbcData.push(0);
              }

              let objVIB = ctOfMonth.find(({bank_code}) => bank_code == 'VIB');
              if(objVIB != undefined && objVIB != null){
                vibData.push(objVIB.total);
              }else{
                vibData.push(0);
              }

              let objSCBANK = ctOfMonth.find(({bank_code}) => bank_code == 'SC BANK');
              if(objSCBANK != undefined && objSCBANK != null){
                  scBankData.push(objSCBANK.total);
              }
              else{
                scBankData.push(0);
              }
              // console.log(ser, ctOfMonth);
              limit ++;
            }
          }
          console.log("------------Set lable----------------");
          console.log('data-HSBC', hsbcData);
          let tong_gop;
          let tong_bank = [];
          tong_gop = self.itemsTotal.filter(function (item) {
            if (item.datetype == 'tong_tra_gop') return true;
          })
          if(tong_bank != undefined && tong_bank.length > 0){
            tong_gop = tong_bank[0].items.filter(function(item) {
              if (item.title.includes("Tổng nợ góp")) return true;
            });
          }
          console.log('tong_gop');
          // console.log(self.itemsTotal);
          // console.log(tong_gop[0].total);

          let maxlen = hsbcData.length;
          if(vibData.length > maxlen){
            maxlen = vibData.length;
          }
          if(scBankData.length > maxlen){
            maxlen = scBankData.length;
          }
          let flagLbl = 0;
          if(maxlen == hsbcData.length){
            for(let i = vibData.length; i < maxlen; i++){
              vibData.push(0);
            }
            for(let i = scBankData.length; i < maxlen; i++){
              scBankData.push(0);
            }
            flagLbl = 0;

          }else if(maxlen == vibData.length){
            for(let i = hsbcData.length; i < maxlen; i++){
              vibData.push(0);
            }
            for(let i = scBankData.length; i < maxlen; i++){
              scBankData.push(0);
            }
            flagLbl = 1;
          }else{
            for(let i = vibData.length; i < maxlen; i++){
              vibData.push(0);
            }
            for(let i = hsbcData.length; i < maxlen; i++){
              hsbcData.push(0);
            }
            flagLbl = 2;
          }

          let dataHSBC = {
            name: 'HSBC',
            data: hsbcData,
          };
          let dataVIB = {
            name: 'VIB',
            data: vibData,
          };
          let dataSCBANK = {
            name: 'SC Bank',
            data: scBankData,
          };
          // self.chartChiTieu.xaxis.categories.push(data[idx].ky_chi);
          console.log('serialSet', serialSet);
          
          self.serialsChiTieu.push(dataSCBANK);
          self.serialsChiTieu.push(dataVIB);
          self.serialsChiTieu.push(dataHSBC);
          // self.serialsChiTieu.push(dataCol2);
          // self.chartChiTieu.dataLabels.enabledOnSeries.push(0);
          // self.chartChiTieu.dataLabels.enabledOnSeries.push(1);
          // self.chartChiTieu.dataLabels.enabledOnSeries.push(2);

          // self.dailySalesChart.data.labels = seriLabel;
          // self.dailySalesChart.data.serialsChiTieu.push(self.series);
          console.log(self.chartChiTieu);
          console.log("self.serialsChiTieu", self.serialsChiTieu);
          // self.showLastLabel();
          // setTimeout(() => {
          //   self.addAnnotations(config);
          // });
        })
      // this.$forceUpdate();
    },
    async changeSlider() {
      console.log('changeSlider', this.slider)
      await this.loadingChart()
    },
    async changeSliderSK() {
      console.log('changeSlider', this.sliderSK)
      await this.loadingChartChiTieu()
    },

    async loadingChartTraGop () {
        const self = this;
        await axios
          .get(config.API_FAMILY + '/api/getListTraGop')
          .then(function (response) {
            let tra_gop = response.data.data
            if (tra_gop != undefined && tra_gop.length > 0) {
              const tra_gop_arr = tra_gop
              const tra_gop_processing = []
              const da_tra_arr = []
              const con_lai_arr = []
              for (var idx in tra_gop_arr) {
                const item = tra_gop_arr[idx]
                if (item.trang_thai.trim() != 'KT') {
                  tra_gop_processing.push(item)
                  self.chartTraGop.xaxis.categories.push(item.san_pham)
                  da_tra_arr.push(parseInt(item._ky_da_tra))
                  con_lai_arr.push(parseInt(item._ky_con_lai))
                }
              }

              console.log('tra_gop_arr')
              console.log(self.serialsTraGop)
              //  categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
              // xaxis: {
              // categories: [],
              // self.traGopOptions.xaxis.categories = [2008, 2009, 2010, 2011, 2012, 2013, 2014];
              self.serialsTraGop.push({
                name: 'Số kỳ đã trả',
                data: da_tra_arr,
              })
              self.serialsTraGop.push({
                name: 'Số kỳ còn lại',
                data: con_lai_arr,
              })
            } // End tra gop
          })
        
      },

    
  },
}
</script>
<style lang="scss" scoped>
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
</style>
