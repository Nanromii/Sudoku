document.addEventListener('DOMContentLoaded', function () {
    const SUDOKU_BOARD = document.getElementById('board-mode');
    const NUMBERS_HINTS = document.getElementById('number');
    const HINT_BUTTON = document.getElementById('hints');

    let sudokuBoard = [], resultSudokuBoard = [], rowMark = [], colMark = [], matrixMark = [];
    let rows, cols, hiddenCell, largeCellSize, number_hints = 0;
    const CHARACTERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G"];

    function getDifficulty(difficulty) {
        if (difficulty === 'easy') {
            number_hints = 1;
            NUMBERS_HINTS.textContent = number_hints;
            rows = cols = 4;
        } else if (difficulty === 'medium') {
            number_hints = 3;
            NUMBERS_HINTS.textContent = number_hints;
            rows = cols = 9;
        } else if (difficulty === 'hard') {
            number_hints = 7;
            NUMBERS_HINTS.textContent = number_hints;
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
        let hidden = hiddenCell;
        while (hidden > 0) {
            let i = Math.floor(Math.random() * rows);
            let j = Math.floor(Math.random() * cols);
            const index = i * cols + j;
            if (!added.has(index)) {
                added.add(index);
                sudokuBoard[i][j] = 0;
                hidden--;
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
        cell.classList.add('cell');
        if (sudokuBoard[i][j] !== 0) {
            cell.innerHTML = sudokuBoard[i][j];
        } else {
            cell.setAttribute('contenteditable', 'true');
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

    function correctWithTheGivenAnswer() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                let cellData = cell.textContent.trim();
                if (cellData === "") return false;
            }
        }
        return checkAnswer();
    }

    function checkAnswer() {
        let rowM = Array(rows).fill(null).map(() => Array(CHARACTERS.length).fill(false));
        let colM = Array(cols).fill(null).map(() => Array(CHARACTERS.length).fill(false));
        let matrixM = Array.from({ length: Math.sqrt(rows) }, () =>
            Array.from({ length: Math.sqrt(cols) }, () => Array(CHARACTERS.length).fill(false))
        );
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                let cellData = cell.textContent.trim();
                if (cellData !== "") {
                    let charIndex = CHARACTERS.indexOf(cellData);
                    if (rowM[i][charIndex] || colM[j][charIndex] || matrixM[Math.floor(i / Math.sqrt(rows))][Math.floor(j / Math.sqrt(cols))][charIndex]) {
                        return false;
                    }
                    rowM[i][charIndex] = true;
                    colM[j][charIndex] = true;
                    matrixM[Math.floor(i / Math.sqrt(rows))][Math.floor(j / Math.sqrt(cols))][charIndex] = true;
                }
            }
        }
        return true;
    }

    document.addEventListener('input', function (ev) {
        if (ev.target.classList.contains('cell')) {
            const row = parseInt(ev.target.dataset.row, 10);
            const col = parseInt(ev.target.dataset.col, 10);
            const value = ev.target.textContent.trim();
            if (checkEnteredCharacter(value)) {
                sudokuBoard[row][col] = value;
                if (correctWithTheGivenAnswer()) {
                    alert("You win.");
                }
            } else {
                sudokuBoard[row][col] = 0;
                ev.target.textContent = '';
            }
        }
    });

    document.addEventListener('keydown', function (ev) {
        if (ev.target.classList.contains('cell')) {
            const value = ev.key;
            if (!checkEnteredCharacter(value) && (ev.key !== 'Backspace')) {
                ev.target.style.transform = 'translateX(2px)';
                setTimeout(() => {
                    ev.target.style.transform = 'translateX(-2px)';
                }, 100);
                setTimeout(() => {
                    ev.target.style.transform = 'translateX(0)';
                }, 200);
                ev.target.style.backgroundColor = '#ec778e';
                setTimeout(() => {
                    ev.target.style.transform = 'translateX(0)';
                    ev.target.style.backgroundColor = '';
                }, 200);
            }
        }
    });

    function checkEnteredCharacter(input) {
        if (rows === 4) {
            return (/^\d$/.test(input) && input > 0 && input < 5);
        } else if (rows === 9) {
            return (/^\d$/.test(input) && input > 0 && input < 10);
        }
        return /^[A-G]$/.test(input) || (/^\d$/.test(input) && input > 0 && input < 10);
    }

    HINT_BUTTON.addEventListener('click', function () {
        updatedHints();
    });

    function updatedHints() {
        if (number_hints === 0) {
            return;
        }
        let i = Math.floor(Math.random() * rows);
        let j = Math.floor(Math.random() * cols);
        let cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        while (cell.textContent.trim() !== "") {
            i = Math.floor(Math.random() * rows);
            j = Math.floor(Math.random() * cols);
            cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        }
        cell.innerHTML = resultSudokuBoard[i][j];
        NUMBERS_HINTS.textContent = (number_hints - 1).toString();
        --number_hints;
    }

    const path = window.location.pathname;
    if (path.includes('EasyMode.html')) {
        getDifficulty('easy');
    } else if (path.includes('MediumMode.html')) {
        getDifficulty('medium');
    } else if (path.includes('HardMode.html')) {
        getDifficulty('hard');
    }
});