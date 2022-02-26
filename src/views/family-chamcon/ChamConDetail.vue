<template>
  <v-dialog
    ref="chamConDetail"
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
            Chi tiết {{title.slice(0,100)}}
          </h4>
          <v-icon
            right
            style="font-weight:bold; color: #ff0000"
            @click="dialog = false"
          >
            x
          </v-icon>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="save()"
          >
            Save
          </v-btn>
          <v-btn
            color="danger darken-1"
            text
            @click="deleteChiTieu()"
          >
            Delete
          </v-btn>
        </v-card-actions>
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
            </v-row>
            
          </v-container>
        </v-card-text>
        
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  import config from '../../config/config.js'

  export default {
    layout: 'chamConDetail',
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
        await axios
        .post(config.API_FAMILY + '/appsuckhoe/updateChamConFull', seft.item)
        .then(function (response) {
          console.log('succuess')
          seft.dialog = false;
          seft.$emit('refeshList');
        })
        .catch(error => {
          console.log(error)
        })
      },
      async deleteChiTieu () {
      const seft = this;
      await axios
        .post(config.API_FAMILY + '/appsuckhoe/deleteChamCon', this.item)
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
    height: 700px;
    max-height: 700px;
    overflow-y: auto;
  }
</style>
