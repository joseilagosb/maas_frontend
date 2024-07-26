import axios from 'axios'
import { JSONDeserializer } from './deserializer'
import { NULL_OBJECTS, USER_LOCAL_STORAGE_KEYS } from '@/utils/constants'

export const postLogin = async (email: string, password: string) => {
  return axios
    .post('http://localhost:3000/login', { user: { email, password } })
    .then((response) => {
      if (response && response.data) {
        const { data, headers } = response

        localStorage.setItem(USER_LOCAL_STORAGE_KEYS.TOKEN, headers.authorization.split(' ')[1])
        localStorage.setItem(USER_LOCAL_STORAGE_KEYS.USER, JSON.stringify(response.data.user))

        return data.user
      }
    })
    .catch((error: Error) => {
      throw error
    })
}

export const deleteLogout = async () => {
  return axios
    .delete('http://localhost:3000/logout')
    .then((response) => {
      if (response && response.data) {
        localStorage.removeItem(USER_LOCAL_STORAGE_KEYS.USER)
        localStorage.removeItem(USER_LOCAL_STORAGE_KEYS.TOKEN)
        return NULL_OBJECTS.USER
      }
    })
    .catch((error: Error) => {
      throw error
    })
}

export const getServices = async () => {
  return axios
    .get(`http://localhost:3000/services`)
    .then(async (response) => {
      const parsedResponseData = response.data
      const services = await JSONDeserializer.deserialize(parsedResponseData)
      return services
    })
    .catch((error: Error) => {
      throw error
    })
}

export const getUsers = async () => {
  return axios
    .get(`http://localhost:3000/users`)
    .then(async (response) => {
      const parsedResponseData = response.data
      const users = await JSONDeserializer.deserialize(parsedResponseData)
      return users
    })
    .catch((error: Error) => {
      throw error
    })
}

export const getService = async (id: number) => {
  return axios
    .get(`http://localhost:3000/services/${id}`)
    .then(async (response) => {
      const parsedResponseData = response.data
      const service = await JSONDeserializer.deserialize(parsedResponseData)

      return service
    })
    .catch((error: Error) => {
      throw error
    })
}

export const getServiceWeek = async (id: number, week: number, mode: 'show' | 'edit') => {
  let url = `http://localhost:3000/services/${id}/service_weeks/${week}`
  if (mode === 'edit') {
    url += '/edit'
  }

  return axios
    .get(url)
    .then(async (response) => {
      const parsedResponseData = response.data
      const selectedWeekData = await JSONDeserializer.deserialize(parsedResponseData)
      return selectedWeekData
    })
    .catch((error: Error) => {
      throw error
    })
}
