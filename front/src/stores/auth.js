<<<<<<< HEAD
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('auth_data'))?.user || null);
  const token = ref(JSON.parse(localStorage.getItem('auth_data'))?.token || null);

  const isAuthenticated = computed(() => !!token.value);

  function login(userData, userToken) {
    user.value = userData;
    token.value = userToken;
    localStorage.setItem('auth_data', JSON.stringify({ user: userData, token: userToken }));
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_data');
  }

  return { user, token, isAuthenticated, login, logout };
});
=======
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
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
