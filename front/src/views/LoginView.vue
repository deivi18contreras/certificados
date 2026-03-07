<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginSupervisor, createTestSupervisor } from '@/services/apiSupervisor'
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
    if (response.success) {
      authStore.login(response.data, response.token)
      $q.notify({ type: 'positive', message: 'Bienvenido ' + response.data.nombre })
      router.push({ name: 'permisos' })
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Credenciales inválidas o error de conexión' })
  } finally {
    loading.value = false
  }
}

const handleTestLogin = async () => {
  loading.value = true
  try {
    const createRes = await createTestSupervisor()
    if (createRes.success) {
      // Usar las credenciales recién creadas
      const { email: testEmail } = createRes.data
      const response = await loginSupervisor({ email: testEmail, password: 'password123' })
      
      if (response.success) {
        authStore.login(response.data, response.token)
        $q.notify({ 
          type: 'positive', 
          message: `Supervisor de prueba: ${testEmail}`,
          caption: 'Logueado correctamente'
        })
        router.push({ name: 'permisos' })
      }
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al crear/loguear supervisor de prueba' })
  } finally {
    loading.value = false
  }
}
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

      <div class="text-center q-mt-xl">
        <div class="separator-text">O</div>
        <button 
          class="btn btn-outline full-width q-mt-md" 
          @click="handleTestLogin"
          :disabled="loading"
        >
          Entrar como supervisor de prueba
        </button>
      </div>
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

.q-mt-xl {
  margin-top: 2.5rem;
}

.q-mt-md {
  margin-top: 1rem;
}

.text-center {
  text-align: center;
}

.full-width {
  width: 100%;
}

.separator-text {
  display: flex;
  align-items: center;
  color: #888;
  font-size: 0.85rem;
  font-weight: 600;
}

.separator-text::before,
.separator-text::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: var(--sena-gray-medium);
  margin: 0 1rem;
}
</style>
