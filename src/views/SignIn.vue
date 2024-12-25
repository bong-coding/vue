<!-- src/views/SignIn.vue -->
<template>
  <div class="signin-container">
    <transition name="fade" mode="out-in">
      <div
        class="form-container"
        v-if="showForm"
        :key="isSignIn ? 'sign-in' : 'sign-up'"
      >
        <h2>{{ isSignIn ? "Sign In" : "Sign Up" }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <input
              placeholder="Email"
              type="email"
              id="email"
              v-model="email"
              @blur="validateEmail"
              required
            />
            <span v-if="emailError" class="error">{{ emailError }}</span>
          </div>

          <div class="input-group">
            <input
              placeholder="Password"
              type="password"
              id="password"
              v-model="password"
              required
            />
          </div>

          <div v-if="!isSignIn" class="input-group">
            <input
              placeholder="Confirm Password"
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              @blur="validatePassword"
              required
            />
            <span v-if="passwordError" class="error">{{ passwordError }}</span>
          </div>

          <div class="checkbox-group" v-if="!isSignIn">
            <input type="checkbox" id="terms" v-model="terms" required />
            <label for="terms">I have read Terms and Conditions</label>
          </div>

          <div class="checkbox-group" v-if="isSignIn">
            <input type="checkbox" id="rememberMe" v-model="rememberMe" />
            <label for="rememberMe">Remember me</label>
          </div>

          <button type="submit">
            {{ isSignIn ? "Sign In" : "Sign Up" }}
          </button>
        </form>

        <!-- 카카오로 로그인 버튼 -->
        <button class="kakao-btn" type="button" @click="kakaoLogin">
          Login with <span class="kakao-text">Kakao</span>
        </button>

        <!-- 회원정보 조회 버튼 (모달 열기) -->
        <button class="profile-btn" type="button" @click="fetchKakaoProfile">
          Member information inquiry
        </button>

        <p>
          <span>
            {{
              isSignIn ? "Don’t have an account?" : "Already have an account?"
            }}
            <button @click="toggleForm">
              {{ isSignIn ? "Sign Up" : "Sign In" }}
            </button>
          </span>
        </p>
      </div>
    </transition>

    <!-- 프로필 모달 -->
    <div v-if="showProfileModal" class="profile-modal">
      <div class="profile-modal-content">
        <h2>카카오 프로필</h2>
        <div v-if="profileData">
          <p><strong>닉네임:</strong> {{ profileData.nickname }}</p>
          <p>
            <strong>프로필 이미지:</strong><br />
            <img
              v-if="profileData.imageUrl"
              :src="profileData.imageUrl"
              alt="프로필 이미지"
              style="width: 100px; height: 100px; object-fit: cover"
            />
            <span v-else>이미지 없음</span>
          </p>
        </div>
        <button @click="closeProfileModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { useToast } from "vue-toastification";
import { tryLogin, tryRegister } from "../utils/auth";

export default {
  name: "SignIn",
  data() {
    return {
      isSignIn: true,
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
      terms: false,
      emailError: "",
      passwordError: "",
      showForm: false,

      // 프로필 모달
      showProfileModal: false,
      profileData: null, // { nickname, imageUrl }
    };
  },
  mounted() {
    try {
      this.showForm = true;
      // 중복 초기화 제거
      /*
      if (window.Kakao && !window.Kakao.isInitialized()) {
        console.log("Kakao key is:", process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY);
        console.log("Kakao object:", window.Kakao);
        window.Kakao.init(process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY);
        console.log("Kakao SDK Initialized!");
      }
      */
    } catch (e) {
      console.error("SignIn mounted error:", e);
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    ...mapActions("auth", ["login"]),

    toggleForm() {
      this.isSignIn = !this.isSignIn;
      this.resetForm();
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = "이메일 형식이 아닙니다.";
      } else {
        this.emailError = "";
      }
    },
    validatePassword() {
      if (this.password !== this.confirmPassword) {
        this.passwordError = "비밀번호가 일치하지 않습니다.";
      } else {
        this.passwordError = "";
      }
    },
    handleSubmit() {
      if (!this.isSignIn) {
        this.validateEmail();
        this.validatePassword();
        if (this.emailError || this.passwordError || !this.terms) {
          this.toast.error("이미 존재하는 아이디입니다.");
          return;
        }
      }

      if (this.isSignIn) {
        // 로컬 로그인
        tryLogin(
          this.email,
          this.password,
          (user) => {
            this.login({ user, rememberMe: this.rememberMe });
            this.toast.success("로그인 성공!");
            this.$router.push("/");
          },
          () => {
            this.toast.error("아이디나 비밀번호가 틀렸습니다.");
          }
        );
      } else {
        // 회원가입
        tryRegister(
          this.email,
          this.password,
          () => {
            this.toast.success("회원가입을 성공하였습니다. 로그인 해주세요.");
            this.isSignIn = true;
            this.resetForm();
          },
          () => {
            this.toast.error("이미 사용중인 이메일입니다.");
          }
        );
      }
    },

    kakaoLogin() {
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        this.toast.error(
          "카카오 SDK가 로드되지 않았거나 초기화되지 않았습니다."
        );
        return;
      }
      window.Kakao.Auth.login({
        scope: "profile_nickname,profile_image",
        success: () => {
          // 로그인 성공  사용자 정보 가져오기
          window.Kakao.API.request({
            url: "/v2/user/me",
            success: (res) => {
              const kakaoAccount = res.kakao_account || {};
              const userData = {
                id: res.id,
                nickname: kakaoAccount.profile?.nickname || "",
                imageUrl: kakaoAccount.profile?.profile_image_url || "",
              };

              // Vuex 로그인
              this.login({ user: userData, rememberMe: true });
              this.toast.success("카카오 로그인 성공!");

              // 콘솔에 닉네임 이미지
              console.log("카카오 전체 프로필:", res);
              console.log("닉네임:", userData.nickname);
              console.log("프로필 이미지:", userData.imageUrl);

              this.$router.push("/");
            },
            fail: (error) => {
              this.toast.error("카카오 사용자 정보 요청 실패");
              console.error(error);
            },
          });
        },
        fail: (err) => {
          this.toast.error("카카오 로그인 실패");
          console.error(err);
        },
      });
    },

    // 회원정보 조회
    fetchKakaoProfile() {
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        this.toast.error("카카오 SDK가 초기화되지 않았습니다.");
        return;
      }
      if (!window.Kakao.Auth.getAccessToken()) {
        this.toast.error(
          "카카오 로그인 정보가 없습니다. 다시 로그인 해주세요."
        );
        return;
      }

      // 다시 API 호출 (중복 로그인 없이 프로필만 재확인)
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: (res) => {
          const nickname = res.kakao_account?.profile?.nickname || "";
          const imageUrl = res.kakao_account?.profile?.profile_image_url || "";

          // 콘솔 출력
          console.log("회원정보 조회 - 닉네임:", nickname);
          console.log("회원정보 조회 - 프로필이미지:", imageUrl);

          // 모달 표시
          this.profileData = {
            nickname,
            imageUrl,
          };
          this.showProfileModal = true;
        },
        fail: (error) => {
          this.toast.error("회원정보 조회 실패");
          console.error("회원정보 조회 실패:", error);
        },
      });
    },

    closeProfileModal() {
      this.showProfileModal = false;
    },

    resetForm() {
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
      this.rememberMe = false;
      this.terms = false;
      this.emailError = "";
      this.passwordError = "";
    },
  },
};
</script>

