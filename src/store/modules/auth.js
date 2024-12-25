// src/store/modules/auth.js
const state = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn:
    localStorage.getItem("isLoggedIn") === "true" ||
    sessionStorage.getItem("isLoggedIn") === "true",
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    state.isLoggedIn = true;
  },
  LOGOUT(state) {
    state.user = null;
    state.isLoggedIn = false;
  },
};

const actions = {
  login({ commit }, { user, rememberMe }) {
    commit("SET_USER", user);
    if (rememberMe) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  },
  logout({ commit }) {
    commit("LOGOUT");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
  },
};

const getters = {
  isLoggedIn: (state) => state.isLoggedIn,
  user: (state) => state.user,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
