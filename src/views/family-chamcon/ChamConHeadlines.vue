<template>
  <v-card>
    <v-card-title class="pb-0">Chăm sóc Đăng Khôi</v-card-title>
    <v-row class="ma-0 pb-0">
      <v-col
        cols="12"
        sm="12"
        class="ma-0 pb-0"
        style="color:#FFFFFF"
      >
      <h5 color="warning" class="pa-1 pt-2 pb-2">Hôm nay: {{ tuan_tuoi }}</h5>
      </v-col>
    </v-row>
    <v-row class="ma-0 pb-0">
      <v-col cols="6" md="6" class="pl-3 pt-2 mt-1 pb-0 mb-0" >
        <v-btn color="success" @click="insert('BSB')" style="width:100%" class="mb-4"> Ti bình </v-btn>
       
        <circular-count-down-timer
          :circles="tibinhCountDown.circles"
          :interval="tibinhCountDown.interval"
          :main-circle-id="tibinhCountDown.mainCircleId || '1'"
          :size="tibinhCountDown.size"
          :container-classes="tibinhCountDown.containerClasses"
          :circle-classes="tibinhCountDown.circleClasses"
          :stop-conditions="tibinhCountDown.stopConditions"
          :trigger-update="tibinhCountDown.triggerUpdate"
          :stroke-width="tibinhCountDown.strokeWidth"
          :stroke-color="tibinhCountDown.strokeColor"
          :underneath-stroke-color="tibinhCountDown.underneathStrokeColor"
          :fill-color="tibinhCountDown.fillColor"
          :value-font-size="tibinhCountDown.valueFontSize"
          :label-font-size="tibinhCountDown.labelFontSize"
          :label-position="tibinhCountDown.labelPosition"
        />
         <v-text-field
            v-model="ti_me_model.thong_tin_them_new"
            label="Thể tích"
            type="number"
            class="mb-4 mt-1"
            suffix="ml"
          ></v-text-field>
      </v-col>
      <v-col cols="6" md="6" class="pt-2 pb-0 mb-0" >
        <v-dialog
        ref="dialog"
        v-model="ti_me_model.modalTiBinh"
        :return-value.sync="ti_me_model.timeTiBinh"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="ti_me_model.timeTiBinh"
              label="Lần ti bình gần nhất"
              class="text-right"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="ti_me_model.modalTiBinh"
            v-model="ti_me_model.timeTiBinh"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="ti_me_model.modalTiBinh = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(ti_me_model.timeTiBinh)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-dialog
          ref="dialog"
          v-model="ti_me_model.modalTiBinh1"
          :return-value.sync="ti_me_model.timeTiBinh1"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="ti_me_model.timeTiBinh1"
              label="Lần ti kế tiếp"
              class="text-right"
              readonly
              v-bind="attrs"
              v-on="on"
              
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="ti_me_model.modalTiBinh1"
            v-model="ti_me_model.timeTiBinh1"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="ti_me_model.modalTiBinh1 = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(ti_me_model.timeTiBinh1)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-text-field
          v-model="ti_me_model.thong_tin_them"
          label="Thể tích lần trước"
          class="text-right"
          readonly
          suffix="ml"
          text-align="right"
        ></v-text-field>
      </v-col>
      <!-- <v-col cols="12" md="12" class="pl-3 pt-2 pb-0 mb-0" >
        <v-btn color="warning" @click="insert('BSM')" style="width:100%"> Ti mẹ {{ti_me_gan_nhat}}</v-btn>
      </v-col> -->
      <v-col cols="6" md="6" class="pl-3 pt-2 mt-1 pb-0 mb-4" >
        <v-row class="mb-4">
          <v-col cols="6" s="6" class="pl-3" >
            <v-btn color="warning" @click="insert('NGU')" style="width:100%" :disabled="!isNgu"> NGỦ</v-btn>
          </v-col>
          <v-col cols="6" ssm="6" class="" >
            <v-btn color="success" @click="update('NGU')" style="width:100%" :disabled="isNgu"> Thức</v-btn>
          </v-col>
        </v-row>
        <circular-count-down-timer
          :circles="nguCountDown.circles"
          :interval="nguCountDown.interval"
          :main-circle-id="nguCountDown.mainCircleId || '1'"
          :size="nguCountDown.size"
          :container-classes="nguCountDown.containerClasses"
          :circle-classes="nguCountDown.circleClasses"
          :stop-conditions="nguCountDown.stopConditions"
          :trigger-update="nguCountDown.triggerUpdate"
          :stroke-width="nguCountDown.strokeWidth"
          :stroke-color="nguCountDown.strokeColor"
          :underneath-stroke-color="nguCountDown.underneathStrokeColor"
          :fill-color="nguCountDown.fillColor"
          :value-font-size="nguCountDown.valueFontSize"
          :label-font-size="nguCountDown.labelFontSize"
          :label-position="nguCountDown.labelPosition"
        />
      </v-col>
      <v-col cols="6" md="6" class="pt-2 pb-0 mb-0" >
        <v-dialog
        ref="dialog"
        v-model="ngu_model.modalNgu"
        :return-value.sync="ngu_model.timeNgu"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="ngu_model.timeNgu"
              label="Ngủ"
              class="text-right"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modalNgu"
            v-model="ngu_model.timeNgu"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="ngu_model.modalNgu = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(ngu_model.timeNgu)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-dialog
          ref="dialog"
          v-model="ngu_model.modalNgu1"
          :return-value.sync="ngu_model.timeNgu1"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
              v-model="ngu_model.timeNgu1"
              label="Thức giấc"
              class="text-right"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="ngu_model.modalNgu1"
            v-model="ngu_model.timeNgu1"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="ngu_model.modalNgu1 = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(ngu_model.timeNgu1)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col>
      <!-- <v-col cols="12" md="12" class="pl-3 pt-2 mt-0 pb-0 mb-0" >
        <v-btn color="error" @click="insert('BET')" style="width:100%">Đi WC {{wc_gan_nhat}}</v-btn>
      </v-col>
     -->
    </v-row>
    <v-row class="ma-0 pb-0">
      <v-col
        cols="12"
        sm="12"
        class="pa-0 ma-0"
      >
        <v-col
          cols="12"
          sm="12"
        >
          <v-slider
            v-model="slider"
            :thumb-size="24"
            thumb-label="always"
            max="15"
            min="1"
            @change="changeSlider()"
          >
            <template v-slot:thumb-label="{ value }">
              {{ value }}
            </template>
          </v-slider>
        </v-col>
        <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import axios from 'axios';
