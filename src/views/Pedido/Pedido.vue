<template>
  <v-simple-table
    height="750px"
    fixed-header
  >
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center">
            Ngày bắt đầu
          </th>
          <th class="text-center">
            Anh
          </th>

          <th class="text-center">
            Nhung
          </th>

          <th class="text-center">
            Nam
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
          <td>{{ item.name }}</td>
          <td>{{ item.anh }}</td>
          <td>{{ item.nhung }}</td>
          <td>{{ item.nam }}</td>
          <!-- <td>{{ item.ngaythu }}</td> -->
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
import moment from "moment";
import PizzaCard from "@/components/PizzaCard/PizzaCard";
import BebidaPedido from "@/components/BebidaPedido/BebidaPedido";
export default {
  name: "Pedido",
  components: { PizzaCard, BebidaPedido },
  data() {
    return {
        desserts: [
          // {
          //   name: 'Frozen Yogurt',
          //   calories: 159,
          // },
          // {
          //   name: 'Ice cream sandwich',
          //   calories: 237,
          // },
          // {
          //   name: 'Eclair',
          //   calories: 262,
          // },
          // {
          //   name: 'Cupcake',
          //   calories: 305,
          // },
          // {
          //   name: 'Gingerbread',
          //   calories: 356,
          // },
          // {
          //   name: 'Jelly bean',
          //   calories: 375,
          // },
          // {
          //   name: 'Lollipop',
          //   calories: 392,
          // },
          // {
          //   name: 'Honeycomb',
          //   calories: 408,
          // },
          // {
          //   name: 'Donut',
          //   calories: 452,
          // },
          // {
          //   name: 'KitKat',
          //   calories: 518,
          // },
        ],
        holidays:[
          { holidayDate: "2021-09-02", description: "Quoc Khanh" },
          { holidayDate: "2021-09-03", description: "Quoc Khanh" },
        ],
      }
  },
  created() {
    var ftest = { date: "2021-09-13" };
    var ltest = { date: "2021-10-17"};
    var f = "YYYY-MM-DD";
    var start = moment(ftest.date).add(-1,'days');
    var end = moment(ltest.date).add(1,'days');
    var wd = this.workday_count(start, end);
    this.count_holiday(start, end);
    let count = 0;
    // while (start <= end) {
    //   console.log("start", start.format("YYYY-MM-DD"));
    //     if(this.holidays.find(({ holidayDate }) => holidayDate == start.format("YYYY-MM-DD"))){
    //       count++;
    //     }
    //   start = start.add(1, "days");
    //   this.desserts.push[{
    //     name: start,
    //     calories: count,
    //   }]
    
    // }
    // console.log("valuewd:", this.desserts);
  },
  methods: {
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
    normalizedPizzas: {
      get() {
        
        return this.$store.getters.desserts;
      },
    },
    bebidas: {
      get() {
        return this.$store.getters.getBebidas;
      },
    },
    cachlycovid() {
      let arr  = [];
      arr.push({
        name: 'start',
        calories: 1,
      });
      return arr
      // get() {
      //   return this.$store.getters.getCachlycovid;
      // },
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./Pedido.scss";
</style>
