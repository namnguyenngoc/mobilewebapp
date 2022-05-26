<template>
  <v-dialog v-model="dialog" :max-width="options.width" :style="{ zIndex: options.zIndex }" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark :color="options.color" dense flat>
        <v-toolbar-title class="text-body-2 font-weight-bold white--text">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!message" class="pa-4 white--text" v-html="message"></v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn color="primary" class="body-2 font-weight-bold" outlined @click.native="agree">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  layout: 'dialogInformation',
  components: {},
    props: {
      options: {
        type: Object,
        default: () => ({
          color: "success",
          width: 400,
          zIndex: 200,
          noconfirm: false
        })
      },
      title: {
        type: String,
        default:'Bạn có chắc chắn xóa không?'
      },
      message: {
        type: String,
        default: null
      },
      dialog: {
        type: Boolean,
        default: false
      },
      resolve: {
        type: String,
        default: null
      },
      reject: {
        type: String,
        default: null
      },
    },
    data () {
      return {

      }
    },
    methods: {
      open(title, message, options) {
        this.dialog = true;
        this.title = title;
        this.message = message;
        this.options = Object.assign(this.options, options);
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
      },
      agree() {
        this.dialog = false;
      },
      cancel() {
        this.dialog = false;
      }
  }
}
</script>

<style lang="scss" scoped>
</style>
