import type { Service, User } from './models'
import dayjs from 'dayjs'

export type AuthState = {
  isLoggedIn: boolean
  user: User
}

export type HomeState = {
  services: Service[]
}

export type ServiceState = {
  service?: Service
  selectedWeek: number
  weeks: number[]
}
