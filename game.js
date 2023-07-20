document.addEventListener('DOMContentLoaded', function() {
  const boardSize = 4; // Tamanho do tabuleiro (8x8)
  const mineCount = 2; // Quantidade de minas

  const gameBoard = document.getElementById('game-board');
  const minesLeftDisplay = document.getElementById('mines-left');
  const scoreDisplay = document.getElementById('score-display');
  const emotionsDisplay = document.getElementById('emotions-display');
  const remainingCellsDisplay = document.getElementById('remaining-cells');
  const endGameDisplay = document.getElementById('end-game-display');
  const playAgainButton = document.getElementById('play-again-button');
  const roundsDisplay = document.getElementById('rounds-display');

  const emotionScores = {
    'Tristeza': -5,
    'Desânimo': -3,
    'Alegria': 3,
    'Felicidade': 4,
    'Entusiasmo': 5,
    'Ânimo': 6,
    'Positividade': 7,
    'Autocontrole': 8
  };

  const emotionColors = {
    'Tristeza': '#242424',
    'Desânimo': '#2b2832',
    'Alegria': '#927700',
    'Felicidade': '#54640c',
    'Entusiasmo': '#d88406',
    'Ânimo': '#0e4129',
    'Positividade': '#163232',
    'Autocontrole': '#2b1542'
  };

  let gameData = {
    board: [],
    mines: [],
    revealedCount: 0,
    gameover: false,
    totalScore: 0,
    emotionsScore: {},
    rounds: 0
  };

  function createBoard() {
    gameBoard.innerHTML = '';
    gameData.board = [];

    // Cria o tabuleiro
    for (let row = 0; row < boardSize; row++) {
      let rowElement = document.createElement('div');
      rowElement.classList.add('row');

      for (let col = 0; col < boardSize; col++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('click', handleCellClick);
        rowElement.appendChild(cell);
        gameData.board.push({ cell, mine: false, revealed: false });
      }

      gameBoard.appendChild(rowElement);
    }
  }

  function generateMines() {
    gameData.mines = [];

    // Gera as minas aleatoriamente
    while (gameData.mines.length < mineCount) {
      let index = Math.floor(Math.random() * gameData.board.length);
      let cellData = gameData.board[index];

      if (!cellData.mine) {
        cellData.mine = true;
        gameData.mines.push(cellData);
      }
    }
  }

  function handleCellClick(event) {
    if (gameData.gameover) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cellData = gameData.board[row * boardSize + col];

    if (cellData.revealed) return;

    if (cellData.mine) {
      revealMines();
      gameOver('Raiva');
    } else {
      revealCell(cellData);
      checkWin();
    }
  }

  function revealCell(cellData) {
    const { cell } = cellData;

    if (cellData.revealed) return;

    cellData.revealed = true;
    gameData.revealedCount++;

    const emotion = getEmotion();
    const score = emotionScores[emotion];

    cell.textContent = emotion;
    cell.style.backgroundColor = emotionColors[emotion];

    gameData.totalScore += score;
    updateScoreDisplay();
    updateEmotionsDisplay(emotion, score);
    updateRemainingCellsDisplay();
  }

  function getEmotion() {
    const emotions = Object.keys(emotionScores);
    return emotions[Math.floor(Math.random() * emotions.length)];
  }

  function revealMines() {
    for (const mine of gameData.mines) {
      const { cell } = mine;
      cell.classList.add('mine');
      cell.textContent = '😡';
    }
  }

  function checkWin() {
    const totalCells = boardSize * boardSize;
    const nonMineCells = totalCells - mineCount;

    if (gameData.revealedCount === nonMineCells) {
      gameOver('Autocontrole');
    }
  }

  function gameOver(emotion) {
    gameData.gameover = true;
    endGameDisplay.innerHTML = `Fim de jogo! Sua pontuação total foi: ${gameData.totalScore}`;

    if (emotion !== 'Autocontrole') {
      endGameDisplay.innerHTML += `. Boa sorte na próxima tentativa!`;
    }

    playAgainButton.style.display = 'block';
    revealMines();
  }

  function updateScoreDisplay() {
    scoreDisplay.textContent = gameData.totalScore;
  }

  function updateEmotionsDisplay(emotion, score) {
    if (emotion !== 'Raiva') {
      if (gameData.emotionsScore.hasOwnProperty(emotion)) {
        gameData.emotionsScore[emotion] += score;
      } else {
        gameData.emotionsScore[emotion] = score;
      }
    }

    let emotionsHTML = '';

    for (const [emotion, score] of Object.entries(gameData.emotionsScore)) {
      emotionsHTML += `<li>${emotion}: ${score} pontos</li>`;
    }

    emotionsDisplay.innerHTML = emotionsHTML;
  }

  function updateRemainingCellsDisplay() {
    const remainingCells = (boardSize * boardSize) - gameData.revealedCount;
    remainingCellsDisplay.textContent = remainingCells;
  }

  function startGame() {
    createBoard();
    generateMines();
    gameData.revealedCount = 0;
    gameData.gameover = false;
    gameData.totalScore = 0;
    gameData.emotionsScore = {};
    gameData.rounds++;
    roundsDisplay.textContent = gameData.rounds;
    minesLeftDisplay.textContent = mineCount;
    updateScoreDisplay();
    updateEmotionsDisplay('', 0);
    updateRemainingCellsDisplay();
    endGameDisplay.innerHTML = '';
    playAgainButton.style.display = 'none';
  }

  playAgainButton.addEventListener('click', function() {
    endGameDisplay.innerHTML = '';
    playAgainButton.style.display = 'none';
    startGame();
  });

  startGame();
});
