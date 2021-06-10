<template>
  <div class="top-content">
    <Nav />
    <p>Janus Gateway Sample Applications</p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Nav from "../components/Nav.vue";

export default defineComponent({
  name: "Top",
  components: {
    Nav,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
