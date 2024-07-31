import type { Availability, Service, ServiceWeek, User } from './models'

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
  activeWeeks: number[]
  selectedWeek: number
  selectedWeekData?: ServiceWeek
}

export type ServiceAvailabilityState = {
  availabilityData?: Availability
  changedAvailability: boolean
}
