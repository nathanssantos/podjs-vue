<template>
  <q-page>
    <header class="q-pa-md text-white" style="display: flex; flex-wrap: wrap;">
      <q-img
        class="q-mr-md q-mb-md text-primary"
        :src="info.image"
        style="min-height: 200px; min-width: 200px; max-height: 200px; max-width: 200px;"
      />
      <div class="flex column justify-center q-mb-md">
        <div class="text-h4 q-mb-xs" overline>{{ info.title }}</div>
        <small class="block text-h6" style="margin-left: 2px; font-weight: 300;">{{ info.author }}</small>
      </div>
      <p style="display: block; width: 100%; font-weight: 300;" v-html="info.description" />
    </header>
    <q-list dark class="q-py-md">
      <q-item
        clickable
        v-for="(episode,i) in episodes"
        @click="playEpisode(episode)"
        :key="i"
        class="q-pa-none episode-card"
      >
        <q-item-section style="display: grid; grid-template-columns: 136px 1fr;">
          <div class="q-pl-md q-py-md">
            <q-img
              square
              style="width: 100px; height: 100px;"
              :src="episode.image"
              class="episode-card__image text-primary"
            />
          </div>
          <div class="q-py-md q-pr-md">
            <q-item-label overline class="text-bold q-mb-sm text-uppercase">{{ episode.title }}</q-item-label>
            <q-item-label
              style="font-weight: 300; font-size: 12px; line-height: 15px !important;"
              v-html="episode.description"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Podcast",
  computed: {
    ...mapState("podcastStore", {
      episodes: state => state.fetchedPodcast.episodes,
      info: state => state.fetchedPodcast.info
    })
  },
  methods: {
    playEpisode(episode) {
      this.$store.dispatch("podcastStore/playEpisode", episode);
    }
  }
};
</script>
<style>
</style>
