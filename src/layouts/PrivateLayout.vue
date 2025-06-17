<template>
  <div>
    <NavbarPrivate />
    <main v-if="!authStore.loading">
      <router-view />
    </main>
    <div v-else class="loading">Cargando...</div>
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarPrivate from '../components/NavbarPrivate.vue'
import { useAuthStore } from '@/context/auth'

const authStore = useAuthStore()
const router = useRouter()

// Aseguramos que el store esté inicializado (solo si no se hizo en main.js)
if (!authStore.user && authStore.loading) {
  authStore.init()
}

// Observamos cuando termine la carga de auth y redirigimos si no hay usuario
watch(
  () => authStore.loading,
  (loading) => {
    if (!loading && !authStore.user) {
      router.push('/login')
    }
  }
)

// Por si el usuario no está y ya no está cargando, redirigimos también en montaje
onMounted(() => {
  if (!authStore.loading && !authStore.user) {
    router.push('/login')
  }
})
</script>

<style scoped>
.loading {
  text-align: center;
  margin-top: 2rem;
  font-weight: bold;
}
</style>
