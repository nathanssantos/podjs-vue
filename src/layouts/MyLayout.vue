<template>
  <q-layout dark view="lHh lpr lFf" container class="shadow-10">
    <transition name="fade" mode="out-in">
      <q-btn
        v-if="$route.meta.btBack"
        @click="$router.replace('/')"
        dense
        icon="arrow_back"
        class="bt-back text-primary"
      />
    </transition>
    <q-header class="app-header" elevated>
      <q-bar dense class="q-electron-drag q-py-none q-pr-none" style="background: none;">
        <div class="text-primary app-title">pod.js</div>

        <q-space />

        <q-btn color="primary" flat icon="minimize" @click="minimize" />
        <q-btn color="primary" flat icon="crop_square" @click="maximize" />
        <q-btn color="primary" class="bt-close-app" flat icon="close" @click="closeApp" />
      </q-bar>
    </q-header>

    <q-page-container>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>

    <q-footer
      elevated
      class="flex items-center q-pa-sm q-px-md app-footer"
      style="background: #1a1a1a;"
    >
      <q-avatar size="100px" square class="q-mr-md">
        <transition name="fade" mode="out-in">
          <img :src="nowPlaying.image" v-if="nowPlaying.image" />
        </transition>
      </q-avatar>
      <q-item-label
        overline
        class="player__title text-primary text-uppercase"
      >{{ nowPlaying.title }}</q-item-label>
      <q-media-player autoplay color="primary" type="audio" :source="nowPlaying.audio">
        <template v-slot:spinner>
          <transition name="fade" mode="out-in">
            <div class="loader flex flex-center">
              <q-spinner-audio size="60px" color="primary" />
            </div>
          </transition>
        </template>
      </q-media-player>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MyLayout",
  computed: {
    ...mapState("podcastStore", {
      nowPlaying: state => state.nowPlaying
    })
  },
  methods: {
    minimize() {
      if (process.env.MODE === "electron") {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize();
      }
    },
    maximize() {
      if (process.env.MODE === "electron") {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();

        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    },
    closeApp() {
      if (process.env.MODE === "electron") {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close();
      }
    }
  }
};
</script>

<style lang="scss" >
.app {
  &-header {
    background: #1a1a1a;
    z-index: 9999;

    .q-btn {
      height: 100%;
      margin: 0;
    }

    .bt-close-app {
      &:hover {
        background: $primary;
        color: #fff !important;
      }
    }
  }

  &-title {
    font-weight: 900;
  }

  &-footer {
    display: grid;
    grid-template-columns: 116px 1fr;
    .player {
      &__title {
        font-size: 14px;
        grid-column: 2/3;
        font-weight: 700;
        margin-left: 3px;
      }
    }

    .q-avatar {
      grid-row: 1/3;
    }
    .q-media {
      font-weight: 700;
      background: #1a1a1a !important;
      width: 100%;
      height: 40px !important;
      overflow: visible !important;
      align-self: flex-end;

      &__controls {
        background: #1a1a1a !important;
        display: flex;
        flex-direction: row-reverse;
        height: 40px !important;
        &--row:last-of-type {
          max-width: 200px;
        }

        &--video-time-text {
          margin-top: 4px;
          font-size: 12px;
        }
      }
      &__loading--audio {
        display: none;
      }
      .loader {
        position: absolute;
        top: -68px;
        left: -132px;
        width: 132px;
        height: 116px;
        background: rgba(#1a1a1a, 0.6);
      }
    }
  }
}
.bt-back {
  position: fixed;
  z-index: 99;
  background: #1a1a1a;
  transform: rotate(45deg);
  top: -40px;
  left: -6px;
  height: 150px;
  width: 40px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2), 0 0px 10px rgba(0, 0, 0, 0.24);

  .q-btn__content {
    padding: 0;
    // transform: rotate(-45deg);
    margin-right: -7px;
    margin-bottom: -7px;
  }
}
</style>
