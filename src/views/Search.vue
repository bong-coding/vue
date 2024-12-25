<!-- src/views/Search.vue -->
<template>
  <div class="search-page">
    <div class="filter-header">
      <h1 class="title">선호하는 설정을 선택하세요</h1>
      <div class="filter-bar">
        <div class="filter">
          <label for="genre">장르 (전체)</label>
          <select
            v-model="selectedGenre"
            id="genre"
            @change="fetchFilteredMovies"
          >
            <option value="">장르 (전체)</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre.id">
              {{ genre.name }}
            </option>
          </select>
        </div>
        <div class="filter">
          <label for="rating">평점 (전체)</label>
          <select
            id="rating"
            v-model="selectedRating"
            @change="fetchFilteredMovies"
          >
            <option value="">평점 (전체)</option>
            <option value="7">7 이상</option>
            <option value="8">8 이상</option>
            <option value="9">9 이상</option>
          </select>
        </div>
        <div class="filter">
          <label for="language">언어 (전체)</label>
          <select
            id="language"
            v-model="selectedLanguage"
            @change="fetchFilteredMovies"
          >
            <option value="">언어 (전체)</option>
            <option value="en">영어</option>
            <option value="ko">한국어</option>
            <option value="ja">일본어</option>
          </select>
        </div>
        <button @click="resetFilters" class="reset-btn">초기화</button>
      </div>
    </div>
    <div class="movie-grid">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import api from "../services/api";
import MovieCard from "../components/common/MovieCard.vue";

export default {
  name: "Search",
  components: {
    MovieCard,
  },
  setup() {
    const selectedGenre = ref("");
    const selectedRating = ref("");
    const selectedLanguage = ref("");
    const genres = ref([]);
    const movies = ref([]);

    const fetchGenres = async () => {
      try {
        const response = await api.get("/genre/movie/list");
        genres.value = response.data.genres;
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFilteredMovies = async () => {
      const params = {
        with_genres: selectedGenre.value,
        "vote_average.gte": selectedRating.value,
        with_original_language: selectedLanguage.value,
      };
      try {
        const response = await api.get("/discover/movie", { params });
        movies.value = response.data.results;
      } catch (err) {
        console.error(err);
      }
    };

    const resetFilters = () => {
      selectedGenre.value = "";
      selectedRating.value = "";
      selectedLanguage.value = "";
      movies.value = [];
    };

    onMounted(() => {
      fetchGenres();
    });

    return {
      selectedGenre,
      selectedRating,
      selectedLanguage,
      genres,
      movies,
      fetchFilteredMovies,
      resetFilters,
    };
  },
};
</script>

<style scoped>
.search-page {
  padding: 20px;
  background-color: #23242a;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

.filter-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.title {
  font-size: 1.2em;
  margin: 0;
  text-align: center;
}

.filter-bar {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.filter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.filter select {
  padding: 10px;
  border: 1px solid #fff;
  background-color: #23242a;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

.reset-btn {
  padding: 10px 25px;
  border: 1px solid #fff;
  background-color: #23242a;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

.movie-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .filter-bar {
    gap: 10px;
  }

  .filter select,
  .reset-btn {
    padding: 8px 15px;
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1em;
  }

  .filter-header {
    gap: 10px;
  }

  .filter-bar {
    flex-direction: column;
    gap: 10px;
  }

  .filter select,
  .reset-btn {
    width: 100%; /* 필터 및 버튼이 화면 너비에 맞도록 설정 */
    padding: 10px;
    font-size: 1em;
  }
}
</style>
