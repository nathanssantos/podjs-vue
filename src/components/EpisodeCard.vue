<template>
  <q-item
    class="podcast-list__item q-pa-none"
    style="font-size: 0.7rem; font-weight: 300;"
    clickable
    v-ripple
  >
    <q-item-section
      style="justify-content: flex-start;"
      @click="getPodcast(podcast.id), loading = true"
    >
      <img class="full-width" :src="podcast.artworkUrl100" />
      <q-item-label class="flex column justify-between q-pa-xs">
        {{ podcast.name }}
        <small class="block q-mt-xs">{{ podcast.artistName }}</small>
      </q-item-label>
    </q-item-section>
    <transition v-if="loading" name="fade" mode="out-in">
      <div class="loader flex flex-center absolute-full" style="background: #1a1a1a; opacity: 0.9;">
        <q-spinner-audio size="100px" color="primary" />
      </div>
    </transition>
  </q-item>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "EpisodeCard",
  props: {
    podcast: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
      // podcastInfoModal: {
      //   isOpen: false
      // }
    };
  },
  computed: {
    ...mapState("podcastStore", {
      podcastData: state => state.fetchedPodcast.data
    })
  },
  methods: {
    getPodcast(id) {
      this.$store.dispatch("podcastStore/getPodcast", id);
    },
    getPodcastData(id) {
      this.$store.dispatch("podcastStore/getPodcastData", id);
      this.podcastInfoModal.isOpen = true;
    }
  }
};
</script>
