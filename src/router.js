import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './context/auth.js'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'
import EditProfile from './views/EditProfile.vue'
import NewInterest from './views/NewInterest.vue'
import Contacto from './views/Contacto.vue'

const routes = [
  {
    path: '/',
    component: () => import('./layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'contacto', component: Contacto },
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.loading) {
    await new Promise(resolve => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.loading) {
          unwatch()
          resolve()
        }
      })
    })
  }

  const isLoggedIn = !!authStore.user

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    next('/app/profile')
  } else {
    next()
  }
})

export default router
