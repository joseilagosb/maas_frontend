import type { User } from '@/types/models'

const USER_LOCAL_STORAGE_KEY = 'user'

export const USER_LOCAL_STORAGE_KEYS = {
  USER: USER_LOCAL_STORAGE_KEY,
  TOKEN: 'token'
}

export const USER_TAILWIND_COLORS = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500'
} as const

export const NULL_OBJECTS = { USER: { id: 0, name: '', email: '' } as User }
