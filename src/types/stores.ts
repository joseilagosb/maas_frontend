import type { Availability, Service, ServiceWeek, User, UserAssignedHours } from './models'

export type AuthState = {
  isLoggedIn: boolean
  user: User
}

export type HomeState = {
  services: Service[]
}

export type ServiceState = {
  service?: Service
  userAssignedHours: UserAssignedHours[]
  activeWeeks: number[]
  selectedWeek: number
  selectedServiceId: number
  selectedWeekData?: ServiceWeek
}

export type ServiceAvailabilityState = {
  availabilityData?: Availability
  changedAvailability: boolean
}
