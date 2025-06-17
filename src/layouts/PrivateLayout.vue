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

if (!authStore.user && authStore.loading) {
  authStore.init()
}

watch(
  () => authStore.loading,
  (loading) => {
    if (!loading && !authStore.user) {
      router.push('/login')
    }
  }
)

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
