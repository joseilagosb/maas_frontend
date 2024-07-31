import type { ServiceHour } from '@/types/models'
import { getArrayFromInterval } from '@/utils/common'

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
  service: { id: 1, type: 'service', name: 'service1', active: true },
  get services() {
    return [{ ...this.service }, { id: 2, type: 'service', name: 'service2', active: true }]
  },
  serviceWorkingDays: getArrayFromInterval(1, 3).map((day: number, index: number) => ({
    id: index + 1,
    day: day,
    from: 13,
    to: 18
  })),
  get serviceHoursEmpty() {
    return getArrayFromInterval(13, 18).map((hour: number) => ({
      id: 0,
      hour: hour,
      designatedUser: undefined
    }))
  },
  get serviceHoursDefault() {
    return getArrayFromInterval(13, 18).map((hour: number, index: number) => ({
      id: index,
      hour: hour,
      designatedUser: { ...testData.users[hour < 16 ? 0 : 1] }
    }))
  },
  get serviceHoursDefaultWithUsers(): ServiceHour[] {
    return getArrayFromInterval(13, 18).map((hour: number, index: number) => ({
      id: index,
      hour: hour,
      users: [testData.user]
    }))
  },
  get serviceDays() {
    return getArrayFromInterval(1, 3).map((day: number, index: number) => ({
      id: index,
      day: day,
      serviceHours: this.serviceHoursDefault
    }))
  },
  get serviceWeeks() {
    return [{ id: 1, week: testTime.week, serviceDays: this.serviceDays }]
  },
  get users() {
    return [testData.user, testData.notDesignatedUser]
  }
}

export const testResponses = {
  service: {
    ...testData.service,
    serviceWorkingDays: [...testData.serviceWorkingDays],
    serviceWeeks: [...testData.serviceWeeks]
  },
  showServiceWeek: {
    ...testData.serviceWeeks[0],
    serviceDays: [...testData.serviceDays]
  },
  editServiceWeek: {
    ...testData.serviceWeeks[0],
    serviceDays: testData.serviceDays.map((serviceDay: any) => ({
      ...serviceDay,
      serviceHours: testData.serviceHoursDefaultWithUsers
    }))
  }
}

export const testState = {
  notLoggedIn: { auth: { isLoggedIn: false, user: null } },
  admin: { auth: { isLoggedIn: true, user: { ...testData.admin } } },
  user: { auth: { isLoggedIn: true, user: { ...testData.user } } },
  serviceStore: {
    service: {
      ...testData.service,
      serviceWorkingDays: [...testData.serviceWorkingDays]
    },
    activeWeeks: testData.serviceWeeks.map((serviceWeek: any) => serviceWeek.week),
    users: testData.users
  },
  get showServiceStore() {
    return {
      ...this.serviceStore,
      selectedWeekData: { ...testData.serviceWeeks[0], serviceDays: [...testData.serviceDays] }
    }
  },
  get editServiceStore() {
    return {
      ...this.serviceStore,
      selectedWeekData: {
        ...testData.serviceWeeks[0],
        serviceDays: testData.serviceDays.map((serviceDay: any) => ({
          ...serviceDay,
          serviceHours: testData.serviceHoursDefaultWithUsers
        }))
      }
    }
  },
  get emptyServiceWeekData() {
    return {
      ...testData.serviceWeeks[0],
      id: 0,
      serviceDays: testData.serviceDays.map((serviceDay: any) => ({
        ...serviceDay,
        id: 0,
        serviceHours: testData.serviceHoursEmpty
      }))
    }
  },
  get serviceAvailabilityStore() {
    return {
      currentAvailability: {
        week: testData.serviceWeeks[0].week,
        serviceDays: testData.serviceDays.map((serviceDay: any) => ({
          ...serviceDay,
          serviceHours: testData.serviceHoursDefault.map((serviceHour: any) => ({
            hour: serviceHour.hour,
            available: [true, false]
          }))
        }))
      }
    }
  }
}
