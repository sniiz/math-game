function generateProblem(
  aDigits = 2,
  bDigits = 2,
  operator = "+",
  allowNegative = false,
  unknownIndex = 2
) {
  let a = Math.max(1, Math.floor(Math.random() * Math.pow(10, aDigits)));
  let b = Math.max(1, Math.floor(Math.random() * Math.pow(10, bDigits)));
  const operators = ["+", "-", "*"];
  if (!operators.includes(operator)) {
    throw new Error("Invalid operator");
  }
  if (!allowNegative && (a < 0 || b < 0)) {
    throw new Error("Negative numbers not allowed");
  }
  if (allowNegative && Math.random() < 0.5) {
    a = -a;
  }
  if (allowNegative && Math.random() < 0.5) {
    b = -b;
  }

  if (!allowNegative && operator === "-") {
    if (a < b) {
      [a, b] = [b, a];
    }
  }

  let result;
  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
  }

  let problem = "";
  if (unknownIndex === 0) {
    problem = `? ${operator} ${b} = ${result}`;
  } else if (unknownIndex === 1) {
    problem = `${a} ${operator} ? = ${result}`;
  } else {
    problem = `${a} ${operator} ${b} = ?`;
  }

  if (window?.location?.hostname === "localhost")
    console.log({
      a,
      b,
      result,
      problem,
      unknownIndex,
    });

  return {
    problem,
    answer: [a, b, result][unknownIndex % 3],
  };
}

export default generateProblem;
