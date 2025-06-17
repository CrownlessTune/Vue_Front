<template>
  <nav class="navbar">
    <div class="user-info">
      <router-link to="/app/profile">{{ displayNameOrEmail }}</router-link>
    </div>
    <router-link to="/app/new">Añadir punto de interés</router-link>
    <button @click="logout" class="logout-btn">Cerrar sesión</button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/context/auth'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  sessionStorage.removeItem('user')
  router.push('/login')
}

const displayNameOrEmail = computed(() => {
  const user = authStore.user
  return user?.displayName || user?.email || 'Usuario'
})
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f3f3f3;
  padding: 1rem;
}
.logout-btn {
  background-color: #e3342f;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.user-info {
  font-weight: bold;
}
</style>