import config from '../../config/config';
import moment from "moment";


import {
  mdiMinus,
  mdiOneUp,
  mdiPlus,
} from '@mdi/js';
import { reactive } from '@vue/composition-api';

export default {
  name: 'SucKhoe',
  components: {
  },
  data() {
    return {
      // satisfactionEmojis: [1,2,3],
      slider: 5,
      desserts: [],
      tuan_tuoi: '',
      ti_me_model: {
        ti_binh_gan_nhat: '',
        timeTiBinh: null,
        menuTiBinh: false,
        modalTiBinh: false,
        timeTiBinh1: null,
        timeTiBinh1Org: null,
        menuTiBinh1: false,
        modalTiBinh1: false,
        thong_tin_them: '',
        thong_tin_them_new: '',
        
      },
      ti_me_gan_nhat: '',
      wc_gan_nhat: '',

      ngu_gan_nhat: '',
      ti_binh_gan_nhat: '',
      timeTiBinh: null,
      menuTiBinh: false,
      modalTiBinh: false,
      timeTiBinh1: null,
      timeTiBinh1Org: null,
      menuTiBinh1: false,
      modalTiBinh1: false,
      
      ngu_model: {
        ngu_gan_nhat: '',
        timeNgu: null,
        menuNgu: false,
        modalNgu: false,
        timeNgu1: null,
        timeNgu1Org: null,
        menuNgu1: false,
        modalNgu1: false,
        id: null,
      },
      ngu_gan_nhat: '',
      timeNgu: null,
      menuNgu: false,
      modalNgu: false,
      timeNgu1: null,
      timeNgu1Org: null,
      menuNgu1: false,
      modalNgu1: false,

      holidays: [
        { holidayDate: '2021-09-02', description: 'Quoc Khanh' },
        { holidayDate: '2021-09-03', description: 'Quoc Khanh' },
      ],
      headers: [
        {
          text: 'Trương',
          value: 'huyet_ap_tam_truong',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Thu',
          value: 'huyet_ap_tam_thu',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Tim',
          value: 'nhip_tim',
          align: 'right',
          sortable: false,
        },
        {
          text: 'SPO2',
          value: 'spo2',
          align: 'right',
          sortable: false,
        },
        {
          text: 'CN (Kg)',
          value: 'can_nang',
          align: 'right',
          sortable: false,
        },
      ],
      icons: {
        mdiMinus,
        mdiPlus,
      },
      tibinhCountDown: {
          title: 'Ti bình đếm',
					circles: [
            
					]
				},
        nguCountDown: {
          title: 'Decremental counter',
					circles: [
            {
							id: '3',
							steps: 60,
							size: 50,
							value: 2,
							stepLength: -1,
							label: 'Giờ',
              strokeWidth: 10,
							strokeColor: '#008080',
							underneathStrokeColor: '#DCDCDC',
							valueFontSize: 20,
							labelFontSize: 10,
              fillColor: '#312d4b'
						},
						{
							id: '2',
							steps: 60,
							size: 50,
							value: 20,
							stepLength: -1,
							label: 'Phút',
              strokeColor: '#4169E1',
							underneathStrokeColor: '#DCDCDC',
              dependentCircles: [ '3' ],
              fillColor: '#312d4b'
						},
						{
							id: '1',
							steps: 60,
							size: 50,
							value: 10,
							stepLength: -1,
							label: 'Giây',
              strokeColor: '#C71585',
							underneathStrokeColor: '#DCDCDC',
							dependentCircles: [ '2' ],
              fillColor: '#312d4b'
						}
					]
				},
        cong_viec_model: {
          id: null,
        },
        //Chart start
        chartOptions: {
          chart: {
            height: 350,
            type: "line",
            stacked: false
          },
          dataLabels: {
            enabled: true,
            style: {
                colors: ['#ff0000']
            },
            position: 'bottom'
          },
          colors: ["#FF1654", "#247BA0"],
          stroke: {
            width: [2, 2]
          },
          plotOptions: {
            // bar: {
            //   columnWidth: "20%"
            // }
          },
          xaxis: {
            // categories: [1,2,3,4,5,6,7,8,9,10]
          },
          yaxis: [
            {
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: "#FF1654"
              },
              labels: {
                style: {
                  colors: "#FF1654"
                }
              },
              title: {
                text: "Thể tích sữa (ml)",
                style: {
                  color: "#FF1654"
                }
              }
            },
            {
              opposite: true,
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: "#247BA0"
              },
              labels: {
                style: {
                  colors: "#247BA0"
                }
              },
              title: {
                text: "Thời gian ngủ (phút)",
                style: {
                  color: "#247BA0"
                }
              }
            }
          ],
          tooltip: {
            shared: false,
            intersect: true,
            x: {
              show: true
            }
          },
          legend: {
            horizontalAlign: "left",
            offsetX: 40
          }
        },
        series: [
            // {
            //   name: "Số ml sữa",
            //   data: [10,20,30]
            // },
            // {
            //   name: "Thời gian ngủ",
            //   data: [14,22,45]
            // }
          ],
        //Chart end
    };
  },
  async created() {
    this.getCurrentDate();
    await this.loadingChart();
    const self = this;
    await this.updateBtn();

    

  },
  computed: {
      //   ...bankState("bank", {
      //     bankList: "bankList",
      // })
      isNgu () {
        // let nextTime = this.ngu_model.timeNgu1Org;
        // let currentDate = new Date();
        // let status = true;
        console.log("cong_viec_model", this.cong_viec_model);
        // status = moment(currentDate).isAfter(moment(nextTime));
        if(this.cong_viec_model != undefined && this.cong_viec_model != null){
          if(this.cong_viec_model.id != undefined
            && this.cong_viec_model.status != undefined
            && this.cong_viec_model.status == 'T'){
              return true;
          }
        }
        return false;
      },
    }, // end method
  methods: {
    formatPrice(value, tofix) {
      if (!value) {
        return '';
      }
      const val = (value / 1).toFixed(tofix).replace(',', '.');
      if (!val) {
        return '';
      }

      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    async getCurrentDate() {
      const self = this;
      
      await axios
        .get(`${config.API_URL}/getCurrentDate/2021-11-30`)
        .then(response => {
          // seft.hotSettings.data = response.data.data;
          
          self.tuan_tuoi = response.data.data[0].ngay_bat_dau_group;
        });
    },
    async getListSucKhoe() {
      const self = this;
      await axios
        .get(`${config.API_URL}/selectSucKhoe`)
        .then(response => {
          // seft.hotSettings.data = response.data.data;

          self.desserts = response.data.data;
          console.log('jiraBoards', response.data);
        });
    },

    async insert(ma_cv) {
      let currentDate = new Date();
      let gio_bat_dau = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");
      let congviec = {
        ma_cv : ma_cv,
        gio_bat_dau : gio_bat_dau,
        thong_tin_them: this.ti_me_model.thong_tin_them_new
      }
      const self = this;
      await axios
        .post(config.API_URL + '/insertChamCon', congviec)
        .then(async function (response) {
          await self.updateBtn();
          
         
        })
        this.$forceUpdate();
        // self.nguCountDown.circles  = 3;
    },
    async update(ma_cv) {
      let currentDate = moment();
      let start = moment(this.cong_viec_model.gio_bat_dau);
      let workingTime = currentDate.diff(start, "minutes");
      console.log('workingTime', workingTime + "m"); // "7m"

      let congviec = {
        id : this.cong_viec_model.id,
        ma_cv : ma_cv,
        status: 'T',
        working_time: workingTime,
      }

      console.log('ngu_model', this.cong_viec_model);
      const self = this;
      await axios
        .post(config.API_URL + '/updateChamCon', congviec)
        .then(async function (response) {
          // await axios
          //   .get(`${config.API_URL}/getGioBatDauByCV/${ma_cv}`)
          //   .then(response => {
          //     // seft.hotSettings.data = response.data.data;
          //     let data = response.data.data;
          //     self.ti_binh_gan_nhat = data[0].gio_bat_dau ;
          //     console.log('jiraBoards2', data);
          //   });
          // console.log("Gops", response.data);
          await self.updateBtn();
          
         
        })
        this.$forceUpdate();
        // self.nguCountDown.circles  = 3;
    },
    async updateBtn(){
      const self = this;
      await axios
      .get(`${config.API_URL}/getGioBatDauByCV/BSB`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.ti_me_model.ti_binh_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD h:mm:ss");
        self.ti_me_model.timeTiBinh = moment(data[0].gio_bat_dau).format("HH:mm");
        self.ti_me_model.timeTiBinh1 = moment(data[0].gio_ke_tiep).format("HH:mm");
        self.ti_me_model.timeTiBinh1Org = data[0].gio_ke_tiep;
        self.ti_me_model.thong_tin_them = data[0].thong_tin_them;
        self.ti_me_model.thong_tin_them_new = data[0].thong_tin_them;
        console.log('data[0].gio_bat_dau', moment(data[0].gio_bat_dau._i));
        self.cong_viec_model.id = data[0].id;
        self.cong_viec_model.ma_cv = data[0].ma_cv;
        self.cong_viec_model.status = data[0].status;
        self.cong_viec_model.gio_bat_dau = data[0].gio_bat_dau;
        self.cong_viec_model.gio_ke_tiep = data[0].gio_ke_tiep;
        
      });

      // await axios
      // .get(`${config.API_URL}/getGioBatDauByCV/BSM`)
      // .then(response => {
      //   // seft.hotSettings.data = response.data.data;
      //   let data = response.data.data;
      //   self.ti_me_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD HH:mm:ss");
      //   self.cong_viec_modle.id = data[0].id;
      //   console.log('jiraBoards2', data);
      // });

      // await axios
      // .get(`${config.API_URL}/getGioBatDauByCV/BET`)
      // .then(response => {
      //   // seft.hotSettings.data = response.data.data;
      //   let data = response.data.data;
      //   self.wc_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD HH:mm:ss");
      //   self.cong_viec_modle.id = data[0].id;
      //   console.log('jiraBoards2', data);
      // });
      await axios
      .get(`${config.API_URL}/getGioBatDauByCV/NGU`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.ngu_model.ngu_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD HH:mm:ss");
        self.ngu_model.timeNgu = moment(data[0].gio_bat_dau).format("HH:mm");
        self.ngu_model.timeNgu1 = moment(data[0].gio_ke_tiep).format("HH:mm");
        self.ngu_model.timeNgu1Org = data[0].gio_ke_tiep;
        self.cong_viec_model.id = data[0].id;
        self.cong_viec_model.ma_cv = data[0].ma_cv;
        self.cong_viec_model.status = data[0].status;
        self.cong_viec_model.gio_bat_dau = data[0].gio_bat_dau;
        self.cong_viec_model.gio_ke_tiep = data[0].gio_ke_tiep;
        
        // let current = moment();
        // let min7 = moment(data[0].gio_ke_tiep);
        // console.log('MIN', min7.diff(current, "minutes") + "m"); // "7m"
        // console.log('jiraBoards2', data);
      });

      //update count down
    let current = moment();

    /**Ti Binh */
    let min7 = moment(self.ti_me_model.timeTiBinh1Org);
    let hour = min7.diff(current, "hours");
    let min = min7.diff(current, "minutes");
    let second = min7.diff(current, "seconds");
    // self.tibinhCountDown.circles[1].value = min;
    console.log('MIN1', min7.diff(current, "minutes")); // "7m"
    self.tibinhCountDown.circles = [];
    self.tibinhCountDown.circles.push({
        id: '3',
        steps: 60,
        size: 50,
        value: hour,
        stepLength: -1,
        label: 'Giờ',
        strokeWidth: 7,
        labelFontSize: 12,
        fillColor: '#312d4b',
        strokeColor: '#008080',
        underneathStrokeColor: '#DCDCDC',
        valueFontSize: 20,
        labelFontSize: 12,
      }
    );

    self.tibinhCountDown.circles.push({
        id: '2',
        steps: 60,
        size: 50,
        value: min%60,
        stepLength: -1,
        strokeWidth: 7,
        labelFontSize: 12,
        fillColor: '#312d4b',
        label: 'Phút',
        strokeColor: '#4169E1',
        underneathStrokeColor: '#DCDCDC',
        dependentCircles: [ '3' ]
      },
    );
    self.tibinhCountDown.circles.push({
      id: '1',
      steps: 60,
      size: 50,
      value: 60,
      stepLength: -1,
      label: 'Giây',
      strokeWidth: 7,
      labelFontSize: 12,
      fillColor: '#312d4b',
      strokeColor: '#C71585',
      underneathStrokeColor: '#DCDCDC',
      dependentCircles: [ '2' ]
    })

    //End ti bin

    /** NGu */
    let timeCountNgu = moment(self.ngu_model.timeNgu1Org);
    var duration = moment.duration(timeCountNgu.diff(current));

    self.nguCountDown.circles = [];
    self.nguCountDown.circles.push({
        id: '3',
        steps: 60,
        size: 50,
        value: parseInt(duration.asHours()),
        stepLength: -1,
        label: 'Giờ',
        strokeWidth: 7,
        strokeColor: '#008080',
        underneathStrokeColor: '#DCDCDC',
        valueFontSize: 20,
        labelFontSize: 12,
        fillColor: '#312d4b'
      }
    );

    self.nguCountDown.circles.push({
        id: '2',
        steps: 60,
        size: 50,
        value: parseInt(duration.asMinutes())%60,
        stepLength: -1,
        strokeWidth: 7,
        labelFontSize: 12,
        label: 'Phút',
        strokeColor: '#4169E1',
        underneathStrokeColor: '#DCDCDC',
        dependentCircles: [ '3' ],
        fillColor: '#312d4b'
      },
    );
    self.nguCountDown.circles.push({
      id: '1',
      steps: 60,
      size: 50,
      value: 60,
      stepLength: -1,
      label: 'Giây',
      strokeColor: '#C71585',
      underneathStrokeColor: '#DCDCDC',
      dependentCircles: [ '2' ],
      strokeWidth: 7,
      labelFontSize: 12,
      fillColor: '#312d4b'
    })
    //End ngu

      
     
    },
    finished: () => {
        console.log('finished');
    },
    updated: (status) => {
        console.log(status);    //{"value": 144, "seconds": 24, "minutes": 2, "hours": 0}
    },

    async loadingChart() {
      const self = this;
      self.series = [];
      await axios
        .get(`${config.API_URL}/selectDataChart/${this.slider}`)
        .then(response => {
          console.log('response', response.data.chartData);
          let chartData = response.data.chartData;
          chartData.forEach(function (item) {
            item.type = 'line';
            self.series.push(item);
          });

          // {
          //     name: "Số ml sữa",
          //     data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
          //   },
          //   {
          //     name: "Thời gian ngủ",
          //     data: [20, 29, 37, 36, 44, 45, 50, 58]
          //   }
          console.log('selectDataChart', response.data);
        });
    },

    changeSlider(){
      console.log('changeSlider', this.slider);
      this.loadingChart();
    },

    
    
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
</style>
