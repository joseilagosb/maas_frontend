import type { ComponentPublicInstance } from 'vue'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoute } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'

import ShowServiceWeekGrid from '@/components/show_service/ShowServiceWeekGrid.vue'

import { useServiceStore } from '@/stores/service'

import { getServiceWeek } from '@/services/api'
import { addToDate, formatDateInSpanish, getFormattedHour } from '@/services/date'

import { testData, testState, testTime } from '@/test/data'
import { mockAPIService } from '@/test/mocks/services/api'
import { prepareFormatDateMethods, shallowMountWithPinia } from '@/test/utils'
import { mockDateService } from '@/test/mocks/services/date'

import { USER_TAILWIND_COLORS } from '@/utils/constants'

describe('ShowServiceWeekGrid', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week } } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  const gridSelector = '[data-testid="grid"]'
  const errorMessageSelector = '[data-testid="error-message"]'

  describe('mounted', () => {
    describe('active weeks does not contain selected week', () => {
      const serviceWeeksWithoutCurrentWeek = [...testData.serviceWeeks]
      serviceWeeksWithoutCurrentWeek[0].week = testTime.week - 1
      const serviceStoreWithoutWeekData = {
        ...testState.serviceStore,
        activeWeeks: serviceWeeksWithoutCurrentWeek.map((serviceWeek: any) => serviceWeek.week)
      }

      let wrapper: VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>

      beforeEach(async () => {
        wrapper = shallowMount(ShowServiceWeekGrid, {
          global: {
            plugins: [
              createTestingPinia({
                initialState: { ...testState.user, service: { ...serviceStoreWithoutWeekData } },
                stubActions: false
              })
            ]
          }
        }) as VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>
        await flushPromises()
      })

      it('runs the generateEmptyServiceWeek action', () => {
        const serviceStore = useServiceStore()
        expect(serviceStore.generateEmptyServiceWeek).toHaveBeenCalledTimes(1)
      })

      it('renders the grid', async () => {
        expect(wrapper.find(gridSelector).exists()).toBe(true)
      })
    })

    describe('service week fetch', () => {
      let wrapper: VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>

      it('runs the fetchServiceWeek action', async () => {
        shallowMountWithPinia(ShowServiceWeekGrid, {
          initialState: { ...testState.user, service: { ...testState.serviceStore } },
          stubActions: false
        })
        await flushPromises()

        const serviceStore = useServiceStore()
        expect(serviceStore.fetchServiceWeek).toHaveBeenCalledTimes(1)
      })

      describe('success', () => {
        beforeEach(async () => {
          wrapper = shallowMountWithPinia(ShowServiceWeekGrid, {
            initialState: { ...testState.user, service: { ...testState.serviceStore } },
            stubActions: false
          })
          await flushPromises()
        })

        it('renders the grid', async () => {
          expect(wrapper.find(gridSelector).exists()).toBe(true)
        })
      })

      describe('failed', () => {
        afterAll(() => {
          vi.mocked(getServiceWeek).mockImplementation(mockAPIService.getServiceWeek)
        })

        beforeEach(async () => {
          vi.mocked(getServiceWeek).mockImplementationOnce(async () => {
            return Promise.reject(new Error('error'))
          })
          wrapper = shallowMountWithPinia(ShowServiceWeekGrid, {
            initialState: { ...testState.user, service: { ...testState.serviceStore } },
            stubActions: false
          })
          await flushPromises()
        })

        it('renders error', async () => {
          expect(wrapper.find(errorMessageSelector).exists()).toBe(true)
        })
      })
    })
  })

  describe('grid', () => {
    describe('days', () => {
      let wrapper: VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>

      const gridDaysSelector = '[data-testid="grid-day"]'

      afterAll(() => {
        vi.mocked(getFormattedHour).mockImplementation(mockDateService.getFormattedHour)
      })

      beforeEach(async () => {
        prepareFormatDateMethods()
        wrapper = shallowMount(ShowServiceWeekGrid, {
          global: {
            plugins: [
              createTestingPinia({
                initialState: { ...testState.user, service: { ...testState.serviceStore } },
                stubActions: false
              })
            ]
          }
        }) as VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>
        await flushPromises()
      })

      it('renders the correct number of days', () => {
        expect(wrapper.findAll(gridDaysSelector).length).toEqual(testData.serviceDays.length)
      })

      it('calls the formatting methods', () => {
        expect(addToDate).toHaveBeenCalledTimes(testData.serviceDays.length)
        expect(formatDateInSpanish).toHaveBeenCalledTimes(testData.serviceDays.length)
      })

      it('renders the date in the correct format', () => {
        const gridDays = wrapper.findAll(gridDaysSelector)
        for (let i = 0; i < gridDays.length; i++) {
          const gridDayDate = gridDays[i].find('[data-testid="grid-day-date"]').text()
          expect(gridDayDate).toEqual(testTime.date.inSpanish[i])
        }
      })
    })

    describe('hours', () => {
      let wrapper: VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>

      const gridHoursSelector = '[data-testid="grid-hour"]'

      beforeEach(async () => {
        vi.mocked(getFormattedHour).mockClear()
        wrapper = shallowMount(ShowServiceWeekGrid, {
          global: {
            plugins: [
              createTestingPinia({
                initialState: { ...testState.user, service: { ...testState.serviceStore } },
                stubActions: false
              })
            ]
          }
        }) as VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>
        await flushPromises()
      })

      it('renders the correct number of hours', () => {
        const gridHours = wrapper.findAll(gridHoursSelector)
        const totalHours = testData.serviceDays.reduce(
          (acc, day) => acc + day.serviceHours.length,
          0
        )
        expect(gridHours.length).toEqual(totalHours)
      })

      it('calls the formatting methods', () => {
        const totalHours = testData.serviceDays.reduce(
          (acc, day) => acc + day.serviceHours.length,
          0
        )
        expect(getFormattedHour).toHaveBeenCalledTimes(totalHours * 2)
      })

      it('renders each hour in the correct format', () => {
        const gridHours = wrapper.findAll(gridHoursSelector)

        for (let i = 0; i < gridHours.length; i++) {
          const gridHourTime = gridHours[i].find('[data-testid="grid-hour-time"]').text()
          const gridDayIndex = gridHours[i].attributes()['data-testdayindex']
          const gridHourIndex = gridHours[i].attributes()['data-testhourindex']
          const expectedHour = testData.serviceDays[+gridDayIndex].serviceHours[+gridHourIndex].hour
          expect(gridHourTime).toEqual(expectedHour + ':00' + '-' + (expectedHour + 1) + ':00')
        }
      })

      describe('service week with a designated user', () => {
        it('renders the designated user', () => {
          const gridHours = wrapper.findAll(gridHoursSelector)
          for (let i = 0; i < gridHours.length; i++) {
            const gridHourDesignatedUser = gridHours[i]
              .find('[data-testid="grid-hour-designated-user"]')
              .text()
            const gridDayIndex = gridHours[i].attributes()['data-testdayindex']
            const gridHourIndex = gridHours[i].attributes()['data-testhourindex']
            const expectedDesignatedUser =
              testData.serviceDays[+gridDayIndex].serviceHours[+gridHourIndex].designatedUser

            expect(gridHourDesignatedUser).toEqual(expectedDesignatedUser!.name)
            expect(gridHours[i].classes()).toContain(
              USER_TAILWIND_COLORS[expectedDesignatedUser!.color]
            )
          }
        })
      })

      describe('service week without a designated user (empty)', () => {
        let wrapper: VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>

        afterAll(() => {
          vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week } } as any)
        })

        beforeEach(async () => {
          vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week + 1 } } as any)
          wrapper = shallowMount(ShowServiceWeekGrid, {
            global: {
              plugins: [
                createTestingPinia({
                  initialState: { ...testState.user, service: { ...testState.serviceStore } },
                  stubActions: false
                })
              ]
            }
          }) as VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>
          await flushPromises()
        })

        it('renders not assigned when there is no designated user', async () => {
          const gridHours = wrapper.findAll(gridHoursSelector)
          for (let i = 0; i < gridHours.length; i++) {
            const gridHourDesignatedUser = gridHours[i]
              .find('[data-testid="grid-hour-designated-user"]')
              .text()
            const gridDayIndex = gridHours[i].attributes()['data-testdayindex']
            const gridHourIndex = gridHours[i].attributes()['data-testhourindex']
            const expectedDesignatedUser =
              testData.serviceDays[+gridDayIndex].serviceHours[+gridHourIndex].designatedUser
            expect(gridHourDesignatedUser).toEqual(expectedDesignatedUser ? 'Sin asignar' : '')
            expect(gridHours[i].classes()).toContain('bg-gray-400')
          }
        })
      })
    })
  })
})