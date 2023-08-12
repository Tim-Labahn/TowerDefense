import './style.css';
type GameMap = {
  terrain: string;
  enemyPath: boolean;
  isEmpty: boolean;
  isPlayerTower: boolean;
  playerBase: boolean;
  enemyStart: boolean;
  enemyPathConnected: number;
}[][];
const gameMap: GameMap = [];
const gameSize = 11;
type gameSize = number;
//----------------------------------------
generateField();
gamePlay();
//----------------------------------------

function generateField() {
  for (let i = 0; i < gameSize; i++) {
    const rowY = [];
    for (let k = 0; k < gameSize; k++) {
      const tile = {
        terrain: 'normal',
        enemyPath: false,
        isEmpty: true,
        isPlayerTower: false,
        playerBase: false,
        enemyStart: false,
        enemyPathConnected: 0,
      };
      rowY.push(tile);
    }

    gameMap.push(rowY);
  }
}

function gamePlay() {
  generatePlayerStart();
  generateEnemyStart();
  generateEnemyPath();
  render();
}

function render() {
  const gameField = document.querySelector('.field');
  if (gameField !== null) {
    gameField.innerHTML = '';
  }
  gameField?.setAttribute('style', `grid-template-columns: repeat(${gameSize},1fr); width: ${50 * gameSize}px;`);
  for (let x = 0; x < gameSize; x++) {
    for (let y = 0; y < gameSize; y++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (gameMap[x][y].isPlayerTower) {
        tile.innerHTML = '🪖';
      }
      if (gameMap[x][y].enemyPath) {
        tile.setAttribute('isEnemyPath', 'EnemyPath');
        tile.innerHTML = '👾';
        console.log('enemy path created');
      }
      if (gameMap[x][y].playerBase) {
        tile.setAttribute('isPlayerBase', 'PlayerBase');
        tile.innerHTML = '🏰';
      }
      if (gameMap[x][y].enemyStart) {
        tile.setAttribute('isEnemySpawn', 'EnemySpawn');
        tile.innerHTML = '👾';
      }
      gameField?.appendChild(tile);
    }
  }
}

function generatePlayerStart() {
  gameMap[0][Math.floor(gameSize / 2)].playerBase = true;
}

function generateEnemyStart() {
  gameMap[gameSize - 1][Math.floor(gameSize / 2)].enemyStart = true;
}
function generateEnemyPath() {
  const startX = gameSize - 1;
  const startY = Math.floor(gameSize / 2);
  let pathX = startX;
  let pathY = startY;
  let connected = false;
  //--------------------------------
  while (!connected) {
    for (let i = 0; i < 15; i++) {
      gameMap[pathX][pathY].enemyPathConnected = countPathConnected(pathX, pathY);
      console.log('round', i);
      const direction = Math.floor(Math.random() * 3) + 1;
      if (direction === 1) {
        if (gameMap[pathX - 1][pathY] && gameMap[pathX - 1][pathY].enemyPathConnected <= 1) {
          //north
          console.log('north');
          gameMap[pathX - 1][pathY].enemyPath = true;
          pathX = pathX - 1;
        }
      }
      if (direction === 2 && gameMap[pathX][pathY + 1].enemyPathConnected <= 1) {
        if (gameMap[pathX][pathY + 1]) {
          //east
          console.log('east');
          gameMap[pathX][pathY + 1].enemyPath = true;
          pathY = pathY + 1;
        }
      }
      if (direction === 3 && gameMap[pathX][pathY - 1].enemyPathConnected <= 1) {
        if (gameMap[pathX][pathY - 1]) {
          //west
          console.log('west');
          gameMap[pathX][pathY - 1].enemyPath = true;
          pathY = pathY - 1;
        }
      }
      //------------------------------------------
      //   if (gameMap[pathX + 1][pathY]) {
      //     gameMap[pathX + 1][pathY].enemyPathConnected = countPathConnected(pathX + 1, pathY);
      //   }
      //   if (gameMap[pathX - 1][pathY]) {
      //     gameMap[pathX - 1][pathY].enemyPathConnected = countPathConnected(pathX - 1, pathY);
      //   }
      //   if (gameMap[pathX][pathY + 1]) {
      //     gameMap[pathX][pathY + 1].enemyPathConnected = countPathConnected(pathX, pathY + 1);
      //   }
      //   if (gameMap[pathX][pathY - 1]) {
      //     gameMap[pathX][pathY - 1].enemyPathConnected = countPathConnected(pathX, pathY) - 1;
      //   }
    }
    if (pathX === 0 && pathY === Math.floor(gameSize / 2)) {
      connected = true;
    }
  }
}

function countPathConnected(y: number, x: number) {
  let numberOfConnectedPaths = 0;
  if (gameMap[y + 1]?.[x]?.enemyPath) {
    numberOfConnectedPaths++;
  }
  if (gameMap[y - 1]?.[x]?.enemyPath) {
    numberOfConnectedPaths++;
  }
  if (gameMap[y]?.[x + 1]?.enemyPath) {
    numberOfConnectedPaths++;
  }
  if (gameMap[y]?.[x - 1]?.enemyPath) {
    numberOfConnectedPaths++;
  }
  if (gameMap[y + 1]?.[x + 1]?.enemyPath) {
    numberOfConnectedPaths++;
  }
  if (gameMap[y - 1]?.[x + 1]?.enemyPath) {
    numberOfConnectedPaths++;
  }
  if (gameMap[y - 1]?.[x - 1]?.enemyPath) {
    numberOfConnectedPaths++;
  }
  if (gameMap[y + 1]?.[x - 1]?.enemyPath) {
    numberOfConnectedPaths++;
  }

  return numberOfConnectedPaths;
}
