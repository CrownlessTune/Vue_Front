<template>
  <nav class="public-nav">
    <router-link to="/" class="nav-link">Inicio</router-link>
    <router-link to="/login" class="nav-link">Iniciar sesión</router-link>
    <router-link to="/register" class="nav-link">Registrarse</router-link>
  </nav>
</template>

<style scoped>
.public-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  align-items: center;
  background-color: #f5f3f0;
  height: 3rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  border-bottom: 2px solid #fcbf49; 
}

.nav-link {
  color: #0077b6; 
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.3rem 0.5rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #90e0ef;
  text-decoration: underline;
}

body {
  padding-top: 3rem;
}
</style>
