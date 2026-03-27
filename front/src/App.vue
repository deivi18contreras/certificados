<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const showDropdown = ref(false)

const handleLogout = () => {
  showDropdown.value = false
  authStore.logout()
  router.push({ name: 'home' })
}

const toggleDropdown = (e) => {
  e.stopPropagation()
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))
</script>

<template>
  <div class="layout-container">
    <nav class="main-navbar">
      <div class="navbar-brand">
        <!-- Icono de marca SENA -->
        <div class="sena-icon">
          <i class="material-icons">account_balance</i>
        </div>
        <div class="brand-divider"></div>
        <div class="brand-text">
          <div class="brand-title">CertiSENA</div>
        </div>
      </div>
      
      <div class="nav-links">
        <router-link v-if="['login', 'dashboard'].includes($route.name)" :to="{ name: 'home' }" class="nav-item">
          <i class="material-icons">home</i>
          <span>Inicio</span>
        </router-link>
        
        <template v-if="authStore.isAuthenticated">
          <div class="user-profile-section">
            <div class="user-info">
              <span class="user-name">{{ authStore.user?.nombre }}</span>
              <span class="user-email">{{ authStore.user?.email }}</span>
            </div>
            <div class="avatar-container" @click="toggleDropdown">
              <div class="avatar">
                {{ authStore.user?.nombre?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div v-show="showDropdown" class="dropdown-menu" @click.stop>
                <button class="logout-menu-btn" @click="handleLogout">
                  <i class="material-icons">logout</i>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
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
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sena-icon {
  background: white;
  color: var(--sena-green);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.brand-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.3);
}

.brand-title {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-item {
  text-decoration: none;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.25s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.12);
}

.user-profile-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 700;
  font-size: 0.85rem;
  line-height: 1.2;
}

.user-email {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.2;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--sena-green);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}

.avatar:hover {
  transform: scale(1.05);
}

.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px;
  min-width: 180px;
  z-index: 1000;
}

.logout-menu-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: white;
  border: none;
  color: #B42318;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.95rem;
}

.logout-menu-btn:hover {
  background: #FEE4E2;
}

.top-accent-bar {
  height: 4px;
  background-color: var(--sena-green);
  width: 100%;
}
</style>
