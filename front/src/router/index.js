import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< HEAD
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'
=======
import { useAuthStore } from '@/stores/auth'
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
<<<<<<< HEAD
      component: HomeView
=======
      component: () => import('../views/HomeView.vue'),
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
    },
    {
      path: '/login',
      name: 'login',
<<<<<<< HEAD
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/registrar-planilla',
      name: 'registrar-planilla',
      component: () => import('../views/RegisterPlanillaView.vue')
=======
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/permisos',
      name: 'permisos',
      component: () => import('../views/DriveAuthView.vue'),
      meta: { requiresAuth: true }
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
<<<<<<< HEAD
    }
  ]
})

=======
    },
    {
      path: '/registrar-planilla',
      name: 'registrar-planilla',
      component: () => import('../views/RegisterPlanillaView.vue'),
    },
    {
      path: '/confirmacion',
      name: 'confirmacion',
      component: () => import('../views/ConfirmationView.vue'),
    }
  ],
})

// Navigation Guard para proteger rutas de supervisor
>>>>>>> 64a23765abc45485dc75a2b30e320819c64f389c
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
