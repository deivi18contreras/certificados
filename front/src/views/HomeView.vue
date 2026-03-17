<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push({ name: path })
}
</script>

<template>
<<<<<<< HEAD
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
=======
  <div class="home-view">
    <header class="hero-section">
      <div class="welcome-badge">CertiSENA v2.0</div>
      <h1>Sistema de Planillas PILA</h1>
      <p>Gestión automatizada de aportes para contratistas del Servicio Nacional de Aprendizaje</p>
    </header>

    <div class="cards-stack">
      <!-- Card Supervisor (Camino Superior) -->
      <div class="card interactive-card supervisor-card" @click="navigateTo('login')">
        <div class="card-body">
          <div class="icon-box purple">
            <i class="material-icons">admin_panel_settings</i>
          </div>
          <div class="content">
            <h3>Supervisores</h3>
            <p>Acceso administrativo para vinculación de Drive y auditoría de reportes.</p>
          </div>
          <i class="material-icons arrow">chevron_right</i>
        </div>
      </div>

      <div class="flow-divider">
        <div class="line"></div>
        <span>O</span>
        <div class="line"></div>
      </div>

      <!-- Card Contratista (Camino Inferior) -->
      <div class="card interactive-card contractor-card" @click="navigateTo('registrar-planilla')">
        <div class="card-body">
          <div class="icon-box green">
            <i class="material-icons">assignment</i>
          </div>
          <div class="content">
            <h3>Contratistas</h3>
            <p>Registro rápido de planilla mensual y descarga de certificados.</p>
          </div>
          <i class="material-icons arrow">chevron_right</i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 700px;
  margin: 0 auto;
  padding-top: 2rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-badge {
  display: inline-block;
  background: #E8F5E9;
  color: var(--sena-green);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-section h1 {
  font-weight: 800;
  color: var(--sena-purple);
}

.hero-section p {
  color: var(--sena-text-light);
  max-width: 500px;
  margin: 0 auto;
}

.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.interactive-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0,0,0,0.05);
}

.interactive-card:hover {
  transform: translateX(10px);
  border-color: var(--sena-purple-light);
  box-shadow: 0 8px 24px rgba(103, 80, 164, 0.1);
}

.interactive-card.contractor-card:hover {
  border-color: var(--sena-green);
  box-shadow: 0 8px 24px rgba(57, 169, 0, 0.1);
}

.card-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-box {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box.purple { background: #F3E5F5; color: var(--sena-purple); }
.icon-box.green { background: #E8F5E9; color: var(--sena-green); }

.icon-box i { font-size: 30px; }

.content h3 { margin: 0; color: var(--sena-text-dark); }
.content p { margin: 4px 0 0; font-size: 0.85rem; color: var(--sena-text-light); }

.arrow {
  margin-left: auto;
  color: #CAC4D0;
}

.flow-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.flow-divider .line {
  flex: 1;
  height: 1px;
  background: #E6E1E5;
}

.flow-divider span {
  font-size: 0.7rem;
  font-weight: 800;
  color: #CAC4D0;
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
}
</style>
