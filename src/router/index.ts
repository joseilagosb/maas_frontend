import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedGeneric,
  type RouteRecordRaw
} from 'vue-router'

import { useAuthStore } from '@/stores/auth'

import { getWeek } from '@/services/date'

import LoginView from '@/views/LoginView.vue'
import ServicesView from '../views/ServicesView.vue'
import ShowServiceWeekView from '../views/ShowServiceWeekView.vue'
import EditServiceWeekView from '../views/EditServiceWeekView.vue'

export const routes: Array<RouteRecordRaw> = [
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
    redirect: (to) => ({
      name: 'show-service-week',
      params: { id: to.params.id, week: getWeek() }
    }),
    children: [
      {
        path: 'weeks',
        name: 'service-weeks',
        redirect: (to) => ({
          name: 'show-service-week',
          params: { id: to.params.id, week: getWeek() }
        })
      },
      {
        path: 'weeks/:week',
        name: 'show-service-week',
        component: ShowServiceWeekView
      },
      {
        path: 'weeks/:week/edit',
        name: 'edit-service-week',
        component: EditServiceWeekView,
        beforeEnter: (from: RouteLocationNormalizedGeneric) =>
          onlyAllowEditingCurrentOrFutureWeeks(from)
      }
    ]
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

export const onlyAllowEditingCurrentOrFutureWeeks = async (
  from: RouteLocationNormalizedGeneric
) => {
  if (+from.params.week < getWeek()) {
    return { name: 'show-service-week', params: from.params }
  }
}

export const checkIfNotLoggedIn = async (to: RouteLocationNormalizedGeneric) => {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn && to.name !== 'login') {
    return { name: 'login', query: { redirected: 'notloggedin' } }
  }
}

router.beforeEach(checkIfNotLoggedIn)

export default router
