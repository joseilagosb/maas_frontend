import { createRouter, createWebHistory, type RouteLocationNormalizedGeneric } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/LoginView.vue'
import ServicesView from '../views/ServicesView.vue'
import ServiceView from '../views/ServiceView.vue'

export const routes = [
  {
    path: '/',
    redirect: '/services',
    name: 'home'
  },
  {
    path: '/services',
    name: 'services',
    component: ServicesView
  },
  {
    path: '/services/:id',
    name: 'service',
    component: ServiceView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export const checkIfNotLoggedIn = async (to: RouteLocationNormalizedGeneric) => {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn && to.name !== 'login') {
    return { name: 'login', query: { redirected: 'notloggedin' } }
  }
}

router.beforeEach(checkIfNotLoggedIn)

export default router
