import axios from 'axios'

export default {
    namespaced: true,
    state: {
        storeFeed: [],
        fetchedPodcast: {
            episodes: []
        },
        nowPlaying: {
            title: "",
            image: "",
            audio: ""
        }
    },
    mutations: {
        STORE_FEED_FETCHED(state, storeFeed) {
            state.storeFeed = storeFeed
        },
        PODCAST_FETCHED(state, episode) {
            state.fetchedPodcast.episodes = episode
            console.log(state.fetchedPodcast)
            this.$router.replace("podcast")
        },
        PLAYING_PODCAST(state, episode) {
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
                                episodes = []

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
                                episodes.push(episode)
                                // console.log(i)
                            })
                            // console.log(episodes)
                            if (episodes.length < 1) {
                                alert("Este podcast não está disponível no momento.")
                                return
                            }
                            commit("PODCAST_FETCHED", episodes)
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