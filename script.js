class SudokuGame {
    constructor() {
        this.quotes = [
            "Take your time and enjoy the quiet",
            "A moment of peace in every number",
            "Find your rhythm, one square at a time",
            "Let the numbers guide your thoughts",
            "A peaceful puzzle for a peaceful mind"
        ];
        
        this.currentDifficulty = 'easy';
        this.board = [];
        this.solution = [];
        this.selectedCell = null;
        this.isDarkMode = false;
        
        this.initializeGame();
        this.setupEventListeners();
        this.setupThemeToggle();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('.theme-icon');
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.toggleTheme();
        }
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
            // Save theme preference
            localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        });
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.isDarkMode ? '☀️' : '🌙';
    }

    initializeGame() {
        this.generateNewPuzzle();
        this.updateQuote();
    }

    setupEventListeners() {
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.difficulty-btn.active').classList.remove('active');
                btn.classList.add('active');
                this.currentDifficulty = btn.dataset.difficulty;
                this.generateNewPuzzle();
            });
        });

        // New Puzzle button
        document.getElementById('newPuzzle').addEventListener('click', () => {
            this.generateNewPuzzle();
        });

        // Check Solution button
        document.getElementById('checkSolution').addEventListener('click', () => {
            this.checkSolution();
        });
    }

    generateNewPuzzle() {
        // Generate a solved board
        this.solution = this.generateSolvedBoard();
        
        // Create a puzzle by removing numbers based on difficulty
        this.board = JSON.parse(JSON.stringify(this.solution));
        this.removeNumbersBasedOnDifficulty();
        
        // Render the puzzle
        this.renderPuzzle();
    }

    generateSolvedBoard() {
        // Create an empty 9x9 board
        const board = Array(9).fill().map(() => Array(9).fill(0));
        
        // Fill the first row with random numbers
        const firstRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.shuffleArray(firstRow);
        board[0] = firstRow;
        
        // Solve the rest of the board
        this.solveSudoku(board);
        
        return board;
    }

    solveSudoku(board) {
        const emptyCell = this.findEmptyCell(board);
        if (!emptyCell) return true;
        
        const [row, col] = emptyCell;
        
        for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
                board[row][col] = num;
                
                if (this.solveSudoku(board)) {
                    return true;
                }
                
                board[row][col] = 0;
            }
        }
        
        return false;
    }

    findEmptyCell(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    isValid(board, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }
        
        return true;
    }

    removeNumbersBasedOnDifficulty() {
        let cellsToRemove;
        switch (this.currentDifficulty) {
            case 'easy':
                cellsToRemove = 30;
                break;
            case 'medium':
                cellsToRemove = 40;
                break;
            case 'hard':
                cellsToRemove = 50;
                break;
            default:
                cellsToRemove = 30;
        }
        
        const cells = [];
        for (let i = 0; i < 81; i++) {
            cells.push(i);
        }
        
        this.shuffleArray(cells);
        
        for (let i = 0; i < cellsToRemove; i++) {
            const cell = cells[i];
            const row = Math.floor(cell / 9);
            const col = cell % 9;
            this.board[row][col] = 0;
        }
    }

    renderPuzzle() {
        const puzzleElement = document.getElementById('currentPuzzle');
        puzzleElement.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.board[row][col] !== 0) {
                    cell.textContent = this.board[row][col];
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.row = row;
                    input.dataset.col = col;
                    input.addEventListener('input', (e) => {
                        const value = e.target.value;
                        if (value && !/^[1-9]$/.test(value)) {
                            e.target.value = '';
                        }
                    });
                    cell.appendChild(input);
                }
                
                // Add click event to highlight row and column
                cell.addEventListener('click', () => this.handleCellClick(cell, row, col));
                
                puzzleElement.appendChild(cell);
            }
        }
    }

    handleCellClick(cell, row, col) {
        // Remove previous highlights
        document.querySelectorAll('.cell.highlighted, .cell.selected').forEach(c => {
            c.classList.remove('highlighted', 'selected');
        });

        // Highlight the selected cell
        cell.classList.add('selected');

        // Highlight the row and column
        const cells = document.querySelectorAll('.cell');
        cells.forEach(c => {
            const cellRow = parseInt(c.dataset.row);
            const cellCol = parseInt(c.dataset.col);
            if (cellRow === row || cellCol === col) {
                c.classList.add('highlighted');
            }
        });
    }

    checkSolution() {
        const inputs = document.querySelectorAll('.cell input');
        let isCorrect = true;
        
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            const value = parseInt(input.value);
            
            if (value !== this.solution[row][col]) {
                isCorrect = false;
                input.style.backgroundColor = '#ffcccc';
            } else {
                input.style.backgroundColor = '#ccffcc';
            }
        });
        
        if (isCorrect) {
            alert('Congratulations! You solved the puzzle correctly!');
        } else {
            alert('Some numbers are incorrect. Keep trying!');
        }
    }

    updateQuote() {
        const quoteElement = document.getElementById('currentQuote');
        quoteElement.textContent = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new SudokuGame();
}); 