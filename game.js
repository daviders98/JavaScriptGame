const canvas = document.querySelector("#game")
const game = canvas.getContext("2d")
const buttonUp = document.querySelector('#up')
const buttonDown = document.querySelector('#down')
const buttonLeft = document.querySelector('#left')
const buttonRight = document.querySelector('#right')
const livesText = document.querySelector('#lives')
const timeText = document.querySelector('#time')
const recordText = document.querySelector('#record')
const resultText = document.querySelector('#result')

let canvasSize, elementsSize,timeStart,timePlayer,timeInterval
const playerPosition = {
    x: undefined,
    y:undefined
}
const giftPosition = {
    x: undefined,
    y:undefined
}
let enemiesPositions = []
let level = 0
let lives = 3

window.addEventListener('load',setCanvasSize)
window.addEventListener('resize', setCanvasSize)
function startGame(){
    game.font = elementsSize+'px Verdana'
    game.textAlign = 'end'

    const map = maps[level]
    if(!map){
        gameWin();
        return;
    }

    if(!timeStart){
        timeStart = Date.now()
        timeInterval = setInterval(showTime,100)
        showRecord()
    }
    const mapRows = map.trim().split('\n')
    const mapRowCols = mapRows.map(row=> row.trim().split(''))
    showLives()

    enemiesPositions = []
    game.clearRect(0,0,canvasSize,canvasSize)
    mapRowCols.forEach((row,rowIndex) => {
        row.forEach((col,colIndex)=>{
            const posX = elementsSize * (colIndex+1)
            const posY = elementsSize * (rowIndex+1)
            if(col=='O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = colIndex+1
                    playerPosition.y = rowIndex+1
                }
                console.log(playerPosition)
            }else if(col=='I'){
                giftPosition.x = colIndex+1
                giftPosition.y = rowIndex+1
            }else if(col=='X'){
                enemiesPositions.push({
                    x:colIndex+1,
                    y:rowIndex+1
                })
            }
            game.fillText(emojis[col],posX,posY)
        })
    });
    movePlayer()
}

function setCanvasSize(){
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth*.7
    }else{
        canvasSize = window.innerHeight*.7
    }
    canvas.setAttribute('width',canvasSize)
    canvas.setAttribute('height',canvasSize)
    elementsSize = canvasSize/10
    startGame()
}
window.addEventListener('keydown',moveByKeys)
buttonUp.addEventListener('click',moveUp)
buttonDown.addEventListener('click',moveDown)
buttonLeft.addEventListener('click',moveLeft)
buttonRight.addEventListener('click',moveRight)

function moveByKeys(e){
    const keyPressed = e.key
    switch(keyPressed){
        case 'ArrowUp':
            moveUp()
            break;
        case 'ArrowLeft':
            moveLeft()
            break;
        case 'ArrowDown':
            moveDown()
            break;
        case 'ArrowRight':
            moveRight()
            break;
        default:
            break;
    }
}
function movePlayer(){
    const giftCollisionX = playerPosition.x === giftPosition.x
    const giftCollisionY = playerPosition.y === giftPosition.y
    if(giftCollisionX && giftCollisionY){
        levelUp()
    }
    const enemyCollision = enemiesPositions.find((enemy)=>{
        const collisionX = enemy.x == playerPosition.x 
        const collisionY = enemy.y == playerPosition.y
        return collisionX && collisionY
    })
    if(enemyCollision){
        levelReset()
    }
    game.fillText(emojis.PLAYER,elementsSize*playerPosition.x,elementsSize*playerPosition.y)
}
function moveUp(){
    if(playerPosition.y>1){
        playerPosition.y = playerPosition.y-1
        startGame()
    }
}
function moveLeft(){
    if(playerPosition.x>1){
        playerPosition.x = playerPosition.x-1
        startGame()
    }
}
function moveRight(){
    if(playerPosition.x<10){
        playerPosition.x +=1
        startGame()
    }
}
function moveDown(){
    if(playerPosition.y<10){
        playerPosition.y +=1
        startGame()   
    }
}
function levelUp(){
    level++
    startGame()
}
function gameWin(){
    console.log('You won')
    clearInterval(timeInterval)
    const recordTime = localStorage.getItem('record_time')
    const playerTime = Date.now()-timeStart
    if(recordTime){
        if(recordTime>=playerPosition){
            localStorage.setItem('record_time',playerTime)
            resultText.innerHTML = 'You beat the record time!'
        }else{
            resultText.innerHTML = 'You were close to beating the record time'
        }
    }else{
        localStorage.setItem('record_time',playerTime)
        resultText.innerHTML = 'Congrats on beating the game for the first time'
    }
    alert('Congratulations you won!')
    location.reload()
}
function levelReset(){
    lives--
    if(lives <= 0){
        level=0
        lives = 3
        timeStart = undefined
    }
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame()
}
function showLives(){
    livesText.innerHTML = Array(lives).fill(emojis.HEART).join('')
}
function showTime(){
    timeText.innerHTML = Date.now() - timeStart
}
function showRecord(){
    recordText.innerHTML = localStorage.getItem('record_time') || 'There is no record yet'
}