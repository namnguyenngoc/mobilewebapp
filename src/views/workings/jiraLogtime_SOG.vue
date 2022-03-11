<template>
  <v-container fluid ma-0>
    <v-row cols="12" sm="12" md="12" class="pt-0">
      <!-- <hot-table ref="sogTableData" :settings="hotSettings"> </hot-table> -->
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
        max-height="700px"
        />
    </v-row>
  </v-container>
</template>
<script>

export default {
  name: 'sogWorkLog',
  components: {
  },
  props: {
      title: {
        type: String,
        default: 'THÊM SẢN PHẨM TRẢ GÓP'
      },
      tblDataWorklog: {
        type: Array,
        default: () => ([{
          
        }])
      },
    },
  data() {
    // const self = this;
    return {
      colTableWorklog: [
        {
          label: 'title',
          field: 'title',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'title', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'month',
          field: 'month',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'month', // placeholder for filter input
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
          label: 'issue',
          field: 'issue',
          filterable: false,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'issue', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
          // formatFn: function (value) {
          //     return value != null ? moment(value).format(config.DATE_FM) : null
          // },
        },
        {
          label: 'projectName',
          field: 'projectName',
          filterable: true,
          // formatFn: this.formatPrice,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'projectName', // placeholder for filter input
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
          label: 'worklog',
          field: 'worklog',
          filterable: true,
          type:"number",
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'worklog', // placeholder for filter input
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
          label: 'taskType',
          field: 'taskType',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'taskType', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'new',
          field: 'new',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'taskType', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'team',
          field: 'team',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'team', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'name',
          field: 'name',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'name', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
        {
          label: 'employeeNumber',
          field: 'employeeNumber',
          filterable: true,
          filterOptions: {
            styleClass: 'class-filter', // class to be added to the parent th element
              enabled: true, // enable filter for this column
              placeholder: 'employeeNumber', // placeholder for filter input
              filterValue: '',
              filterDropdownItems: [], // dropdown (with selected values) instead of text input
              // filterFn: this.columnFilterFn, //custom filter function that
              trigger: 'enter', //only trigger on enter not on keyup 
          },
        },
      ],

    }
    
  },
  created() {
    // this.tblDataWorklog.children = [];
    this.tblDataWorklog =[
      {
        children: this.$route.query.tblDataWorklog,
      }
    ]
    console.log('tblDataWorklog', this.$route.query.tblDataWorklog);
    
  },
  methods: {
    sumEffort(rowObj) {
    	// console.log('sumEffort', rowObj);
    	let sum = 0;
      for (let i = 0; i < rowObj.children.length; i++) {
        sum += parseFloat(rowObj.children[i].worklog);
      }
      return sum;
    },
    loadSOGData() {
      // let seft = this; //Current
      // this.$refs.sogTableData.hotInstance.loadData([]);
      // this.$refs.sogTableData.hotInstance.loadData(this.items);
      // let lst = [{
      //     title:"1111111111111",
      //     month: "",
      //     issue: "",
      //     projectName: "",
      //     ưorklog: "",
      //     taskType: "",
      //     new: "",
      //     team: "",
      //     name: "",
      //     employeeNumber: "",
      //   }];
      //   this.items = lst;
      // this.$refs.sogTableData.hotInstance.loadData(lst);
    },
  }
};

</script>
<style scoped>
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

  .btn-inline{
    display: flex;
  }
  .btn-inline button{
    flex: 1 1 auto;
    margin-right: 4px !important;
  }
  .btn-inline button:first-child{
    flex-grow: 1;
  }
  #ofBar {
  display: none !important;
}
</style>
