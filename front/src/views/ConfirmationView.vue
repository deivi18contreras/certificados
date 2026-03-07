<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card style="max-width: 500px; width: 100%; border-radius: 12px" flat bordered class="text-center q-pa-xl">
      <q-card-section>
        <q-icon name="check_circle" size="100px" color="positive" />
        <div class="text-h4 text-weight-bold q-mt-lg">¡Registro Exitoso!</div>
        <p class="text-subtitle1 text-grey-7 q-mt-md">
          Su planilla ha sido recibida correctamente. El sistema iniciará la descarga y vinculación con Google Drive en unos momentos.
        </p>
      </q-card-section>

      <q-card-section>
        <q-btn 
          label="Volver al Inicio" 
          color="primary" 
          unelevated 
          class="q-px-xl q-py-md" 
          @click="router.push({ name: 'home' })" 
        />
        <div class="q-mt-md">
          <q-btn label="Registrar otra planilla" flat color="secondary" @click="router.push({ name: 'registrar-planilla' })" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
