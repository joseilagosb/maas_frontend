import { expect, beforeEach, describe, it } from 'vitest'

import { useHomeStore } from '../home'
import { createPinia } from 'pinia'
import { testData } from '@/test/data'

describe('Home Store', () => {
  let homeStore: ReturnType<typeof useHomeStore>

  beforeEach(() => {
    homeStore = useHomeStore(createPinia())
    homeStore.$patch({ services: [] })
  })

  it('fetches the services', async () => {
    expect(homeStore.services).toEqual([])
    await homeStore.fetchServices()
    expect(homeStore.services).toEqual(testData.services)
  })
})
