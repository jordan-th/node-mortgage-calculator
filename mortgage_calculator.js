const readline = require("readline-sync");

const MESSAGES = {
  loanAmount : "What is the dollar amount of the loan?",
  loanAmountInvalid : "Invalid entry. Enter any non-negative number:",
  apr : "What is the Annual Percentage Rate (APR) of the loan?" +
  "\n  (Enter as a %. e.g., 4%, not .04)",
  aprInvalid: "Invalid entry. Enter any non-negative number:",
  duration : "How long is the loan for, in years?",
  durationInvalid : "Invalid entry. Enter any integer greater than zero:"
};

function prompt(text) {
  console.log(`> ${text}`);
}

function isInvalidEntry(entry) {
  entry = entry.replace("$", "");
  entry = entry.replace("%", "");
  return entry.trimStart() === '' ||
    Number.isNaN(parseFloat(entry)) ||
    parseFloat(entry) < 0;
}

function isInvalidDuration(entry) {
  return entry.trimStart() === '' ||
    Number.isInteger(entry) ||
    Number.isNaN(parseFloat(entry)) ||
    parseFloat(entry) <= 0;
}

function getUserInput(inputType, validityTest) {
  prompt(MESSAGES[inputType]);
  let input = readline.question();
  while (validityTest(input)) {
    prompt(MESSAGES[`${inputType}Invalid`]);
    input = readline.question();
  }
  return input;
}

function calculatePayment(loanAmountInput, aprYearInput, durationYearsInput) {
  let loanAmountNum = parseFloat(loanAmountInput.replace("$", ""));
  let aprYearDecimal = parseFloat(aprYearInput.replace("%", "")) / 100;
  let aprMonthDecimal = aprYearDecimal / 12;
  let durationMonthsNum = parseInt(durationYearsInput, 10) * 12;
  if (aprMonthDecimal !== 0) {
    return loanAmountNum *
            (aprMonthDecimal /
            (1 - Math.pow((1 + aprMonthDecimal), (-durationMonthsNum))));
  } else {
    return loanAmountNum * (1 / durationMonthsNum);
  }
}

function isDonePlaying(entry) {
  while (!(entry === "n" || entry === "y")) {
    prompt("Invalid entry. Entry should be a single letter, y or n.");
    entry = readline.question().toLowerCase();
  }
  return entry === "n";
}

while (true) {
  console.clear();
  prompt("Let's calculate your monthly mortgage payment!");
  console.log("----------------------------------------------");

  let loanAmountStr = getUserInput("loanAmount", isInvalidEntry);
  let aprYearStr = getUserInput("apr", isInvalidEntry);
  let durationYearsStr = getUserInput("duration", isInvalidDuration);

  let monthlyPay = calculatePayment(
    loanAmountStr,
    aprYearStr,
    durationYearsStr);

  prompt(`You will be expected to pay $${monthlyPay.toFixed(2)} every month.`);

  prompt('Would you like to make another calculation? y/n');
  let useAgain = readline.question().toLowerCase();
  if (isDonePlaying(useAgain)) {
    break;
  }
}