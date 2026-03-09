<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
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
}
</style>
