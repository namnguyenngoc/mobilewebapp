<template>
  <v-card>
    <v-card-title class="pb-0">Sức khỏe mang thai</v-card-title>
    <v-row class="ma-0 pb-0">
      <v-col
        cols="12"
        sm="12"
        class="ma-0 pb-0"
        style="color:#FFFFFF"
      >
      <h5 color="warning" style="background:#fafafa;" class="pa-1 pt-2 pb-2">Hôm nay: {{ tuan_tuoi }}</h5>
      </v-col>
    </v-row>
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
          group-by="ngay_bat_dau_group"
          group-desc
        >
          <template v-slot:group.header="{ group, items, isOpen, toggle }">
            <td colspan="5" class="mt-1 mb-1 pt-1 pb-1 custom-row">
              <v-btn icon @click="toggle" class="h-2">
                <v-icon v-if="isOpen" small>
                  {{ icons.mdiMinus }}
                </v-icon>
                <v-icon v-else small>
                  {{ icons.mdiPlus }}
                </v-icon>
              </v-btn>
              <span>{{ group }}</span>
            </td>
          </template>
          <template v-slot:item.can_nang="{ item }">
            <span>{{ formatPrice(item.can_nang/100,2) }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import axios from 'axios';
import config from '../../config/config';

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
      tuan_tuoi: '',
      holidays: [
        { holidayDate: '2021-09-02', description: 'Quoc Khanh' },
        { holidayDate: '2021-09-03', description: 'Quoc Khanh' },
      ],
      headers: [
        {
          text: 'Trương',
          value: 'huyet_ap_tam_truong',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Thu',
          value: 'huyet_ap_tam_thu',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Tim',
          value: 'nhip_tim',
          align: 'right',
          sortable: false,
        },
        {
          text: 'SPO2',
          value: 'spo2',
          align: 'right',
          sortable: false,
        },
        {
          text: 'CN (Kg)',
          value: 'can_nang',
          align: 'right',
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
    this.getCurrentDate();
    this.getListSucKhoe();
  },
  methods: {
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
    async getCurrentDate() {
      const self = this;
      
      await axios
        .get(`${config.API_URL}/getCurrentDate/2021-03-01`)
        .then(response => {
          // seft.hotSettings.data = response.data.data;
          
          self.tuan_tuoi = response.data.data[0].ngay_bat_dau_group;
        });
    },
    async getListSucKhoe() {
      const self = this;
      await axios
        .get(`${config.API_URL}/selectSucKhoe`)
        .then(response => {
          // seft.hotSettings.data = response.data.data;

          self.desserts = response.data.data;
          console.log('jiraBoards', response.data);
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
