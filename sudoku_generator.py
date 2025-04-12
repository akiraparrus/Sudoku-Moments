from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
import random

class SudokuGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
        
    def setup_custom_styles(self):
        # Add custom styles for our cozy theme
        self.styles.add(ParagraphStyle(
            name='CozyTitle',
            parent=self.styles['Title'],
            fontSize=36,
            textColor=colors.HexColor('#4A4A4A'),
            alignment=1,
            spaceAfter=30
        ))
        
        self.styles.add(ParagraphStyle(
            name='CozySubtitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#6A6A6A'),
            alignment=1,
            spaceAfter=20
        ))

    def create_empty_grid(self):
        # Create a simple 9x9 grid with some numbers filled in
        grid = [[0 for _ in range(9)] for _ in range(9)]
        
        # Fill in some numbers to create a simple puzzle
        for i in range(3):
            for j in range(3):
                grid[i][j] = (i * 3 + j + 1) % 9 + 1
                
        return grid

    def draw_grid(self, canvas, x, y, size, grid):
        cell_size = size / 9
        thick_line = 2
        thin_line = 1
        
        # Draw the grid
        for i in range(10):
            line_width = thick_line if i % 3 == 0 else thin_line
            # Horizontal lines
            canvas.setLineWidth(line_width)
            canvas.line(x, y + i * cell_size, x + size, y + i * cell_size)
            # Vertical lines
            canvas.line(x + i * cell_size, y, x + i * cell_size, y + size)
        
        # Fill in the numbers
        canvas.setFont("Helvetica", 16)
        for i in range(9):
            for j in range(9):
                if grid[i][j] != 0:
                    canvas.drawString(
                        x + j * cell_size + cell_size/2 - 5,
                        y + (8-i) * cell_size + cell_size/2 - 7,
                        str(grid[i][j])
                    )

    def create_puzzle_page(self, canvas, doc, grid, difficulty, puzzle_num):
        # Set background color
        canvas.setFillColor(colors.HexColor('#FDF5E6'))  # Light beige
        canvas.rect(0, 0, letter[0], letter[1], fill=1)
        
        # Add title
        canvas.setFillColor(colors.HexColor('#4A4A4A'))
        canvas.setFont("Helvetica-Bold", 24)
        canvas.drawString(1*inch, 10*inch, f"{difficulty} Puzzle #{puzzle_num}")
        
        # Draw the grid
        self.draw_grid(canvas, 1*inch, 1*inch, 7*inch, grid)
        
        # Add quote
        quotes = [
            "Take your time and enjoy the quiet",
            "A moment of peace in every number",
            "Find your rhythm, one square at a time"
        ]
        canvas.setFont("Helvetica-Oblique", 12)
        canvas.setFillColor(colors.HexColor('#8A8A8A'))
        canvas.drawString(1*inch, 0.5*inch, random.choice(quotes))

    def generate_pdf(self, filename="sudoku_moments.pdf"):
        doc = SimpleDocTemplate(
            filename,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        story = []
        
        # Cover page
        story.append(Paragraph("Sudoku Moments", self.styles['CozyTitle']))
        story.append(Spacer(1, 2*inch))
        story.append(Paragraph("A Collection of Cozy Puzzles", self.styles['CozySubtitle']))
        story.append(PageBreak())
        
        # Generate puzzles for each difficulty
        difficulties = ["Easy", "Medium", "Hard"]
        for difficulty in difficulties:
            story.append(Paragraph(difficulty, self.styles['CozySubtitle']))
            story.append(PageBreak())
            
            for i in range(3):
                grid = self.create_empty_grid()
                self.create_puzzle_page(doc.canv, doc, grid, difficulty, i+1)
                doc.canv.showPage()
        
        doc.build(story)

if __name__ == "__main__":
    generator = SudokuGenerator()
    generator.generate_pdf() 