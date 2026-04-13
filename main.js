
const squares = document.querySelectorAll('.box')
const resetBtn = document.getElementById('resetBtn')
let playerTurn = 0;
let gameOver = false;

const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
]

const updateTurn = turn => {
    if (turn === 0) {
        return turn = 1
    } else if (turn === 1){
        return turn = 0
    }
}

squares.forEach((square) => {
    square.addEventListener('click', (event) => {
        if (playerTurn == 0){
            event.target.classList.add('nought')
            playerTurn = updateTurn(0)
        } else {
            event.target.classList.add('cross')
            playerTurn = updateTurn(1)
        }
    } )
})


