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
        <input type="file" @change="handleFileChange" />
      </label>
      <button type="submit">Guardar</button>
      <p v-if="message">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useUserStore } from '@/context/user'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.js'

const userStore = useUserStore()

const userName = ref('')
const file = ref(null)
const message = ref('')

onMounted(() => {
  if (userStore.user) {
    userName.value = userStore.user.displayName || ''
  }
})

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const saveProfile = async () => {
  if (!userStore.user) return

  try {
    // Aquí podrías agregar la lógica para subir la foto a Storage y obtener la URL
    // Por ahora, solo actualizamos el displayName en Firestore y en el store

    const userDocRef = doc(db, 'users', userStore.user.uid)
    await updateDoc(userDocRef, { displayName: userName.value })

    // Actualizar estado global local
    userStore.setUser({
      ...userStore.user,
      displayName: userName.value,
      // photoURL: urlSubidaFoto, // cuando implementes subir foto
    })

    message.value = 'Perfil guardado correctamente'
  } catch (err) {
    message.value = 'Error guardando perfil: ' + err.message
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
</style>
