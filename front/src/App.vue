<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <img alt="SENA Logo" class="logo-img" src="@/assets/logo.svg" width="30" height="30" />
        <span class="logo-text">CertiSENA</span>
      </div>

      <nav class="nav-links">
        <RouterLink to="/" class="nav-item">Inicio</RouterLink>
        <RouterLink to="/reportes" class="nav-item">Reportes</RouterLink>
        <RouterLink to="/register-reporte" class="nav-item">Nuevo Reporte</RouterLink>
        <RouterLink to="/contratistas" class="nav-item">Contratistas</RouterLink>
        <RouterLink to="/supervisores" class="nav-item">Supervisores</RouterLink>
        <RouterLink to="/certificates" class="nav-item">Certificados</RouterLink>
      </nav>
    </div>
  </header>

  <main class="app-main">
    <RouterView />
  </main>
</template>

<style>
.app-header {
  background-color: white;
  border-bottom: 1px solid #dadce0;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,0.1), 0 2px 6px 2px rgba(60,64,67,0.05);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 500;
  color: #3c4043;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.6rem 1rem;
  border-radius: 4px;
  color: #5f6368;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #f1f3f4;
  color: #202124;
}

.router-link-active {
  color: var(--primary-color);
  background-color: rgba(26,115,232,0.1);
}

.app-main {
  min-height: calc(100vh - 64px);
}

@media (max-width: 992px) {
  .header-container {
    padding: 0 1rem;
    flex-direction: column;
    height: auto;
    padding-bottom: 0.5rem;
  }
  .app-header {
    height: auto;
  }
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
