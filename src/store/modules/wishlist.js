// src/store/modules/wishlist.js
const state = {
  wishlist: JSON.parse(localStorage.getItem("movieWishlist")) || [],
};

const mutations = {
  ADD_TO_WISHLIST(state, movie) {
    state.wishlist.push(movie);
    localStorage.setItem("movieWishlist", JSON.stringify(state.wishlist));
  },
  REMOVE_FROM_WISHLIST(state, movieId) {
    state.wishlist = state.wishlist.filter((movie) => movie.id !== movieId);
    localStorage.setItem("movieWishlist", JSON.stringify(state.wishlist));
  },
};

const actions = {
  addToWishlist({ commit }, movie) {
    commit("ADD_TO_WISHLIST", movie);
  },
  removeFromWishlist({ commit }, movieId) {
    commit("REMOVE_FROM_WISHLIST", movieId);
  },
};

const getters = {
  wishlist: (state) => state.wishlist,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
