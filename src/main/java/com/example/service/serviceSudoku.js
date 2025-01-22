document.addEventListener('DOMContentLoaded', function () {
    const RULE_BUTTON = document.getElementById('rulesOfTheGame');
    const BACK_HOME_BUTTON = document.getElementById('back-home-button');
    const EASY_BUTTON = document.getElementById('easy-button');
    const MEDIUM_BUTTON = document.getElementById('medium-button');
    const HARD_BUTTON = document.getElementById('hard-button');
    const SUDOKU_BOARD = document.getElementById('board-mode');

    let sudokuBoard = [], resultSudokuBoard = [], indexHiddenCell = [], rowMark = [], colMark = [], matrixMark = [];
    let rows, cols, hiddenCell, largeCellSize;
    const CHARACTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const DIRECTIONS = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    function getDifficulty(difficulty) {
        if (difficulty === 'easy') {
            rows = cols = 4;
        } else if (difficulty === 'medium') {
            rows = cols = 9;
        } else if (difficulty === 'hard') {
            rows = cols = 16;
        }
        largeCellSize = Math.sqrt(rows);
        hiddenCell = Math.round(0.5 * rows * cols);
        SUDOKU_BOARD.innerHTML = '';
        SUDOKU_BOARD.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        SUDOKU_BOARD.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        initResultBoard();
        initHiddenSudokuBoard();
        initBoardGame();
    }

    function initResultBoard() {
        indexHiddenCell = Array(hiddenCell).fill(null).map(() => Array(2).fill(0));
        sudokuBoard = Array(rows).fill(null).map(() => Array(cols).fill(0));
        resultSudokuBoard = Array(rows).fill(null).map(() => Array(cols).fill(0));
        rowMark = Array(rows).fill(null).map(() => Array(CHARACTERS.length).fill(false));
        colMark = Array(cols).fill(null).map(() => Array(CHARACTERS.length).fill(false));
        matrixMark = Array.from({ length: Math.sqrt(rows) }, () =>
            Array.from({ length: largeCellSize }, () => Array(CHARACTERS.length).fill(false))
        );
        let characters = CHARACTERS.slice(0, rows);
        shuffleArray(characters);
        let characterMap = new Map();
        characters.forEach((char, index) => {
            characterMap.set(char, index);
        });
        helperInitResultBoard(0, 0, characters, characterMap, largeCellSize);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function helperInitResultBoard(i, j, characters, characterMap, size) {
        if (i === rows) return true;
        if (j === cols) return helperInitResultBoard(i + 1, 0, characters, characterMap, size);
        for (let char of characters) {
            let index = characterMap.get(char);
            if (!rowMark[i][index] && !colMark[j][index] && !matrixMark[Math.floor(i / size)][Math.floor(j / size)][index]) {
                resultSudokuBoard[i][j] = char;
                rowMark[i][index] = true;
                colMark[j][index] = true;
                matrixMark[Math.floor(i / size)][Math.floor(j / size)][index] = true;
                if (helperInitResultBoard(i, j + 1, characters, characterMap, size)) {
                    return true;
                }
                resultSudokuBoard[i][j] = 0;
                rowMark[i][index] = false;
                colMark[j][index] = false;
                matrixMark[Math.floor(i / size)][Math.floor(j / size)][index] = false;
            }
        }
        return false;
    }

    function initHiddenSudokuBoard() {
        sudokuBoard = resultSudokuBoard.map(row => [...row]);
        let added = new Set();
        let hidden = hiddenCell, idx = 0;
        while (hidden > 0) {
            let i = Math.floor(Math.random() * rows);
            let j = Math.floor(Math.random() * cols);
            const index = i * cols + j;
            if (!added.has(index)) {
                added.add(index);
                sudokuBoard[i][j] = 0;
                hidden--;
                indexHiddenCell[idx++] = [i, j];
            }
        }
    }

    function initBoardGame() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let cell = document.createElement('div');
                cellFormat(cell, i, j);
                SUDOKU_BOARD.appendChild(cell);
            }
        }
    }

    function cellFormat(cell, i, j) {
        if (rows === 4) {
            cell.style.fontSize = '54px';
            cell.style.lineHeight = `120px`;
            cell.style.width = `120px`;
            cell.style.height = `120px`;
        } else if (rows === 9) {
            cell.style.fontSize = '36px';
            cell.style.lineHeight = `70px`;
            cell.style.width = `70px`;
            cell.style.height = `70px`;
        } else {
            cell.style.fontSize = '18px';
            cell.style.lineHeight = `40px`;
            cell.style.width = `40px`;
            cell.style.height = `40px`;
        }
        cell.dataset.row = i.toString();
        cell.dataset.col = j.toString();
        cell.classList.add('cell')
        if (sudokuBoard[i][j] !== 0) {
            cell.innerHTML = sudokuBoard[i][j];
        }
        //outer edge border
        if (i === 0) cell.classList.add('border_top');
        if (i === rows - 1) cell.classList.add('border_bottom');
        if (j === 0) cell.classList.add('border_left');
        if (j === cols - 1) cell.classList.add('border_right');

        //special location border
        if (i === 0 && j === 0) cell.classList.add('border_left_top');
        if (i === 0 && j === cols - 1) cell.classList.add('border_right_top');
        if (i === rows - 1 && j === 0) cell.classList.add('border_left_bottom');
        if (i === rows - 1 && j === cols - 1) cell.classList.add('border_right_bottom');

        //inner border
        if (i % largeCellSize === 0 && i !== 0) cell.classList.add('border_top');
        if (j % largeCellSize === 0 && j !== 0) cell.classList.add('border_left');
    }

    function isVaLidIndex(i, j) {
        return 0 <= i && i < rows && 0 <= j && j < cols;
    }

    const path = window.location.pathname;
    if (path.includes('easyMode.html')) {
        getDifficulty('easy');
    } else if (path.includes('mediumMode.html')) {
        getDifficulty('medium');
    } else if (path.includes('hardMode.html')) {
        getDifficulty('hard');
    }

    if (EASY_BUTTON) {
        EASY_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/easyMode.html';
        });
    }

    if (MEDIUM_BUTTON) {
        MEDIUM_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/mediumMode.html';
        });
    }

    if (HARD_BUTTON) {
        HARD_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/hardMode.html';
        });
    }

    if (RULE_BUTTON) {
        RULE_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/rulesOfTheGame.html';
        });
    }

    if (BACK_HOME_BUTTON) {
        BACK_HOME_BUTTON.addEventListener('click', function () {
            window.location.href = '../index/home.html';
        });
    }
});