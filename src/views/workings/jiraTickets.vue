<template>
  <v-container fluid ma-0 pa-2>
    
      <v-row class="mr-5 ml-1 mb-0 pb-0 mt-1">
          <v-form
            ref="jrTicket"
            v-model="valid"
            lazy-validation
          >
           <v-row>
            <v-col cols="12" sm="3" md="2" class="pt-0 pb-0 mt-0 mb-0">
                <v-select
                  v-model="valueBoard.id"
                  :items="itemsBoard"
                  label="Board Name"
                  item-text="name"
                  item-value="id"
                  return-object
                  hide-details
                  required
                  :rules="emptyRules.select"
                  @change="boardChange()"
                ></v-select>
            </v-col>
            <v-col cols="12" sm="2" md="3" class="pt-0 pb-0 mt-0 mb-0">
              <v-select
                v-model="valueProject.key"
                :items="itemsProject"
                label="Project Name"
                item-text="name"
                item-value="key"
                multiple
                hide-details
                return-object
                @change="projectChange()"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="1" md="1" class="pt-0 pb-0 mt-0 mb-0 pl-0 pr-0">
              <v-checkbox
                v-model="isSearchByDate"
                label="Search by date"
                hide-details
              ></v-checkbox>
            </v-col>
          
            <v-col cols="12" sm="1" md="1" class="pt-0 pb-0 mt-0 mb-0 pl-0 pr-0">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                hide-details
                min-width="auto"
                
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Start Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    hide-details
                    :disabled="!isSearchByDate"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="1" md="1" class="pt-0 pb-0 mt-0 mb-0 pl-0 pr-0">
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                :return-value.sync="date2"
                transition="scale-transition"
                offset-y
                min-width="auto"
                hide-details
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date2"
                    label="End Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    hide-details
                    :disabled="!isSearchByDate"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date2" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu2 = false"> Cancel </v-btn>
                  <v-btn text color="primary" @click="$refs.menu2.save(date2)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            
            <v-col cols="12" sm="2" md="2" class="pt-0 pb-0 mt-0 mb-0">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="prefixCodeProject"
                    counter="50"
                    label="Code"
                    hide-details
                    required
                    :rules="emptyRules.text"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="jSQLKey"
                    counter="50"
                    label="SQL KEY"
                    hide-details
                    required
                    :rules="emptyRules.text"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="2" md="2" class="pt-0 pb-0 mt-0 mb-0">
              <v-select
                  v-model="valueStatus"
                  :items="itemStatusCat"
                  label="Status"
                  item-text="name"
                  item-value="key"
                  multiple
                  hide-details
                  return-object
                  required
                  :rules="emptyRules.select2"
                ></v-select>
            </v-col>
          
            <!-- <v-col cols="12" sm="1" md="1" class="pt-5 text-left">
              <v-btn color="success" @click="getWorklogByTicket()"> Search by  Jira Ticket</v-btn>
            </v-col> -->
            </v-row>
          </v-form> 
      </v-row>
        <v-row class="mr-5 ml-1 mb-0 pb-0 pt-0 pb-0 mt-0 mb-0">
        
          <v-col cols="12" sm="4" md="4" class="pt-0 pb-0 mt-0 mb-0">
            <v-text-field
              v-model="efforJsonList.ticketList"
              counter="50"
              hint="Ticket List"
              label="Ticket List"
              hide-details
              @keypress="$event.keyCode === 13 ? jiraNewTicketByListID() : false"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="5" md="5" class="pt-0 pb-0 mt-0 mb-0">
            <v-text-field
              v-model="efforJsonList.assigneeList"
              counter="50"
              hint="Assignee List"
              label="Assignee List"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1" md="1" class="pt-0 pb-0 mt-0 mb-0 pl-0 pr-0">
            <v-checkbox
              v-model="isShowPicDev"
              label="Show pic DEV"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="1" md="1" class="pt-0 pb-0 mt-0 mb-0">
            <v-text-field
              v-model="efforJsonList.jiraDev"
              :prefix="getPrefixCodeProject"
              counter="50"
              hint="Jira ticket"
              label="Jira ticket"
              hide-details
              @keypress="$event.keyCode == 13 ? getWorklogByTicket() : false"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1" md="1" class="text-right pt-2 pb-0 mt-0 mb-0">
            <v-btn color="success" @click="jiraNewTickets()" default>Search</v-btn>
          </v-col>

        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="12" class="ma-0 pb-0 pt-0">
            <h3 class="bold">List ticket {{this.tblTickets.length}}</h3>
          </v-col>
          <v-col cols="12" md="12" class="ma-0 pa-0" >
            <vue-good-table
              title="List ticket"
              styleClass="vgt-table bordered"
              :columns="colTickets"
              :rows="tblTickets"
              :paginate="true"
              :lineNumbers="true"
              :search-options="{
                enabled: true,
                placeholder: 'Search this table',
              }"
              :group-options="{
                enabled: true,
                headerPosition: 'top',
                collapsable: true
              }"
              max-height="500px"
              @on-row-dblclick="onRowDoubleClick"
              />
          </v-col>   
          <v-col cols="12" sm="12" md="12" class="pt-0" v-show="false">
            <!-- <hot-table ref="hotTableComponent" :settings="hotSettings"> </hot-table> -->
            <!-- <ve-table 
            :columns="columnTicket" 
            :table-data="tblDataTicket" 
            :max-height="500" 
            /> -->
          </v-col>
      
      </v-row>
        
      <v-row>
        <v-col cols="12" sm="10" md="10" class="mb-0 pb-0">
          <h4>Ticket <span style="color:red"> <a @click="routerLink(jiraIdSeleted)">{{this.jiraIdSeleted}}</a>: {{this.jiraIdTotalHour}}h ({{this.jiraIdTotalHour*25}} point) : {{this.jiraIdStatus}}({{this.jiraDev}})</span>
          <br/>
          <span>Estimated: {{this.estimatedEffort}}</span>
          <br/>
          <span> {{this.jiraIdTotalHourDetail}}</span>
          </h4>
        </v-col>
        
        <v-col cols="12" sm="12" md="6" class="mr-0 pr-0">
          <v-col cols="12" sm="12" md="12" class="mt-0 pt-0 pr-0 mr-0 pb-1 text-right">
          <!-- <v-btn color="warning" @click="exportCSV()" :disabled='true'> Export CSV</v-btn> -->
          <!-- var exportPlugin1 = hot1.getPlugin('exportFile'); -->
          <v-btn
            color="warning"
            dark
            v-bind="attrs"
            v-on="on"
          >
            Add Worklog
          </v-btn>
        </v-col>
          <ve-table :columns="columnEstimate" :table-data="tblDataEstimate" :max-height="300" />
        </v-col>

        <v-col cols="12" sm="12" md="6">
          <!-- <hot-table ref="hotSettingComment" :settings="hotSettingComment"> </hot-table> -->
          <ve-table 
          :columns="columnComment" 
          :table-data="tblDataComment"
          
          :height="300" />
        </v-col>

        <v-col cols="12" sm="12" md="6">
          
        </v-col>

      </v-row>

   
   
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    
  </v-container>
