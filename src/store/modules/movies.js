// src/store/modules/movies.js
import api from "../../services/api";

const state = {
  popularMovies: [],
  loading: false,
  error: null,
};

const mutations = {
  SET_POPULAR_MOVIES(state, movies) {
    state.popularMovies = movies;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchPopularMovies({ commit }, page = 1) {
    commit("SET_LOADING", true);
    try {
      const response = await api.get("/movie/popular", {
        params: { page },
      });
      commit("SET_POPULAR_MOVIES", response.data.results);
    } catch (error) {
      commit("SET_ERROR", error);
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  popularMovies: (state) => state.popularMovies,
  loading: (state) => state.loading,
  error: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
