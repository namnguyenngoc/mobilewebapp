<template>
  <v-card>
    <v-card-title class="pb-0">Shopee</v-card-title>
    <v-row class="ma-0 pb-1 px-1">
      <v-col
        cols="12"
        sm="12"
      >
        <v-data-table
          :headers="headers"
          :items="desserts"
          class="list-table"
          height="650px"
          :fixed-header="true"
          :items-per-page="100"
          :mobile-breakpoint="0"
          :search="search"
          group-by="group_name"
          group-desc
        >
          <template v-slot:top>
            <v-row class="pt-0 pb-0 mb-0 mt-0">
              <v-col
                cols="9"
                sm="9"
                class="pt-0 pb-0 mb-0 mt-0"
              >
                <v-text-field
                  v-model="search"
                  label="Key"
                  class="pt-0 pb-0 mb-0 mt-0"
                ></v-text-field>
              </v-col>
              <v-col
                cols="2"
                sm="2"
                class="pt-0 pb-0 mb-0 mt-0"
              >
                <v-btn @click="toggleAll()">Toggle</v-btn>
              </v-col>
            </v-row>
          </template>
          <template v-slot:group.header="{ group, items, isOpen, toggle }">
            <td>
              <v-btn @click="toggle" small icon :ref="group" :data-open="isOpen">
                  <v-icon v-if="isOpen">{{ icons.mdiMinus }}</v-icon>
                  <v-icon v-else>{{ icons.mdiPlus }}</v-icon>
              </v-btn>
              {{ `${proceseGroupName(group) != null ? proceseGroupName(group)[0] : ''}` }}
            </td>
            <td class="mt-1 mb-1 pt-1 pb-1 text-right">
              {{ `${proceseGroupName(group) != null ? formatPrice(proceseGroupName(group)[2], 0): ''}` }}
            </td>
            <td class="mt-1 mb-1 pt-1 pb-1 text-left">
              <span class="text-bold">{{ `${proceseGroupName(group) != null ? nameByKey(proceseGroupName(group)[4]) : ''}` }} </span>
            </td>
          </template>
          <template v-slot:item.tmdt="{ item }">
            <span>{{ item.tmdt }}</span>
          </template>
          <template v-slot:item="{ item  }">
            <tr>
              <td colspan="3" class="pt-2 pb-2">
                <div><strong>{{ item.ngay_dat_hang }} {{item.nguoi_ban}}</strong></div>
                <div><strong>{{ item.tmdt }}</strong></div>
                <div>Ngày đặt: <strong>{{ formatDate(item.ngay_dat_hang) }}</strong> Ngày giao: <strong>{{ formatDate(item.ngay_giao) }}</strong></div>
                <div>{{ item.so_dien_thoai_nguoi_nhan }}</div>
                <div>{{ item.dia_chi_nhan_hang }}</div>
                <div v-if="item.tmdt == 'LAZADA'">
                  <ul v-for="(kienhang, i) in item.product_list" :key="i" class="mt-1">
                    <li v-for="(obj, prop) in kienhang" :key="prop">
                      <div v-if="prop === 'nguoi_ban'">{{ strToArr(obj, 'Giao vào:')[0] }}<span class="font-weight-bold"> Giao vào:{{ strToArr(obj, 'Giao vào:')[1] }}</span></div>
                      <div v-else-if="prop !== 'san_pham'">{{ obj }}</div>
                      <div v-else>
                        <h4>Sản phẩm</h4>
                        <ul>
                          <li v-for="(val, propsp) in obj" :key="propsp">
                            {{val.ten_sp}}
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <h4>Sản phẩm</h4>
                  <ul class="mt-1">
                    <li v-for="(val, propsp) in item.product_list" :key="propsp">
                      {{val.ten_sp}}
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import {
  mdiMinus,
  mdiPlus,
} from '@mdi/js';

export default {
  name: 'SucKhoe',
  components: {
  },
  data() {
    return {
      search: '',
      desserts: [],
      holidays: [
        { holidayDate: '2021-09-02', description: 'Quoc Khanh' },
        { holidayDate: '2021-09-03', description: 'Quoc Khanh' },
      ],
      headers: [
        // { text: 'Mã ĐH', value: 'ma_don_hang' },
        // { text: 'Shop', value: 'nguoi_ban' },
        {
          text: 'Mã ĐH',
          align: 'left',
          value: 'tmdt',
          sortable: false,
        },
        {
          text: 'Tổng tiền',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Status',
          align: 'left',
          sortable: false,
        },
      ],
      icons: {
        mdiMinus,
        mdiPlus,
      },
    };
  },
  created() {
    this.getListSucKhoe();
  },
  methods: {
    formatDate(str) {
      if (!str) {
        return '';
      }
      const val = moment(str).format('DD/MM/YY HH:mm:ss');

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
    proceseGroupName(str) {
      if (!str) return null;
      const arr = str.split('|');
      if (arr === undefined || arr === null || arr.length === 0) return null;

      return arr;
    },
    nameByKey(str) {
      if (!str) return null;
      let val = str;
      switch (str.trim()) {
        case 'DON_HANG_MOI':
          val = 'ĐHM';
          break;
        case 'DAGIAO':
          val = 'ĐG';
          break;
        default:
          break;
      }

      return val;
    },
    async getListSucKhoe() {
      const self = this;
      await axios
        .get('http://103.148.57.35:81/api/appsuckhoe/selectDonHang/a')
        .then(response => {
          // self.desserts = response.data.data;
          // console.log('desserts', self.desserts);
          /* eslint-disable */
          self.desserts = response.data.data;
          // data = data.forEach(element => {
          //   // let arr = element.group_name.split('|');
          //   // if(arr != undefined && arr != null && arr.length > 0){
          //   //   element.group_ngay_ban = '1111111';
          //   //   console.log('element', element);
          //   // }
          // });
          // data = 
          // console.log('data', data);
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .finally({
          // always executed
        });
    },
    toggleAll() {
      Object.keys(this.$refs).forEach(k => {
        this.$refs[k].$el.click();
      });
    },
    strToArr(str, key){
      console.log('addSpace');
      if(str == undefined || str == null || str.trim().length == 0){
        return null;
      }
      let arr = str.split(key);
      if(arr == undefined || arr == null || arr.length == 1){
        return str;
      }
      
      return arr;
    },
    /* eslint-disable */
    filterOnlyCapsText(value, search, item) {
      return value != null
        && search != null
        && typeof value === 'string'
        && value.toString().toLocaleUpperCase().indexOf(search) !== -1;
    },
  },
};
</script>
<style lang="scss" scoped>
  .custom-row{
    height: 35px !important;
    button{
      height: 30px !important;
    }
  }
  .list-table {
    td {
      height: 35px !important;
    }
  }
  // @import './Bebidas.scss';
</style>
