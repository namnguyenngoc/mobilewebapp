<template>
  <v-row class="match-height">
    <v-card-title class="mx-auto pb-0 font-normal match-width ml-0 pl-0" style="width: 100%">
      <v-row class="full-width mb-0 mt-1 pl-0 ml-1"> 
        <v-col md="4" sm="4" xs="12" class="mb-0 mt-0 pb-0 pt-1 bold ml-0 pl-0" @click="openDetail()"><h3>Đăng Khôi</h3></v-col>
        <v-col md="8" sm="8" xs="12" class="mb-0 mt-0 pb-0 pt-0 text-right">{{ tuan_tuoi.date }}</v-col>
      </v-row>

    </v-card-title>
    <!-- Theo doi suc khoe -->
   
    <v-col cols="12" md="12" class="ma-0 pa-0">
      <v-card class="ma-0 pa-0">
        <v-card-title class="pa-0 pt-5 pb-2 ma-0">
          <v-col cols="12" md="12" class="ma-0 pt-1 pb-2 mb-0 pl-0 pb-0">
            <ChamConThongTin ref="chamConThongTin2"
              @insertBSBUONG="insert('BSB_UONG')"
              @insertAN="insert('AN')"/>
          </v-col>
          <v-col cols="12" class="ml-0 pl-1 mb-0 pb-0">
            <v-row>
              <v-col cols="12" md="6" sm="12" :class="'text-left mb-0 pb-0 pr-6 ' + classMobile()">
                <v-btn-toggle>
                    
                    <v-btn :color="nguThucModal.code=='N' ? 'info' : 'warning'" @click="updateNgu('OPEN')" small class="pl-1 pr-1">
                      {{nguThucModal.name}}<br/>{{nguThucModal.code=='N' ?  'N:' : 'T:' }} {{nguThucModal.lastTime}}
                    </v-btn>

                    <v-btn color="purple" @click="insert('WC')" small class="pl-1 pr-1">
                      WC<br/>({{be_wc_model.ngay_thuc_hien_gan_nhat }})
                    </v-btn>

                    <v-btn color="success" @click="loadListDetail('NGU')" small class="pl-1 pr-1 btn-style-1"> 
                      <v-icon dark  class="mr-1 pl-1 pr-1">
                        {{ icons.mdiFormatListBulleted   }}
                      </v-icon>
                    </v-btn>

                
                </v-btn-toggle>
              </v-col>
              <v-col cols="12" md="4" sm="12" :class="'text-right mr-0 pl-3 pr-12 ' + classMobile('5')">
                <v-btn-toggle v-model="toggle_exclusive">
                  <v-btn color="warning" @click="updateNgu()" small>
                    <v-icon dark>
                      {{ icons.mdiReload }}
                    </v-icon>
                  </v-btn>
                <v-btn color="info" @click="insert('CN')" class="" small>S.KHÓE </v-btn>

                <v-btn color="warning" @click="insert('BSB_HUT')" class="" small> T.SỮA </v-btn>

                
                <v-btn color="error" @click="insert('BENH')" small> 
                    <v-icon dark>
                      {{ icons.mdiHospitalBoxOutline  }}
                    </v-icon>
                </v-btn>
                <v-btn color="success" @click="loadListDetail('BENH')" small>
                  <v-icon dark>
                    {{ icons.mdiFormatListBulleted }}
                  </v-icon>
                </v-btn>
                </v-btn-toggle>
                
              </v-col>
              
            </v-row>
          </v-col>
        </v-card-title>
      </v-card>
    </v-col>
    
    <!-- Bú sữa -->
    <v-row class="ma-0 pa-0">
      <v-dialog
        v-model="dialogWC"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            Thông tin WC
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="12">
              <v-menu
                ref="menuWC"
                v-model="menuWC"
                :close-on-content-click="false"
                :return-value.sync="be_wc_model.ngay_thuc_hien"
                transition="scale-transition"
                offset-y
                hide-details
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="be_wc_model.ngay_thuc_hien"
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
                <v-date-picker v-model="be_wc_model.ngay_thuc_hien" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menuWC = false"> Cancel </v-btn>
                  <v-btn text color="primary" @click="$refs.menuWC.save(be_wc_model.ngay_thuc_hien)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-dialog
                ref="dialogTimeWC"
                v-model="modalWC"
                :return-value.sync="time"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="be_wc_model.gio_thuc_hien"
                    label="Giờ"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="modalWC"
                  v-model="be_wc_model.gio_thuc_hien"
                  full-width
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="modalWC = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialogTimeWC.save(time)"
                  >
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col cols="12" md="12">
              <v-autocomplete
              label="Đi Ị hay Tiểu"
              v-model="be_wc_model.hinhthuc_wc"
              :items="wcItem"
              item-text="name"
              item-value="code"
              dense
              >
                
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="12">
              <v-autocomplete
                label="Tình trạng phân"
                v-model="be_wc_model.selectModel"
                :items="be_wc_model.items"
                item-text="name"
                item-value="code"
                dense>
                
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                label="Ghi chú thêm"
                v-model="be_wc_model.ghi_chu_them"
                hide-details
                clearable
            ></v-text-field>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="blue darken-1"
              text
              @click="dialogWC = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="insert('WC_INFO')"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Cu sưa -->
    <v-row class="ma-0 pa-0">
      <v-dialog
        v-model="dialogSua"
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
                    hide-detail
                    required
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
            <v-col cols="12" md="12" v-show="!cuSuaModel.showTheTich">
              <v-text-field
                label="Thông tin bệnh"
                v-model="cuSuaModel.ghi_chu_them"
                clearable
                hide-details
                
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12" v-show="cuSuaModel.showTheTich && cuSuaModel.ma_cv !='AN'">
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

          <v-col cols="12" md="12"  class="pl-8 pr-8" v-show="cuSuaModel.showTheTich && cuSuaModel.ma_cv =='AN'">
             <v-text-field
                label="Thông tin món ăn"
                v-model="cuSuaModel.ghi_chu_them"
                clearable
                hide-details
                
              ></v-text-field>
            </v-col>
          </v-card-text>

          <v-card-actions class ="text-right">
            <v-spacer />
            <v-btn
              color="error"
              @click="dialogSua = false"
            >
              Close
            </v-btn>
            <v-btn
              color="info"
              @click="insert('BSB_UONG_SAVE')"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row class="ma-0 pa-0">
      <v-form
          ref="thong_tin_suc_khoe"
          v-model="thong_tin_suc_khoe.valid"
          lazy-validation
        >
        <v-dialog
          v-model="thong_tin_suc_khoe.dialogCN"
          max-height="700"
        >
          <v-card>
            <v-toolbar
              dark
              color="primary"
            >
              <v-btn
                icon
                @click="thong_tin_suc_khoe.dialogCN = false"
              >
                X
              </v-btn>
              <v-toolbar-title>Thông tin sức khỏe</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  class="mt-3"
                  color="success"
                  @click="insert_thong_tin_sk('CN')"
                >
                  Save
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
              <v-card-text class="mt-5">
              <v-row class="mr-5 ml-1 mb-0 pb-0">
                <v-col cols="6" sm="6" md="6" class="mb-0 pb-0">
                  <v-text-field
                    label="Tổng"
                    v-model="thong_tin_suc_khoe.can_nang_total"
                    type="number"
                    suffix="kg"
                    clearable
                    required
                    hide-details
                    @input="tinhCanNang()"
                    :rules="emptyRules.can_nang"
                  ></v-text-field>
                  
                </v-col>
                <v-col cols="6" sm="6" md="6" class="mb-0 pb-0">
                  <v-text-field
                    label="Cân nặng của bố"
                    v-model="thong_tin_suc_khoe.can_nang_bo"
                    type="number"
                    suffix="kg"
                    clearable
                    required
                    hide-details
                    @input="tinhCanNang()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" class="mb-0 pb-0">
                  <v-text-field
                    label="Cân nặng của con"
                    v-model="thong_tin_suc_khoe.can_nang"
                    type="number"
                    suffix="kg"
                    clearable
                    required
                    hide-details
                    :rules="emptyRules.can_nang"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" class="mb-0 pb-0">
                  <v-text-field
                    label="Chiều cao"
                    v-model="thong_tin_suc_khoe.chieu_cao"
                    type="number"
                    suffix="cm"
                    clearable
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mr-5 ml-1 mb-0 pb-0">
                <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
                  <v-text-field
                      label="Tên con"
                      v-model="thong_tin_suc_khoe.ho_ten"
                      clearable
                      readonly
                      hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mr-5 ml-1 mb-0 pb-0">
                <v-col cols="6" sm="6" md="6" class="mb-0 pb-0">
                  <v-text-field
                    label="Ngày sinh"
                    v-model="thong_tin_suc_khoe.nam_sinh"
                    clearable
                    hide-details
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6" class="mb-0 pb-0">
                  <v-text-field
                    label="Ngày thực hiện"
                    v-model="thong_tin_suc_khoe.ngay_bat_dau"
                    clearable
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              
              <!-- <v-row class="mr-5 ml-1 mb-0 pb-0">
                <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
                  <v-text-field
                    label="Mục tiêu"
                    v-model="thong_tin_suc_khoe.muc_tieu"
                    clearable
                    hide-details
                    
                  ></v-text-field>
                </v-col>
              </v-row> -->

            </v-card-text>
            <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="thong_tin_suc_khoe.dialogCN = false"
              >
                Close
              </v-btn>
              <v-btn
                color="success"
                text
                @click="insert_thong_tin_sk('CN')"
              >
                Save
              </v-btn>
            </v-card-actions> -->
              <v-divider class="mx-4 mb-3 mt-4"></v-divider>
          </v-card>
        </v-dialog>
      </v-form>
    </v-row>
    <!-- CHART-->
    
    <v-col cols="12" class="ma-0 pa-0">
      <DialogHoatDong
        ref="dialogHoatDong"
        :v-model="dialogHoatDong"
        :item = "nguThucModal"
        @updateStatusBtn="updateNgu()"
      />
    </v-col>
    <v-col cols="12" class="ma-0 pa-0">
      <ChamConListDialog
        ref="chamConListDialog"
        :v-model="lstDetail.vmodel"
        @refeshList="showChartKCBS()"
      />
    </v-col>
    <v-col cols="12" class="ma-0 pa-0">
      <dialogInformation
          ref="dialogInformation"
          :dialog="tuan_tuoi.dialog"
          :title="tuan_tuoi.date"
          :message="tuan_tuoi.value"
          @agree="tuan_tuoi.dialog=true"
        />
        <dialogInformation
          ref="dialogInformation2"
          @agree="true"
        />
    </v-col>
  </v-row>
</template>
<script>
import axios from 'axios'
import config from '../../config/config'
import moment from 'moment'
import ChartComponent from '../../components/ChartComponent.vue'
import ChamConThongTin from './ChamConThongTin.vue'
import DialogHoatDong from './DialogHoatDong.vue'
import ChamConListDialog from './ChamConListDialog.vue'
import dialogInformation from '../../components/DialogInformation'

