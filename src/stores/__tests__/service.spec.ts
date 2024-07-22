import { createPinia } from 'pinia'
import { useRoute } from 'vue-router'
import { it, expect, describe, vi, beforeAll } from 'vitest'

import { useServiceStore } from '../service'
import { testData, testTime } from '@/test/data'

describe('Service Store', () => {
  let serviceStore: ReturnType<typeof useServiceStore>
  vi.mock('vue-router')

  describe('initialize', () => {
    it('initializes the store', () => {
      vi.mocked(useRoute).mockReturnValue({ params: { week: undefined } } as any)
      serviceStore = useServiceStore(createPinia())

      expect(serviceStore.service).toBeUndefined()
      expect(serviceStore.users).toEqual([])
      expect(serviceStore.activeWeeks).toEqual([])
      expect(serviceStore.selectedWeek).toEqual(testTime.week)
      expect(serviceStore.selectedWeekData).toBeUndefined()
    })

    it('initializes the selected week on a different week', () => {
      const previousWeek = testTime.week - 1
      vi.mocked(useRoute).mockReturnValue({ params: { week: previousWeek } } as any)
      serviceStore = useServiceStore(createPinia())

      expect(serviceStore.selectedWeek).toEqual(previousWeek)
    })
  })

  describe('fetchService', () => {
    vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week } } as any)
    serviceStore = useServiceStore(createPinia())
    const service = testData.services[0]
    const serviceWorkingDays = testData.serviceWorkingDays

    beforeAll(async () => {
      await serviceStore.fetchService(service.id)
    })

    it('fetches a service', async () => {
      expect(serviceStore.service).toBeDefined()
      expect(serviceStore.service!.id).toEqual(service.id)
      expect(serviceStore.service!.name).toEqual(service.name)
      expect(serviceStore.service!.active).toEqual(service.active)
      expect(serviceStore.service!.serviceWorkingDays).toEqual([...serviceWorkingDays])
    })

    it('generates the activeWeeks array', async () => {
      const activeWeeks = testData.serviceWeeks.map((serviceWeek: any) => serviceWeek.week)
      expect(serviceStore.activeWeeks).toEqual(activeWeeks)
    })
  })

  describe('fetchUsers', () => {
    it.todo('fetches the users')
  })

  describe('fetchServiceWeek', () => {
    beforeAll(async () => {
      await serviceStore.fetchServiceWeek(testData.services[0].id, testTime.week)
    })

    it('fetches to edit route when mode is edit', async () => {
      await serviceStore.fetchServiceWeek(testData.services[0].id, testTime.week, 'edit')
      expect(serviceStore.selectedWeekData).toBeDefined()
    })

    it.todo('fetches the service week', () => {})
  })

  describe('generateEmptyServiceWeek', () => {
    it.todo('generates an empty service week')
  })
})
