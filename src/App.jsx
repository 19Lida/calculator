import { useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [overwrite, setOverwrite] = useState(false);
  const [expression, setExpression] = useState("");
  const [theme, setTheme] = useState(() => {
    // Перевіряємо, чи є збережена тема у localStorage
    return localStorage.getItem("theme") || "dark";
  });

  // 🧩 Функція для перемикання теми
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // функція для цифр
  const appendNumber = (digit) => {
    //  overwrite = true означає “перезаписати” екран наступним введенням
    if (overwrite) {
      setDisplay(digit);
      setOverwrite(false); //повертає режим "дописування" не перезаписуй число
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }

    // 🔹 щоб при наборі другого числа зверху не зникав вираз.
    // Додаємо число до виразу тільки якщо вже є операція
    if (prevValue !== null && operation !== null) {
      setExpression(
        `${prevValue} ${operation} ${overwrite ? digit : display + digit}`
      );
    } else {
      setExpression(display === "0" ? digit : display + digit);
    }
  };

  const chooseOperation = (op) => {
    // 🟢 Якщо ще немає попереднього значення — зберігаємо поточне
    if (prevValue === null) {
      setPrevValue(display);
      setOperation(op);
      setExpression(`${display} ${op}`);
      setOverwrite(true); // перезаписуй попереднє число
      return;
    }

    // 🟢 Якщо ми щойно вибрали операцію і не ввели нове число — просто змінюємо її
    if (overwrite) {
      setOperation(op);
      setExpression(`${prevValue} ${op}`);
      return;
    }

    // 🟢 Інакше обчислюємо попередній вираз
    const value = compute();
    setPrevValue(value);
    setDisplay(value);
    setOperation(op);
    setExpression(`${value} ${op}`);
    setOverwrite(true); // перезаписуй попереднє число
  };

  const compute = () => {
    // console.log("🧮 Обчислення виконується...");
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

    // console.log(`✅ Результат: ${result}`);
    return result.toString();
  };

  // Натиснули '='
  const handleEquals = () => {
    // console.log("🟰 Натиснули '='");
    if (operation === null || prevValue === null) return;
    const value = compute();
    // Показуємо повний вираз зверху: 4 + 6 = 10
    setExpression(`${prevValue} ${operation} ${display} = ${value}`);
    // Оновлюємо екран
    setDisplay(value);
    setPrevValue(null); // поточна операція очищається
    setOperation(null); // поточна операція очищається
    setOverwrite(true); // перезаписуй попереднє число
  };

  const clear = () => {
    // console.log("🧹 Очищення калькулятора");
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
    <div className={`app-container ${theme}`}>
      <div className="calculator">
        <div className="display">
          <div className="expression-line">
            {expression || `${prevValue ?? ""} ${operation ?? ""}`}
          </div>
          <div className="main-display">{display}</div>
        </div>

        <div className="buttons">
          <button onClick={clear} className="btn-clear">
            C
          </button>
          <button onClick={handleBackspace} className="backspace">
            ⌫
          </button>
          <button
            className={operation === "/" ? "active" : ""}
            onClick={() => chooseOperation("/")}
          >
            ÷
          </button>
          <button
            className={operation === "*" ? "active" : ""}
            onClick={() => chooseOperation("*")}
          >
            ×
          </button>
          <button onClick={() => appendNumber("7")}>7</button>
          <button onClick={() => appendNumber("8")}>8</button>
          <button onClick={() => appendNumber("9")}>9</button>
          <button
            className={operation === "+" ? "active" : ""}
            onClick={() => chooseOperation("+")}
          >
            +
          </button>
          <button onClick={() => appendNumber("4")}>4</button>
          <button onClick={() => appendNumber("5")}>5</button>
          <button onClick={() => appendNumber("6")}>6</button>
          <button
            className={operation === "-" ? "active" : ""}
            onClick={() => chooseOperation("-")}
          >
            −
          </button>
          <button onClick={() => appendNumber("1")}>1</button>
          <button onClick={() => appendNumber("2")}>2</button>
          <button onClick={() => appendNumber("3")}>3</button>
          <button onClick={() => appendNumber(".")}>.</button>
          <button onClick={() => appendNumber("0")}>0</button>
          <button onClick={handleEquals} className="equals">
            =
          </button>
        </div>

        {/* 🔹 Подовгаста кнопка-перемикач теми */}
        <div className="theme-toggle" onClick={toggleTheme}>
          <div
            className={`toggle-thumb ${theme === "light" ? "light" : "dark"}`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;
