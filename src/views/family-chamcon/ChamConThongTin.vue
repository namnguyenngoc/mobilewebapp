<template>
  <v-row class="mb-0 pb-0 text-center">
    <v-col cols="12" md="6" sm="12" class="pa-0 ma-0 text-left mb-1">
      <v-btn-toggle class="">
        <v-btn color="success" @click="countWorkInDay2()" small class="pl-1 pr-1"> 
          <v-icon dark class="pl-1 pr-1">
            {{ icons.mdiHistory }}
          </v-icon>
        </v-btn>
        <v-btn color="info" small class="pl-1 pr-1">
          Ti [{{model.thoi_gian_gan_nhat_uong}}] [{{model.the_tich_sua_uong }} / {{model.sum_uong }}ml] [{{model.duration}}]
        </v-btn>
        <v-btn color="success" @click="loadListDetail()" small class="pl-1 pr-1"> 
          <v-icon dark>
            {{ icons.mdiFormatListBulleted }}
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="12" md="6" sm="12" class="pa-0 ma-0 text-right hidden" v-show="false">
      <v-icon dark>
        {{ icons.mdiHistory }}
      </v-icon>
      <span>
       Tích sữa: {{model.thoi_gian_gan_nhat_hut}} ({{model.the_tich_sua_hut}} ml / {{model.sum_hut }}ml)
      </span>
    </v-col>

     <v-col cols="12" class="ma-0 pa-0">
      <ChamConListDialog
        ref="chamConListDialog"
        :title="lstDetail.title"
        :date="lstDetail.date"
        :item="lstDetail.item"
        :v-model="lstDetail.vmodel"
        @refeshList="showChartKCBS()"
      />
    </v-col>
   

  </v-row>
</template>

<script>
  import axios from 'axios'
  import config from '../../config/config.js'
  import moment from 'moment'
  import ChamConListDialog from './ChamConListDialog.vue'
  import { 
    mdiMinus
    , mdiOneUp
    , mdiPlus
    , mdiDeleteOutline
    , mdiCircleEditOutline
    , mdiSleep
    , mdiConsoleNetworkOutline
    , mdiHistory
    , mdiListStatus
    , mdiViewList
    , mdiFormatListBulleted
  } from '@mdi/js'

  export default {
    layout: 'chamConDetail',
    // inheritAttrs: false,
    components: {
      ChamConListDialog,
      
    },
    props: {
      title: {
        type: String,
        default: 'Test'
      },
      item: {
        type: Object,
        default: () => ({})
      },
      // dialog: {
      //   type: Boolean,
      //   default: false
      // },
    },
    data () {
      return {
         dialog: false,
        // title: '',
        index: 1,
        itemChiTieu: {},
        menu2: false,
        model: {
          so_lan_uong: 0,
          so_lan_hut: 0,
          thoi_gian_gan_nhat_uong: new Date(),
          thoi_gian_gan_nhat_hut: new Date(),
          duration: null,
        },
        icons: {
          mdiMinus,
          mdiPlus,
          mdiDeleteOutline,
          mdiCircleEditOutline,
          mdiSleep,
          mdiHistory,
          mdiListStatus,
          mdiViewList,
          mdiFormatListBulleted
        },
        counter: 0,
        lstDetail: {
          title:"DETAIL",
          date: moment(new Date()).format(config.DATE_FM),
          item: {},
          vmodel:true,
        },
      }
    },
    computed: {
      propsChiTieu: function(item) {
        return item;
      }
    },
    async mounted () {
    //  await this.countWorkInDay2();
    }, // end method
    created () {
       this.countWorkInDay2();
      //  let result = this.$crontab.addJob({
      //   name: 'counter',
      //   interval: {
      //     seconds: '/1',
      //   },
      //   job: this.countWorkInDay2
      // })
    }, // end data
    methods: {
        countWorkInDay2() {
        let self = this
        
        axios.get(`${config.API_URL}/countWorkInDay/BSB_UONG/now()`).then(response => {
          // seft.hotSettings.data = response.data.data;

          self.model.so_lan_uong = response.data.data[0]._count;
          self.model.thoi_gian_gan_nhat_uong =  moment(response.data.data[0].ngay_thuc_hien_gan_nhat).format(config.DATE_TIME_FM_1);
          self.model.the_tich_sua_uong = response.data.data[0].the_tich_sua;
          self.model.sum_uong = response.data.data[0]._sum;
          let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
          self.model.duration = `${duration._data.hours}h ${duration._data.minutes}m`;
          console.log("duration", duration);

        });
        axios.get(`${config.API_URL}/countWorkInDay/BSB_HUT/now()`).then(response => {
          // seft.hotSettings.data = response.data.data;

          self.model.so_lan_hut = response.data.data[0]._count;
          self.model.thoi_gian_gan_nhat_hut =  moment(response.data.data[0].ngay_thuc_hien_gan_nhat).format(config.DATE_TIME_FM_1);
          self.model.the_tich_sua_hut = response.data.data[0].the_tich_sua;
          self.model.sum_hut = response.data.data[0]._sum;
        });

        // console.log('countWorkInDay---cham con', this.model);
      },
      // countUp () {
      //   // this.counter += 1;
      //   // console.log('COUNT', this.counter);
      // }
      async loadListDetail() {
        console.log('loadListDetail');
        let self = this;
        await axios
          .get(`${config.API_URL}/selectCongViecByDate/'BSB_UONG'/${moment(this.lstDetail.date).format(config.DATE_FM)}`)
          .then(response => {
            // seft.hotSettings.data = response.data.data;
            let data = response.data.data;
            let arr = [];
            for(let i = 0; i < data.length; i ++){
              data[i].item_time_lbl = data[i].ma_cv == 'BSB_UONG' ? `${data[i].the_tich_sua} ml` : `${Math.floor(data[i].working_time / 60) } giờ ${(Math.floor(data[i].working_time / 60)) % 24} phút`;
              arr.push(data[i]);
              console.log('data[i]', data[i]);
            }
            self.lstDetail = {
              title: 'Uống sữa',
              date: moment(new Date()).format(config.DATE_FM),
              item: {
                tblDataCongViec: arr
              }
            }
            self.$refs.chamConListDialog.dialog = true;
            
            // self.tblDataCongViec = data;
            console.log('item-data', data);
          });
          
        this.$refs.chamConListDialog.dialog = true;
      },
      
    }, // end created
  } // End exxport default
</script>
<style scoped>
  .v-scroll{
    height: 700px;
    max-height: 700px;
    overflow-y: auto;
  }
</style>
