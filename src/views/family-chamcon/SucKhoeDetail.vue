<template>
  <v-dialog
    ref="sucKhoeDetail"
    max-width="500px"
    v-model="dialog"
  >
    <v-card>
      <v-form ref="form">
        <v-card-title class="info pa-1">
          <v-col cols="10" class="ma-0 pa-0">
            <h4
              class="pa-2 md-10"
              cols="10"
              style="color: #ffffff"
            >
              Chi tiết sức khỏe
            </h4>
          </v-col>
          <v-col cols="2" class="ma-0 pa-0 text-right pr-4">
            <v-icon
              right
              cols="2"
              style="font-weight:bold; color: #ff0000"
              class="text-right"
              @click="dialog = false"
            >
              x
            </v-icon>
          </v-col>
        </v-card-title>
        
        <v-divider />

        <v-card-text>
          <v-container class="pt-0 pb-0 mb-0 v-scroll">
            <v-row class="mt-1">
              <v-col  v-for="(value, key) in item" v-bind:key="item.id"
                cols="12"
                class="pa-0 ma-0"
              >
                <v-text-field
                  v-if="lsProp1.find(({code, type}) => code == key)"
                  :label="lsProp1.find(({code}) => code == key).text"
                  :value="value"
                  v-model="item[key]"
                  hide-details
                  class="mb-2"
                ></v-text-field>

               
                <!-- <v-text-field
                  v-else-if="lsProp1.find(({code, type}) => code == key && type == 'datetime')"
                  :label="lsProp1.find(({code}) => code == key).text"
                  :value="value"
                  v-model="item[key]"
                  hide-details
                  class="mb-2"
                ></v-text-field> -->

              </v-col>
            </v-row>
            <v-row>
              <v-col  v-for="(value, key) in item" v-bind:key="item.id"
                cols="12"
                class="pa-0 ma-0"
              >
                <v-text-field
                  v-if="lsPropTextField.find(({code, type}) => code == key)"
                  :label="lsPropTextField.find(({code}) => code == key).text"
                  :value="value"
                  v-model="item[key]"
                  hide-details
                  class="mb-2"
                ></v-text-field>
                 <!-- <v-menu
                  v-else-if="lsPropTextField.find(({code, type}) => code == key && type == 'datetime')"
                  :ref="item[key]"
                  v-model="item[key]"
                  :close-on-content-click="false"
                  :return-value.sync="item[key]"
                  transition="scale-transition"
                  offset-y
                  hide-details
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item[key]"
                      prepend-icon="mdi-calendar"
                      class="text-right"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      hide-details
                      :label="lsPropTextField.find(({code}) => code == key).text"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="item[key]" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu2 = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.menu2.save(item[key])">
                      OK
                    </v-btn>
                  </v-date-picker>
                  <v-time-picker
                    format="ampm"
                  ></v-time-picker>
                </v-menu> -->
              </v-col>
            </v-row>
            <v-row>
              <v-col  v-for="(value, key) in item" v-bind:key="item.id"
                cols="12"
                class="pa-0 ma-0"
              >
                <v-textarea
                  v-if="lsPropArea.find(({code, type}) => code == key && type != 'datetime')"
                  clearable
                  clear-icon="mdi-close-circle"
                  :label="lsPropArea.find(({code}) => code == key).text"
                  :value="(value == undefined || value == null || value == '') ? '' : value.replace(/\r?\n|\r/g, '\n').replace(/&nbsp;/g, '').trim()"
                  v-model="item[key]"
                  rows="10"
                  class="mb-2"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <DialogConfirm ref="dialogConfirm" />
              </v-col>
            </v-row>
            
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="darken-1"
            @click="save('NEW')"
          >
            Save New
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="save()"
          >
            Save
          </v-btn>
          <v-btn
            color="error darken-1"
            text
            @click="confirmDelete()"
          >
            Delete
          </v-btn>
        </v-card-actions>
        
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  import config from '../../config/config.js'
  import DialogConfirm from '../../components/DialogConfirm.vue'
  import moment from 'moment'


  export default {
    layout: 'suckhoeDetail',
    // inheritAttrs: false,
    components: {
      DialogConfirm
    },
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
            code: 'ho_ten',
            text: '1_Họ tên',
            order: 0,
          },
          {
            code: 'nam_sinh',
            text: '2_Năm sinh',
            order: 1,
          },
         {
            code: 'can_nang_minus_2sd',
            text: '3_Cân nặng (-2SD)',
            order: 3,
            type: 'number',
          },
          {
            code: 'can_nang',
            text: '4_Cân nặng',
            order: 3,
            type: 'number',
          },
          {
            code: 'can_nang_add_2sd',
            text: '5_Cân nặng (+2SD)',
            order: 4,
            type: 'number',
          },
          {
            code: 'chieu_cao_minus_2sd',
            text: '6_Chiều cao (-2SD)',
            order: 5,
            type: 'number',
          },
          {
            code: 'chieu_cao',
            text: '7_Chiều cao',
            order: 6,
            type: 'number',
          },
          {
            code: 'chieu_cao_add_2sd',
            text: '8_Chiều cao (+2SD)',
            order: 7,
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
          {
            code: 'phan_loai',
            text: 'Phân loại (TC: Tiêu chuẩn)'
          },
          {
            code: 'gioi_tinh',
            text: 'Giới tính (M/F)'
          },
          {
            code: 'thang_thu',
            text: 'Tháng áp dụng'
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
      async save(option){
        const seft = this;
        console.log('this.item',seft.item);
        let url = config.API_FAMILY + '/appsuckhoe/updateSucKhoe';
        if('NEW' == option){
          url = config.API_FAMILY + '/appsuckhoe/insertSucKhoe';
          this.item.muc_tieu = '8';
          this.item.muc_dich = 'KTSKDK';
          this.item.spo2 = 0;
          this.item.ngay_bat_dau = moment().format('YYYY-MM-DD HH:mm');
        }
        let newItem = this.item;

        newItem.can_nang = this.item.can_nang * 1000;
        newItem.can_na = this.item.can_nang * 1000;
        newItem.can_nang_add_2sd = this.item.can_nang_add_2sd * 1000;
        newItem.can_nang_minus_2sd = this.item.can_nang_minus_2sd * 1000;
        
        await axios
        .post(url, newItem)
        .then(function (response) {
          console.log('succuess')
          seft.dialog = false;
          seft.$emit('refeshList');
        })
        .catch(error => {
          console.log(error)
        })
      },
      async confirmDelete () {
        //  this.$refs.dialogConfirm.dialog = true
        if (
          await this.$refs.dialogConfirm.open(
            "Confirm",
            "Are you sure you want to delete this record?"
          )
        ){
          this.deleteItem()
        }
      },
      async deleteItem () {
        const seft = this;
        await axios
          .post(config.API_FAMILY + '/appsuckhoe/deleteSucKhoe', this.item)
          .then(function (response) {
            console.log('succuess')
            seft.dialog = false;
            seft.$emit('refeshList');
          })
          .catch(error => {
            console.log(error)
          })
      },
    }, // end created
  } // End exxport default
</script>
<style scoped>
  .v-scroll{
    height: 500px;
    max-height: 500px;
    overflow-y: auto;
  }
</style>
