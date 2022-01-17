<template>
  <v-row class="match-height">
    <v-col>
      <v-card>
        <v-card-title class="pt-5 pb-2">
          <v-col cols="12" md="12" class="pb-0 mb-0" >
            Danh sách công việc
          </v-col>
         
        </v-card-title>
        
        <v-divider class="mx-4"></v-divider>
        <v-card-text class="mt-0 mb-0 pt-3 pb-1">
          <!-- Row 1 -->
          <v-col cols="12" md="12" class="pb-0 mb-0 ml-0 mr-0 pl-0 pr-0" >
            <vue-good-table
              title="Công việc chăm con"
              :columns="colCongViec"
              :rows="tblDataCongViec"
              :paginate="true"
              :lineNumbers="true"
              @on-row-dblclick="onRowDoubleClick"
              />
          </v-col>
          <!-- Row 3 -->
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
       
      </v-card>
    </v-col>
  </v-row>

</template>
<script>
import axios from 'axios';
import config from '../../config/config';
import moment from "moment";
import "vue-easytable/libs/theme-dark/index.css";
import { VueGoodTable } from 'vue-good-table';

import {
  mdiMinus,
  mdiOneUp,
  mdiPlus,
  mdiDeleteOutline,
  mdiCircleEditOutline,
  mdiSleep
} from '@mdi/js';
import { reactive } from '@vue/composition-api';

export default {
  name: 'SucKhoe',
  components: {
    VueGoodTable,
  },
  data() {
    return {
      loadingInstance: null,
      colCongViec: [
        {
          label: 'id',
          field: 'id',
          filterable: true,
        },
        {
          label: 'Mã CV',
          field: 'ma_cv',
          filterable: true,
        },
        {
          label: 'Nội dung',
          field: 'ten_cong_viec',
          filterable: false,
        },
        {
          label: 'Ghi chú',
          field: 'ghi_chu',
          filterable: false,
        },
        {
          label: 'Ngày thực hiện',
          field: 'ngay_thuc_hien',
          filterable: false,
          // type: 'datetime',
          // inputFormat: 'YYYY-MM-DD HH:MM:SS',
          // outputFormat: 'YYYY-MM-DD HH:MM:SS',
        },
        {
          label: 'Giờ bắt đầu',
          field: 'gio_bat_dau',
          filterable: false,
          // type: 'datetime',
          // inputFormat: 'YYYY-MM-DD HH:MM:SS',
          // outputFormat: 'YYYY-MM-DD HH:MM:SS',
        },
        {
          label: 'Giờ kế tiếp',
          field: 'gio_ke_tiep',
          filterable: false,
          // type: 'datetime',
          // inputFormat: 'YYYY-MM-DD HH:MM:SS',
          // outputFormat: 'YYYY-MM-DD HH:MM:SS',
        },
        {
          label: 'Thông tin thêm',
          field: 'thong_tin_them',
          filterable: false,
        },
        {
          label: 'Trạng thái',
          field: 'status',
          filterable: false,
        },
        {
          label: 'Tổng thời gian',
          field: 'working_time',
          filterable: false,
        },
      ],
      tblDataCongViec: [
      ],
    }
  },
  created() {
   this.loadCongViec();
  },
  computed: {
     
  }, // end method
  mounted() {
    this.loadingInstance = this.$veLoading({
        target: document.querySelector("#loading-container"),
        // 等同于
        // target:"#loading-container"
        name: "wave",
    });
    this.show();
  }, // end method
  destroyed() {
    this.loadingInstance.destroy();

  }, // end method

  methods: {
    async loadCongViec(){
      let self = this;
      await axios
      .get(`${config.API_URL}/getChamSocList`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        self.tblDataCongViec = data;
        self.close();
      });
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
    console.log('row', params.row);
    }
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
</style>
