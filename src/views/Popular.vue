<!-- src/views/Popular.vue -->
<template>
  <div class="popular">
    <h1>Popular Movies</h1>
    <div class="view-toggle">
      <button
        @click="setView('table')"
        :class="{ active: currentView === 'table' }"
      >
        테이블 형태로 보기
      </button>
      <button
        @click="setView('infinite')"
        :class="{ active: currentView === 'infinite' }"
      >
        무한 스크롤
      </button>
    </div>
    <div v-if="currentView === 'table'" class="table-view">
      <table>
        <thead>
          <tr>
            <th>영화</th>
            <th>제목</th>
            <th>줄거리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in movies" :key="movie.id">
            <td><img :src="getImageUrl(movie.poster_path)" alt="Poster" /></td>
            <td>{{ movie.title }}</td>
            <td>{{ truncateText(movie.overview, 100) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="page === 1">이전</button>
        <span>Page {{ page }}</span>
        <button @click="nextPage">다음</button>
      </div>
    </div>
    <div v-else class="infinite-view">
      <div class="movies-grid">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
      </div>
      <div v-if="loading" class="loading">Loading more movies...</div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useFetch } from "../hooks/useFetch";
import MovieCard from "../components/common/MovieCard.vue";
import { IMAGE_BASE_URL, POSTER_SIZE } from "../utils/constants";

export default {
  name: "Popular",
  components: {
    MovieCard,
  },
  setup() {
    const currentView = ref("table");
    const page = ref(1);
    const params = ref({ page: page.value });
    const { data, error, loading } = useFetch("/movie/popular", params.value);
    const movies = ref([]);

    watch(
      [data, page],
      ([newData]) => {
        if (newData) {
          if (currentView.value === "infinite") {
            movies.value = movies.value.concat(newData.results);
          } else {
            movies.value = newData.results;
          }
        }
      },
      { immediate: true }
    );

    const setView = (view) => {
      currentView.value = view;
      if (view === "table") {
        page.value = 1;
        movies.value = [];
      }
    };

    const nextPage = () => {
      page.value += 1;
      params.value.page = page.value;
    };

    const prevPage = () => {
      if (page.value > 1) {
        page.value -= 1;
        params.value.page = page.value;
      }
    };

    const getImageUrl = (path) => {
      return path
        ? `${IMAGE_BASE_URL}${POSTER_SIZE}${path}`
        : "https://via.placeholder.com/500x750?text=No+Image";
    };

    const truncateText = (text, maxLength) => {
      if (!text) {
        return "";
      }
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    };

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !loading.value
      ) {
        nextPage();
      }
    };

    onMounted(() => {
      if (currentView.value === "infinite") {
        window.addEventListener("scroll", handleScroll);
      }
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    watch(currentView, (newView) => {
      if (newView === "infinite") {
        window.addEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    });

    return {
      currentView,
      setView,
      movies,
      loading,
      error,
      page,
      nextPage,
      prevPage,
      getImageUrl,
      truncateText,
    };
  },
};
</script>

<style scoped>
.popular {
  padding: 20px;
  background-color: black;
}
.view-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.view-toggle button {
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  border: none;
  background-color: #4b4b4b;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.view-toggle button.active,
.view-toggle button:hover {
  background-color: #e2e2e2;
  color: black;
}
.table-view table {
  width: 100%;
  border-collapse: collapse;
}
.table-view th,
.table-view td {
  border: 1px solid #ddd;
  padding: 8px;
  color: white;
}
.table-view img {
  width: 100px;
  height: auto;
}
.table-view th {
  background-color: #23242a;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  color: white;
}
.pagination button {
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  border: none;
  background-color: #4b4b4b;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.pagination button:disabled {
  background-color: #333;
  cursor: not-allowed;
}
.pagination button:hover:not(:disabled) {
  background-color: #e2e2e2;
}
.infinite-view .movies-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.loading {
  text-align: center;
  margin: 20px 0;
  font-size: 1.2em;
  color: white;
}
</style>
