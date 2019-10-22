<template>
  <div id="q-app" style="height: 100vh; background: #262626;">
    <router-view />
    <transition name="fade" mode="out-in">
      <div v-if="displaySplashScreen" class="fixed-full flex flex-center splash-screen">
        <div class="logo text-primary text-h1 text-bold" :style="logo.style">{{ logo.text }}</div>
        <div class="logo__spinner">
          <q-spinner-audio class="q-mb-xl" style="width: 105px;" color="primary" size="150px" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      displaySplashScreen: true,
      logo: {
        text: "pod.js",
        style: "",
        transformStyle: "width: 330px; opacity: 1; padding: 20px;"
      }
    };
  },
  methods: {
    splashScreen() {
      setTimeout(() => (this.logo.style = this.logo.transformStyle), 1000);
      setTimeout(
        () => (this.logo.style += " text-shadow: 0 0 15px rgb(2, 123, 227);"),
        3000
      );
    }
  },
  mounted() {
    setTimeout(() => this.splashScreen(), 1000);
    setTimeout(() => (this.displaySplashScreen = false), 6000);
  }
};
</script>

<style lang="scss">
.splash-screen {
  background: #212121;
  z-index: 9999;
  transition: all 2s ease-in-out;
  .logo {
    width: 0;
    overflow: hidden;
    transition: width 2s cubic-bezier(0.075, 0.82, 0.165, 1),
      opacity 2s ease-in-out, text-shadow 2s ease-in-out;
    padding: 0;
    opacity: 0;

    &__spinner {
      position: relative;
      &::before {
        content: "";
        height: 100%;
        width: 5px;
        background: linear-gradient(
          to right,
          rgba(#212121, 0),
          rgba(#212121, 1)
        );
        position: absolute;
        left: 0;
        transform: translateX(-100%);
      }
    }
  }
}
</style>
