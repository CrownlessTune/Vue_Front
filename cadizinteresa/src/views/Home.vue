<template>
  <div class="home">
    <h1>CadizInteresa</h1>
    <p>Descubre y comparte los lugares más especiales de Cádiz.</p>
    <div class="buttons">
      <button @click="$router.push('/login')">Iniciar sesión</button>
      <button @click="$router.push('/register')">Registrarse</button>
    </div>
  </div>
</template>

<script setup>
// No se necesita JS por ahora
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  text-align: center;
}
.buttons {
  margin-top: 20px;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-weight: bold;
}
</style>
