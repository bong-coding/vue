<!-- src/views/Wishlist.vue -->
<template>
  <div class="wishlist">
    <div v-if="wishlist.length === 0" class="empty">
      위시 리스트가 비어있습니다.
    </div>
    <div v-else class="movies-grid">
      <MovieCard v-for="movie in wishlist" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import MovieCard from "../components/common/MovieCard.vue";

export default {
  name: "Wishlist",
  components: {
    MovieCard,
  },
  setup() {
    const store = useStore();
    const wishlist = computed(() => store.getters["wishlist/wishlist"]);

    return {
      wishlist,
    };
  },
};
</script>

<style scoped>
.wishlist {
  padding: 20px;
  background-color: #23242a;
  flex-direction: column;
  min-height: 100vh;
}
.empty {
  text-align: center;
  font-size: 1.2em;
  margin-top: 50px;
  color: aliceblue;
  flex: 1;
}
.movies-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex: 1;
}
</style>
