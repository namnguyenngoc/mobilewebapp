<template>
  <v-row class="mb-0 text-right">
    <v-col cols="12" md="6" sm="12" class="pa-0 ma-0 text-right mb-1 pr-2">
      <v-btn-toggle class="text-right">
        <v-btn color="info" small class="pl-1 pr-1"> 
          [{{model.bank_code }} - {{model.ky_chi}}] {{formatPrice(model.totalByBank, 0)}}
        </v-btn>
        <v-btn color="success" @click="routerLink('chitieu-list')" small class="pl-1 pr-1"> 
          <v-icon dark>
            {{ icons.mdiFormatListBulleted }}
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="12" md="6" sm="12" class="pa-0 ma-0 text-left mb-1">
      <v-btn-toggle class="text-left">
        <v-btn color="info" small class="pl-1 pr-1" 
          style="min-width: 310px; 
                  max-width: 310px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  justify-content: right;">
          {{model.ngay_chi}}: {{shortCutName(model.noi_dung)}} ({{formatPrice(model.so_tien, 0)}})  
        </v-btn>
        <v-btn color="success" @click="getLastChiTieu()" small class="pl-1 pr-1"> 
          <v-icon dark>
            {{ icons.mdiFormatListBulleted }}
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <v-col cols="12" md="12" sm="12" class="pa-0 ma-0 text-left">
    <v-btn-toggle class="">
        <v-btn color="info" small class="mr-1 pr-1 pl-1" v-for="(item, idx) in cskEmailCSK" :key="item.id">
          {{item.bank_code}} ({{formatPrice(item.so_tien,0)}}) 
        </v-btn>
      </v-btn-toggle>
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
    , mdiFormatListBulleted
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
          mdiHistory,
          mdiFormatListBulleted   
        },
        allStatusChecked: false,
        includeGop: "WO_GOP",
        trip: {
          name: '',
          location: null,
          start: moment().subtract(24, 'months').format(config.DATE_FM),
          end: moment().subtract(-5, 'days').format(config.DATE_FM),
        },
        cskLsData: [
         
        ],
        cskEmailCSK: [],
      
      }
    },
    computed: {
      propsChiTieu: function(item) {
        return item;
      },
      total: function() {
        if(this.cskLsData != undefined && this.cskLsData != null && this.cskLsData.length > 0){
          console.log("this.cskLsData", this.cskLsData);
          return this.cskLsData;

        }
        return 0;
      },
      randomIdx: function() {
        return Math.floor(Math.random() * (2 - 0 + 1)) + 0;
      },
      buttonColor: function() {
        let idx =  Math.floor(Math.random() * (2 - 0 + 1)) + 0;
        return buttonColor[idx];
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
          //REMOVE CHOT SAO KE.
          let lstSelected = response.data.data.filter(function (item) {
              if (item.status !== 'EMAIL_CSK') return true
          })
          

          let chiTieubyBank = response.data.data.filter(function (item) {
              if (item.bank_code == lstSelected[0].bank_code && item.ky_chi == lstSelected[0].ky_chi) return true
          });

          let totalByBank =  chiTieubyBank.reduce((r, {so_tien, bank_code}) => r+= parseFloat(so_tien), 0)

          self.model = lstSelected[0];
          self.model.totalByBank = totalByBank;

          let cskResponse = response.data.data.filter(function (item) {
              if (item.status !== 'EMAIL_CSK') return true
          })

          let cskEmailCSKResponse = response.data.data.filter(function (item) {
              if (item.status == 'EMAIL_CSK') return true
          })

          console.log('cskResponse',cskResponse);
          if(cskResponse != undefined && cskResponse != null && cskResponse.length > 0){
            self.cskLsData = [];
            for(let i = 0; i < cskResponse.length; i ++){
              let obj = {
                bank: cskResponse[i].bank_code,
                kyChi: cskResponse[i].ky_chi,
                total: cskResponse[i].so_tien,
                status: cskResponse[i].status,
                dueDate: cskResponse[i].ngay_thanh_toan
              }
              self.cskLsData.push(obj);
            }
          }
          self.cskEmailCSK  = cskEmailCSKResponse;
          console.log('cskEmailCSK', response.data.data[0].ngay_chi);
          self.model.ngay_chi =  moment(response.data.data[0].ngay_chi).format(config.DATE_TIME_FM_1);

        });
      },
      routerLink(param){
        // let route = this.$router.resolve({path: `${config.JR_PIM_URL}/${jiraTicket}`});
        // let route = this.$router.resolve('/link/to/page'); // This also works.
        console.log(param);
        window.open('./chitieu-list', '_blank');
      },
      shortCutName(name){
         console.log('shortCutName', name);
        if(name == undefined || name == null || name.trim().length == 0) return "";
        let arr = name.split('-');
       
        console.log('arr', arr);
        if(arr.length == 0) return name;
        return arr[0];
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
