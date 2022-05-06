<template>
  <v-row class="match-height">
    <v-col col="12">
      <v-card>
        <v-card-title class="pt-5 pb-2 mr-0 pr-2">
           <v-col cols="12" sm="12" md="11" class="pa-0 ma-0">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row no-gutters>
                    <v-col cols="12" md="2" sm="12">
                      <v-btn
                        color="warning"
                        dark
                        v-bind="attrs"
                        class="rounded-pill"
                        v-on="on"
                        @click="openSOGSheet()"
                      >
                        DATA MODEL
                      </v-btn>
                    </v-col>
                    <v-col
                      cols="12" md="9" 
                      sm="12"
                      class="text--secondary"
                    >
                      <v-row
                        justify="space-around"
                        no-gutters
                      >
                        <v-col cols="12" md="5" sm="6" >
                          <v-menu
                            ref="startMenu"
                            :close-on-content-click="false"
                            :return-value.sync="trip.start"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="trip.start"
                                label="Start date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              no-title
                              scrollable
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.startMenu.isActive = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.startMenu.save(date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>

                        <v-col cols="12" md="5" sm="6">
                          <v-menu
                            ref="endMenu"
                            :close-on-content-click="false"
                            :return-value.sync="trip.end"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="trip.end"
                                label="End date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date"
                              no-title
                              scrollable
                            >
                              <v-spacer></v-spacer>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.endMenu.isActive = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.endMenu.save(date)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="text-right">
                     <v-textarea
                      name="input-7-1"
                      width="100%"
                      height="300"
                      filled
                      light="true"
                      value="12"
                      hint="Hint text"
                    ></v-textarea>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            </v-col>
            
            <v-col
               cols="12" md="1" sm="12"
              class="text--secondary pr-2"
            >
              <v-btn
                color="info"
                @click="loadData()"
              >
                <!-- <v-icon>
                    {{ icons.mdiReload }}
                </v-icon> -->
                Search
              </v-btn>
            </v-col>
           
          <!-- <v-col cols="10" md="10" class="pa-0 ma-0">
            jiraLogTimeList.vue
          </v-col>
          <v-col cols="2" md="2" class="pa-0 ma-0 text-right">
            
          </v-col> -->
        </v-card-title>
        
        <v-card-text class="mt-0 mb-0 pt-1 pb-1 ma-0 pa-0">
          <!-- Row 1 -->
          <v-col cols="12" md="12" class="ma-0 pa-0" >
            <vue-good-table
              title="Logtimes"
              styleClass="vgt-table bordered"
              :columns="colTableWorklog"
              :rows="tblDataWorklog"
              :paginate="true"
              :lineNumbers="true"
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :group-options="{
                enabled: true,
                headerPosition: 'top',
              }"
              @on-row-dblclick="onRowDoubleClick"
              @on-cell-click="onCellClick"
              max-height="700px"
              />
          </v-col>
          
        </v-card-text>
       
      </v-card>
    </v-col>
  </v-row>

</template>
<script>
import axios from 'axios';
import config from '../../config/config';
import bprint from '../../config/bpModel';


import moment from "moment";
import momentBiz from 'moment-business-days';
import "vue-easytable/libs/theme-dark/index.css";
import { VueGoodTable } from 'vue-good-table';
import chamConDetail from "../family-chamcon/ChamConDetail";

import {
  mdiMinus,
  mdiOneUp,
  mdiPlus,
  mdiDeleteOutline,
  mdiCircleEditOutline,
  mdiSleep,
  mdiReload
} from '@mdi/js';
import { reactive } from '@vue/composition-api';

