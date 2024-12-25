<!-- src/components/common/Header.vue -->
<template>
  <header :class="['header', { scrolled }]">
    <div class="logo" @click="navigateHome">
      <img src="@/assets/images/file.png" alt="Logo" />
    </div>
    <nav :class="{ open: isMenuOpen }">
      <!-- 왼쪽 그룹 -->
      <div class="nav-left">
        <select v-model="selectedLanguage" @change="changeLanguage">
          <option value="ko-KR">한국어</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
        </select>
        <router-link to="/" @click="closeMenu">홈</router-link>
        <router-link to="/popular" @click="closeMenu">대세 콘텐츠</router-link>
        <router-link to="/search" @click="closeMenu">찾아보기</router-link>
        <router-link to="/wishlist" @click="closeMenu">찜 목록</router-link>
      </div>

      <!-- 오른쪽 그룹 -->
      <div class="nav-right">
        <template v-if="isLoggedIn">
          <span class="welcome-message">
            {{ user && user.nickname }}님 환영합니다
          </span>
          <!-- 회원정보 조회 버튼 (모달 열기) -->
          <button @click="fetchProfile">회원정보 조회</button>
          <button @click="logout">로그아웃</button>
        </template>
        <router-link v-else to="/signin" @click="closeMenu">로그인</router-link>
      </div>
    </nav>

    <button class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>

    <!-- 프로필 모달 (팝업) -->
    <div v-if="showProfileModal" class="profile-modal">
      <div class="profile-modal-content">
        <h2>내 정보</h2>
        <div v-if="profileData">
          <p><strong>닉네임:</strong> {{ profileData.nickname }}</p>
          <p>
            <strong>프로필 이미지:</strong>
            <a href="#" @click.prevent="toggleProfileImage"
              >프로필 이미지 보기</a
            >
          </p>
          <!-- 프로필 이미지 표시 -->
          <div v-if="showProfileImage">
            <img
              :src="profileData.imageUrl"
              alt="프로필 이미지"
              class="profile-image"
            />
          </div>
        </div>
        <p v-else>프로필 정보가 없습니다.</p>
        <button @click="closeProfileModal">닫기</button>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  name: "Header",
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    // 스크롤 여부
    const scrolled = ref(false);
    const handleScroll = () => {
      scrolled.value = window.scrollY > 50;
    };

    // 메뉴 토글 여부
    const isMenuOpen = ref(false);
    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };
    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    // 언어 선택 상태
    const defaultLanguage = localStorage.getItem("selectedLanguage") || "ko-KR";
    const selectedLanguage = ref(defaultLanguage);
    const changeLanguage = () => {};

    watch(
      () => selectedLanguage.value,
      (newLang) => {
        localStorage.setItem("selectedLanguage", newLang);
        window.location.reload();
      }
    );

    // 로그인 여부 및 사용자 정보
    const isLoggedIn = ref(localStorage.getItem("isLoggedIn") === "true");
    const user = computed(() => store.getters["auth/user"]);

    watch(
      () => store.getters["auth/isLoggedIn"],
      (newVal) => {
        isLoggedIn.value = newVal;
        localStorage.setItem("isLoggedIn", newVal);
      },
      { immediate: true }
    );

    // 프로필 모달 상태
    const showProfileModal = ref(false);
    const profileData = ref(null);

    // 프로필 이미지 표시 상태
    const showProfileImage = ref(false);
    const toggleProfileImage = () => {
      showProfileImage.value = !showProfileImage.value;
    };

    // 로그아웃 메서드
    const logout = () => {
      store.dispatch("auth/logout");
      // 카카오 SDK 로그아웃
      if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
        window.Kakao.Auth.logout(() => {
          console.log("카카오 로그아웃 완료");
        });
      }
      localStorage.removeItem("isLoggedIn");
      router.push("/signin");
    };

    // 홈으로 이동 메서드
    const navigateHome = () => {
      router.push("/");
    };

    // 회원정보 조회 메서드
    const fetchProfile = () => {
      // Kakao 객체 및 토큰 체크
      if (
        !window.Kakao ||
        !window.Kakao.Auth ||
        !window.Kakao.Auth.getAccessToken()
      ) {
        toast.error("카카오 SDK가 로드되지 않았거나 초기화되지 않았습니다.");
        return;
      }

      // 카카오 API 요청
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: (res) => {
          console.log("카카오 회원 정보:", res);
          // 프로필 정보 state에 저장
          profileData.value = {
            nickname: res.kakao_account?.profile?.nickname || "",
            imageUrl: res.kakao_account?.profile?.profile_image_url || "",
            email: res.kakao_account?.email || "",
          };
          // 모달 오픈
          showProfileModal.value = true;
          // 초기화
          showProfileImage.value = false;
        },
        fail: (error) => {
          console.error("카카오 회원정보 조회 실패:", error);
          if (error.message) {
            toast.error(`회원정보 조회 실패: ${error.message}`);
          } else {
            toast.error("회원정보 조회 중 네트워크 오류가 발생했습니다.");
          }
        },
      });
    };

    // 프로필 모달 닫기 메서드
    const closeProfileModal = () => {
      showProfileModal.value = false;
      showProfileImage.value = false;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      scrolled,
      isMenuOpen,
      selectedLanguage,
      isLoggedIn,
      user,
      showProfileModal,
      profileData,
      showProfileImage,
      toggleMenu,
      closeMenu,
      changeLanguage,
      logout,
      navigateHome,
      fetchProfile,
      closeProfileModal,
      toggleProfileImage,
    };
  },
};
</script>

<style scoped>
.header {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.5s, opacity 0.5s;
  background-color: black;
  z-index: 1000;
}

.header:hover {
  background-color: #4b4b4b;
  border-radius: 8px;
}

.logo img {
  height: 40px;
  cursor: pointer;
}

nav {
  display: flex;
  gap: 10px;
  padding: 10px 20px;
  transition: background-color 0.3s;
  align-items: center;
}

nav a,
nav button {
  margin: 0 10px;
  text-decoration: none;
  color: #fff;
  transition: color 0.3s;
}

nav a:hover {
  color: #45f3ff;
}

nav button {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #4b4b4b;
  border: none;
  border-radius: 4px;
  color: black;
  transition: background-color 0.3s;
}

nav button:hover {
  background-color: #e2e2e2;
}

nav select {
  margin-left: 10px;
  padding: 5px;
  background-color: #4b4b4b;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.welcome-message {
  color: #ffd700;
  margin-right: 10px;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  z-index: 1001;
}

.hamburger span {
  display: block;
  width: 20px;
  height: 2px;
  background-color: #4b4b4b;
}

@media (max-width: 768px) {
  nav {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  nav.open {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 250px;
    height: 100%;
    background-color: #23242a;
    padding: 20px;
    gap: 15px;
    z-index: 1002;
  }
  nav.open a,
  nav.open button,
  nav.open select {
    margin-bottom: 10px;
    font-size: 1.2em;
  }
}

nav.open .nav-left,
nav.open .nav-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.menu-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.profile-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-modal-content {
  background: #fff;
  color: #000;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.profile-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-top: 10px;
}

.profile-modal-content a {
  color: #45f3ff;
  cursor: pointer;
  text-decoration: underline;
}

.profile-modal-content a:hover {
  color: #79be2d;
}
</style>
