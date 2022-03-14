<template>
  <v-dialog
    ref="tragopDetail"
    v-model="dialog"
    max-width="700"
  >
    <v-card>
      <v-form ref="form">
        <v-card-title class="text-right info pa-1">
          <h4
            class="pa-2"
            style="color: #ffffff"
          >
            Trả góp {{title.slice(0,50)}}
          </h4>
          <v-icon
            right
            style="font-weight:bold; color: #ff0000"
            @click="dialog = false"
          >
            x
          </v-icon>
        </v-card-title>
        
        <v-divider />

        <v-card-text>
          <v-container class="pt-0 pb-0 mb-0 v-scroll">
            <v-col  v-for="(value, key) in item" v-bind:key="item.id"
              cols="12"
              class="pa-0 ma-0"
            >
                <!-- v-if="lsPropTextField.find(({code}) => code == key)" -->
              <v-text-field
                v-if="key != 'chitieulist'"
                :label="key"
                :value="value"
                v-model="item[key]"
                clearable
                hide-details
                class="mb-2"
              ></v-text-field>
              <pre v-else>{{value}}</pre>
              <!-- <v-textarea
                
                clearable
                clear-icon="mdi-close-circle"
                 :label="key"
                :value="(value != undefined && value != null) ? JSON.stringify(JSON.parse(value), null, 2) : value"
                v-model="item[key]"
                rows="10"
                class="mb-2"
              ></v-textarea> -->
            </v-col>
            <v-col cols="12">
              <DialogConfirm ref="dialogConfirm" />
            </v-col>
            
          </v-container>
        </v-card-text>
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

  export default {
    layout: 'tragopDetail',
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
        itemChiTieu: {},
        lsPropTextField: [
          {
            code: 'san_pham',
            text: 'Sản phẩm trả góp'
          },
          {
            code: 'tong_tien',
            text: 'Tổng tiền'
          },
          {
            code: 'moi_ky',
            text: 'Số tiền mỗi kì'
          },
          {
            code: 'ngay_chi',
            text: 'Ngày chi'
          }

        ],
        lsPropTextField1: [
          // {
          //   code: 'balance_in_month',
          //   text: 'Số dư trong tháng'
          // },
          // {
          //   code: 'bank_code',
          //   text: 'Bank'
          // },
          // {
          //   code: 'status',
          //   text: 'Ngày chi'
          // },
          // {
          //   code: 'status_nm',
          //   text: 'Trạng thái'
          // },
          // {
          //   code: 'note_saoke',
          //   text: 'Ghi chú sao kê'
          // },
          // {
          //   code: 'ngay_sao_ke',
          //   text: 'Ngày sao kê'
          // },
          // {
          //   code: 'ngay_thanh_toan',
          //   text: 'Ngày thanh toán'
          // },

        ],
        lsPropArea: [
          // {
          //   code: 'email_content',
          //   text: 'Email content'
          // }
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
        .post(config.API_FAMILY + '/api/updateTraGopFull', seft.item)
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
          this.deleteTragop()
        }
        // const seft = this;
        // await axios
        //   .post(config.API_FAMILY + '/api/deleteChiTieu', this.item)
        //   .then(function (response) {
        //     console.log('succuess')
        //     seft.dialog = false;
        //     seft.$emit('refeshList');
        //   })
        //   .catch(error => {
        //     console.log(error)
        //   })
      },
      async deleteTragop () {
        const seft = this;
        await axios
          .post(config.API_FAMILY + '/api/deleteTragop', this.item)
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
