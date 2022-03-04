<template>
  <v-row>
    <!-- <v-col cols="12">
      <SucKhoeVoMangThai></SucKhoeVoMangThai>
    </v-col> -->
    <v-col
      cols="12"
      md="7"
    >
      <ChamConHeadlinesV2></ChamConHeadlinesV2>
    </v-col>
    <v-col
      cols="12"
      md="7"
    >
      <ChiTieuHeadlines></ChiTieuHeadlines>
    </v-col>
    <!-- <v-col
      cols="12"
      md="5"
    >
      <DpnHangShopeeHeadlines></DpnHangShopeeHeadlines>
    </v-col> -->
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiPoll, mdiLabelVariantOutline, mdiCurrencyUsd, mdiHelpCircleOutline } from '@mdi/js'

import ChamConHeadlinesV2 from '../family-chamcon/ChamConHeadlines-V2.vue';
import ChiTieuHeadlines from '../family-chitieu/ChiTieuHeadlines.vue';


export default {
  components: {
    ChamConHeadlinesV2,
    ChiTieuHeadlines
  },
  setup() {
    const totalProfit = {
      statTitle: 'Total Profit',
      icon: mdiPoll,
      color: 'success',
      subtitle: 'Weekly Project',
      statistics: '$25.6k',
      change: '+42%',
    }

    const totalSales = {
      statTitle: 'Refunds',
      icon: mdiCurrencyUsd,
      color: 'secondary',
      subtitle: 'Past Month',
      statistics: '$78',
      change: '-15%',
    }

    // vertical card options
    const newProject = {
      statTitle: 'New Project',
      icon: mdiLabelVariantOutline,
      color: 'primary',
      subtitle: 'Yearly Project',
      statistics: '862',
      change: '-18%',
    }

    const salesQueries = {
      statTitle: 'Sales Quries',
      icon: mdiHelpCircleOutline,
      color: 'warning',
      subtitle: 'Last week',
      statistics: '15',
      change: '-18%',
    }

    return {
      totalProfit,
      totalSales,
      newProject,
      salesQueries,
    }
  },
}
</script>
