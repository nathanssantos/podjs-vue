import axios from 'axios'

export default {
    namespaced: true,
    state: {
        storeFeed: [],
        fetchedPodcast: {
            info: {},
            episodes: []
        },
        nowPlaying: {
            title: "",
            image: "",
            audio: ""
        }
    },
    mutations: {
        STORE_FEED_FETCHED(state, storeFeed = []) {
            state.storeFeed = storeFeed
            storeFeed.forEach(i => i.loading = false)
        },
        PODCAST_FETCHED(state, { info = {}, episodes = [] } = {}) {
            state.fetchedPodcast.episodes = episodes
            state.fetchedPodcast.info = info
            this.$router.replace("podcast")
        },
        PLAYING_PODCAST(state, episode = {}) {
            state.nowPlaying.audio = episode.audio
            state.nowPlaying.title = episode.title
            state.nowPlaying.image = episode.image
        }
    },
    actions: {
        getStoreFeed({ commit }) {
            axios //Get itunes rss feed
                .get('https://rss.itunes.apple.com/api/v1/br/podcasts/top-podcasts/all/100/explicit.json')
                .then(r => commit("STORE_FEED_FETCHED", r.data.feed.results))
                .catch(err => {
                    if (err) alert("Servidor em manutenção.")
                    return
                })
        },
        getPodcast({ commit }, id) {
            axios //Get selected podcast info
                .get(`https://itunes.apple.com/lookup?id=${id}`)
                .then(r => {
                    axios //Get selected podcast rss feed 
                        .get(r.data.results[0].feedUrl)
                        .then(r => {
                            const parser = new DOMParser(), //Parse selected podcast rss feed to xml
                                xml = parser.parseFromString(r.data, "application/xml"),
                                payload = {
                                    info: {},
                                    episodes: []
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
        playEpisode({ commit }, episode) {
            commit("PLAYING_PODCAST", episode)
        }
    }
}