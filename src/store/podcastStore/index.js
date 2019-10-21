import axios from 'axios'

export default {
  namespaced: true,
  state: {
    storeFeed: [],
    favorites: [],
    fetchedPodcast: {
      info: {},
      episodes: [],
      filteredEpisodes: [],
      data: {}
    },
    nowPlaying: {
      title: "",
      image: "",
      audio: "",
      playTime: null
    }
  },
  getters: {
    getFavorites(state) {
      let favorites = []
      state.favorites.forEach(id => state.storeFeed.forEach(i => {
        if (i.id === id) {
          i.favorited = true
          favorites.push(i)
        }
      }))
      return favorites
    }
  },
  mutations: {
    APP_STATE_SAVED(state) {
      let savedState = {
        favorites: state.favorites,
        nowPlaying: state.nowPlaying
      }
      localStorage.setItem("state", JSON.stringify(savedState))
    },
    STORE_FEED_FETCHED(state, storeFeed = []) {
      state.storeFeed = storeFeed
      storeFeed.forEach(i => {
        i.favorited = false
        i.loading = false
      })
    },
    PODCAST_FETCHED(state, { info = {}, episodes = [], data = {} } = {}) {
      state.fetchedPodcast.episodes = episodes
      state.fetchedPodcast.info = info
      state.fetchedPodcast.data = data
      this.$router.replace("podcast")
    },
    EPISODE_LIST_FILTERED(state, value = "") {
      if (value.length > 0) {
        state.fetchedPodcast.filteredEpisodes = state.fetchedPodcast.episodes.filter(
          item =>
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.title
              .toLowerCase()
              .replace(/[àáâãäå]/, "a")
              .includes(value.toLowerCase()) ||
            item.title
              .toLowerCase()
              .replace(/[èéêë]/, "e")
              .includes(value.toLowerCase()) ||
            item.title
              .toLowerCase()
              .replace(/[ìíîï]/, "i")
              .includes(value.toLowerCase()) ||
            item.title
              .toLowerCase()
              .replace(/[òóôöõ]/, "o")
              .includes(value.toLowerCase()) ||
            item.title
              .toLowerCase()
              .replace(/[ùúûü]/, "u")
              .includes(value.toLowerCase())
        );
      } else {
        state.fetchedPodcast.filteredEpisodes = state.fetchedPodcast.episodes
      }
    },
    PLAYING_PODCAST(state, episode = {}) {
      state.nowPlaying.audio = episode.audio
      state.nowPlaying.title = episode.title
      state.nowPlaying.image = episode.image
    },
    PODCAST_FAVORITED(state, id = "") {
      if (!state.favorites.includes(id)) state.favorites.push(id)
      return
    },
    PODCAST_UNFAVORITED(state, id = "") {
      state.favorites = state.favorites.filter(f => f != id)
    },
    PLAYTIME_SAVED(state, playTime) {
      localStorage.setItem("playTime", JSON.stringify(playTime))
    },
    APP_STATE_LOADED(state) {
      let loadedState = JSON.parse(localStorage.getItem("state"))
      let playTime = JSON.parse(localStorage.getItem("playTime"))
      if (loadedState) {
        state.favorites = loadedState.favorites
        state.nowPlaying = loadedState.nowPlaying
      }
      if (playTime) state.nowPlaying.playTime = playTime
    }
  },
  actions: {
    getStoreFeed({ commit }) {
      axios //Get itunes rss feed
        .get('https://rss.itunes.apple.com/api/v1/br/podcasts/top-podcasts/all/100/explicit.json')
        .then(r => {
          commit("STORE_FEED_FETCHED", r.data.feed.results)
        })
        .catch(err => {
          if (err) alert("Servidor em manutenção.")
          return
        })
    },
    getPodcast({ commit }, podcast) {
      axios //Get selected podcast info
        .get(`https://itunes.apple.com/lookup?id=${podcast.id}`)
        .then(r => {
          axios //Get selected podcast rss feed 
            .get(r.data.results[0].feedUrl)
            .then(r => {
              const parser = new DOMParser(), //Parse selected podcast rss feed to xml
                xml = parser.parseFromString(r.data, "application/xml"),
                payload = {
                  info: {},
                  episodes: [],
                  data: podcast
                }

              if (xml.querySelector("title") != undefined) payload.info.title = xml.querySelector("title").textContent
              if (xml.querySelector("channel > description") != undefined) payload.info.description = xml.querySelector("channel > description").textContent
              if (xml.querySelector("image url") != undefined) payload.info.image = xml.querySelector("image url").textContent
              if (xml.querySelector("author") != undefined) payload.info.author = xml.querySelector("author").textContent

              xml.querySelectorAll("item").forEach(i => { //Extract espisodes data from selected podcast parsed xml 
                const episode = {}
                if (i.querySelector("title") != undefined) episode.title = i.querySelector("title").textContent
                if (i.querySelector("enclosure") != undefined) episode.audio = i.querySelector("enclosure").getAttribute("url")
                if (i.querySelector("summary") != undefined) episode.description = i.querySelector("summary").textContent
                if (i.querySelector("image") && i.querySelector("image").getAttribute("href").length > 10) {
                  episode.image = i.querySelector("image").getAttribute("href")
                } else if (xml.querySelector("rss channel image url") != undefined) {
                  episode.image = xml.querySelector("rss channel image url").textContent
                }
                payload.episodes.push(episode)
              })

              if (payload.episodes.length < 1) {
                alert("Este podcast não está disponível no momento.")
                return
              }
              commit("PODCAST_FETCHED", payload)
            })
        }).catch(err => {
          if (err) alert("Este podcast não está disponível no momento.")
          return
        })
    },
    loadAppState({ commit }) {
      commit("APP_STATE_LOADED")
    },
    filterEpisodes({ commit }, value) {
      commit("EPISODE_LIST_FILTERED", value)
    },
    playEpisode({ commit }, episode) {
      commit("PLAYING_PODCAST", episode)
      commit("APP_STATE_SAVED")
    },
    favoritePodcast({ commit }, id) {
      commit("PODCAST_FAVORITED", id)
      commit("APP_STATE_SAVED")
    },
    unfavoritePodcast({ commit }, id) {
      commit("PODCAST_UNFAVORITED", id)
      commit("APP_STATE_SAVED")
    },
    savePlayTime({ commit }, playTime) {
      commit("PLAYTIME_SAVED", playTime)
    }
  }
}