const display = document.getElementById("display");

function clearDisplay() {
    display.textContent = "0";
}

function deleteLast() {
    display.textContent = display.textContent.slice(0, -1);
    
    if (display.textContent === "") {
        display.textContent = "0";
    }
}   

function appendNumber(num) {
    if (display.textContent === "Error") {
        display.textContent = "0";
    }

    const currentNumber = display.textContent.split(/[+\-*/]/).pop();
    if (currentNumber === "0") {
        if (num === "0") {
            return;
        }
        display.textContent = display.textContent.slice(0, -1) + num;
        return;
    }

    display.textContent += num;
}

function appendDecimal() {
    if (display.textContent === "Error") {
        display.textContent = "0";
    }

    const currentNumber = display.textContent.split(/[+\-*/]/).pop();

    if (currentNumber.includes(".")) {
        return;
    }

    if (currentNumber === "") {
        display.textContent += "0.";
    } else if (display.textContent === "0") {
        display.textContent = "0.";
    } else {
        display.textContent += ".";
    }
}

function appendOperator(operator) {
    if (display.textContent === "Error") {
        return;
    }

    if (/[+\-*/]$/.test(display.textContent)) {
        display.textContent = display.textContent.slice(0, -1) + operator;
    } else if (display.textContent !== "0") {
        display.textContent = display.textContent.replace(/\.$/, "") + operator;
    }
}

function calculate() {
    const expression = display.textContent;
    const tokens = expression.match(/(?:\d+\.?\d*|\.\d+)|[+\-*/]/g);

    if (!tokens || tokens.join("") !== expression || /[+\-*/.]$/.test(expression)) {
        display.textContent = "Error";
        return;
    }

    const values = [];
    const operators = [];

    for (let i = 0; i < tokens.length; i++) {
        if (i % 2 === 0) {
            const value = Number(tokens[i]);
            if (!Number.isFinite(value)) {
                display.textContent = "Error";
                return;
            }
            values.push(value);
        } else {
            operators.push(tokens[i]);
        }
    }

    for (let i = 0; i < operators.length;) {
        if (operators[i] === "*" || operators[i] === "/") {
            const left = values[i];
            const right = values[i + 1];
            const result = operators[i] === "*" ? left * right : left / right;
            if (!Number.isFinite(result)) {
                display.textContent = "Error";
                return;
            }
            values.splice(i, 2, result);
            operators.splice(i, 1);
        } else {
            i++;
        }
    }

    let result = values[0];
    for (let i = 0; i < operators.length; i++) {
        result = operators[i] === "+" ? result + values[i + 1] : result - values[i + 1];
    }

    display.textContent = String(result);
}

document.addEventListener("keydown", (event) => {
    if (/^\d$/.test(event.key)) {
        appendNumber(event.key);
    } else if (event.key === "." || event.key === ",") {
        appendDecimal();
    } else if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
        appendOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    } else if (event.key === "Backspace") {
        deleteLast();
    } else if (event.key === "Escape" || event.key === "Delete") {
        clearDisplay();
    }
});