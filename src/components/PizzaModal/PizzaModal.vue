<template>
  <div class="modalContainer">
    <div class="backdrop">
      <div class="wrapper">
        <div id="pizzaModal">
          <h4>Thông tin gia đình</h4>
          <h5>Ops ... Escolha os ingredientes corretamente</h5>
          <button  @click="$emit('close')" >OK</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "./PizzaModal.scss";
</style>
