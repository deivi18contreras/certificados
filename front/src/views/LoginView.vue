<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { loginSupervisor } from '../services/apiSupervisor'
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
  } finally {
    loading.value = false
  }
}

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
