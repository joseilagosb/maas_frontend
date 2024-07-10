import type { User } from '@/types/models'

const USER_LOCAL_STORAGE_KEY = 'user'

export const USER_LOCAL_STORAGE_KEYS = {
  USER: USER_LOCAL_STORAGE_KEY
}

export const NULL_OBJECTS = { USER: { id: 0, name: '', email: '' } as User }
