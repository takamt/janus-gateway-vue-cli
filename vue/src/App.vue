<template>
  <div id="container">
    <div id="app-content">
      <router-view> </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {},
  setup() {
    return {};
  },
});
</script>

<style>
body {
  margin: 0;
}
#container {
  width: 80vw;
  margin: 0 auto;
}
</style>
