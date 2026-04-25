const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
const sound = document.getElementById("clickSound");

let currentInput = "";

/* Sound */
function playSound() {
    if(sound){
        sound.currentTime = 0;
        sound.play();
    }
}

/* Update display */
function updateDisplay() {
    display.value = currentInput || "0";
}

/* Add number */
function append(value) {
    playSound();
    currentInput += value;
    updateDisplay();
}

/* Clear */
function clearAll() {
    playSound();
    currentInput = "";
    updateDisplay();
}

/* Delete */
function deleteLast() {
    playSound();
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

/* Calculate */
function calculate() {
    playSound();
    try {
        let result = eval(currentInput);

        addHistory(currentInput, result);

        currentInput = result.toString();
        updateDisplay();
    } catch {
        display.value = "Error";
        currentInput = "";
    }
}

/* History */
function addHistory(exp, result) {
    let li = document.createElement("li");
    li.textContent = `${exp} = ${result}`;
    historyList.prepend(li);
}

/* Swipe gestures */
let startX = 0;

display.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

display.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) deleteLast();
    if (endX - startX > 50) clearAll();
});

/* Init */
updateDisplay();