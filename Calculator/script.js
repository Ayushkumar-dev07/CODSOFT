// ============================================
// Grab elements from the DOM
// ============================================
const previousOperandEl = document.getElementById("previous-operand");
const currentOperandEl = document.getElementById("current-operand");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete");

// ============================================
// Calculator state
// ============================================
let currentOperand = "0";
let previousOperand = "";
let chosenOperator = undefined;
let shouldResetScreen = false;

// ============================================
// Update the display screen
// ============================================
function updateDisplay() {
  currentOperandEl.textContent = currentOperand;

  if (chosenOperator != null) {
    previousOperandEl.textContent = `${previousOperand} ${chosenOperator}`;
  } else {
    previousOperandEl.textContent = "";
  }
}

// ============================================
// Append a number or decimal point
// ============================================
function appendNumber(number) {
  // Prevent multiple decimal points
  if (number === "." && currentOperand.includes(".")) return;

  // If we just calculated a result, start fresh on new number input
  if (shouldResetScreen) {
    currentOperand = "";
    shouldResetScreen = false;
  }

  // Replace the initial 0 unless a decimal point is being added
  if (currentOperand === "0" && number !== ".") {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
}

// ============================================
// Choose an operator (+, -, *, /, %)
// ============================================
function chooseOperator(operator) {
  if (currentOperand === "" ) return;

  // If there is already a pending operation, compute it first
  if (previousOperand !== "") {
    calculate();
  }

  chosenOperator = operator;
  previousOperand = currentOperand;
  currentOperand = "";
}

// ============================================
// Perform the calculation using if-else logic
// ============================================
function calculate() {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  // Guard against missing values
  if (isNaN(prev) || isNaN(current)) return;

  let result;

  if (chosenOperator === "+") {
    result = prev + current;
  } else if (chosenOperator === "-") {
    result = prev - current;
  } else if (chosenOperator === "*") {
    result = prev * current;
  } else if (chosenOperator === "/") {
    if (current === 0) {
      result = "Error";
    } else {
      result = prev / current;
    }
  } else if (chosenOperator === "%") {
    result = prev % current;
  } else {
    return;
  }

  // Round long decimals to keep the display clean
  if (typeof result === "number") {
    result = Math.round(result * 100000) / 100000;
  }

  currentOperand = result.toString();
  chosenOperator = undefined;
  previousOperand = "";
  shouldResetScreen = true;
}

// ============================================
// Clear everything (AC button)
// ============================================
function clearAll() {
  currentOperand = "0";
  previousOperand = "";
  chosenOperator = undefined;
}

// ============================================
// Delete the last character (DEL button)
// ============================================
function deleteLast() {
  if (currentOperand.length === 1) {
    currentOperand = "0";
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
}

// ============================================
// Event Listeners
// Looping through node lists to attach listeners
// ============================================
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendNumber(button.dataset.number);
    updateDisplay();
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    chooseOperator(button.dataset.operator);
    updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculate();
  updateDisplay();
});

clearButton.addEventListener("click", () => {
  clearAll();
  updateDisplay();
});

deleteButton.addEventListener("click", () => {
  deleteLast();
  updateDisplay();
});

// ============================================
// Optional: allow keyboard input too
// ============================================
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    appendNumber(e.key);
    updateDisplay();
  } else if (e.key === ".") {
    appendNumber(".");
    updateDisplay();
  } else if (["+", "-", "*", "/", "%"].includes(e.key)) {
    chooseOperator(e.key);
    updateDisplay();
  } else if (e.key === "Enter" || e.key === "=") {
    calculate();
    updateDisplay();
  } else if (e.key === "Backspace") {
    deleteLast();
    updateDisplay();
  } else if (e.key.toLowerCase() === "c") {
    clearAll();
    updateDisplay();
  }
});

// Initial render
updateDisplay();
