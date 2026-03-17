<script setup>
<<<<<<< HEAD
import { useAuthStore } from './stores/auth'
=======
import { useAuthStore } from '@/stores/auth'
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'home' })
}
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
        <router-link :to="{ name: 'home' }" class="nav-item">
          <i class="material-icons">home</i>
          <span>Inicio</span>
        </router-link>
        
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

.user-control {
  display: flex;
  align-items: center;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.logout-btn:hover {
  background: #B42318;
  border-color: #B42318;
  box-shadow: 0 2px 8px rgba(180, 35, 24, 0.3);
}

.top-accent-bar {
  height: 4px;
  background-color: var(--sena-green);
  width: 100%;
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
}
</style>
