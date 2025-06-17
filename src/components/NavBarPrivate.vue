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
  background-color: #f5f3f0; /* arena */
  padding: 0 1rem;
  height: 3rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  border-bottom: 2px solid #fcbf49; /* amarillo Cádiz */
  z-index: 1000;
}

.nav-link {
  color: #0077b6; /* azul Cádiz */
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.3rem 0.5rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #90e0ef;
  text-decoration: underline;
}

.logout-btn {
  background-color: #ef4444;
  color: #fff;
  border: none;
  padding: 0.35rem 0.9rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: #b91c1c;
}

.user-info {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1e1e1e;
}

/* Asegura espacio para navbar fija */
body {
  padding-top: 3rem;
}

</style>



