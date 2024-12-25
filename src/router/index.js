// src/router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Popular from "../views/Popular.vue";
import Search from "../views/Search.vue";
import Wishlist from "../views/Wishlist.vue";
import SignIn from "../views/SignIn.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/popular",
    name: "Popular",
    component: Popular,
    meta: { requiresAuth: true },
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
    meta: { requiresAuth: true },
  },
  {
    path: "/wishlist",
    name: "Wishlist",
    component: Wishlist,
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/about",
    redirect: "/signin", // '/about' 경로를 '/signin'으로 리디렉션
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 네비게이션 가드: 인증 필요 시 로그인 페이지로 리디렉션
router.beforeEach((to, from, next) => {
  const isAuthenticated =
    localStorage.getItem("isLoggedIn") === "true" ||
    sessionStorage.getItem("isLoggedIn") === "true";
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/signin");
  } else {
    next();
  }
});

export default router;
