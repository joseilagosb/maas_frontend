export const getFormattedHour = (hour: number): string => {
  if (hour < 10) {
    return `0${hour}:00`
  }
  if (hour === 24) {
    return '00:00'
  }

  return `${hour}:00`
}

export const getArrayFromInterval = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, k) => k + start)
}
