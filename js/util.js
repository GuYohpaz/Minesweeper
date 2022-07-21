function buildBoard() {
    gBoard = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        const row = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = {
                isShown: false,
                isMine: false,
                isMarked: false
            }
            row.push(cell)
        }
        gBoard.push(row)
    }
}

function countMinesAround(board, position) {
    var mineCount = 0

    for (var i = position.i - 1; i <= position.i + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = position.j - 1; j <= position.j + 1; j++) {
            if (j < 0 || j >= board[0].length) continue

            const currCell = board[i][j]
            if (currCell.isMine) mineCount++
        }
    }
    return mineCount
}

function getEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine)
                emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function drawEmptyCell() {
    const emptyCells = getEmptyCells()
    const emptyCellPos = getRandomInt(0, emptyCells.length)
    const emptyCell = emptyCells.splice(emptyCellPos, 1)
    return emptyCell[0]
}

function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}
