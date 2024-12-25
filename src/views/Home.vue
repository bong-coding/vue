<template>
  <div class="home">
    <!-- 로딩 인디케이터 표시 -->
    <div v-if="loading" class="loading-indicator">
      <p>로딩 중...</p>
    </div>

    <!-- 에러 메시지 표시 -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- 로딩 및 에러가 없을 때 콘텐츠 표시 -->
    <div v-else>
      <!-- 배너 섹션 -->
      <section
        class="banner"
        :style="{ backgroundImage: `url(${bannerImageUrl})` }"
      >
        <div class="banner-overlay"></div>
        <div class="banner-content">
          <h1>{{ bannerTitle }}</h1>
          <p>{{ bannerOverview }}</p>
          <div class="banner-buttons">
            <button @click="togglePlayModal()">재생</button>
            <button @click="toggleModal(true)">상세 정보</button>
          </div>
        </div>
      </section>

      <!-- 상세 정보 모달 창 -->
      <div v-if="isModalOpen" class="modal-overlay" @click="toggleModal(false)">
        <div class="modal-content" @click.stop>
          <h2>{{ bannerTitle }} - 줄거리</h2>
          <p>{{ bannerOverview }}</p>
          <button @click="toggleModal(false)">닫기</button>
        </div>
      </div>

      <!-- 재생 모달 창 -->
      <div
        v-if="isPlayModalOpen"
        class="modal-overlay"
        @click="togglePlayModal()"
      >
        <div class="modal-content" @click.stop>
          <h2>알림</h2>
          <p>짭플렉스는 재생을 지원하지 않습니다</p>
          <button @click="togglePlayModal()">닫기</button>
        </div>
      </div>

      <!-- 인기 영화 섹션 -->
      <section class="movie-section">
        <h2>인기 영화</h2>
        <div
          class="movies-container"
          ref="popularContainer"
          @wheel.prevent="handleWheel($event, 'popularContainer')"
        >
          <MovieCard
            v-for="movie in popularMovies"
            :key="movie.id"
            :movie="movie"
          />
        </div>
      </section>

      <!-- 애니메이션 영화 섹션 -->
      <section class="movie-section">
        <h2>애니메이션 영화</h2>
        <div
          class="movies-container"
          ref="animationContainer"
          @wheel.prevent="handleWheel($event, 'animationContainer')"
        >
          <MovieCard
            v-for="movie in animationMovies"
            :key="movie.id"
            :movie="movie"
          />
        </div>
      </section>

      <!-- 액션 영화 섹션 -->
      <section class="movie-section">
        <h2>액션 영화</h2>
        <div
          class="movies-container"
          ref="actionContainer"
          @wheel.prevent="handleWheel($event, 'actionContainer')"
        >
          <MovieCard
            v-for="movie in actionMovies"
            :key="movie.id"
            :movie="movie"
          />
        </div>
      </section>

      <!-- 로맨스 영화 섹션 -->
      <section class="movie-section">
        <h2>로맨스 영화</h2>
        <div
          class="movies-container"
          ref="romanceContainer"
          @wheel.prevent="handleWheel($event, 'romanceContainer')"
        >
          <MovieCard
            v-for="movie in romanceMovies"
            :key="movie.id"
            :movie="movie"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import MovieCard from "../components/common/MovieCard.vue";
import api from "../services/api";

