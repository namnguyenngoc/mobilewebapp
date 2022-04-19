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
                        BLUEPRINT EFFORT
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
                    <v-col cols="12" sm="2" md="2" class="text-right">
                      <v-checkbox
                        v-model="isChangeHour"
                        label="Change hour/week"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="1" md="1" class="ma-0 pb-0 pt-0">
                      <v-text-field
                        v-model="totalHourWeek"
                        hint="Total hour / Week"
                        label="Total hour / Week"
                        class="text-right"
                        suffix="hour/week"
                        :disabled="!isChangeHour"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="1" md="1" class="ma-0 pb-0 pt-0">
                      <v-text-field
                      v-model="efforJsonList.ticketList"
                      counter="50"
                      hint="Ticket List"
                      label="Ticket List"
                      hide-details
                    ></v-text-field>
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
            <v-col cols="12" sm="12" md="12" class="pt-3 mt-5">
              <h5 class="bold">Working days[{{this.workCount}}] CLV/Total:{{this.strMemberTotalCLV}}/{{this.strMemberTotal}} - KPI {{this.sKPICLV.toFixed(1)}}: ({{this.sWloadPercent.toFixed(2)}}%) </h5>
              <h6> {{this.strMemberEffort}} </h6>
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
          <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
            <h4>Ticket <span style="color:red"> <a @click="routerLink(jiraIdSeleted)">{{this.jiraIdSeleted}}</a>: {{this.jiraIdTotalHour}}h ({{this.jiraIdTotalHour*25}} point) : {{this.jiraIdStatus}}({{this.jiraDev}})</span>
            <br/>
            <span>Estimated: {{this.estimatedEffort}}</span>
            <br/>
            <span> {{this.jiraIdTotalHourDetail}}</span>
            </h4>
          </v-col>
          <v-row>
            <v-col cols="12" sm="6" md="6" class="mr-0 pr-0">
              <vue-good-table
                title="Logtimes List"
                styleClass="vgt-table bordered"
                :columns="columnEstimate"
                :rows="tblDataEstimate"
                :paginate="true"
                :lineNumbers="true"
                :search-options="{
                  enabled: true,
                  placeholder: 'Search this table',
                }"
                max-height="300px"
              />
              <!-- <ve-table :columns="columnEstimate" :table-data="tblDataEstimate" :max-height="300" /> -->
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <!-- <hot-table ref="hotSettingComment" :settings="hotSettingComment"> </hot-table> -->
              <vue-good-table
                title="Comment List"
                styleClass="vgt-table bordered"
                :columns="columnComment"
                :rows="tblDataComment"
                :paginate="true"
                :lineNumbers="true"
                :search-options="{
                  enabled: true,
                  placeholder: 'Search this table',
                }"
                max-height="300px"
              />
            </v-col>
          </v-row>
          <v-col cols="12" sm="12" md="6">
            
          </v-col>
          <v-col cols="5" sm="12" md="12" class="mb-0 pb-0">
            <v-switch
              v-model="stackedMode"
              label="Stacked Chart"
              @change="loadChart(dataChart, userTotal)"
            ></v-switch>
          </v-col>
          <v-col cols="5" sm="12" md="12" class="mb-0 pb-0">
              <div id="chart">
                <apexchart type="bar" height="350" 
                :options="chartOptions" :series="series" ref="chartOptions"></apexchart>
              </div>
          </v-col>
          <v-col cols="12">
            <chamConDetail
              ref="chamConDetail"
              :title="chamConTitle"
              :item="chamConItem"
              :v-model="chamConDetaillDialog"
              @refeshList="loadData()"
            />
          </v-col>
          <!-- Row 3 -->
        </v-card-text>
       
      </v-card>
    </v-col>
  </v-row>

