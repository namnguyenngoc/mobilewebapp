<template>
  <component :is="resolveLayout">
    <router-view></router-view>
  </component>
</template>

<script>
import { computed } from '@vue/composition-api';
import { useRouter } from '@/utils';
import LayoutBlank from '@/layouts/Blank.vue';
import LayoutContent from '@/layouts/Content.vue';
import config from "./config/config";

export default {
  components: {
    LayoutBlank,
    LayoutContent,
  },
  setup() {
    const { route } = useRouter();

    const resolveLayout = computed(() => {
      // Handles initial route
      if (route.value.name === null) return null;

      if (route.value.meta.layout === 'blank') return 'layout-blank';

      return 'layout-content';
    });

    return {
      resolveLayout,
    };
  },
  created() {
      try{
        // window.opener.location.href = '/login';
        // this.$router.push({ name: 'Login' })
        // window.$cookies = $cookies;
        // this.$cookies.set("cookies", this.$cookies.get("authen"), '12h')
        let authenObj = {
          "authen": this.$cookies.get("authen"),
        }
        let jiraAccount = {
          "userName": this.$cookies.get("userName"),
          "pwd": this.$cookies.get("pwd"),
        }
        console.log("authenObj", authenObj);
        console.log("jiraAccount", jiraAccount);
        if(authenObj == undefined || authenObj == null || authenObj.authen == undefined || authenObj.authen == null){
          
          this.$router.push({ name: 'pages-login' });
        }
        console.log("authenObj-nullllllllll", authenObj);
      } catch (err){
        console.log("login-err", err)
      
      }
    } 
};
</script>
<style>
  .v-image.v-responsive.upgrade-banner, div[aria-label="upgrade-banner"]{
    display: none;  
  }
  
</style>
