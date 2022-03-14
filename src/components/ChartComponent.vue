<template>
  <v-dialog 
        v-model="dialog" 
        fullscreen
        hide-overlay
        :max-width="options.width" 
        :style="{ zIndex: options.zIndex }" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark :color="options.color" dense flat>
        <v-toolbar-title class="text-body-2 font-weight-bold grey--text">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container class="pt-0 pb-0 mb-0 v-scroll">
          <v-col cols="12" md="12" class="ma-0 text-right pt-4 pb-0 mb-0">
            <v-slider
              inverse-label
              label="Số ngày hiển thị"
              v-model="slider"
              :thumb-size="24"
              thumb-label="always"
              max="15"
              min="1"
              class="pt-0 pb-0 mb-0"
              hide-details
              @change="showChartWC()"
            >
              <template v-slot:thumb-label="{ value }">
                {{ value }}
              </template>
            </v-slider>
          </v-col>
          <apexchart type="line" :options="chartTotalOptions" :series="seriesTotal" ref="totalChart" ></apexchart>
        </v-container>
      </v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn color="primary" class="body-2 font-weight-bold" outlined @click="dialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import config from '../config/config'
import axios from 'axios'
export default {
  layout: 'chartComponent',
  components: {},
    props: {
      options: {
        type: Object,
        default: () => ({
          color: "info",
          width: 800,
          zIndex: 200,
          noconfirm: false
        })
      },
      title: {
        type: String,
        default:'Chart theo dõi WC'
      },
      message: {
        type: String,
        default: null
      },
      dialog: {
        type: Boolean,
        default: false
      },
      resolve: {
        type: String,
        default: null
      },
      reject: {
        type: String,
        default: null
      },
      // seriesTotal: {
      //   type: Array,
      //   default:  [ ]
      // },
      
    },
    data () {
      return {
        slider: 5,
        seriesTotal: [],
        chartTotalOptions: {
          ...this.chartTotalOptions,
          ...{
              chart: {
                height: 350,
                type: 'column',
                stacked: false,
              },
              dataLabels: {
                enabled: true,
                labels: ['Apples', 'Oranges', 'Berries', 'Grapes']
              },
              stroke: {
                width: [1, 1, 1, 1],
              },
              title: {
              },
              xaxis: {
                categories: [],
                
              },
              yaxis: [
                  {
                    seriesName: 'GIO',
                    axisTicks: {
                      show: true,
                    },
                    axisBorder: {
                      show: true,
                      color: '#00E396',
                    },
                    labels: {
                      style: {
                        colors: '#FF0000',
                      },
                    },
                    // title: {
                    //   text: 'Thời gian (giờ)',
                    //   style: {
                    //     color: '#00E396',
                    //   },
                    // },
                    tooltip: {
                      enabled: true,
                    },
                },
              
              ],
              tooltip: {
                // fixed: {
                //   enabled: true,
                //   position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                //   offsetY: 30,
                //   offsetX: 60,
                // },
                y: {
                  formatter: function (val) {
                    return `${Math.floor(val / 24) } ngày ${val % 24} giờ`
                  },
                },
              },
              legend: {
                horizontalAlign: 'left',
                position: 'top',
                offsetX: 40,
              },
          },
        }
          
      }
    },
    mounted() {
      // this.reload();
      this.showChartWC();
    },

    computed: {
      propsChartComponent: function(item) {
        return item;
      }
    },
    created() {
      // this.reload();
      this.showChartWC();
    },

    methods: {
      async showChartWC(){
        const self = this;
        this.seriesTotal = [];
        let param = {
          ma_cv: 'WC',
          ho_ten: 'NGUYEN DANG KHOI',
          limit: this.slider,
        }
        await axios
          .post(`${config.API_URL}/selectKhoangThoiGianTheoCongViec`, param)
          .then(function (response){
            console.log('reponse', response);
            let arr = response.data.data;
            let dataChart = []  ;
            let categories = [];
            for(let i = 0; i < arr.length; i++){
              
              dataChart.push(Math.round(arr[i].thoi_gian_cho_hour));
              // dataChart.push(arr[i].thoi_gian_cho);
              // categories.push(arr[i].ngay_thuc_hien);
              self.chartTotalOptions.xaxis.categories.push(arr[i].ngay_thuc_hien);
            }
            
            
            self.seriesTotal.push({
              name: 'GIO',
              type: 'line',
              data: dataChart,
              enabled:true,
            });
            console.log('dataChart', dataChart);
            
      });
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
