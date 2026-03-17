<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
<<<<<<< HEAD
import { useAuthStore } from '../stores/auth'
import { loginSupervisor } from '../services/apiSupervisor'
=======
import { useAuthStore } from '@/stores/auth'
import { loginSupervisor } from '@/services/apiSupervisor'
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    $q.notify({ type: 'negative', message: 'Por favor complete todos los campos' })
    return
  }

  loading.value = true
  try {
    const response = await loginSupervisor({ email: email.value, password: password.value })
<<<<<<< HEAD
    
    if (response.token) {
      authStore.login(response.supervisor, response.token)
      $q.notify({ 
        type: 'positive', 
        message: `Bienvenido, ${response.supervisor.nombre}`,
        position: 'top',
        timeout: 2000
      })
      router.push({ name: 'dashboard' })
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Credenciales inválidas o error de conexión'
    $q.notify({ 
      type: 'negative', 
      message: errorMsg,
      position: 'top'
    })
=======
    if (response.success) {
      authStore.login(response.data, response.token)
      $q.notify({ type: 'positive', message: 'Bienvenido ' + response.data.nombre })
      router.push({ name: 'permisos' })
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Credenciales inválidas o error de conexión' })
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
  } finally {
    loading.value = false
  }
}
<<<<<<< HEAD

</script>

<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card style="width: 400px; border-radius: 12px" flat bordered>
      <q-card-section class="text-center q-pt-xl">
        <q-icon name="lock" size="60px" color="primary" />
        <div class="text-h5 text-weight-bold q-mt-md">Acceso Supervisor</div>
      </q-card-section>

      <q-card-section class="q-px-xl q-pb-xl">
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input 
            v-model="email" 
            label="Correo electrónico" 
            type="email" 
            outlined 
            dense 
            :rules="[val => !!val || 'Campo obligatorio']"
          />
          <q-input 
            v-model="password" 
            label="Contraseña" 
            type="password" 
            outlined 
            dense 
            :rules="[val => !!val || 'Campo obligatorio']"
          />
          <q-btn 
            label="Entrar" 
            color="primary" 
            class="full-width q-mt-md" 
            type="submit" 
            :loading="loading"
            unelevated
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
=======
</script>

<template>
  <div class="login-view">
    <div class="card login-card">
      <div class="text-center q-pb-lg">
        <div class="icon-circle primary q-mx-auto">
          <i class="material-icons">lock</i>
        </div>
        <h2 class="text-h5 text-weight-bold">Acceso Supervisor</h2>
      </div>

      <form @submit.prevent="handleLogin" class="q-gutter-y-md">
        <div class="form-group">
          <label>Correo electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            class="form-input" 
            placeholder="ejemplo@sena.edu.co"
            required
          />
        </div>
        
        <div class="form-group">
          <label>Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-input" 
            placeholder="••••••••"
            required
          />
        </div>

        <button 
          type="submit" 
          class="btn btn-primary full-width" 
          :disabled="loading"
        >
          <span v-if="loading">Validando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 4rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 3rem;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sena-gray-light);
  margin-bottom: 1.5rem;
}

.icon-circle.primary i {
  color: var(--sena-green);
  font-size: 40px;
}

.q-mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.q-pb-lg {
  padding-bottom: 2rem;
}

.text-center {
  text-align: center;
}

.full-width {
  width: 100%;
}
</style>
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
