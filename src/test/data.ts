import { getArrayFromInterval } from '@/utils/common'

export const testTime = {
  date: {
    inSpanish: '6 de marzo de 2024'
  },
  startOfWeek: 4,
  endOfWeek: 10,
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
    { id: 1, name: 'service1', active: true, type: 'service' },
    { id: 2, name: 'service2', active: true, type: 'service' }
  ],
  serviceWorkingDays: getArrayFromInterval(testTime.startOfWeek, testTime.endOfWeek).map(
    (day: number, index: number) => ({
      id: index + 1,
      day: day,
      from: 10,
      to: 22
    })
  ),
  serviceWeeks: [{ id: 1, type: 'service_week', week: 1 }],
  serviceDays: getArrayFromInterval(1, 7).map((day: number) => ({ type: 'service_day', day: day })),
  serviceHours: getArrayFromInterval(1, 24).map((hour: number) => ({
    type: 'hour',
    hour: hour,
    user: { id: 1 }
  }))
}

export const testState = {
  notLoggedIn: { auth: { isLoggedIn: false, user: null } },
  admin: { auth: { isLoggedIn: true, user: { ...testData.admin } } },
  user: { auth: { isLoggedIn: true, user: { ...testData.user } } }
}
