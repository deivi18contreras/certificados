import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const rol = ref(null) // 'supervisor' o 'contratista' (aunque contratista no loguea segun el flujo)

  const isAuthenticated = computed(() => !!token.value)

  const login = (userData, userToken) => {
    token.value = userToken
    user.value = userData
    rol.value = 'supervisor'
  }

  const logout = () => {
    token.value = null
    user.value = null
    rol.value = null
  }

  return {
    token,
    user,
    rol,
    isAuthenticated,
    login,
    logout
  }
}, {
  persist: true
})
