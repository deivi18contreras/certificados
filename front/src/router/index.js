import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/contratistas',
      name: 'contratistas',
      component: () => import('../views/ContratistasView.vue'),
    },
    {
      path: '/supervisores',
      name: 'supervisores',
      component: () => import('../views/SupervisoresView.vue'),
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('../views/ReportesView.vue'),
    },
    {
      path: '/register-reporte',
      name: 'nuevo-reporte',
      component: () => import('../views/RegisterReporteView.vue'),
    },
    {
      path: '/certificates',
      name: 'certificates',
      component: () => import('../views/CertificatesView.vue'),
    },
  ],
})

export default router
