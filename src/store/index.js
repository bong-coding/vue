// src/store/index.js
import { createStore } from "vuex";
import auth from "./modules/auth";
import movies from "./modules/movies";
import wishlist from "./modules/wishlist";

export default createStore({
  modules: {
    auth,
    movies,
    wishlist,
  },
});
