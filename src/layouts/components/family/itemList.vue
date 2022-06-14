<template>
  <v-row class="ma-0 match-height item-list pr-1">
    <v-col cols="12" class="ma-0">
      <v-row class="pa-0">
        <v-col cols="10" sm="10" class="pa-0 pt-1">
          <v-col cols="12" sm="12" class="ma-0 pa-0 pl-1 pr-1 mt-1 ml-1">
            <h3>{{ item.ma_cv != 'NGU' ? item.title : (item.lastWorking == 'N' ? 'Ngủ' : 'Thức'  ) }} 
            {{item.ma_cv != 'NGU' ? item.lastWorking : `- ${item.working_time_lbl}`}}
            </h3>
          </v-col>
          <v-col cols="12" sm="12" class="ma-0 pa-0 pl-1 pr-1 mt-1 ml-1">
            <v-col cols="12" sm="12" class="ma-0 pa-0">
              Tổng {{ 
                item.ma_cv == 'BSB_UONG' ? `${item.total} ml` 
                : (item.ma_cv == 'NGU' ? `${Math.floor(item.total / 60) } giờ ${(Math.floor(item.total % 60))} phút` :  `${item.so_lan == undefined ? 0 : item.so_lan} lần`)
                }}
            </v-col>
            <v-col cols="12" sm="12" class="ma-0 pa-0">
              <div class="cut-text">{{ item.sum_desc == undefined ? "" :  item.sum_desc}}</div>
            </v-col>
            <v-col cols="12" sm="12" class="ma-0 pa-0">
              <div class="mt-2">
              <v-icon medium>
                {{ icons.mdiProgressClock  }}
              </v-icon>
              {{ item.last_time}}</div>
            </v-col>
          </v-col>
        </v-col>
        <v-col cols="2" sm="2" class="pl-2 text-right">
          <v-btn
            color="info"
            icon
            large
            @click="openPopup()"
          >
            <v-icon large>
                {{ icons.mdiPlus }}
              </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="mb-0 pb-1 mt-0 pt-0">
      <v-row class="ml-2 mr-3">
        <v-col cols="4" sm="4" class="text-left">
          <v-btn
            color="info"
            icon
            small
            @click="loadItemDetail()"
          > Chi tiết
          </v-btn>
        </v-col>
        <v-col cols="4" sm="4" class="text-center">
          <v-btn
            color="info"
            icon
            small
          > Biểu đồ
          </v-btn>
        </v-col>
        <v-col cols="4" sm="4" class="text-right">
          <v-btn
            color="info"
            icon
            small
            @click="$router.push({ name: 'chamcon-layout' })"
          > Sinh hoạt
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import axios from 'axios';
import config from '../../../config/config';
import moment from "moment";
import {
  mdiMinus,
  mdiOneUp,
  mdiPlus,
  mdiDeleteOutline,
  mdiCircleEditOutline,
  mdiSleep,
  mdiReload,
  mdiFormatListCheckbox ,
  mdiProgressClock,
} from '@mdi/js';

export default {
  name: 'ItemList',
  components: {},
  props: {
    title: {
      type: String,
      default: 'Test',
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      icons: {
        mdiMinus,
        mdiOneUp,
        mdiPlus,
        mdiDeleteOutline,
        mdiCircleEditOutline,
        mdiSleep,
        mdiReload,
        mdiFormatListCheckbox,
        mdiProgressClock 
      },

    }
  },
  computed: {
   
  },
  async mounted() {
    //  await this.countWorkInDay2();
  }, // end method
  created() {
    // this.countWorkInDay2();
    
  }, // end 
  methods: {
    loadItemDetail(){
      this.$emit('loadItemDetail');
    },

    openPopup(){
      this.$emit('openPopup');
    }
  }
}
</script>

<style lang="scss">
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

  .vgt-row-header > span {
    color: #606266 !important;
  }
  
  .item-list{
    border: 1px solid;
    border-radius: 5px;
  }
  .theme--dark .item-list{
    // background: #E6E6FA;
    
    border-color: rgba(231, 227, 252, 0.14) !important
  }
  .theme--light .item-list{
    background: #E6E6FA;
    border-color: #dcdcdc !important
  }
  .cut-text { 
    text-overflow: ellipsis;
    overflow: hidden; 
    width: 92%;  
    white-space: nowrap;
  }
</style>