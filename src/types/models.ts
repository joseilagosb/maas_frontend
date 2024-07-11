export type User = {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export type Service = {
  id: number
  name: string
  from: string
  to: string
}
