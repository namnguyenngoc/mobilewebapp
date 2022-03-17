<template>
  <v-dialog
    ref="chamConAdd"
    max-width="700px"
    v-model="dialog"
  >
    <v-card>
      <v-form ref="form">
        <v-card-title class="text-right info pa-1">
          <h4
            class="pa-2"
            style="color: #ffffff"
          >
           Thêm mới Tiêm Chủng
          </h4>
          <v-icon
            right
            style="font-weight:bold; color: #ff0000"
            @click="dialog = false"
          >
            x
          </v-icon>
        </v-card-title>
        

        <v-card-text>
          <v-container class="pt-0 pb-0 mb-0">
            
            <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
              <v-text-field
                  label="Tên con"
                  v-model="thong_tin_suc_khoe.ho_ten"
                  clearable
                  readonly
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-menu
                ref="ngayTiemMenu"
                :close-on-content-click="false"
                :return-value.sync="thong_tin_suc_khoe.ngay_tiem"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="thong_tin_suc_khoe.ngay_tiem"
                    label="Ngày Tiêm"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="thong_tin_suc_khoe.ngay_tiem"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.ngayTiemMenu.isActive = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.ngayTiemMenu.save(thong_tin_suc_khoe.ngay_tiem)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-menu
                ref="ngayTiemTiepTheoMenu"
                :close-on-content-click="false"
                :return-value.sync="thong_tin_suc_khoe.ngay_tiep_theo"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="thong_tin_suc_khoe.ngay_tiep_theo"
                    label="Mũi tiếp theo"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="thong_tin_suc_khoe.ngay_tiep_theo"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.ngayTiemTiepTheoMenu.isActive = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.ngayTiemTiepTheoMenu.save(thong_tin_suc_khoe.ngay_tiep_theo)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
              <v-text-field
                  label="Mũi tiêm thứ"
                  v-model="thong_tin_suc_khoe.stt_mui_tiem"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
              <v-text-field
                  label="Tên mũi tiêm"
                  v-model="thong_tin_suc_khoe.ten_cv"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
              <v-text-field
                  label="Nước SX"
                  v-model="thong_tin_suc_khoe.thong_tin_them.nuoc_sx"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
              <v-text-field
                  label="Số liều"
                  v-model="thong_tin_suc_khoe.thong_tin_them.so_lieu"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
              <v-text-field
                  label="Công dụng"
                  v-model="thong_tin_suc_khoe.thong_tin_them.phong_benh"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
              <v-text-field
                  label="Tháng tiêm"
                  v-model="thong_tin_suc_khoe.thong_tin_them.thang_tiem"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="save()"
          >
            Save
          </v-btn>
         
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  import config from '../../config/config.js'
  import moment from 'moment'

  export default {
    layout: 'chamConAdd',
    // inheritAttrs: false,
    components: {},
    props: {
      title: {
        type: String,
        default: 'Test'
      },
      item: {
        type: Object,
        default: () => ({})
      },
      // dialog: {
      //   type: Boolean,
      //   default: false
      // },
    },
    data () {
      return {
         dialog: false,
        // title: '',
        index: 1,
        itemChiTieu: {},
        lsPropTextField: [
          {
            code: 'can_nang',
            text: 'Cân nặng',
            order: 1,
            type: 'number',
          },
          {
            code: 'chieu_cao',
            text: 'Chiều cao',
            order: 2,
            type: 'number',
          },
          // {
          //   code: 'ghi_chu',
          //   text: 'Ghi chú'
          // },
          {
            code: 'gio_bat_dau',
            text: 'Giờ bắt đầu',
            type: 'datetime',
          },
          {
            code: 'gio_ke_tiep',
            text: 'Giờ kế tiếp',
            type: 'datetime',
          },
          {
            code: 'ngay_thuc_hien',
            text: 'Ngày thực hiện',
            type: 'datetime',
          },
          {
            code: 'the_tich_sua',
            text: 'Thể tích sữa'
          },
          // {
          //   code: 'thong_tin_them',
          //   text: 'Thông tin thêm'
          // },
          {
            code: 'tinh_trang_suc_khoe',
            text: 'Tình trạng'
          },
          {
            code: 'updated_date',
            text: 'Ngày cập nhật'
          },
          // {
          //   code: 'vgt_id',
          //   text: ''
          // },
          {
            code: 'working_time',
            text: 'Tổng giờ'
          },

        ],
        lsProp1: [
           {
            code: 'ten_cong_viec',
            text: 'Nội dung',
            order: 0,
          },

        ],
        lsPropArea: [
          {
            code: 'ghi_chu',
            text: 'Ghi chú'
          },
          {
            code: 'thong_tin_them',
            text: 'Thông tin thêm'
          },
         
        ],
        thong_tin_suc_khoe:{
          dialogCN: false,
          ho_ten: 'NGUYỄN ĐĂNG KHÔI',
          nam_sinh: '30/11/2021',
          ngay_bat_dau: moment().format('YYYY-MM-DD HH:mm'),
          muc_tieu: "0",
          can_nang: "0",
          chieu_cao: "0",
          can_nang_bo: "0",
          can_nang_total: "0",
          muc_dich: 'KTSKDK',
          spo2: 0,
          valid: true,
          chart_type_x: 'NGAY',
          ngay_tiem: moment().subtract(0, 'days').format(config.DATE_FM),
          ngay_tiep_theo: moment().subtract(0, 'days').format(config.DATE_FM),
          ten_cv: '',
          thong_tin_them: {
            phong_benh: '',
            nuoc_sx: '',
            so_lieu: 1
          }

        },
        menu2: false,
      }
    },
    computed: {
      propsChiTieu: function(item) {
        return item;
      }
    },
    mounted () {
     
    }, // end method
    created () {}, // end data
    methods: {
      async save(){
        const seft = this;
        console.log('this.item',seft.item);
        let modal = {
            ma_cv: 'TC',
            gio_bat_dau: this.thong_tin_suc_khoe.ngay_tiem,
            gio_ke_tiep: this.thong_tin_suc_khoe.ngay_tiep_theo,
            ghi_chu: this.thong_tin_suc_khoe.stt_mui_tiem,
            ten_cv: this.thong_tin_suc_khoe.ten_cv,
            the_tich_sua: 0,
            thong_tin_them: this.thong_tin_suc_khoe.thong_tin_them,
          }
          await axios.post(config.API_URL + '/insertChamCon', modal)
            .then(async function (response) {
            seft.dialog = false;
            seft.$emit('refeshList');
          })

      },
      
    }, // end created
  } // End exxport default
</script>
<style scoped>
  .v-scroll{
    height: 700px;
    max-height: 700px;
    overflow-y: auto;
  }
</style>
