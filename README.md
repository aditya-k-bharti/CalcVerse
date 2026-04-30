# 🧮 CalcVerse
> A universal calculator suite built with vanilla HTML, CSS, JavaScript, and Bootstrap 5 — covering everything from basic arithmetic to graph plotting.

**Live Demo → [adityakbharti-calcverse.netlify.app](https://adityakbharti-calcverse.netlify.app)**

---

## 🖩 Calculators

### 🔢 Basic
Standard arithmetic — add, subtract, multiply, divide, percentage, and sign toggle. Clean keypad with backspace and full expression display.

### 🎓 Scientific
Extends Basic with trigonometric functions (sin, cos, tan), logarithms (log, ln), square root, power (x²), reciprocal (1/x), factorial, and parentheses. Scientific keys appear inline on desktop and as an extra row on mobile.

### 🏦 Financial
Three sub-calculators in one panel:
- **EMI** — loan amount, interest rate, and tenure → monthly instalment + total payment
- **Compound Interest** — principal, rate, time, and compounding frequency → maturity amount
- **Discount** — original price + discount % → discounted price and savings

### 🏢 Business
- **Margin** — cost and selling price → gross margin %
- **Markup** — cost and selling price → markup %

### 🖨️ Printing
A tape-style calculator that logs every operation to a scrollable receipt. Supports clear tape and print tape actions.

### 💻 Programmable
Convert any number between **Decimal**, **Binary**, **Octal**, and **Hexadecimal** in one click. Input base is selectable via dropdown.

### 📈 Graph
Plot any JavaScript math expression `f(x)` on an HTML5 Canvas with a configurable x-range (±5, ±10, ±20, ±50).

### 🔄 Unit Converter
Convert values across four categories:
- **Length** — cm, m, km, and more
- **Weight** — g, kg, lb, and more
- **Temperature** — °C, °F, K
- **Speed** — m/s, km/h, mph

---

## ✨ Features

- 🌗 **Dark / Light theme** — one-click toggle with persistent preference
- 📋 **Calculation history** — scrollable log with clear and print options
- 💾 **Memory panel** — MC, MR, M+, M− for storing and recalling values
- ⚡ **Quick actions** — Copy result, Paste, PV/FV/PMT shortcut, Margin shortcut
- 📱 **Fully responsive** — Bootstrap 5 grid, works on mobile and desktop
- ⌨️ **Keyboard support** — type numbers and operators directly in Basic/Scientific modes
- 🔤 **Bootstrap Icons** — used throughout the UI

---

## 🗂️ Project Structure

```
CalcVerse/
├── index.html       # Main app — all calculator panels in one page
├── calcVerse.css    # Global theme, layout, and component styles
└── calcVerse.js     # All calculator logic (basic, sci, financial, graph, converter…)
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Structure & Canvas (graph) |
| CSS3 | Custom theme, responsive layout, animations |
| JavaScript (ES6+) | All calculator and converter logic |
| [Bootstrap 5](https://getbootstrap.com/) | Grid, layout utilities |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | UI icons |
| [Google Fonts – Inter](https://fonts.google.com/specimen/Inter) | Typography |

---

## 🚀 Run Locally

No build tools needed — pure vanilla project.

```bash
git clone https://github.com/aditya-k-bharti/CalcVerse.git
cd CalcVerse
```

Then just open `index.html` in your browser, or use a local server:

```bash
# With VS Code → Live Server extension (recommended)
# OR with Python
python -m http.server 8000
```

---

## 📸 Modes

| Mode | Description |
|---|---|
| Basic | Standard arithmetic calculator |
| Scientific | Trig, log, sqrt, power, factorial |
| Financial | EMI, compound interest, discount |
| Business | Profit margin and markup |
| Printing | Tape-style calculator with print |
| Programmable | Number base converter (Dec/Bin/Oct/Hex) |
| Graph | f(x) plotter on HTML5 Canvas |
| Converter | Length, weight, temperature, speed |

---

## 🙌 Author

**Aditya Kumar Bharti**

[![GitHub](https://img.shields.io/badge/GitHub-aditya--k--bharti-181717?style=flat&logo=github)](https://github.com/aditya-k-bharti)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-aditya--kumar--bharti-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/aditya-kumar-bharti-dev-6214b6354)

---

## 📄 License

MIT License — feel free to fork, modify, and use.
