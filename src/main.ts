import './style.css';
type GameMap = {
  terrain: string;
  enemyPath: boolean;
  isEmpty: boolean;
  isPlayerTower: boolean;
  playerBase: boolean;
  enemyStart: boolean;
  enemyPathConnected: number;
  isEnemy: boolean;
  isForward: boolean;
}[][];
const gameMap: GameMap = [];
const gameSize = 11;
type gameSize = number;
let money = 100;
const enemyBaseX = gameSize - 1;
const enemyBaseY = Math.floor(gameSize / 2);
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
        isEnemy: false,
        isForward: true,
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
  enemyMove();
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
      tile.onclick = () => {
        tileClick(x, y);
      };
      if (gameMap[x][y].enemyPath) {
        tile.setAttribute('isEnemyPath', 'EnemyPath');
        tile.innerHTML = '';
      }
      if (gameMap[x][y].isEnemy) {
        tile.setAttribute('isEnemy', 'Enemy');
        tile.innerHTML = '👾';
      }
      if (gameMap[x][y].playerBase) {
        tile.setAttribute('isPlayerBase', 'PlayerBase');
        tile.innerHTML = '🏰';
      }
      if (gameMap[x][y].enemyStart) {
        tile.setAttribute('isEnemySpawn', 'EnemySpawn');
        tile.innerHTML = '🛸';
      }
      if (gameMap[x][y].isPlayerTower) {
        tile.setAttribute('isPlayerTower', 'PlayerTower');
        tile.innerHTML = '🪖';
      }
      gameField?.appendChild(tile);
    }
  }
}

function generatePlayerStart() {
  gameMap[0][Math.floor(gameSize / 2)].playerBase = true;
  gameMap[0][Math.floor(gameSize / 2)].isEmpty = false;
}

function generateEnemyStart() {
  gameMap[enemyBaseX][enemyBaseY].enemyStart = true;
  gameMap[enemyBaseX][enemyBaseY].enemyPath = true;
  gameMap[enemyBaseX][enemyBaseY].isEmpty = false;
}
//-----------------------
function generateEnemyPath() {
  let pathX = gameSize - 1;
  let pathY = Math.floor(gameSize / 2);
  let connected = false;
  while (!connected) {
    while (pathX > 1) {
      const direction = Math.floor(Math.random() * 3) + 1;
      //--------------------
      //------------------------
      if (direction === 1) {
        if (gameMap[pathX - 1]) {
          if (!gameMap[pathX - 1][pathY].enemyPath) {
            if (countPathConnected(pathX - 1, pathY) < 2) {
              pathX = pathX - 1;
              gameMap[pathX][pathY].enemyPath = true;
              gameMap[pathX][pathY].isEmpty = false;
            }
          }
        }
      }
      if (direction === 2) {
        if (gameMap[pathY + 1]) {
          if (!gameMap[pathX][pathY + 1].enemyPath) {
            if (countPathConnected(pathX, pathY + 1) < 2) {
              pathY = pathY + 1;
              gameMap[pathX][pathY].enemyPath = true;
              gameMap[pathX][pathY].isEmpty = false;
            }
          }
        }
      }
      if (direction === 3) {
        if (gameMap[pathY - 1]) {
          if (!gameMap[pathX][pathY - 1].enemyPath) {
            if (countPathConnected(pathX, pathY - 1) < 2) {
              pathY = pathY - 1;
              gameMap[pathX][pathY].enemyPath = true;
              gameMap[pathX][pathY].isEmpty = false;
            }
          }
        }
      }
      //-----------------------
    }
    while (pathY !== Math.floor(gameSize / 2)) {
      if (pathY < Math.floor(gameSize / 2)) {
        if (gameMap[pathY + 1]) {
          if (!gameMap[pathX][pathY + 1].enemyPath) {
            gameMap[pathX][pathY].isEmpty = false;
            pathY = pathY + 1;
            gameMap[pathX][pathY].enemyPath = true;
          }
        }
      }
      if (pathY > Math.floor(gameSize / 2)) {
        if (gameMap[pathY - 1]) {
          if (!gameMap[pathX][pathY - 1].enemyPath) {
            gameMap[pathX][pathY].isEmpty = false;
            pathY = pathY - 1;
            gameMap[pathX][pathY].enemyPath = true;
          }
        }
      }
    }
    if (pathY === Math.floor(gameSize / 2)) {
      if (gameMap[pathX - 1][pathY].playerBase) {
        pathX = pathX - 1;
        gameMap[pathX][pathY].enemyPath = true;
        gameMap[pathX][pathY].isEmpty = false;
      }
    }
    render();
    if (pathX === 0 && pathY === 5) {
      connected = true;
      console.log('connected');
    }
  }
}
//------------------------------
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

  return numberOfConnectedPaths;
}

function tileClick(xIndex: number, yIndex: number) {
  if (gameMap[xIndex][yIndex].isEmpty) {
    if (money > 14) {
      gameMap[xIndex][yIndex].isEmpty = false;
      gameMap[xIndex][yIndex].isPlayerTower = true;
      money = money - 15;
    }
  } else if (!gameMap[xIndex][yIndex].isEmpty) {
    if (gameMap[xIndex][yIndex].isPlayerTower) {
      gameMap[xIndex][yIndex].isEmpty = true;
      gameMap[xIndex][yIndex].isPlayerTower = false;

      money = money + 5;
    }
  }
  render();
}

function enemyMove() {
  let enemyX = enemyBaseX;
  let enemyY = enemyBaseY;
  gameMap[enemyX][enemyY].isEnemy = true;
  for (let x = 0; x < 2; x++) {
    if (gameMap[enemyX - 1][enemyY].enemyPath) {
      if (gameMap[enemyX - 1][enemyY].isForward) {
        gameMap[enemyX - 1][enemyY].isEnemy = true;
        gameMap[enemyX][enemyY].isEnemy = false;
        gameMap[enemyX][enemyY].isForward = false;
        enemyX = enemyX - 1;
        render();
        console.log('enemy goes north');
      }
    }
    if (gameMap[enemyY - 1]) {
      if (gameMap[enemyX][enemyY - 1].enemyPath) {
        if (gameMap[enemyX - 1][enemyY].isForward) {
          gameMap[enemyX][enemyY - 1].isEnemy = true;
          gameMap[enemyX][enemyY].isEnemy = false;
          gameMap[enemyX][enemyY].isForward = false;
          enemyY = enemyY - 1;
          render();
          console.log('enemy goes east');
        }
      }
    } else if (gameMap[enemyY + 1]) {
      if (gameMap[enemyX][enemyY + 1].enemyPath) {
        if (gameMap[enemyX][enemyY + 1].isForward) {
          gameMap[enemyX][enemyY + 1].isEnemy = true;
          gameMap[enemyX][enemyY].isForward = false;
          enemyY = enemyY + 1;
          render();
          console.log('enemy goes west');
        }
      }
    }
  }
}
