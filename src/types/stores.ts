import type {
  Availability,
  AvailabilityChanges,
  Service,
  ServiceWeek,
  User,
  UserHoursAssignment
} from './models'

export type AuthState = {
  isLoggedIn: boolean
  user: User
}

export type HomeState = {
  services: Service[]
}

export type ServiceState = {
  service?: Service
  userHoursAssignments: UserHoursAssignment[]
  activeWeeks: number[]
  selectedWeek: number
  selectedServiceId: number
  selectedWeekData?: ServiceWeek
}

export type ServiceAvailabilityState = {
  availabilityData?: Availability
  availabilityChanges: AvailabilityChanges
}
