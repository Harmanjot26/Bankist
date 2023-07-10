'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //we created shallow copy of the movements array because we didn't want to change the underlying array
  //sorting in asc order(but displaying bottom to up)
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate * 0.01)
    .filter((intr, i, arr) => {
      console.log(arr);
      return intr >= 1;
    })
    .reduce((acc, intr) => acc + intr, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUsenames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsenames(accounts);

const updateUI = function (acc) {
  //Display movements

  displayMovements(acc.movements);

  //Display balance

  calcDisplayBalance(acc);

  //Display summary

  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //prevents form from submitting

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //clear input fields

    inputLoginUsername.value = inputLoginPin.value = ''; //assignment operator works right to left

    //remove the cursor(making the field lose the focus)

    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //input type is form and it by default reloads on hitting enter

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update ui
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    //Add movement
    currentAccount.movements.push(loanAmount);

    //update ui
    updateUI(currentAccount);

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //delete account
    accounts.splice(index, 1);

    //hideUI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';

  inputClosePin.blur();
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

///////////////////////////////////////////////////////////////////
//console.log(accounts);

// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(function (name) {
//     return name[0];
//   })
//   .join('');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
let arr = ['a', 'b', 'c', 'd', 'e'];

// //Slice
//doesn't mutate the original array
console.log(arr.slice(2)); //c,d,e
console.log(arr.slice(2, 4)); //c,d
console.log(arr.slice(-2)); //d,e
console.log(arr.slice(-1)); //e
console.log(arr.slice(1, -2)); //b,c

//to create shallow copies
console.log(arr.slice());
//or
console.log([...arr]);

// // Splice
//second parameter is no. of elements to be deleted
arr.splice(-1);
console.log(arr); //a,b,c,d
arr.splice(1, 2);
console.log(arr); //a,d

// // Reverse
//mutates the original array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse());
console.log(arr2); //f,g,h,i,j

// // Concat
//doesn't mutate the original array
const letters = arr.concat(arr2);
console.log(letters); //a,b,c,d,e,f,g,h,i,j
//or
console.log([...arr, ...arr2]);

// // Join
//convers array to string, the parameter is the seperator
console.log(letters.join('-')); //a-b-c-d-e-f-g-h-i-j

// // At
//works on both strings and arrays
const arr1 = [23, 11, 64];
console.log(arr[0]);
//or
console.log(arr.at(0));

//getting the last array element
console.log(arr[arr.length - 1]);
//or
console.log(arr.slice(-1)[0]);
//or
console.log(arr.at(-1));

console.log('gurman', at(0));
console.log('gurman', at(-1));
*/

//////////////////////////////////////////////////////////////

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // For of method
//for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}.`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

// // For each method
// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}.`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// });
//0: function(200) gets called by the forEach method
//1: function(450) gets called by the forEach method and so on...

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}.`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});

// You can not break out of a forEach loop i.e., the continue and break statements do not work here.
*/

//////////////////////////////////////////////////////////////////

// // For each method for MAPS

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// // For each method for SETS

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
// key is same as value

// currenciesUnique.forEach(function(value, _, map){
//   console.log(`${value}: ${value}`);
// }) // _ is a throw-away variable (useless)
*/

///////////////////////////////////////////////////////////////////

/*
Coding Challenge #1

Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy.
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.
Your tasks:
Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the first and the last two dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's(corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy🐶")
4. Run the function for both test datasets
Test data:
§ Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3] § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
Hints: Use tools from all lectures in this section so far 😉 

GOOD LUCK 😀
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//   const newDogsJulia = [...dogsJulia].slice(1, -2);
//   const dogs = [...newDogsJulia, ...dogsKate];
//   dogs.forEach(function (dogAge, i) {
//     if (dogAge >= 3) {
//       console.log(
//         `Dog number ${i + 1} is an adult, and is ${dogAge} years old.`
//       );
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy🐶.`);
//     }
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

///////////////////////////////////////////////////////////////////

// // // MAP METHOD
// // doesn't mutate the original array but creates a brand new array
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// // const movementsUSD = movements.map(function (mov) {
// //   return mov * eurToUsd;
// // });

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// //using for of loop
// const movementsUSDfor = [];

// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUsd);
// }

