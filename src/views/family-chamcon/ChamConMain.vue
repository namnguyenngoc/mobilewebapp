<template>
  <v-row class="mt-2 ml-1 mr-1 mb-0 pb-0">
    <v-row>
      <v-col md="12" sm="12" class="text-right mb-0 pb-0"> 
        <v-btn-toggle v-model="toggle_exclusive" @change="changeDisplayType()">
          <v-btn> 
            <v-icon dark class="pl-1 pr-1">
              {{ icons.mdiViewList }}
            </v-icon>
          </v-btn>
          <v-btn>
            <v-icon dark class="pl-1 pr-1">
              {{ icons.mdiDotsGrid  }}
            </v-icon>
          </v-btn>
        
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12" sm="12">
        <v-row>
          <v-col md="12" sm="12" v-show="!isShow">
            <ChamConList/>
          </v-col>
          <v-col md="12" sm="12" v-show="isShow">
            <ChamConLayout  />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import ChamConLayout from './ChamConLayout.vue';
import ChamConList from './ChamConList.vue';
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
    , mdiDotsGrid 
  } from '@mdi/js';

export default {
  components: {
    ChamConList,
    ChamConLayout
  },
  data () {
    return {
      dialog: false,
      toggle_exclusive: 1,
      isShow: true,
      icons: {
          mdiMinus,
          mdiPlus,
          mdiDeleteOutline,
          mdiCircleEditOutline,
          mdiSleep,
          mdiHistory,
          mdiListStatus,
          mdiViewList,
          mdiFormatListBulleted,
          mdiDotsGrid 
        },
    }
  },
  methods: {
    changeDisplayType(){
      this.isShow = (this.toggle_exclusive == 1);
      console.log(this.toggle_exclusive);
    }
  },
};
</script>
