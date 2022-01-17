<template>
  <v-row class="match-height">
    <v-card-title class="pb-0">
      Chăm sóc Đăng Khôi
      <h5 color="warning">{{ tuan_tuoi }}</h5>
    </v-card-title>
    <!-- Bú sữa -->
    <v-col cols="12" md="12" class="pa-0">
      <v-card>
        <v-card-title class="pt-5 pb-2">
          <v-col cols="5" md="5" class="pb-0 mb-0"> Uống sữa </v-col>
          <v-col cols="7" md="7" class="pa-0 ma-0 text-right">
            <circular-count-down-timer
              :circles="tibinhCountDown.circles"
              :interval="tibinhCountDown.interval"
              :main-circle-id="tibinhCountDown.mainCircleId || '1'"
              :size="tibinhCountDown.size"
              :container-classes="['countdown']"
              :circle-classes="tibinhCountDown.circleClasses"
              :stop-conditions="tibinhCountDown.stopConditions"
              :trigger-update="tibinhCountDown.triggerUpdate"
              :stroke-width="tibinhCountDown.strokeWidth"
              :stroke-color="tibinhCountDown.strokeColor"
              :underneath-stroke-color="tibinhCountDown.underneathStrokeColor"
              :fill-color="tibinhCountDown.fillColor"
              :value-font-size="tibinhCountDown.valueFontSize"
              :label-font-size="tibinhCountDown.labelFontSize"
              :label-position="tibinhCountDown.labelPosition"
            />
          </v-col>
        </v-card-title>

        <v-divider class="mx-4"></v-divider>
        <v-card-text class="mt-0 mb-0 pt-3 pb-1">
          <!-- Row 1 -->
          <v-row class="ml-2 mr-2">
            <v-col cols="3" md="3" class="pb-0 mb-0 ml-0 mr-0 pl-0 pr-0">
              <v-checkbox
                v-model="ti_me_model.isEditTimeTiBinh"
                label="Sửa giờ"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col cols="3" md="3" class="pb-0 mb-0 ml-0 mr-0 pl-0 pr-0">
              <v-dialog
                ref="dialogTiGanNhat"
                v-model="ti_me_model.modalTiBinh"
                :return-value.sync="ti_me_model.timeTiBinh"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="ti_me_model.timeTiBinh"
                    label="Bắt đầu"
                    class="text-right"
                    readonly
                    :disabled="!ti_me_model.isEditTimeTiBinh"
                    v-bind="attrs"
                    v-on="on"

                    append-outer-icon="mdi-map-marker"
                  ></v-text-field>
                </template>
                <v-time-picker v-if="ti_me_model.modalTiBinh" v-model="ti_me_model.timeTiBinh" full-width>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="ti_me_model.modalTiBinh = false"> Cancel </v-btn>
                  <v-btn text color="primary" @click="$refs.dialogTiGanNhat.save(ti_me_model.timeTiBinh)"> Save </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col cols="3" md="3" class="pb-0 mb-0 ml-0 pl-0">
              <v-dialog
                ref="dialogTiKeTiep"
                v-model="ti_me_model.modalTiBinh1"
                :return-value.sync="ti_me_model.timeTiBinh1"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="ti_me_model.timeTiBinh1"
                    label="Tiếp theo"
                    class="text-right"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    hide-details
                  ></v-text-field>
                </template>
                <v-time-picker v-if="ti_me_model.modalTiBinh1" v-model="ti_me_model.timeTiBinh1" full-width>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="ti_me_model.modalTiBinh1 = false"> Cancel </v-btn>
                  <v-btn text color="primary" @click="$refs.dialogTiKeTiep.save(ti_me_model.timeTiBinh1)"> Save </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col cols="3" md="3" class="pb-0 mb-0 ml-0 mr-0 pl-0 pr-0">
              <v-text-field
                v-model="ti_me_model.the_tich_sua"
                label="Thể tích"
                class="text-right"
                readonly
                suffix="ml"
                text-align="right"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Row 2 -->
          <v-row class="mb-0 ml-2 mr-2">
            <v-col cols="9" md="9" class="pb-0 mb-0">
              <v-radio-group v-model="ti_me_model.loai_sua" row>
                <v-radio label="Sữa mẹ" value="BSM" hide-details></v-radio>
                <v-radio label="Sữa Bình" value="BSB" hide-details></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="3" md="3" class="pt-2 pb-0 mb-0 ml-0 pa-0">
              <v-text-field
                v-model="ti_me_model.the_tich_sua_new"
                label="Thể tích mới"
                type="number"
                class="mb-4 mt-1"
                suffix="ml"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Row 3 -->
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-actions>
          <v-row class="pl-2 float-end">
            <v-btn color="success" @click="insert('CN')" class="mr-1" small> Thêm Cân Nặng </v-btn>
            <v-spacer></v-spacer>
            <!-- <v-btn color="success" @click="insert('BSB')" class="mr-1"> Ti bình </v-btn> -->
            <v-btn color="success" @click="insert('BSB')" class="mr-1" small> Lưu cữ mới </v-btn>
            <v-btn color="warning" @click="update('BSM')" class="mr-1" :disabled="true" small>
              <v-icon dark>
                {{ icons.mdiCircleEditOutline }}
              </v-icon>
            </v-btn>
            <v-btn color="error" @click="update('BSM')" class="mr-1" :disabled="true" small>
              <v-icon dark>
                {{ icons.mdiDeleteOutline }}
              </v-icon>
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>

    <!-- NGỦ-->
    <v-col cols="12" md="12" class="pa-0 mt-2">
      <v-card>
        <v-card-title class="pt-5 pb-2">
          <v-col cols="5" md="5" class="pb-0 mb-0"> Ngủ - WC </v-col>
          <v-col cols="7" md="7" class="pa-0 ma-0 text-right">
            <circular-count-down-timer
              :circles="nguCountDown.circles"
              :interval="nguCountDown.interval"
              :main-circle-id="nguCountDown.mainCircleId || '1'"
              :size="nguCountDown.size"
              :container-classes="['countdown']"
              :circle-classes="nguCountDown.circleClasses"
              :stop-conditions="nguCountDown.stopConditions"
              :trigger-update="nguCountDown.triggerUpdate"
              :stroke-width="nguCountDown.strokeWidth"
              :stroke-color="nguCountDown.strokeColor"
              :underneath-stroke-color="nguCountDown.underneathStrokeColor"
              :fill-color="nguCountDown.fillColor"
              :value-font-size="nguCountDown.valueFontSize"
              :label-font-size="nguCountDown.labelFontSize"
              :label-position="nguCountDown.labelPosition"
            />
          </v-col>
        </v-card-title>

        <v-divider class="mx-4"></v-divider>
        <v-card-text class="mt-0 mb-0 pt-3 pb-1">
          <!-- Row 1 -->
          <v-row class="ml-2 mr-2">
            <v-col cols="3" md="3" class="pb-0 mb-0 ml-0 mr-0 pl-0 pr-0">
              <v-checkbox
                v-model="ngu_model.isEditTimeNgu"
                label="Sửa giờ"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col cols="3" md="3" class="pb-0 mb-0 ml-0 mr-0 pl-0 pr-0">
              <v-dialog ref="dialogNguGanNhat" v-model="ngu_model.modalNgu" :return-value.sync="ngu_model.timeNgu">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="ngu_model.timeNgu"
                    label="Ngủ"
                    class="text-right"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :disabled="!ngu_model.isEditTimeNgu"
                  ></v-text-field>
                </template>
                <v-time-picker v-if="ngu_model.modalNgu" v-model="ngu_model.timeNgu" full-width>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="ngu_model.modalNgu = false"> Cancel </v-btn>
                  <v-btn text color="primary" @click="$refs.dialogNguGanNhat.save(ngu_model.timeNgu)"> Save </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col cols="3" md="3" class="pb-0 mb-0 ml-0 pl-0">
              <v-dialog ref="dialogNguKeTiep" v-model="ngu_model.modalNgu1" :return-value.sync="ngu_model.timeNgu1">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="ngu_model.timeNgu1"
                    label="Thức giấc"
                    class="text-right"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-if="ngu_model.modalNgu1" v-model="ngu_model.timeNgu1" full-width>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="ngu_model.modalNgu1 = false"> Cancel </v-btn>
                  <v-btn text color="primary" @click="$refs.dialogNguKeTiep.save(ngu_model.timeNgu1)"> Save </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col cols="3" md="3" class="pb-0 mb-0 ml-0 mr-0 pl-0 pr-0 mt-3">
              <v-btn color="warning" @click="insert('WC')" style="width: 100%">
                WC ({{ be_wc_model.so_lan_i }} lần)</v-btn
              >
            </v-col>

          </v-row>
          <v-row>
            <v-dialog
              v-model="dialogWC"
              max-width="500px"
            >
              <v-card>
                <v-card-title>
                  Thông tin WC
                </v-card-title>
                <v-card-text>
                  <v-autocomplete
                  label="Tình trạng phân"
                  v-model="be_wc_model.selectModel"
                  :items="be_wc_model.items"
                  item-text="name"
                  item-value="code"
                  dense>
                    
                  </v-autocomplete>
                  <v-text-field
                    label="Ghi chú thêm"
                    v-model="be_wc_model.ghi_chu_them"
                    hide-details
                    clearable
                ></v-text-field>
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
          <!-- Row 3 -->

          <!--- Row CN -->
          <v-row>
              <v-form
                ref="thong_tin_suc_khoe"
                v-model="thong_tin_suc_khoe.valid"
                lazy-validation
              >
              <v-dialog
                v-model="thong_tin_suc_khoe.dialogCN"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
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
                          suffix="gr"
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
                          suffix="gr"
                          clearable
                          required
                          hide-details
                          @input="tinhCanNang()"
                          :rules="emptyRules.can_nang"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
                        <v-text-field
                          label="Cân nặng của con"
                          v-model="thong_tin_suc_khoe.can_nang"
                          type="number"
                          suffix="gr"
                          clearable
                          required
                          hide-details
                          :rules="emptyRules.can_nang"
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
                    <v-row>
                       <v-col cols="12" sm="12" md="12" class="mb-0 pb-0 ml-15 ">
                        <v-radio-group v-model="thong_tin_suc_khoe.chart_type_x" row>
                          <v-radio label="Theo ngày" value="NGAY" hide-details @click="loadingChartSK()"></v-radio>
                          <v-radio label="Theo tháng" value="THANG" hide-details @click="loadingChartSK()"></v-radio>
                        </v-radio-group>
                       </v-col>
                    </v-row>
                    <v-row class="mr-5 ml-1 mb-0 pb-0">
                      <v-col cols="12" sm="12" md="12" class="mb-0 pb-0">
                        <apexchart type="line" :options="chartSucKhoe" :series="serialsSucKhoe" ref="refChartSucKhoe" ></apexchart>
                      </v-col>
                    </v-row>
                </v-card>
              </v-dialog>
              </v-form>
          </v-row>
          <!-- End -->
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-actions>
          <v-row class="pl-2 float-end">
            <v-spacer></v-spacer>
            <v-btn color="info" @click="insert('NGU', 'N')" :disabled="!isNgu" class="mr-1" small>
              <!-- <v-icon dark>
                {{icons.mdiSleep}} 
              </v-icon> -->
              Ngủ
            </v-btn>
            <v-btn color="success" @click="update('NGU', 'T')" :disabled="isNgu" class="mr-1" small> Thức</v-btn>
            <v-btn color="warning" @click="update('BSM')" class="mr-1" :disabled="true" small>
              <v-icon dark>
                {{ icons.mdiCircleEditOutline }}
              </v-icon>
            </v-btn>
            <v-btn color="error" @click="update('BSM')" class="mr-1" :disabled="true" small>
              <v-icon dark>
                {{ icons.mdiDeleteOutline }}
              </v-icon>
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>

    <!-- CHART-->
    
    <v-col cols="12" md="12" class="pa-0 mt-2">
      <v-card>
        <v-card-title class="pt-5 pb-2">
          <!-- <v-col cols="12" md="12" class="pb-0 mb-0"> cHART 2 </v-col>
          <v-col cols="12" md="4" sm="4" class="pa-0 ma-0 text-right pt-4 pb-0 mb-0"> </v-col> -->
          <v-col cols="12" md="12" class="ma-0 text-right pt-4 pb-0 mb-0">
            <v-slider
              inverse-label
              label="Ngày / lần"
              v-model="slider"
              :thumb-size="24"
              thumb-label="always"
              max="15"
              min="1"
              class="pt-0 pb-0 mb-0"
              hide-details
              @change="changeSlider()"
            >
              <template v-slot:thumb-label="{ value }">
                {{ value }}
              </template>
            </v-slider>
          </v-col>
        </v-card-title>

        <v-divider class="mx-4"></v-divider>
        <v-card-text class="mt-0 mb-0 pt-3 pb-1">
          <!-- Row 1 -->
          <apexchart type="line" :options="chartTotalOptions" :series="seriesTotal" ref="totalChart" ></apexchart>

          <!-- Row 3 -->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  
