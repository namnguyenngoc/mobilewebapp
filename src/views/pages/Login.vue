<template>
  <div class="">
    <v-form
        ref="loginForm"
        v-model="valid"
        lazy-validation
      >
      <div class="auth-inner">
        <v-card class="auth-card">
          <!-- logo -->
          <v-card-title class="d-flex align-center justify-center py-7">
            <router-link
              to="/"
              class="d-flex align-center"
            >
              <v-img
                :src="require('@/assets/images/logos/logo.svg')"
                max-height="30px"
                max-width="30px"
                alt="logo"
                contain
                class="me-3 "
              ></v-img>

              <h2 class="text-2xl font-weight-semibold">
                Family
              </h2>
            </router-link>
          </v-card-title>

          <!-- title -->
          <v-card-text>
            <p class="text-2xl font-weight-semibold text--primary mb-6" @click="setText()">
            Family
            </p>
            <p class="mb-2">
              <ChamConThongTin ref="ChamConThongTin2" />
            </p>
          </v-card-text>

          <!-- login form -->
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="loginEmail"
                outlined
                label="Email"
                placeholder="john@example.com"
                hide-details
                class="mb-3"
                :rules="loginEmailRules"
              ></v-text-field>

              <v-text-field
                v-model="loginPassword"
                outlined
                :type="isPasswordVisible ? 'text' : 'password'"
                label="Password"
                placeholder="············"
                :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
                hide-details
                @click:append="isPasswordVisible = !isPasswordVisible"
                :rules="[rules.required, rules.min]"
              ></v-text-field>

              <div class="d-flex align-center justify-space-between flex-wrap">
                <v-checkbox
                  label="Remember Me"
                  hide-details
                  class="me-3 mt-1"
                >
                </v-checkbox>

                <!-- forgot link -->
                <a
                  href="javascript:void(0)"
                  class="mt-1"
                >
                  Forgot Password?
                </a>
              </div>

              <v-btn
                block
                color="primary"
                class="mt-6"
                :disabled="!valid"
                @click="validate"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>

          <!-- create new account  -->
          <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
            <span class="me-2">
              New on our platform?
            </span>
            <router-link :to="{name:'pages-register'}">
              Create an account
            </router-link>
          </v-card-text>

          <!-- divider -->
          <v-card-text class="d-flex align-center mt-2">
            <v-divider></v-divider>
            <span class="mx-5">or</span>
            <v-divider></v-divider>
          </v-card-text>

          <!-- social links -->
          <v-card-actions class="d-flex justify-center">
            <v-btn
              v-for="link in socialLink"
              :key="link.icon"
              icon
              class="ms-1"
            >
              <v-icon :color="$vuetify.theme.dark ? link.colorInDark : link.color">
                {{ link.icon }}
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-form>
    <!-- background triangle shape  -->
    <img
      class="auth-mask-bg"
      height="173"
      :src="require(`@/assets/images/misc/mask-${$vuetify.theme.dark ? 'dark':'light'}.png`)"
    >

    <!-- tree -->
    <v-img
      class="auth-tree"
      width="247"
      height="185"
      src="@/assets/images/misc/tree.png"
    ></v-img>

    <!-- tree  -->
    <v-img
      class="auth-tree-3"
      width="377"
      height="289"
      src="@/assets/images/misc/tree-3.png"
    ></v-img>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiFacebook, mdiTwitter, mdiGithub, mdiGoogle, mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'
import axios from 'axios'
import config from '../../config/config'
import ChamConThongTin from '../family-chamcon/ChamConThongTin.vue'

export default {
  components: {
    ChamConThongTin
  },
  setup() {
    const isPasswordVisible = ref(false)
    const email = ref('')
    const password = ref('')
    const socialLink = [
      {
        icon: mdiFacebook,
        color: '#4267b2',
        colorInDark: '#4267b2',
      },
      {
        icon: mdiTwitter,
        color: '#1da1f2',
        colorInDark: '#1da1f2',
      },
      {
        icon: mdiGithub,
        color: '#272727',
        colorInDark: '#fff',
      },
      {
        icon: mdiGoogle,
        color: '#db4437',
        colorInDark: '#db4437',
      },
    ]

    return {
      isPasswordVisible,
      email,
      password,
      socialLink,

      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
    }
  },
  data: () => ({
      dialog: true,
      counter: 0,
      tab: 0,
      tabs: [
        { name: 'Login', icon: 'mdi-account' },
        { name: 'Jira PIM', icon: 'mdi-account-outline' },
      ],
      valid: true,
      jrvalid: true,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      verify: '',
      loginPassword: '',
      loginEmail: '',
      loginEmailRules: [
        (v) => !!v || 'Required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      emailRules: [
        (v) => !!v || 'Required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      jrloginPassword: '',
      jrloginEmail: '',
      

      show1: false,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => (v && v.length >= 8) || 'Min 8 characters',
      },
    }),
    computed: {
      passwordMatch () {
        return () => this.password === this.verify || 'Password must match'
      },
    },
    created: function () {
      this.overlay = false;
      const expire = 1000000;
      this.$cookies.set('keyCK', 'value', expire);
    },
    methods: {
      setText () {
        this.counter++
        if (this.counter === 5) {
          this.loginEmail = 'nam@gmail.com'
          this.loginPassword = '12378900'
          this.counter = 0
        }
      },
      validate () {
        if (this.$refs.loginForm.validate()) {
          // submit form to server/API here...
          const self = this
          const usr = {
            usr_nm: this.loginEmail,
            usr_pwd: this.loginPassword,
          }

          axios
            .post(config.API_FAMILY + '/api/login', usr)
            .then(function (response) {
              // self.chiTieuList = response.data.data
              const data_authen = response.data.data

              self.$cookies.set('authen', data_authen[1].authen, '60min')

              if (
                data_authen == undefined ||
                data_authen == null ||
                data_authen.length <= 1 ||
                data_authen[0] == null
              ) {
              // self.$router.push({ name: 'Login' });
              } else {
                self.$router.push({ name: 'dashboard' });
                self.$cookies.set('userName', config.JIRA_ACCOUNT.userName, '480min');
                self.$cookies.set('pwd', config.JIRA_ACCOUNT.pwd, '480min');
              }

              console.log('login:', response.data.data)
            })
        }
      },
      async validatePIM () {
        this.overlay = true;
        if (this.$refs.loginPIMForm.validate()) {
          // submit form to server/API here...
          let self = this;
          let boardList = null; 
          const usr = {
            userName: this.jrloginEmail,
            pwd: this.jrloginPassword,
          }

          await axios
            .post(`${config.JR_API_JIRA}/api/jiraLogin`, usr)
            .then(function (response) {
              // self.chiTieuList = response.data.data
              boardList = response.data.boardList;

              self.$cookies.set('boardList', JSON.stringify(boardList), '480min');
              self.$cookies.set('userName', self.jrloginEmail, '480min');
              self.$cookies.set('pwd', self.jrloginPassword, '480min');
              
              // self.$router.push({ name: 'JIRATICKET' });
              if (
                boardList == undefined ||
                boardList == null ||
                boardList.length <= 1 ||
                boardList[0] == null
              ) {
                self.$router.push({ name: 'Login' });
              } else {
                self.overlay = false;
                self.$router.push({ name: 'Jira Ticket' })
              }

              // console.log('login:', response.data.data)
              // self.overlay = false;
            })
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  
}
</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
</style>