</template>
<script>
import axios from "axios";
import moment from "moment";
import momentBiz from 'moment-business-days';
import config from "../../config/config";
export default {
  components: {
  },
  data() {
    let self = this;
    return {
      // date: new Date((new Date()).valueOf() - 1000*3600*24).toISOString().substr(0, 10),
      emptyRules: {
        text:   [v => !!v || "Item is required"],
        select: [(v) => !!v || "Item is required"],
        select2: [(v) =>  v.length>0 || "Item is required in select 2"],
      },
      date: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      menu: false,
      menu2: false,
      valid: true,
      isShowPicDev: false,
      clvKPI: [],
      team: "Smartlink",
      projectsName: "SPKA",
      searchValue: "",
      valueBoard: {},
      itemsBoard: [],
      valueProject:{},
      valueStatus:[
        {
          key: 'To Do', 
          name: 'To Do'
        }, 
        {
          key: 'In Progress',
          name: 'In Progress'
        },
      ],
      itemsProject: [],
      jSQLKey: 'in',
      isSearchByDate: false,
      itemStatusCat: [
        {
          key: 'To Do', 
          name: 'To Do'
        }, 
        {
          key: 'In Progress',
          name: 'In Progress'
        }, 
        {
          key: 'Done',
          name: 'Done'
        }
        ],
      isBtnDisable: false,
      jiraLinkRoot:
        "https://pim.cyberlogitec.com/jira/rest/clt-gadget/latest/getWorklogByUser.json?",
      jiraLink: "",
      userName:"",
      pwd: "",
      jiraDev:"",
      
      //startdate=2021-04-01&enddate=2021-04-30&projects=SPKA,
      efforJsonList: {
        jiraLink: "",
        userName:"",
        pwd: "",
        jiraDev:"",
        from: this.date,
        to: this.date2,
        // projectsName: "SmartLink [Internal]",
        month: 5,
        week: 10,
        year: 2021,
        NAM: {
          member: "Nam Nguyen Ngoc",
          account: "doudevnn",
          jiraLog: [],
          jiraTicketByTimeH: [],
          total: {},
        },
        DUNG: {
          member: "Dung Cao",
          account: "203737",
          jiraLog: [],
          jiraTicketByTimeH: [],
          total: {},
        },
        KHANH: {
          member: "Khanh Nguyen",
          account: "203728",
          jiraLog: [],
          jiraTicketByTimeH: [],
          total: {},
        },
        ticketList: [],
        assigneeList: config.CLV_PIM_ACCOUNT.SML_TEAM,
        valueProjectSelected: []
      },
      pimDATA: [],
      jiraIdSeleted: "",
      jiraIdTotalHour: 0,
      holidays:[
        '2020-09-02'
        ,'2020-04-30'
        ,'2020-05-01'
        ,'2020-01-01'
        ,'2021-01-01'
        ,'2021-02-10'
        ,'2021-02-11'
        ,'2021-02-12'
        ,'2021-02-15'
        ,'2021-02-16'
        ,'2021-04-21'
        ,'2021-04-30'
        ,'2021-05-01'
        ,'2021-05-03'
        ,'2021-09-02'
      ],
      overlay: false,
      jiraIdSeleted: "",
      jiraIdTotalHour: 0,
      jiraIdTotalHourDetail: "",
      jiraIdStatus: "",
      jiraDev: "",
      prefixCodeProject: "",
      loginDialog: false,
      estimatedEffort: '0h',
      
      columnEstimate: [
        { field: "displayName",   key: "displayName", title: "DisplayName", align: "left" },
        { field: "userId",        key: "userId",      title: "UserId",      align: "left" },
        { field: "timeSpent",     key: "timeSpent",   title: "TimeSpent",   align: "right" },
        { field: "updated",       key: "updated",     title: "Updated" },
        { field: "comment",       key: "comment",     title: "Comment" ,      align: "left" },
      ],
      tblDataEstimate: [
      ],
      columnComment: [
        { field: "authorFullName",    key: "authorFullName",  title: "Author Comment", align: "left" },
        { field: "updated",                     key: "updated",                   title: "updated",      align: "left" },
        { field: "body",                        key: "body",                      title: "body",         align: "left" },
      ],
      tblDataComment: [
      ],
      filterCLV: [],
      cellStyleOption: {
        bodyCellClass: ({ row, column, rowIndex }) => {
            if (column.field == "clvPIC") {
              console.log(row, row);
              if('DEV IN PROGRES' == row.items.status.name.toUpperCase()){
                return "table-body-cell-class2";

              }
                return "";
            }
            if (column.field == "estimatedEffort") {
              console.log(row, row);
              if( row.items.aggregateprogress.progress > row.items.timeoriginalestimate){
                return "table-body-cell-class3";

              }
                return "";
            }
            if (column.field == "cLTTicket") {
              if(row.isSubTask == true){
                return "table-body-cell-class4";

              }
                return "";
            }

        },
      },
      // columnTicket: [
      //   {
      //       field: "parent",
      //       key: "a",
      //       type: "expand",
      //       title: "",
      //       width: 100,
      //       align: "left",
      //   },
      //   { field: "cLTTicket",         key: "cLTTicket",         title: "CLT Key", align: "right" },
      //   { field: "clvPIC",            key: "clvPIC",            title: "PIC(CLV)", align: "left" , sortBy: "asc"},
      //   { field: "assignee",          key: "assignee",          title: "Assignee", align: "left", sortBy: "asc" },
      //   { field: "taskReceivedDate",  key: "taskReceivedDate",  title: "Recv. Date", align: "left" },
      //   { field: "requestDueDate",    key: "requestDueDate",    title: "Req Due Date", align: "left" },
      //   { field: "planFinish",        key: "planFinish",        title: "Plan Finish", align: "left" },
      //   { field: "actualStart",       key: "actualStart",  title: "ACT Start", align: "left" },
      //   // { field: "actualStart",       key: "actualStart",  title: "ACT Start", align: "left" },
      //   { field: "statusName",            key: "status_name",            title: "Status", align: "center" },
      //   { field: "estimatedEffort",            key: "estimatedEffort",            title: "Estimate / Logged", align: "center" },
      //   { field: "shortDescription",  key: "shortDescription",  title: "Short Description", align: "left" },
      //   { field: "picDev",            key: "picDev",  title: "Main PIC DEV", align: "left" },
      //   { field: "project_key",            key: "project_key",  title: "Project", align: "center" },
      //   // { field: "parent",             key: "parent",  title: "Parent", align: "left" },
      //   { field: "VIEW",              key: "VIEW",  title: "Action", align: "left" },
      // ],
      // expandOption: {
      //       defaultExpandAllRows: false,
      //       render: ({ row, column, rowIndex }, h) => {
      //           return (
      //               <div class='row gray'>
      //                 <div class='col-md-2'>
      //                     Assigner <span style="color:#1890ff;">{row.assigner}</span>
      //                 </div>
      //                 <div class='col-md-2'>
      //                     Task Type: <span style="color:#1890ff;">{row.taskType}</span>
      //                 </div>
      //                 <div class='col-md-2'>
      //                    Plan Start: <span style="color:#1890ff;">{row.planStart}</span>
      //                 </div>

      //                 <div class='col-md-1'>
      //                     Priority: <span style="color:#1890ff;">{row.priority}</span>
      //                 </div>
                      
      //                 <div class='col-md-2'>
      //                    PR(h): <span style="color:#1890ff;">{row.logtimeTotal}</span>
      //                 </div>
                      
      //                 <div class='col-md-2'>
      //                    Last View Date: <span style="color:#1890ff;">{row.lastViewDate}</span>
      //                 </div>
      //                 <div class='col-md-2'>
      //                    ACT End: <span style="color:#1890ff;">{row.actualEnd}</span>
      //                 </div>
      //                 <div class='col-md-12'>
      //                   Description:
      //                   <pre>
      //                    {row.description}
      //                   </pre>
      //                 </div>
      //               </div>
      //           );
      //       },
      //   },
      // tblDataTicket: [
      // ],
      
      sortOption: {
          multipleSort: true,
          sortChange: (params) => {
              console.log("sortChange::", params);
              self.sortChange(params);
          },
      },
      tblDataTicketSRC: [],
      eventTicketOption: {
        bodyCellEvents: ({ row, column, rowIndex }) => {
          return {
              // click: (event) => {
              //     console.log("click::", row, column, rowIndex, event);
              //   if("cLTTicket"== column.key){
              //     self.getWorklogByTicket(row, row.key, row.jiraId, 'SHEET');
              //   } else if("VIEW"== column.key ){
              //     self.routerLink(row.key);
              //   }
                
              // },
              // dblclick: (event) => {
              //     console.log("dblclick::", row, column, rowIndex, event);
               
              // },
              // contextmenu: (event) => {
              //     console.log("contextmenu::", row, column, rowIndex, event);
              // },
              // mouseenter: (event) => {
              //     console.log("mouseenter::", row, column, rowIndex, event);
              // },
              // mouseleave: (event) => {
              //     console.log("mouseleave::", row, column, rowIndex, event);
              // },
          };
        },
      },
      colTickets: [
        {
          label: 'PIM',
          field: 'cLTTicket',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'PIM', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'PIC(CLV)',
          field: 'clvPIC',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'PIC(CLV)', // placeholder for filter input
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
              placeholder: 'PIC(CLV)', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
       
        {
          label: 'Recv. Date',
          field: 'taskReceivedDate',
          filterable: false,
          type: 'date',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Req Due Date', // placeholder for filter input
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
          label: 'Req Due Date',
          field: 'requestDueDate',
          filterable: false,
          type: 'date',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Req Due Date', // placeholder for filter input
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
          label: 'Plan Finish',
          field: 'planFinish',
          filterable: false,
          type: 'date',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Req Due Date', // placeholder for filter input
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
          label: 'Plan Finish',
          field: 'planFinish',
          filterable: false,
          type: 'date',
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Req Due Date', // placeholder for filter input
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
          label: 'Status',
          field: 'statusName',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Status', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'Estimate / Logged',
          field: 'estimatedEffort',
          filterable: true,
          // formatFn: this.formatPrice,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Estimate / Logged', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          formatFn: function (value) {
            return value != null ? value : null
          },
          tdClass: this.tdClassFunc,
          // headerField: this.sumEffort,
        },
        {  
          label: 'Short Description',
          field: 'shortDescription',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Short Description', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {  
          label: 'PIC Dev',
          field: 'picDev',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'Short Description', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        
        
      ],
      tblTickets: [
        {
          children: [],
        }
      ],
    };
  },
  created() {
    //authen
    // this.$router.push({ name: 'Login' });
    // let userName = self.$cookies.get('userName');
    // if(config.userValid.includes(userName)){
    //   console.log("userName", userName);
    // }else{
    //   return
    // }

    momentBiz.updateLocale('us', {
      holidays: this.holidays,
      holidayFormat: 'YYYY-MM-DD'
    });
    //businessSubtract(-3)
    let dateStartWeek = momentBiz(momentBiz(new Date()).startOf('isoWeek').isoWeekday(2), "YYYY-MM-DD").businessSubtract(3);
    let dateEndWeek = momentBiz(momentBiz(new Date()).startOf('isoWeek').isoWeekday(2), "YYYY-MM-DD").businessSubtract(-2);
    console.log("from", new Date(momentBiz(dateStartWeek, 'YYYY-MM-DD')._d).toISOString().substr(0, 10));
    console.log("to", new Date(momentBiz(dateEndWeek, 'YYYY-MM-DD')._d).toISOString().substr(0, 10));

    this.date = new Date(momentBiz(dateStartWeek, 'YYYY-MM-DD')._d).toISOString().substr(0, 10);
    this.date2 = new Date(momentBiz(dateEndWeek, 'YYYY-MM-DD')._d).toISOString().substr(0, 10);
    
    //Load board data
    console.log("boardList",this.$cookies.get('boardList'));
    this.itemsBoard = JSON.parse(this.$cookies.get('boardList'));
    this.efforJsonList.userName = this.$cookies.get('userName');
    this.efforJsonList.pwd = this.$cookies.get('pwd');
    this.reloadBoard();

    console.log('MEM_LIST', config.CLV_PIM_ACCOUNT.MEM_LIST);
    this.efforJsonList.assigneeList = config.CLV_PIM_ACCOUNT.MEM_LIST.map(member => member.id).join(',').split(',');
  },
  mounted() {
    // this.jiraNewTickets();
    // prefixCodeProject();
    //Check outhen
    let authenObj = {
      "authen": this.$cookies.get("authen"),
    }
    let jiraAccount = {
      "userName": this.$cookies.get("userName"),
      "pwd": this.$cookies.get("pwd"),
    }
    
    // if(jiraAccount.userName == null || jiraAccount.userName == ""){
    //   this.$refs.loginDialog.dialog = true;

    // }else{
    //    this.$refs.loginDialog.dialog = false;
    // }
    
  },
  watch: {
    // prefixCodeProject(value){
    //   this.prefixCodeProject = value + "-";
    // },
    date(newVal) {
      // console.log('item changed', newVal);
      this.jiraLink = `https://pim.cyberlogitec.com/jira/rest/clt-gadget/latest/getWorklogByUser.json?startdate=${newVal}&enddate=${this.date2}&projects=${this.projectsName}`;
    },
    date2(newVal) {
      // console.log('item changed', newVal);
      this.jiraLink = `https://pim.cyberlogitec.com/jira/rest/clt-gadget/latest/getWorklogByUser.json?startdate=${this.date}&enddate=${newVal}&projects=${this.projectsName}`;
    },

    btnDisable(){
      // return true
      // if(this.efforJsonList.userName != undefined && this.efforJsonList.userName.trim().length > 0){
      // }
    }
  },
  computed: {
     btnDisable: function () {
       // must parse because Vue turns empty value to string
      if(this.valueBoard.id == undefined){
         return false;
      }
      return true;
     },
     boardDisable: function () {
       // must parse because Vue turns empty value to string
      if(!this.isBtnDisable){
         return false;
      }
      return true;
     },
     getPrefixCodeProject: function(value) {
      
        if (this.prefixCodeProject == undefined || this.prefixCodeProject == null || this.prefixCodeProject == "" ){
          if(this.valueProject.key != undefined && this.valueProject.key != null){
            return this.valueProject.key;
          }
          return "";
        }
       else return this.prefixCodeProject + "-";
     }
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
      return wfirst + Math.floor(days) + wlast; // get the total
    }, //              ^ EDIT: if days count less than 7 so no decimal point
    onJsonChange(value) {
      var ftest = { date: "2015-02-0", start: 1, end: 7 };
      var ltest = { date: "2015-02-2", start: 2, end: 8 };
      var f = "YYYY-MM-DD";
      var start = moment(ftest.date).add(-1,'days');
      var end = moment(ltest.date).add(1,'days');
      var wd = this.workday_count(start, end);
      console.log("valuewd:", wd);
      // this.efforJsonList.NAM.jiraTicketByTimeH = this.efforJsonList.NAM.jiraLog;
      if (undefined != value) {
        let ticket = null;
        let times = 0;
        this.efforJsonList.NAM.total = {};
        this.efforJsonList.NAM.jiraTicketByTimeH = [];
        for (var i = 0; i < value.issues.length; i++) {
          times += value.issues[i].Worklog / 60 / 60;
          ticket = {
            Issue: value.issues[i].Issue,
            Worklog: value.issues[i].Worklog / 60 / 60,
          };

          this.efforJsonList.NAM.jiraTicketByTimeH.push(ticket);

          //   console.log('valuedd:', this.efforJsonList.NAM.jiraLog.issues[i]);
          //  console.log('index:', i);
        }

        this.efforJsonList.NAM.total.countTicket =
          this.efforJsonList.NAM.jiraTicketByTimeH != undefined
            ? this.efforJsonList.NAM.jiraTicketByTimeH.length
            : 0;
        this.efforJsonList.NAM.total.times = times;
      }
    },

    getEffortJira() {
      this.$cookies.set(
        "crowd.cltems.token_key",
        "lqlZJuuqyynVh4KuuPqGWwAAAAAACYACZG91ZGV2bm4",
        "expiring time"
      );
      this.$cookies.set(
        "JSESSIONID",
        "C0D57CF498029BB85160DB217A0CCA7B",
        "expiring time"
      );
      this.$cookies.set(
        "atlassian.xsrf.token",
        "OX6K_db721eb8bbc90605be85a4afc21424a1def1ec59_lin",
        "expiring time"
      );
      // console.log("CK", this.$cookies.get("NID"));
      axios
        .get(this.jiraLink, {
          headers: {
            cookie:
              "crowd.cltems.token_key=lqlZJuuqyynVh4KuuPqGWwAAAAAACYACZG91ZGV2bm4; JSESSIONID=C0D57CF498029BB85160DB217A0CCA7B; atlassian.xsrf.token=OX6K_db721eb8bbc90605be85a4afc21424a1def1ec59_lin;",
          },
        })
        .then(function (response) {
          console.log("readfolder", response);
        });
    },
    async Insert(member) {
      let seft = this;
      this.efforJsonList.week = parseInt(seft.date.split("-")[1]);
      this.efforJsonList.month = parseInt(seft.date.split("-")[1]);
      this.efforJsonList.year = parseInt(seft.date.split("-")[0]);
      console.log(this.efforJsonList);
      await axios
        .post(`${config.API_WORKING.JR_API_JIRA}/api/insertKPI`, this.efforJsonList)
        .then(function (response) {});
    },
    async reloadBoard(){
      this.jiraBoards();
    },
    async jiraBoards(){
      const seft = this;
      await axios
        .post(`${config.API_WORKING.JR_API_JIRA}/api/jiraBoards`, this.efforJsonList)
        .then(async function (response) {
          // seft.hotSettings.data = response.data.data;
          console.log('jiraBoardsxxxxxxxx', response.data);
          // seft.pimDATA = response.data.data;
          seft.itemsBoard = response.data.data;
        });
    },
    async boardChange(){
      const seft = this;
      seft.overlay = true;
      this.efforJsonList.boardId = seft.valueBoard.id;
      await axios
        .post(`${config.API_WORKING.JR_API_JIRA}/api/jiraProjects`, this.efforJsonList)
        .then(async function (response) {
          // seft.hotSettings.data = response.data.data;
          console.log('itemsProject', response.data);
          // seft.pimDATA = response.data.data;
          seft.itemsProject = response.data.data;
          seft.overlay = false;
          // seft.btnDisable = false;
          //Set refix defalt = first
          if(seft.valueProject.key != undefined && seft.valueProject.key.length > 0){
            seft.prefixCodeProject = seft.valueProject.key; //seft.itemsProject[0].key
          } else {
            seft.prefixCodeProject = seft.itemsProject[0].key
          }
        });
    },
   
    async jiraNewTickets() {
      if (!this.$refs.jrTicket.validate()) {
        return;
      }
      const seft = this;
      // seft.isBtnDisable = true;
      seft.overlay = true;
      this.tblTickets = [];
      // seft.$refs.hotTableComponent.hotInstance.loadData([]);
      this.efforJsonList.from =  this.date;
      this.efforJsonList.to = this.date2;
      this.efforJsonList.team = this.team;
      this.efforJsonList.jSQLKey = this.jSQLKey;
      this.efforJsonList.statusCat = this.valueStatus;
      this.efforJsonList.isSearchByDate = this.isSearchByDate;
      this.efforJsonList.picdev = this.isShowPicDev;
      
      // console.log('valueProject.key', seft.valueProject.key);
      if(seft.valueProject.key != undefined && seft.valueProject.key.length > 0){
        this.efforJsonList.itemsProject = seft.valueProject.key;

      } else {
        this.efforJsonList.itemsProject = this.itemsProject;
      }
      
      this.efforJsonList.valueProjectSelected = seft.valueProject.key;

      await axios
        .post(`${config.API_WORKING.JR_API_JIRA}/api/jiraNewTickets`, this.efforJsonList)
        .then(async function (response) {
          // seft.hotSettings.data = response.data.data;
          // console.log('pimDATA', seft.pimDATA);
          // seft.pimDATA = response.data.data;
          // items.customfield_12001.displayName
          
          if(response.data.data != undefined && response.data.data.length > 0){
            let data = response.data.data;
            data.forEach(item => {
              if(item.items.customfield_12001 != undefined &&
                item.items.customfield_12001 != null){
                  item.clvPIC = item.items.customfield_12001.displayName;
              }
            });
           
            // seft.tblDataTicket = data.slice(0);
            seft.tblDataTicketSRC = data.slice(0);
            let arryTicket = data.slice(0);
            let group = new Set();
            console.log('Project', seft.valueProject.key);
            let tickets = {};
            let arrTickets = [];
            if(seft.valueProject.key != undefined && seft.valueProject.key.length > 0){
              let projects = seft.valueProject.key;
              for(let i = 0; i < projects.length; i ++){
                tickets['projects[i].key'] = projects[i];
                let arr = arryTicket.filter(function(item){
                  if(item.project_key == projects[i].key) return true;
                });
                seft.tblTickets.push({
                  mode: "span",
                  label: `[${projects[i].key}] ${projects[i].name}`,
                  // html: false,
                  children: arr,
                })
                // for(let i = 0; i < arryTicket.length; i ++){
                // console.log('Tickets', tickets);
                // }
              }
             
                // let obj = arryTicket[i];
                // let key = obj.key.split('-');
                // if(key != undefined){
                //   group.add(key[0])
                // }
              // }
            }
           
            // seft.tblTickets = arrTickets;
            // [
            //   {
            //     children:  data.slice(0)
            //   }
            // ];

          }
          console.log("seft.tblTickets", seft.tblTickets);
          seft.overlay = false;
          // seft.btnDisable = false;
          
          // seft.$refs.hotTableComponent.hotInstance.loadData(seft.pimDATA);
        }).catch((error) => {
          
            if( error.response ){
                console.log(error.response.data); // => the response payload 
                // seft.btnDisable = false;
                seft.overlay = false;
            }
        });
    },
    getWorklogByTicketOfline (sources, data, jiraId) {
      console.log("getWorklogByTicketOfline");
      // this.$refs.hotTableComponentWorkLog.hotInstance.loadData([]); 
      let logDatas = sources.filter(function(item) { 
        return item.jiraId === jiraId; 
      });
      this.jiraIdSeleted = logDatas[0].key
      let logs = logDatas[0].worklogList;
      if(logs != undefined && logs.length > 0){
        let arr = [];
        let total = 0;
        for(var i = 0; i < logs.length; i++){
          arr.push({
            "displayName": logs[i].author.displayName,
            "userId": logs[i].author.name,
            "timeSpent":logs[i].timeSpent,
            "updated": moment(logs[i].updated).format("YYYY-MM-DD HH:MM"),
            "comment": logs[i].comment,
          });
          total += logs[i].timeSpentSeconds;
        }
        this.jiraIdTotalHour = total/60/60;
        // this.$refs.hotTableComponentWorkLog.hotInstance.loadData(arr);
        this.tblDataEstimate = arr;
        console.log("getWorklogByTicketOfline", logDatas[0].worklogList);

      }
    },
    async jiraNewTicketByListID(){
      let seft = this;
      if(this.efforJsonList != undefined && this.efforJsonList.ticketList != undefined && this.efforJsonList.ticketList != null && this.efforJsonList.ticketList != ''){
        let arr = this.efforJsonList.ticketList.split(",");
      
        let tickets = [...new Set(arr)];
        console.log("seen", tickets.join(','));
        let jsTickets = {
          tickets: tickets,
          itemsProject: this.itemsProject
          
        }
        await axios
        .post(`${config.API_WORKING.JR_API_JIRA}/api/jiraNewTicketByListID`, jsTickets)
        .then(async function (response) {
          
          if(response.data.data != undefined && response.data.data.length > 0){
            let data = response.data.data;
            data.forEach(item => {
              if(item.items.customfield_12001 != undefined &&
                item.items.customfield_12001 != null){
                  item.clvPIC = item.items.customfield_12001.displayName;
              }
            });
           
           
            // await seft.$refs.hotTableComponent.hotInstance.loadData(
            //   data
            // );
            // seft.tblDataTicket = data;
            // seft.tblDataTicketSRC = data;
            //  seft.tblDataTicket = data.slice(0);
            // seft.tblDataTicket = data;
            // seft.tblDataTicketSRC = data;
            seft.tblDataTicketSRC = data.slice(0);
            
          }
          seft.overlay = false;
          // seft.btnDisable = false;
          
          // seft.$refs.hotTableComponent.hotInstance.loadData(seft.pimDATA);
        }).catch((error) => {
          
            if( error.response ){
                // console.log(error.response.data); // => the response payload 
                // seft.btnDisable = false;
                seft.overlay = false;
            }
        });

      }
     
      // EDP_SMLK_LIST_MAN_MAP_MST_FN
    },
    async getWorklogByTicket(sources, jiraKey, jiraId, where){
      const seft = this;
      seft.isBtnDisable = true;
      seft.overlay = true;
      this.efforJsonList.boardId = seft.valueBoard.id;
      this.efforJsonList.ticketid = where !== 'SHEET' ? `${this.prefixCodeProject}-${this.efforJsonList.jiraDev}`: jiraKey;
      this.jiraIdSeleted = where !== 'SHEET' ? `${this.prefixCodeProject}-${this.efforJsonList.jiraDev}` : jiraKey;
      this.jiraIdTotalHourDetail = "";
      await axios
        .post(`${config.API_WORKING.JR_API_JIRA}/api/getIssueWorklogs`, this.efforJsonList)
        .then(async function (response) {
          // seft.hotSettings.data = response.data.data;
          console.log('itemsProject', response.data);
          // seft.pimDATA = response.data.data;
          seft.isBtnDisable = false;
          seft.ticketJson =  response.data;
          if(seft.ticketJson.status == 'FAIL'){
            seft.overlay = false;
            alert(seft.ticketJson.message);
            return;
          }
          seft.overlay = false;

          console.log("getWorklogByTicket");
          // seft.$refs.hotTableComponentWorkLog.hotInstance.loadData([]); 
          // seft.$refs.hotSettingComment.hotInstance.loadData([]); 
          
          let seen = new Set();
          let arrayDisplay = [];
          let logs = response.data.data;
          let ticket = response.data.tickets;
          let commentList = response.data.commentList;
          let oneHour = 25; //Point
          if(logs != undefined && logs.length > 0){
            let arr = [];
            let total = 0;
            let devType= '';
            for(let i = 0; i < logs.length; i++){
              if(logs[i].comment != undefined && logs[i].comment != null && devType == ''){
                devType = logs[i].comment.toString(16).toUpperCase().includes("[DEV]") ? logs[i].author.displayName : '';
              }
              arr.push({
                "displayName": logs[i].author.displayName,
                "userId": logs[i].author.name,
                "timeSpent":logs[i].timeSpent,
                "point": parseFloat(logs[i].timeSpentSeconds/60/60) * oneHour,
                "updated": moment(logs[i].updated).format("YYYY-MM-DD HH:MM"),
                "comment": logs[i].comment,
              });
              total += logs[i].timeSpentSeconds;
              seen.add(logs[i].author.displayName);
            }

            //Tong tung nguoi
            for(let user of seen){
              let sum = 0;
              let sumP = 0;
              console.log("seen[j]", user);
              for(let i = 0; i < logs.length; i++){
                if(logs[i].author.displayName == user){
                  sum += logs[i].timeSpentSeconds;
                  sumP += parseFloat(logs[i].timeSpentSeconds/60/60) * oneHour;
                }
              }
              arrayDisplay.push({
                displayName: user,
                timeSpent: sum/60/60,
                point: sumP,
              });
            }
            seft.jiraIdTotalHour = total/60/60;
            seft.jiraIdTotalHourDetail = arrayDisplay.map(mem => `${mem.displayName}: ${mem.timeSpent}h (${mem.point})`).join(' | ');
            //(${ticket.issues[0].aggregateprogress.total / 60 / 60})
            seft.estimatedEffort = `${ticket.issues[0].fields.timeoriginalestimate / 60 / 60}h (${ticket.issues[0].fields.aggregateprogress.total / 60 / 60})%`;
            console.log("ticket", ticket.issues[0]);
            seft.jiraIdStatus = ticket.issues[0].fields.status.name;

            //Find jira dev
            seft.jiraDev = devType;
            
            // seft.$refs.hotTableComponentWorkLog.hotInstance.loadData(arr);
            seft.tblDataEstimate = arr;
            if(commentList != undefined && commentList != null){
              commentList = commentList.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.updated) - new Date(a.updated);
              });
              // seft.$refs.hotSettingComment.hotInstance.loadData(commentList); 
              for(var x = 0; x < commentList.length; x++){
                commentList[x].authorFullName = commentList[x].updateAuthor.displayName;
              }
              seft.tblDataComment = commentList;

            }
            console.log("getWorklogByTicket", arrayDisplay);
          }
          
        });
    },
    stsSRCRender(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        let pStart = instance.getDataAtCell(row,12);
        let pEnd = instance.getDataAtCell(row,3);
        let actStart = instance.getDataAtCell(row,14);
        let actEnd = instance.getDataAtCell(row,15);
        let reqDueDate = instance.getDataAtCell(row,2);
        if(pStart == 'Invalid date'
          || pEnd == 'Invalid date'
          || actStart == 'Invalid date'
          || actEnd == 'Invalid date'){
          td.style.color = '#B22222';
        }
        let isOverDueDate = moment(reqDueDate).isBefore(moment(new Date()).format("YYYY-MM-DD"));
        if (isOverDueDate){
          td.style.background = '#FFCCCC';
        }
       
      },  
    processCRender(instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
        let pr = instance.getDataAtCell(row,10);
        let est = instance.getDataAtCell(row,3);
        console.log("instance.getDataAtCell(row,9)", pr);
        if(est!= undefined){
          let arrEst = est.split(' ');
          if(arrEst != undefined && arrEst.length > 0){
            let val = parseFloat(arrEst[0]) - parseFloat(pr);
            console.log(parseFloat(arrEst[0]));
            console.log(parseFloat(pr));
            console.log(parseFloat(val));
            if(val < 0){
              td.style.background = '#F08080';
              td.style.fontweight = 'bold';
            }else if(val > 0){
              td.style.background = 'lightgreen';
              td.style.fontweight = 'bold';
            }else{
              td.style.background = 'Orange';
            }
           
          }
          
        }
    },
    inProcessRender  (instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
        let start = instance.getDataAtCell(row,13);
        let end = instance.getDataAtCell(row,14);
        let actstart = instance.getDataAtCell(row,15);
        let status = instance.getDataAtCell(row,7);
        //Dev In Progress
        if(col == 15)
        if(status == 'Dev In Progress' && actstart == 'Invalid date'){
          td.style.background = '#F08080';
          
        }
    },
    routerLink(jiraTicket){
      // let route = this.$router.resolve({path: `${config.JR_PIM_URL}/${jiraTicket}`});
      // let route = this.$router.resolve('/link/to/page'); // This also works.
      window.open(`${config.JR_PIM_URL}/${jiraTicket}`, '_blank');
    },
    noPlan(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        let esteff = instance.getDataAtCell(row,8);
        let start = instance.getDataAtCell(row,9);
        let end = instance.getDataAtCell(row,10);
        if(start == undefined || start == null || start == '' || start == 'Invalid date'
        || end == undefined || end == null || end == '' || end == 'Invalid date'
        || esteff == 0){
          td.style.color = 'red';
          td.className = 'yellow_area';
        }

        //Check overduedate
        if(end != undefined && end !=  null && end !=  '' && end !=  'Invalid date'){
          let isOverDueDate = moment(end).isBefore(moment(new Date()).format("YYYY-MM-DD"));
          let sts = instance.getDataAtCell(row,4);
          let arrValidSts = ["Backlog", "Dev In Progress", "Selected for Development"]
          if (isOverDueDate){
            if(arrValidSts.includes(sts)){
              td.className = 'red';

            }
          }
        }
       
        
      },
      // searchByNameField(labels) {
      //   // seft.tblDataTicketSRC = data;
      //   this.tblDataTicket = this.tblDataTicketSRC.filter(
      //     (x) => labels.length === 0 || labels.includes(x.clvPIC),
      //   );
      // },
      // search() {
      //     const searchValue = this.searchValue;
      //     this.tblDataTicket = this.tblDataTicketSRC.filter(
      //         (x) =>
      //             x.clvPIC.toLowerCase().includes(searchValue.toLowerCase()),
      //     );
      // },

      // // search cancel
      // searchCancel(closeFn) {
      //     closeFn();
      // },

      // search cancel
      // searchConfirm(closeFn) {
      //     this.search();
      //     closeFn();
      // },
      // sortChange(params) {
      //   let data = this.tblDataTicket.slice(0);
      //   // data.sort((a, b) => a.assignee.localeCompare(b.assignee))
      //   data.sort((a, b) => {
      //       if (params.clvPIC) {
      //           if (params.clvPIC === "asc") {
      //               return a.clvPIC.localeCompare(b.clvPIC);
      //           } else if (params.clvPIC === "desc") {
      //             return b.clvPIC.localeCompare(a.clvPIC);
      //           } else {
      //               return 0;
      //           }
      //       }
      //   });
      //   data.sort((a, b) => {
      //       if (params.assignee != undefined && params.assignee != null && params.assignee) {
      //           if(a.assignee != undefined && b.assignee != undefined){
      //             if (params.assignee === "asc") {
      //                 return a.assignee.localeCompare(b.assignee);
      //             } else if (params.assignee === "desc") {
      //               return b.assignee.localeCompare(a.assignee);
      //             } else {
      //                 return 0;
      //             }
      //           }else{
      //             return 0;
      //           }
      //       }
      //   });
      //   this.tblDataTicket = data;
      // },
      projectChange(){
        console.log(' this.valueProject', this.valueProject.key);
        this.prefixCodeProject =  this.valueProject.key[0].key;
      },
      tdClassFunc(row) {
        
        if(row != undefined && row.estimatedEffort != undefined){
          let arr = row.estimatedEffort.split("/");
          if (arr.length > 0 && parseFloat(arr[0].trim()) < parseFloat(arr[1].trim())) {
            return 'red-class';
          }
          return 'green-class';
        }
        
      },
      onRowDoubleClick(row) {
        console.log("onRowDoubleClick", row);
        let data = row.row;
        this.getWorklogByTicket(data, data.key, data.jiraId, 'SHEET');
      }
  },
  
};
</script>
<style>
  .v-data-table {
    width: 100%;
  }
  .v-top {
    vertical-align: top;
  }
  .v-data-table tr td {
    vertical-align: top;
  }
  .v-data-table tr:hover,
  .v-data-table tbody tr:hover:not(.v-data-table__expanded__content) {
    background: #fff !important;
  }
  .menu__content{
    z-index: 9999 !important;
  }
  .v-overlay--active{
    z-index: 9999 !important;
  }
  .table-body-cell-class1 {
      background: #91d5ff !important;
      color: #fff !important;
  }

  .table-body-cell-class2 {
      background: #CD5C5C !important;
      /* color: #191970 !important; */
  }
  .table-body-cell-class3 {
      background: #ebb8c4 !important;
      /* color: #191970 !important; */
  }
  .table-body-cell-class4 {
      background: #3CB371 !important;
      /* color: #191970 !important; */
  }
  .gray {
    background: #F0F0F0 !important;
  }

  .vgt-left-align.vgt-row-header span{
    color: #606266!important
  }
  .red-class{
    background: #ebb8c4 !important;
  }
</style>