</template>
<script>
import axios from 'axios';
import config from '../../config/config';
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
      colTableWorklog: [
        {
          label: 'key',
          field: 'key',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Mã CV', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Assignee',
          field: 'assignee',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Assignee', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        // {
        //   label: 'Nội dung',
        //   field: 'ten_cong_viec',
        //   filterable: true,
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Nội dung', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        // },
        {
          label: 'Eff. Date',
          field: 'effortDate',
          filterable: false,
          type: 'date',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Eff. Date', // placeholder for filter input
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
          label: 'Effort',
          field: 'actualEffort',
          type: 'number',
          filterable: true,
          // formatFn: this.formatPrice,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Effort', // placeholder for filter input
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
          label: 'Logged/Estimated',
          field: 'logged_Estimated',
          type: 'number',
          filterable: true,
          // formatFn: this.formatPrice,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Effort', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: ['Logged Full', 'Logged'], // dropdown (with selected values) instead of text input
              filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
            return value != null ? value : null
          },
          headerField: this.sumEffort,
          tdClass: this.tdClassFunc,
        },
         
        // },
        // {
        //   label: 'Giờ kế tiếp',
        //   field: 'gio_ke_tiep',
        //   filterable: false,
        //   type: 'date',
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Ngày', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        //   formatFn: function (value) {
        //       return value != null ? moment(value).format(config.DATE_TIME_FM) : null
        //   },
        // },
        {
          label: 'Comment',
          field: 'comment',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'comment', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Subject',
          field: 'ticketSubject',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Subject', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        
        // {
        //   label: 'Ghi chú',
        //   field: 'ghi_chu',
        //   filterable: false,
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'Ghi chú', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        // },
      ],
      tblDataWorklog: [
        {
          children: [],
        }
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
          "jiraLink": "",
          "userName": "nam.nguyenngoc",
          "pwd": "qwer@123",
          "jiraDev": "",
          "from": new Date().toISOString().substr(0, 10),
          "to": new Date().toISOString().substr(0, 10),
          "month": 5,
          "week": 10,
          "year": 2021,
          "NAM": {
              "member": "Nam Nguyen Ngoc",
              "account": "nam.nguyenngoc",
              "jiraLog": [],
              "jiraTicketByTimeH": [],
              "total": {}
          },
          "NAM2": {
              "member": "Nam Nguyen Ngoc OLD",
              "account": "doudevnn",
              "jiraLog": [],
              "jiraTicketByTimeH": [],
              "total": {}
          },
          "DUNG": {
              "member": "Dung Cao",
              "account": "203737",
              "jiraLog": [],
              "jiraTicketByTimeH": [],
              "total": {}
          },
          "KHANH": {
              "member": "Khanh Nguyen",
              "account": "203728",
              "jiraLog": [],
              "jiraTicketByTimeH": [],
              "total": {}
          },
          "TRANG": {
              "member": "Trang Nguyen",
              "account": "213960",
              "jiraLog": [],
              "jiraTicketByTimeH": [],
              "total": {}
          },
          "THANH": {
              "member": "Thanh Nguyen",
              "account": "213979",
              "jiraLog": [],
              "jiraTicketByTimeH": [],
              "total": {}
          },
          // "clvMemberList": [
          //     {
          //         "id": "nam.nguyenngoc",
          //         "email": "nam.nguyenngoc@cyberlogitec.com",
          //         "name": "Nguyen Ngoc Nam"
          //     },
          //     {
          //         "id": "203728",
          //         "email": "khanh.vn@cyberlogitec.com",
          //         "name": "Nguyen Van Khanh"
          //     },
          //     {
          //         "id": "213960",
          //         "email": "trang.ng@cyberlogitec.com",
          //         "name": "Nguyen Thi Thuy Trang"
          //     },
          //     {
          //         "id": "213979",
          //         "email": "thanh.nc@cyberlogitec.com",
          //         "name": "Nguyen Chau Thanh"
          //     }
          // ],
          "boardId": {
              "id": 343,
              "self": "https://pim.cyberlogitec.com/jira/rest/agile/1.0/board/343",
              "name": "SML Team CLV",
              "type": "kanban"
          },
          "team": "Smartlink",
          "itemsMember": {},
          "itemsProject": [
              {
                  "self": "https://pim.cyberlogitec.com/jira/rest/api/2/project/12115",
                  "id": "12115",
                  "key": "SLI",
                  "name": "22_SmartLink_SmartAgent [Internal]",
                  "projectTypeKey": "software",
                  "avatarUrls": {
                      "48x48": "https://pim.cyberlogitec.com/jira/secure/projectavatar?pid=12115&avatarId=10200",
                      "24x24": "https://pim.cyberlogitec.com/jira/secure/projectavatar?size=small&pid=12115&avatarId=10200",
                      "16x16": "https://pim.cyberlogitec.com/jira/secure/projectavatar?size=xsmall&pid=12115&avatarId=10200",
                      "32x32": "https://pim.cyberlogitec.com/jira/secure/projectavatar?size=medium&pid=12115&avatarId=10200"
                  },
                  "projectCategory": {
                      "self": "https://pim.cyberlogitec.com/jira/rest/api/2/projectCategory/10208",
                      "id": "10208",
                      "description": "",
                      "name": "Marine (Int. Project)"
                  }
              },
              {
                  "self": "https://pim.cyberlogitec.com/jira/rest/api/2/project/10709",
                  "id": "10709",
                  "key": "SPKA",
                  "name": "SMARTLINK [Internal]",
                  "projectTypeKey": "software",
                  "avatarUrls": {
                      "48x48": "https://pim.cyberlogitec.com/jira/secure/projectavatar?pid=10709&avatarId=10200",
                      "24x24": "https://pim.cyberlogitec.com/jira/secure/projectavatar?size=small&pid=10709&avatarId=10200",
                      "16x16": "https://pim.cyberlogitec.com/jira/secure/projectavatar?size=xsmall&pid=10709&avatarId=10200",
                      "32x32": "https://pim.cyberlogitec.com/jira/secure/projectavatar?size=medium&pid=10709&avatarId=10200"
                  },
                  "projectCategory": {
                      "self": "https://pim.cyberlogitec.com/jira/rest/api/2/projectCategory/10214",
                      "id": "10214",
                      "description": "",
                      "name": "Logistics (Smartlink)"
                  }
              }
          ]
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
      chartOptions: {
        ...this.chartOptions,
        ...{
          chart: {
            // background: "#222",
            // height: 400,
            redrawOnParentResize: true,
            stacked: true,
            toolbar: {
              show: true
            },
            // zoom: {
            //   enabled: true
            // },
            type: "line"
          },
          // colors: ["red", "blue", "green"],
          dataLabels: {
            enabled: true,
            // enabledOnSeries: [2],
            // enabledOnSeries: [0,1,2],
            // formatter: function(value, { seriesIndex, dataPointIndex, w}) {
            //     let indices = w.config.series.map((item, i) => i);
            //     console.log("seriesIndex", seriesIndex);
            //     console.log("dataPointIndex", dataPointIndex);
            //     console.log("w", w);
            //     indices = indices.filter(i => !w.globals.collapsedSeriesIndices.includes(i) 
            //       && _.get(w.config.series, `${i}.data.${dataPointIndex}`) > 0);
            //     console.log("indices", indices);
            //     if (seriesIndex == _.max(indices)){
            //       const totalFm = (w.globals.stackedSeriesTotals[dataPointIndex] / 1).toFixed(0).replace(',', '.');
            //       return totalFm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            //     }
            //     return '';
            //   },
            
          },
          noData: {
            align: "center",
            text: "No data available at the moment",
            verticalAlign: "middle"
          },
          legend: {
            horizontalAlign: 'center',
            position: 'bottom',
            
          },
          plotOptions: {
            bar: {
              borderRadius: 3,
              horizontal: false
            }
          },
          stroke: {
            width: [2,2,2,2,2,2,2,2],
            curve: 'smooth',
          },
          // stroke: {
          //   curve: 'smooth',
          // },
          title: {
            text: "Logtime and KPI"
          },
          // theme: {
          //   mode: "dark"
          // },
          xaxis: {
            categories: [],
            type: "category",
          
          },
          yaxis: [
            
          ],
          tooltip: {
            enabled: true,
          }
        }
      },
      wordloadData: null,
      dataChart: [],
      userTotal: [],
      columnEstimate: [
        {
          label: 'DisplayName',
          field: 'author.name',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'DisplayName', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        // { field: "displayName",   key: "displayName", title: "DisplayName", align: "left" },
        // {
        //   label: 'UserId',
        //   field: 'userId',
        //   filterable: true,
        //   filterOptions: {
        //     styleClass: 'class-filter', // class to be added to the parent th element
        //       enabled: true, // enable filter for this column
        //       placeholder: 'UserId', // placeholder for filter input
        //       filterValue: '',
        //       filterDropdownItems: [], // dropdown (with selected values) instead of text input
        //       // filterFn: this.columnFilterFn, //custom filter function that
        //       trigger: 'enter', //only trigger on enter not on keyup 
        //   },
        // },
        // { field: "userId",        key: "userId",      title: "UserId",      align: "left" },
        {
          label: 'TimeSpent',
          field: 'timeSpent',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'TimeSpent', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        // { field: "timeSpent",     key: "timeSpent",   title: "TimeSpent",   align: "right" },
        {
          label: 'Updated',
          field: 'updated',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Updated', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
              return value != null ? moment(value).format(config.DATE_TIME_FM) : null
          },
        },
        // { field: "updated",       key: "updated",     title: "Updated" },
        // { field: "comment",       key: "comment",     title: "Comment" ,      align: "left" },
        {
          label: 'Comment',
          field: 'comment',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Updated', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
      ],
      tblDataEstimate: [
      ],
      columnComment: [
        {
          label: 'Author Comment',
          field: 'author.name',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Author Comment', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        // { field: "timeSpent",     key: "timeSpent",   title: "TimeSpent",   align: "right" },
        {
          label: 'Updated',
          field: 'updated',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Updated', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
              return value != null ? moment(value).format(config.DATE_TIME_FM) : null
          },
        },
        // { field: "updated",       key: "updated",     title: "Updated" },
        // { field: "comment",       key: "comment",     title: "Comment" ,      align: "left" },
        {
          label: 'Comment',
          field: 'body',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Comment', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
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
    let url = `${config.API_WORKING.JR_API_JIRA}/api/bpEfforts`;
    axios
    .post(url, {})
    .then(async function (response) {
      console.log('response', response);
    });
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
      this.dataChart = dataChart;
      this.userTotal = userTotal;
      let self = this;
        // var endDate = moment('2021-05-31');
        let lsMemberNames = [
            {
                id: 'nam.nguyenngoc',
                name: 'Nam Nguyen Ngoc',
                total: 0
            },
            {
                id: '203737',
                name: 'Dung Cao',
                total: 0
            },
            {
                id: '203728',
                name: 'Khanh Nguyen',
                total: 0
            },
            {
                id: '213960',
                name: 'Trang Nguyen',
                total: 0
            },
            
        ];
        while (this.series.length) {
          this.series.pop();
        }
        while (this.chartOptions.xaxis.categories.length) {
          this.chartOptions.xaxis.categories.pop();
        }
        while (this.chartOptions.yaxis.length) {
          this.chartOptions.yaxis.pop();
        }
       
        let yaxisArr = [];
        let flagShowYaxis = true;
        // for(let i = 0; i < config.CLV_PIM_ACCOUNT.COUNT_CONTRACT; i++){
       
        //  yaxisArr.push(
        //   {
        //     opposite: true,
        //     title: {
        //       text: "(%) Ratio"
        //     }
        //   }
        // );
        
        
        var startDate =  moment(this.trip.start);
        let endDate =  moment(this.trip.end);
        let dateList = this.getDaysBetweenDates(startDate, endDate);
        let serWlogs = [];
        let serKPI = [];
        let serTotal = [];
        let maxTotal = 24;
        let serMM = [];
        let maxMM = 8;
        // let countWD = this.workday_count(moment(this.trip.start), moment(this.trip.end));
        // console.log("data", seft.tblDataWorklog.children);
        console.log("find", lsMemberNames.find( ({ id }) => id === '203728'));
        console.log("dateList", dateList);
        for(var i = 0; i < dateList.length;  i++){
          // this.chartOptions.labels.push(dateList[i]);
          this.chartOptions.xaxis.categories.push(dateList[i]);
          // lsMemberNames.map(mem => `${mem.name}
          let dataTotal = dataChart.filter(function (item) {
            if (userTotal.find( ({ email }) => email === item.emailAddress) != undefined
                  && item.effortDate === dateList[i]) return true
          });
          serWlogs.push(dataTotal.sum('actualEffort'));
          
          serKPI.push(Math.round((dataTotal.sum('actualEffort')/(config.CLV_PIM_ACCOUNT.COUNT_CONTRACT * 8))*100));
          serMM.push(this.formatPrice(dataTotal.sum('actualEffort')/8, 2));
          serTotal.push(dataTotal.sum('actualEffort'));
          // console.log("dataTotal: " +dateList[i], dataTotal.sum('actualEffort'));
        }

        console.log("dateList", dateList);
        console.log("dataChart", dataChart);
        
        let serial2 = [];  
        
            
        //Data
        if(userTotal != undefined && userTotal != null){
          
          for(var i = 0; i < userTotal.length; i ++){
            let item = userTotal[i];

            let effortLog = dataChart.filter(function (itemChart) {
              if (item.email === itemChart.emailAddress)
                    // && item.effortDate === dateList[i]
                  return true
            });
            
           console.log('effortLog',effortLog);
            //array log by date
            let arrLog = [];
            for(var j = 0; j < dateList.length;  j++){
              
              let totalByMemberDate = effortLog.filter(function (item) {
                if (item.effortDate == dateList[j]) return true
              });
              // item.displayName = item.assignee;
              arrLog.push(totalByMemberDate.sum('actualEffort'));
              
             
              // console.log('totalByMemberDate',totalByMemberDate);
            }
            //  console.log('effortLog',effortLog);
           maxTotal = userTotal.length * 8;
           maxMM  = userTotal.length;
            yaxisArr.push({
              max: maxTotal,
              show: flagShowYaxis,
            });

              this.series.push( {
              data: arrLog,
              name: effortLog[0].assignee,
              type: "column"
            });
            
            flagShowYaxis = false;
          }

          //check yaxis
          // this.chartOptions.yaxis.push(
          //   {
          //     max: 100,
          //     min: 0,
          //     opposite: true,
          //     title: {
          //       text: "(%) Ratio"
          //     }
          //   },
          // );

          yaxisArr.push({
            max: maxTotal,
            show: false,
            labels: {
              formatter: function (value) {
                const val = (value).toFixed(1).replace(',', '.')
                return `${val}`;
              }
            },
          });
          
          this.series.push({
            data: serTotal,
            name: 'Total',
            type:'line',
            title: {
              text: "Total"
            }
          });

          yaxisArr.push({
            opposite: true,
            max: maxMM,
            show: true,
            labels: {
              formatter: function (value) {
                const val = (value).toFixed(1).replace(',', '.')
                return `${val}`;
              }
            },
          });
          
          this.series.push({
            data: serMM,
            name: 'M/M',
            type:'line',
            title: {
              text: "M/M"
            }
          });

          yaxisArr.push({
            opposite: true,
            title: {
              text: "(%) Ratio"
            },
            labels: {
              formatter: function (value) {
                const val = (value).toFixed(1).replace(',', '.')
                return `${val}`;
              }
            },
          });
          this.series.push({
            data: serKPI,
            name: 'KPI',
            type:'line'
          });
          self.$refs.chartOptions.updateOptions({ yaxis: yaxisArr,});
          console.log('series',this.series);
        }
        
       
        console.log("chartOptions", this.chartOptions);
        
    },
    async loadData(ticketList) {
      // if (!this.$refs.jrTicketLogTime.validate()) {
      //   return;
      // }
      this.show();
      let seft = this; //Current

      seft.workCount = 0; 
      seft.strMemberTotalCLV= 0;
      seft.strMemberTotal = 1;
      seft.strMemberTotalCLV = 0,
      seft.sKPICLV = 0.0,
      seft.sWloadPercent = 0,
      seft.strMemberEffort = "";

      // seft.isBtnDisable = true;
      // seft.overlay = true;
      // // seft.$refs.hotTableComponent.hotInstance.loadData([]);
      // this.efforJsonList.from =  this.date;
      // this.efforJsonList.to = this.trip.end;
      // // this.efforJsonList.itemsProject = this.itemsProject;
      // this.efforJsonList.team = this.team;
      // // this.projectsName = 'SmartLink [Internal]'
      // this.efforJsonList.itemsMember = this.member;

      // //Count working day
      let countWD = this.workday_count(moment(this.trip.start), moment(this.trip.end));
      // this.workCount = countWD;
      // console.log("countWD",countWD);

      // if(seft.valueProject.key != undefined && seft.valueProject.key.length > 0){
      //   this.efforJsonList.itemsProject = seft.valueProject.key;

      // } else {
      //   this.efforJsonList.itemsProject = this.itemsProject;
      // }

      let url = `${config.API_WORKING.JR_API_JIRA}/api/jiraWorklogs`;
      this.efforJsonList.from = this.trip.start;
      this.efforJsonList.to = this.trip.end;
      this.efforJsonList.clvMemberList = config.CLV_PIM_ACCOUNT.MEM_LIST;
      let parameter = this.efforJsonList;

      // if(ticketList != undefined){
      //   this.efforJsonList.tickets = ticketList;
      // }

      await axios
        .post(url, parameter)
        .then(async function (response) {
          // seft.hotSettings.data = response.data.data;
          // console.log('pimDATA', seft.pimDATA);
          // seft.pimDATA = response.data.data;
          //lstMember
          let data = response.data.data;
          let lsCLV = config.CLV_PIM_ACCOUNT.MEM_LIST;
          console.log("lsCLV", data);
          if(data != undefined && data.length > 0){
            //Total
            let flagMember = "";
            let total;
            seft.strMemberTotalCLV = 0;
            seft.strMemberTotal = 0;
            seft.sKPICLV = 0;
            let emailSeen = new Set();

            //Get email
            for(var i = 0; i < data.length; i++){
              // data[i].assignee;
              emailSeen.add(data[i].emailAddress);
            }
            let userTotal = [];
            for(var i = 0; i < data.length; i++){
              // data[i].assignee;
              // emailSeen.add(data[i].emailAddress);
              for(let email of emailSeen){
                
                if(data[i].emailAddress == email){
                  
                  let user = userTotal.find( ({ email }) => email  === data[i].emailAddress);
                  if(user != undefined && user != null){
                    let memberContract = lsCLV.find( ({ email }) => email  === data[i].emailAddress);
                    // console.log('memberContract',memberContract);
                    if(memberContract != undefined && memberContract != null && memberContract.isBackup == 'N'){
                      user.total += data[i].actualEffort;
                    }
                      // user.total += data[i].actualEffort;
                  }else{
                    userTotal.push({
                      email: data[i].emailAddress,
                      name: data[i].displayName,
                      total: data[i].actualEffort,
                    })
                  }
                }
              }
              // if(data[i].emailAddress == "nam.nguyenngoc@cyberlogitec.com"){
              //   lsMemberNames[0].total += data[i].actualEffort;
              // }
              // else if(data[i].assignee == "Dung Cao"){
              //   lsMemberNames[1].total += data[i].actualEffort;
              // }else if(data[i].assignee == "Khanh Nguyen"){
              //   lsMemberNames[2].total += data[i].actualEffort;
              // }
              
              // if(lsMemberNames.find( ({ name }) => name === data[i].assignee)){
              //   seft.strMemberTotalCLV += data[i].actualEffort;

              // }
              if(lsCLV.find( ({ email }) => email  === data[i].emailAddress)){
                let memberContract = lsCLV.find( ({ email }) => email  === data[i].emailAddress);
                // console.log('memberContract',memberContract);
                if(memberContract != undefined && memberContract != null && memberContract.isBackup == 'N'){
                  seft.strMemberTotalCLV += data[i].actualEffort; //Need to check
                }

              }
              seft.strMemberTotal += data[i].actualEffort;
              

            }
            console.log("userTotal", userTotal);
            console.log("seft.strMemberTotalCLV", seft.strMemberTotalCLV);

            seft.sKPICLV = seft.strMemberTotalCLV/(countWD*8);
            seft.sWloadPercent = (seft.strMemberTotalCLV / (countWD * config.CLV_PIM_ACCOUNT.COUNT_CONTRACT * 8))*100;
            // console.log('KPICLV', self.sKPICLV.toFixed(1));
            let hWeek = countWD*8;
            if(seft.isChangeHour == true){
              hWeek = seft.totalHourWeek;
            }
            seft.strMemberEffort = userTotal.map(mem => `${mem.name}:${mem.total}h - ${mem.total * config.WORKING.blueprintConfig.pointaHour}p (${Math.round(((mem.total/parseInt(hWeek))*100))}%)`).join(', ');
            // console.log("lsMemberNames", lsMemberNames.map(mem => `${mem.name}:${mem.total}`).join(', '));
            // console.log("hWeek", hWeek);
            // console.log("self.isChangeHour", self.isChangeHour);
            // self.tblDataWorklog = data;
            // console.log("wordloadData", self.tblDataWorklog);
            
            seft.tblDataWorklog = 
            [ 
              {
                children: data,
              }
            ];

            seft.loadChart(data, userTotal);
            seft.close();
            // console.log("seft.sogDataItem ", seft.sogDataItem);

                      
          }else{
            seft.tblDataWorklog = 
            [ 
              {
                children: data,
              }
            ];
            seft.close();
          }
          // seft.isBtnDisable = false;
          // seft.overlay = false;
          console.log("seft.sogDataItem ", data);
          
          // seft.tblDataWorklog = 
          // [ 
          //   {
          //     children: data,
          //   }
          // ];
          // seft.tblDataWorklog = data;
          
          
          // seft.$refs.hotTableComponent.hotInstance.loadData(seft.pimDATA);
        
        }).catch((error) => {
            if( error.response ){
              console.log(error.response.data); // => the response payload 
              
            }
            seft.close();
        })
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
