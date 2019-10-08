<template>
  <q-page class="flex flex-center">
    <q-list dark class="podcast-list full-width">
      <q-item
        v-for="podcast in storeFeed"
        :key="podcast.name"
        class="podcast-list__item q-pa-none"
        style="font-size: 0.7rem; font-weight: 300;"
        clickable
        v-ripple
        @click="getPodcast(podcast.id)"
      >
        <q-item-section style="justify-content: flex-start;">
          <img class="full-width" :src="podcast.artworkUrl100" />
          <q-item-label class="flex column justify-between q-pa-xs">
            {{ podcast.name }}
            <small class="block q-mt-xs">{{ podcast.artistName }}</small>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
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
  </q-page>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PageIndex",
  data() {
    return {
      displaySplashScreen: true,
      logo: {
        text: "",
        style: ""
      }
    };
  },
  created() {
    this.$store.dispatch("podcastStore/getStoreFeed");
  },
  computed: {
    ...mapState("podcastStore", {
      storeFeed: state => state.storeFeed
    })
  },
  methods: {
    getPodcast(id) {
      this.$store.dispatch("podcastStore/getPodcast", id);
    },
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
  mounted() {
    setTimeout(() => this.splashScreen("pod.js"), 1000);
    setTimeout(() => (this.displaySplashScreen = false), 6200);
  }
};
</script>
<style lang="scss">
.podcast-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;

  @media (min-width: 514px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 680px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 846px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (min-width: 1012px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (min-width: 1178px) {
    grid-template-columns: repeat(7, 1fr);
  }

  @media (min-width: 1344px) {
    grid-template-columns: repeat(8, 1fr);
  }

  @media (min-width: 1510px) {
    grid-template-columns: repeat(9, 1fr);
  }

  @media (min-width: 1676px) {
    grid-template-columns: repeat(10, 1fr);
  }

  @media (min-width: 1842px) {
    grid-template-columns: repeat(11, 1fr);
  }

  @media (min-width: 2008px) {
    grid-template-columns: repeat(12, 1fr);
  }

  @media (min-width: 2174px) {
    grid-template-columns: repeat(13, 1fr);
  }

  @media (min-width: 2340px) {
    grid-template-columns: repeat(14, 1fr);
  }
}
</style>