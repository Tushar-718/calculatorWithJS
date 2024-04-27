const output = document.querySelector(".inputField");
const keys = document.querySelectorAll(".key");

let outputText = [];

const keyArray = Array.from(keys);
output.value = 0;

//on click functions on buttons

let num = [];
for (let i = 0; i < keyArray.length; i++) {
    let currentKey = keyArray[i].innerHTML;
    keyArray[i].addEventListener("click", () => {
        switch (currentKey) {
            case "=": {
                outputText = output.value.split("");
                let resultParam = Array.isArray(output.value) ? outputText.join("") : outputText;
                let result = calculateExpression(resultParam);
                if (result?.toString().includes(".")) {
                    result = result.toFixed(2);
                    output.value=result;
                }
                else if (result === Infinity) {
                    output.value = "Infinity";
                    outputText = [];
                }
                else if (!result && result !== 0) {
                    output.value = "NaN";
                    outputText = [];
                }
                else{
                    output.value = result;
                    outputText = [result];
                }
                break;
            }
            case "C": {
                outputText = [];
                num = [];
                output.value = "";
                break;
            }
            default:
                if (outputText.length === 0 && currentKey === ".") {
                    outputText.push("0", ".");
                    output.value = outputText.join("");
                    num = ["0", "."];
                }
                else if (
                    // 2 consecutive operators are not allowed
                    !("+,-,*,/".includes(currentKey) && ("+,-,*,/".includes(outputText[outputText.length - 1]))) &&
                    // operator in starting is not allowed
                    !(outputText.length === 0 && "+,*,/".includes(currentKey)) &&
                    // two dots in one number is not allowed
                    !(num.includes(".") && currentKey === ".")) {
                    if ("+,-,*,/".includes(currentKey)) {
                        num = [];
                    }
                    num.push(currentKey);
                    outputText?.push(currentKey);
                    output.value = outputText.join("");
                }
        }
    });
}

// function to perform calculation
function calculateExpression(expression) {
    let numbers = [];
    let operators = [];
    // Helper function 
    function performOperation() {
        const operator = operators.pop();
        const operand2 = numbers.pop();
        const operand1 = numbers.pop();
        switch (operator) {
            case "+":
                numbers.push(operand1 + operand2);
                break;
            case "-":
                numbers.push(operand1 - operand2);
                break;
            case "*":
                numbers.push(operand1 * operand2);
                break;
            case "/":
                numbers.push(operand1 / operand2);
                break;
        }
    }
    // Loop through each character in the expression
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        if (!isNaN(parseInt(char)) || char === ".") {
            let numStr = "";
            while (!isNaN(parseInt(expression[i])) || expression[i] === ".") {
                numStr += expression[i];
                i++;
            }
            numbers.push(parseFloat(numStr));
            i--; 
        }
        // If character is an operator
        else if (char === "+" || char === "-" || char === "*" || char === "/") {
            // for -ve interger
            if (char === "-" && (i === 0 || "+-*/".includes(expression[i - 1]))) {
                let numStr = "-";
                i++;
                while (!isNaN(parseInt(expression[i])) || expression[i] === ".") {
                    numStr += expression[i];
                    i++;
                }
                numbers.push(parseFloat(numStr));
                i--;
            } else {
                while (
                    operators.length > 0 &&
                    precedence(operators[operators.length - 1]) >= precedence(char)
                ) {
                    performOperation();
                }
                operators.push(char);
            }
        }
    }
    while (operators.length > 0) {
        performOperation();
    }

    if (numbers){
        return numbers.pop();
    }
}

// function to determine operator precedence
function precedence(operator) {
    switch (operator) {
        case "+":
        case "-":
            return 1;
        case "*":
        case "/":
            return 2;
        default:
            return 0;
    }
}