</template>
<script>
import axios from 'axios'
import config from '../../config/config'
import moment from 'moment'

import { mdiMinus, mdiOneUp, mdiPlus, mdiDeleteOutline, mdiCircleEditOutline, mdiSleep, mdiConsoleNetworkOutline } from '@mdi/js'
import { reactive } from '@vue/composition-api'

export default {
  name: 'SucKhoe',
  components: {},
  data() {
    return {
      // satisfactionEmojis: [1,2,3],
      selfGlobal: this,
      slider: 3,
      desserts: [],
      tuan_tuoi: '',
      icons: {
        mdiMinus,
        mdiPlus,
        mdiDeleteOutline,
        mdiCircleEditOutline,
        mdiSleep,
      },
      be_wc_model: {
        so_lan_i: 0,
        selectModel: 'BT',
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
        ghi_chu_them: 'Hoa cải'
      },
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
            size: 40,
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
            size: 40,
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
            size: 40,
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
            categories: [],
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
                style: {
                  colors: '#FF0000',
                },
              },
              title: {
                text: 'Trọng lương (gr)',
                style: {
                  color: '#00E396',
                },
              },
              tooltip: {
                enabled: true,
              },
            },
            {
              seriesName: 'CAN_NANG',
              opposite: true,
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
                text: 'Tỉ lệ tăng (gr)',
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
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#ccc', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.01
            },
          },
          markers: {
            size: 1
          },
        }
      },
      serialsSucKhoe:[],
    }
  },
  async created() {
    this.getCurrentDate()
    this.countWorkInDay()
    await this.updateBtn()
    await this.loadingChart()
    const self = this
     
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

        self.tuan_tuoi = response.data.data[0].ngay_bat_dau_group
      })
    },

    async countWorkInDay() {
      const self = this

      await axios.get(`${config.API_URL}/countWorkInDay/WC/now()`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.be_wc_model.so_lan_i = response.data.data[0]._count
      })
    },

    async getListSucKhoe() {
      const self = this
      await axios.get(`${config.API_URL}/selectSucKhoe`).then(response => {
        // seft.hotSettings.data = response.data.data;

        self.desserts = response.data.data
        console.log('jiraBoards', response.data)
      })
    },
    async insert_thong_tin_sk(code){
      if (!this.$refs.thong_tin_suc_khoe.validate()) {
        return;
      }
      const self = this;
      await axios.post(`${config.API_URL}/insertSucKhoe`, this.thong_tin_suc_khoe).then(async function (response) {
        await self.updateBtn();
        self.thong_tin_suc_khoe.dialogCN = false;
      })
    },

    async insert(ma_cv) {
      const self = this;
      let code_cv = ma_cv;
      let currentDate = new Date();
      let gio_bat_dau = moment(currentDate).format('YYYY-MM-DD');
      let thong_tin_them = '';
      let congviec = null;
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
            the_tich_sua: this.ti_me_model.the_tich_sua_new,
            thong_tin_them: thong_tin_them,
          }
          await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
            await self.updateBtn()
          })
          break;
        case 'BSB':
          var timeAndDate = moment(gio_bat_dau + ' ' + self.ti_me_model.timeTiBinh);
          // gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          if(!self.ti_me_model.isEditTimeTiBinh){
            gio_bat_dau =  moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
          } else {
            gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          }
          code_cv = self.ti_me_model.loai_sua;
          congviec = {
            ma_cv: code_cv,
            gio_bat_dau: gio_bat_dau,
            the_tich_sua: this.ti_me_model.the_tich_sua_new,
            thong_tin_them: thong_tin_them,
          }
          await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
            await self.updateBtn()
          })
          break;
        case 'WC':
          self.dialogWC = true;
          break;
        case 'WC_INFO':
          gio_bat_dau = moment(timeAndDate).format('YYYY-MM-DD HH:mm:ss');
          thong_tin_them = JSON.stringify({
            loai: self.be_wc_model.selectModel,
            ghi_chu: self.be_wc_model.ghi_chu_them
            });
          self.dialogWC = false;
          congviec = {
            ma_cv: 'WC',
            gio_bat_dau: gio_bat_dau,
            the_tich_sua: this.ti_me_model.the_tich_sua_new,
            thong_tin_them: thong_tin_them,
          }
          await axios.post(config.API_URL + '/insertChamCon', congviec).then(async function (response) {
            await self.updateBtn()
          })
          break;
        case 'CN':
          self.thong_tin_suc_khoe.dialogCN = true;
          self.loadingChartSK();
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
      console.log('workingTime', workingTime + 'm') // "7m"

      let chamsocModal = {
        id: ma_cv == 'NGU' ? this.ngu_model.id : this.cong_viec_model.id,
        ma_cv: ma_cv,
        status: 'T',
        working_time: workingTime,
      }

      console.log('ngu_model', this.cong_viec_model)
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
    async updateBtn() {
      const self = this
      let busua = 'BSB_BSM'
      await axios.get(`${config.API_URL}/getGioBatDauByCV/${busua}`).then(response => {
        // seft.hotSettings.data = response.data.data;
        let data = response.data.data
        self.ti_me_model.ti_binh_gan_nhat = moment(data[0].gio_bat_dau).format('YYYY-MM-DD h:mm:ss')
        self.ti_me_model.timeTiBinh = moment(data[0].gio_bat_dau).format('HH:mm')
        self.ti_me_model.timeTiBinh1 = moment(data[0].gio_ke_tiep).format('HH:mm')
        self.ti_me_model.timeTiBinh1Org = data[0].gio_ke_tiep
        self.ti_me_model.the_tich_sua = data[0].the_tich_sua
        self.ti_me_model.the_tich_sua_new = data[0].the_tich_sua
        console.log('data[0].gio_bat_dau', moment(data[0].gio_bat_dau._i))
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
      await axios.get(`${config.API_URL}/getGioBatDauByCV/NGU`).then(response => {
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
      let current = moment()

      /**Ti Binh */
      let min7 = moment(self.ti_me_model.gio_bat_dau)
      var durationTM = moment.duration(current.diff(min7))
      // let hour = min7.diff(current, "hours");
      // let min = min7.diff(current, "minutes");
      // let second = current.diff(min7, "seconds");
      // self.tibinhCountDown.circles[1].value = min;
      console.log('MIN1', current.diff(min7, 'minutes')) // "7m"
      self.tibinhCountDown.circles = []
      self.tibinhCountDown.circles.push({
        id: '3',
        steps: 60,
        size: 40,
        value: parseInt(durationTM.asHours()),
        // stepLength: -1,
        // label: 'Giờ',
        strokeWidth: 5,
        labelFontSize: 12,
        fillColor: '#312d4b',
        strokeColor: '#008080',
        underneathStrokeColor: '#DCDCDC',
        valueFontSize: 20,
        labelFontSize: 12,
      })

      self.tibinhCountDown.circles.push({
        id: '2',
        steps: 60,
        size: 40,
        value: parseInt(durationTM.asMinutes()) % 60,
        // stepLength: -1,
        strokeWidth: 5,
        labelFontSize: 12,
        fillColor: '#312d4b',
        // label: 'Phút',
        strokeColor: '#4169E1',
        underneathStrokeColor: '#DCDCDC',
        dependentCircles: ['3'],
      })
      self.tibinhCountDown.circles.push({
        id: '1',
        steps: 60,
        size: 40,
        value: parseInt(durationTM.asSeconds) % 60,
        // stepLength: -1,
        // label: 'Giây',
        strokeWidth: 5,
        labelFontSize: 12,
        fillColor: '#312d4b',
        strokeColor: '#C71585',
        underneathStrokeColor: '#DCDCDC',
        dependentCircles: ['2'],
      })

      //End ti bin

      /** NGu */
      let timeCountNgu = moment(self.ngu_model.gio_bat_dau)
      var duration = moment.duration(current.diff(timeCountNgu))
      console.log('self.ngu_model', parseInt(duration.asMinutes()) % 60)

      self.nguCountDown.circles = []
      self.nguCountDown.circles.push({
        id: '3',
        steps: 60,
        size: 40,
        value: parseInt(duration.asHours()),
        // value: 0,
        // stepLength: -1,
        // label: 'Giờ',
        strokeWidth: 5,
        strokeColor: '#008080',
        underneathStrokeColor: '#DCDCDC',
        valueFontSize: 20,
        labelFontSize: 12,
        fillColor: '#312d4b',
      })

      self.nguCountDown.circles.push({
        id: '2',
        steps: 60,
        size: 40,
        value: parseInt(duration.asMinutes()) % 60,
        // value: 0,
        // stepLength: -1,
        strokeWidth: 5,
        labelFontSize: 12,
        // label: 'Phút',
        strokeColor: '#4169E1',
        underneathStrokeColor: '#DCDCDC',
        dependentCircles: ['3'],
        fillColor: '#312d4b',
      })
      self.nguCountDown.circles.push({
        id: '1',
        steps: 60,
        size: 40,
        value: parseInt(duration.asSeconds()) % 60,
        value: 0,
        // stepLength: -1,
        // label: 'Giây',
        strokeColor: '#C71585',
        underneathStrokeColor: '#DCDCDC',
        dependentCircles: ['2'],
        strokeWidth: 5,
        labelFontSize: 12,
        fillColor: '#312d4b',
      })
      //End ngu
    },
    tinhCanNang(){
      let can_nang_con = 0;
      if(this.thong_tin_suc_khoe.can_nang_total != undefined
      && this.thong_tin_suc_khoe.can_nang_bo    != undefined
      && this.thong_tin_suc_khoe.can_nang_total != null
      && this.thong_tin_suc_khoe.can_nang_bo    != null){
        can_nang_con = this.thong_tin_suc_khoe.can_nang_total - this.thong_tin_suc_khoe.can_nang_bo;
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
      self.$refs.totalChart.updateOptions({ xaxis: {
        categories: [],
      },})
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
                  //   case 'NG':
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
      let limit = 5;
      let can_nang_arr = [];
      let ti_le_tang_arr = [];
      let myArray = [];
      let categories  = [];
      await axios
        .get(`${config.API_URL}/selectChartSucKhoe/${limit}/${self.thong_tin_suc_khoe.chart_type_x}`)
        .then(async function (response){
          myArray = response.data.data;
          let x_date = new Set();
          myArray.forEach(function(element, idex){
            let newitem = moment(element.ngay_bat_dau).format('YYYY-MM-DD');
            categories.push(newitem);
            can_nang_arr.push(element.can_nang);
            ti_le_tang_arr.push(element.ti_le_tang_giam);
          });
          
          self.$refs.refChartSucKhoe.updateOptions({ xaxis: {
            categories: categories,
          },})

          self.serialsSucKhoe.push({
            name: 'Cân nặng',
            type: 'line',
            data: can_nang_arr,
          });
          self.serialsSucKhoe.push({
            name: 'Tỉ lệ tăng',
            type: 'line',
            data: ti_le_tang_arr,
          });

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
  },
}
</script>
<style lang="scss" scoped>
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
</style>
