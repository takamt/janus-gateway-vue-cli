import { createRouter, createWebHistory } from "vue-router";

import Top from "./views/Top.vue";
import VideoRoom from "./views/VideoRoom.vue";
import Stream from "./views/Stream.vue";

export const routerHistory = createWebHistory();

export const route = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      name: "top",
      component: Top,
    },
    {
      path: "/videoroom",
      name: "videoroom",
      component: VideoRoom,
    },
    {
      path: "/stream",
      name: "stream",
      component: Stream,
    },
  ],
});
