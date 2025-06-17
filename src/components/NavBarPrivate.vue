<template>
  <nav class="navbar">
    <div class="user-info">
      <router-link to="/app/profile" class="nav-link">{{ displayNameOrEmail }}</router-link>
    </div>
    <router-link to="/app/new" class="nav-link">Añadir punto de interés</router-link>
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
  padding: 0 2rem 1rem 2rem;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  border-radius: 0 0 8px 8px;
  gap: 1.5rem;
  flex-wrap: wrap;
  z-index: 1000;
  height: 4rem; /* fija altura para mejor control */
}

.nav-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  display: flex;
  align-items: center; /* centra verticalmente */
  height: 100%; /* ocupa toda la altura del navbar */
}

.nav-link:hover {
  color: #1e40af;
  text-decoration: underline;
}

.logout-btn {
  background-color: #ef4444;
  color: #fff;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center; /* centra verticalmente */
  height: 100%;
}

.logout-btn:hover {
  background-color: #b91c1c;
}

.user-info {
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center; /* centra verticalmente */
  height: 100%;
}

/* Evita que el contenido quede tapado por el navbar fijo */
body {
  padding-top: 4rem; /* ajusta según la altura total del navbar */
}
</style>



