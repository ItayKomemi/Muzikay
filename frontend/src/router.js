import { createRouter, createWebHashHistory } from 'vue-router'

// import Home from './views/Home.vue'
// import Chat from './views/Chat.vue'
// import CarIndex from './views/CarIndex.vue'
// import ReviewIndex from './views/ReviewIndex.vue'
// import LoginSignup from './views/LoginSignup.vue'
// import UserDetails from './views/UserDetails.vue'

import Search from './views/Search.vue'
import UserLibrary from './views/UserLibrary.vue'
import CreateStation from './views/CreateStation.vue'
import LikedSongs from './views/LikedSongs.vue'
import StationIndex from './views/StationIndex.vue'

//  buttons for navigation

{
  /* <RouterLink to="/back">back</RouterLink> */
}
{
  /* <RouterLink to="/go">go</RouterLink> */
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: StationIndex,

    childern: [
      {
        path: '/search',
        name: 'search',
        component: Search,
      },
      {
        path: '/library',
        name: 'Library',
        component: UserLibrary,
      },
      {
        path: '/create',
        name: 'CreateStation',
        component: CreateStation,
      },
      {
        path: '/like',
        name: 'like',
        component: LikedSongs,
      },
    ],
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  // base: process.env.BASE_URL,
})
