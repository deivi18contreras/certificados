<script setup>
// Lógica eliminada
</script>

<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card style="width: 400px; border-radius: 12px" flat bordered>
      <q-card-section class="text-center q-pt-xl">
        <q-icon name="lock" size="60px" color="primary" />
        <div class="text-h5 text-weight-bold q-mt-md">Acceso Supervisor</div>
      </q-card-section>

      <q-card-section class="q-px-xl q-pb-xl">
        <q-form class="q-gutter-md">
          <q-input 
            label="Correo electrónico" 
            type="email" 
            outlined 
            dense 
          />
          <q-input 
            label="Contraseña" 
            type="password" 
            outlined 
            dense 
          />
          <q-btn 
            label="Entrar" 
            color="primary" 
            class="full-width q-mt-md" 
            unelevated
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
