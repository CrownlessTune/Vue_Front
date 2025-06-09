<template>
  <div>
    <NavbarPrivate />
    <main v-if="!loading">
      <router-view />
    </main>
    <div v-else class="loading">Cargando...</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'
import NavbarPrivate from '../components/NavbarPrivate.vue'
import { useAuthStore } from '@/context/auth'

const authStore = useAuthStore()
const router = useRouter()

// Si no estás inicializando el store en main.js, descomenta la línea siguiente
// authStore.init()

// Redirigir si no está autenticado cuando termine de cargar
watch(
  () => authStore.loading,
  (loading) => {
    if (!loading && !authStore.user) {
      router.push('/login')
    }
  }
)

// Por si no se ha inicializado antes, se puede asegurar la inicialización aquí
onMounted(() => {
  if (!authStore.user && !authStore.loading) {
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
