import Phaser from 'phaser';
import { CreateCrossWord } from './script.js';  // Importing the function from gridUtils.js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

const gridSize = 20; // Grid will be 20x20
const cellSize = 40; // Size of each grid cell

function preload() {
    // No assets to load in this example
}

let gridText = [];

// Example 2D array of letters
const letterGrid = [
    ['A', 'B', 'C', 'D', 'E'],
    ['F', 'G', 'H', 'I', 'J'],
    ['K', 'L', 'M', 'N', 'O'],
    ['P', 'Q', 'R', 'S', 'T'],
    ['U', 'V', 'W', 'X', 'Y']
];

function create() {
    this.cameras.main.setBackgroundColor('#D3D3D3');  // Light sky blue
    // Draw a 20x20 grid
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            // Create a rectangle for each grid cell
            const girds = this.add.graphics().fillStyle(0xD3D3D3, 1)  // Set the new background color
                .fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
                .lineStyle(2, 0xFFFFFF, 1)  // White border with line width 2
                .strokeRect(col * cellSize, row * cellSize, cellSize, cellSize); // Draw each cell

            const text = this.add.text(
                col * cellSize + cellSize / 2, // x position (centered)
                row * cellSize + cellSize / 2, // y position (centered)
                "", // Letter to display
                {
                    font: '32px Arial',
                    fill: '#000000', // Black text color
                    align: 'center'
                }
            ).setOrigin(0.5); // Center the text in the cell
            gridText.push([text, girds]);
        }
    }
    // Create a simple "button" (text object) in the middle of the screen
    const button = this.add.text(600, config.height - 60, 'Generate', {
        font: '32px Arial',
        fill: '#ffffff',
        backgroundColor: '#0000ff',  // Blue background for the button
        padding: { x: 10, y: 5 },
        align: 'center',
    });

    // Create a simple "button" (text object) in the middle of the screen
    const button2 = this.add.text(0, config.height - 60, 'Reset', {
        font: '32px Arial',
        fill: '#ffffff',
        backgroundColor: '#0000ff',  // Blue background for the button
        padding: { x: 10, y: 5 },
        align: 'center',
    });

    // Make the button interactive
    button.setInteractive();

    // Add hover effects
    button.on('pointerover', () => {
        button.setStyle({
            fill: '#000000',  // Change text color to red on hover
            backgroundColor: '#00FF00',  // Keep the blue background
        });
    });

    button.on('pointerout', () => {
        button.setStyle({
            fill: '#ffffff',  // Revert text color to white when not hovering
            backgroundColor: '#0000ff',  // Keep the blue background
        });
    });
    // Add click event listener to the button
    button.on('pointerdown', () => {
        console.log('Clicked!');
        clearText();
        updateGridLetters(CreateCrossWord());

    });

    // Make the button interactive
    button2.setInteractive();

    // Add hover effects
    button2.on('pointerover', () => {
        button2.setStyle({
            fill: '#000000',  // Change text color to red on hover
            backgroundColor: '#FF0000',  // Keep the blue background
        });
    });

    button2.on('pointerout', () => {
        button2.setStyle({
            fill: '#ffffff',  // Revert text color to white when not hovering
            backgroundColor: '#0000ff',  // Keep the blue background
        });
    });
    // Add click event listener to the button2
    button2.on('pointerdown', () => {
        console.log('Clicked!');
        clearText();
    });
}

function clearText() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            gridText[20 * (row) + col][0].setText("");
            gridText[20 * (row) + col][1].fillStyle(0xD3D3D3, 1)  // Set the new background color
            .fillRect((col)*cellSize, (row)*cellSize, cellSize, cellSize) 
        }
    }
}

function updateGridLetters(newLetterArray) {
    const rows = newLetterArray.length;
    const cols = newLetterArray[0].length;
    const space_row = Math.floor((20 - rows) / 2)
    const space_cols = Math.floor((20 - cols) / 2)
    console.log(space_cols, space_row)
    // Update the letter content of the existing grid cells
    let index = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Update the text of the existing grid cell
            gridText[20 * (row + space_row) + col + space_cols][0].setText(newLetterArray[row][col]);
            if (newLetterArray[row][col] !== '') {
                gridText[20 * (row + space_row) + col + space_cols][1].fillStyle(0x03D3D3, 1)  // Set the new background color
                .fillRect((col + space_cols)*cellSize, (row + space_row)*cellSize, cellSize, cellSize)
            }
            index++;
        }
    }
}

function update() {
    // No logic needed for the grid in this example
}
