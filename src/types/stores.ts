import type { User } from './models'

export type AuthState = {
  isLoggedIn: boolean
  user: User
}