<style scoped>
.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #1c1c1c;
}

.form-container {
  width: 400px;
  padding: 30px;
  border: 1px solid #45f3ff;
  border-radius: 8px;
  background-color: #23242a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-container h2 {
  color: #45f3ff;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #45f3ff;
  color: #fff;
  outline: none;
  font-size: 1em;
  transition: border-color 0.3s;
}

.input-group input::placeholder {
  color: #808080;
}

.input-group input:focus {
  border-bottom: 1px solid #45f3ff;
  box-shadow: 0 1px 8px rgba(69, 243, 255, 0.3);
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #45f3ff;
}
.checkbox-group input {
  margin-right: 10px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #fee500;
  border: none;
  color: black;
  cursor: pointer;
  border-radius: 4px;
  font-size: 20px;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #45f3ff;
  transform: scale(1.05);
}

.kakao-btn {
  background-color: #fee500;
  color: #000;
  /* font-weight: bold; */ /* 이 줄을 주석 처리하거나 제거 */
  margin-top: 10px;
}

.profile-btn {
  background-color: #fee500;
  color: #000;
  margin-top: 10px;
}

.error {
  color: red;
  font-size: 0.9em;
}

p {
  text-align: center;
  margin-top: 15px;
  color: #45f3ff;
}

p button {
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;
  text-decoration: underline;
  font-size: 1em;
}

.kakao-text {
  font-weight: bold;
}

.profile-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
