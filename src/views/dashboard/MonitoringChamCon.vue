<template>
  <v-row>
    <v-col
      cols="12"
    >
      <ChamConMonitoring></ChamConMonitoring>
    </v-col>
  
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiPoll, mdiLabelVariantOutline, mdiCurrencyUsd, mdiHelpCircleOutline } from '@mdi/js'

import ChamConMonitoring from '../family-chamcon/ChamConMonitoring.vue';


export default {
  components: {
    ChamConMonitoring,
  },
}
</script>
