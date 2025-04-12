# Sudoku Moments Generator

A Python script that generates a cozy-themed printable Sudoku game PDF with puzzles of varying difficulty levels.

## Features

- Generates 9 unique Sudoku puzzles (3 each of Easy, Medium, and Hard difficulty)
- Beautiful, cozy-themed layout with soft colors and ample white space
- Includes inspirational quotes on each puzzle page
- Complete answer key section
- Clean, well-documented code for easy customization

## Requirements

- Python 3.7 or higher
- Required packages (install using `pip install -r requirements.txt`):
  - numpy
  - reportlab

## Installation

1. Clone or download this repository
2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

Simply run the script:
```bash
python sudoku_generator.py
```

This will generate a PDF file named `sudoku_moments.pdf` in the current directory.

## Customization

The script is designed to be easily customizable. You can modify:

- Colors and styling in the `setup_custom_styles` method
- Puzzle difficulty by adjusting the number of cells removed in the `remove_numbers` method
- Quotes by editing the quotes list in the `create_puzzle_page` method
- Layout and spacing by adjusting the values in the `generate_pdf` method

## License

This project is open source and available under the MIT License. 