<template>
  <nav class="public-nav">
    <router-link to="/" class="nav-link">Inicio</router-link>
    <router-link to="/login" class="nav-link">Iniciar sesión</router-link>
    <router-link to="/register" class="nav-link">Registrarse</router-link>
  </nav>
</template>

<style scoped>
.public-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-link {
  text-decoration: none;
  color: #2563eb;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}
</style>
