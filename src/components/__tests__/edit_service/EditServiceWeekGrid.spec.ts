import type { ComponentPublicInstance } from 'vue'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoute } from 'vue-router'
import { DOMWrapper, flushPromises, VueWrapper } from '@vue/test-utils'

import EditServiceWeekGrid from '@/components/edit_service/EditServiceWeekGrid.vue'

import { getServiceWeek, getUsers } from '@/services/api'

import { useServiceStore } from '@/stores/service'
import { useServiceAvailabilityStore } from '@/stores/service_availability'

import { testData, testState, testTime } from '@/test/data'
import { mockAPIService } from '@/test/mocks/services/api'
import { prepareFormatDateMethods, shallowMountWithPinia } from '@/test/utils'

import { addToDate, formatDateInSpanish, getFormattedHour } from '@/services/date'

import { USER_TAILWIND_COLORS } from '@/utils/constants'

describe('EditServiceWeekGrid', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week } } as any)

  const errorMessageSelector = '[data-testid="error-message"]'
  const gridSelector = '[data-testid="grid"]'

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('mounted', () => {
    describe('active weeks does not contain selected week', () => {
      const serviceWeeksWithoutCurrentWeek = [...testData.serviceWeeks]
      serviceWeeksWithoutCurrentWeek[0].week = testTime.week - 1
      const serviceStoreWithoutWeekData = {
        ...testState.serviceStore,
        activeWeeks: serviceWeeksWithoutCurrentWeek.map((serviceWeek: any) => serviceWeek.week)
      }

      let wrapper: VueWrapper<ComponentPublicInstance<typeof EditServiceWeekGrid>>
      beforeEach(async () => {
        wrapper = shallowMountWithPinia(EditServiceWeekGrid, {
          initialState: { ...testState.user, service: { ...serviceStoreWithoutWeekData } },
          stubActions: false
        })
        await flushPromises()
      })

      it('runs the generateEmptyServiceWeek action', () => {
        const serviceStore = useServiceStore()
        expect(serviceStore.generateEmptyServiceWeek).toHaveBeenCalledTimes(1)
      })

      it('runs the generateAvailability action', () => {
        const serviceAvailabilityStore = useServiceAvailabilityStore()
        expect(serviceAvailabilityStore.generateAvailability).toHaveBeenCalledTimes(1)
      })

      it('renders the grid', () => {
        expect(wrapper.find(gridSelector).exists()).toBe(true)
      })
    })

    describe('service week fetch', () => {
      let wrapper: VueWrapper<ComponentPublicInstance<typeof EditServiceWeekGrid>>

      it('runs the fetchServiceWeek action', async () => {
        shallowMountWithPinia(EditServiceWeekGrid, {
          initialState: { ...testState.user, service: { ...testState.serviceStore } },
          stubActions: false
        })
        await flushPromises()

        const serviceStore = useServiceStore()
        expect(serviceStore.fetchServiceWeek).toHaveBeenCalledTimes(1)
      })

      describe('success', () => {
        beforeEach(async () => {
          wrapper = shallowMountWithPinia(EditServiceWeekGrid, {
            initialState: { ...testState.user, service: { ...testState.serviceStore } },
            stubActions: false
          })
          await flushPromises()
        })

        it('runs the generateAvailability action', async () => {
          const serviceAvailabilityStore = useServiceAvailabilityStore()
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
          wrapper = shallowMountWithPinia(EditServiceWeekGrid, {
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
    let wrapper: VueWrapper<ComponentPublicInstance<typeof EditServiceWeekGrid>>
    let gridDays: DOMWrapper<Element>[]
    const gridDaysSelector = '[data-testid="grid-day"]'

    beforeEach(async () => {
      prepareFormatDateMethods()
      wrapper = shallowMountWithPinia(EditServiceWeekGrid, {
        initialState: { ...testState.user, service: { ...testState.editServiceStore } },
        stubActions: false
      })
      await flushPromises()
      gridDays = wrapper.findAll(gridDaysSelector)
    })

    describe('days', () => {
      it('renders the correct number of days', () => {
        expect(gridDays.length).toEqual(testData.serviceDays.length)
      })

      it('calls the formatting methods', () => {
        expect(addToDate).toHaveBeenCalledTimes(testData.serviceDays.length)
        expect(formatDateInSpanish).toHaveBeenCalledTimes(testData.serviceDays.length)
      })

      it('renders the date in the correct format', () => {
        for (let i = 0; i < gridDays.length; i++) {
          const gridDayDate = gridDays[i].find('[data-testid="grid-day-date"]').text()
          expect(gridDayDate).toEqual(testTime.date.inSpanish[i])
        }
      })
    })

    describe('header', () => {
      const gridHeaderUserSelector = '[data-testid="grid-header-user"]'
      it('renders the correct number of columns', () => {
        gridDays.forEach((gridDay) => {
          const gridDayHeaderUsers = gridDay.findAll(gridHeaderUserSelector)
          expect(gridDayHeaderUsers.length).toEqual(testData.users.length)
        })
      })

      it('renders the columns with the correct color', () => {
        gridDays.forEach((gridDay) => {
          gridDay.findAll(gridHeaderUserSelector).forEach((gridHeaderUser, index) => {
            expect(gridHeaderUser.classes()).toContain(
              USER_TAILWIND_COLORS[testData.users[index].color]
            )
          })
        })
      })

      it('renders the columns with the correct width', () => {
        const totalUsers = testData.users.length
        gridDays.forEach((gridDay) => {
          gridDay.findAll(gridHeaderUserSelector).forEach((gridHeaderUser) => {
            expect(gridHeaderUser.attributes()['style']).toEqual(
              `width: calc(${70 / totalUsers}%);`
            )
          })
        })
      })
    })

    describe('hours', () => {
      let wrapper: VueWrapper<ComponentPublicInstance<typeof EditServiceWeekGrid>>

      const gridHoursSelector = '[data-testid="grid-hour"]'

      const totalHours = testData.serviceDays.reduce((acc, day) => acc + day.serviceHours.length, 0)

      beforeEach(async () => {
        vi.mocked(getFormattedHour).mockClear()
        wrapper = shallowMountWithPinia(EditServiceWeekGrid, {
          initialState: { ...testState.user, service: { ...testState.editServiceStore } },
          stubActions: false
        })
        await flushPromises()
      })

      it('renders the correct number of hours', () => {
        expect(wrapper.findAll(gridHoursSelector).length).toEqual(totalHours)
      })

      it('calls the formatting methods', () => {
        expect(getFormattedHour).toHaveBeenCalledTimes(totalHours * 2)
      })

      it('renders each hour in the correct format', () => {
        wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
          const gridHourTime = gridHour.find('[data-testid="grid-hour-time"]').text()
          const gridDayIndex = gridHour.attributes()['data-testdayindex']
          const gridHourIndex = gridHour.attributes()['data-testhourindex']
          const expectedHour = testData.serviceDays[+gridDayIndex].serviceHours[+gridHourIndex].hour
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
            expect(gridHourUsers.length).toEqual(testData.users.length)
          })
        })

        it('renders the users with the correct color', () => {
          wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
            gridHour.findAll(gridHourUserSelector).forEach((gridHourUser, index) => {
              expect(gridHourUser.classes()).toContain(
                USER_TAILWIND_COLORS[testData.users[index].color]
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
                `width: calc(${70 / testData.users.length}%);`
              )
            })
          })
        })

        it('renders checked states as expected', async () => {
          const expectedCheckboxValues = testData.users.map((user) => user.id === currentUser.id)
          wrapper.findAll(gridHoursSelector).forEach((gridHour) => {
            const gridHourUsers = gridHour.findAll(gridHourUserSelector)
            const hourCheckboxValues = gridHourUsers.reduce<boolean[]>((acc, gridHourUser) => {
              const gridHourUserCheckbox: DOMWrapper<HTMLInputElement> = gridHourUser.find(
                gridHourUserCheckboxSelector
              )
              acc.push(gridHourUserCheckbox.element.checked)
              return acc
            }, [])
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
