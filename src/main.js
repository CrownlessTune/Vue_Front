import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './context/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

const authStore = useAuthStore()
authStore.init()

app.mount('#app')
