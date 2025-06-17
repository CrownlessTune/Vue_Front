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
  </div>
</template>

<script setup>
import '../css/Profile.css'
import { ref, watch } from 'vue'
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

const userPhoto = ref('')
const userName = ref('')
const friends = ref([])
const friendRequests = ref([])
const friendEmail = ref('')
const friendError = ref('')

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
