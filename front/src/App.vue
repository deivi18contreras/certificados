<script setup>
// Lógica eliminada
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
          <q-btn flat label="Inicio" />
          
          <q-btn flat label="Registrar Planilla" />
          
          <q-btn flat label="Dashboard" />
          <q-btn flat label="Permisos Drive" />
          <q-separator vertical inset dark class="q-mx-sm" />
          <div class="gt-xs text-weight-medium">Usuario</div>
          <q-btn round flat icon="logout">
            <q-tooltip>Cerrar Sesión</q-tooltip>
          </q-btn>
          
          <q-btn flat label="Supervisores" icon="login" />
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