import { 
  mdiMinus, mdiOneUp, mdiPlus, mdiDeleteOutline, mdiCircleEditOutline, mdiSleep, mdiConsoleNetworkOutline,
  mdiMagnifyPlusOutline, 
  mdiMagnifyMinusOutline,
  mdiHistory,
  mdiReload,
  mdiHospitalBoxOutline,
  mdiFormatListBulleted 
} from '@mdi/js'
import { reactive } from '@vue/composition-api'

export default {
  name: 'SucKhoe',
  components: {
    ChartComponent,
    ChamConThongTin,
    DialogHoatDong,
    ChamConListDialog,
    dialogInformation
  },
  data() {
    let seftMain = this;
    return {
      // satisfactionEmojis: [1,2,3],
      selfGlobal: this,
      slider: 3,
      desserts: [],
      tuan_tuoi: {dialog:false},
      items: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200],
      items_ghichu:  ["Sữa mẹ", "Morigana 6-36", "Morigana 0-6", "Ăn bột", "Ăn cháo", "Meiji 0-1 [Nhập khẩu]", "Meiji 0-1 [Nội địa]"],
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
      be_wc_model: {
        so_lan_i: 0,
        selectModel: 'BT',
        gio_thuc_hien: moment(new Date()).format('HH:mm:ss'),
        ngay_thuc_hien: moment(new Date()).format("YYYY-MM-DD"),
        items: [
          {
          code: 'BT',
          name: 'Bình thường'
          },
          {
          code: 'TC',
          name: 'Tiêu chảy'
          },
          {
          code: 'BN',
          name: 'Bón'
          },
          {
          code: 'KHAC',
          name: 'Tình trạng khác'
          },
          {
          code: 'NP',
          name: 'Đi nhiều'
          },
          ],
        ghi_chu_them: 'Hoa cải',
        hinhthuc_wc: 'WC'

      },
      wcItem: [
        {
          code: 'WC',
          name: 'Đi Ị'
        },
        {
          code: 'DT',
          name: 'Chỉ đi tiểu'
        },
      ],
      ti_me_model: {
        ti_binh_gan_nhat: '',
        timeTiBinh: null,
        menuTiBinh: false,
        modalTiBinh: false,
        timeTiBinh1: null,
        timeTiBinh1Org: null,
        menuTiBinh1: false,
        modalTiBinh1: false,
        the_tich_sua: '',
        the_tich_sua_new: '',
        loai_sua: 'BSB',
        isEditTimeTiBinh: false
      },
      thong_ke: {
        loai_thong_ke: 'LAN',
      },
      ti_me_gan_nhat: '',
      wc_gan_nhat: '',
      dialogWC: false,
      dialogSua: false,
      ngu_gan_nhat: '',
      ti_binh_gan_nhat: '',
      timeTiBinh: null,
      menuTiBinh: false,
      modalTiBinh: false,
      timeTiBinh1: null,
      timeTiBinh1Org: null,
      menuTiBinh1: false,
      modalTiBinh1: false,

      ngu_model: {
        ngu_gan_nhat: '',
        timeNgu: null,
        menuNgu: false,
        modalNgu: false,
        timeNgu1: null,
        timeNgu1Org: null,
        menuNgu1: false,
        modalNgu1: false,
        id: null,
        gio_bat_dau: null,
        gio_ke_tiep: null,
        isEditTimeNgu: false,
      },
      ngu_gan_nhat: '',
      timeNgu: null,
      menuNgu: false,
      modalNgu: false,
      timeNgu1: null,
      timeNgu1Org: null,
      menuNgu1: false,
      modalNgu1: false,

      holidays: [
        { holidayDate: '2021-09-02', description: 'Quoc Khanh' },
        { holidayDate: '2021-09-03', description: 'Quoc Khanh' },
      ],
      searchInput: "",
      search: "",
      headers: [
        {
          text: 'Trương',
          value: 'huyet_ap_tam_truong',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Thu',
          value: 'huyet_ap_tam_thu',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Tim',
          value: 'nhip_tim',
          align: 'right',
          sortable: false,
        },
        {
          text: 'SPO2',
          value: 'spo2',
          align: 'right',
          sortable: false,
        },
        {
          text: 'CN (Kg)',
          value: 'can_nang',
          align: 'right',
          sortable: false,
        },
         {
          text: 'Cao (Cm)',
          value: 'chieu_cao',
          align: 'right',
          sortable: false,
        },
        
      ],

      tibinhCountDown: {
        title: 'Ti bình đếm',
        circles: [],
      },
      nguCountDown: {
        title: 'Decremental counter',
        circles: [
          {
            id: '3',
            steps: 60,
            size: 60,
            value: 2,
            // stepLength: -1,
            // label: 'Giờ',
            strokeWidth: 5,
            strokeColor: '#008080',
            underneathStrokeColor: '#DCDCDC',
            valueFontSize: 20,
            labelFontSize: 10,
            fillColor: '#312d4b',
          },
          {
            id: '2',
            steps: 60,
            size: 60,
            value: 20,
            // stepLength: -1,
            // label: 'Phút',
            strokeColor: '#4169E1',
            underneathStrokeColor: '#DCDCDC',
            dependentCircles: ['3'],
            fillColor: '#312d4b',
          },
          {
            id: '1',
            steps: 60,
            size: 60,
            value: 10,
            // stepLength: -1,
            // label: 'Giây',
            strokeColor: '#C71585',
            underneathStrokeColor: '#DCDCDC',
            dependentCircles: ['2'],
            fillColor: '#312d4b',
          },
        ],
      },
      wcCountDown: {
        // title: 'Decremental counter',
        // circles: [
        //   {
        //     id: '4',
        //     steps: 365,
        //     size: 60,
        //     value: this.wcCountDay,
        //     // stepLength: -1,
        //     label: 'Ngày',
        //     strokeWidth: 5,
        //     strokeColor: '#008080',
        //     underneathStrokeColor: '#DCDCDC',
        //     fillColor: '#312d4b',
        //     key: 'NGAY',
        //   },
        //   {
        //     id: '3',
        //     steps: 24,
        //     size: 60,
        //     value: 23,
        //     // stepLength: -1,
        //     label: 'Giờ',
        //     strokeWidth: 5,
        //     strokeColor: '#008080',
        //     underneathStrokeColor: '#DCDCDC',
        //     dependentCircles: ['4'],
        //     fillColor: '#312d4b',
        //     key: 'GIO',
        //   },
        //   {
        //     id: '2',
        //     steps: 60,
        //     size: 60,
        //     value: 59,
        //     // stepLength: -1,
        //     label: 'Phút',
        //     strokeColor: '#4169E1',
        //     underneathStrokeColor: '#DCDCDC',
        //     dependentCircles: ['3'],
        //     fillColor: '#312d4b',
        //     key: 'PHUT',
        //   },
        //   {
        //     id: '1',
        //     steps: 60,
        //     size: 60,
        //     value: 55,
        //     // stepLength: -1,
        //     label: 'Giây',
        //     strokeColor: '#C71585',
        //     underneathStrokeColor: '#DCDCDC',
        //     dependentCircles: ['2'],
        //     fillColor: '#312d4b',
        //     key: 'GIAY',
        //   },
        // ],
      },
      cong_viec_model: {
        id: null,
      },
      //Chart start
      chartOptions: {
        chart: {
          height: 350,
          type: 'bar',
          stacked: false,
        },
        dataLabels: {
          enabled: true,
          show: true,
          style: {
            colors: ['#ff0000'],
          },
          position: 'bottom',
        },
        colors: ['#FF1654', '#247BA0'],
        stroke: {
          width: [2, 2],
          curve: 'smooth',
        },
        plotOptions: {
          // bar: {
          //   columnWidth: "20%"
          // }
        },
        xaxis: {
          categories: [],
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#FF1654',
            },
            labels: {
              style: {
                colors: '#FF1654',
              },
            },
            title: {
              text: 'Thể tích sữa (ml)',
              style: {
                color: '#FF1654',
              },
            },
          },
          {
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#247BA0',
            },
            labels: {
              style: {
                colors: '#247BA0',
              },
            },
            title: {
              text: 'Thời gian ngủ (phút)',
              style: {
                color: '#247BA0',
              },
            },
          },
        ],
        tooltip: {
          x: {
            show: true,
          },
          y: {
            formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
              let newVal = val
              if (seriesIndex == 1) {
                newVal = `${parseInt(val / 60)} giờ ${val % 60} phút`
              } else {
                newVal = `${val} ml`
              }
              return newVal
              // let currentTotal = 0
              // series.forEach(s => {
              //   currentTotal += s[dataPointIndex]
              // })
              // // w.config.series[seriesIndex].name = 'Tổng'
              // // const val2 = (val / 1).toFixed(2).replace(',', '.')
              // return currentTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' kg'
            },
            // formatter: function (val) {
            //   return val
            // }
          },
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40,
          position: 'top',
        },
      },
      series: [
        {
          name: 'Số ml sữa',
          data: [10, 20, 30],
        },
        {
          name: 'Thời gian ngủ',
          data: [14, 22, 45],
        },
      ],
      //Chart end

      //Chart 2
      seriesTotal: [
        // {
        //   name: 'Tổng lượng sữa',
        //   type: 'column',
        //   // data: [30, 610, 570, 650, 480, 380],
        //   data: [],
        //   enabled:false,
        // },
        // {
        //   name: 'TB mỗi lần ti',
        //   type: 'column',
        //   // data: [10, 67, 71, 72, 80, 63],
        //   data: [],
        // },
        // {
        //   name: 'Tổng thời gian ngủ',
        //   type: 'column',
        //   // data: [890, 778, 1183, 978, 208, 0],
        //   data: [],
        // },

        // // {
        // //   name: 'TB mỗi lần ngủ',
        // //   type: 'column',
        // //   // data: [222, 194, 147, 163, 69, 0],
        // //   data: [],
        // // },
        // {
        //   name: 'Số lần ti',
        //   type: 'line',
        //   // data: [3, 9, 8, 9, 6, 6],
        //   data: [],
        // },
        // {
        //   name: 'Số lần ngủ',
        //   type: 'line',
        //   // data: [4, 4, 8, 6, 3, 0],
        //   data: [],
        // },
        // {
        //   name: 'Số lần WC',
        //   type: 'line',
        //   // data: [2, 0, 0, 0, 0, 0, 0],
        //   data: [],
        // },
      ],
      chartTotalOptions: {
        ...this.chartTotalOptions,
        ...{
          chart: {
            height: 350,
            type: 'column',
            stacked: false,
          },
          dataLabels: {
            enabled: true,
          },
          stroke: {
            width: [1, 1, 1, 1],
          },
          title: {
            text: 'THỐNG KÊ TRONG NGÀY',
            align: 'left',
            offsetX: 60,
          },
          xaxis: {
            categories: [],
          },
          yaxis: [
            {
              seriesName: 'LUONG_SUA',
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#00E396',
              },
              labels: {
                style: {
                  colors: '#FF0000',
                },
              },
              title: {
                text: 'Thể tích (ml)',
                style: {
                  color: '#00E396',
                },
              },
              tooltip: {
                enabled: true,
              },
            },
            {
              seriesName: 'TB_SUA',
              show: false
            },
            {
              seriesName: 'SO_LAN_NGU',
              opposite: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#FEB019'
              },
              labels: {
                style: {
                  colors: '#FEB019',
                },
              },
              title: {
                text: "Số lần (lần)",
                style: {
                  color: '#FEB019',
                }
              }
            },
            {
              seriesName: 'SO_LAN_WC',
              show: false
            },
          ],
          tooltip: {
            fixed: {
              enabled: true,
              position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
              offsetY: 30,
              offsetX: 60,
            },
          },
          legend: {
            horizontalAlign: 'left',
            position: 'top',
            offsetX: 40,
          },
          // colors:['#F44336', '#E91E63', '#9C27B0']
        }
      },
      //Chart 2 end
      thong_tin_suc_khoe:{
        dialogCN: false,
        ho_ten: 'NGUYỄN ĐĂNG KHÔI',
        nam_sinh: '30/11/2021',
        ngay_bat_dau: moment().format('YYYY-MM-DD HH:mm'),
        muc_tieu: 8,
        can_nang: 0,
        chieu_cao: 0,
        can_nang_bo: 0,
        can_nang_total: 0,
        muc_dich: 'KTSKDK',
        spo2: 0,
        valid: true,
        chart_type_x: 'NGAY', 
      },
      emptyRules: {
        text:   [v => !!v || "Item is required"],
        select: [(v) => !!v || "Item is required"],
        can_nang: [(v) =>  v > 0 || "Cân nặng phải lón hơn 0"],
        chieu_cao: [(v) =>  v > 0 || "Chiều cao lón hơn 0"],
      },

      chartSucKhoe: {
        ...this.chartSucKhoe,
        ...{
          chart: {
            height: 150,
            width: '90%',
            type: 'line',
            stacked: false,
          },
          dataLabels: {
            enabled: true,
            position: 'middle',
            textAnchor: 'middle',
            // style: {
            //     colors: ['#ff0000',"#0000ff"]
            //   },
          },
          fill: {
            type: 'gradient' / 'solid' / 'pattern' / 'image'
          },
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'THEO DÕI SỨC KHỎE',
            align: 'left',
            offsetX: 60,
            colors: "#FFFFFF"
          },
          xaxis: {
            type: 'category',
            categories: [],
            tickAmount: undefined,
            tickPlacement: 'between',
          },
          yaxis: [
            {
              seriesName: 'CAN_NANG',
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#00E396',
              },
              labels: {
                // style: {
                //   colors: '#FF0000',
                // },
              },
              title: {
                text: 'Trọng lương (gr)',
                style: {
                  color: '#ff0000',
                },
              },
              tooltip: {
                enabled: true,
              },
            },
            // {
            //   seriesName: 'CAN_NANG',
            //   opposite: true,
            //   axisTicks: {
            //     show: true,
            //   },
            //   axisBorder: {
            //     show: true,
            //     color: '#00E396',
            //   },
            //   labels: {
            //     style: {
            //       colors: '#FF0000',
            //     },
            //   },
            //   title: {
            //     text: 'Tỉ lệ tăng (gr)',
            //     style: {
            //       color: '#00E396',
            //     },
            //   },
            //   tooltip: {
            //     enabled: true,
            //   },
            // },
           
          ],
          tooltip: {
            // fixed: {
            //   enabled: true,
            //   position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
            //   offsetY: 30,
            //   offsetX: 60,
            // },
          },
          legend: {
            show: true,
            horizontalAlign: 'right',
            position: 'top',
            // offsetX: 40,
            showForSingleSeries: true,
            showForNullSeries: true,
            showForZeroSeries: true,
            floating: false,
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial',
            fontWeight: 400,
            formatter: undefined,
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            customLegendItems: [],
            offsetX: 0,
            offsetY: 0,
            labels: {
                colors: undefined,
                useSeriesColors: false
            },
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
            },
            // itemMargin: {
            //     horizontal: 5,
            //     vertical: 0
            // },
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
          },
          grid: {
            borderColor: '#ff0000',
           
          },
          markers: {
            size: 2
          },
          
        }
      },
      serialsSucKhoe:[],
      sliderSK: 5,
      countDownValue:[],
      menu2: false,
      modalWC: false,
      modalCS: false,
      time: null,
      color: null,
      colors: [
        'purple',
        'info',
        'success',
        'warning',
        'error'
      ],
      menuWC: false,
      chartSKColSelect: [
        {
          code: 'CN',
          name: 'Cân nặng'
        },
        {
          code: 'CN_TC',
          name: 'Cân nặng TC'
        }
      ],
      chartSKItems:[
        {
          code: 'CN',
          name: 'Cân nặng'
        },
        {
          code: 'CN_TC',
          name: 'Cân nặng TC'
        },
        {
          code: 'TL_CN',
          name: 'Tăng cân nặng'
        },
        {
          code: 'CC',
          name: 'Chiều cao'
        },
        {
          code: 'CC_TC',
          name: 'Chiều cao TC'
        },
        {
          code: 'TL_CC',
          name: 'Tăng chiều cao'
        }
      ],
      chartOptionSelect:{
          code: 'NGAY',
          name: 'Ngày'
        },
      chartOptionItems: [
        {
          code: 'NGAY',
          name: 'Ngày'
        },
        {
          code: 'THANG',
          name: 'Tháng'
        }
      ],

      chartKCBS: {
        selected:{
          code: ' TB_NGAY',
          name: 'Ngày',
          sql: 'day',
        },
        items: [
        {
          code: 'NGAY',
          name: 'Ngày',
          sql: '',
        },
        {
          code: 'TB_THANG',
          name: 'TB Tháng',
          sql: 'month',
        },
        {
          code: 'TB_NGAY',
          name: 'TB Ngày',
          sql: 'day',
        },
       
        ],
        condition: {
          startDate: moment().subtract(6, 'month').format(config.DATE_FM),
          endDate:  moment().subtract(0, 'days').format(config.DATE_FM),
          vmodeldate: null,
        }
      },

      sliderWC: 2,
      seriesTotalWC: [],
      chartTotalOptionsWC: {
        ...this.chartTotalOptionsWC,
        ...{
            chart: {
              height: 350,
              type: 'column',
              stacked: false,
            },
            dataLabels: {
              enabled: true,
              // labels: ['Apples', 'Oranges', 'Berries', 'Grapes']
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
            },
            xaxis: {
              type: 'category',
              categories: [],
              tickAmount: undefined,
              tickPlacement: 'between',
            },
            yaxis: [
                {
                  seriesName: 'GIO',
                  axisTicks: {
                    show: true,
                  },
                  axisBorder: {
                    show: true,
                    color: '#00E396',
                  },
                  labels: {
                    style: {
                      colors: '#FF0000',
                    },
                  },
                  title: {
                    text: 'Giờ',
                    style: {
                      color: '#00E396',
                    },
                  },
                  tooltip: {
                    enabled: true,
                  },
              },
            
            ],
            tooltip: {
              // fixed: {
              //   enabled: true,
              //   position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
              //   offsetY: 30,
              //   offsetX: 60,
              // },
              y: {
                formatter: function (val) {
                  return `${Math.floor(val / 24) } ngày ${val % 24} giờ`
                },
              },
            },
            legend: {
              horizontalAlign: 'left',
              position: 'top',
              offsetX: 40,
              markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
              },
            },
             dataLabels: {
              enabled: true,
              enabledOnSeries: [0,1,2],
              formatter: function(value, { seriesIndex, dataPointIndex, w}) {
                if(seriesIndex == 0){
                  let value2 = `${Math.floor(w.globals.stackedSeriesTotals[dataPointIndex]  / 24) } ngày ${w.globals.stackedSeriesTotals[dataPointIndex]  % 24} giờ`
                  return value2;
                }
              },
            
              offsetY: 0,
              style: {
                fontSize: '12px',
                colors: ['#304758'],
              },
            }
            
        },
      }
      ,
      sliderBS: 3,
        seriesTotalBS: [],
        chartTotalOptionsBS: {
          ...this.chartTotalOptionsBS,
          ...{
              // colors : ['#b84644', '#4576b5'],
              chart: {
                height: 350,
                type: 'line',
                stacked: false,
              },
              dataLabels: {
                enabled: true,
                // labels: ['Apples', 'Oranges', 'Berries', 'Grapes']
              },
              stroke: {
                 curve: 'smooth'
              },
              title: {
              },
              xaxis: {
                type: 'category',
                categories: [],
                tickAmount: undefined,
                tickPlacement: 'between',
              },
              yaxis: [
              
              ],
              tooltip: {
                // fixed: {
                //   enabled: true,
                //   position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                //   offsetY: 30,
                //   offsetX: 60,
                // },
                y: {
                  formatter: function (val) {
                    return val
                  },
                },
              },
              legend: {
                horizontalAlign: 'left',
                position: 'top',
                offsetX: 40,
                markers: {
                  width: 12,
                  height: 12,
                  strokeWidth: 0,
                  strokeColor: '#fff',
                  fillColors: undefined,
                  radius: 12,
                  customHTML: undefined,
                  onClick: undefined,
                  offsetX: 0,
                  offsetY: 0
                },
              },
          },
        }
      ,
      seriesTotalNGU: [],
      chartTotalOptionsNGU: {
        ...this.chartTotalOptionsNGU,
        ...{
            // colors : ['#b84644', '#4576b5'],
            chart: {
              height: 350,
              type: 'line',
              stacked: false,
            },
            dataLabels: {
              enabled: true,
              // labels: ['Apples', 'Oranges', 'Berries', 'Grapes']
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
            },
            xaxis: {
              type: 'category',
              categories: [],
              tickAmount: undefined,
              tickPlacement: 'between',
            },
            yaxis: [
            
            ],
            tooltip: {
              // fixed: {
              //   enabled: true,
              //   position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
              //   offsetY: 30,
              //   offsetX: 60,
              // },
              y: {
                formatter: function (val) {
                  return val
                },
              },
            },
            legend: {
              horizontalAlign: 'left',
              position: 'top',
              offsetX: 40,
              markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
              },
              
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: [0,1,2],
              formatter: function(value, { seriesIndex, dataPointIndex, w}) {
                if(seriesIndex == 0){
                  let value2 = `${Math.floor(value  / 60) } giờ ${value  % 60} phút`
                  return value2;
                }
                return value
              },
            
              offsetY: 0,
              style: {
                fontSize: '12px',
                colors: ['#304758'],
              },
          },
        },
      }
      ,
      cuSuaModel: {
        title: 'Uống sữa',
        ma_cv: 'BSB_UONG', //
        gio_thuc_hien: moment(new Date()).format('HH:mm:ss'),
        ngay_thuc_hien: moment(new Date()).format("YYYY-MM-DD"),
        gio_bat_dau: new Date(),
        the_tich_sua: 0,
        the_tich_sua_new: 120,
        ghi_chu_them: 'Morigana 6-36',
        showTheTich: true,
      },
      tichSuaType: [
        {
          code: 'BSB_UONG',
          name: 'Uống sữa'
        },
        {
          code: 'BSB_HUT',
          name: 'Tích sữa'
        },
        {
          code: 'BENH',
          name: 'Bệnh'
        },
        {
          code: 'AN',
          name: 'Ăn'
        }
      ],
      sliderKCBS: 5, //// KHOANG CACH BU SUA
      seriesTotalKCBS: [],
      chartTotalOptionsKCBS: {
        ...this.chartTotalOptionsKCBS,
        ...{
            colors: [function({ value, seriesIndex, w }) {
              // console.log('colors', value)    ;      
              // console.log('seriesIndex', seriesIndex)    ;    
              // console.log('w', w)    ;     
              if (value < 55) {
                  return '#8A2BE2'
              } else {
                  return '#ff0000'
              }
            }, function({ value, seriesIndex, w }) {
              // if (value < 111) {
              //     return '#FFE4C4'
              // } else {
                  return '#00FFFF'
              // }
            }],
            chart: {
              height: 350,
              type: 'column',
              stacked: false,
            },
            dataLabels: {
              enabled: true,
              // labels: ['Apples', 'Oranges', 'Berries', 'Grapes']
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
            },
            xaxis: {
              type: 'category',
              categories: [],
              tickAmount: undefined,
              tickPlacement: 'between',
              labels: {
                formatter: function (value) {
                  if(seftMain.chartKCBS.selected.code != 'NGAY') return value;
                  return `${value}`;
                }
              }
            },
            yaxis: [
                
            
            ],
            tooltip: {
              // y: {
              //   formatter: function (val) {
              //     return `${Math.floor(val / 60) } giờ ${val % 60} phút`
              //   },
              // },
            },
            legend: {
              horizontalAlign: 'left',
              position: 'top',
              offsetX: 40,
              markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
              },
            },
            dataLabels: {
            enabled: true,
            enabledOnSeries: [0,1,2],
            formatter: function(value, { seriesIndex, dataPointIndex, w}) {
              if(seftMain.chartKCBS.selected.code != 'NGAY') return value;
              if(seriesIndex == 0){
                
                let value2 = `${Math.floor(value  / 60) } giờ ${value  % 60} phút`
                return value2;
              }
              return value;
            },
           
            offsetY: 0,
            style: {
              fontSize: '12px',
              colors: ['#304758'],
            },
          },
            
        },
      },
      maxSlide: 30,
      maxValue: {
        value1: 50,
        value2: 12
      },
      congViecModel: {
        selected: {
          name: 'BSB_UONG', 
          code: 'BSB_UONG'
        },
        items: []
      },
      dialogHoatDong: false,
      nguThucModal: {
        name: 'Ngủ',
        code: 'T',
        orgDate: new Date(),
        lastTime: moment(new Date()).format(config.DATE_TIME_FM_1)
      },
      toggle_exclusive: [],
      lstDetail: {
          title:"DETAIL",
          date: moment(new Date()).format(config.DATE_FM),
          item: {},
          vmodel:true,
        },
      isShowAllCharts: false

    }
  },
  created() {
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    
    this.getCurrentDate()
    this.countWorkInDay()
    this.updateBtn('COUNT_DOWN')
    // this.loadingChart()
    // this.loadingChartSK();
    this.summarySuckhoeByCongViec();
    // this.showChartWC();
    // this.showChartBS();
    // this.showChartNGU();
    // this.showChartKCBS();
    this.loadDataCongViec();
    this.loadNguThuc();

    let result = this.$crontab.addJob({
      name: 'loadNguThuc',
      interval: {
        seconds: '/1000',
      },
      job: this.loadNguThuc
    });
     
  },
  mounted() {
    // this.loadingChart();
  },
  computed: {
    //   ...bankState("bank", {
    //     bankList: "bankList",
    // })
    isNgu() {
      // let nextTime = this.ngu_model.timeNgu1Org;
      // let currentDate = new Date();
      // let status = true;
      console.log('cong_viec_model', this.ngu_model)
      // status = moment(currentDate).isAfter(moment(nextTime));
      if (this.ngu_model != undefined && this.ngu_model != null) {
        if (
          this.ngu_model.id != undefined &&
          this.ngu_model.status != undefined &&
          this.ngu_model.status == 'T'
        ) {
          return true
        }
      }
      return false
    },
    wcCountDay() {
      return 1000;
    },
    // showTheTich:{
    //   get() {
    //     console.log("newvalueget", this.cuSuaModel);
    //     return true;
    //   },
    //   // setter
    //   set(newValue) {
    //     // Note: we are using destructuring assignment syntax here.
    //     console.log("newvalue", newValue);
    //     return newValue;
    //   }
    // },
      
    //  {
    //   console.log("thể tích");
    //   return false;
    // }
  }, // end method
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
    async getCurrentDate() {
      const self = this

      await axios.get(`${config.API_URL}/getCurrentDate/2021-11-30`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.tuan_tuoi.value = response.data.data[0].ngay_bat_dau_group;
        let dateString = response.data.data[0].group_date;
        if(undefined != dateString && parseInt(dateString.split(" ")[0]) > 0){
          self.tuan_tuoi.date = response.data.data[0].group_date;
        } else{
          self.tuan_tuoi.date = (response.data.data[0].group_date).replace("0 năm", "");
        }
        
      })
    },
    async loadDataCongViec(){
      let self = this;
      await axios.get(`${config.API_URL}/getChamSocList`)
      .then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        const unique = [...new Set(data.map(item => item.ma_cv))]; // [ 'A', 'B']
        console.log("unique", unique);
        for(let item of unique){
          self.congViecModel.items.push({
            name: item,
            code: item
          })
        }
        // self.congViecModel.items = data;
      });
    },
    async countWorkInDay() {
      const self = this

      await axios.get(`${config.API_URL}/countWorkInDay/WC/now()`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.be_wc_model.so_lan_i = response.data.data[0]._count;
        self.be_wc_model.ngay_thuc_hien_gan_nhat =  moment(response.data.data[0].ngay_thuc_hien_gan_nhat).format(config.DATE_TIME_FM_1);
      })
    },

    async summarySuckhoeByCongViec() {
      const self = this
      let ho_ten = 'NGUYEN DANG KHOI';

      await axios.get(`${config.API_URL}/summarySuckhoeByCongViec`).then(response => {
        // seft.hotSettings.data = response.data.data;
        self.countDownValue = response.data.data;
        let wc = self.countDownValue.find(({ma_cv}) => ma_cv == 'WC');
        // self.wcCountDown.circles.find(({key}) => key == 'NGAY').value = 10000;
        // config.wcCountDay = 1000;
        // self.$forceUpdate();
        self.wcCountDown = {
            title: 'wcCountDown',
            circles: [
              {
                id: '4',
                steps: 365,
                size: 40,
                value: wc.khoang_cach_max_day,
                // stepLength: -1,
                label: 'Ngày',
                strokeWidth: 3,
                strokeColor: '#008080',
                underneathStrokeColor: '#DCDCDC',
                fillColor: '#312d4b',
                key: 'NGAY',
                valueFontSize: 20,
                labelFontSize: 12,
              },
              {
                id: '3',
                steps: 24,
                size: 40,
                value: wc.khoang_cach_max_hour,
                // stepLength: -1,
                label: 'Giờ',
                strokeWidth: 3,
                strokeColor: '#008080',
                underneathStrokeColor: '#DCDCDC',
                dependentCircles: ['4'],
                fillColor: '#312d4b',
                key: 'GIO',
                valueFontSize: 20,
                labelFontSize: 12,
              },
              {
                id: '2',
                steps: 60,
                size: 40,
                value: wc.khoang_cach_max_min,
                strokeWidth: 3,
                // stepLength: -1,
                label: 'Phút',
                strokeColor: '#4169E1',
                underneathStrokeColor: '#DCDCDC',
                dependentCircles: ['3'],
                fillColor: '#312d4b',
                key: 'PHUT',
                valueFontSize: 20,
                labelFontSize: 12,
              },
              {
                id: '1',
                steps: 60,
                size: 40,
                strokeWidth: 3,
                value: wc.khoang_cach_max_sec,
                // stepLength: -1,
                label: 'Giây',
                strokeColor: '#C71585',
                underneathStrokeColor: '#DCDCDC',
                dependentCircles: ['2'],
                fillColor: '#312d4b',
                key: 'GIAY',
                valueFontSize: 20,
                labelFontSize: 12,
              },
            ],
          }
        // console.log('summarySuckhoeByCongViec', wc);
      })
    },

    async getListSucKhoe() {
      const self = this
      await axios.get(`${config.API_URL}/selectSucKhoe`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.desserts = response.data.data
        // console.log('jiraBoards', response.data)
      })
    },
    async insert_thong_tin_sk(code){
      if (!this.$refs.thong_tin_suc_khoe.validate()) {
        return;
      }
      const self = this;
      this.thong_tin_suc_khoe.can_nang = this.thong_tin_suc_khoe.can_nang * 1000;
      // this.thong_tin_suc_khoe.can_nang_total = this.thong_tin_suc_khoe.can_nang * 1000;
      // this.thong_tin_suc_khoe.can_nang_con = this.thong_tin_suc_khoe.can_nang * 1000; 
      // this.thong_tin_suc_khoe.can_nang_bo = this.thong_tin_suc_khoe.can_nang * 1000; 

      await axios.post(`${config.API_URL}/insertSucKhoe`, this.thong_tin_suc_khoe).then(async function (response) {
        await self.updateBtn();
        self.thong_tin_suc_khoe.dialogCN = false;
        // await self.loadingChartSK();
      })
    },

    async insert(ma_cv) {
      const self = this;
      let code_cv = ma_cv;
      let currentDate = new Date();
      let gio_bat_dau = moment(currentDate).format('YYYY-MM-DD');
      let thong_tin_them = '';
      let congviec = null;
      this.showTheTich = true;
      switch (code_cv) {
        case 'NGU':
          var timeAndDate = moment(gio_bat_dau + ' ' + self.ngu_model.timeNgu);
          if(!self.ngu_model.isEditTimeNgu){
            gio_bat_dau =  moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
          } else {
            gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          }
          congviec = {
            ma_cv: code_cv,
            gio_bat_dau: gio_bat_dau,
            the_tich_sua: this.ti_me_model.the_tich_sua_new[0],
            thong_tin_them: thong_tin_them,
          }
          await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
            await self.updateBtn()
          })
          break;
        case 'BSB_HUT':
          // var timeAndDate = moment(gio_bat_dau + ' ' + self.ti_me_model.timeTiBinh);
          // // gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          // if(!self.ti_me_model.isEditTimeTiBinh){
          //   gio_bat_dau =  moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
          // } else {
          //   gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          // }
          // code_cv = self.ti_me_model.loai_sua;
          // congviec = {
          //   ma_cv: code_cv,
          //   gio_bat_dau: gio_bat_dau,
          //   the_tich_sua: this.ti_me_model.the_tich_sua_new,
            
          // }
          // await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
          //   await self.updateBtn()
          // })
          
          this.cuSuaModel.title = "Tích sữa";
          this.cuSuaModel.ma_cv = 'BSB_HUT';
          this.cuSuaModel.showTheTich = true;
          this.dialogSua = true;

          break;
        case 'AN':
          self.$refs.chamConThongTin2.countWorkInDay2();
          this.cuSuaModel.ma_cv = 'AN';
          this.cuSuaModel.title = "Ăn dặm";
          this.cuSuaModel.ghi_chu_them = "";
          this.cuSuaModel.showTheTich = true;
          this.dialogSua = true;
          break;
        case 'BSB_UONG':
          this.$refs.chamConThongTin2.countWorkInDay2();
          var timeAndDate = moment(gio_bat_dau + ' ' + self.ti_me_model.timeTiBinh);
          // gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          // if(!self.ti_me_model.isEditTimeTiBinh){
          //   gio_bat_dau =  moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
          // } else {
          //   gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          // }
          // code_cv = self.ti_me_model.loai_sua;
          // congviec = {
          //   ma_cv: code_cv,
          //   gio_bat_dau: gio_bat_dau,
          //   the_tich_sua: this.ti_me_model.the_tich_sua_new,
            
          // }
          // await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
          //   await self.updateBtn()
          // })
          // this.cuSuaModel.gio_bat_dau = gio_bat_dau;
          // this.cuSuaModel.the_tich_sua = the_tich_sua;
          this.cuSuaModel.ma_cv = 'BSB_UONG';
          this.cuSuaModel.title = "Uống sữa";
          this.cuSuaModel.showTheTich = true;
          this.dialogSua = true;

          break;
          case 'BENH':
          this.showTheTich = false;
          var timeAndDate = moment(gio_bat_dau + ' ' + self.ti_me_model.timeTiBinh);
          this.cuSuaModel.ma_cv = 'BENH';
          this.cuSuaModel.title = "GHI CHÚ BỆNH";
          this.cuSuaModel.showTheTich = false;
          this.dialogSua = true;

          break;
        case 'BSB_UONG_SAVE':
          if(this.cuSuaModel.ma_cv == 'AN'){
            
            if(this.cuSuaModel.ghi_chu_them == ""){
              this.$refs.dialogInformation2.title = "Xác nhận!";
              this.$refs.dialogInformation2.message = "Vui lòng nhập thông tin món ăn";
              this.$refs.dialogInformation2.dialog = true;
              return;
            }
          }
          var timeAndDate = moment(gio_bat_dau + ' ' + self.ti_me_model.timeTiBinh);
          gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          // if(!self.ti_me_model.isEditTimeTiBinh){
          //   gio_bat_dau =  moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
          // } else {
          //   gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          // }
          // code_cv = self.ti_me_model.loai_sua;
          // console.log("TEXXXXXXXXXXX", this.cuSuaModel);
          congviec = {
            ten_cv: this.tichSuaType.find(({ code }) => code == this.cuSuaModel.ma_cv).name,
            ma_cv: this.cuSuaModel.ma_cv,
            gio_bat_dau: moment(`${this.cuSuaModel.ngay_thuc_hien} ${this.cuSuaModel.gio_thuc_hien}`),
            the_tich_sua: this.cuSuaModel.the_tich_sua_new,
            thong_tin_them: this.cuSuaModel.ghi_chu_them,
            
          }
          await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
            await self.updateBtn();
            // seft.$emit('refeshList');
           
            
          })
          this.$refs.chamConThongTin2.countWorkInDay2();
          this.dialogSua = false;
          // this.cuSuaModel.gio_bat_dau = gio_bat_dau;
          // this.cuSuaModel.the_tich_sua = the_tich_sua;

          break;
        case 'WC':
          self.dialogWC = true;
          break;
        case 'WC_INFO':
          // gio_bat_dau = moment(be_wc_model.ngay).format('YYYY-MM-DD HH:mm:ss');
          // thong_tin_them = JSON.stringify({
          //   loai: self.be_wc_model.selectModel,
          //   ghi_chu: self.be_wc_model.ghi_chu_them
          //   });
          // self.dialogWC = false;
          congviec = {
            ma_cv: this.be_wc_model.hinhthuc_wc,
            gio_bat_dau: moment(`${this.be_wc_model.ngay_thuc_hien} ${this.be_wc_model.gio_thuc_hien}`),
            the_tich_sua: this.ti_me_model.the_tich_sua_new,
            thong_tin_them:  this.be_wc_model.ghi_chu_them,
            ten_cv:  this.wcItem.find(({ code }) => code == this.be_wc_model.hinhthuc_wc).name,
          }
          await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
            self.dialogWC = false;
            // self.loadingChartSK();
            self.countWorkInDay();
            await self.updateBtn();
          })
          break;
        case 'CN':
          self.thong_tin_suc_khoe.dialogCN = true;
          // self.loadingChartSK();
          break;
        case 'THUC':
          // console.log('THUC');
          this.$refs.dialogHoatDong.dialog = true;
          break;

        default:
          gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          break;
      }

      

      console.log('GIO BAT DAU', this.ngu_model.timeNgu);
      if('WC' != code_cv){
       
      }
      
      this.$forceUpdate()
      // self.nguCountDown.circles  = 3;
    },
    async update(ma_cv) {
      let currentDate = moment()
      let start = moment(this.cong_viec_model.gio_bat_dau)
      let workingTime = currentDate.diff(start, 'minutes')
      // console.log('workingTime', workingTime + 'm') // "7m"

      let chamsocModal = {
        id: ma_cv == 'NGU' ? this.ngu_model.id : this.cong_viec_model.id,
        ma_cv: ma_cv,
        status: 'T',
        working_time: workingTime,
      }

      // console.log('ngu_model', this.cong_viec_model)
      const self = this
      await axios.post(config.API_URL + '/updateChamCon', chamsocModal).then(async function (response) {
        // await axios
        //   .get(`${config.API_URL}/getGioBatDauByCV/${ma_cv}`)
        //   .then(response => {
        //     // seft.hotSettings.data = response.data.data;
        //     let data = response.data.data;
        //     self.ti_binh_gan_nhat = data[0].gio_bat_dau ;
        //     console.log('jiraBoards2', data);
        //   });
        // console.log("Gops", response.data);
        await self.updateBtn()
      })
      this.$forceUpdate()
      // self.nguCountDown.circles  = 3;
    },
    async updateBtn(type) {
      const self = this

      console.log('cvModel', this.congViecModel.selected);
      console.log('type', type);
      
      let busua = 'BSB_BSM';
      if(undefined != this.congViecModel.selected){
        busua = this.congViecModel.selected.code;
      }
      if(undefined == type) {
        type = "undefined";
      }
      await axios.get(`${config.API_URL}/getGioBatDauByCV/${busua}/${type}`).then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data
        self.ti_me_model.ti_binh_gan_nhat = moment(data[0].gio_bat_dau).format('YYYY-MM-DD h:mm:ss')
        self.ti_me_model.timeTiBinh = moment(data[0].gio_bat_dau).format('HH:mm')
        self.ti_me_model.timeTiBinh1 = moment(data[0].gio_ke_tiep).format('HH:mm')
        self.ti_me_model.timeTiBinh1Org = data[0].gio_ke_tiep
        self.ti_me_model.the_tich_sua = data[0].the_tich_sua
        self.ti_me_model.the_tich_sua_new = data[0].the_tich_sua
        // console.log('data[0].gio_bat_dau', moment(data[0].gio_bat_dau._i))
        self.cong_viec_model.id = data[0].id
        self.cong_viec_model.ma_cv = data[0].ma_cv
        self.cong_viec_model.status = data[0].status
        self.cong_viec_model.gio_bat_dau = data[0].gio_bat_dau
        self.cong_viec_model.gio_ke_tiep = data[0].gio_ke_tiep
        self.ti_me_model.gio_bat_dau = data[0].gio_bat_dau
        self.ti_me_model.gio_ke_tiep = data[0].gio_ke_tiep
      })

      // await axios
      // .get(`${config.API_URL}/getGioBatDauByCV/BSM`)
      // .then(response => {
      //   // seft.hotSettings.data = response.data.data;
      //   let data = response.data.data;
      //   self.ti_me_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD HH:mm:ss");
      //   self.cong_viec_modle.id = data[0].id;
      //   console.log('jiraBoards2', data);
      // });

      // await axios
      // .get(`${config.API_URL}/getGioBatDauByCV/BET`)
      // .then(response => {
      //   // seft.hotSettings.data = response.data.data;
      //   let data = response.data.data;
      //   self.wc_gan_nhat = moment(data[0].gio_bat_dau).format("YYYY-MM-DD HH:mm:ss");
      //   self.cong_viec_modle.id = data[0].id;
      //   console.log('jiraBoards2', data);
      // });
      await axios.get(`${config.API_URL}/getGioBatDauByCV/NGU/UNDEFINED`).then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data
        self.ngu_model.ngu_gan_nhat = moment(data[0].gio_bat_dau).format('YYYY-MM-DD HH:mm:ss')
        self.ngu_model.timeNgu = moment(data[0].gio_bat_dau).format('HH:mm')
        self.ngu_model.timeNgu1 = moment(data[0].gio_ke_tiep).format('HH:mm')
        self.ngu_model.timeNgu1Org = data[0].gio_ke_tiep
        self.ngu_model.id = data[0].id
        self.ngu_model.ma_cv = data[0].ma_cv
        self.ngu_model.status = data[0].status
        self.ngu_model.gio_bat_dau = data[0].gio_bat_dau
        self.ngu_model.gio_ke_tiep = data[0].gio_ke_tiep
        self.ngu_model.gio_bat_dau = data[0].gio_bat_dau
        self.ngu_model.gio_ke_tiep = data[0].gio_ke_tiep

        // let current = moment();
        // let min7 = moment(data[0].gio_ke_tiep);
        // console.log('MIN', min7.diff(current, "minutes") + "m"); // "7m"
        // console.log('jiraBoards2', data);
      })

      //update count down
      let current = moment();

      /**Ti Binh */
      let min7 = moment(self.ti_me_model.gio_bat_dau)
      var durationTM = moment.duration(current.diff(min7))
      // let hour = min7.diff(current, "hours");
      // let min = min7.diff(current, "minutes");
      // let second = current.diff(min7, "seconds");
      // self.tibinhCountDown.circles[1].value = min;
      console.log('MIN1', current.diff(min7, 'minutes')) // "7m"
      console.log('self.ti_me_model.gio_bat_dau', self.ti_me_model.gio_bat_dau) // "7m"
      
      // self.tibinhCountDown.circles = [];
      // self.tibinhCountDown.circles.push({
      //   id: '4',
      //   steps: 365,
      //   size: 40,
      //   value: parseInt(durationTM.asDays()),
      //   // stepLength: -1,
      //   label: 'Ngày',
      //   strokeWidth: 3,
      //   labelFontSize: 12,
      //   fillColor: '#312d4b',
      //   strokeColor: '#008080',
      //   underneathStrokeColor: '#DCDCDC',
      //   valueFontSize: 20,
      //   labelFontSize: 12,
      //   key: 'NGAY',
      // })
      // self.tibinhCountDown.circles.push({
      //   id: '3',
      //   steps: 60,
      //   size: 40,
      //   value: parseInt(durationTM.asHours() % 60),
      //   // stepLength: -1,
      //   label: 'Giờ',
      //   strokeWidth: 3,
      //   labelFontSize: 12,
      //   fillColor: '#312d4b',
      //   strokeColor: '#008080',
      //   underneathStrokeColor: '#DCDCDC',
      //   valueFontSize: 20,
      //   labelFontSize: 12,
      //   dependentCircles: ['4'],
      //   key: 'GIO',
      // })

      // self.tibinhCountDown.circles.push({
      //   id: '2',
      //   steps: 60,
      //   size: 40,
      //   value: parseInt(durationTM.asMinutes()) % 60,
      //   // stepLength: -1,
      //   strokeWidth: 3,
      //   labelFontSize: 12,
      //   fillColor: '#312d4b',
      //   label: 'Phút',
      //   strokeColor: '#4169E1',
      //   underneathStrokeColor: '#DCDCDC',
      //   dependentCircles: ['3'],
      //   key: 'PHUT',
      // })
      // self.tibinhCountDown.circles.push({
      //   id: '1',
      //   steps: 60,
      //   size: 40,
      //   value: parseInt(durationTM.asSeconds) % 60,
      //   // stepLength: -1,
      //   label: 'Giây',
      //   strokeWidth: 3,
      //   labelFontSize: 12,
      //   fillColor: '#312d4b',
      //   strokeColor: '#C71585',
      //   underneathStrokeColor: '#DCDCDC',
      //   dependentCircles: ['2'],
      //   key: 'GIAY',
      // })

      // //End ti bin

      // /** NGu */
      // let timeCountNgu = moment(self.ngu_model.gio_bat_dau)
      // var duration = moment.duration(current.diff(timeCountNgu))
      // console.log('self.ngu_model', parseInt(duration.asMinutes()) % 60)

      // self.nguCountDown.circles = []
      // self.nguCountDown.circles.push({
      //   id: '3',
      //   steps: 60,
      //   size: 40,
      //   value: parseInt(duration.asHours()),
      //   // value: 0,
      //   // stepLength: -1,
      //   // label: 'Giờ',
      //   strokeWidth: 5,
      //   strokeColor: '#008080',
      //   underneathStrokeColor: '#DCDCDC',
      //   valueFontSize: 20,
      //   labelFontSize: 12,
      //   fillColor: '#312d4b',
      // })

      // self.nguCountDown.circles.push({
      //   id: '2',
      //   steps: 60,
      //   size: 40,
      //   value: parseInt(duration.asMinutes()) % 60,
      //   // value: 0,
      //   // stepLength: -1,
      //   strokeWidth: 5,
      //   labelFontSize: 12,
      //   // label: 'Phút',
      //   strokeColor: '#4169E1',
      //   underneathStrokeColor: '#DCDCDC',
      //   dependentCircles: ['3'],
      //   fillColor: '#312d4b',
      // })
      // self.nguCountDown.circles.push({
      //   id: '1',
      //   steps: 60,
      //   size: 40,
      //   value: parseInt(duration.asSeconds()) % 60,
      //   value: 0,
      //   // stepLength: -1,
      //   // label: 'Giây',
      //   strokeColor: '#C71585',
      //   underneathStrokeColor: '#DCDCDC',
      //   dependentCircles: ['2'],
      //   strokeWidth: 5,
      //   labelFontSize: 12,
      //   fillColor: '#312d4b',
      // })
      //End ngu
    },
    tinhCanNang(){
      let can_nang_con = 0;
      if(this.thong_tin_suc_khoe.can_nang_total != undefined
      && this.thong_tin_suc_khoe.can_nang_bo    != undefined
      && this.thong_tin_suc_khoe.can_nang_total != null
      && this.thong_tin_suc_khoe.can_nang_bo    != null){
        can_nang_con = (parseFloat(this.thong_tin_suc_khoe.can_nang_total) - parseFloat(this.thong_tin_suc_khoe.can_nang_bo)).toFixed(2);
      }
      this.thong_tin_suc_khoe.can_nang = can_nang_con;
    },
    finished: () => {
      console.log('finished')
    },
    updated: status => {
      console.log(status) //{"value": 144, "seconds": 24, "minutes": 2, "hours": 0}
    },

    async loadingChart() {
      const self = this;
      // self.$refs.totalChart.updateOptions({ xaxis: {
      //   categories: [],
      // },})
      self.seriesTotal = [];

      // self.series = [];
      // self.chartOptions.xaxis.categories = []
      // while (self.chartTotalOptions.xaxis.categories.length > 0) {
      //   self.chartTotalOptions.xaxis.categories.pop();
      // }
      // await axios
      // .get(`${config.API_URL}/selectDataChart/${this.slider}/${this.thong_ke.loai_thong_ke}`)
      // .then(response => {
      //   // self.chartOptions.xaxis.categories = [];
      //   let chartData = response.data.chartData
      //   if (self.thong_ke.loai_thong_ke == 'NGAY') {
      //     console.log('response33331', response.data.chartData)
      //     if (self.chartOptions.xaxis.categories.length <= 0) {
      //       for (let i = 0; i < response.data.xaxis.length; i++) {
      //         self.chartOptions.xaxis.categories.push(moment(response.data.xaxis[i]).format('YYYY-MM-DD'))
      //       }
      //     }
      //   } else {
      //   }

      //   chartData.forEach(async function (item) {
      //     item.type = 'line'
      //     // x
      //     console.log('item.xaxis', response.data.xaxis)

      //     // xaxis: {
      //     // categories: [1,2,3,4,5,6,7,8,9,10]
      //     self.series.push(item)
      //   })

      //   console.log('selectDataChart', response.data)
      // })
      
      //chart 2
      // self.chartTotalOptions.xaxis.categories = [];
      // self.seriesTotal[0].data = [];
      // self.seriesTotal[1].data = [];

      // self.seriesTotal[2].data = [];
      // self.seriesTotal[3].data = [];
      // self.seriesTotal[4].data = [];
      // self.seriesTotal[5].data = [];
      // self.seriesTotal[6].data = [];
      let cats = [];
      let myArray = [];
      let categories = [];
      // this.chartTotalOptions.xaxis.categories.push('2021-12-29');
        // self.seriesTotal[0].data.push(10);
      let tong_luong_sua = [];
      let tb_moi_lan_ti = [];
      let so_lan_ti = [];
      let so_lan_wc = [];
     await axios
        .get(`${config.API_URL}/selectChartTotalAvg/${this.slider}`)
        .then(async function (response){
          myArray = response.data.data;
          let x_date = new Set();
          myArray.forEach(function(element, idex){
            let newitem = moment(element.ngay_thuc_hien).format('YYYY-MM-DD');
             categories.indexOf(newitem) === -1 
            ? categories.push(newitem) : console.log('exists');
          });
          
         
          categories.forEach(function(item, idx) {
            if(idx < self.slider){
              myArray.forEach(function(element, idex){
                const ma_cv = element.ma_cv;
                // console.log('myArray', myArray);
                if(moment(item).format('YYYY-MM-DD') == moment(element.ngay_thuc_hien).format('YYYY-MM-DD')){
                  console.log('ma_cv', ma_cv, idex,element, element.ngay_thuc_hien);
                  if('BS' == ma_cv.trim()){
                    // Tổng lượng sữa
                    tong_luong_sua.push(parseInt(element.total_sua));
                    //TB mỗi lần ti
                    tb_moi_lan_ti.push(Math.round(element.agv_bu));
                    //Số lần ti
                    so_lan_ti.push(parseInt(element.so_lan));
                  }
                  if('BE' == ma_cv.trim() || 'WC' == ma_cv.trim()){
                    //Tổng thời gian ngủuh
                    so_lan_wc.push(parseInt(element.so_lan));
                  }
                  
                  // switch (ma_cv) {
                  //   case 'BS':
                  //     // Tổng lượng sữa
                  //     tong_luong_sua.push(parseInt(element.total_sua));
                  //     //TB mỗi lần ti
                  //     tb_moi_lan_ti.push(Math.round(element.agv_bu));
                  //     //Số lần ti
                  //     so_lan_ti.push(parseInt(element.so_lan));
                  //     break;
                  //   case 'NG':seleted
                  //     //  //Tổng thời gian ngủ
                  //     // self.seriesTotal[2].data.push(parseInt(element.total_time_ngu));
                  //     // //TB mỗi lần ngủ
                  //     // self.seriesTotal[3].data.push(Math.round(element.agv_ngu));
                  //     // //Số lần ngu
                  //     // self.seriesTotal[5].data.push(parseInt(element.so_lan));
                  //     break;
                  //   case 'BE':
                  //     //  //Tổng thời gian ngủ
                  //     so_lan_wc.push(parseInt(element.so_lan));
                  //     break;
                  //   case 'WC':
                  //     //  //Tổng thời gian ngủ
                  //     so_lan_wc.push(parseInt(element.so_lan));
                  //     break;
                  
                  //   default:
                  //     break;
                  // }
                }
                
              });
            }

          });
        
          console.log('so_lan_wc', so_lan_wc);
          self.$refs.totalChart.updateOptions({ xaxis: {
            categories: categories,
          },})

          self.seriesTotal.push({
            name: 'Tổng lượng sữa',
            type: 'line',
            data: tong_luong_sua,
          });

          self.seriesTotal.push({
            name: 'TB ti sữa',
            type: 'column',
            data: tb_moi_lan_ti,
          });

          self.seriesTotal.push({
            name: 'Số lần ti',
            type: 'column',
            data: so_lan_ti,
          });

          self.seriesTotal.push({
            name: 'Số lần WC',
            type: 'line',
            data: so_lan_wc,
          });
          
            
          console.log('self.seriesTotal2', self.seriesTotal);
          console.log('chartTotalOptions', self.chartTotalOptions.xaxis.categories); 
          
          
        }).finally(function(){
          // self.chartTotalOptions.xaxis.categories.push(1000);
          
          
         
          
        });
       
      this.$forceUpdate();
    },

    async loadingChartSK() {
      const self = this;
    
      self.serialsSucKhoe = [];
      let ho_ten = 'NGUYỄN ĐĂNG KHÔI';
      // let limit = 5;
      let can_nang_arr = [];
      let can_nang_tc_arr = [];
      let ti_le_tang_arr = [];
      let chieu_cao_arr = [];
      let chieu_cao_tc_arr = [];
      let tang_chieu_cao = [];

      let myArray = [];
      let categories  = [];
      await axios
        .get(`${config.API_URL}/selectChartSucKhoe/${self.sliderSK}/${self.chartOptionSelect.code}`)
        .then(async function (response){
          myArray = response.data.data;
          let x_date = new Set();
          myArray.forEach(function(element, idex){
            let newitem = moment(element.ngay_bat_dau).format('YYYY-MM-DD');
            categories.push(newitem);
            can_nang_arr.push(element.can_nang);
            can_nang_tc_arr.push(element.can_nang_tc);
            ti_le_tang_arr.push(element.ti_le_tang_giam);
            chieu_cao_arr.push(element.chieu_cao);
            chieu_cao_tc_arr.push(element.chieu_cao_tc);
            tang_chieu_cao.push(element.tang_chieu_cao);
          });
          
          self.$refs.refChartSucKhoe.updateOptions({ xaxis: {
            categories: categories,
          },})

          let f_cn = self.chartSKColSelect.find(({code}) => code == 'CN');
          let TL_CN = self.chartSKColSelect.find(({code}) => code == 'TL_CN');
          let TL_CC = self.chartSKColSelect.find(({code}) => code == 'TL_CC');
          let CN_TC = self.chartSKColSelect.find(({code}) => code == 'CN_TC');
          let CC_TC = self.chartSKColSelect.find(({code}) => code == 'CC_TC');
          let CC = self.chartSKColSelect.find(({code}) => code == 'CC');

          if(f_cn != undefined && f_cn != null){
            self.serialsSucKhoe.push({
              name: 'Cân nặng',
              type: 'line',
              data: can_nang_arr,
            });
          }
          if(TL_CN != undefined && TL_CN != null){
            self.serialsSucKhoe.push({
              name: 'Tăng cân nặng',
              type: 'line',
              data: ti_le_tang_arr,
            });
          }
           if(CN_TC != undefined && CN_TC != null){
            self.serialsSucKhoe.push({
              name: 'Cân nặng TC',
              type: 'area',
              data: can_nang_tc_arr,
            });
          }

           if(CC_TC != undefined && CC_TC != null){
            self.serialsSucKhoe.push({
              name: 'Chiều cao TC',
              type: 'area',
              data: chieu_cao_tc_arr,
            });
          }
           if(CC != undefined && CC != null){
            self.serialsSucKhoe.push({
              name: 'Chiều cao',
              type: 'line',
              data: chieu_cao_arr,
            });
          }
          // self.serialsSucKhoe.push({
          //   name: 'Chiều Cao',
          //   type: 'bar',
          //   data: chieu_cao_arr,
          // });
          if(TL_CC != undefined && TL_CC != null){
            self.serialsSucKhoe.push({
              name: 'Tăng chiều cao',
              type: 'line',
              data: tang_chieu_cao,
            });
          }

          console.log('self.serialsSucKhoe', self.serialsSucKhoe);
          console.log('categories', categories); 

        }).finally(function(){
        });
       
      this.$forceUpdate();
    },
    async changeSlider() {
      console.log('changeSlider', this.slider)
      await this.loadingChart()
    },
    async changeSliderSK() {
      console.log('changeSlider', this.sliderSK)
      await this.loadingChartSK()
    },

    //Time line bú sữa
    async showChartKCBS(){
      const self = this;
      this.seriesTotalKCBS = [];
      console.log('showChartKCBS', this.chartKCBS)
      // this.chartTotalOptionsWC.xaxis.categories = [];
      while (this.chartTotalOptionsKCBS.xaxis.categories.length) {
        this.chartTotalOptionsKCBS.xaxis.categories.pop();
      }
      let param = {
        ma_cv: 'BSB_UONG',
        ho_ten: 'NGUYEN DANG KHOI',
        limit: this.sliderKCBS,
        startDate: this.chartKCBS.condition.startDate,
        endDate: this.chartKCBS.condition.endDate,
        type: this.chartKCBS.selected.sql
      }
      if(this.chartKCBS.selected.code != 'NGAY'){
        param.ma_cv = ['BSB_UONG', 'BSM'];
        await axios
          .post(`${config.API_URL}/selectKhoangThoiGianTheoCongViecByDate`, param)
          .then(function (response){
              console.log('selectKhoangThoiGianTheoCongViecByDate', response.data.data);
              console.log('reponse', response);
              let arr = response.data.data;
              let dataChart = []  ;
              let categories = [];
              let arr_the_tich = [];
              let arr_so_cu = [];
              let yaxisArr = [];
              for(let i = 0; i < arr.length; i++){
                arr_so_cu.push(Math.round(arr[i].so_cu));
                arr_the_tich.push(Math.round(arr[i].the_tich_sua));
                // dataChart.push([
                //   Math.round(arr[i].thoi_gian_cho_hour),
                //   Math.round(arr[i].the_tich_sua)
                // ]);
                // dataChart.push(arr[i].thoi_gian_cho);
                // categories.push(arr[i].ngay_thuc_hien);
                self.chartTotalOptionsKCBS.xaxis.categories.push(moment(arr[i].year_month).format(config.DATE_FM));
              }
              
              yaxisArr.push( {
                seriesName: 'Tổng số cữ',
                show: true,
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: '#00E396',
                },
                labels: {
                  style: {
                    colors: '#FF0000',
                  },
                },
                title: {
                  text: 'lần',
                  style: {
                    color: '#00E396',
                  },
                },
                tooltip: {
                  enabled: true,
                },
              });
              self.seriesTotalKCBS.push({
                name: 'Số cữ',
                type: 'column',
                data: arr_so_cu,
                enabled:true,
              });

              yaxisArr.push( {
                seriesName: 'the_tich_sua',
                opposite: true,
                show: true,
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: '#00E396',
                },
                labels: {
                  style: {
                    colors: '#FF0000',
                  },
                },
                title: {
                  text: 'ml',
                  style: {
                    color: '#00E396',
                  },
                },
                tooltip: {
                  enabled: true,
                },
            });

            self.seriesTotalKCBS.push({
              name: 'Thể tích TB',
              type: 'line',
              data: arr_the_tich,
              enabled:true,
            });
            console.log('dataChart', dataChart);
            self.$refs.chartTotalOptionsKCBS.updateOptions({ yaxis: yaxisArr,});
    
          });
      }else {
        await axios
          .post(`${config.API_URL}/selectKhoangThoiGianTheoCongViec`, param)
          .then(function (response){
            console.log('reponse', response);
            let arr = response.data.data;
            let dataChart = []  ;
            let categories = [];
            let arr_THOI_GIAN_CHO = [];
            let arr_THE_TICH = [];
            let yaxisArr = [];
            for(let i = 0; i < arr.length; i++){
              arr_THOI_GIAN_CHO.push(Math.round(arr[i].thoi_gian_cho_hour));
              arr_THE_TICH.push(Math.round(arr[i].the_tich_sua));
              // dataChart.push([
              //   Math.round(arr[i].thoi_gian_cho_hour),
              //   Math.round(arr[i].the_tich_sua)
              // ]);
              // dataChart.push(arr[i].thoi_gian_cho);
              // categories.push(arr[i].ngay_thuc_hien);
              self.chartTotalOptionsKCBS.xaxis.categories.push(moment(arr[i].gio_bat_dau).format('YYYY-MM-DD HH:mm'));
            }
            
            yaxisArr.push( {
              seriesName: 'thoi_gian_cho_hour',
              show: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#00E396',
              },
              labels: {
                style: {
                  colors: '#FF0000',
                },
              },
              title: {
                text: 'ml',
                style: {
                  color: '#00E396',
                },
              },
              tooltip: {
                enabled: true,
              },
            });
            self.seriesTotalKCBS.push({
              name: 'Thời gian cách nhau',
              type: 'column',
              data: arr_THOI_GIAN_CHO,
              enabled:true,
            });

            yaxisArr.push( {
              seriesName: 'the_tich_sua',
              opposite: true,
              show: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#00E396',
              },
              labels: {
                style: {
                  colors: '#FF0000',
                },
              },
              title: {
                text: 'Thể tích sữa',
                style: {
                  color: '#00E396',
                },
              },
              tooltip: {
                enabled: true,
              },
          });

          self.seriesTotalKCBS.push({
            name: 'Thể tích',
            type: 'line',
            data: arr_THE_TICH,
            enabled:true,
          });
          console.log('dataChart', dataChart);
          self.$refs.chartTotalOptionsKCBS.updateOptions({ yaxis: yaxisArr,});
  
        });
      }
    },
    async showChartWC(){
      const self = this;
      this.seriesTotalWC = [];
      // this.chartTotalOptionsWC.xaxis.categories = [];
      while (this.chartTotalOptionsWC.xaxis.categories.length) {
        this.chartTotalOptionsWC.xaxis.categories.pop();
      }
      let param = {
        ma_cv: 'WC',
        ho_ten: 'NGUYEN DANG KHOI',
        limit: this.sliderWC,
      }
      await axios
        .post(`${config.API_URL}/selectKhoangThoiGianTheoCongViec`, param)
        .then(function (response){
          console.log('reponse', response);
          let arr = response.data.data;
          let dataChart = []  ;
          let categories = [];
          for(let i = 0; i < arr.length; i++){
            
            dataChart.push(Math.round(arr[i].thoi_gian_cho_hour));
            // dataChart.push(arr[i].thoi_gian_cho);
            // categories.push(arr[i].ngay_thuc_hien);
            self.chartTotalOptionsWC.xaxis.categories.push(moment(arr[i].ngay_thuc_hien).format('YYYY-MM-DD HH:mm'));
          }
          
          
          self.seriesTotalWC.push({
            name: 'GIO',
            type: 'line',
            data: dataChart,
            enabled:true,
          });
          console.log('dataChart', dataChart);
          
      });
    },
    async showChartNGU(){
      const self = this;
      this.seriesTotalNGU = [];
      let yaxisArr = [];
      let arr_TOTAL = [];
      let arr_SO_LAN = [];
      // this.chartTotalOptionsWC.xaxis.categories = [];
      while (this.chartTotalOptionsNGU.xaxis.categories.length) {
        this.chartTotalOptionsNGU.xaxis.categories.pop();
      }
      let param2 = {
        ma_cv: 'NGU',
        ho_ten: 'NGUYEN DANG KHOI',
        limit: this.sliderBS,
      }
      await axios
        .post(`${config.API_URL}/selectDataChartbyCongViec`, param2)
        .then(function (response){
          console.log('selectDataChartbyCongViec', response.data.data);
          let arr = response.data.data;
          
           for(let i = 0; i < arr.length; i++){
            arr_TOTAL.push(Math.round(arr[i].tong_so_phut));
            arr_SO_LAN.push(Math.round(arr[i].so_lan));
            console.log('start_date', moment(arr[i].start_date).format('DD-MM-YYYY'));
            self.chartTotalOptionsNGU.xaxis.categories.push(moment(arr[i].start_date).format('DD-MM-YYYY'));
          }
      });
      //yaxisArr
      yaxisArr.push( {
        seriesName: 'PHÚT',
        show: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396',
        },
        labels: {
          style: {
            colors: '#FF0000',
          },
        },
        title: {
          text: 'Phút',
          style: {
            color: '#00E396',
          },
        },
        tooltip: {
          enabled: true,
        },
      });

      this.seriesTotalNGU.push({
        name: 'Tổng thời gian ngủ',
        type: 'line',
        data: arr_TOTAL,
        enabled:true,
      });
      yaxisArr.push( {
          seriesName: 'SO_LAN',
          opposite: true,
          show: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396',
          },
          labels: {
            style: {
              colors: '#FF0000',
            },
          },
          title: {
            text: 'Số lần',
            style: {
              color: '#00E396',
            },
          },
          tooltip: {
            enabled: true,
          },
      });
      this.seriesTotalNGU.push({
        name: 'Số lần',
        type: 'line',
        data: arr_SO_LAN,
        enabled:true,
      });
      this.$refs.chartTotalOptionsNGU.updateOptions({ yaxis: yaxisArr,});
    },
    async showChartBS(){
      const self = this;
      this.seriesTotalBS = [];
      // this.chartTotalOptionsWC.xaxis.categories = [];
      while (this.chartTotalOptionsBS.xaxis.categories.length) {
        this.chartTotalOptionsBS.xaxis.categories.pop();
      }
      


      let param = {
        ma_cv: 'WC',
        ho_ten: 'NGUYEN DANG KHOI',
        limit: this.sliderBS,
      }
      await axios
        .post(`${config.API_URL}/selectBuSua`, param)
        .then(function (response){
          console.log('reponse', response);
          let arr = response.data.data;
          let dataChart = []  ;
          let yaxisArr = [];
          let categories = [];
          let arr_BSB_UONG = [];
          let arr_BSB_HUT = [];

          let arr_BSB_UONG_SO_LAN = [];
          let arr_BSB_HUT_SO_LAN = [];
          for(let i = 0; i < arr.length; i++){
            arr_BSB_UONG.push(Math.round(arr[i].BSB_UONG));
            arr_BSB_HUT.push(Math.round(arr[i].BSB_HUT));

            arr_BSB_UONG_SO_LAN.push(Math.round(arr[i].BSB_UONG_SO_LAN));
            arr_BSB_HUT_SO_LAN.push(Math.round(arr[i].BSB_HUT_SO_LAN));
                        // dataChart.push(arr[i].thoi_gian_cho);
            // categories.push(arr[i].ngay_thuc_hien);
            // let exist = self.chartTotalOptionsBS.xaxis.categories.find(({code}) => code == arr[i].gio_bat_dau)
            self.chartTotalOptionsBS.xaxis.categories.push(moment(arr[i].gio_bat_dau).format('DD-MM-YYYY'));
          }
          yaxisArr.push( {
            seriesName: 'THE_TICH',
            show: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00E396',
            },
            labels: {
              style: {
                colors: '#FF0000',
              },
            },
            title: {
              text: 'ml',
              style: {
                color: '#00E396',
              },
            },
            tooltip: {
              enabled: true,
            },
        });

        self.seriesTotalBS.push({
            name: 'Lượng sữa uống',
            data: arr_BSB_UONG,
            type: "column"
            
        });

          yaxisArr.push( {
            seriesName: 'THE_TICH_1',
            show: false,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00E396',
            },
            labels: {
              style: {
                colors: '#FF0000',
              },
            },
            title: {
              text: 'ml',
              style: {
                color: '#00E396',
              },
            },
            tooltip: {
              enabled: true,
            },
        });
        self.seriesTotalBS.push({
            name: 'Lượng sữa tích',
            data: arr_BSB_HUT,
            type: "column"
        })

        yaxisArr.push( {
          seriesName: 'SO_LAN',
          opposite: true,
          show: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396',
          },
          labels: {
            style: {
              colors: '#FF0000',
            },
          },
          title: {
            text: 'Số lần',
            style: {
              color: '#00E396',
            },
          },
          tooltip: {
            enabled: true,
          },
      });

      self.seriesTotalBS.push({
        name: 'Số lần uống',
        type: 'line',
        data: arr_BSB_UONG_SO_LAN,
        enabled:true,
      });

        yaxisArr.push( {
          opposite: true,
          show: false,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396',
          },
          labels: {
            style: {
              colors: '#FF0000',
            },
          },
          title: {
            text: 'Số lần',
            style: {
              color: '#00E396',
            },
          },
          tooltip: {
            enabled: true,
          },
        });
        self.seriesTotalBS.push({
          name: 'Số lần hút',
          type: 'line',
          data: arr_BSB_HUT_SO_LAN,
          enabled:false,
        });

          self.$refs.chartTotalOptionsBS.updateOptions({ yaxis: yaxisArr,});

        console.log('dataChart', dataChart);
          
      });
    },
    zoomOutKCBS () {
      this.sliderKCBS = (this.sliderKCBS - 1) || 1;
      this.showChartKCBS();
    },
    zoomInKCBS () {
      this.sliderKCBS = (this.sliderKCBS + 1) || this.maxValue.value1;
      this.showChartKCBS();
    },
    zoomOutSK () {
      this.sliderSK = (this.sliderSK - 1) || 1;
      this.changeSliderSK();
    },
    zoomInSK () {
      this.sliderSK = (this.sliderSK + 1) || this.maxValue.value1;
      this.changeSliderSK();
    },
    // zoomInSK showChartBS
    zoomOutBS () {
      this.sliderBS = (this.sliderBS - 1) || 1;
      this.showChartBS();
      this.showChartNGU();
    },
    zoomInBS () {
      this.sliderBS = (this.sliderBS + 1) || this.maxValue.value1;
      this.showChartBS();
      this.showChartNGU();
    },

    theTichSuaChange(type){
      this.cuSuaModel.the_tich_sua_new  = (this.cuSuaModel.the_tich_sua_new  + 5 *(type=="+" ? 1 : -1 )) || 100; 
      
    },
    async loadNguThuc(){
      let self = this;
      console.log('cron');
      await axios.get(`${config.API_URL}/getGioBatDauByCV/NGU/COUNT_DOWN`).then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data;
        // var durationTM = moment.duration(moment(gio_bat_dau).diff(moment(data[0].gio_bat_dau)));
        //  let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
        console.log('data_THUC', data);
        console.log('data.gio_bat_dau', moment(data[0].gio_bat_dau));
        // console.log('gio_bat_dau', moment(gio_bat_dau));
        // console.log('durationTM', durationTM);
        // console.log('durationTM', durationTM._milliseconds);
        self.nguThucModal.name = data[0].status  == 'N' ? 'Thức' : 'Ngủ';
        self.nguThucModal.ten_cv = data[0].ten_cv;
        self.nguThucModal.data = data[0];
        self.nguThucModal.code = data[0].status;
        self.nguThucModal.orgDate = data[0].gio_bat_dau;
        self.nguThucModal.lastTime = moment(data[0].gio_bat_dau).format(config.DATE_TIME_FM_1);
        
        // self.modal.duration = Math.floor((durationTM._milliseconds / (1000 * 60)));
      })
    },
    async updateNgu(type) {
      console.log('Current status:', this.nguThucModal);
      this.loadNguThuc();
      if(this.nguThucModal.code  == 'N'){
          // this.$refs.dialogHoatDong.modal.duration = 100000;
          this.$refs.dialogHoatDong.modal.loaiHoatDong = {
            name: 'Thức',
            code: 'THUC',
          };
          var durationTM = moment.duration(moment(new Date()).diff(moment(this.nguThucModal.data.gio_bat_dau)));
          //  let duration = moment.duration(moment(new Date()).diff(moment(response.data.data[0].ngay_thuc_hien_gan_nhat)));
          let value =  Math.floor((durationTM._milliseconds / (1000 * 60)));
          this.$refs.dialogHoatDong.modal.duration = value;
          this.$refs.dialogHoatDong.modal.durationStr = `${ Math.floor(value / 60) } giờ ${ (value % 60)} phút`
      }
      if('OPEN' == type){
        this.$refs.dialogHoatDong.dialog = true;

      }
    },
    async loadListDetail(type) {
        console.log('loadListDetail');
        let self = this;
        await axios
          .get(`${config.API_URL}/selectCongViecByDate/'${type}'/${moment(this.lstDetail.date).format(config.DATE_FM)}`)
          .then(response => {
            // seft.hotSettings.data = response.data.data;
            let data = response.data.data;
            let arr = [];
            for(let i = 0; i < data.length; i ++){
              data[i].item_time_lbl = data[i].ma_cv == 'BSB_UONG' ? `${data[i].the_tich_sua} ml` : `${Math.floor(data[i].working_time / 60) } giờ ${data[i].working_time % 60} phút`;
              arr.push(data[i]);
              console.log('data[i]', data[i]);
            }
            self.$refs.chamConListDialog.item = {
              title: type,
              date: moment(new Date()).format(config.DATE_FM),
              item: {
                tblDataCongViec: [
                  {
                    children: arr,
                  }
                ]
              }
              
            }
            self.$refs.chamConListDialog.dialog = true;
            
            // self.tblDataCongViec = data;
            console.log('item-data', data);
          });
          
        this.$refs.chamConListDialog.dialog = true;
      },

      openDetail(){
        console.log('item-tuan_tuoi', this.tuan_tuoi);
        this.$refs.dialogInformation.dialog = true;
      },

      insertBSB(){
        console.log('insertBSB');
        this.insert('BSB_UONG');
      },
      classMobile (idx) {
        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          )
        ) {
          return `mobile${idx == undefined ? "" : idx}`;
        } else {
          return '';
        }
      },
  },
}
</script>
<style lang="scss">
.custom-row {
  height: 35px !important;
  button {
    height: 30px !important;
  }
}
.list-table {
  td {
    height: 35px !important;
  }
}
.text-right.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
  // .text-right > .v-text-field__slot > input{
  text-align: right !important;
}
// @import './Bebidas.scss';
.countdown {
  float: right;
}

.row-total span{
  color:#606266;
}
.vgt-table.bordered th.vgt-row-header{
  color: #606266;
}
</style>
