<template>
  <nav>
    <router-link to="/app/profile">{{ authStore.user?.displayName }}</router-link>
    <router-link to="/app/new">Añadir punto de interés</router-link>
    <button @click="logout">Cerrar sesión</button>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../context/auth'
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>
