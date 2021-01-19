'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: 'Mainul Islam',
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,
};

const account2 = {
	owner: 'Yeasiin Arfat',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,
};

const account3 = {
	owner: 'Gazi Forhad',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: 'Saif Hassan',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const account5 = {
	owner: 'JT Niloy',
	movements: [430, 1000, 700, 50, 90, -200, 340, -300, -20],
	interestRate: 1,
	pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

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

// =======================================
// displaying movements
// =======================================
function displayMov(movements, sort = false) {
	containerMovements.innerHTML = '';

	const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

	movs.forEach((movment, index) => {
		const movType = movment > 0 ? 'deposit' : 'withdrawal';
		const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${movType}">${
			index + 1
		} ${movType}</div>
          <div class="movements__value">${movment}€</div>
        </div>
  `;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
}
// displayMov(account1.movements);

// ==========================================
// displaying total balance
// ==========================================

function displayBalance(acc) {
	acc.balance = acc.movements.reduce((acc, mov) => acc + mov);

	labelBalance.textContent = `${acc.balance}€`;
}
// displayBalance(account1.movements);

// ==========================================
// displaying total summary
// ==========================================
function displaySummary(acc) {
	const deposit = acc.movements
		.filter((mov) => mov > 0)
		.reduce((acc, index) => acc + index, 0);
	labelSumIn.textContent = `${deposit}€`;

	const withdraw = acc.movements
		.filter((mov) => mov < 0)
		.reduce((acc, index) => acc + index, 0);
	labelSumOut.textContent = `${Math.abs(withdraw)}€`;

	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((deposit) => (deposit * acc.interestRate) / 100)
		.filter((int, i, arr) => {
			// console.log(arr)
			return int >= 1;
		})
		.reduce((acc, curr) => acc + curr);
	labelSumInterest.textContent = `${Math.round(interest)}€`;
}
// displaySummary(account1.movements);

// ==========================================
// creating ursername
// ==========================================
const createUserName = function (accs) {
	accs.forEach(function (acc) {
		acc.userName = acc.owner
			.toLowerCase()
			.split(' ')
			.map((letter) => letter[0])
			.join('');
	});
};
function updateUI(account) {
	// display balance
	displayBalance(account);

	// display movements
	displayMov(account.movements);

	// display summary
	displaySummary(account);
}
// ============================================
// implementing login
// ============================================
let currentUser;
btnLogin.addEventListener('click', function (e) {
	// prevent form reloading
	e.preventDefault();

	const input = inputLoginUsername.value;
	const pin = Number(inputLoginPin.value);
	currentUser = accounts.find(
		(acc) => acc.userName === input && acc.pin === pin
	);
	if (currentUser) {
		// display the UI and Message
		containerApp.style.opacity = '1';
		labelWelcome.textContent = `Welcome Back, ${
			currentUser.owner.split(' ')[0]
		}`;
		inputLoginUsername.value = inputLoginPin.value = '';

		// clear input fields
		inputLoginUsername.blur();
		inputLoginPin.blur();

		// Update the UI
		updateUI(currentUser);
	} else {
		labelWelcome.textContent = `Username and password is incorrect!`;
	}
});
// ============================================
// implementing money transfer
// ============================================
btnTransfer.addEventListener('click', function (e) {
	// prevent form reloading
	e.preventDefault();
	const input = inputTransferTo.value;
	const amount = Number(inputTransferAmount.value);
	const user = accounts.find((acc) => acc.userName === input);
	if (
		user.userName !== currentUser.userName &&
		amount > 0 &&
		currentUser.balance > amount &&
		user
	) {
		currentUser.movements.push(-amount);
		user.movements.push(amount);

		// Update the UI
		updateUI(currentUser);

		// clear input fields
		inputTransferTo.value = inputTransferAmount.value = '';
		inputLoginUsername.blur();
		inputLoginPin.blur();
	}
});

// ============================================
// Implementing Loan
// ============================================

btnLoan.addEventListener('click', function (e) {
	e.preventDefault();
	const amount = Number(inputLoanAmount.value);

	const checkAmount = currentUser.movements.some(
		(mov) => mov >= amount * (10 / 100)
	);

	if (checkAmount && amount > 0) {
		currentUser.movements.push(amount);

		// updating UI
		updateUI(currentUser);

		// clearing input field
		inputLoanAmount.value = '';
		inputLoanAmount.blur();
	}
});

// ============================================
// implement sorting movements
// ============================================
let sorted = false;
btnSort.addEventListener('click', function () {
	displayMov(currentUser.movements, !sorted);
	sorted = !sorted;
});

// ============================================
// implementing close account
// ============================================
btnClose.addEventListener('click', function (e) {
	// prevent form reloading
	e.preventDefault();
	const userName = inputCloseUsername.value;
	const pin = Number(inputClosePin.value);
	const index = accounts.findIndex(
		(acc) => acc.userName === userName && acc.pin === pin
	);
	if (currentUser.userName === userName && currentUser.pin === pin) {
		accounts.splice(index, 1);
		containerApp.style.opacity = '0';
		labelWelcome.textContent = `Log in to get started
`;
	}

	// clear input fields
	inputCloseUsername.value = inputClosePin.value = '';
	inputCloseUsername.blur();
	inputClosePin.blur();
});

createUserName(accounts);
// console.log(accounts);


