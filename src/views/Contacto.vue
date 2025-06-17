<script setup>
import { ref, computed } from 'vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  acceptedTerms: false
})

const errors = ref({})

function validate() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'El nombre es obligatorio.'
  if (!form.value.email.trim()) errors.value.email = 'El email es obligatorio.'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Email no válido.'
  if (!form.value.phone.trim()) errors.value.phone = 'El teléfono es obligatorio.'
  else if (!/^\+?[\d\s\-]{7,15}$/.test(form.value.phone)) errors.value.phone = 'Teléfono no válido.'
  if (!form.value.subject) errors.value.subject = 'Debes seleccionar un asunto.'
  if (!form.value.message.trim()) errors.value.message = 'El mensaje no puede estar vacío.'
  if (!form.value.acceptedTerms) errors.value.acceptedTerms = 'Debes aceptar los términos.'
  
  return Object.keys(errors.value).length === 0
}

const canSubmit = computed(() => {
  return Object.keys(errors.value).length === 0 && form.value.acceptedTerms
})

function onSubmit() {
  if (validate()) {
    alert('Formulario enviado con éxito. Gracias, ' + form.value.name + '!')
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      acceptedTerms: false
    }
    errors.value = {}
  }
}
</script>

<template>
  <main class="contact-container">
    <h1>Contacto</h1>
    <form @submit.prevent="onSubmit" novalidate>
      <label for="name">Nombre completo</label>
      <input id="name" v-model="form.name" type="text" placeholder="Tu nombre" />
      <p v-if="errors.name" class="error-msg">{{ errors.name }}</p>

      <label for="email">Correo electrónico</label>
      <input id="email" v-model="form.email" type="email" placeholder="ejemplo@correo.com" />
      <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>

      <label for="phone">Teléfono</label>
      <input id="phone" v-model="form.phone" type="tel" placeholder="+34 600 123 456" />
      <p v-if="errors.phone" class="error-msg">{{ errors.phone }}</p>

      <label for="subject">Asunto</label>
      <select id="subject" v-model="form.subject">
        <option disabled value="">-- Selecciona un asunto --</option>
        <option>Consulta general</option>
        <option>Soporte técnico</option>
        <option>Sugerencias</option>
        <option>Otros</option>
      </select>
      <p v-if="errors.subject" class="error-msg">{{ errors.subject }}</p>

      <label for="message">Mensaje</label>
      <textarea id="message" v-model="form.message" rows="5" placeholder="Escribe tu mensaje aquí..."></textarea>
      <p v-if="errors.message" class="error-msg">{{ errors.message }}</p>

      <label class="terms">
        <input type="checkbox" v-model="form.acceptedTerms" />
        Acepto los términos y condiciones
      </label>
      <p v-if="errors.acceptedTerms" class="error-msg">{{ errors.acceptedTerms }}</p>

      <button type="submit" :disabled="!canSubmit">Enviar</button>
    </form>
  </main>
</template>

<style scoped>
.contact-container {
  max-width: 600px;
  margin: 3rem auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e1e1e;
  padding: 0 1rem;
}

h1 {
  color: #fcbf49;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 600;
  color: #0077b6;
  margin-bottom: 0.25rem;
}

input[type="text"],
input[type="email"],
input[type="tel"],
select,
textarea {
  padding: 0.5rem 0.75rem;
  border: 2px solid #fcbf49;
  border-radius: 6px;
  font-size: 1rem;
  outline-offset: 2px;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
select:focus,
textarea:focus {
  border-color: #0077b6;
}

textarea {
  resize: vertical;
}

.terms {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1e1e1e;
}

.error-msg {
  color: #d90429;
  font-size: 0.875rem;
  margin-top: -0.75rem;
  margin-bottom: 0.5rem;
}

button {
  background-color: #fcbf49;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 24px;
  cursor: pointer;
  color: #1e1e1e;
  transition: background-color 0.3s ease;
  user-select: none;
}

button:disabled {
  background-color: #f6d28d;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #e6ae3c;
}
</style>
