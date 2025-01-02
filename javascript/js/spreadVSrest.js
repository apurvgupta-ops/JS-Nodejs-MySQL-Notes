// SPREAD OPERATOR
const arr = [1,2,3,4,5]
const arr1 = [1,2,3,4,5]
const name= 'Apurv'

// spread works for objects also for shallow copies.
const newArr = [...arr, ...arr1, 6,7,8]
console.log(newArr)
const newName = [...name]
console.log(newName)


// REST OPERATOR
// rest return array

function func(...num){
console.log(num)
}

// func(...arr)
func(1,2,3,4,5,6)


