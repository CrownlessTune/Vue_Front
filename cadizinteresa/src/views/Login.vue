<template>
  <div class="auth">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useUserStore } from '@/context/user'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const userStore = useUserStore()

const handleLogin = async () => {
  error.value = ''
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Actualizar estado global
    userStore.setUser({
      uid: user.uid,
      email: user.email,
    })

    router.push('/')
  } catch (err) {
    error.value = 'Error al iniciar sesión: ' + err.message
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
