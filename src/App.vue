<template>
  <div id="q-app" style="height: 100vh; background: #262626;">
    <router-view />
    <transition name="fade" mode="out-in">
      <div
        v-if="displaySplashScreen"
        class="fixed-full flex flex-center splash-screen text-primary text-h1 text-bold"
        :style="`background: #212121; z-index: 9999; transition: all 2s ease-in-out; ${ logo.style }`"
      >
        {{ logo.text }}
        <q-spinner-audio color="primary" size="150px" class="q-mb-xl" />
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
        text: "",
        style: ""
      }
    };
  },
  methods: {
    splashScreen(text) {
      const logo = text.split("");
      const interval = 350;
      logo.forEach((l, i) =>
        setTimeout(() => (this.logo.text += l), i * interval)
      );
      setTimeout(
        () => (this.logo.style = "text-shadow: 0 0 15px rgb(2, 123, 227);"),
        logo.length * interval
      );
    }
  },
  created() {
    this.$store.dispatch("podcastStore/loadAppState");
  },
  mounted() {
    setTimeout(() => this.splashScreen("pod.js"), 1000);
    setTimeout(() => (this.displaySplashScreen = false), 6200);
  }
};
</script>
