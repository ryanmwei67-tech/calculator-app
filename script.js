const display = document.getElementById("display");
const sound = document.getElementById("clickSound");

let currentInput = "";

/* Sound */
function playSound() {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {
            // Silently fail if sound can't play (e.g., muted browser)
        });
    }
}

/* Update display */
function updateDisplay() {
    display.value = currentInput || "0";
}

/* Add number or operator */
function append(value) {
    playSound();
    
    // Prevent multiple operators or decimals in succession
    if (["+", "-", "*", "/", "%"].includes(value)) {
        if (!currentInput || ["+", "-", "*", "/", "%"].includes(currentInput.slice(-1))) {
            return;
        }
    }
    
    // Prevent multiple decimal points
    if (value === ".") {
        const lastNumber = currentInput.split(/[\+\-\*\/%]/).pop();
        if (lastNumber.includes(".")) {
            return;
        }
    }
    
    currentInput += value;
    updateDisplay();
}

/* Clear all */
function clearAll() {
    playSound();
    currentInput = "";
    updateDisplay();
}

/* Delete last character */
function deleteLast() {
    playSound();
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

/* Safe calculation with validation */
function calculate() {
    playSound();
    
    if (!currentInput.trim()) {
        return;
    }
    
    try {
        // Validate input to prevent malicious code execution
        if (!isValidExpression(currentInput)) {
            display.value = "Invalid input";
            currentInput = "";
            return;
        }
        
        // Replace display symbols with JS operators
        let expression = currentInput
            .replace(/÷/g, "/")
            .replace(/×/g, "*")
            .replace(/−/g, "-");
        
        let result = eval(expression);
        
        // Check for valid result
        if (!isFinite(result)) {
            display.value = "Error";
            currentInput = "";
            return;
        }
        
        // Round to avoid floating-point errors
        result = Math.round(result * 100000000) / 100000000;
        
        currentInput = result.toString();
        updateDisplay();
    } catch (error) {
        display.value = "Error";
        currentInput = "";
    }
}

/* Validate expression before evaluation */
function isValidExpression(expr) {
    // Only allow numbers, operators, parentheses, Math functions, decimals
    const validPattern = /^[0-9+\-*/%().Math\s]*$/;
    if (!validPattern.test(expr)) {
        return false;
    }
    
    // Prevent Math function calls with invalid syntax
    if (expr.includes("Math.") && !/(Math\.(sqrt|sin|cos|tan|log10|PI|E|abs|pow))/g.test(expr)) {
        return false;
    }
    
    return true;
}

/* Keyboard support */
document.addEventListener("keydown", (e) => {
    const key = e.key;
    
    // Number keys
    if (/^[0-9]$/.test(key)) {
        append(key);
        e.preventDefault();
    }
    
    // Operators
    if (key === "+" || key === "-" || key === "*" || key === "/") {
        const displayKey = key === "*" ? "×" : key === "/" ? "÷" : key;
        append(key === "*" ? "*" : key === "/" ? "/" : key);
        e.preventDefault();
    }
    
    // Decimal point
    if (key === ".") {
        append(".");
        e.preventDefault();
    }
    
    // Calculate on Enter
    if (key === "Enter") {
        calculate();
        e.preventDefault();
    }
    
    // Delete on Backspace
    if (key === "Backspace") {
        deleteLast();
        e.preventDefault();
    }
    
    // Clear on Escape
    if (key === "Escape") {
        clearAll();
        e.preventDefault();
    }
});

/* Swipe gestures for touch devices */
let startX = 0;

display.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

display.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (diff > 50) {
        deleteLast(); // Swipe left to delete
    } else if (diff < -50) {
        clearAll(); // Swipe right to clear
    }
});

/* Theme toggle */
function toggleTheme() {
    playSound();
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

/* Scientific mode toggle */
function toggleScientific() {
    playSound();
    const scientificPanel = document.getElementById("scientific");
    scientificPanel.classList.toggle("hidden");
}

/* Initialize */
document.addEventListener("DOMContentLoaded", () => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    updateDisplay();
});
