<template>
  <div class="profile">
    <div class="header">
      <img :src="userPhoto" alt="Foto de perfil" class="profile-pic" />
      <h2>{{ userName }}</h2>
      <button @click="goToEdit">Editar perfil</button>
    </div>

    <div class="friends">
      <h3>Amigos</h3>
      <ul>
        <li v-for="friend in friends" :key="friend.id">{{ friend.name }}</li>
      </ul>
    </div>

    <div class="places">
      <h3>Sitios de interés</h3>
      <div class="filters">
        <button @click="filter = 'all'">Todos</button>
        <button @click="filter = 'mine'">Mis sitios</button>
        <button @click="filter = 'saved'">Guardados</button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Mock temporal — estos se obtendrán de Firestore
const userPhoto = ref('https://via.placeholder.com/100')
const userName = ref('PurpleQueen')
const friends = ref([{ id: 1, name: 'María' }, { id: 2, name: 'José' }])
const places = ref([
  { id: 1, title: 'Playa La Caleta', description: 'Hermosa playa', owner: 'yo' },
  { id: 2, title: 'Castillo de San Sebastián', description: 'Castillo histórico', owner: 'otro' }
])
const filter = ref('all')

const filteredPlaces = computed(() => {
  if (filter.value === 'mine') return places.value.filter(p => p.owner === 'yo')
  if (filter.value === 'saved') return places.value.filter(p => p.owner !== 'yo')
  return places.value
})

const router = useRouter()
const goToEdit = () => {
  router.push('/edit-profile')
}
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.profile-pic {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.filters {
  margin-bottom: 1rem;
}
.filters button {
  margin-right: 0.5rem;
}
</style>
