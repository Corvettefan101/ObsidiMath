'use strict';

const obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
    mySetting: 'default'
};

class MyPlugin extends obsidian.Plugin {
    async onload() {
        await this.loadSettings();

        this.addRibbonIcon('calculator', 'Utility Tools', (event) => {
            this.createUtilityTools();
        });

        this.registerDomEvent(document, 'click', (evt) => {
            // console.log('click', evt);
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    createUtilityTools() {
        // Calculator (Updated Styling)
        const calculator = document.createElement('div');
        calculator.id = 'calculator';
        calculator.style.position = 'absolute';
        calculator.style.top = '100px';
        calculator.style.left = '100px';
        calculator.style.border = '1px solid #ccc';
        calculator.style.padding = '10px';
        calculator.style.backgroundColor = 'black'; // Dark background
        calculator.style.color = 'white'; // White text
        calculator.style.cursor = 'move';
        calculator.innerHTML = `
                <input type="text" id="calculator-display" style="width: 200px; background-color: black; color: white; border: none; font-size: 20px;"><br>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('AC')">AC</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('+/-')">+/-</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('%')">%</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px; background-color: orange;" onclick="window.appendToDisplay('/')">÷</button><br>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('7')">7</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('8')">8</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('9')">9</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px; background-color: orange;" onclick="window.appendToDisplay('*')">×</button><br>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('4')">4</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('5')">5</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('6')">6</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px; background-color: orange;" onclick="window.appendToDisplay('-')">-</button><br>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('1')">1</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('2')">2</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('3')">3</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px; background-color: orange;" onclick="window.appendToDisplay('+')">+</button><br>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('#')">#</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('0')">0</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px;" onclick="window.appendToDisplay('.')">.</button>
                <button style="border-radius: 50%; width: 40px; height: 40px; margin: 5px; background-color: orange;" onclick="window.calculate()">=</button>
            `;
        document.body.appendChild(calculator);
        this.setupDraggable('calculator');
        this.setupCalculator();

        // Ruler (12 Inches and Centimeters)
        const ruler = document.createElement('div');
        ruler.id = 'ruler';
        ruler.style.position = 'absolute';
        ruler.style.top = '150px';
        ruler.style.left = '100px';
        ruler.style.border = '1px solid #ccc';
        ruler.style.padding = '10px';
        ruler.style.backgroundColor = '#f0f0f0';
        ruler.style.cursor = 'move';
        ruler.innerHTML = `<canvas id="ruler-canvas" width="600" height="50"></canvas>`; // Wider canvas for 12 inches
        document.body.appendChild(ruler);
        this.setupDraggable('ruler');
        this.setupRuler();

        // Protractor (Rotatable)
        const protractor = document.createElement('div');
        protractor.id = 'protractor';
        protractor.style.position = 'absolute';
        protractor.style.top = '200px';
        protractor.style.left = '100px';
        protractor.style.border = '1px solid #ccc';
        protractor.style.padding = '10px';
        protractor.style.backgroundColor = '#f0f0f0';
        protractor.style.cursor = 'move';
        protractor.innerHTML = `<canvas id="protractor-canvas" width="200" height="200"></canvas>`;
        document.body.appendChild(protractor);
        this.setupDraggable('protractor');
        this.setupProtractor();
        this.setupRotatableProtractor(); // Add rotatable functionality

        // Add the close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close All Tools'; // Label the button
        closeButton.style.position = 'absolute';  // Position it absolutely
        closeButton.style.top = '50px';        // Adjust vertical position as needed
        closeButton.style.left = '100px';       // Adjust horizontal position as needed
        closeButton.style.zIndex = '1000'; // Ensure it's above other elements
        closeButton.onclick = () => {
            // Remove each tool by its ID
            const calculatorElement = document.getElementById('calculator');
            const rulerElement = document.getElementById('ruler');
            const protractorElement = document.getElementById('protractor');

            if (calculatorElement) {
                calculatorElement.remove();
            }
            if (rulerElement) {
                rulerElement.remove();
            }
            if (protractorElement) {
                protractorElement.remove();
            }
        };
        document.body.appendChild(closeButton); // Add the button to the document
    }

    setupDraggable(id) {
        const element = document.getElementById(id);
        if (!element) return;

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    setupCalculator() {
        window.appendToDisplay = (value) => {
            const display = document.getElementById('calculator-display');
            if (display) {
                if (value === 'AC') {
                    display.value = '';
                } else if (value === '+/-') {
                    display.value = String(parseFloat(display.value) * -1);
                } else {
                    display.value += value;
                }
            }
        };

        window.calculate = () => {
            const display = document.getElementById('calculator-display');
            if (display) {
                try {
                    // Use a safer alternative to eval
                    const expression = display.value
                        .replace(/÷/g, '/') // Replace division symbol
                        .replace(/×/g, '*'); // Replace multiplication symbol

                    const result = new Function('return ' + expression)();
                    display.value = result;
                } catch (e) {
                    display.value = 'Error';
                }
            }
        };
    }

    setupRuler() {
        const canvas = document.getElementById('ruler-canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Wooden Texture
        ctx.fillStyle = '#F5DEB3'; // Light brown
        ctx.fillRect(0, 0, width, height);

        // Grain Lines
        ctx.strokeStyle = '#DEB887'; // Darker brown
        ctx.lineWidth = 0.5;
        for (let i = 0; i < height; i += 5) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        // Inch Markings
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        for (let i = 0; i <= 12; i++) {
            const x = (i / 12) * width;
            ctx.fillRect(x, height / 2 - 10, 1, 20); // Main inch marking
            if (i > 0) {
                ctx.fillText(String(i), x - 5, height / 2 + 25); // Inch label
            }
            for (let j = 1; j < 8; j++) {
                const subX = x + (width / 12) * (j / 8);
                ctx.fillRect(subX, height / 2 - 5, 1, 10); // Sub-inch markings
            }
        }

        // Centimeter Markings
        ctx.fillStyle = 'red';
        ctx.font = '10px Arial';
        for (let i = 0; i <= 30; i++) {
            const x = (i / 30) * width;
            ctx.fillRect(x, height / 2 - 15, 1, 5); // Centimeter markings
            if (i % 5 === 0) {
                ctx.fillRect(x, height / 2 - 20, 1, 10); // Longer cm markings
                ctx.fillText(String(i), x - 5, height / 2 - 25); // cm label
            }
        }
    }

    setupProtractor() {
        const canvas = document.getElementById('protractor-canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const radius = width / 2 - 10;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.strokeStyle = 'black';
        ctx.font = '10px Arial';

        // Draw the semicircle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.stroke();

        // Draw the horizontal base line
        ctx.beginPath();
        ctx.moveTo(10, centerY);
        ctx.lineTo(width - 10, centerY);
        ctx.stroke();

        // Draw radial lines and degree labels
        for (let i = 0; i <= 180; i += 10) {
            const rad = (i + 180) * Math.PI / 180; // Adjusted for semicircle
            const x = centerX + radius * Math.cos(rad);
            const y = centerY + radius * Math.sin(rad);

            // Draw radial line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Draw degree labels
            ctx.fillText(String(i), x - 15, y - 5);
             ctx.fillText(String(180 - i), x - 15, centerY + 15);
        }
    }

    setupRotatableProtractor() {
        const protractor = document.getElementById('protractor');
        const canvas = document.getElementById('protractor-canvas');
        if (!canvas || !protractor) return;

        let isDragging = false;
        let startX, startY, startAngle = 0;
        let currentAngle = 0;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startAngle = currentAngle;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                // Calculate rotation angle based on mouse movement
                currentAngle = startAngle + (deltaX / 5); // Adjust sensitivity as needed
                protractor.style.transform = `rotate(${currentAngle}deg)`;
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
}

module.exports = MyPlugin;
