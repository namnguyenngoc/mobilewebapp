<template>
  <v-dialog 
        v-model="dialog" 
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
        default:'Chart'
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
                    title: {
                      text: 'Thời gian (giờ)',
                      style: {
                        color: '#00E396',
                      },
                    },
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
    },
    computed: {
      propsChartComponent: function(item) {
        return item;
      }
    },
    methods: {
      // open(title, message, data, chartTotalOptions, options) {
      //   this.title = title;
      //   this.message = message;
      //   this.seriesTotal = data;
      //    this.dialog = true;
      //   // this.chartTotalOptions = chartTotalOptions;
      //   this.options = Object.assign(this.options, options);
      //   return new Promise((resolve, reject) => {
      //     this.resolve = resolve;
      //     this.reject = reject;
      //   });
      // },
      // agree() {
      //   this.resolve(true);
      //   this.dialog = false;
      // },
      // cancel() {
      //   this.resolve(false);
      //   this.dialog = false;
      // },
      // reload(){
      //   this.seriesTotal = [];
      // }
  }
}
</script>

<style lang="scss" scoped>
</style>
