import { createRouter, createWebHistory, type RouteLocationNormalizedGeneric } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
