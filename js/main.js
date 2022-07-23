'use strict'


const MINE_IMG = '💣'
const MARKED_IMG = '🚩'
const HAPPY_FACE = '😃'
const SAD_FACE = '🤯'
const COOL_FACE = '😎'

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    second: 0
}

var gBoard
var gTimer 
var gFirstTurn

function initGame() {
    buildBoard()
    renderBoard(gBoard)
    displayNumOfMinesLeft()
    displayCurrentStatus(HAPPY_FACE)
    clearInterval(gTimer)
    
    
    gFirstTurn = true
}

function setRandomMines(forbiddenCell) { 
    for (var i = 0; i < gLevel.MINES; i++) {
        const pos = drawEmptyCell()
        if (pos.i === forbiddenCell.i && pos.j === forbiddenCell.j) {
            i--
            continue
        }
        gBoard[pos.i][pos.j].isMine = true
    }
}

function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            const currCell = board[i][j]
            if (currCell.isMine) continue
            currCell.minesAround = countMinesAround(board, { i, j })
        }
    }
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board');
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i, j })
            strHTML += `\t<td class="cell ${cellClass}"  onmousedown="CellClicked(this, ${i}, ${j},event)" >\n`

            if (currCell.isShown) strHTML += currCell.isMine ? MINE_IMG : currCell.minesAround
            else if (currCell.isMarked) strHTML += MARKED_IMG
           

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}

function CellClicked(elCell, i, j, event) {
    if (!gGame.isOn && !gFirstTurn) return
    if (gFirstTurn) beginGame({ i, j })

    const cell = gBoard[i][j]
    if (cell.isShown) return

    if (event.button === 2) {
        if (cell.isMarked) {
            gGame.markedCount--
        } else {
            gGame.markedCount++
        }
        cell.isMarked = !cell.isMarked
        displayNumOfMinesLeft()
    }
    else if (event.button === 0) {
        if (cell.isMarked) return

        cell.isShown = true
        gGame.shownCount++

        if (cell.minesAround === 0) expandShown({ i, j })
        if (cell.isMine) loseCase(elCell)

        // \\ if flag on mine = win
    }
    renderBoard(gBoard)
    checkGameOver()
}

function setTimer() {
    const elTimer = document.querySelector('.timer')
    // console.log(gGame.second)
    gGame.second++
    elTimer.innerText = `${gGame.second}`
    
   

}


function displayNumOfMinesLeft() {
    const elMinesDisplay = document.querySelector('.mines')

    elMinesDisplay.innerText = gLevel.MINES - gGame.markedCount > 0 ? gLevel.MINES - gGame.markedCount : 0
}

function displayCurrentStatus(face) {
    const elFace = document.querySelector('.face')
    elFace.innerText = face
}

function checkGameOver() {
    if (gGame.shownCount + gGame.markedCount === Math.pow(gLevel.SIZE, 2)) {
        gGame.isOn = false
        clearInterval(gTimer)
        displayCurrentStatus(COOL_FACE)
    }
    // if( gTimer === 1000 ){
    //     gGame.isOn = false
    // }
}

function loseCase(elCell) {
    gGame.isOn = false
    clearInterval(gTimer)
    displayCurrentStatus(SAD_FACE)

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true
        }
    }

    renderBoard(gBoard)

}

function beginGame(pos) {
    setRandomMines(pos)
    setMinesNegsCount(gBoard)
    gTimer = setInterval(setTimer, 1000)
    gGame.isOn = true
    gFirstTurn = false
}

function expandShown(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[pos.i].length) continue
            var currCell = gBoard[i][j]
            if (!currCell.isShown) {
                currCell.isShown = true
                gGame.shownCount++
            }
        }
    }
    renderBoard(gBoard)
}

function changeLevel(size) {
    switch (+size) {
        case 4:
            gLevel.SIZE = size
            gLevel.MINES = 2
            break
        case 8:
            gLevel.SIZE = size
            gLevel.MINES = 12
            break
        case 12:
            gLevel.SIZE = size
            gLevel.MINES = 30
            break
    }
    restartGame()
}

function restartGame() {
    clearInterval(gTimer)
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.second = 0

    initGame()
}




// function winCase() {
//     var flagOnMine = 0

//     for (var i = 0; i < gBoard.length; i++) {
//         if (gBoard[i].classList.contians('🚩') && gBoard[i].classList.contians('💣') ) {
          
//             flagOnMine ++
    
//         }

// if (flagOnMine === gLevel.MINES)
//     gGame.isOn = false
//     clearInterval(gTimer)
//     displayCurrentStatus(COOL_FACE)

//     }

// }


// const countDown = setInterval (()=>{
//     timeSecond--;
//   displayTime(timeSecond)
//     if(timeSecond <= 0 || timeSecond < 1){
//      endTime()
//       clearInterval(countDown)
  
//     }
  
//   },1000)
  
//   function displayTime(second){
//     var min = Math.floor(second / 60);
//     var sec =  Math.floor(second % 60);
//     elTimer.innerHTML = `${min<10 ?'0': ''}${min}:${sec<10 ? '0':''}${sec}`
  
//   }
  
//   function endTime(){
//     elTimer.innerHTML = 'TIME OUT'
   
//   }