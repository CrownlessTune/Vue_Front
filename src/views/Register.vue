<template>
  <div class="auth">
    <h2>Registro</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirmar contraseña" required />
      <button type="submit">Registrarse</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { useUserStore } from '@/context/user'
import { doc, setDoc } from 'firebase/firestore'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const userStore = useUserStore()

const handleRegister = async () => {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Crear doc usuario en Firestore con datos iniciales
    const userDocRef = doc(db, 'users', user.uid)
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.email,
      photoURL: null,
      friends: [],
      places: []
    })

    // Actualizar estado global con datos completos
    userStore.setUser({
      uid: user.uid,
      email: user.email,
      displayName: user.email,
      photoURL: null,
      friends: [],
      places: []
    })

    router.push('/app/new')
  } catch (err) {
    error.value = 'Error al registrar: ' + err.message
  }
}
</script>

<style scoped>
.auth {
  max-width: 400px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
}
input, button {
  margin-top: 10px;
  padding: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
