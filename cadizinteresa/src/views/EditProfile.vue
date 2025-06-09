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
import { ref } from 'vue'
// Aquí iría la lógica con Firebase más adelante
const userName = ref('PurpleQueen')
const file = ref(null)
const message = ref('')

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const saveProfile = () => {
  // Aquí irá la lógica real de guardado
  message.value = 'Perfil guardado (simulado)'
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
