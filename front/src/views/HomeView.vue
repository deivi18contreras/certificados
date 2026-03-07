<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push({ name: path })
}
</script>

<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="column items-center q-gutter-y-xl">
      <div class="text-center">
        <h1 class="text-h3 text-weight-bold text-primary q-mb-sm">Sistema de Planillas SENA</h1>
        <p class="text-subtitle1 text-grey-8">Bienvenido al portal automatizado de gestión de planillas PILA</p>
      </div>

      <div class="row q-col-gutter-lg justify-center full-width" style="max-width: 900px">
        <!-- Card Supervisor -->
        <div class="col-12 col-sm-5">
          <q-card 
            class="my-card cursor-pointer hover-card q-pa-lg text-center full-height" 
            flat 
            bordered
            @click="navigateTo('login')"
          >
            <q-card-section>
              <q-icon name="admin_panel_settings" size="80px" color="primary" />
              <div class="text-h5 q-mt-md text-weight-bold">Supervisores</div>
              <div class="text-grey-7 q-mt-sm">Acceda para gestionar, filtrar y descargar reportes de contratistas.</div>
            </q-card-section>
            
            <q-card-actions align="center" class="q-mt-md">
              <q-btn label="Iniciar Sesión" color="primary" unelevated class="full-width" />
            </q-card-actions>
          </q-card>
        </div>

        <!-- Card Contratista -->
        <div class="col-12 col-sm-5">
          <q-card 
            class="my-card cursor-pointer hover-card q-pa-lg text-center full-height" 
            flat 
            bordered
            @click="navigateTo('registrar-planilla')"
          >
            <q-card-section>
              <q-icon name="assignment" size="80px" color="secondary" />
              <div class="text-h5 q-mt-md text-weight-bold">Contratistas</div>
              <div class="text-grey-7 q-mt-sm">Registre su planilla de aportes de forma rápida y sencilla.</div>
            </q-card-section>
            
            <q-card-actions align="center" class="q-mt-md">
              <q-btn label="Registrar Planilla" color="secondary" unelevated class="full-width" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
}
.hover-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>
