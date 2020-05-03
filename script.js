const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const inputEmptyAlert = document.querySelector('.input-empty-alert');
const selectTransactionType = document.querySelector('#transaction-type');
const selectedDefaultTransationType = document.querySelector('#selectedDefault');

const localStorageTransactions = JSON.parse(localStorage.getItem('@transactions'));
let transactions = localStorage.getItem('@transactions') !== null ? localStorageTransactions : [];

const removeTransaction = id => {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  initTransactions();
}

const addTransactionIntoDOM = ({ amount, name, id, transactionType }) => {
  const operator = transactionType === 'expense' ? '-' : '+';
  const CssClass = transactionType === 'expense' ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement('li');

  li.classList.add(CssClass);
  li.innerHTML = `
    ${name}
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `
  transactionsUl.append(li);
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
  .filter(value => value < 0)
  .reduce((accumulator, value) => accumulator + value, 0))
  .toFixed(2);

const getIncome = transactionsAmounts => transactionsAmounts
  .filter(value => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts
  .reduce((accumulator, transaction) => accumulator + transaction, 0)
  .toFixed(2);

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount);
  const total = getTotal(transactionsAmounts);
  const income = getIncome(transactionsAmounts);
  const expense = getExpenses(transactionsAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
}

const initTransactions = () => {
  transactionsUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
}

initTransactions();

const updateLocalStorage = () => {
  localStorage.setItem('@transactions', JSON.stringify(transactions));
}

const generateId = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionsAmounts, transactionType) => {
  
  transactionType === 'expense' ? transactionsAmounts = parseInt(`-${transactionsAmounts}`) : transactionsAmounts;

  transactions.push({
    id: generateId(),
    name: transactionName,
    amount: Number(transactionsAmounts),
    transactionType: transactionType,
  });

  console.log(transactions);
}

const clearInputs = () => {
  inputTransactionAmount.value = '';
  inputTransactionName.value = '';
  selectTransactionType.selectedIndex = 0;
}

const handleFormSubmit = event => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  
  const isSomeInputEmpty = transactionName === '' || transactionAmount === '' || transactionType === '';

  if(isSomeInputEmpty){
    inputEmptyAlert.classList.add('fade-in');
    setTimeout(() => {
      inputEmptyAlert.classList.remove('fade-in');
    }, 4000);
    return;
  }

  addToTransactionsArray(transactionName, transactionAmount, transactionType);
  initTransactions();
  updateLocalStorage();
  clearInputs();
}
let transactionType = '';
selectTransactionType.addEventListener('change', (e) => transactionType = e.target.value);
form.addEventListener('submit', handleFormSubmit);