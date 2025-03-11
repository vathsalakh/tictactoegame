const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");
let currentPlayer = "X";
let bigBoard = Array(9).fill(null).map(() => Array(9).fill(null)); // 9x9 grid
let activeBoard = -1; // -1 means any board is playable

// Create the 9 small boards
for (let i = 0; i < 9; i++) {
    const smallBoard = document.createElement("div");
    smallBoard.classList.add("board");
    smallBoard.dataset.index = i;

    for (let j = 0; j < 9; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = j;
        cell.addEventListener("click", () => handleMove(i, j));
        smallBoard.appendChild(cell);
    }

    gameBoard.appendChild(smallBoard);
}

// Handle move logic
function handleMove(boardIndex, cellIndex) {
    if (activeBoard !== -1 && activeBoard !== boardIndex) return; // Must play in the assigned board
    if (bigBoard[boardIndex][cellIndex] !== null) return; // Cell already taken

    // Mark the move
    bigBoard[boardIndex][cellIndex] = currentPlayer;
    const board = document.getElementsByClassName("board")[boardIndex];
    const cell = board.children[cellIndex];
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    // Check if the small board is won
    if (checkWin(bigBoard[boardIndex])) {
        board.classList.add("won");
        bigBoard[boardIndex] = currentPlayer; // Mark small board as won
    }

    // Check if the whole game is won
    if (checkWin(bigBoard.map(b => (typeof b === "string" ? b : null)))) {
        statusText.textContent = `Player ${currentPlayer} Wins the Game!`;
        document.querySelectorAll(".cell").forEach(cell => cell.classList.add("taken"));
        return;
    }

    // Update next active board
    activeBoard = bigBoard[cellIndex].some(c => c === null) ? cellIndex : -1;

    // Switch players
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// Check if a board (small or big) has a winner
function checkWin(board) {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return wins.some(combination => 
        combination.every(index => board[index] === currentPlayer)
    );
}
