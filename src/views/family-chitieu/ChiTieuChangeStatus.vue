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
        items_status: [
         {
            id: "DCHI",
            name: "Dự Chi",
          },
          {
            id: "CHM",
            name: "Cho Mượn",
          },
          {
            id: "DTT",
            name: "Đã Tất Toán",
          },
          {
            id: "DN",
            name: "Dư Nợ",
          },
          {
            id: "DTCSK",
            name: "Đã Trả / CSK",
          },
          {
            id: "DTN",
            name: "Đã trả nợ",
          },
          {
            id: "NHT",
            name: "Nhận tiền",
          },
          {
            id: "HTN",
            name: "Hoàn Tiền",
          },
          {
            id: "MNT",
            name: "Mượn Tiền",
          },
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
      async save() {
        console.log("changeChiTieuStatus");
        const self = this;
        let ghi_chu = `Cập nhật trạng thái từ ${this.itemData.status} - ${this.statusMoi.id}`;
        let status_cd = this.statusMoi.id;
        let isDoiSoat = false;
        let params = {
            ghi_chu:  isDoiSoat ? 'Cập nhật trạng thái từ DTCSK - DTCSK' : ghi_chu,
            status: isDoiSoat ? 'DTCSK' : status_cd,
            bank_code: [this.itemData.bank_code],
            ky_chi: [this.itemData.ky_chi],
            so_tien:  this.itemData.so_tien,
            id: this.itemData.id,
            row_item: null,
            row_san_pham: this.itemData,
          };
          
          console.log("params", params);
          await axios
            .post(config.API_FAMILY + "/api/updateStatusByBank", params)
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
        // }


      // const _chitieu = this.chiTieuList.filter(async function (item, idx) {
      
      // if (item.id == chitieu.id) {
      //   let params = {};
      //   var status_cd = 'DN';

      //   // eslint-disable-next-line camelcase
      //   const bank_code = [item.bank_code];
      //   // eslint-disable-next-line camelcase
      //   const ky_chi = [item.ky_chi];
      //   const id = item.id;
      //   let ghi_chu = "";
      //   if(row_item != undefined && row_item != null){
      //     item.status_nm = row_item.code;
      //     status_cd = row_item.code;
      //     if (
      //       row_item.code === "CSK" ||
      //       row_item.code === "CTT" ||
      //       row_item.code === "NX"
      //     ) {
      //       // eslint-disable-next-line camelcase
      //       status_cd = "DN";
      //     }
      //     ghi_chu =
      //       "Cập nhật trạng thái từ " + item.status_nm + " - " + row_item.code;
      //     if (row_item.code === "TG") {
      //       console.log("row_item", chitieu);
      //       ghi_chu = "Chuyển đổi sang trả góp";
      //       self.item_gop.bank = chitieu.bank_code;
      //       self.item_gop.phi_chuyen = 0;
      //       self.item_gop.san_pham = chitieu.noi_dung;
      //       self.item_gop.tong_tien = chitieu.so_tien;
      //       self.item_gop.ngay_mua = moment(String(chitieu.ngay_chi)).format("YYYY-MM-DD");
      //       let kyObj = self.getKyTinh(chitieu.bank_code, new Date(self.item_gop.ngay_mua), new Date().getDate(), true);
      //       self.item_gop.ky_dau = moment(new Date(kyObj.year, kyObj.month, kyObj.day)).format("YYYY-MM-DD");
            
      //       self.item_gop.ghi_chu = chitieu.note_saoke;
      //       self.addTraGop();
      //     }
      //   } 
      //   params = {
      //     ghi_chu:  isDoiSoat ? 'Cập nhật trạng thái từ DTCSK - DTCSK' : ghi_chu,
      //     status: isDoiSoat ? 'DTCSK' : status_cd,
      //     bank_code: bank_code,
      //     ky_chi: ky_chi,
      //     so_tien: chitieu.so_tien,
      //     id: id,
      //     row_item: null,
      //     row_san_pham: chitieu,
      //   };
        
      //   console.log("params", params);
      //   await axios
      //     .post(config.API_FAMILY + "/api/updateStatusByBank", params)
      //     .then(function (response) {
      //       console.log("succuess");
      //       var data = response.data.data;
      //       if (data !== undefined && data != null) {
      //       }
      //       self.getChiTieus();

      //       // seft.$refs.dialogConfirm.dialog = false
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      //   }
      // });
      // console.log(_chitieu);
      // console.log(status);
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