// Game configuration
const avatars = [
    'avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png',
    'avatar5.png', 'avatar6.png', 'avatar7.png', 'avatar8.png'
];

// Game state
let gameState = {
    player1: {
        name: 'Player X',
        avatar: null,
        symbol: 'X'
    },
    player2: {
        name: 'Player O', 
        avatar: null,
        symbol: 'O'
    },
    currentPlayer: 'X'
};

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('[data-cell]');
    const gameStatus = document.getElementById('gameStatus');
    const restartButton = document.getElementById('restartButton');
    const playerSetupModal = document.getElementById('playerSetup');
    const startGameButton = document.getElementById('startGame');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const player1Avatars = document.getElementById('player1-avatars');
    const player2Avatars = document.getElementById('player2-avatars');

    // Show player setup modal initially
    playerSetupModal.style.display = 'flex';

    // Initialize avatar selection
    avatars.forEach(avatar => {
        const img1 = document.createElement('img');
        img1.src = `../assets/avatars/${avatar}`;
        img1.addEventListener('click', () => selectAvatar(1, avatar));
        player1Avatars.appendChild(img1);

        const img2 = document.createElement('img');
        img2.src = `../assets/avatars/${avatar}`;
        img2.addEventListener('click', () => selectAvatar(2, avatar));
        player2Avatars.appendChild(img2);
    });

    // Start game handler
    startGameButton.addEventListener('click', () => {
        gameState.player1.name = player1NameInput.value || 'Player X';
        gameState.player2.name = player2NameInput.value || 'Player O';
        playerSetupModal.style.display = 'none';
        startGame();
    });

    function selectAvatar(playerNum, avatar) {
        const avatars = playerNum === 1 ? 
            player1Avatars.querySelectorAll('img') : 
            player2Avatars.querySelectorAll('img');
        
        avatars.forEach(img => img.classList.remove('selected'));
        event.target.classList.add('selected');
        
        if (playerNum === 1) {
            gameState.player1.avatar = avatar;
        } else {
            gameState.player2.avatar = avatar;
        }
    }
    
    let gameActive = true;
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Initialize game
    function startGame() {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', handleCellClick, { once: true });
        });
        gameStatus.textContent = `${gameState.currentPlayer === 'X' ? gameState.player1.name : gameState.player2.name}'s turn`;
        gameActive = true;
    }

    // Handle cell click
    function handleCellClick(e) {
        if (!gameActive) return;
        
        const cell = e.target;
        cell.textContent = gameState.currentPlayer;
        
        if (checkWin(gameState.currentPlayer)) {
            endGame(false);
            return;
        } else if (isDraw()) {
            endGame(true);
            return;
        }
        
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        gameStatus.textContent = `${gameState.currentPlayer === 'X' ? gameState.player1.name : gameState.player2.name}'s turn`;
    }

    // Check for win
    function checkWin(player) {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return cells[index].textContent === player;
            });
        });
    }

    // Check for draw
    function isDraw() {
        return [...cells].every(cell => {
            return cell.textContent !== '';
        });
    }

    // End game
    function endGame(draw) {
        gameActive = false;
        gameStatus.textContent = draw ? 'Game ended in a draw!' : `${gameState.currentPlayer === 'X' ? gameState.player1.name : gameState.player2.name} wins!`;
    }

    // Restart game
    restartButton.addEventListener('click', () => {
        gameState.currentPlayer = 'X';
        startGame();
    });

    // Start the game
    startGame();
});
