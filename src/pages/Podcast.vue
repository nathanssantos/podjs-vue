<template>
  <q-page>
    <header class="q-pa-md text-white" style="display: flex; flex-wrap: wrap;">
      <q-img
        class="q-mr-md q-mb-md text-primary"
        :src="info.image"
        style="min-height: 200px; min-width: 200px; max-height: 200px; max-width: 200px;"
        transition="slide-up"
      >
        <template v-slot:loading>
          <q-spinner-audio color="primary" />
        </template>
      </q-img>
      <div class="flex column items-start justify-center q-mb-md">
        <div class="text-h5 q-mb-xs" overline>{{ info.title }}</div>
        <small
          class="block"
          style="margin-left: 2px; font-weight: 300; font-size: 1rem;"
        >{{ info.author }}</small>
        <q-btn
          @click="isFavorited ? unfavoritePodcast() : favoritePodcast()"
          :label="isFavorited ? 'Cancelar Assinatura' : 'Assinar' "
          class="q-mt-md q-px-lg bt-sign"
          size="10px"
        />
      </div>
      <p
        style="font-size: 12px; display: block; width: 100%; font-weight: 300;"
        v-html="info.description"
      />
      <q-input
        placeholder="Buscar..."
        dark
        dense
        v-model="filterValue"
        class="full-width episode-search"
        @input="filterEpisodes(filterValue)"
        debounce="1000"
        style="font-size: 12px;"
      />
    </header>
    <q-list dark class="q-py-md">
      <q-expansion-item
        v-for="(episode,i) in episodes"
        :key="i"
        class="episode-card"
        expand-icon-toggle
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-img
              square
              style="width: 75px; height: 75px;"
              :src="episode.image"
              class="episode-card__image text-primary"
              transition="slide-up"
            >
              <template v-slot:loading>
                <q-spinner-audio color="primary" size="20px" />
              </template>
            </q-img>
          </q-item-section>

          <q-item-section>
            <q-item-label
              @click="playEpisode(episode)"
              overline
              style="font-size: 12px;"
              class="episode-card__title text-white"
            >{{ episode.title }}</q-item-label>
          </q-item-section>
        </template>
        <q-card style="background: none; font-size: 12px;">
          <q-card-section v-html="episode.description" class="q-pt-lg q-pb-xl" />
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Podcast",
  data() {
    return {
      isFavorited: null,
      filterValue: ""
    };
  },
  computed: {
    ...mapState("podcastStore", {
      episodes: state => state.fetchedPodcast.filteredEpisodes,
      info: state => state.fetchedPodcast.info,
      data: state => state.fetchedPodcast.data
    })
  },
  methods: {
    playEpisode(episode) {
      this.$root.$emit("playEpisode");
      this.$store.dispatch("podcastStore/playEpisode", episode);
    },
    filterEpisodes(value) {
      this.$store.dispatch("podcastStore/filterEpisodes", value);
    },
    favoritePodcast() {
      this.$store.dispatch("podcastStore/favoritePodcast", this.data.id);
      this.isFavorited = true;
    },
    unfavoritePodcast() {
      this.$store.dispatch("podcastStore/unfavoritePodcast", this.data.id);
      this.isFavorited = false;
    }
  },
  mounted() {
    this.filterEpisodes();
    this.data.favorited
      ? (this.isFavorited = true)
      : (this.isFavorited = false);
  }
};
</script>
<style lang="scss">
.episode-card {
  &__title {
    padding: 20px 0;
    cursor: pointer;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    &:hover {
      color: var(--q-color-primary) !important;
    }
  }
}

.q-expansion-item {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.q-expansion-item--expanded {
  background: #212121;
}

.q-expansion-item__toggle-icon {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

  &:hover {
    color: var(--q-color-primary) !important;
  }
}

.bt-sign,
.episode-search {
  &:hover {
    color: var(--q-color-primary) !important;
  }
}
</style>
