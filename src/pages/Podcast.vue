<template>
  <q-page>
    <q-list dark class="q-pa-md">
      <q-item
        clickable
        v-for="(episode,i) in episodes"
        @click="playEpisode(episode)"
        :key="i"
        class="q-pa-none q-mb-md"
        style="border-top: 1px solid #1a1a1a;"
      >
        <q-item-section style="display: grid; grid-template-columns: 120px 1fr;">
          <q-avatar size="100px" square style="margin: 0; min-height: 100px;">
            <img :src="episode.image" />
          </q-avatar>
          <div class="q-py-md q-pr-md">
            <q-item-label overline class="text-bold q-mb-sm text-uppercase">{{ episode.title }}</q-item-label>
            <q-item-label style="font-weight: 300;" v-html="episode.description" />
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
      episodes: state => state.fetchedPodcast.episodes
    })
  },
  methods: {
    playEpisode(episode) {
      this.$store.dispatch("podcastStore/playEpisode", episode);
    }
  }
};
</script>
