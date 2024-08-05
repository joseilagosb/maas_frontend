import type { ServiceHour, User, UserAssignedHours } from '@/types/models'
import { getArrayFromInterval } from '@/utils/common'
import { NULL_OBJECTS } from '@/utils/constants'

// Contexto: Todos los servicios trabajan 3 días a la semana (Lunes, Martes y Miércoles)
const SERVICE_DAYS_NUMBER = 3
const SERVICE_DAYS_OF_WEEK = getArrayFromInterval(6, 6 + SERVICE_DAYS_NUMBER - 1)

export const testTime = {
  date: {
    get inSpanish() {
      return SERVICE_DAYS_OF_WEEK.map((day) => `${day} de marzo de 2024`)
    },
    firstDayOfWeek: `0${SERVICE_DAYS_OF_WEEK[0]}/03/2024`,
    lastDayOfWeek: `0${SERVICE_DAYS_OF_WEEK[SERVICE_DAYS_NUMBER - 1]}/03/2024`
  },
  startOfWeek: SERVICE_DAYS_OF_WEEK[0],
  endOfWeek: SERVICE_DAYS_OF_WEEK[SERVICE_DAYS_NUMBER - 1],
  week: 10,
  year: 2024
}

export const testData = {
  loginInput: {
    email: 'messi@maas.com',
    password: 'contrasena'
  } as const,
  user: {
    id: 1,
    type: 'user',
    name: 'Messi',
    email: 'messi@maas.com',
    role: 'user',
    color: 'blue'
  } as const,
  notDesignatedUser: {
    id: 2,
    type: 'user',
    name: 'Modric',
    email: 'modric@maas.com',
    role: 'user',
    color: 'green'
  } as const,
  admin: {
    id: 3,
    name: 'Pepe',
    email: 'pepe@maas.com',
    role: 'admin',
    color: 'red'
  } as const,
  service: { id: 1, type: 'service', name: 'service no.1', active: true },
  get services() {
    return [{ ...this.service }, { id: 2, type: 'service', name: 'service no.2', active: true }]
  },
  serviceWorkingDays: getArrayFromInterval(1, 3).map((day: number, index: number) => ({
    id: index + 1,
    day: day,
    from: 13,
    to: 18
  })),
  serviceHours: getArrayFromInterval(13, 18).map((hour: number, index: number) => ({
    id: index,
    hour: hour
  })),
  get serviceHoursWithDesignatedUser() {
    return this.serviceHours.map((serviceHour: any) => ({
      ...serviceHour,
      designatedUser: { ...testData.users[serviceHour < 16 ? 0 : 1] }
    }))
  },
  get serviceHoursWithoutDesignatedUser() {
    return this.serviceHours.map((serviceHour: any) => ({
      ...serviceHour,
      designatedUser: undefined
    }))
  },
  get serviceHoursWithUsers(): ServiceHour[] {
    return this.serviceHours.map((serviceHour: any) => ({
      ...serviceHour,
      users: [testData.user]
    })) as ServiceHour[]
  },
  get serviceDays() {
    return getArrayFromInterval(1, 3).map((day: number, index: number) => ({
      id: index,
      day: day,
      serviceHours: this.serviceHoursWithDesignatedUser
    }))
  },
  get serviceWeeks() {
    return [{ id: 1, week: testTime.week, serviceDays: this.serviceDays }]
  },
  get users(): User[] {
    return [testData.user, testData.notDesignatedUser]
  },
  get userAssignedHours(): UserAssignedHours[] {
    return [
      {
        id: testData.users[0].id,
        name: testData.users[0].name,
        color: testData.users[0].color,
        hoursCount: 8
      },
      {
        id: testData.users[1].id,
        name: testData.users[1].name,
        color: testData.users[1].color,
        hoursCount: 2
      }
    ] as UserAssignedHours[]
  },
  get emptyServiceWeekData() {
    return {
      ...testData.serviceWeeks[0],
      id: 0,
      serviceDays: testData.serviceDays.map((serviceDay: any) => ({
        ...serviceDay,
        id: 0,
        serviceHours: testData.serviceHoursWithoutDesignatedUser.map((serviceHour: any) => ({
          ...serviceHour,
          id: 0
        }))
      }))
    }
  },
  get serviceAvailability() {
    return {
      week: testData.serviceWeeks[0].week,
      serviceDays: testData.serviceDays.map((serviceDay: any) => ({
        day: serviceDay.day,
        serviceHours: testData.serviceHoursWithDesignatedUser.map((serviceHour: any) => ({
          hour: serviceHour.hour,
          available: [true, false]
        }))
      }))
    }
  }
}

export const testParams = { service: { week: testTime.week, id: testData.service.id } }

export const testState = {
  notLoggedInAuthStore: { isLoggedIn: false, user: NULL_OBJECTS.USER },
  adminAuthStore: { isLoggedIn: true, user: { ...testData.admin } },
  userAuthStore: { isLoggedIn: true, user: { ...testData.user } },
  get serviceStore() {
    return {
      service: {
        ...testData.service,
        serviceWorkingDays: [...testData.serviceWorkingDays]
      },
      activeWeeks: testData.serviceWeeks.map((serviceWeek: any) => serviceWeek.week),
      userAssignedHours: testData.userAssignedHours,
      selectedWeek: testTime.week
    }
  },
  get showServiceStore() {
    return {
      ...this.serviceStore,
      selectedWeekData: { ...testData.serviceWeeks[0], serviceDays: [...testData.serviceDays] }
    }
  },
  get showServiceStoreWithEmptyServiceWeekData() {
    return {
      ...this.serviceStore,
      selectedWeekData: testData.emptyServiceWeekData
    }
  },
  get showServiceStoreWithoutDesignatedUser() {
    return {
      ...this.serviceStore,
      selectedWeekData: {
        ...testData.serviceWeeks[0],
        serviceDays: testData.serviceDays.map((serviceDay: any) => ({
          ...serviceDay,
          serviceHours: testData.serviceHoursWithoutDesignatedUser
        }))
      }
    }
  },
  get editServiceStore() {
    return {
      ...this.serviceStore,
      selectedWeekData: {
        ...testData.serviceWeeks[0],
        serviceDays: testData.serviceDays.map((serviceDay: any) => ({
          ...serviceDay,
          serviceHours: testData.serviceHoursWithUsers
        }))
      }
    }
  },
  get serviceAvailabilityStore() {
    return {
      availabilityData: testData.serviceAvailability,
      changedAvailability: false
    }
  }
}
