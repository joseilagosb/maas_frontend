import type { UserColor } from './utils'

export type User = {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  color: UserColor
}

export type Service = {
  id: number
  name: string
  active: boolean
  serviceWorkingDays: ServiceWorkingDay[]
}

export type ServiceWorkingDay = {
  id: number
  day: number
  from: number
  to: number
}

export type ServiceWeek = {
  id: number
  week: number
  serviceDays: ServiceDay[]
}

export type ServiceDay = {
  id: number
  day: number
  serviceHours: ServiceHour[]
}

export type ServiceHour = {
  id: number
  hour: number
  designatedUser?: User
  users?: User[]
}

export type UserHoursAssignment = Omit<User, 'email, role'> & {
  hoursCount: number
}

export type Availability = {
  week: number
  serviceDays: AvailabilityDay[]
}
export type AvailabilityDay = {
  day: number
  serviceHours: AvailabilityHour[]
}
export type AvailabilityHour = {
  hour: number
  available: { [key: number]: boolean }
}
