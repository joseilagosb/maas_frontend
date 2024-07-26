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

export const addToSortedArray = (array: number[], value: number) => {
  const result = [...array]
  let min = result[0]
  let max = result[array.length - 1]

  if (value < min) {
    result.unshift(value)
    return result
  }

  if (value > max) {
    result.push(value)
    return result
  }

  while (min < max) {
    const middle = Math.floor((min + max) / 2)
    if (middle < value) {
      min = middle + 1
    } else if (middle > value) {
      max = middle - 1
    } else {
      result.splice(middle, value)
      result.push(value)
      break
    }
  }

  return result
}
