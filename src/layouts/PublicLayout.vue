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

if (authStore.loading && !authStore.user) {
  authStore.init()
}

onMounted(() => {
})
</script>

<style scoped>
.loading {
  text-align: center;
  margin-top: 2rem;
  font-weight: bold;
}
</style>
