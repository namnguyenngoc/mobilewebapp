<template>
  <v-row>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>GHI CHÚ HOẠT ĐỘNG</v-card-title>
        <v-card-text>
           <v-row class="pa-4">
            <v-col cols="4" md="4">
              <v-autocomplete
                label="Type"
                v-model="modal.loaiHoatDong"
                :items="loaiHoatDong"
                item-text="name"
                item-value="code"
                dense
                @change="getGioBatDau()"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="8" md="8" class="text-right">
              <v-icon dark @click="countWorkInDay2()">
                {{ icons.mdiHistory }}
              </v-icon>
              <span v-if="modal.response != undefined">
                <!-- <div class="counter">{{ counter }}</div> -->
               {{modal.loaiHoatDong}}: {{modal.response.gio_bat_dau}}

              </span>
            </v-col>
          </v-row>
           
          <v-col cols="12" md="12">
            <v-menu
              ref="menuDateTime"
              v-model="modal.menuDateTime"
              :close-on-content-click="false"
              :return-value.sync="modal.ngay_thuc_hien"
              transition="scale-transition"
              offset-y
              hide-details
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="modal.ngay_thuc_hien"
                  label="Ngày thực hiện"
                  prepend-icon="mdi-calendar"
                  class="text-right"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hide-details
                  required
                ></v-text-field>
              </template>
              <v-date-picker v-model="modal.ngay_thuc_hien" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal.menuDateTime = false"> Cancel </v-btn>
                <v-btn text color="primary" @click="$refs.menuDateTime.save(modal.ngay_thuc_hien)"> OK </v-btn>
              </v-date-picker>
            </v-menu>
            <v-dialog ref="dialogTimeWC" v-model="modalDateTime" :return-value.sync="time" persistent width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="modal.gio_thuc_hien"
                  label="Giờ"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker v-if="modalDateTime" v-model="modal.gio_thuc_hien" full-width>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalDateTime = false"> Cancel </v-btn>
                <v-btn text color="primary" @click="$refs.dialogTimeWC.save(time)"> OK </v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field label="Tổng thời gian" v-model="modal.duration" hide-details clearable></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field label="Ghi chú thêm" v-model="modal.ghi_chu_them" hide-details clearable></v-text-field>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="dialog = false"> Close </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="info" text @click="insert()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
import config from '../../config/config.js'
import moment from 'moment'

import {
  mdiMinus,
  mdiOneUp,
  mdiPlus,
  mdiDeleteOutline,
  mdiCircleEditOutline,
  mdiSleep,
  mdiConsoleNetworkOutline,
  mdiHistory,
} from '@mdi/js'

