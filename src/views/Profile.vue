<template>
  <div class="profile">
    <div class="header">
      <img :src="userPhoto" alt="Foto de perfil" class="profile-pic" />
      <div class="header-info">
        <h2>{{ userName }}</h2>
        <div class="header-actions">
          <button class="edit-btn" @click="goToEdit">Editar perfil</button>
          <button class="logout-btn" @click="logout">Cerrar sesión</button>
        </div>
      </div>
    </div>

    <div class="friends" v-if="friends.length">
      <h3>Amigos</h3>
      <ul>
        <li v-for="friend in friends" :key="friend.id">{{ friend.name }}</li>
      </ul>
    </div>

    <div class="places">
      <h3>Sitios de interés</h3>
      <div class="filters">
        <button :class="{ active: filter==='all' }" @click="filter = 'all'">Todos</button>
        <button :class="{ active: filter==='mine' }" @click="filter = 'mine'">Mis sitios</button>
        <button :class="{ active: filter==='saved' }" @click="filter = 'saved'">Guardados</button>
      </div>
      <ul>
        <li v-for="place in filteredPlaces" :key="place.id">
          <strong>{{ place.title }}</strong> - {{ place.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/context/user'

// Accedemos al store de usuario y al router
const userStore = useUserStore()
const router = useRouter()

// Variables locales para la UI
const filter = ref('all')
const userPhoto = ref('')
const userName = ref('')
const friends = ref([])
const places = ref([])

const filteredPlaces = computed(() => {
  if (filter.value === 'mine') return places.value.filter(p => p.owner === 'mine')
  if (filter.value === 'saved') return places.value.filter(p => p.owner === 'saved')
  return places.value
})

// Función para redirigir al editor de perfil
const goToEdit = () => {
  router.push('/app/edit')
}

// Función para cargar los datos del usuario desde el store
const loadUserData = () => {
  if (!userStore.user || !userStore.user.uid) {
    router.push('/login')
    return
  }
  userPhoto.value = userStore.user.photoURL || 'https://via.placeholder.com/100'
  userName.value = userStore.user.displayName || userStore.user.email || 'Usuario'
  friends.value = userStore.user.friends || []
  places.value = userStore.user.places || []
}

// Ejecutamos la carga inicial
loadUserData()
// Actualizamos si cambian los datos en el store
watch(() => userStore.user, loadUserData)

// Función para cerrar sesión
const logout = () => {
  // Asumimos que el store tiene un método para desloguear, si no, lo hacemos aquí:
  userStore.logout() // En el store, se debe hacer signOut y limpiar el estado
  sessionStorage.removeItem('user')  // Elimina los datos guardados localmente
  router.push('/login')
}
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}
.profile-pic {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2563eb;
}
.header-info {
  flex: 1;
}
.header-actions {
  margin-top: 0.5rem;
}
.header-actions button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.edit-btn {
  background-color: #2563eb;
  color: #fff;
}
.logout-btn {
  background-color: #e3342f;
  color: #fff;
}
.friends, .places {
  margin-top: 1.5rem;
}
.friends ul, .places ul {
  list-style: none;
  padding: 0;
}
.filters {
  margin-bottom: 1rem;
}
.filters button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #2563eb;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #2563eb;
}
.filters button.active,
.filters button:hover {
  background: #2563eb;
  color: #fff;
}
</style>
