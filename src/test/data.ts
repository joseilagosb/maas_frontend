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
    { id: 1, name: 'service1' },
    { id: 2, name: 'service2' }
  ]
}

export const testState = {
  notLoggedIn: { auth: { isLoggedIn: false, user: null } },
  admin: { auth: { isLoggedIn: true, user: { ...testData.admin } } },
  user: { auth: { isLoggedIn: true, user: { ...testData.user } } }
}
