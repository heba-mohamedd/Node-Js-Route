// A. Part 1:
// 1. Convert the string "123" to a number and add 7.
console.log(Number("123") + 7);
console.log("********************************************");

// 2. Check if the given variable is falsy and return "Invalid" if it is.
//falsy ==> 0 , "" , null , undefined , NAN , false
var input_value = undefined;
if (!input_value) console.log("Invalid");
console.log("********************************************");

//3. Use for loop to print all numbers between 1 and 10, skipping even numbers using continue
for (let index = 1; index < 10; index++) {
  if (index % 2 === 0) {
    continue;
  }
  console.log(index);
}
console.log("********************************************");

// 4. Create an array of numbers and return only the even numbers using filter method.

let arrayOfNumbers = [1, 2, 3, 4, 5];
console.log(arrayOfNumbers.filter((number) => number % 2 === 0));
console.log("********************************************");

// 5. Use the spread operator to merge two arrays, then return the merged array.

let array_1 = [1, 2, 3];
let array_2 = [4, 5, 6];
let mergedTwoArrays = [...array_1, ...array_2];
console.log(mergedTwoArrays);
console.log("********************************************");

// 6. Use a switch statement to return the day of the week given a number (1 = Sunday ...., 7 = Saturday).
// • Input Example: 2
// • Output Example: “Monday”
let day = 2;
switch (day) {
  case 1:
    console.log("Sunday");
    break;
  case 2:
    console.log("Monday");
    break;
  case 3:
    console.log("Tuesday");
    break;
  case 4:
    console.log("Wednesday");
    break;
  case 5:
    console.log("Thursday");
    break;
  case 6:
    console.log("Friday");
    break;
  case 7:
    console.log("Saturday");
    break;

  default:
    console.log("Invalid");
    break;
}
console.log("********************************************");

// 7. Create an array of strings and return their lengths using map method

let arrayOfString = ["a", "ab", "abc", "Heba"];
let arrayOfLenghts = arrayOfString.map((element) => element.length);
console.log(arrayOfLenghts);
console.log("********************************************");

// 8. Write a function that checks if a number is divisible by 3 and 5.

function is_divisible_by_3_and_5(number) {
  if (number % 3 == 0 && number % 5 == 0) {
    console.log("Divisible by both");
  } else console.log("can not Divisible by both");
}
is_divisible_by_3_and_5(300);
console.log("********************************************");

// 9. Write a function using arrow syntax to return the square of a number

const square_of_number = (number) => {
  //   return number * number;
  return Math.pow(number, 2);
};
console.log(square_of_number(5));
console.log("********************************************");

// 10.Write a function that destructures an object to extract values and returns a formatted string. (0.5 Grade)

const person = { name: "John", age: 25 };
function destructures_object(object) {
  const { name, age } = object;
  console.log(`${name} is ${age} years old`);
}

destructures_object(person);
console.log("********************************************");

// 11.Write a function that accepts multiple parameters (two or more) and returns their sum.
// • Input Example: 1, 2, 3, 4, 5
// • Output Example: 15

function sumAll() {
  let sum = 0;
  for (let index = 0; index < arguments.length; index++) {
    sum += arguments[index];
  }

  return sum;
}
console.log(sumAll(1, 2, 3, 4, 5, 6, 7));
console.log("********************************************");

// 12. Write a function that returns a promise which resolves after 3 seconds with a 'Success' message. (0.5 Grade)
// • Output Example: “Success”

function simplePromise() {
  let promise = new Promise((resolves, reject) => {
    setTimeout(() => resolves("Success"), 3000);
  });
  promise.then((value) => console.log(value)).catch((err) => console.log(err));
}
simplePromise();
console.log("********************************************");

// 13. Write a function to find the largest number in an array. (0.5 Grade)
// • Input Example: [1, 3, 7, 2, 4]
// • Output Example: 7

function largest_number(array) {
  //   let maxNumber = 0;
  //   for (let index = 0; index < array.length; index++) {
  //     if (array[index] > maxNumber) {
  //       maxNumber = array[index];
  //     }
  //   }
  //   return maxNumber;
  let maxNumber = Math.max(...array);
  return maxNumber;
}
console.log(largest_number([1, 3, 7, 2, 4]));
console.log("********************************************");

// 14. Write a function that takes an object and returns an array containing only its keys. (0.5 Grade)
// • Input Example: name: "John", age: 30}
// • Output Example: ["name", "age"]

function getKeys(object) {
  let keys = Object.keys(object);
  return keys;
}
console.log(getKeys(["hello", "worlds"])); //["0" , "1"]
console.log(getKeys({ name: "John", age: 30 }));
console.log("********************************************");

// 15. Write a function that splits a string into an array of words based on spaces. (0.5 Grade)
// • Input: "The quick brown fox"
// • Output: ["The", "quick", "brown", "fox"]

function splits_a_string(str) {
  return str.split(" ");
}

console.log(splits_a_string("The quick brown fox"));
console.log("********************************************");
