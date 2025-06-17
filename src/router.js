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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Esperar que termine de cargar el estado de auth
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
    // Si ya está logueado, evitar volver a login o registro
    next('/app/profile')
  } else {
    next()
  }
})

export default router
