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
          :items-per-page="10"
          :mobile-breakpoint="0"
          group-by="group_name"
          group-desc
        >
          <template v-slot:group.header="{ group, items, isOpen, toggle }">
            <td colspan="3" class="mt-1 mb-1 pt-1 pb-1 custom-row">
              <v-btn icon @click="toggle" class="h-2">
                <v-icon v-if="isOpen" small>
                  {{ icons.mdiMinus }}
                </v-icon>
                <v-icon v-else small>
                  {{ icons.mdiPlus }}
                </v-icon>
              </v-btn>
              <span>{{ `${proceseGroupName(group) != null ? proceseGroupName(group)[0] : ''}` }}</span>
            </td>
            <td colspan="1" class="mt-1 mb-1 pt-1 pb-1 text-right">
              <span>{{ `${proceseGroupName(group) != null ? formatPrice(proceseGroupName(group)[3], 0): ''}` }}</span>
            </td>
          </template>
          <template v-slot:item.ngay_dat_hang="{ item }">
            <span>{{ formatDate(item.ngay_dat_hang) }}</span>
          </template>
          <template v-slot:item.ngay_giao="{ item }">
            <span>{{ formatDate(item.ngay_giao) }}</span>
          </template>
          <template v-slot:item.tong_so_tien="{ item }">
            <span>{{ formatPrice(item.tong_so_tien/100,0) }}</span>
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
      desserts: [],
      holidays: [
        { holidayDate: '2021-09-02', description: 'Quoc Khanh' },
        { holidayDate: '2021-09-03', description: 'Quoc Khanh' },
      ],
      headers: [
        // { text: 'Mã ĐH', value: 'ma_don_hang' },
        // { text: 'Shop', value: 'nguoi_ban' },
        {
          text: 'Ngày đặt',
          value: 'ngay_dat_hang',
          align: 'center',
          width: '30%',
          sortable: false,
        },
        {
          text: 'Ngày giao',
          value: 'ngay_giao',
          align: 'center',
          width: '30%',
          sortable: false,
        },
        {
          text: 'Tổng tiền',
          value: 'tong_so_tien',
          align: 'right',
          width: '25%',
          sortable: false,
        },
        {
          text: 'Status',
          value: 'trang_thai_don_hang',
          align: 'right',
          width: '15%',
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
      const arr = str.split('_');
      if (arr === undefined || arr === null || arr.length === 0) return null;

      return arr;
    },
    async getListSucKhoe() {
      const self = this;
      await axios
        .get('http://103.148.57.35:81/api/appsuckhoe/selectDonHang/a')
        .then(response => {
          self.desserts = response.data.data;
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .finally({
          // always executed
        });
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
