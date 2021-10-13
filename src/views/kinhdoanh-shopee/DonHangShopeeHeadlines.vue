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
            <td class="mt-1 mb-1 pt-1 pb-1 text-center">
              {{ `${proceseGroupName(group) != null ? formatDate(proceseGroupName(group)[3]) : ''}` }}
            </td>
            <td class="mt-1 mb-1 pt-1 pb-1 text-right">
              {{ `${proceseGroupName(group) != null ? formatPrice(proceseGroupName(group)[2], 0): ''}` }}
            </td>
            <td class="mt-1 mb-1 pt-1 pb-1 text-left">
              <span class="text-bold">{{ `${proceseGroupName(group) != null ? proceseGroupName(group)[4] : ''}` }} </span>
            </td>
          </template>
          <template v-slot:item.ngay_dat_hang="{ item }">
            {{ item.dia_chi_nhan_hang }}
          </template>
          <template v-slot:item.ngay_giao="{ item }">
            {{ item.ngay_giao }}
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
          text: 'Ngày đặt',
          value: 'ngay_dat_hang',
          align: 'left',
          width: '30%',
          colspan: '3',
          sortable: false,
        },
        {
          text: 'Ngày giao',
          align: 'center',
          width: '30%',
          sortable: false,
        },
        {
          text: 'Tổng tiền',
          align: 'right',
          width: '25%',
          sortable: false,
        },
        {
          text: 'Status',
          align: 'left',
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
      const arr = str.split('|');
      if (arr === undefined || arr === null || arr.length === 0) return null;

      return arr;
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
