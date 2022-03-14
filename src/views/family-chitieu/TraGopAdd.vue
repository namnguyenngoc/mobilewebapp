<template>
  <v-dialog
    ref="tragopAdd"
    v-model="dialog"
    max-width="900px"
    persistent
    hide-overlay
    scrollable
  >
    <v-card max-height="900px">
      <v-form
          ref="tragopForm"
          v-model="valid"
          lazy-validation
        >
        <v-card-title class="text-left info pa-1">
          <v-col cols="10" class="ma-0 pa-0">
            <h4
              class="pa-2 md-10"
              cols="10"
              style="color: #ffffff"
            >
              {{title.slice(0,10)}}
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

          <v-card-text class="v-scroll pt-0 pb-0 mt-0 mb-0" >
          
            <v-row class="mt-3">
              <v-col cols="12" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Sản phẩm"
                  value=""
                  v-model="item.san_pham"
                  hide-details
                  required
                  :rules="emptyRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5" class="mt-1 mb-0 pt-0 pb-0">
                <v-autocomplete
                  ref="bank"
                  :items="bankChecked"
                  v-model="item.bank"
                  label="Bank"
                  item-text="label"
                  item-value="code"
                  hide-details=""
                  return-object
                  required
                  :rules="emptyRules"
                />
              </v-col>
              
               <v-col cols="12" md="7" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Số kỳ trả góp"
                  value="0"
                  v-model="item.tong_so_ky"
                  class="text-right"
                  required
                  :rules="emptyNumberRules"
                  @input="tinhSoTienMoiKy()"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Phí chuyển đổi"
                  value="0"
                  v-model="item.phi_chuyen"
                  class="text-right"
                  :rules="onlyNumber"
                  required
                  @input="tinhSoTienMoiKy()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Giá trị sản phẩm"
                  value="0"
                  v-model="item.gia_san_pham"
                  class="text-right"
                  type="number"
                  :rules="emptyNumberRules"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="4" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Số tiền mỗi kỳ"
                  value="0"
                  v-model="item.moi_ky"
                  class="text-right"
                  type="number"
                  readonly
                  required
                  :rules="emptyNumberRules"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="4" class="mt-1 mb-0 pt-0 pb-0">
              <v-menu
                  ref="menu0"
                  v-model="menu0"
                  :close-on-content-click="false"
                  :return-value.sync="item.ngay_mua"
                  transition="scale-transition"
                  offset-y
                  hide-details
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.ngay_mua"
                      label="Ngày mua"
                      prepend-icon="mdi-calendar"
                      class="text-right"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      hide-details
                      required
                      :rules="emptyRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="item.ngay_mua" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu0 = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.menu0.save(item.ngay_mua)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
                
              </v-col>

              
              <v-col cols="12" md="4" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Tổng tiền góp"
                  value="0"
                  v-model="item.tong_tien"
                  class="text-right"
                  required
                  :rules="emptyNumberRules"
                  @input="tinhSoTienMoiKy()"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4" class="mt-0 mb-0 pt-0 pb-0">
                <v-text-field
                  label="Số tiền mỗi kỳ (fm)"
                  value="0"
                  v-model="item.moi_ky_fm"
                  class="text-right"
                  type="number"
                  readonly
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="4" class="mt-0 mb-0 pt-0 pb-0">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  :return-value.sync="item.ky_dau"
                  transition="scale-transition"
                  offset-y
                  hide-details
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.ky_dau"
                      label="Kỳ đầu"
                      prepend-icon="mdi-calendar"
                      class="text-right"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      hide-details
                      required
                      :rules="emptyRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="item.ky_dau" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu1 = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.menu1.save(item.ky_dau)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6" md="4" class="mt-0 mb-0 pt-0 pb-0">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :return-value.sync="item.ky_cuoi"
                  transition="scale-transition"
                  offset-y
                  hide-details
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.ky_cuoi"
                      label="Kỳ cuối"
                      prepend-icon="mdi-calendar"
                      class="text-right"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      hide-details
                      required
                      :rules="emptyRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="item.ky_cuoi" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu2 = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.menu2.save(item.ky_cuoi)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  v-model="item.noi_mua"
                  label="Nơi mua"
                  hide-details
                  required
                  :rules="emptyRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mt-1 mb-0 pt-0 pb-0">
                <v-text-field
                  v-model="item.ghi_chu"
                  label="Ghi Chú"
                  hide-details
                  required
                  :rules="emptyRules"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
              color="success"
              @click="insertTraGop()"
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
  import config from '../../config/config.js';
  import moment from "moment";
  export default {
    layout: 'tragopAdd',
    components: {
    },
    props: {
      title: {
        type: String,
        default: 'THÊM SẢN PHẨM TRẢ GÓP'
      },
      item: {
        type: Object,
        default: () => ({
          // id: "",
          san_pham: "",
          bank: "",
          tong_tien: 0,
          gia_san_pham: 0,
          moi_ky: 0,
          tong_so_ky: 0,
          ky_da_tra: 0,
          ky_con_lai: 0,
          tien_do_tra_gop: 0,
          noi_mua: "",
          ngay_mua: "",
          ghi_chu: "",
          ky_cuoi: "",
          trang_thai: "",
          ky_dau: moment(new Date()).format("YYYY-MM-DD"),
          // ngay_mua = moment(String(chitieu.ngay_chi)).format("YYYY-MM-DD");
          chitieulist: ""
        })
      },
    },
    data () {
      return {
        emptyRules: [
          (v) => !!v || 'Required',
        ],
        emptyNumberRules: [
          (v) => !!v || 'Required',
          v  => {
            if (!isNaN(parseFloat(v))) return true;
            return 'The value must be an number';
          },

        ],
        numberRules: [
          v  => {
            if (!isNaN(parseFloat(v)) && v >= 0 && v <= 5000000) return true;
            return 'Number has to be between 1 and 5.000.000';
          },
        ],
        onlyNumber: [
          v  => {
            if (!isNaN(parseFloat(v))) return true;
            return 'Giá trị phải là số ' +  parseFloat(v);  
          },
        ],
        bankChecked: [
          {
            code: 'HSBC',
            label: 'HSBC'
          },
          {
            code: 'VIB',
            label: 'VIB'
          },
          {
            code: 'SC BANK',
            label: 'Standard Bank'
          },
         ],
        valid: true,
        dialog: false,
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu0: false,
        menu1: false,
        menu2: false,
        
        san_pham: "2021-02-08",
        bank: "VIB",
        tong_tien: 0,
        moi_ky: 0,
        tong_so_ky: 0,
        ky_da_tra: 0,
        ky_con_lai: 0,
        tien_do_tra_gop: 0,
        noi_mua: new Date(),
        ngay_mua: "2021-02-08",
        ghi_chu: "2021-02-08",
        ky_cuoi: "2021-02-08",
        trang_thai: "",
        ky_dau: moment(new Date()).format("DD/MM/YYYY"),
        chitieulist: "2021-02-08",
        item2: {
          // id: "",
          san_pham: "",
          bank: "",
          tong_tien: 0,
          phi_chuyen: 0,
          moi_ky: 0,
          moi_ky_fm: 0.00,
          tong_so_ky: 0,
          ky_da_tra: 0,
          ky_con_lai: 0,
          tien_do_tra_gop: 0,
          noi_mua: "",
          ghi_chu: "",
          trang_thai: "",
          ngay_mua: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          ky_dau: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          ky_dau_fm: new Date(),
          ky_cuoi: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          ky_cuoi_fm: new Date(),
          chitieulist: ""
        }
      }
    },
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    },
    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
    },
    mounted: function () {}, // end method
    created () {
      this.item.tong_tien = parseFloat(this.item.gia_san_pham) + parseFloat(this.item.phi_chuyen);
    }, // end data
    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      handleInput (e) {
        let stringValue = e.target.value.toString()
        let regex = /^\d*(\.\d{1,2})?$/
        if(!stringValue.match(regex) && this.price!== '') {
          this.price = this.previousPrice
        }
        this.previousPrice = this.price
      },
      formatPrice(value, tofix) {
        const val = (value / 1).toFixed(tofix).replace(",", ".");
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      onlyForCurrency ($event) {
        console.log($event.keyCode); //keyCodes value
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);

        // only allow number and one dot
        if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || this.price.indexOf('.') != -1)) { // 46 is dot
          $event.preventDefault();
        }

        // restrict to 2 decimal places
        if(this.price!=null && this.price.indexOf(".")>-1 && (this.price.split('.')[1].length > 1)){
        $event.preventDefault();
        }
      },
      tinhSoTienMoiKy(){
        let soTienMoiKy = (this.item.gia_san_pham == undefined 
                            || this.item.gia_san_pham == null 
                            || this.item.gia_san_pham == "") ? 0 : this.item.gia_san_pham;
        soTienMoiKy = (parseFloat(this.item.gia_san_pham) + parseFloat(this.item.phi_chuyen)) / parseFloat(this.item.tong_so_ky);
        this.item.moi_ky = Math.round(soTienMoiKy).toFixed(2);
        this.item.tong_tien = parseFloat(this.item.gia_san_pham) + parseFloat(this.item.phi_chuyen);
        // this.item.moi_ky_fm = this.formatPrice(Math.round(soTienMoiKy),2);
        console.log("aaaaaaaaaaaa", moment(this.item.ky_dau, "DD/MM/YYYY").add(this.item.tong_so_ky,'months'));
        this.item.ky_cuoi = moment(new Date(this.item.ky_dau), "DD/MM/YYYY").add(this.item.tong_so_ky,'months').format("YYYY-MM-DD");
        

      },
      async insertTraGop () {
        let self = this;
        if (this.$refs.tragopForm.validate()) {
          console.log('insertTraGop', this.item2);
          console.log('san_pham', this.san_pham);
          console.log('chitieulist', this.chitieulist);
          let traGopObject = {
            san_pham: this.san_pham,
            bank: this.bank.code,
            tong_tien: this.gia_san_pham + this.item.phi_chuyen,
            gia_san_pham: this.gia_san_pham,
            moi_ky: this.moi_ky,
            tong_so_ky: this.tong_so_ky,
            ky_da_tra: this.ky_da_tra,
            ky_con_lai: this.ky_con_lai,
            tien_do_tra_gop: this.tien_do_tra_gop,
            noi_mua: this.noi_mua,
            ngay_mua: this.ngay_mua,
            ghi_chu: this.ghi_chu,
            ky_cuoi: this.ky_cuoi,
            trang_thai: this.trang_thai,
            ky_dau: this.ky_dau,
            trang_thai: '',
          };

          await axios
          .post(config.API_FAMILY + '/api/insertTragop', this.item)
          .then(function (response) {
            // productModel = {};
            self.dialog = false;
            console.log(response.data.data);
            self.$emit('refeshList');
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(function () {
            console.log('then');

          // always executed
          })
        }
      },
    }, // end method
  } // End exxport defaul
</script>
<style scroped>
  .v-scroll{
    height: 680px;
    overflow-y: auto;
  }

</style>
