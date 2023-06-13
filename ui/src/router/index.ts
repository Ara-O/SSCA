import Chat from "../pages/chat.vue";
import Home from "../pages/home.vue";
import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/chat/:id", component: Chat },
    { path: "/", component: Home },
  ],
});
