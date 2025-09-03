import { createWebHistory, createRouter } from "vue-router";
import CarritoCompras from "@/views/CarritoCompras.vue";

const routes = [
  {
    path: "/",
    name: "CarritoCompras",
    component: CarritoCompras,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;