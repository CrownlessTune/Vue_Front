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

    <div class="friends">
      <h3>Amigos</h3>
      <ul>
        <li v-for="friend in friends" :key="friend.uid">
          {{ friend.name || friend.uid }}
          <button @click="removeFriend(friend.uid)">Eliminar</button>
        </li>
      </ul>

      <h3>Peticiones recibidas</h3>
      <ul>
        <li v-for="request in friendRequests" :key="request.uid">
          {{ request.name || request.uid }} quiere ser tu amigo
          <button @click="acceptRequest(request.uid)">Aceptar</button>
          <button @click="rejectRequest(request.uid)">Rechazar</button>
        </li>
      </ul>

      <h3>Enviar petición</h3>
      <input v-model="friendEmail" placeholder="Correo del usuario" />
      <button @click="sendFriendRequest">Enviar</button>
      <p v-if="friendError" class="error">{{ friendError }}</p>
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
import { db } from '@/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'

const userStore = useUserStore()
const router = useRouter()

const filter = ref('all')
const userPhoto = ref('')
const userName = ref('')
const friends = ref([])
const friendRequests = ref([])
const places = ref([])
const friendEmail = ref('')
const friendError = ref('')

const filteredPlaces = computed(() => {
  if (filter.value === 'mine') return places.value.filter(p => p.owner === 'mine')
  if (filter.value === 'saved') return places.value.filter(p => p.owner === 'saved')
  return places.value
})

const goToEdit = () => {
  router.push('/app/edit')
}

const logout = () => {
  userStore.logout()
  sessionStorage.removeItem('user')
  router.push('/login')
}

const loadUserData = () => {
  if (!userStore.user || !userStore.user.uid) {
    router.push('/login')
    return
  }
  const u = userStore.user
  userPhoto.value = u.photoURL || 'https://via.placeholder.com/100'
  userName.value = u.displayName || u.email || 'Usuario'
  friends.value = u.friends || []
  friendRequests.value = u.friendRequests || []
  places.value = u.places || []
}

const sendFriendRequest = async () => {
  friendError.value = ''
  try {
    const q = query(collection(db, 'users'), where('email', '==', friendEmail.value.trim()))
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      friendError.value = 'Usuario no encontrado'
      return
    }
    const targetDoc = snapshot.docs[0]
    const targetRef = targetDoc.ref

    await updateDoc(targetRef, {
      friendRequests: arrayUnion({
        uid: userStore.user.uid,
        name: userStore.user.displayName || userStore.user.email
      })
    })
    friendEmail.value = ''
  } catch {
    friendError.value = 'Error al enviar solicitud'
  }
}

const acceptRequest = async (uid) => {
  const currentRef = doc(db, 'users', userStore.user.uid)
  const fromRef = doc(db, 'users', uid)

  const requestObj = friendRequests.value.find(r => r.uid === uid)
  if (!requestObj) return

  await updateDoc(currentRef, {
    friends: arrayUnion({ uid }),
    friendRequests: arrayRemove(requestObj)
  })

  await updateDoc(fromRef, {
    friends: arrayUnion({ uid: userStore.user.uid })
  })

  const snap = await getDoc(currentRef)
  userStore.setUser(snap.data())
}

const rejectRequest = async (uid) => {
  const currentRef = doc(db, 'users', userStore.user.uid)
  await updateDoc(currentRef, {
    friendRequests: arrayRemove({ uid })
  })
  const snap = await getDoc(currentRef)
  userStore.setUser(snap.data())
}

const removeFriend = async (uid) => {
  const currentRef = doc(db, 'users', userStore.user.uid)
  const otherRef = doc(db, 'users', uid)
  await updateDoc(currentRef, {
    friends: arrayRemove({ uid })
  })
  await updateDoc(otherRef, {
    friends: arrayRemove({ uid: userStore.user.uid })
  })
  const snap = await getDoc(currentRef)
  userStore.setUser(snap.data())
}

loadUserData()
watch(() => userStore.user, loadUserData)
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.profile-pic {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #2563eb;
}

.header-info h2 {
  margin: 0;
  font-size: 1.5rem;
}

.header-actions {
  margin-top: 0.5rem;
}

.header-actions button {
  margin-right: 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn {
  background-color: #2563eb;
  color: white;
}

.logout-btn {
  background-color: #ef4444;
  color: white;
}

.edit-btn:hover {
  background-color: #1d4ed8;
}

.logout-btn:hover {
  background-color: #dc2626;
}

.friends,
.places {
  margin-top: 2rem;
}

.friends h3,
.places h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #111827;
}

.friends ul,
.places ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friends li,
.places li {
  background: #f3f4f6;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.friends li button {
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.friends li button:hover {
  background-color: #dc2626;
}

.friends input {
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  width: calc(100% - 110px);
  margin-right: 0.5rem;
}

.friends button {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.friends button:hover {
  background-color: #1d4ed8;
}

.error {
  color: #dc2626;
  margin-top: 0.5rem;
  font-weight: bold;
}

.filters {
  margin-bottom: 1rem;
}

.filters button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #2563eb;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #2563eb;
  font-weight: bold;
  transition: background 0.2s, color 0.2s;
}

.filters button.active,
.filters button:hover {
  background: #2563eb;
  color: #ffffff;
}

.places li {
  padding: 0.8rem 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.places strong {
  color: #111827;
}
</style>
