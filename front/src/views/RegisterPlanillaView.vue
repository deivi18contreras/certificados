<script setup>
// Lógica eliminada
</script>

<template>
  <q-page class="q-pa-md bg-grey-2 flex flex-center">
    <q-card style="width: 100%; max-width: 900px; border-radius: 20px" flat bordered>
      <q-card-section class="bg-primary text-white q-pa-lg text-center">
        <div class="text-h4 text-weight-bold">SENA - Registro de Planillas</div>
        <div class="text-subtitle1">Sistema de Automatización de Certificados</div>
      </q-card-section>

      <q-stepper color="primary" animated header-nav>
        
        <!-- PASO 1: Identificación y Registro del Contratista -->
        <q-step :name="1" title="Contratista" icon="person">
          <div class="text-h6 q-mb-md">Información del Contratista</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <q-select :options="['CC', 'CE', 'PEP', 'PPT']" label="Tipo de Documento" outlined dense />
            </div>
            <div class="col-12 col-sm-8">
              <q-input label="Número de Documento" outlined dense required>
                <template v-slot:append>
                  <q-btn round dense flat icon="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input label="Nombres" outlined dense required />
            </div>
            <div class="col-12 col-sm-6">
              <q-input label="Apellidos" outlined dense required />
            </div>
            <div class="col-12 col-sm-6">
              <q-select :options="['Sanitas', 'Nueva EPS', 'Sura', 'Salud Total', 'Compensar', 'Coosalud']" label="EPS" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input type="date" label="Fecha Expedición Documento" stack-label outlined dense required />
            </div>
          </div>
          <div class="row justify-end q-mt-lg">
            <q-btn color="primary" label="Continuar a Planilla" unelevated />
          </div>
        </q-step>
      </q-stepper>
    </q-card>
  </q-page>
</template>
