<template>
  <v-row class="mb-0">
    <v-col cols="12" md="6" sm="12" class="pa-0 ma-0 text-right mb-1">
      <v-icon dark @click="countWorkInDay2()">
        {{ icons.mdiHistory }}
      </v-icon>
      <span>
        <!-- <div class="counter">{{ counter }}</div> -->
       Ti bình: {{model.thoi_gian_gan_nhat_uong}} ({{model.the_tich_sua_uong }}ml / {{model.sum_uong }}ml) {{model.duration}}
      </span>
    </v-col>
    <v-col cols="12" md="6" sm="12" class="pa-0 ma-0 text-right">
      <v-icon dark>
        {{ icons.mdiHistory }}
      </v-icon>
      <span>
       Tích sữa: {{model.thoi_gian_gan_nhat_hut}} ({{model.the_tich_sua_hut}} ml / {{model.sum_hut }}ml)
      </span>
    </v-col>
  </v-row>
</template>

<script>
  import axios from 'axios'
  import config from '../../config/config.js'
  import moment from 'moment'

  import { 
    mdiMinus
    , mdiOneUp
    , mdiPlus
    , mdiDeleteOutline
    , mdiCircleEditOutline
    , mdiSleep
    , mdiConsoleNetworkOutline
    , mdiHistory
  } from '@mdi/js'

  export default {
    layout: 'chamConDetail',
    // inheritAttrs: false,
    components: {
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
          mdiHistory
        },
        counter: 0
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
