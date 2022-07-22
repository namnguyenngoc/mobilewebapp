<template>
  <v-row>
    <v-dialog 
      ref="chamConListDialog"
      v-model="dialog"
      fullscreen>
      <v-card>
        <v-card-title>
          <span>{{item.title}} ngày {{item.date}}</span>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false"> x </v-btn>
        </v-card-title>
        <v-card-text>
          <v-col cols="12" md="12" v-show="false">
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
              
            </v-dialog>
          </v-col>
          <v-col cols="12" md="12" class="ma-0 pa-0" >
            <vue-good-table
              title="Công việc chăm con"
              styleClass="vgt-table bordered"
              :columns="colCongViec"
              :rows="item.item.tblDataCongViec"
              :lineNumbers="true"
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :group-options="{
                enabled: true,
                headerPosition: 'top',
              }"
              @on-cell-click="onRowDoubleClick"
              max-height="500px"
              
            >
            </vue-good-table>
          </v-col>
           
        </v-card-text>
       
      </v-card>
    </v-dialog>
    <v-col cols="12">
      <chamConDetail
        ref="chamConDetail2"
     
        :v-model="chamConDetaillDialog"
        @refeshList="loadData()"
      />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import config from '../../config/config.js'
import moment from 'moment'
import chamConDetail from "./ChamConDetail"

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
  components: {
    chamConDetail
  },
  props: {
    // date: {
    //   type: String,
    //   default: 'Test',
    // },
    total: {
      type: String,
      default: '',
    },
    // item: {
    //   type: Object,
    //   default: () => ({}),
    // },
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
          {
            name: 'Sự kiện khác',
            code: 'EVENT',
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
      congviecParam: {},
      colCongViec: [
        {
          label: 'Giờ',
          field: 'gio_bat_dau',
          // filterable: true,
          type: 'date',
          sortable: false,
          formatFn: function (value) {
            return value != null ? moment(value).format(config.TIME_FM) : null
          },
        },
        {
          label: 'Công việc',
          field: 'ten_cv',
          sortable: false,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Công việc', // placeholder for filter input
              filterValue: '', // initial populated value for this filter
              filterDropdownItems: ['Ăn', 'Uống sữa'], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Thể tích/Thời gian',
          field: 'item_time_lbl',
          sortable: false,
          type: 'number',
          thClass: 'text-right row-total',
          filterable: true,
          headerField: this.sumWorkingTime,
        },
        {
          label: 'Ghi chú',
          field: 'thong_tin_them',
        },
         {
          label: 'Server',
          field: 'server_code',
        },
      
        {
          label: 'id',
          field: 'id',
          type: 'number',
          sortable: false,
          hidden: true,
         
        },
        
      ],
      tblDataCongViec: [
      ],
      chamConTitle: '',
      chamConItem: {},
      chamConDetaillDialog: false,
      item: {
        item: {
                tblDataCongViec: [
                  {
                    children: [],
                  }
                ]
              },
        // tblDataCongViec: [ 
        //     {
        //       children: [{"id":1835,"ho_ten":"NGUYEN DANG KHOI","nam_sinh":"23-11-2021","ma_cv":"BSB_UONG","ghi_chu":"","ngay_thuc_hien":"2022-06-24T11:33:43.000Z","gio_bat_dau":"2022-06-24T04:33:25.000Z","gio_ke_tiep":"2022-06-24T11:34:25.000Z","thong_tin_them":"Morigana 6-36","status":"","working_time":0,"can_nang":null,"chieu_cao":null,"tinh_trang_suc_khoe":null,"updated_date":"2022-06-24T04:33:43.000Z","create_date":"2022-06-24T04:33:43.000Z","the_tich_sua":"70","ten_cong_viec":"Uống sữa","ten_cv":"Uống sữa","server_code":""},{"id":1833,"ho_ten":"NGUYEN DANG KHOI","nam_sinh":"23-11-2021","ma_cv":"BSB_UONG","ghi_chu":"","ngay_thuc_hien":"2022-06-24T10:06:30.000Z","gio_bat_dau":"2022-06-24T03:06:18.000Z","gio_ke_tiep":"2022-06-24T10:07:18.000Z","thong_tin_them":"Morigana 6-36","status":"","working_time":0,"can_nang":null,"chieu_cao":null,"tinh_trang_suc_khoe":null,"updated_date":"2022-06-24T03:06:30.000Z","create_date":"2022-06-24T03:06:30.000Z","the_tich_sua":"80","ten_cong_viec":"Uống sữa","ten_cv":"Uống sữa","server_code":""},{"id":1831,"ho_ten":"NGUYEN DANG KHOI","nam_sinh":"23-11-2021","ma_cv":"BSB_UONG","ghi_chu":"","ngay_thuc_hien":"2022-06-24T09:50:56.000Z","gio_bat_dau":"2022-06-24T02:50:33.000Z","gio_ke_tiep":"2022-06-24T09:51:33.000Z","thong_tin_them":"Ăn cháo rây","status":"","working_time":0,"can_nang":null,"chieu_cao":null,"tinh_trang_suc_khoe":null,"updated_date":"2022-06-24T02:50:56.000Z","create_date":"2022-06-24T02:50:56.000Z","the_tich_sua":"10","ten_cong_viec":"Uống sữa","ten_cv":"Uống sữa","server_code":""},{"id":1823,"ho_ten":"NGUYEN DANG KHOI","nam_sinh":"23-11-2021","ma_cv":"BSB_UONG","ghi_chu":"","ngay_thuc_hien":"2022-06-24T07:09:02.000Z","gio_bat_dau":"2022-06-24T00:08:41.000Z","gio_ke_tiep":"2022-06-24T07:09:41.000Z","thong_tin_them":"Sữa mẹ","status":"","working_time":0,"can_nang":null,"chieu_cao":null,"tinh_trang_suc_khoe":null,"updated_date":"2022-06-24T00:09:02.000Z","create_date":"2022-06-24T00:09:02.000Z","the_tich_sua":"40","ten_cong_viec":"Uống sữa","ten_cv":"Uống sữa","server_code":""}],
        //     }
        //   ]
      },
      title: "",
      date: new Date()
    }
  },
  computed: {
    propsChiTieu: function (item) {
      return item
    },
    
  },
  async mounted() {
    //  await this.countWorkInDay2();
    //  console.log("this.tblDataCongViec", this.tblDataCongViec);
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
        // console.log('duration', duration)
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
      // console.log('loaiCongViec', this.modal);
      let type = 'COUNT_DOWN';
      const  self = this;
      let gio_bat_dau = moment(`${this.modal.ngay_thuc_hien} ${this.modal.gio_thuc_hien}`);
      await axios.get(`${config.API_URL}/getGioBatDauByCV/${ paramLoaiCV }/${type}`).then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.modal.response = data[0];
        // console.log('data', data);
      })

      if( paramLoaiCV == 'THUC'){
        await axios.get(`${config.API_URL}/getGioBatDauByCV/NGU/COUNT_DOWN`).then(response => {
          // seft.hotSettings.data = response.data.data;
          let data = response.data.data;
          var durationTM = moment.duration(moment(gio_bat_dau).diff(moment(data[0].gio_bat_dau)));
          //  let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
          // console.log('data_THUC', data);
          // console.log('data.gio_bat_dau', moment(data[0].gio_bat_dau));
          // console.log('gio_bat_dau', moment(gio_bat_dau));
          // console.log('durationTM', durationTM);
          // console.log('durationTM', durationTM._milliseconds);
          self.modal.duration = Math.floor((durationTM._milliseconds / (1000 * 60)));
        })
      }
      
    },
    async insert() {
      // if() return;
      // console.log('item', this.item);
      let self = this;
      this.tblDataCongViec = [];
      this.tblDataCongViec = this.item.tblDataCongViec;
      for(let i = 0; i < this.item.tblDataCongViec.length; i ++){
        this.tblDataCongViec.push(this.item.tblDataCongViec[i]);
      }

      //  console.log(' this.tblDataCongViec',  this.tblDataCongViec);
    },
    time(){},
    onRowDoubleClick(params) {
    // params.row - row object 
    // params.pageIndex - index of this row on the current page.
    // params.selected - if selection is enabled this argument 
    // indicates selected or not
    // params.event - click event

      // console.log('row', params.row);
      let detail = {
        title:  `${params.row.ten_cong_viec} ngày ${moment(params.row.ngay_thuc_hien).format(config.DATE_TIME_FM)}`,
        item: {
          id: params.row.id,
          ho_ten: params.row.ho_ten,
          nam_sinh: params.row.nam_sinh,
          ma_cv: params.row.ma_cv,
          ghi_chu: params.row.ghi_chu,
          ngay_thuc_hien:  moment(params.row.ngay_thuc_hien).format(config.DATE_TIME_FULL_FM),
          gio_bat_dau:  moment(params.row.gio_bat_dau).format(config.DATE_TIME_FULL_FM),
          gio_ke_tiep:  moment(params.row.gio_ke_tiep).format(config.DATE_TIME_FULL_FM),
          thong_tin_them: params.row.thong_tin_them,
          status: params.row.status,
          working_time: params.row.working_time,
          can_nang: params.row.can_nang,
          chieu_cao: params.row.chieu_cao,
          tinh_trang_suc_khoe: params.row.tinh_trang_suc_khoe,
          updated_date: params.row.updated_date,
          create_date: params.row.create_date,
          the_tich_sua: params.row.the_tich_sua,
          ten_cong_viec: params.row.ten_cong_viec,
          vgt_id: params.row.vgt_id,
          originalIndex:params.row.originalIndex 
        }
      }
//  moment.tz(new Date(), tzString).format("YYYY-MM-DD HH:mm:ss"),
      this.$refs.chamConDetail2.item = detail.item;
      this.$refs.chamConDetail2.dialog = true;
    },
    sumWorkingTime(rowObj) {
    	console.log('sumWorkingTime', rowObj);
      if( rowObj.children.length == 0) return 0;
    	let sum = 0;

      for (let i = 0; i < rowObj.children.length; i++) {
        // console.log('rowObj.children[i]', rowObj.children[i]);
        if('BSB_UONG' == rowObj.children[i].ma_cv || 'AN' == rowObj.children[i].ma_cv){
          sum += parseFloat(rowObj.children[i].the_tich_sua);

        }else {
          sum += parseFloat(rowObj.children[i].working_time);
        }
      }
      if('BSB_UONG' == rowObj.children[0].ma_cv || 'AN' == rowObj.children[0].ma_cv){
        return sum;
      } else {
        return `${Math.floor(sum / 60) } giờ ${sum % 60} phút`
      }
    },
    
  }, // end created
} // End exxport default
</script>
<style scoped>
.v-scroll {
  height: 700px;
  max-height: 700px;
  overflow-y: auto;
}
.vgt-right-align > span{
  color:#606266;
}
</style>
