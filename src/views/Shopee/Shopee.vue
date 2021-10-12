<template>
  <v-simple-table
    height="750px"
    fixed-header
  >
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center">
            Mã ĐH
          </th>
          <th class="text-center">
            Shop
          </th>
          <th class="text-center">
            Ngày đặt
          </th>

          <th class="text-center">
            Ngày giao
          </th>

          <th class="text-center">
            Tổng tiền
          </th>
          <th class="text-center">
            Trạng thái
          </th>
          
          <!-- <th class="text-center">
           Ngày thứ
          </th> -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in desserts"
          :key="item.name"
          :class="item.class"
        >
          <td>{{ item.ma_don_hang }}</td>
          <td>{{ formatDate(item.nguoi_ban) }}</td>
          <td>{{ formatDate(item.ngay_dat_hang) }}</td>
          <td>{{ formatDate(item.ngay_giao) }}</td>
          <td>{{ formatPrice(item.tong_so_tien, 0) }}</td>
          <td>{{ item.trang_thai_don_hang }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "Shopee",
  components: { },
  data() {
    return {
        desserts: [
         
        ],
        holidays:[
          { holidayDate: "2021-09-02", description: "Quoc Khanh" },
          { holidayDate: "2021-09-03", description: "Quoc Khanh" },
        ],
      }
  },
  created() {
   this.selectDonHang();
   
  },
  methods: {

    formatPrice(value, tofix) {
      const val = (value / 1).toFixed(tofix).replace(",", ".");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatDate(str){
      return moment(str).format("DD/MM/YY HH:mm:ss")
    },
    async selectDonHang (){
      let self = this;
      await axios.get(`http://103.148.57.35:81/api/appsuckhoe/selectDonHang/a`)
      .then(function (response) {
        // handle success
        self.desserts = response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    },
    workday_count(start, end) {
      var first = start.clone().endOf("week"); // end of first week
      var last = end.clone().startOf("week"); // start of last week
      var days = (last.diff(first, "days") * 5) / 7; // this will always multiply of 7
      var wfirst = first.day() - start.day(); // check first week
      if (start.day() == 0) --wfirst; // -1 if start with sunday
      var wlast = end.day() - last.day(); // check last week
      if (end.day() == 6) --wlast; // -1 if end with saturday
      var holidays = this.count_holiday(start, end);
      return wfirst + Math.floor(days) + wlast - holidays; // get the total
      }, //              ^ EDIT: if days count less than 7 so no decimal point
    count_holiday(start, end){
      let count = 0;
      let dCovid = 1;
      let dCovid2 = 0;
      let fmDate = "YYYY-MM-DD";
      let fmDate2 = "ddd DD-MM-YYYY";
      let today =  moment().format(fmDate);
      while (start <= end) {
        console.log("start", start.format(fmDate));
        if(this.holidays.find(({ holidayDate }) => holidayDate == start.format(fmDate))){
          count++;
        }
        
        start = start.add(1, "days");
        
        this.desserts.push({
          name: start.format(fmDate2),
          anh: dCovid > 28 ? '' : dCovid,
          nhung: dCovid > 28 ? '' : dCovid,
          nam: '2021-09-19' <= start.format(fmDate) ? (dCovid2 ++ > 27 ? '' : dCovid2) : '',
          class:  today == start.format(fmDate) ? 'current' : (today > start.format(fmDate) ? 'pass' : '') 
        });

        dCovid++;

      }
      return count;
    },
  },
  computed: {
    
   
  },
};
</script>
<style lang="scss" scoped>
@import "./Shopee.scss";
</style>
