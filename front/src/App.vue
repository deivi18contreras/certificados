<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="layout-container">
    <nav class="main-navbar">
      <div class="navbar-brand">
        <!-- Icono de casita institucional -->
        <div class="house-icon">
          <i class="material-icons">home</i>
        </div>
        <div class="brand-text">
          <div class="brand-title">CertiSENA</div>
        </div>
      </div>
      
      <div class="nav-links">
        <router-link :to="{ name: 'home' }">Inicio</router-link>
        
        <template v-if="authStore.isAuthenticated">
          <div class="user-control">
            <button class="logout-btn" @click="handleLogout">
              <i class="material-icons">logout</i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </template>
      </div>
    </nav>

    <div class="top-accent-bar"></div>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="main-footer">
      <div>© 2026 SENA - Servicio Nacional de Aprendizaje</div>
    </footer>
  </div>
</template>

<style scoped>
.main-navbar {
  background: var(--sena-purple-gradient);
  color: white;
  height: 56px; /* Altura más moderada */
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  justify-content: space-between;
}

.house-icon {
  background: white;
  color: var(--sena-purple);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.house-icon i {
  font-size: 20px;
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin-left: 10px;
}

.top-accent-bar {
  height: 4px;
  background-color: var(--sena-green);
  width: 100%;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
