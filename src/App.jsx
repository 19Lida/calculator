import { useState,useEffect } from 'react';
import './App.css'

function App() {
   const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [overwrite, setOverwrite] = useState(false);
  const [expression, setExpression] = useState("");

  // 🧠 useEffect покаже, коли змінюється будь-який стан
  useEffect(() => {
    console.log("🟢 State updated:");
    console.log("display:", display);
    console.log("prevValue:", prevValue);
    console.log("operation:", operation);
    console.log("overwrite:", overwrite);
    console.log("--------------------------");
  }, [display, prevValue, operation, overwrite]);

    // функція для цифр
 const appendNumber = (digit) => {
  if (overwrite) {
    setDisplay(digit);
    setOverwrite(false);
  } else {
    setDisplay(display === "0" ? digit : display + digit);
  }

  // 🔹 Це важливо: щоб при наборі другого числа зверху не зникав вираз.
  // Додаємо число до виразу тільки якщо вже є операція
  if (prevValue !== null && operation !== null) {
    setExpression(`${prevValue} ${operation} ${overwrite ? digit : display + digit}`);
  }else {
    setExpression(display === "0" ? digit : display + digit);
  }
};

  const chooseOperation = (op) => {
    console.log(`➕ Вибрали операцію: ${op}`);
    if (prevValue === null) {
      setPrevValue(display);
      setExpression(`${display} ${op}`); // ✅ показує одразу 7 +
    } else if (!overwrite) {
      const value = compute();
      setPrevValue(value);
      setDisplay(value);
      setExpression(`${value} ${op} `);
    }else {
    setExpression(`${display} ${op}`);
    setPrevValue(display);
  }
    setOperation(op);
    setOverwrite(true);
   
  };

  const compute = () => {
    console.log("🧮 Обчислення виконується...");
    if (operation === null || prevValue === null) return display;

    const curr = parseFloat(display);
    const prev = parseFloat(prevValue);
    let result = 0;

    switch (operation) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "*":
        result = prev * curr;
        break;
      case "/":
        result = curr !== 0 ? prev / curr : "Err";
        break;
      default:
        return display;
    }

    console.log(`✅ Результат: ${result}`);
    return result.toString();
  };

     // Натиснули '='
  const handleEquals = () => {
    console.log("🟰 Натиснули '='");
    if (operation === null || prevValue === null) return;
    const value = compute();
    // Показуємо повний вираз зверху: 4 + 6 = 10
    setExpression(`${prevValue} ${operation} ${display} = ${value}`); 
    // Оновлюємо екран
    setDisplay(value);
    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);// поточна операція очищається
  };

  const clear = () => {
    console.log("🧹 Очищення калькулятора");
    setDisplay("0");
    setPrevValue(null);
    setOperation(null);
    setExpression("");
    setOverwrite(false);
  };
const handleBackspace = () => {
  if (overwrite) return; // якщо щойно було "=" або операція — нічого не видаляємо

  if (display.length === 1) {
    setDisplay("0");
  } else {
    setDisplay(display.slice(0, -1));
  }

  // 🔹 оновлюємо вираз зверху
  if (prevValue !== null && operation !== null) {
    setExpression(`${prevValue} ${operation} ${display.slice(0, -1)}`);
  } else {
    setExpression(display.slice(0, -1));
  }
};
  return (
    <div className="calculator">
     <div className="expression">{expression || `${prevValue ?? ""} ${operation ?? ""}`}</div>
      <div className="display">{display}</div>
       <div className="buttons">
        <button onClick={clear}>C</button>
        <button onClick={handleBackspace} className="backspace">⌫</button>
        <button  className={operation === "/" ? "active" : ""} onClick={() => chooseOperation("/")}>÷</button>
        <button className={operation === "*" ? "active" : ""} onClick={() => chooseOperation("*")}>×</button>
        <button onClick={() => appendNumber("7")}>7</button>
        <button onClick={() => appendNumber("8")}>8</button>
        <button onClick={() => appendNumber("9")}>9</button>
        <button className={operation === "+" ? "active" : ""}  onClick={() => chooseOperation("+")}>+</button>
        <button onClick={() => appendNumber("4")}>4</button>
        <button onClick={() => appendNumber("5")}>5</button>
        <button onClick={() => appendNumber("6")}>6</button>
         <button className={operation === "-" ? "active" : ""} onClick={() => chooseOperation("-")}>−</button>
        <button onClick={() => appendNumber("1")}>1</button>
        <button onClick={() => appendNumber("2")}>2</button>
        <button onClick={() => appendNumber("3")}>3</button>
        <button onClick={() => appendNumber(".")}>.</button>
        <button onClick={() => appendNumber("0")}>0</button>
        <button onClick={handleEquals} className="equals">=</button>
     </div>

      {/* 🪄 Додаткова панель станів */}
      <div className="debug">
        <h3>🧩 Поточні стани:</h3>
        <p><b>display:</b> {display}</p>
        <p><b>prevValue:</b> {prevValue ?? "—"}</p>
        <p><b>operation:</b> {operation ?? "—"}</p>
        <p><b>overwrite:</b> {overwrite.toString()}</p>
      </div>
    </div>
  )

}

export default App
