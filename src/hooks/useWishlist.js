// src/hooks/useWishlist.js
import { computed } from "vue";
import { useStore } from "vuex";

export function useWishlist() {
  const store = useStore();

  const wishlist = computed(() => store.getters["wishlist/wishlist"]);

  const addToWishlist = (movie) => {
    store.dispatch("wishlist/addToWishlist", movie);
  };

  const removeFromWishlist = (movieId) => {
    store.dispatch("wishlist/removeFromWishlist", movieId);
  };

  const toggleWishlist = (movie) => {
    const exists = wishlist.value.find((item) => item.id === movie.id);
    if (exists) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
}
