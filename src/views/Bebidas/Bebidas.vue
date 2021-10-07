<template>
  <v-simple-table
    height="750px"
    fixed-header
  >
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center">
            Ngày
          </th>
          <th class="text-center">
            HA Trương
          </th>

          <th class="text-center">
            HA Thu
          </th>

          <th class="text-center">
            CN (Kg)
          </th>
          
          <!-- <th class="text-center">
           Ngày thứ
          </th> -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in desserts"
          :key="item.id"
          :class="item.huyet_ap_tam_truong"
        >
          <td>{{ item.ngay_bat_dau }}</td>
          <td>{{ item.huyet_ap_tam_truong }}</td>
          <td>{{ item.huyet_ap_tam_thu }}</td>
          <td>{{ formatPrice(item.can_nang/100,2) }}</td>
          <!-- <td>{{ item.ngaythu }}</td> -->
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
import moment from "moment";
import axios from "axios";
import BebidaCard from "@/components/BebidaCard/BebidaCard";
export default {
  name: "Bebidas",
  components: {
    BebidaCard,
  },
  data() {
    return {
      desserts: [],
      holidays:[
          { holidayDate: "2021-09-02", description: "Quoc Khanh" },
          { holidayDate: "2021-09-03", description: "Quoc Khanh" },
        ],
    };
  },
  created() {
    this.getListSucKhoe();
  },
  methods: {
    formatPrice(value, tofix) {
      const val = (value / 1).toFixed(tofix).replace(",", ".");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async getListSucKhoe(name){
      let self = this;
      await axios
        .get(`http://familyna.ddns.net:81/api/appsuckhoe/selectSucKhoe`)
        .then(async function (response) {
          // seft.hotSettings.data = response.data.data;
          self.desserts = response.data.data;
          console.log('jiraBoards', response.data);
        });
    }
  }

};
</script>
<style lang="scss" scoped>
  @import './Bebidas.scss';
</style>