export default {
  layout: 'chamConDetail',
  // inheritAttrs: false,
  components: {},
  props: {
    title: {
      type: String,
      default: 'Test',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    // dialog: {
    //   type: Boolean,
    //   default: false
    // },
  },
  data() {
    return {
      dialog: false,
      emptyRules: {
        text:   [v => !!v || "Item is required"],
        select: [(v) => !!v || "Item is required"],
        can_nang: [(v) =>  v > 0 || "Cân nặng phải lón hơn 0"],
        chieu_cao: [(v) =>  v > 0 || "Chiều cao lón hơn 0"],
      },
      modalDateTime: false,
      // title: '',
      index: 1,
      itemChiTieu: {},
      menu2: false,
      model: {
        so_lan_uong: 0,
        so_lan_hut: 0,
        thoi_gian_gan_nhat_uong: new Date(),
        thoi_gian_gan_nhat_hut: new Date(),
        duration: null,
      },
      icons: {
        mdiMinus,
        mdiPlus,
        mdiDeleteOutline,
        mdiCircleEditOutline,
        mdiSleep,
        mdiHistory,
      },
      counter: 0,
      loaiHoatDong: [
          {
            name: 'WC',
            code: 'WC',
          },
          {
            name: 'THUC',
            code: 'THUC',
          },
          {
            name: 'Ngủ',
            code: 'NGU',
          },
        ],
      modal: {
        menuDateTime: false,
        loaiHoatDong:{
          name: 'NGU',
          code: 'NGU',
        },
        so_lan_i: 0,
        selectModel: 'BT',
        gio_thuc_hien: moment(new Date()).format('HH:mm:ss'),
        ngay_thuc_hien: moment(new Date()).format("YYYY-MM-DD"),
        items: [
          {
          code: 'BT',
          name: 'Bình thường'
          },
          {
          code: 'TC',
          name: 'Tiêu chảy'
          },
          {
          code: 'BN',
          name: 'Bón'
          },
          {
          code: 'KHAC',
          name: 'Tình trạng khác'
          },
          {
          code: 'NP',
          name: 'Đi nhiều'
          },
          ],
        ghi_chu_them: '',
        response: undefined,
        duration: 0,

      },
      congviecParam: {}
    }
  },
  computed: {
    propsChiTieu: function (item) {
      return item
    },
  },
  async mounted() {
    //  await this.countWorkInDay2();
  }, // end method
  created() {
    // this.countWorkInDay2();
    this.getGioBatDau();
  }, // end data
  methods: {
    countWorkInDay2() {
      let self = this

      axios.get(`${config.API_URL}/countWorkInDay/BSB_UONG/now()`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.model.so_lan_uong = response.data.data[0]._count
        self.model.thoi_gian_gan_nhat_uong = moment(response.data.data[0].ngay_thuc_hien_gan_nhat).format(
          config.DATE_TIME_FM_1,
        )
        self.model.the_tich_sua_uong = response.data.data[0].the_tich_sua
        self.model.sum_uong = response.data.data[0]._sum
        let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)))
        self.model.duration = `${duration._data.hours}h ${duration._data.minutes}m`
        console.log('duration', duration)
      })
      axios.get(`${config.API_URL}/countWorkInDay/BSB_HUT/now()`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.model.so_lan_hut = response.data.data[0]._count
        self.model.thoi_gian_gan_nhat_hut = moment(response.data.data[0].ngay_thuc_hien_gan_nhat).format(
          config.DATE_TIME_FM_1,
        )
        self.model.the_tich_sua_hut = response.data.data[0].the_tich_sua
        self.model.sum_hut = response.data.data[0]._sum
      })

      // console.log('countWorkInDay---cham con', this.model);
    },
    async getGioBatDau(){
      
      let loaiCongViec = this.modal.loaiHoatDong;
      let paramLoaiCV = typeof loaiCongViec === 'object' ? loaiCongViec.code.toString() : loaiCongViec;
      console.log('loaiCongViec', this.modal);
      let type = 'COUNT_DOWN';
      const  self = this;
      let gio_bat_dau = moment(`${this.modal.ngay_thuc_hien} ${this.modal.gio_thuc_hien}`);
      await axios.get(`${config.API_URL}/getGioBatDauByCV/${ paramLoaiCV }/${type}`).then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.modal.response = data[0];
        console.log('data', data);
      })

      if( paramLoaiCV == 'THUC'){
        await axios.get(`${config.API_URL}/getGioBatDauByCV/NGU/COUNT_DOWN`).then(response => {
          // seft.hotSettings.data = response.data.data;
          let data = response.data.data;
          var durationTM = moment.duration(moment(gio_bat_dau).diff(moment(data[0].gio_bat_dau)));
          //  let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
          console.log('data_THUC', data);
          console.log('data.gio_bat_dau', moment(data[0].gio_bat_dau));
          console.log('gio_bat_dau', moment(gio_bat_dau));
          console.log('durationTM', durationTM);
          console.log('durationTM', durationTM._milliseconds);
          self.modal.duration = Math.floor((durationTM._milliseconds / (1000 * 60)));
        })
      }
      
    },
    async insert() {
      // if() return;
      let self = this;
      let hoatdong = this.modal.loaiHoatDong;
      console.log("this.modal", this.modal);
      console.log("hoatdong", hoatdong);
      let ma_cv = typeof hoatdong === 'object' ? hoatdong.code.toString() : hoatdong;
      let working_time = 0;
      // let gio_bat_dau = moment(`${this.modal.ngay_thuc_hien} ${this.modal.gio_thuc_hien}`);
      // if( ma_cv == 'THUC'){
      //   await axios.get(`${config.API_URL}/getGioBatDauByCV/NGU/COUNT_DOWN`).then(response => {
      //   // seft.hotSettings.data = response.data.data;
      //   let data = response.data.data;
      //   var durationTM = moment.duration(moment(gio_bat_dau).diff(moment(data[0].gio_bat_dau)));
      //   //  let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
      //   console.log('data_THUC', data);
      //   console.log('data.gio_bat_dau', moment(data[0].gio_bat_dau));
      //   console.log('gio_bat_dau', moment(gio_bat_dau));
      //   console.log('durationTM', durationTM);
      // })
      // }

      // return;
      let congviec = {
        ten_cv: typeof hoatdong === 'object' ? hoatdong.name.toString() : hoatdong,
        ma_cv: ma_cv == 'NGU' || ma_cv == 'THUC' ? 'NGU' : ma_cv,
        gio_bat_dau: moment(`${this.modal.ngay_thuc_hien} ${this.modal.gio_thuc_hien}`),
        the_tich_sua: 0,
        thong_tin_them: this.modal.ghi_chu_them,
        working_time: self.modal.duration,
        status: ma_cv == 'NGU' ? 'N' : 'T'
        
      }
      await axios.post(config.API_URL + '/insertChamCon',  congviec).then(async function (response) {
        console.log("TEXXXXXXXXXXX", 'DONE');
        self.dialog = false;
      })
      this.dialog = false;
    },
    time(){}
  }, // end created
} // End exxport default
</script>
<style scoped>
.v-scroll {
  height: 700px;
  max-height: 700px;
  overflow-y: auto;
}
</style>
