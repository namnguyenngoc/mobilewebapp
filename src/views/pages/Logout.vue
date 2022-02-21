<template>

  <div id="app">
     
  </div>
  
</template>

<script>
  export default {
    data: () => ({
      
    }),
    computed: {
     
    },
    created: function () {
      const self = this;
      self.$cookies.remove('userName');
      self.$cookies.remove('pwd');
      self.$cookies.remove('keyCK');
      self.$cookies.remove('authen');
      self.$router.push({ name: 'pages-login' });
    },
    methods: {
      
    },
  }
</script>
