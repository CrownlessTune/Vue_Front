<template>
  <div class="edit-profile">
    <h2>Editar perfil</h2>
    <form @submit.prevent="saveProfile">
      <label>
        Nombre de usuario:
        <input v-model="userName" type="text" />
      </label>
      <label>
        Foto de perfil:
        <input type="file" accept="image/*" @change="handleFileChange" />
      </label>
      <button type="submit">Guardar</button>
      <p v-if="message">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/context/user'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.js'

// Estas claves nunca en frontend real, solo aquí por prototipo
const publicKey = 'public_01sDhg5IlkHf/GA3stxE7zaWi1A='
const privateKey = 'private_BZuJI8NW1IWBFIJzDAmNtJzz0Vc=' // ¡No hagas esto en real!

const userStore = useUserStore()
const userName = ref('')
const file = ref(null)
const message = ref('')

onMounted(() => {
  if (userStore.user) userName.value = userStore.user.displayName || ''
})

const handleFileChange = (e) => {
  const selected = e.target.files[0]
  if (selected && selected.size > 1024 * 1024) {
    message.value = 'La imagen no puede superar 1MB'
    file.value = null
    e.target.value = ''
    return
  }
  message.value = ''
  file.value = selected
}

// Función que "firma" la URL simulando backend
function getSignature() {
  // Firma dummy, en backend usarías un SDK o HMAC real
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = btoa(privateKey + timestamp) // solo para simular
  return { timestamp, signature }
}

// Subida + firma simulada totalmente frontend
async function uploadToImageKit(file) {
  const url = 'https://upload.imagekit.io/api/v1/files/upload'
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', file.name)
  formData.append('folder', '/user-profiles/')
  formData.append('publicKey', publicKey)

  const res = await fetch(url, { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Error subiendo a ImageKit')

  const data = await res.json()

  // Simulamos firma con función interna
  const { timestamp, signature } = getSignature()

  // Construimos URL privado simulado
  const privateUrl = `${data.url}?tr=pr-true&ik-t=${timestamp}&ik-s=${signature}`

  return privateUrl
}

const saveProfile = async () => {
  if (!userStore.user) return
  try {
    let photoURL = userStore.user.photoURL || null
    if (file.value) photoURL = await uploadToImageKit(file.value)

    const userDocRef = doc(db, 'users', userStore.user.uid)
    await updateDoc(userDocRef, { displayName: userName.value, photoURL })

    userStore.setUser({ ...userStore.user, displayName: userName.value, photoURL })

    message.value = 'Perfil guardado correctamente'
    file.value = null
  } catch (e) {
    message.value = 'Error guardando perfil: ' + e.message
  }
}
</script>

<style scoped>
.edit-profile {
  max-width: 600px;
  margin: 100px auto;
}
label {
  display: block;
  margin-bottom: 1rem;
}
button {
  margin-top: 1rem;
}
p {
  margin-top: 0.5rem;
  color: red;
}
</style>
