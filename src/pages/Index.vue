<template>
  <q-page class="flex column flex-start">
    <div v-if="getFavorites.length > 0">
      <div class="text-h4 text-white title">Meus Podcasts</div>
      <q-list dark class="podcast-list full-width q-mb-xl">
        <PodcastCard v-for="podcast in getFavorites" :key="podcast.name" :podcast="podcast" />
      </q-list>
    </div>
    <div class="text-h4 text-white title">Top 100 Podcasts</div>
    <q-list dark class="podcast-list full-width">
      <PodcastCard v-for="podcast in storeFeed" :key="podcast.name" :podcast="podcast" />
    </q-list>
  </q-page>
</template>

<script>
import PodcastCard from "../components/PodcastCard";
import { mapState, mapGetters } from "vuex";
export default {
  name: "PageIndex",
  components: {
    PodcastCard
  },
  created() {
    this.$store.dispatch("podcastStore/loadAppState");
    this.$store.dispatch("podcastStore/getStoreFeed");
  },
  computed: {
    ...mapState("podcastStore", {
      storeFeed: state => state.storeFeed
    }),
    ...mapGetters("podcastStore", ["getFavorites"])
  }
};
</script>
<style lang="scss">
.title {
  text-align: left;
  align-self: flex-start;
  margin-top: 16px;
  font-weight: 300;
  margin-left: 32px;
  position: relative;
  &:before {
    content: "";
    width: 8px;
    height: 40px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-16px, -50%);
    background: var(--q-color-primary);
  }
}

.podcast-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;

  &__item {
    overflow: hidden;

    &:hover {
      .podcast-list__item__actions {
        transform: translate3d(0, 0, 0);
        box-shadow: 0 4px 5px -2px rgba(0, 0, 0, 0.35),
          0 7px 10px 1px rgba(0, 0, 0, 0.35), 0 2px 16px 1px rgba(0, 0, 0, 0.35);
      }
    }
  }

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