export default {
  name: 'SucKhoe',
  components: {
    VueGoodTable,
    chamConDetail,
    momentBiz
  },
  data() {
    return {
      loadingInstance: null,
      // Entity Name	Entity Definition	Attribute Name	Attribute Definition	Domain Name	Attribute Datatype	Attribute Is PK	Attribute Is FK	Attribute Required	Table Name	Column Name
      colTableWorklog: [
        {
          label: 'Entity Name',
          field: 'ettNm',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Entity Name', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
      
        {
          label: 'Entity Definition',
          field: 'entityDefinition',
          filterable: false,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Entity Definition', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
              return value != null ? moment(value).format(config.DATE_FM) : null
          },
        },
        {
          label: 'Attribute Name',
          field: 'attributeName',
          type: 'number',
          filterable: true,
          // formatFn: this.formatPrice,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Attribute Name', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
            return value != null ? value : null
          },
          headerField: this.sumEffort,
        },
        {
          label: 'Attribute Definition',
          field: 'attributeDefinition',
          type: 'number',
          filterable: true,
          // formatFn: this.formatPrice,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Attribute Definition', // placeholder for filter input
              filterValue: '',
              filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
            return value != null ? value : null
          },
          headerField: this.sumEffort,
          tdClass: this.tdClassFunc,
        },
       
        {
          label: 'Domain Name',
          field: 'domainName',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Domain Name', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Attribute Datatype',
          field: 'ticketSubject',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Attribute Datatype', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Attribute Is PK',
          field: 'attributeIsPK',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Attribute Is PK', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        
        {
          label: 'Attribute Is FK',
          field: 'attributeIsFK',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'AttrAttribute Is FK', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        
        {
          label: 'Attribute Required',
          field: 'attributeRequired',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Attribute Required', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
         {
          label: 'Table Name',
          field: 'tableName',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Table Name', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
         },
        {
          label: 'Column Name',
          field: 'columnName',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Column Name', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        // },
      ],
      tblDataWorklog: [
      ],
      chamConTitle: '',
      chamConItem: {},
      chamConDetaillDialog: false,
      icons: {
        mdiMinus,
        mdiOneUp,
        mdiPlus,
        mdiDeleteOutline,
        mdiCircleEditOutline,
        mdiSleep,
        mdiReload
      },
      workCount: 0,
      strMemberTotal: 0,
      strMemberTotalCLV: 0,
      sKPICLV: 0.0,
      sWloadPercent: 0,
      strMemberEffort: "",
      strMemberEffort: "",
      isChangeHour: false,
      totalHourWeek: 40,
      efforJsonList: {
          
      },
      date: null,
      trip: {
        name: '',
        location: null,
        start: moment().subtract(1, 'days').format(config.DATE_FM),
        end: moment().subtract(0, 'days').format(config.DATE_FM),
      },
      locations: ['Australia', 'Barbados', 'Chile', 'Denmark', 'Ecuador', 'France'],
      series: [],
      stackedMode: false,
      
      wordloadData: null,
      dataChart: [],
      userTotal: [],
      
      tblDataEstimate: [
      ],
      
      tblDataComment: [
      ],
    }
  },
  created() {
    this.loadingInstance = this.$veLoading({
        target: document.querySelector("#loading-container"),
        // 等同于
        // target:"#loading-container"
        name: "wave",
    });
    // this.loadChart();
    
    // let endDate =  moment(new Date());
    // let dateList = this.getDaysBetweenDates(this.trip.start, this.trip.end);
    // for(var i = 0; i < dateList.length;  i++){
    //   this.chartOptions.labels.push(dateList[i]);
    // }

    let dateStartWeek = momentBiz(momentBiz(new Date()).startOf('isoWeek').isoWeekday(2), "YYYY-MM-DD").businessSubtract(0);
   
    this.trip.start = new Date(momentBiz(dateStartWeek, 'YYYY-MM-DD')._d).toISOString().substr(0, 10);
    // let url = `${config.API_WORKING.JR_API_JIRA}/api/bpEfforts`;
    // axios
    // .post(url, {})
    // .then(async function (response) {
    //   console.log('response', response);
    // });
    // this.loadData();
  },
  computed: {
     
  }, // end method
  mounted() {
    Array.prototype.sum = function (prop) {
        var total = 0
        for ( var i = 0, _len = this.length; i < _len; i++ ) {
            total += this[i][prop]
        }
        return total
    }
    // this.show();
  }, // end method
  destroyed() {
    this.loadingInstance.destroy();

  }, // end method

  methods: {
    formatPrice(value, tofix) {
      if (!value) {
        return ''
      }
      const val = (value / 1).toFixed(tofix).replace(',', '.')
      if (!val) {
        return ''
      }

      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
      while (start <= end) {
        console.log("start", start.format("YYYY-MM-DD"));
        if(config.WORKING.holidays.find(({ holidayDate }) => holidayDate == start.format("YYYY-MM-DD"))){
          count++;
        }
        start = start.add(1, "days");
       
      }
      return count;
    },
    sumEffort(rowObj) {
    	// console.log('sumEffort', rowObj);
    	let sum = 0;
      for (let i = 0; i < rowObj.children.length; i++) {
        sum += parseFloat(rowObj.children[i].actualEffort);
      }
      return sum;
    },
    getDaysBetweenDates(startDate, endDate) {
        var now = startDate.clone(), dates = [];
  
        while (now.isSameOrBefore(endDate)) {
            if(momentBiz(now.format('YYYY-MM-DD'),'YYYY-MM-DD').isBusinessDay()){
              dates.push(now.format('YYYY-MM-DD'));

            }
            now.add(1, 'days');
        }
        return dates;
    },
    chartChange(){
      this.chartOptions.chart.stacked = true;
      this.loadChart(this.dataChart, this.userTotal);
    },
    loadChart(dataChart, userTotal){
      console.log('Load Chart');
      console.log('Load Chart', dataChart);
    },
    loadData(ticketList) {
      // if (!this.$refs.jrTicketLogTime.validate()) {
      //   return;
      // }
      this.show();
      let seft = this; //Current
      try{
        this.tblDataWorklog = this.bprint.model.actAttrLst;
        console.log('Load Chart', this.bprint.model.actAttrLst);
        this.close();
          
      } catch (error) {
        this.close();
      }
    },
    show() {
        this.loadingInstance.show();
    },
    close() {
        this.loadingInstance.close();
    },
    onRowDoubleClick(params) {
    // params.row - row object 
    // params.pageIndex - index of this row on the current page.
    // params.selected - if selection is enabled this argument 
    // indicates selected or not
    // params.event - click event
    //load data logtime
      this.tblDataEstimate = params.row.worklogList;
      this.tblDataComment = params.row.commentList;
    },
    openSOGSheet(){
      let data = this.tblDataWorklog[0].children;

      //set data to dialog
      // seft.sogDataItem = data;
      this.sogDataItem  = [];
      for(let i = 0; i < data.length; i ++){
        let item = data[i];
        let ob = {
          title : item.ticketSubject,
          month : item.effortDate,
          issue :item.key,
          projectName: 'SMARTLINK [Internal]',
          worklog : item.actualEffort,
          taskType : item.taskType,
          new : 'N',
          team : 'SML PF',
          name : item.displayName,
          employeeNumber : item.name,
        }
          // seft.sogDataItem.title = item.ticketSubject;
          // seft.sogDataItem.month = item.effortDate;
          // seft.sogDataItem.issue = item.ticketSubject;
          // seft.sogDataItem.projectName = item.project;
          // seft.sogDataItem.worklog = item.actualEffort;
          // seft.sogDataItem.taskType = item.taskType;
          // seft.sogDataItem.new = item.ticketSubject;
          // seft.sogDataItem.team = item.ticketSubject;
          // seft.sogDataItem.name = item.displayName;
          // seft.sogDataItem.employeeNumber = item.name;
          this.sogDataItem.push(ob);
      };
      // for(let i = 0; i < data.length; i++)
      console.log("seft.sogDataItem ", this.sogDataItem);
      // this.$refs.sogWorkLog.tblDataWorklog = this.sogDataItem;
      this.$router.push({ 
          path: "/working/jira-logtime-sog", 
          query: {
              tblDataWorklog: this.sogDataItem 
            } 
        });
      // window.open(route.href);
      // this.$router.push({ name: 'Jira Logtime SOG' });
      // this.dialog = true;
    },
    tdClassFunc(row) {
        
        if(row != undefined && row.aggregateprogress != undefined && row.timeoriginalestimate != undefined){
          if (row.aggregateprogress >= row.timeoriginalestimate) {
            return 'red-class';
          }
        }
        return 'green-class';
        
    },
    columnFilterFn: function(data, filterString) {
      let arr = data.split('/');
      if(filterString == 'Logged')
        return parseFloat(arr[0]) < parseFloat(arr[1]) ;
      else if(filterString == 'Logged Full')
        return parseFloat(arr[0]) >= parseFloat(arr[1]) ;
      return data;
    },
    onCellClick(params) {
      // params.row - row object 
      // params.column - column object
      // params.rowIndex - index of this row on the current page.
      // params.event - click event
      console.log(params);
      if('key' == params.column.field){
        this.routerLink(params.row.cLTTicket);
      }
    },
    routerLink(jiraTicket){
      // let route = this.$router.resolve({path: `${config.JR_PIM_URL}/${jiraTicket}`});
      // let route = this.$router.resolve('/link/to/page'); // This also works.
      window.open(`${config.JR_PIM_URL}/${jiraTicket}`, '_blank');
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
  .text-right.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot{
  // .text-right > .v-text-field__slot > input{
    text-align: right !important;
  }
  // @import './Bebidas.scss';
  .countdown {
    float: right;
  }
  .class-filter input[name='vgt-ky_chi'], .class-filter input[name='vgt-so_tien'] {
    text-align: right;
    color:#606266
  }
  .red-class{
    background: #ebb8c4 !important;
  }
</style>
