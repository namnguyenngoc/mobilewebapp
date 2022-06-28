<template>
  <v-row class="mb-0 pb-0 mr-1 pr-1 ml-1">
    <v-col cols="12" md="6" sm="12" class="pa-0 ma-0 text-left pr-1">
      <v-btn-toggle class="mr-1">
        <v-btn color="info" small class="pl-1 pr-1" @click="insert('BSBUONG')">
         [Sữa][{{model.the_tich_sua_uong }}/{{model.sum_uong }}ml][{{model.duration}}]
        </v-btn>
        <v-btn color="warning" small class="pl-1 pr-1" @click="insert('AN')">
         [{{model.an_ten_cong_viec}}][{{model.an_duration}}]
        </v-btn>
        <v-btn color="success" @click="loadListDetail()" small class="pl-1 pr-1 btn-style-1"> 
          <v-icon dark class="pl-1 pr-1">
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
          an: {

          }
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
     this.countWorkInDay2();
    }, // end method
    async created () {
      this.countWorkInDay2();
      let result = this.$crontab.addJob({
        name: 'counter',
        interval: {
          seconds: '/5000',
        },
        job: this.countWorkInDay2
      })
      
    }, // end data
    methods: {
      countWorkInDay2() {
        console.log('countWorkInDay2');
        const self = this;
        let param = 
              {
                "ma_cv": [
                    "AN",
                    "BSB_UONG",
                    
                ]
            }
        axios.post(`${config.API_URL}/summaryTimeWorkByCodes`, param).then(response => {
          // seft.hotSettings.data = response.data.data;

          self.model.so_lan_uong = response.data.data[0]._count;
          self.model.thoi_gian_gan_nhat_uong =  moment(response.data.data[0].ngay_thuc_hien_gan_nhat).format(config.DATE_TIME_FM_1);
          self.model.the_tich_sua_uong = response.data.data[0].the_tich_sua;
          self.model.sum_uong = response.data.data[0]._sum;
          let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
          self.model.duration = `${duration._data.hours}h ${duration._data.minutes}m`;
          console.log("duration", duration);
          self.model.an_ten_cong_viec = response.data.data[0].ten_cong_viec; 


        });

        // axios.get(`${config.API_URL}/countWorkInDay/BSB_UONG/now()`).then(response => {
        //   // seft.hotSettings.data = response.data.data;

        //   self.model.so_lan_uong = response.data.data[0]._count;
        //   self.model.thoi_gian_gan_nhat_uong =  moment(response.data.data[0].ngay_thuc_hien_gan_nhat).format(config.DATE_TIME_FM_1);
        //   self.model.the_tich_sua_uong = response.data.data[0].the_tich_sua;
        //   self.model.sum_uong = response.data.data[0]._sum;
        //   let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
        //   self.model.duration = `${duration._data.hours}h ${duration._data.minutes}m`;
        //   console.log("duration", duration);
        //   self.model.an_ten_cong_viec = response.data.data[0].ten_cong_viec; 


        // });
        // axios.get(`${config.API_URL}/countWorkInDay/BSB_HUT/now()`).then(response => {
        //   // seft.hotSettings.data = response.data.data;

        //   self.model.so_lan_hut = response.data.data[0]._count;
        //   self.model.thoi_gian_gan_nhat_hut =  moment(response.data.data[0].ngay_thuc_hien_gan_nhat).format(config.DATE_TIME_FM_1);
        //   self.model.the_tich_sua_hut = response.data.data[0].the_tich_sua;
        //   self.model.sum_hut = response.data.data[0]._sum;
        // });

        // axios.get(`${config.API_URL}/countWorkInDay/AN/now()`).then(response => {
        //   // seft.hotSettings.data = response.data.data;
        //   console.log('thong tin countWorkInDay2', );
        //   self.model.an_ten_cong_viec = response.data.data[0].ten_cong_viec; 
        //   const duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
        //   self.model.an_duration = `${duration._data.hours}h ${duration._data.minutes}m`;

        // });

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
          .get(`${config.API_URL}/selectCongViecByDate/'BSB_UONG','AN'/${moment(this.lstDetail.date).format(config.DATE_FM)}`)
          .then(response => {
            // seft.hotSettings.data = response.data.data;
            let data = response.data.data;
            let arr = [];
            for(let i = 0; i < data.length; i ++){
              data[i].item_time_lbl = data[i].ma_cv == 'BSB_UONG' ? `${data[i].the_tich_sua} ml` : `${Math.floor(data[i].working_time / 60) } giờ ${(Math.floor(data[i].working_time / 60)) % 24} phút`;
              arr.push(data[i]);
              console.log('data[i]', data[i]);
            }
            console.log('loadListDetail-thongtin', arr);
            self.$refs.chamConListDialog.item = {
              title: 'Uống sữa',
              date: moment(new Date()).format(config.DATE_FM),
              item: {
                tblDataCongViec: [
                  {
                    children: arr,
                  }
                ]
              },
              
            }
            self.$refs.chamConListDialog.dialog = true;
            
            // self.tblDataCongViec = data;
            console.log('item-data', data);
          });
          
        this.$refs.chamConListDialog.dialog = true;
      },

      insert(type) {
        console.log('insert')

        this.$emit('insert' + type);
      }
      
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
