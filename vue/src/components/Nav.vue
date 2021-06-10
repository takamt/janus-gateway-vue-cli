<template>
  <div class="nav-content">
    <nav id="nav">
      <ul id="nav-list">
        <li class="nav-list__item">
          <router-link
            to="/"
            class="nav-list__item__link"
            active-class="current"
            exact
          >
            TOP
          </router-link>
        </li>
        <li class="nav-list__item">
          <router-link
            to="/videoroom"
            class="nav-list__item__link"
            active-class="current"
          >
            VIDEOROOM
          </router-link>
        </li>
        <li class="nav-list__item">
          <router-link
            to="/stream"
            class="nav-list__item__link"
            active-class="current"
          >
            STREAM
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Nav",
  components: {},
  setup() {
    const router = useRouter();

    const toTop = () => router.push({ name: "top" });
    const toVideoRoom = () => router.push({ name: "videoroom" });
    const toStream = () => router.push({ name: "stream" });

    return {
      toTop,
      toVideoRoom,
      toStream,
    };
  },
});
</script>

<style scoped>
#nav #nav-list {
  display: flex;
  flex-flow: row;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  background-color: #414141;
  list-style-type: none;
  text-align: center;
  justify-content: space-around;
}
#nav .nav-list__item {
  width: 100%;
}
#nav .nav-list__item .nav-list__item__link {
  display: block;
  width: 100%;
  color: #ffffff;
  text-decoration: none;
  padding-bottom: 5px;
}
#nav .nav-list__item .nav-list__item__link.current {
  border-bottom: 3px solid #68b615;
}
#nav .nav-list__item .nav-list__item__link:hover {
  border-bottom: 3px solid #e6632f;
}
</style>
