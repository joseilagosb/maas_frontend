import type { ComponentPublicInstance } from 'vue'
import { describe, it, expect, vi, afterAll, beforeEach, beforeAll } from 'vitest'
import { useRoute, useRouter } from 'vue-router'
import { flushPromises, VueWrapper } from '@vue/test-utils'

import ServiceOverview from '../ServiceOverview.vue'

import { useServiceStore } from '@/stores/service'

import { getService, getUserHoursAssignments } from '@/services/api'
import { formatDate } from '@/services/date'

import { testData, testParams, testState, testTime } from '@/test/data'

import { mockDateService } from '@/test/mocks/services/date'
import { shallowMountWithPinia } from '@/test/utils'
import { USER_TAILWIND_COLORS } from '@/utils/constants'

describe('ServiceOverview', () => {
  vi.mock('vue-router')

  const serviceSelector = '[data-testid="service"]'
  const errorMessageSelector = '[data-testid="error-message"]'

  vi.mocked(useRoute).mockReturnValue({ params: testParams.service } as any)
  vi.mocked(useRouter).mockReturnValue({ replace: vi.fn() } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('setup', () => {
    let wrapper: VueWrapper<ComponentPublicInstance<typeof ServiceOverview>>

    beforeEach(async () => {
      wrapper = shallowMountWithPinia(ServiceOverview, {
        initialState: { auth: testState.userAuthStore },
        stubActions: false
      })
      await flushPromises()
    })

    describe('mounted', () => {
      it('runs the fetchService action', async () => {
        const serviceStore = useServiceStore()
        expect(serviceStore.fetchService).toHaveBeenCalledTimes(1)
      })
    })

    describe('watch', () => {
      let serviceStore: ReturnType<typeof useServiceStore>
      beforeEach(async () => {
        serviceStore = useServiceStore()
      })

      describe('selected week', async () => {
        it('runs the fetchUserHoursAssignments action', () => {
          serviceStore.$patch({ selectedWeek: testTime.week - 1 })
          expect(serviceStore.fetchUserHoursAssignments).toHaveBeenCalledTimes(1)
        })
      })

      describe('service', () => {
        it('runs the fetchUserHoursAssignments action', () => {
          serviceStore.$patch({ service: undefined })
          expect(serviceStore.fetchUserHoursAssignments).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('actions', () => {
      describe('service fetch', () => {
        it('renders service if it succeeds', async () => {
          expect(wrapper.find(serviceSelector).exists()).toBe(true)
        })

        it('renders error if it fails', async () => {
          vi.mocked(getService).mockImplementationOnce(async () => {
            return Promise.reject(new Error('error'))
          })
          const wrapperWithError = shallowMountWithPinia(ServiceOverview, {
            initialState: { auth: testState.userAuthStore },
            stubActions: false
          })
          await flushPromises()

          expect(wrapperWithError.find(errorMessageSelector).exists()).toBe(true)
        })
      })

      describe('user hours assignments fetch', () => {
        it('renders service if it succeeds', async () => {
          expect(wrapper.find(serviceSelector).exists()).toBe(true)
        })

        it('renders error if it fails', async () => {
          vi.mocked(getUserHoursAssignments).mockImplementationOnce(async () => {
            return Promise.reject(new Error('error'))
          })
          const wrapperWithError = shallowMountWithPinia(ServiceOverview, {
            initialState: { auth: testState.userAuthStore },
            stubActions: false
          })
          await flushPromises()

          expect(wrapperWithError.find(errorMessageSelector).exists()).toBe(true)
        })
      })
    })
  })

  describe('render', () => {
    let wrapper: VueWrapper<ComponentPublicInstance<typeof ServiceOverview>>
    beforeEach(async () => {
      wrapper = shallowMountWithPinia(ServiceOverview, {
        initialState: { auth: testState.userAuthStore },
        stubActions: false
      })
      await flushPromises()
    })

    describe('week selector', () => {
      const weekSelectSelector = '[data-testid="week-select"]'

      describe('when the route name is show-service-week', () => {
        beforeEach(async () => {
          vi.mocked(useRoute).mockReturnValue({
            name: 'show-service-week',
            params: testParams.service
          } as any)

          wrapper = shallowMountWithPinia(ServiceOverview, {
            initialState: { auth: testState.userAuthStore, service: testState.showServiceStore },
            stubActions: false
          })
          await flushPromises()
        })

        it('exists', () => {
          expect(wrapper.find(weekSelectSelector).exists()).toBe(true)
        })

        it('has the correct weeks', () => {
          const weekOptions = wrapper.find(weekSelectSelector).findAll('option')
          const weekOptionsFromComponentState = wrapper.vm.weekOptions
          expect(weekOptions.map((weekOption) => +weekOption.element.value)).toEqual(
            weekOptionsFromComponentState
          )
        })

        it('shows five weeks in the future', () => {
          const weekOptions = wrapper.find(weekSelectSelector).findAll('option').slice(-5)
          const serviceStore = useServiceStore()

          for (const weekOption of weekOptions) {
            expect(serviceStore.activeWeeks).not.toContain(+weekOption.element.value)
          }
        })

        it('renders the correct text in the options', () => {
          const weekOptions = wrapper.find(weekSelectSelector).findAll('option')
          const weekOptionsFromComponentState = wrapper.vm.weekOptions

          for (let i = 0; i < weekOptions.length; i++) {
            const weekOption = weekOptions[i]
            expect(weekOption.element.text).toEqual(
              `Semana ${weekOptionsFromComponentState[i]} del ${testTime.year}`
            )
          }
        })

        it('changes the route when a week is selected', async () => {
          const weekSelect = wrapper.find(weekSelectSelector)
          const firstOption = weekSelect.findAll('option')[0]
          const router = useRouter()

          await weekSelect.setValue(firstOption.element.value)

          expect(router.replace).toHaveBeenCalledWith({
            params: { week: +firstOption.element.value }
          })
        })
      })

      describe('when the route name is edit-service-week', () => {
        afterAll(() => {
          vi.mocked(useRoute).mockReturnValue({ params: testParams.service } as any)
        })

        beforeEach(async () => {
          vi.mocked(useRoute).mockReturnValue({
            name: 'edit-service-week',
            params: testParams.service
          } as any)

          wrapper = shallowMountWithPinia(ServiceOverview, {
            initialState: { auth: testState.userAuthStore, service: testState.showServiceStore },
            stubActions: false
          })
          await flushPromises()
        })

        it('is disabled', () => {
          expect(wrapper.find(weekSelectSelector).attributes().disabled).toBeDefined()
        })
      })
    })

    describe('selected week range text', () => {
      let wrapper: VueWrapper<ComponentPublicInstance<typeof ServiceOverview>>

      beforeEach(async () => {
        vi.mocked(formatDate)
          .mockImplementationOnce(() => testTime.date.firstDayOfWeek)
          .mockImplementationOnce(() => testTime.date.lastDayOfWeek)
        wrapper = shallowMountWithPinia(ServiceOverview, {
          initialState: { auth: testState.userAuthStore },
          stubActions: false
        })
        await flushPromises()
      })

      afterAll(() => {
        vi.mocked(formatDate).mockImplementation(mockDateService.formatDate)
      })

      const selectedWeekRangeTextSelector = '[data-testid="selected-week-range-text"]'

      it('exists', () => {
        expect(wrapper.find(selectedWeekRangeTextSelector).exists()).toBe(true)
      })

      it('renders with the correct text', () => {
        const selectedWeekRangeText = wrapper.find(selectedWeekRangeTextSelector).text()

        expect(selectedWeekRangeText).toEqual(
          `del ${testTime.date.firstDayOfWeek} al ${testTime.date.lastDayOfWeek}`
        )
      })
    })

    describe('assigned hours count', () => {
      const noUserHoursAssignmentsMessageSelector =
        '[data-testid="no-user-hours-assignments-message"]'
      const unassignedHoursMessageSelector = '[data-testid="unassigned-hours-message"]'

      describe('week doesnt contain data', () => {
        beforeEach(async () => {
          // Modificamos el mock de getUserHoursAssignments para que devuelva cero horas asignadas
          vi.mocked(getUserHoursAssignments).mockImplementationOnce(() => Promise.resolve([]))

          const serviceStore = useServiceStore()
          serviceStore.$patch((state) => {
            state.selectedWeek = state.selectedWeek + 1
          })
          await wrapper.vm.$nextTick()
        })

        it('shows no user hours assignments message if week doesnt contain data', async () => {
          expect(wrapper.find(noUserHoursAssignmentsMessageSelector).exists()).toBe(true)
        })

        it('shows the correct text in the unassigned hours count', () => {
          const totalHours = testData.serviceWorkingDays.reduce(
            (acc, curr) => curr.to - curr.from + 1 + acc,
            0
          )

          expect(wrapper.find(unassignedHoursMessageSelector).text()).toContain(
            `${totalHours} horas disponibles`
          )
        })
      })

      describe('week contains data', () => {
        const userHoursAssignmentsSelector = '[data-testid="user-hours-assignments"]'

        it('renders the correct users count', () => {
          expect(wrapper.findAll(userHoursAssignmentsSelector).length).toBe(
            testData.userHoursAssignments.length
          )
        })

        it('renders the correct user colors', () => {
          const userHoursAssignments = wrapper.findAll(userHoursAssignmentsSelector)
          expect(userHoursAssignments.length).toBe(testData.userHoursAssignments.length)
          userHoursAssignments.forEach((userHoursAssignment, userIndex) => {
            expect(userHoursAssignment.classes()).toContain(
              USER_TAILWIND_COLORS[testData.userHoursAssignments[userIndex].color]
            )
          })
        })

        it('renders the correct name and count', () => {
          wrapper
            .findAll(userHoursAssignmentsSelector)
            .forEach((userHoursAssignment, userIndex) => {
              expect(userHoursAssignment.text()).toContain(
                testData.userHoursAssignments[userIndex].name
              )
              expect(userHoursAssignment.text()).toContain(
                testData.userHoursAssignments[userIndex].hoursCount
              )
            })
        })

        it('shows the correct text in the unassigned hours count', () => {
          const totalHours = testData.serviceWorkingDays.reduce(
            (acc, curr) => curr.to - curr.from + 1 + acc,
            0
          )
          const unassignedHours = testData.userHoursAssignments.reduce(
            (acc, curr) => curr.hoursCount + acc,
            0
          )

          expect(wrapper.find(unassignedHoursMessageSelector).text()).toContain(
            `${totalHours - unassignedHours} horas sin asignar`
          )
        })
      })
    })
  })
})
