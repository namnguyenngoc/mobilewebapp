<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        {{ cuSuaModel.title }}
      </v-card-title>
      <v-card-text>
        <v-col cols="12" md="12">
          <v-menu
            ref="menuWC"
            v-model="menuWC"
            :close-on-content-click="false"
            :return-value.sync="cuSuaModel.ngay_thuc_hien"
            transition="scale-transition"
            offset-y
            hide-details
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="cuSuaModel.ngay_thuc_hien"
                label="Ngày thực hiện"
                prepend-icon="mdi-calendar"
                class="text-right"
                readonly
                v-bind="attrs"
                v-on="on"
                hide-details
                required
                :rules="emptyRules"
              ></v-text-field>
            </template>
            <v-date-picker v-model="cuSuaModel.ngay_thuc_hien" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menuWC = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menuWC.save(cuSuaModel.ngay_thuc_hien)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-dialog
            ref="dialogTimeCS"
            v-model="modalCS"
            :return-value.sync="time"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="cuSuaModel.gio_thuc_hien"
                label="Giờ"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="modalCS"
              v-model="cuSuaModel.gio_thuc_hien"
              full-width
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="modalCS = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialogTimeCS.save(time)"
              >
                OK
              </v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
        <!-- <v-col cols="12" md="12">
          <v-text-field
            label="Thể tích"
            v-model="cuSuaModel.the_tich_sua_new"
            hide-details
            clearable
        ></v-text-field>
        </v-col> -->
        <v-col cols="12" md="12" class="pb-0 pt-0 mt-0 mb-0" v-show="cuSuaModel.showTheTich">
          <v-slider
            inverse-label
            v-model="cuSuaModel.the_tich_sua_new"
            :thumb-size="30"
            thumb-label="always"
            :max="250"
            min="1"
            class="pt-0 pb-0 mb-0"
            :append-icon="icons.mdiMagnifyPlusOutline"
            :prepend-icon="icons.mdiMagnifyMinusOutline"
            @click:append="theTichSuaChange('+')"
            @click:prepend="theTichSuaChange('-')"
          >
            <template v-slot:thumb-label="{ value }">
              {{ value }}
            </template>
          </v-slider>
        </v-col>
        <v-col cols="12" md="12" v-show="cuSuaModel.showTheTich">
          <v-combobox
            v-model="cuSuaModel.the_tich_sua_new"
            :items="items"
            :search-input.sync="search"
            hide-selected
            label="Thể tích"
            persistent-hint
            small-chips
            clearable
          >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          </v-combobox>
        </v-col>
        <v-col cols="12" md="12">
          <v-combobox
            v-model="cuSuaModel.ghi_chu_them"
            :items="items_ghichu"
            :search-input.sync="search"
            hide-selected
            :label="cuSuaModel.showTheTich ? 'Ghi chú thêm' : 'Thông tin bệnh'"
            persistent-hint
            small-chips
            clearable
          >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          </v-combobox>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="blue darken-1"
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="save()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  import config from '../../config/config.js'
  import moment from 'moment'
  import { 
  mdiMinus, mdiOneUp, mdiPlus, mdiDeleteOutline, mdiCircleEditOutline, mdiSleep, mdiConsoleNetworkOutline,
  mdiMagnifyPlusOutline, 
  mdiMagnifyMinusOutline,
  mdiHistory,
  mdiReload,
  mdiHospitalBoxOutline,
  mdiFormatListBulleted 
} from '@mdi/js'


  export default {
    layout: 'SinhHoatAddDialog',
    // inheritAttrs: false,
    components: {},
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
        icons: {
          mdiMinus,
          mdiPlus,
          mdiDeleteOutline,
          mdiCircleEditOutline,
          mdiSleep,
          mdiMagnifyPlusOutline, 
          mdiMagnifyMinusOutline,
          mdiHistory,
          mdiReload,
          mdiHospitalBoxOutline ,
          mdiFormatListBulleted 
        },
        items: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200],
        modalCS: false,
        menuWC: false,
        time: null,
        cuSuaModel: {
          title: 'Uống sữa',
          ma_cv: 'BSB_UONG', //
          gio_thuc_hien: moment(new Date()).format('HH:mm:ss'),
          ngay_thuc_hien: moment(new Date()).format("YYYY-MM-DD"),
          gio_bat_dau: new Date(),
          the_tich_sua: 0,
          the_tich_sua_new: 100,
          ghi_chu_them: 'Sữa mẹ',
          showTheTich: true,
        },
        items_ghichu: ["Sữa mẹ", "Sữa CT"],
        emptyRules: {
          text:   [v => !!v || "Item is required"],
          select: [(v) => !!v || "Item is required"],
          can_nang: [(v) =>  v > 0 || "Cân nặng phải lón hơn 0"],
          chieu_cao: [(v) =>  v > 0 || "Chiều cao lón hơn 0"],
        },
      }
    },
    computed: {
      propsChiTieu: function(item) {
        return item;
      }
    },
    mounted () {
     
    }, // end method
    created () {}, // end data
    methods: {
      search(){},
      save(){
        this.dialog=false;
        this.$emit('saveBSB');
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
