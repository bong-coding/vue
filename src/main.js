// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

// 카카오 SDK 초기화 왜 배포가 앚ㄴ되는거지 왜 안되냐고
if (window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY);
  console.log("Kakao SDK Initialized in main.js!");
} else {
  console.warn("Kakao SDK not available or already initialized.");
}

app.use(store).use(router).use(Toast).mount("#app");
