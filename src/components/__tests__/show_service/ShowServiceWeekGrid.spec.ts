import type { ComponentPublicInstance } from 'vue'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoute } from 'vue-router'
import { flushPromises, VueWrapper } from '@vue/test-utils'

import ShowServiceWeekGrid from '@/components/show_service/ShowServiceWeekGrid.vue'

import { useServiceStore } from '@/stores/service'

import { getServiceWeek } from '@/services/api'
import { addToDate, formatDateInSpanish, getFormattedHour } from '@/services/date'

import { testData, testParams, testState, testTime } from '@/test/data'
import { prepareFormatDateMethods, shallowMountWithPinia } from '@/test/utils'
import { mockDateService } from '@/test/mocks/services/date'

import { USER_TAILWIND_COLORS } from '@/utils/constants'

describe('ShowServiceWeekGrid', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week } } as any)

  let wrapper: VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>
  let serviceStore: ReturnType<typeof useServiceStore>

  beforeEach(async () => {
    wrapper = shallowMountWithPinia(ShowServiceWeekGrid, {
      initialState: {
        ...testState.user,
        service: {
          ...testState.serviceStore,
          selectedWeek: testTime.week,
          activeWeeks: [...testState.serviceStore.activeWeeks]
        }
      },
      stubActions: false
    })
    await flushPromises()
    serviceStore = useServiceStore()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  const gridSelector = '[data-testid="grid"]'
  const errorMessageSelector = '[data-testid="error-message"]'

  describe('setup', () => {
    describe('watch', () => {
      describe('selected week', () => {
        beforeEach(() => {
          // Eliminamos la semana actual de la lista de semanas activas, que es la variable que se revisa con
          // el getter weekContainsData

          // El nuevo arreglo activeWeeks contendrá solamente la semana anterior a la actual, de esta manera
          // se podrá determinar qué action de serviceStore se debe llamar en el watch
          serviceStore.$patch({
            activeWeeks: [testTime.week - 1]
          })
        })

        describe('week contains data', () => {
          beforeEach(async () => {
            // Cambiamos el estado de selectedWeek a la semana anterior, contenida en activeWeeks
            serviceStore.$patch({ selectedWeek: testTime.week - 1 })
            await flushPromises()
          })

          it('runs the fetchServiceWeek action', () => {
            expect(serviceStore.fetchServiceWeek).toHaveBeenCalledTimes(1)
          })
        })

        describe('week doesnt contain data', () => {
          beforeEach(async () => {
            // Cambiamos el estado de selectedWeek a dos semanas atrás, que no está contenida en activeWeeks
            // Esto hará que la action generateEmptyServiceWeek sea llamada
            serviceStore.$patch({ selectedWeek: testTime.week - 2 })
            await wrapper.vm.$nextTick()
          })

          it('runs the generateEmptyServiceWeek action', () => {
            expect(serviceStore.generateEmptyServiceWeek).toHaveBeenCalledTimes(1)
          })
        })
      })

      describe('user assigned hours', () => {
        beforeEach(async () => {
          serviceStore.$patch({ userAssignedHours: [] })
          await wrapper.vm.$nextTick()
        })

        it('runs the fetchServiceWeek action', () => {
          expect(serviceStore.fetchServiceWeek).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('actions', () => {
      describe('fetchServiceWeek', () => {
        it('renders the grid if it succeeds', async () => {
          serviceStore.$patch({ userAssignedHours: [...testData.userAssignedHours] })
          await flushPromises()
          expect(wrapper.find(gridSelector).exists()).toBe(true)
        })

        it('renders error if it fails', async () => {
          vi.mocked(getServiceWeek).mockImplementationOnce(async () => {
            return Promise.reject(new Error('error'))
          })
          serviceStore.$patch({ userAssignedHours: [...testData.userAssignedHours] })
          await flushPromises()

          expect(wrapper.find(errorMessageSelector).exists()).toBe(true)
        })
      })

      describe('generateEmptyServiceWeek', () => {
        it('renders the grid if it succeeds', async () => {
          serviceStore.$patch({ userAssignedHours: [...testData.userAssignedHours] })
          await flushPromises()
          expect(wrapper.find(gridSelector).exists()).toBe(true)
        })

        it('renders error if it fails', async () => {
          vi.mocked(getServiceWeek).mockImplementationOnce(async () => {
            return Promise.reject(new Error('error'))
          })
          serviceStore.$patch({ userAssignedHours: [...testData.userAssignedHours] })
          await flushPromises()

          expect(wrapper.find(errorMessageSelector).exists()).toBe(true)
        })
      })
    })
  })

  describe('render', () => {
    beforeEach(async () => {
      // Limpiamos el número de llamados a getFormattedHour y preparamos la secuencia de llamados
      // para formatDateInSpanish
      vi.mocked(getFormattedHour).mockClear()
      prepareFormatDateMethods()
      // Esto acciona el watcher
      serviceStore.$patch({ userAssignedHours: [...testData.userAssignedHours] })
      await flushPromises()
    })

    describe('grid', () => {
      describe('days', () => {
        const gridDaysSelector = '[data-testid="grid-day"]'

        afterAll(() => {
          vi.mocked(getFormattedHour).mockImplementation(mockDateService.getFormattedHour)
        })

        it('renders the correct number of days', () => {
          expect(wrapper.findAll(gridDaysSelector).length).toEqual(testData.serviceDays.length)
        })

        it('calls the formatting methods', () => {
          expect(addToDate).toHaveBeenCalledTimes(testData.serviceDays.length)
          expect(formatDateInSpanish).toHaveBeenCalledTimes(testData.serviceDays.length)
        })

        it('renders the date in the correct format', () => {
          wrapper.findAll(gridDaysSelector).forEach((gridDay, dayIndex) => {
            const gridDayDate = gridDay.find('[data-testid="grid-day-date"]').text()
            expect(gridDayDate).toEqual(testTime.date.inSpanish[dayIndex])
          })
        })
      })

      describe('hours', () => {
        const gridHoursSelector = '[data-testid="grid-hour"]'

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
          wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
            const gridHourTime = gridHour.find('[data-testid="grid-hour-time"]').text()
            const gridDayIndex = gridHour.attributes()['data-testdayindex']
            const gridHourIndex = gridHour.attributes()['data-testhourindex']

            const expectedHour =
              testData.serviceDays[+gridDayIndex].serviceHours[+gridHourIndex].hour

            expect(gridHourTime).toEqual(expectedHour + ':00' + '-' + (expectedHour + 1) + ':00')
          })
        })

        describe('service week with a designated user', () => {
          it('renders the designated user', () => {
            wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
              const gridHourDesignatedUser = gridHour
                .find('[data-testid="grid-hour-designated-user"]')
                .text()
              const gridDayIndex = gridHour.attributes()['data-testdayindex']
              const gridHourIndex = gridHour.attributes()['data-testhourindex']

              const expectedDesignatedUser =
                testData.serviceDays[+gridDayIndex].serviceHours[+gridHourIndex].designatedUser

              expect(gridHourDesignatedUser).toEqual(expectedDesignatedUser!.name)
              expect(gridHour.classes()).toContain(
                USER_TAILWIND_COLORS[expectedDesignatedUser!.color]
              )
            })
          })
        })

        describe('service week without a designated user (empty)', () => {
          afterAll(() => {
            vi.mocked(useRoute).mockReturnValue({ params: testParams.service } as any)
          })

          beforeEach(async () => {
            // Asignamos un serviceWeekData vacío, es decir, sin usuarios asignados
            serviceStore.$patch({ selectedWeekData: testState.emptyServiceWeekData })
            await flushPromises()
          })

          it('renders not assigned when there is no designated user', async () => {
            wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
              const gridHourDesignatedUser = gridHour
                .find('[data-testid="grid-hour-designated-user"]')
                .text()
              const gridDayIndex = gridHour.attributes()['data-testdayindex']
              const gridHourIndex = gridHour.attributes()['data-testhourindex']

              const expectedDesignatedUser =
                testData.serviceDays[+gridDayIndex].serviceHours[+gridHourIndex].designatedUser

              expect(gridHourDesignatedUser).toEqual(expectedDesignatedUser ? 'Sin asignar' : '')
              expect(gridHour.classes()).toContain('bg-gray-400')
            })
          })
        })
      })
    })
  })
})
