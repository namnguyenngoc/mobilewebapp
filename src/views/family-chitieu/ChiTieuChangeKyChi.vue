<template>
  <v-row justify="center">
    <v-dialog
      ref="ChiTieuChangeKyChi"
      v-model="dialog"
      max-width="600px"
    > <v-card>
        <v-card-title>
          <span class="text-h5">Cập nhật kì chi</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="12"
              >
                <v-text-field
                  label="Nội dung"
                  v-model="itemData.noi_dung"
                  hide-details
                  class="mb-2"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  :items="this.items_ky_chi_list"
                  label="From"
                  v-model="itemData.ky_chi"
                  item-text="title"
                  item-value="code"
                  class="text-right"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-autocomplete
                  :items="this.items_ky_chi_list"
                  label="To"
                  v-model="kyChiMoi"
                  item-text="title"
                  item-value="code"
                  class="text-right"
                  return-object

                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
                <v-text-field
                  label="Ghi chú"
                  v-model="itemData.ghi_chu"
                  hide-details
                  class="mb-2"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  import axios from 'axios'
  import config from '../../config/config.js'
  import moment from "moment";
  export default {
    layout: 'ChiTieuChangeKyChi',
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
      itemData: {
        type: Object,
        default: () => ({})
      },
      kyChiMoi: {
        type: Object,
        default: () => ({})
      },
    },
    data () {
      return {
        dialog: false,
        selectDateCurrent: "",
        // itemData: null,
        // kyChiMoi: null,
        // title: '',
        // item: Object,
        
      }
    },
    computed: {
      items_ky_chi_list: function() {
        let month = "";
        console.log("month_");
        let monList = moment.months();
        let yearList = config.NAM_THONG_KE;
        let items_ky_chi_new = [];
        let currentNow = new Date();
        // console.log("currentNow.getMonth()", currentNow.getMonth())
        // console.log("currentNow.getFullYear()", currentNow.getFullYear())
        for (var i in yearList) {
          for (var j in monList) {
            let value = moment()
              .month(monList[j])
              .format("M")
              .concat(yearList[i]);
            let obj = {
              code: value,
              title: value,
              disabled: this.allKyChi
                ? false
                : yearList[i] < currentNow.getFullYear() ||
                  (moment().month(monList[j]).format("M") <
                    currentNow.getMonth() + 1 &&
                    yearList[i] == currentNow.getFullYear()),
              // divider: this.allKyChi ? false : moment().month(monList[j]).format("M") < currentNow.getMonth() + 1
              //           && yearList[i] < currentNow.getFullYear(),
              // header: this.allKyChi ? false : (moment().month(monList[j]).format("M") < currentNow.getMonth() + 1
              //           && yearList[i] < currentNow.getFullYear()) ? "Paste": ""
            };
            items_ky_chi_new.push(obj);
          }
        }
        // console.log(moment().month().format("M"));
        // console.log(moment.monthsShort().format("M"));
        console.log("new Month");
        console.log(items_ky_chi_new);
        this.items_ky_chi = items_ky_chi_new;
        return this.items_ky_chi;
      },
    },
    mounted () {
     
    }, // end method
    created () {}, // end data
    methods: {
     async save() {
      console.log("itemData", this.itemData);
      console.log("kyChiMoi", this.kyChiMoi);
      const self = this;
      const params = {
        id: this.itemData.id,
        bank_code: this.itemData.bank_code,
        ky_chi: this.kyChiMoi.code,
        ky_chi_cu: this.itemData.ky_chi,
      };

      console.log("params", params);
      await axios
        .post(config.API_FAMILY + "/api/updateKyChi", params)
        .then(function (response) {
          console.log("succuess");
          var data = response.data.data;
          if (data !== undefined && data != null) {
          }
          self.dialog = false;
          self.$emit('refeshList');
        })
        .catch((error) => {
          console.log(error);
        });
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