export default {
  name: "Home",
  components: {
    MovieCard,
  },
  setup() {
    const popularMovies = ref([]);
    const animationMovies = ref([]); // 애니메이션 영화 변수
    const actionMovies = ref([]);
    const romanceMovies = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // 배너용 데이터
    const bannerImageUrl = ref("");
    const bannerTitle = ref("");
    const bannerOverview = ref("");
    const isModalOpen = ref(false);
    const isPlayModalOpen = ref(false);

    // 각 컨테이너에 대한 ref 정의
    const popularContainer = ref(null);
    const animationContainer = ref(null); // 애니메이션 컨테이너
    const actionContainer = ref(null);
    const romanceContainer = ref(null);

    const toggleModal = (state) => {
      isModalOpen.value = state;
    };

    const togglePlayModal = () => {
      isPlayModalOpen.value = !isPlayModalOpen.value;
    };

    const fetchMovies = async () => {
      loading.value = true;
      error.value = null;
      try {
        // 인기 영화 가져오기
        const popularResponse = await api.get("/movie/popular");
        popularMovies.value = popularResponse.data.results;

        // 애니메이션 영화 가져오기
        const animationResponse = await api.get("/discover/movie", {
          params: { with_genres: 16 },
        });
        animationMovies.value = animationResponse.data.results;

        // 액션 영화 가져오기
        const actionResponse = await api.get("/discover/movie", {
          params: { with_genres: 28 },
        });
        actionMovies.value = actionResponse.data.results;

        // 로맨스 영화 가져오기
        const romanceResponse = await api.get("/discover/movie", {
          params: { with_genres: 10749 },
        });
        romanceMovies.value = romanceResponse.data.results;

        // 배너 영화 설정 (인기 영화 중 첫 번째 영화 사용)
        const bannerMovie = popularMovies.value[8];
        bannerImageUrl.value = `https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path}`;
        bannerTitle.value = bannerMovie.title;
        bannerOverview.value = bannerMovie.overview;
      } catch (err) {
        error.value =
          err.response?.data?.status_message ||
          "데이터를 불러오는 중 에러가 발생했습니다.";
      } finally {
        loading.value = false;
      }
    };

    const handleWheel = (event, containerName) => {
      const containerMap = {
        popularContainer,
        animationContainer, // 애니메이션 컨테이너
        actionContainer,
        romanceContainer,
      };
      const container = containerMap[containerName];
      if (container.value) {
        container.value.scrollLeft += event.deltaY * 3;
      }
    };

    onMounted(() => {
      fetchMovies();
    });

    return {
      popularMovies,
      animationMovies, // 애니메이션 영화 반환
      actionMovies,
      romanceMovies,
      loading,
      error,
      bannerImageUrl,
      bannerTitle,
      bannerOverview,
      isModalOpen,
      isPlayModalOpen,
      toggleModal,
      togglePlayModal,
      popularContainer,
      animationContainer, // 애니메이션 컨테이너 반환
      actionContainer,
      romanceContainer,
      handleWheel,
    };
  },
};
</script>

<style scoped>
.home {
  background-color: black;
  color: white;
  padding: 20px;
}

/* 로딩 인디케이터 스타일 */
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 전체에 중앙 정렬 */
  color: white;
}

.loading-indicator p {
  font-size: 1.5em;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 에러 메시지 스타일 */
.error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: red;
  text-align: center;
  padding: 0 20px;
}

.error-message p {
  font-size: 1.2em;
}

/* 배너 스타일 */
.banner {
  position: relative;
  display: flex;
  align-items: center;
  height: 500px;
  margin-bottom: 40px;
  background-size: cover;
  background-position: center;
  padding-left: 40px;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.banner-content {
  position: relative;
  color: white;
  text-align: left;
  max-width: 600px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.banner-content h1 {
  font-size: 3em;
  margin-bottom: 10px;
}

.banner-content p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.banner-buttons {
  display: flex;
  gap: 10px;
}

.banner-buttons button {
  padding: 10px 30px;
  cursor: pointer;
  background-color: #4b4b4b;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s;
}

.banner-buttons button:hover {
  background-color: #e6e6e6;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 80%;
  color: black;
}

.modal-content h2 {
  margin-bottom: 10px;
}

.modal-content button {
  margin-top: 15px;
  padding: 8px 20px;
  cursor: pointer;
  border: none;
  background-color: #4b4b4b;
  color: white;
  border-radius: 4px;
}

.modal-content button:hover {
  background-color: #333;
}

/* 영화 섹션 스타일 */
.movie-section {
  margin-bottom: 40px;
}

.movie-section h2 {
  margin-bottom: 20px;
  text-align: left;
}

.movies-container {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-behavior: smooth;
}

.movies-container::-webkit-scrollbar {
  height: 8px;
}

.movies-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.movie-card {
  flex: 0 0 auto;
  margin-right: 10px;
}
</style>
