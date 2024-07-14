import type { CurrentAvailability, Service, ServiceWeek, User } from './models'

export type AuthState = {
  isLoggedIn: boolean
  user: User
}

export type HomeState = {
  services: Service[]
}

export type ServiceState = {
  service?: Service
  users: User[]
  weeks: number[]
  selectedWeek: number
  selectedWeekData?: ServiceWeek
}

export type ServiceAvailabilityState = {
  currentAvailability?: CurrentAvailability
  changedAvailability: boolean
}
