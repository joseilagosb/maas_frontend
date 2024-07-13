export const testData = {
  loginInput: {
    email: 'messi@maas.com',
    password: 'contrasena'
  } as const,
  user: {
    id: 1,
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
    { id: 1, name: 'service1', active: true },
    { id: 2, name: 'service2', active: true }
  ],
  serviceWeeks: [
    {
      id: 1,
      week: 1,
      serviceDays: [{ id: 1, day: 1, serviceHours: [{ id: 1, hour: 1, user: { id: 1 } }] }]
    },
    {
      id: 2,
      week: 2,
      serviceDays: [{ id: 1, day: 1, serviceHours: [{ id: 1, hour: 1, user: { id: 1 } }] }]
    },
    {
      id: 3,
      week: 3,
      serviceDays: [{ id: 1, day: 1, serviceHours: [{ id: 1, hour: 1, user: { id: 1 } }] }]
    }
  ]
}

export const testResponses = {
  services: {
    200: {
      data: [
        { attributes: { ...testData.services[0] } },
        { attributes: { ...testData.services[1] } }
      ]
    }
  },
  service: {
    200: {
      data: { ...testData.services[0], type: 'service' }
    }
  },
  logout: {
    200: {
      data: { status: 200, message: 'Logged out successfully' },
      status: 200
    }
  }
}

export const testState = {
  notLoggedIn: { auth: { isLoggedIn: false, user: null } },
  admin: { auth: { isLoggedIn: true, user: { ...testData.admin } } },
  user: { auth: { isLoggedIn: true, user: { ...testData.user } } }
}
