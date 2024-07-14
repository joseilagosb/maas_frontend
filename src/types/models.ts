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
  serviceWorkingDays: ServiceWorkingDays[]
}

type ServiceWorkingDays = {
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

export type CurrentAvailability = {
  week: number
  days: CurrentAvailabilityDay[]
}
export type CurrentAvailabilityDay = {
  day: number
  hours: CurrentAvailabilityHour[]
}
export type CurrentAvailabilityHour = {
  hour: number
  available: boolean[]
}
