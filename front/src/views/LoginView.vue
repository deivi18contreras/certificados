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
import { onMounted } from 'vue'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)

onMounted(() => {
  const savedEmail = localStorage.getItem('certisena_email')
  const savedPass = localStorage.getItem('certisena_password')
  if (savedEmail && savedPass) {
    email.value = savedEmail
    password.value = savedPass
    rememberMe.value = true
  }
})

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
      if (rememberMe.value) {
        localStorage.setItem('certisena_email', email.value)
        localStorage.setItem('certisena_password', password.value)
      } else {
        localStorage.removeItem('certisena_email')
        localStorage.removeItem('certisena_password')
      }

      authStore.login(response.data, response.token)
      $q.notify({ type: 'positive', message: 'Bienvenido ' + response.data.nombre })
      if (response.data.hasDriveAccess) {
        router.push({ name: 'dashboard' })
      } else {
        router.push({ name: 'permisos' })
      }
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
          <div class="password-wrapper">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="form-input" 
              placeholder="••••••••"
              required
            />
            <button type="button" class="btn-toggle-pass" @click="showPassword = !showPassword">
              <i class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</i>
            </button>
          </div>
        </div>

        <div class="form-group remember-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span>Recordar mis credenciales</span>
          </label>
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

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper .form-input {
  width: 100%;
  padding-right: 40px;
}

.btn-toggle-pass {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.btn-toggle-pass:hover {
  color: var(--sena-purple);
}

.remember-group {
  margin-top: -5px;
  margin-bottom: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #555;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--sena-purple);
  cursor: pointer;
}
</style>
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
