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
      <h5 color="warning" style="background:#fafafa;" class="pa-1 pt-2 pb-2">Hôm nay: {{ tuan_tuoi }}</h5>
      </v-col>
    </v-row>
    <v-row class="ma-0 pb-0">
      <v-col cols="6" md="6" class="pl-3 pt-2 mt-5 pb-0 mb-0" >
        <v-btn color="success" @click="insert('BSB')" style="width:100%"> Ti bình </v-btn>
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
      </v-col>
      <v-col cols="6" md="6" class="pt-2 pb-0 mb-0" >
        <v-dialog
        ref="dialog"
        v-model="modalTiBinh"
        :return-value.sync="timeTiBinh"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="timeTiBinh"
              label="Lần ti bình gần nhất"
              class="text-right"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modalTiBinh"
            v-model="timeTiBinh"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modalTiBinh = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(timeTiBinh)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-dialog
          ref="dialog"
          v-model="modalTiBinh1"
          :return-value.sync="timeTiBinh1"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="timeTiBinh1"
              label="Lần ti kế tiếp"
              class="text-right"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modalTiBinh1"
            v-model="timeTiBinh1"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modalTiBinh1 = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(timeTiBinh1)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col>
      <!-- <v-col cols="12" md="12" class="pl-3 pt-2 pb-0 mb-0" >
        <v-btn color="warning" @click="insert('BSM')" style="width:100%"> Ti mẹ {{ti_me_gan_nhat}}</v-btn>
      </v-col> -->
      <v-col cols="6" md="6" class="pl-3 pt-2 mt-5 pb-0 mb-0" >
        <v-btn color="warning" @click="insert('NGU')" style="width:100%"> NGỦ</v-btn>
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
        v-model="modalNgu"
        :return-value.sync="timeNgu"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="timeNgu"
              label="Lần ti bình gần nhất"
              class="text-right"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modalNgu"
            v-model="timeNgu"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modalNgu = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(timeNgu)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-dialog
          ref="dialog"
          v-model="modalNgu1"
          :return-value.sync="timeNgu1"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="timeNgu1"
              label="Lần ti kế tiếp"
              class="text-right"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modalNgu1"
            v-model="timeNgu1"
            full-width
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modalNgu1 = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(timeNgu1)"
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
    <!-- <v-row class="ma-0 pb-1 px-1">
      <v-col
        cols="12"
        sm="12"
      >
        <v-data-table
          :headers="headers"
          :items="desserts"
          class="list-table"
          height="650px"
          :fixed-header="true"
          :items-per-page="10"
          :mobile-breakpoint="0"
          group-by="ngay_bat_dau_group"
          group-desc
        >
          <template v-slot:group.header="{ group, items, isOpen, toggle }">
            <td colspan="5" class="mt-1 mb-1 pt-1 pb-1 custom-row">
              <v-btn icon @click="toggle" class="h-2">
                <v-icon v-if="isOpen" small>
                  {{ icons.mdiMinus }}
                </v-icon>
                <v-icon v-else small>
                  {{ icons.mdiPlus }}
                </v-icon>
              </v-btn>
              <span>{{ group }}</span>
            </td>
          </template>
          <template v-slot:item.can_nang="{ item }">
            <span>{{ formatPrice(item.can_nang/100,2) }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row> -->
  </v-card>
</template>
<script>
import axios from 'axios';
import config from '../../config/config';
import moment from "moment";


import {
  mdiMinus,
  mdiPlus,
} from '@mdi/js';

export default {
  name: 'SucKhoe',
  components: {
  },
  data() {
    return {
      desserts: [],
      tuan_tuoi: '',
      ti_binh_gan_nhat: '',
      ti_me_gan_nhat: '',
      wc_gan_nhat: '',
      ngu_gan_nhat: '',
      timeTiBinh: null,
      menuTiBinh: false,
      modalTiBinh: false,
      timeTiBinh1: null,
      timeTiBinh1Org: null,
      menuTiBinh1: false,
      modalTiBinh1: false,
      
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
          title: 'Decremental counter',
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
              dependentCircles: [ '3' ]
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
							dependentCircles: [ '2' ]
						}
					]
				},
    };
  },
  async created() {
    this.getCurrentDate();
    this.getListSucKhoe();
    const self = this;
    await this.updateBtn();
    

  },
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
      }
      const self = this;
      await axios
        .post(config.API_URL + '/insertChamCon', congviec)
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
        self.nguCountDown.circles  = 3;
    },
    async updateBtn(){
      const self = this;
      await axios
      .get(`${config.API_URL}/getGioBatDauByCV/BSB`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.ti_binh_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD h:mm:ss");
        self.timeTiBinh = moment(data[0].gio_bat_dau).format("HH:mm");
        self.timeTiBinh1 = moment(data[0].gio_ke_tiep).format("HH:mm");
        self.timeTiBinh1Org = data[0].gio_ke_tiep;
        console.log('data[0].gio_bat_dau', moment(data[0].gio_bat_dau._i));
      });

      await axios
      .get(`${config.API_URL}/getGioBatDauByCV/BSM`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.ti_me_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD HH:mm:ss");
        console.log('jiraBoards2', data);
      });

      await axios
      .get(`${config.API_URL}/getGioBatDauByCV/BET`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.wc_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD HH:mm:ss");
        console.log('jiraBoards2', data);
      });
      await axios
      .get(`${config.API_URL}/getGioBatDauByCV/NGU`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.ngu_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD HH:mm:ss");
        self.timeNgu = moment(data[0].gio_bat_dau).format("HH:mm");
        self.timeNgu1 = moment(data[0].gio_ke_tiep).format("HH:mm");
        self.timeNgu1Org = data[0].gio_ke_tiep;
        self.nguCountDown.circles[0].value = 50;

        let current = moment();
        let min7 = moment(data[0].gio_ke_tiep);
        console.log('MIN', min7.diff(current, "minutes") + "m"); // "7m"
        console.log('jiraBoards2', data);
      });

      //update count down
      let current = moment();

    /**Ti Binh */
    let min7 = moment(self.timeTiBinh1Org);
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
        strokeWidth: 10,
        strokeColor: '#008080',
        underneathStrokeColor: '#DCDCDC',
        valueFontSize: 20,
        labelFontSize: 10,
      }
    );

    self.tibinhCountDown.circles.push({
        id: '2',
        steps: 60,
        size: 50,
        value: min,
        stepLength: -1,
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
      strokeColor: '#C71585',
      underneathStrokeColor: '#DCDCDC',
      dependentCircles: [ '2' ]
    })

    //End ti bin

    /** NGu */
    let timeCountNgu = moment(self.timeNgu1Org);
    var duration = moment.duration(timeCountNgu.diff(current));

    self.nguCountDown.circles = [];
    self.nguCountDown.circles.push({
        id: '3',
        steps: 60,
        size: 50,
        value: parseInt(duration.asHours()),
        stepLength: -1,
        label: 'Giờ',
        strokeWidth: 10,
        strokeColor: '#008080',
        underneathStrokeColor: '#DCDCDC',
        valueFontSize: 20,
        labelFontSize: 10,
      }
    );

    self.nguCountDown.circles.push({
        id: '2',
        steps: 60,
        size: 50,
        value: parseInt(duration.asMinutes())%60,
        stepLength: -1,
        label: 'Phút',
        strokeColor: '#4169E1',
        underneathStrokeColor: '#DCDCDC',
        dependentCircles: [ '3' ]
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
      dependentCircles: [ '2' ]
    })
    //End ngu

      
     
    },
    finished: () => {
        console.log('finished');
    },
    updated: (status) => {
        console.log(status);    //{"value": 144, "seconds": 24, "minutes": 2, "hours": 0}
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
  // @import './Bebidas.scss';
</style>
