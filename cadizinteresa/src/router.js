import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './context/auth.js'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'
import EditProfile from './views/EditProfile.vue'
import NewInterest from './views/NewInterest.vue'

const routes = [
  {
    path: '/',
    component: () => import('./layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ]
  },
  {
    path: '/app',
    component: () => import('./layouts/PrivateLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'profile', component: Profile },
      { path: 'edit', component: EditProfile },
      { path: 'new', component: NewInterest },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = sessionStorage.getItem('auth')
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
