<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginSupervisor } from '@/services/apiSupervisor'
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
