<template>
  <div>
    <NavbarPublic />
    <main v-if="!authStore.loading">
      <router-view />
    </main>
    <div v-else class="loading">Cargando...</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavbarPublic from '../components/NavbarPublic.vue'
import { useAuthStore } from '@/context/auth'

const authStore = useAuthStore()

// Aseguramos que el store esté inicializado (si no se hizo en main.js)
if (authStore.loading && !authStore.user) {
  authStore.init()
}

// Opcional: si quieres hacer algo cuando cargue, aquí
onMounted(() => {
  // por ejemplo, podrías precargar algo o controlar la UI
})
</script>

<style scoped>
.loading {
  text-align: center;
  margin-top: 2rem;
  font-weight: bold;
}
</style>
