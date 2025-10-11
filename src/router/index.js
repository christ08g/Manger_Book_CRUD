//import modul dan komponen
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/LoginView.vue'
import DashboardCRUD from '../components/DashboardCRUD.vue'

//Daftar Rute
const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardCRUD }
]

//Membuat Router Instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

//Penanganan Error Pada Router
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

//Mencegah browser melakukan reload berulang kali ketika error import modul tidak selesai
router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
