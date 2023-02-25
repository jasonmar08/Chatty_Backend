// Given an array of integers, find the largest product yielded from three of the integers.

// Greatest product is either (min1 * min2 * max1 || max1 * max2 * max3)

var unsortedArray1 = [-10, 7, 29, 30, 5, -10, -70] //21000
var unsortedArray2 = [-5, -17, -3, -9, -18] // -135

const productInteger = (arr) => {
  let sortedNumbers = arr.sort((a, b) => a - b) // Sorting array elements from least to greatest number

  // Assigning variables to 3 greatest elements
  let max1 = arr[arr.length - 1]
  let max2 = arr[arr.length - 2]
  let max3 = arr[arr.length - 3]
  console.log('Sorted Numbers:', sortedNumbers) // Checking if sorting is correct
  console.log('Max Three:', max1, max2, max3) // Checking if max 3 numbers are correct

  // Assigning variables to lowest 2 elements
  let min1 = arr[0]
  let min2 = arr[1]
  console.log('Min Two:', min1, min2) // Checking if min 2 numbers are correct

  // Finding product for both combinations
  let product1 = min1 * min2 * max1
  let product2 = max1 * max2 * max3

  return Math.max(product1, product2)
}
console.log('Largest product yielded:', productInteger(unsortedArray2))
