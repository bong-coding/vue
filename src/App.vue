<!-- src/App.vue -->
<template>
  <div id="app">
    <Header />
    <!-- Header 컴포넌트 포함 -->
    <router-view />
    <Footer />
    <!-- Footer 컴포넌트 포함 -->
  </div>
</template>

<script>
import Header from "./components/common/Header.vue";
import Footer from "./components/common/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* 기존에 있던 test-movie-card 스타일은 제거 */
</style>
