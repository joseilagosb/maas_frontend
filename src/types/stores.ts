import type { Service, ServiceWeek, User } from './models'

export type AuthState = {
  isLoggedIn: boolean
  user: User
}

export type HomeState = {
  services: Service[]
}

export type ServiceState = {
  service?: Service
  weeks: number[]
  selectedWeek: number
  selectedWeekData?: ServiceWeek
}
