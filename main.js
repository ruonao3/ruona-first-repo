const squares = document.querySelectorAll(".box");
const gameContainer = document.querySelector(".game-container");
const resetBtn = document.getElementById("resetBtn");
const modal = document.getElementById("gameModal");
const gameStatus = document.getElementById("gameStatus");
const gameMessage = document.getElementById("gameMessage");
const playAgainBtn = document.getElementById("modalResetBtn");
const closeBtn = document.getElementById("closeModal");
const loadingScreen = document.getElementById("loading-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
let turnStatus = document.getElementById("turnStatus");
const scoreP1Display = document.getElementById("score-p1");
const scoreP2Display = document.getElementById("score-p2");
let playerTurn = 0;
let gameOver = false;
let score1 = 0;
let score2 = 0;

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

// Player 1 is always cross
// Player 2 is always nought

/**
 * Helper Functions
 */

// Show winning/draw modal
function showModal(title, message) {
  gameStatus.textContent = title;
  gameMessage.textContent = message;
  modal.classList.add("active");
}

// Close winning modal

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
    score2++;
    scoreP2Display.textContent = score2;
    drawLine(checkWon("nought"));
    setTimeout(() => {
      showModal("Player 2 Wins!", "O takes the victory.");
    }, 100);
  } else if (checkWon("cross")) {
    gameOver = true;
    score1++;
    scoreP1Display.textContent = score1;
    drawLine(checkWon("cross"));
    setTimeout(() => {
      showModal("Player 1 Wins!", "X takes the victory.");
    }, 100);
  } else if (checkDraw()) {
    gameOver = true;
    setTimeout(() => {
      showModal("It's a Draw!", "Nobody wins this time.");
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
  line.setAttribute("stroke", "rgba(255, 255, 255, 0.7)");
  line.setAttribute("stroke-width", "12");
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
  modal.classList.remove("active");
  updateTurnMessage();
}

function initialiseGame(event) {
  if (
    event.target.classList.contains("cross") ||
    event.target.classList.contains("nought")
  ) {
    return;
  }

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

playAgainBtn.addEventListener("click", resetGame);

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

startBtn.addEventListener("click", () => {
  loadingScreen.classList.remove("active");
  gameScreen.classList.add("active");
});

resetBtn.addEventListener("click", resetGame);
