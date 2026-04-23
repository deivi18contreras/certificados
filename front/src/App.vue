<script setup>
<<<<<<< HEAD
import { useAuthStore } from './stores/auth'
=======
import { useAuthStore } from '@/stores/auth'
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
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
<<<<<<< HEAD
  <q-layout view="hHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-lg" style="height: 64px">
        <q-btn flat round dense icon="menu" class="q-mr-sm sm-only" />
        
        <q-avatar size="40px">
          <img src="@/assets/logo.svg" />
        </q-avatar>

        <q-toolbar-title class="text-weight-bold">
          CertiSENA <span class="text-subtitle2 text-weight-light q-ml-sm gt-xs">Automatización de Planillas</span>
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn flat label="Inicio" :to="{ name: 'home' }" />
          
          <q-btn flat label="Registrar Planilla" :to="{ name: 'registrar-planilla' }" />
          
          <template v-if="authStore.isAuthenticated">
            <q-btn flat label="Dashboard" :to="{ name: 'dashboard' }" />
            <q-separator vertical inset dark class="q-mx-sm" />
            <div class="gt-xs text-weight-medium">{{ authStore.user?.nombre }}</div>
            <q-btn round flat icon="logout" @click="handleLogout">
              <q-tooltip>Cerrar Sesión</q-tooltip>
            </q-btn>
          </template>
          
          <q-btn v-else flat label="Supervisores" :to="{ name: 'login' }" icon="login" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-white text-grey-8 q-pa-md text-center border-top">
      <div>© 2026 SENA - Sistema de Automatización de Planillas</div>
    </q-footer>
  </q-layout>
</template>

<style>
.border-top {
  border-top: 1px solid #e0e0e0;
=======
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
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
}
</style>
