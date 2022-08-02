<template>
  <v-row justify="center">
    <v-dialog
      ref="ChiTieuChangeStatus"
      v-model="dialog"
      max-width="600px"
    > <v-card>
        <v-card-title>
          <span class="text-h5">Cập nhật trạng thái</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-data-table
                :headers="headers"
                :items="items"
                hide-default-footer
                disable-pagination
                fixed-header
                :height="300"
              >
               <template v-slot:item.ngay_chi="{ item }">
                <span>{{ formatDate(item.ngay_chi) }}</span>
              </template>
              <template v-slot:item.so_tien="{ item }">
                <span>{{ formatPrice(item.so_tien, 0) }}</span>
              </template>
              </v-data-table>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  :items="this.items_status"
                  label="From"
                  v-model="itemData.status"
                  item-text="name"
                  item-value="id"
                  class="text-right"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-autocomplete
                  :items="this.items_status"
                  label="To"
                  v-model="statusMoi"
                  item-text="name"
                  item-value="id"
                  class="text-right"
                  return-object

                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
                <v-text-field
                  label="Note sao kê"
                  v-model="itemData.note_saoke"
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
    layout: 'ChiTieuChangeStatus',
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
      statusMoi: {
        type: Object,
        default: () => ({})
      },
      
    },
    data () {
      return {
        dialog: false,
        selectDateCurrent: "",
        headers: [
          {
            text: 'Số tiền',
            align: 'right',
            sortable: false,
            value: 'so_tien',
          },
          { text: 'Nội dung', value: 'noi_dung' },
          { text: 'Bank', value: 'bank_code' },
          { text: 'Ngày chi', value: 'ngay_chi', dataType: "Date", align: 'center', },
        ],
        items:[
        ],
        items_status: [
        //  {
        //     id: "DCHI",
        //     name: "Dự Chi",
        //   },
        //   {
        //     id: "CHM",
        //     name: "Cho Mượn",
        //   },
        //   {
        //     id: "DTT",
        //     name: "Đã Tất Toán",
        //   },
          {
            id: "DN",
            name: "Dư Nợ",
          },
          {
            id: "CSK",
            name: "Chốt sao kê",
          },
          {
            id: "DTCSK",
            name: "Gạch nợ",
          },
          // {
          //   id: "DTN",
          //   name: "Đã trả nợ",
          // },
          // {
          //   id: "NHT",
          //   name: "Nhận tiền",
          // },
          {
            id: "HTN",
            name: "Hoàn Tiền",
          },
          // {
          //   id: "MNT",
          //   name: "Mượn Tiền",
          // },
          {
            id: "FAIL",
            name: "Giao dịch lỗi",
          },
          { id: "TG", name: "Trả Góp" },
        ],
        // status: 'DN',
        // itemData: null,
        // statusMoi: null,
        // title: '',
        // item: Object,
        
      }
    },
    computed: {
      
    },
    mounted () {
     console.log("itemData2222222222", this.itemData);
    }, // end method
    created () {
       
    }, // end data
    methods: {
      formatDate(str) {
        if (!str) {
          return '';
        }
        const val = moment(str).format('DD/MM/YYYY');

        return val;
      },
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
      async save() {
        console.log("changeChiTieuStatus");
        const self = this;
        let ghi_chu = `Cập nhật trạng thái từ ${this.itemData.status} - ${this.statusMoi.id}`;

        let status_cd = this.statusMoi.id;
        let isDoiSoat = false;
        // let params = {
        //     ghi_chu:  isDoiSoat ? 'Cập nhật trạng thái từ DTCSK - DTCSK' : ghi_chu,
        //     status: isDoiSoat ? 'DTCSK' : status_cd,
        //     bank_code: [this.itemData.bank_code],
        //     ky_chi: [this.itemData.ky_chi],
        //     so_tien:  this.itemData.so_tien,
        //     id: this.itemData.id,
        //     row_item: null,
        //     row_san_pham: this.itemData,
        //   };
          let params = {
            "ghi_chu": ghi_chu,
            "new_status": status_cd,
            items: this.items,
          }
          console.log("params", params);
          await axios
            .post(`${config.API_FAMILY}/api/updateChiTIeu2"`, params)
            .then(function (response) {
              console.log("succuess");
              var data = response.data.data;
              if (data !== undefined && data != null) {
              }
              self.dialog = false;
              self.$emit('refeshList');

              // seft.$refs.dialogConfirm.dialog = false
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