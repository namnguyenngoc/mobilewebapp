<template>
  <v-row class="mb-0">
    <v-col cols="12" md="12" class="pa-0 ma-0 text-right">
      <v-icon dark>
        {{ icons.mdiHistory }}
      </v-icon>
      <span>
       Chi gần nhất({{model.ngay_chi}}): {{model.noi_dung}} ({{formatPrice(model.so_tien, 0)}})
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
          
        },
        icons: {
          mdiMinus,
          mdiPlus,
          mdiDeleteOutline,
          mdiCircleEditOutline,
          mdiSleep,
          mdiHistory
        },
        allStatusChecked: false,
        includeGop: "WO_GOP",
        trip: {
          name: '',
          location: null,
          start: moment().subtract(24, 'months').format(config.DATE_FM),
          end: moment().subtract(-5, 'days').format(config.DATE_FM),
        },
      }
    },
    computed: {
      propsChiTieu: function(item) {
        return item;
      }
    },
    async mounted () {
    //  await this.getLastChiTieu();
    }, // end method
    created () {
       this.getLastChiTieu();
    }, // end data
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
       async getLastChiTieu() {
        let self = this;
        let kyChi = ['ALLINONE'];
        // new Date().toISOString().substr(0, 10),
        let currentNow = new Date();
        console.log('response.data.data1', '');
        await axios
        .get(`${config.API_FAMILY}/api/chitieus/${JSON.stringify(kyChi)}/${this.allStatusChecked}/${this.includeGop}/${this.trip.start}/${this.trip.end}`)
        .then(response => {
          let data = response.data.data;
          self.model = response.data.data [0];
          self.model.ngay_chi =  moment(response.data.data[0].ngay_chi).format(config.DATE_TIME_FM_1);

        });
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
