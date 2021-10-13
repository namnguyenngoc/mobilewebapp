<template>
  <v-card>
    <v-card-title class="pb-0">Sức khỏe</v-card-title>
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
          group-by="ngay_bat_dau"
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
        {
          text: 'Ngày',
          value: 'ngay_bat_dau',
          sortable: false,
        },
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
    async getListSucKhoe() {
      const self = this;
      await axios
        .get('http://familyna.ddns.net:81/api/appsuckhoe/selectSucKhoe')
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