// console.log(movementsUSDfor);

// const movementDescriptions = movements.map((mov, i) => {
//   `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//     mov
//   )}.`;
// });
// console.log(movementDescriptions);

//////////////////////////////////////////////////////////////////

// // FILTER METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdraws = movements.filter(mov => mov < 0);

// console.log(movements);
// console.log(deposits);
// console.log(withdraws);

// //using for of loop

// const depositsFor = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     depositsFor.push(mov);
//   }
// }
// console.log(depositsFor);

///////////////////////////////////////////////////////////////////

// // // REDUCE METHOD

// //balance
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// //accumulator->snowball
// // const balance = movements.reduce(function (acc, cur, i, arr) {
// //   console.log(`Iteration ${i}: ${acc}`);
// //   return acc + cur;
// // }, 0);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// //0 is the initial value of accumulator
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) {
//   balance2 += mov;
// }
// console.log(balance2);

// //maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// console.log(max);

//////////////////////////////////////////////////////////////////

/*
Coding Challenge #2
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.
Your tasks:
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4
2. Exclude all dogs that are less than 18 human years old (which   keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs(you shoulda lready know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets
Test data:
§ Data1:[5,2,4,1,15,8,3] § Data2:[16,6,10,5,6,1,4]
GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(adults);
//   // const avgAge = adults.reduce((acc, cur) => acc + cur, 0) / adults.length;
//   const avgAge = adults.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
//   console.log(avgAge);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

///////////////////////////////////////////////////////////////////

// const eurToUSD = 1.1;

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // Pipeline
// const totalDepositsinUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUSD)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsinUSD);

///////////////////////////////////////////////////////////////////

/*
Coding Challenge #3
Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time as an arrow function, and using chaining!
Test data:
§ Data1:[5,2,4,1,15,8,3] § Data2:[16,6,10,5,6,1,4]
GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

///////////////////////////////////////////////////////////////////

// // FIND METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const firstWithdrawal = movements.find(mov => mov < 0);

// console.log(firstWithdrawal);

// console.log(accounts);
// const account = accounts.filter(acc => acc.owner === 'Jessica Davis');

// console.log(account);

//////////////////////////////////////////////////////////////////

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // // INCLUDES METHOD
// //checks for equality
// console.log(movements.includes(-130));

// // // SOME METHOD
// //checks for a condition

// console.log(movements.some(mov => mov === -130));
// console.log(movements.some(mov => mov > 1500));

// // // EVERY METHOD
// //checks for a condition
// console.log(movements.every(mov=>mov>0));//false
// console.log(account4.movements.every(mov=>mov>0));//true

///////////////////////////////////////////////////////////////////

// // // SEPERATE CALLBACK
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

///////////////////////////////////////////////////////////////////

// // // FLAT METHOD and FLATMAP METHOD

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[1, [2, 3]], [[4, 5], 6], 7, 8];
// console.log(arr.flat(2));
// //goes 2 levels deep

// const accontMovements = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(accontMovements);

// const accontMovements2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(accontMovements2);
// //flatMap by default goes only 1 level deep

///////////////////////////////////////////////////////////////////

// // // SORT METHOD

// //strings
// const owners = [
//   'gurman',
//   'khushman',
//   'manraj',
//   'mandeep',
//   'jassi',
//   'dharmendra',
// ];

// console.log(owners.sort());
// //mutates the original string

// console.log(owners);

// //numbers
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements.sort());
// //by default, they get sorted as a string(result not as expected)

// //return < 0, a, b (keep order)
// //return > 0, b, a (switch order)

// // Ascending order

// // movements.sort((a, b) => {
// //   if (a < b) return -1;
// //   if (a > b) return 1;
// // });

// movements.sort((a, b) => a - b);

// console.log(movements);

// // Descending order

// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });

// movements.sort((a, b) => b - a);

// console.log(movements);

///////////////////////////////////////////////////////////////////

const arr = [1, 2, 3, 4, 5, 6, 7];

console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // Empty array and Fill method
const x = new Array(7);

console.log(x); //array of 7 empty elements

console.log(x.map(() => 5)); //doesn't work

x.fill(1, 3, 5); //fills 1 from position 3 to 5
console.log(x);

x.fill(1);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);
