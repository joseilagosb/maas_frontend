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

export const generateRandomNumbers = (count: number, min: number, max: number): number[] => {
  if (count > max - min + 1) {
    throw new Error('The number of random numbers cannot be greater than the range')
  }

  if (count < 1) {
    throw new Error('The number of random numbers must be greater than 0')
  }

  if (min > max) {
    throw new Error('The minimum value must be less than the maximum value')
  }

  const uniqueNumbers = new Set<number>()

  while (uniqueNumbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    uniqueNumbers.add(randomNumber)
  }

  return Array.from(uniqueNumbers)
}
