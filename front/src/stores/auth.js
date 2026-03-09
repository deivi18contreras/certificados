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
