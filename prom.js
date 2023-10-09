const prompt = require("prompt-sync")();

const SYMBOL_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const COLS = 3;

const ROWS = 3;

const deposit = () => {
  while (true) {
    const totalAmount = prompt("Deposit amount: ");

    const realTotalAmount = parseFloat(totalAmount);

    if (isNaN(realTotalAmount) || realTotalAmount <= 0) {
      console.log("Deposited amount is invalid, please try again");
    } else {
      return realTotalAmount;
    }
  }
};

const bettingLines = () => {
  while (true) {
    const bettingLines = prompt("Enter the number of lines to BET (1 - 3): ");

    const realBettingLines = parseFloat(bettingLines);

    if (
      isNaN(realBettingLines) ||
      realBettingLines <= 0 ||
      realBettingLines > 3
    ) {
      console.log("Entered betting lines are invalid , please try again");
    } else {
      return realBettingLines;
    }
  }
};

const bettingAmount = (balance, lines) => {
  while (true) {
    const amount = prompt("Enter the amount for BET: ");

    const realAmount = parseFloat(amount);

    if (isNaN(realAmount) || realAmount <= 0 || realAmount > balance / lines) {
      console.log("Enter amount is invalid , please try again");
    } else {
      return realAmount;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      let random = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbols = reelSymbols[random];
      reels[i].push(selectedSymbols);
      reelSymbols.splice(random, 1);
    }
  }
  return reels;
};

const transpose = (spinReel) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(spinReel[j][i]);
    }
  }

  return rows;
};

const displayReels = (rowss) => {
  for (let row of rowss) {
    let rowString = "";
    for (const [i, sym] of row.entries()) {
      rowString += sym;
      if (i !== row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rowss, lines, amount) => {
  let wins = 0;

  for (let row = 0; row < lines; row++) {
    let symbolsOfRow = rowss[row];
    let isAllEqual = true;

    for (const symboleOfRow of symbolsOfRow) {
      if (symboleOfRow !== symbolsOfRow[0]) {
        isAllEqual = false;
        break;
      }
    }
    if (isAllEqual) {
      wins += amount * SYMBOL_VALUES[symbolsOfRow[0]];
    }
  }

  return wins;
};

const Game = (startGame = true) => {
  let podhum = 0;
  while (startGame === true) {
    let balance = deposit();
    while (true) {
      podhum += 1;
      console.log(`Your balance amount is ${balance}`);
      const lines = bettingLines();
      const amount = bettingAmount(balance, lines);
      balance -= amount * lines;
      const spinReel = spin();
      const rowss = transpose(spinReel);
      const displayreels = displayReels(rowss);
      const winnings = getWinnings(rowss, lines, amount);
      balance += winnings;

      if (balance <= 0) {
        console.log(`You ran out of MONEY!`);
        break;
      } else if (balance !== 0) {
        console.log(`You earn $ ${winnings}`);
        if (podhum > 2) {
          let playAgain = prompt("Do you want to QUIT (y/n)?: ");
          if (playAgain.toLowerCase() === "y") {
            break;
          } else {
            podhum = 0;
            continue;
          }
        }
        continue;
      }
    }

    let playAgain = prompt("Do you want to play again (y/n)?: ");
    if (playAgain.toLocaleLowerCase() !== "y") {
      startGame = false;
      break;
    }
  }
};

Game();
