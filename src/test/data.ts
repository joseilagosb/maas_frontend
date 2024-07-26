import { getArrayFromInterval } from '@/utils/common'

export const testTime = {
  date: {
    inSpanish: '6 de marzo de 2024',
    firstDayOfWeek: '04/03/2024',
    lastDayOfWeek: '10/03/2024'
  },
  startOfWeek: 4,
  endOfWeek: 8,
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
    role: 'user'
  } as const,
  admin: {
    id: 2,
    name: 'Pepe',
    email: 'pepe@maas.com',
    role: 'admin'
  } as const,
  services: [
    { id: 1, type: 'service', name: 'service1', active: true },
    { id: 2, type: 'service', name: 'service2', active: true }
  ],
  serviceWorkingDays: getArrayFromInterval(1, 7).map((day: number, index: number) => ({
    id: index + 1,
    day: day,
    from: 10,
    to: 22
  })),
  get serviceHoursEmpty() {
    return getArrayFromInterval(10, 22).map((hour: number) => ({
      id: 0,
      hour: hour,
      designatedUser: undefined
    }))
  },
  get serviceHoursDefault() {
    return getArrayFromInterval(10, 22).map((hour: number) => ({
      hour: hour,
      designatedUser: { ...testData.user }
    }))
  },
  get serviceDays() {
    return getArrayFromInterval(1, 7).map((day: number) => ({
      day: day,
      serviceHours: this.serviceHoursDefault
    }))
  },
  get serviceWeeks() {
    return [{ id: 1, week: testTime.week, serviceDays: this.serviceDays }]
  },
  get serviceWeeksWithoutCurrentWeek() {
    return [{ id: 1, week: testTime.week - 1, serviceDays: this.serviceDays }]
  }
}

export const testResponses = {
  service: {
    ...testData.services[0],
    serviceWorkingDays: [...testData.serviceWorkingDays],
    serviceWeeks: [...testData.serviceWeeks]
  },
  showServiceWeek: {
    ...testData.serviceWeeks[0],
    serviceDays: [...testData.serviceDays]
  },
  editServiceWeek: {
    ...testData.serviceWeeks[0],
    serviceDays: [...testData.serviceDays]
  }
}

export const testState = {
  notLoggedIn: { auth: { isLoggedIn: false, user: null } },
  admin: { auth: { isLoggedIn: true, user: { ...testData.admin } } },
  user: { auth: { isLoggedIn: true, user: { ...testData.user } } },
  serviceStore: {
    service: {
      ...testData.services[0],
      serviceWorkingDays: [...testData.serviceWorkingDays]
    },
    activeWeeks: testData.serviceWeeks.map((serviceWeek: any) => serviceWeek.week)
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
      selectedWeekData: { ...testData.serviceWeeks[0], serviceDays: [...testData.serviceDays] }
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
  }
}
