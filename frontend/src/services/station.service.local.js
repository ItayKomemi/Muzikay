import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import axios from 'axios'

import gStations from '../../data/station.json'
// import { userService } from './user.service.js'
const gUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyA7mUfwc8_dAf8qblavJOThFcYsKufDt38&q=`
const STORAGE_KEY = 'station'
const SEARCH_KEY = 'videosDB'
const USER_KEY = 'userStationDB'
let gSearchCache = utilService.loadFromStorage(SEARCH_KEY) || {}
_createStations()
createUserStations()
export const stationService = {
  query,
  getById,
  save,
  remove,
  getEmptyStation,
  getVideos,
  createNewStation,
  addSongToStation,
  removeSong,
  // addStationMsg,
}
window.cs = stationService

async function query(filterBy = { name: '' }) {
  var stations = await storageService.query(STORAGE_KEY)
  if (filterBy.name) {
    const regex = new RegExp(filterBy.name, 'i')
    stations = stations.filter((station) => regex.test(station.name))
  }
  return stations
}

function getById(stationId) {
  return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
  await storageService.remove(STORAGE_KEY, stationId)
}

async function save(station) {
  var savedStation
  console.log('station', station)
  if (station._id) {
    savedStation = await storageService.put(STORAGE_KEY, station)
  } else {
    // Later, owner is set by the backend
    // station.owner = userService.getLoggedinUser()
    savedStation = await storageService.post(STORAGE_KEY, station)
  }
  return savedStation
}

function getEmptyStation() {
  return {
    //   _id: utilService.makeId(),
  }
}

function removeSong(songId, stationId) {
  const stations = utilService.loadFromStorage(STORAGE_KEY)
  const station = stations.find((s) => s._id === stationId)
  const songIdx = station.songs.findIndex((so) => so._id === songId)
  const newSongs = station.songs.splice(songIdx, 1)
  station.songs = newSongs
  stations.push(station)
  utilService.saveToStorage(STORAGE_KEY, stations)
}
function getVideos(keyword) {
  if (gSearchCache[keyword]) {
    return Promise.resolve(gSearchCache[keyword])
  }

  return axios.get(gUrl + keyword).then((res) => {
    const videos = res.data.items.map((item) => _prepareData(item))
    gSearchCache = videos
    utilService.saveToStorage(SEARCH_KEY, gSearchCache)
    return videos
  })
}

function _prepareData(item) {
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    url: `https://www.youtube.com/embed/${item.id.videoId}`, // Changed from 'item.snippet.thumbnails.default.url'
  }
}

function _createStations() {
  let stations = gStations
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stations))
  }
}

function createNewStation(name) {
  const newStation = {
    _id: utilService.makeId(),
    name: name,
    tags: [],
    createdBy: {
      _id: '',
      fullname: 'guest',
      imgUrl: '',
    },
    likedByUsers: [],
    songs: [],
    msgs: [
      {
        id: '',
        from: '',
        txt: '',
      },
    ],
    new: true,
  }

  const stations = utilService.loadFromStorage(USER_KEY)
  console.log(stations)
  // if (!stations.length) {
  //   utilService.saveToStorage(USER_KEY, newStation)
  // } else {
  //   stations.push(newStation)
  //   utilService.saveToStorage(USER_KEY, stations)
  // }
  return newStation
}

function createUserStations() {
  var stations = JSON.parse(localStorage.getItem(USER_KEY))
  if (!stations || !stations.length) {
    const userStations = [
      createNewStation('rania mamy'),
      createNewStation('itay maniak'),
    ]
    localStorage.setItem(USER_KEY, JSON.stringify(userStations))
  }
}

async function addSongToStation(video, station) {
  console.log('video from addSongToStation', video)
  console.log('station from addSongToStation', station)
  const updatedStation = { ...station, songs: [...station.songs, video] }
  const savedStation = await save(updatedStation)
  return savedStation
}
