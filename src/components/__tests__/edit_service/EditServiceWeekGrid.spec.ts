import type { ComponentPublicInstance } from 'vue'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoute } from 'vue-router'
import { DOMWrapper, flushPromises, VueWrapper } from '@vue/test-utils'

import EditServiceWeekGrid from '@/components/edit_service/EditServiceWeekGrid.vue'

import { getServiceWeek } from '@/services/api'

import { useServiceStore } from '@/stores/service'
import { useServiceAvailabilityStore } from '@/stores/service_availability'

import { testData, testParams, testState, testTime } from '@/test/data'
import { mockAPIService } from '@/test/mocks/services/api'
import { prepareFormatDateMethods, shallowMountWithPinia } from '@/test/utils'

import { addToDate, formatDateInSpanish, getFormattedHour } from '@/services/date'

import { USER_TAILWIND_COLORS } from '@/utils/constants'
import { mockDateService } from '@/test/mocks/services/date'
import { useAuthStore } from '@/stores/auth'

describe('EditServiceWeekGrid', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: testParams.service } as any)

  let wrapper: VueWrapper<ComponentPublicInstance<typeof EditServiceWeekGrid>>
  let serviceStore: ReturnType<typeof useServiceStore>
  let serviceAvailabilityStore: ReturnType<typeof useServiceAvailabilityStore>

  const errorMessageSelector = '[data-testid="error-message"]'
  const gridSelector = '[data-testid="grid"]'

  afterAll(() => {
    vi.restoreAllMocks()
  })

  beforeEach(async () => {
    wrapper = shallowMountWithPinia(EditServiceWeekGrid, {
      initialState: {
        auth: testState.userAuthStore,
        service: testState.serviceStore
      },
      stubActions: false
    })
    await flushPromises()
    serviceStore = useServiceStore()
    serviceAvailabilityStore = useServiceAvailabilityStore()
  })

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
            await flushPromises()
          })

          it('runs the generateEmptyServiceWeek action', () => {
            expect(serviceStore.generateEmptyServiceWeek).toHaveBeenCalledTimes(1)
          })
        })
      })

      describe('user hours assignments', () => {
        beforeEach(async () => {
          serviceStore.$patch({ userHoursAssignments: [] })
          await flushPromises()
        })

        it('runs the fetchServiceWeek action', () => {
          expect(serviceStore.fetchServiceWeek).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('actions', () => {
      beforeEach(async () => {
        serviceStore.$patch({ userHoursAssignments: [...testData.userHoursAssignments] })
        await flushPromises()
      })

      describe('fetchServiceWeek', () => {
        describe('success', () => {
          it('calls the generateAvailability action', async () => {
            expect(serviceAvailabilityStore.generateAvailability).toHaveBeenCalledTimes(1)
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
            serviceStore.$patch({ userHoursAssignments: [...testData.userHoursAssignments] })
            await flushPromises()
          })

          it('renders error if it fails', async () => {
            expect(wrapper.find(errorMessageSelector).exists()).toBe(true)
          })
        })
      })

      describe('generateEmptyServiceWeek', () => {
        it('renders the grid if it succeeds', async () => {
          expect(wrapper.find(gridSelector).exists()).toBe(true)
        })

        it('renders error if it fails', async () => {
          vi.mocked(getServiceWeek).mockImplementationOnce(async () => {
            return Promise.reject(new Error('error'))
          })
          serviceStore.$patch({ userHoursAssignments: [...testData.userHoursAssignments] })
          await flushPromises()

          expect(wrapper.find(errorMessageSelector).exists()).toBe(true)
        })
      })

      describe('generateAvailability', () => {
        it('renders the grid if it succeeds', async () => {
          expect(wrapper.find(gridSelector).exists()).toBe(true)
        })

        it('renders error if it fails', async () => {
          vi.mocked(getServiceWeek).mockImplementationOnce(async () => {
            return Promise.reject(new Error('error'))
          })
          serviceStore.$patch({ userHoursAssignments: [...testData.userHoursAssignments] })
          await flushPromises()

          expect(wrapper.find(errorMessageSelector).exists()).toBe(true)
        })
      })
    })
  })

  describe('render', () => {
    let gridDays: DOMWrapper<Element>[]
    const gridDaysSelector = '[data-testid="grid-day"]'

    beforeEach(async () => {
      // Limpiamos el número de llamados a getFormattedHour y preparamos la secuencia de llamados
      // para formatDateInSpanish
      vi.mocked(getFormattedHour).mockClear()
      prepareFormatDateMethods()

      serviceStore.$patch({ ...testState.showServiceStore })
      await flushPromises()
      gridDays = wrapper.findAll(gridDaysSelector)
    })

    describe('grid', () => {
      describe('days', () => {
        const gridDaysSelector = '[data-testid="grid-day"]'
        const gridDayDateSelector = '[data-testid="grid-day-date"]'

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
            const gridDayDate = gridDay.find(gridDayDateSelector).text()
            expect(gridDayDate).toEqual(testTime.date.inSpanish[dayIndex])
          })
        })
      })

      describe('header', () => {
        const gridHeaderUserSelector = '[data-testid="grid-header-user"]'
        it('renders the correct number of columns', () => {
          gridDays.forEach((gridDay) => {
            const gridDayHeaderUsers = gridDay.findAll(gridHeaderUserSelector)
            expect(gridDayHeaderUsers.length).toEqual(testData.userHoursAssignments.length)
          })
        })

        it('renders the columns with the correct color', () => {
          gridDays.forEach((gridDay) => {
            gridDay.findAll(gridHeaderUserSelector).forEach((gridHeaderUser, index) => {
              expect(gridHeaderUser.classes()).toContain(
                USER_TAILWIND_COLORS[testData.userHoursAssignments[index].color]
              )
            })
          })
        })

        it('renders the columns with the correct width', () => {
          gridDays.forEach((gridDay) => {
            gridDay.findAll(gridHeaderUserSelector).forEach((gridHeaderUser) => {
              expect(gridHeaderUser.attributes()['style']).toEqual(
                `width: calc(${70 / testData.userHoursAssignments.length}%);`
              )
            })
          })
        })
      })

      describe('hours', () => {
        const gridHoursSelector = '[data-testid="grid-hour"]'
        const gridHourTimeSelector = '[data-testid="grid-hour-time"]'

        const expectedTotalHours = testData.serviceDays.reduce(
          (acc, day) => acc + day.serviceHours.length,
          0
        )

        it('renders the correct number of hours', () => {
          expect(wrapper.findAll(gridHoursSelector).length).toEqual(expectedTotalHours)
        })

        it('calls the formatting methods', () => {
          expect(getFormattedHour).toHaveBeenCalledTimes(expectedTotalHours * 2)
        })

        it('renders each hour in the correct format', () => {
          const expectedServiceHours = testData.serviceHours
          wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
            const gridHourTime = gridHour.find(gridHourTimeSelector).text()
            const gridHourIndex = gridHour.attributes()['data-testhourindex']
            const expectedHour = expectedServiceHours[+gridHourIndex].hour
            expect(gridHourTime).toEqual(expectedHour + ':00' + '-' + (expectedHour + 1) + ':00')
          })
        })

        describe('users', () => {
          const gridHourUserSelector = '[data-testid="grid-hour-user"]'
          const gridHourUserCheckboxSelector = '[data-testid="grid-hour-user-checkbox"]'

          const currentUser = testData.user

          it('renders the correct number of users', () => {
            wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
              const gridHourUsers = gridHour.findAll(gridHourUserSelector)
              expect(gridHourUsers.length).toEqual(testData.userHoursAssignments.length)
            })
          })

          it('renders the users with the correct color', () => {
            wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
              gridHour.findAll(gridHourUserSelector).forEach((gridHourUser, index) => {
                expect(gridHourUser.classes()).toContain(
                  USER_TAILWIND_COLORS[testData.userHoursAssignments[index].color]
                )
              })
            })
          })

          it('renders enabled checkboxes for current user', () => {
            wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
              const gridHourUser = gridHour.find(`[data-testuserid="${currentUser.id}"]`)
              const gridHourUserCheckbox = gridHourUser.find(gridHourUserCheckboxSelector)
              expect(gridHourUserCheckbox.attributes().disabled).toBeUndefined()
            })
          })

          it('renders disabled checkboxes for other users', () => {
            wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
              const gridHourUsers = gridHour.findAll(
                `[data-testuserid]:not([data-testuserid="${currentUser.id}"])`
              )
              gridHourUsers.forEach((gridHourUser) => {
                const gridHourUserCheckbox = gridHourUser.find(gridHourUserCheckboxSelector)
                expect(gridHourUserCheckbox.attributes().disabled).toBeDefined()
              })
            })
          })

          it('renders the users with the correct width', () => {
            wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
              gridHour.findAll(gridHourUserSelector).forEach((gridHourUser) => {
                expect(gridHourUser.attributes().style).toEqual(
                  `width: calc(${70 / testData.userHoursAssignments.length}%);`
                )
              })
            })
          })

          it('renders checked states as expected', async () => {
            const expectedAvailability = testData.serviceAvailability.serviceDays[0]
            wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
              const gridHourIndex = gridHour.attributes()['data-testhourindex']
              const expectedCheckboxValues =
                expectedAvailability.serviceHours[+gridHourIndex].available

              const gridHourUsers = gridHour.findAll(gridHourUserSelector)
              const hourCheckboxValues = gridHourUsers.reduce<Record<string, boolean>>(
                (acc, gridHourUser) => {
                  const userId = gridHourUser.attributes()['data-testuserid']
                  const gridHourUserCheckbox: DOMWrapper<HTMLInputElement> = gridHourUser.find(
                    gridHourUserCheckboxSelector
                  )
                  acc[userId] = gridHourUserCheckbox.element.checked
                  return acc
                },
                {}
              )
              expect(hourCheckboxValues).toEqual(expectedCheckboxValues)
            })
          })

          it('triggers availability change when a user is checked', () => {
            const serviceAvailabilityStore = useServiceAvailabilityStore()
            const firstCheckbox: DOMWrapper<HTMLInputElement> = wrapper
              .find(gridHoursSelector)
              .find(gridHourUserCheckboxSelector)

            expect(serviceAvailabilityStore.changedAvailability).toEqual(false)

            firstCheckbox.setValue(!firstCheckbox.element.checked)

            expect(serviceAvailabilityStore.changedAvailability).toEqual(true)
          })
        })
      })
    })
  })
})
