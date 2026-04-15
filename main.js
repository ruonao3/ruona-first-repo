const squares = document.querySelectorAll(".box");
const gameContainer = document.querySelector(".game-container");
const resetBtn = document.getElementById("resetBtn");
let turnStatus = document.getElementById("turnStatus");
let playerTurn = 0;
let gameOver = false;

// Winning Combos
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Helper Functions
 */

// Update the turn status message
function updateTurnMessage() {
  if (playerTurn === 0) {
    turnStatus.textContent = "Player 1's";
    turnStatus.classList.remove("noughts");
    turnStatus.classList.add("crosses");
  } else {
    turnStatus.textContent = "Player 2's";
    turnStatus.classList.remove("crosses");
    turnStatus.classList.add("noughts");
  }
}

// Check if the game is over after every turn
function checkGameOver() {
  if (checkWon("nought")) {
    gameOver = true;
    drawLine(checkWon("nought"));
    setTimeout(() => {
      alert("Player 2 won");
    }, 100);
  } else if (checkWon("cross")) {
    gameOver = true;
    drawLine(checkWon("cross"));
    setTimeout(() => {
      alert("Player 1 won");
    }, 100);
  } else if (checkDraw()) {
    gameOver = true;
    setTimeout(() => {
      alert("Draw");
    }, 100);
  }
  return gameOver;
}

// Draw an SVG Line through the winning solution
function drawLine(combo) {
  const firstCombo = squares[combo[0]];
  const lastCombo = squares[combo[2]];
  const firstSquare = firstCombo.getBoundingClientRect();
  const lastSqaure = lastCombo.getBoundingClientRect();
  const containerRect = gameContainer.getBoundingClientRect();

  const x1 = firstSquare.left + firstSquare.width / 2 - containerRect.left;
  const x2 = lastSqaure.left + lastSqaure.width / 2 - containerRect.left;

  const y1 = firstSquare.top + firstSquare.height / 2 - containerRect.top;
  const y2 = lastSqaure.top + lastSqaure.height / 2 - containerRect.top;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  svg.setAttribute("id", "strike");
  line.setAttribute("x1", x1);
  line.setAttribute("x2", x2);
  line.setAttribute("y1", y1);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#45a832");
  line.setAttribute("stroke-width", "10");
  line.setAttribute("stroke-linecap", "round");
  svg.appendChild(line);
  gameContainer.appendChild(svg);
}

// switch between turns
const updateTurn = (turn) => {
  if (turn === 0) {
    return (turn = 1);
  } else if (turn === 1) {
    return (turn = 0);
  }
};
// check if won
function checkWon(player) {
  for (let i = 0; i < winningCombos.length; i++) {
    const combo = winningCombos[i];
    const checkSquares = [
      squares[combo[0]],
      squares[combo[1]],
      squares[combo[2]],
    ];
    let comboWon = true;
    for (let index = 0; index < checkSquares.length; index++) {
      if (!checkSquares[index].classList.contains(player)) {
        comboWon = false;
        break;
      }
    }
    if (comboWon) return combo;
  }
  return null;
}
// check if draw
function checkDraw() {
  for (let i = 0; i < squares.length; i++) {
    if (
      !squares[i].classList.contains("nought") &&
      !squares[i].classList.contains("cross")
    ) {
      return false;
    }
  }
  if (checkWon("nought") || checkWon("cross")) {
    return false;
  } else {
    return true;
  }
}
// reset the game
function resetGame() {
  squares.forEach((square) => {
    square.classList.remove("nought", "cross");
  });
  const existingStrike = document.getElementById("strike");
  if (existingStrike) existingStrike.remove();
  playerTurn = 0;
  gameOver = false;
  updateTurnMessage();
}

function initialiseGame(event) {
  if (playerTurn == 0) {
    event.target.classList.add("cross");
    playerTurn = updateTurn(0);
    checkGameOver();
    updateTurnMessage();
  } else {
    event.target.classList.add("nought");
    playerTurn = updateTurn(1);
    checkGameOver();
    updateTurnMessage();
  }
}

/**
 * Board Interactivity
 * Eventlisteners for the button and the click of the board
 */

squares.forEach((square) => {
  square.addEventListener("click", (event) => {
    if (gameOver) {
      return;
    }
    initialiseGame(event);
  });
});

resetBtn.addEventListener("click", resetGame);
