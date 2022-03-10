<template>
  <v-dialog
    ref="chitieuDetail"
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
            color="error"
            text
            @click="deleteChiTieu()"
          >
            Delete
          </v-btn>
        </v-card-actions>
        <v-divider />

        <v-card-text>
          <v-container class="pt-0 pb-0 mb-0 v-scroll">
            <v-col  v-for="(value, key) in item" v-bind:key="item.id"
              cols="12"
              class="pa-0 ma-0"
            >
              <v-text-field
                v-if="lsProp.find(({code}) => code == key)"
                :label="lsProp.find(({code}) => code == key).text"
                :value="value"
                v-model="item[key]"
                hide-details
                class="mb-2"
              ></v-text-field>
            </v-col>
            <v-col  v-for="(value, key) in item" v-bind:key="item.id"
              cols="12"
              class="pa-0 ma-0"
            >
              <v-textarea
                v-if="lsPropArea.find(({code}) => code == key)"
                clearable
                clear-icon="mdi-close-circle"
                :label="lsPropArea.find(({code}) => code == key).text"
                :value="(value == undefined || value == null || value == '') ? '' : value.replace(/\r?\n|\r/g, '\n').replace(/&nbsp;/g, '').trim()"
                v-model="item[key]"
                rows="10"
                class="mb-2"
              ></v-textarea>
            </v-col>
            <v-col  v-for="(value, key) in item" v-bind:key="item.id"
              cols="12"
              class="pa-0 ma-0"
            >
              <v-text-field
                v-if="lsProp1.find(({code}) => code == key)"
                :label="lsProp1.find(({code}) => code == key).text"
                :value="value"
                v-model="item[key]"
                hide-details
                class="mb-2"
              ></v-text-field>
            </v-col>
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
    layout: 'chitieuDetail',
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
        itemChiTieu: {},
        lsProp: [
          {
            code: 'noi_dung',
            text: 'Nội dung chi'
          },
          {
            code: 'so_tien',
            text: 'Số tiền'
          },
          {
            code: 'ghi_chu',
            text: 'Ghi chú'
          },
          {
            code: 'ngay_chi',
            text: 'Ngày chi'
          }

        ],
        lsProp1: [
          {
            code: 'balance_in_month',
            text: 'Số dư trong tháng'
          },
          {
            code: 'bank_code',
            text: 'Bank'
          },
          {
            code: 'status',
            text: 'Ngày chi'
          },
          {
            code: 'status_nm',
            text: 'Trạng thái'
          },
          {
            code: 'note_saoke',
            text: 'Ghi chú sao kê'
          },
          {
            code: 'ngay_sao_ke',
            text: 'Ngày sao kê'
          },
          {
            code: 'ngay_thanh_toan',
            text: 'Ngày thanh toán'
          },
          {
            code: 'create_date',
            text: 'Ngày tạo'
          },

        ],
        lsPropArea: [
          {
            code: 'email_content',
            text: 'Email content'
          }
        ],
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
        .post(config.API_FAMILY + '/api/updateChiTieu', seft.item)
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
        .post(config.API_FAMILY + '/api/deleteChiTieu', this.item)
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
