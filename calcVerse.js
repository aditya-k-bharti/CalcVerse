// Wrap code in DOMContentLoaded to ensure elements are ready

document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const modeTabs = document.getElementById('modeTabs');
  const exprDisplay = document.getElementById('exprDisplay');
  const display = document.getElementById('display');
  const keys = document.getElementById('keys');
  const memoryValueEl = document.getElementById('memoryValue');
  const mcButton = document.getElementById('mc');
  const mrButton = document.getElementById('mr');
  const mplusButton = document.getElementById('mplus');
  const mminusButton = document.getElementById('mminus');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistory');
  const modal = document.getElementById('modal');
  const modalCancel = document.getElementById('modalCancel');
  const modalSubmit = document.getElementById('modalSubmit');
  const modalTitle = document.getElementById('modalTitle');
  const modalFields = document.getElementById('modalFields');
  const modalForm = document.getElementById('modalForm');
  const modeLabel = document.getElementById('modeLabel');
  const openPanelsMobileBtn = document.getElementById('openPanelMobile');
  const sidePanels = document.getElementById('sidePanels');
  const copyBtn = document.getElementById('copyBtn');
  const pvfmptBtn = document.getElementById('pvfmpt');
  const marginQuickBtn = document.getElementById('marginQuick');
  const printHistoryBtn = document.getElementById('printHistory');
  const calculatorCard = document.getElementById('calculatorCard');

  // State variables

  let currentTheme = 'dark';
  let currentMode = 'basic';
  let memoryValue = 0;
  let currentExpression = '';
  let justCalculated = false;
  let history = [];

  // Helper: Update display

  function updateDisplay(value) {
    display.textContent = value;
  }

  function updateExpression(expr) {
    exprDisplay.textContent = expr;
  }

  // Theme toggle - Fixed

  themeToggle.addEventListener('click', () => {
    if(currentTheme === 'dark') {
      htmlEl.setAttribute('data-theme', 'light');
      currentTheme = 'light';
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      htmlEl.removeAttribute('data-theme');
      currentTheme = 'dark';
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  });

  // Mode tabs switching - Enhanced for mobile scientific mode

  modeTabs.addEventListener('click', (e) => {
    if(e.target.classList.contains('tab')) {
      // Remove active from all tabs

      modeTabs.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      currentMode = e.target.getAttribute('data-mode');
      modeLabel.textContent = `Mode: ${capitalize(currentMode)}`;

      // Handle scientific mode for mobile

      if(window.innerWidth <= 700) {
        if(currentMode === 'scientific') {
          calculatorCard.classList.add('scientific-mode');
        } else {
          calculatorCard.classList.remove('scientific-mode');
        }
      }

      resetCalculator();
    }
  });

  // Capitalize helper

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Reset calculator to default state

  function resetCalculator() {
    currentExpression = '';
    updateExpression('');
    updateDisplay('0');
    justCalculated = false;
  }

  // Calculation helper safely evaluates expression

  function calculateExpression(expr) {
    try {
      // Replace some operators if needed and prevent dangerous input

      const safeExpr = expr.replace(/[^-()\d/*+.]/g, '');
      // eslint-disable-next-line no-eval

      const result = eval(safeExpr);
      return Number.isFinite(result) ? result : 'Error';
    } catch {
      return 'Error';
    }
  }

  // Process key presses

  keys.addEventListener('click', (e) => {
    if(!e.target.classList.contains('key')){
      return;
    }

    const key = e.target;
    const num = key.getAttribute('data-num');
    const action = key.getAttribute('data-action');

    if(num !== null) {
      if(justCalculated) {
        currentExpression = '';
        justCalculated = false;
      }
      currentExpression += num;
      updateExpression(currentExpression);
      updateDisplay(currentExpression);
      return;
    }

    switch(action) {
      case 'clear':
        resetCalculator();
        break;

      case 'back':
        if(justCalculated) {
          resetCalculator();
        } else {
          currentExpression = currentExpression.slice(0, -1);
          updateExpression(currentExpression);
          updateDisplay(currentExpression || '0');
        }
        break;

      case 'dot':
        if(justCalculated) {
          currentExpression = '0.';
          justCalculated = false;
        } else if(!currentExpression.includes('.') || /[+\-*/]/.test(currentExpression.slice(-1))) {
          if(currentExpression === '' || /[+\-*/]$/.test(currentExpression)) {
            currentExpression += '0.';
          } else {
            currentExpression += '.';
          }
        }
        updateExpression(currentExpression);
        updateDisplay(currentExpression);
        break;

      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        if(justCalculated) justCalculated = false;
        const operatorMap = {
          add: '+',
          subtract: '-',
          multiply: '*',
          divide: '/',
        };
        if(currentExpression.length === 0 && action === 'subtract') {
          // Allow negative sign at start
          currentExpression = '-';
        } else if(currentExpression.length > 0) {
          // Avoid two operators in a row
          if(/[-+*/.]$/.test(currentExpression)) {
            currentExpression = currentExpression.slice(0, -1) + operatorMap[action];
          } else {
            currentExpression += operatorMap[action];
          }
        }
        updateExpression(currentExpression);
        updateDisplay(operatorMap[action]);
        break;

      case 'equals':
        if(currentExpression.length > 0) {
          const result = calculateExpression(currentExpression);
          if(result !== 'Error') {
            updateDisplay(result);
            updateExpression(currentExpression + ' =');
            addHistory(currentExpression + ' = ' + result);
            currentExpression = result.toString();
            justCalculated = true;
          } else {
            updateDisplay('Error');
            currentExpression = '';
          }
        }
        break;

      case 'percent':
        if(currentExpression.length > 0) {
          const val = calculateExpression(currentExpression);
          if(val !== 'Error') {
            const percentVal = val / 100;
            currentExpression = percentVal.toString();
            updateExpression(currentExpression);
            updateDisplay(currentExpression);
          }
        }
        break;

      case 'plusminus':
        if(currentExpression.length > 0) {
          if(currentExpression.startsWith('-')) {
            currentExpression = currentExpression.slice(1);
          } else {
            currentExpression = '-' + currentExpression;
          }
          updateExpression(currentExpression);
          updateDisplay(currentExpression);
        }
        break;

      case 'sqrt':
        if(currentExpression.length > 0) {
          const val = calculateExpression(currentExpression);
          if(val >= 0 && val !== 'Error') {
            const sqrtVal = Math.sqrt(val);
            currentExpression = sqrtVal.toString();
            updateExpression('√(' + val + ')');
            updateDisplay(currentExpression);
            addHistory('√(' + val + ') = ' + sqrtVal);
          }
        }
        break;

      case 'pow':
        if(currentExpression.length > 0) {
          const val = calculateExpression(currentExpression);
          if(val !== 'Error') {
            const squared = val * val;
            currentExpression = squared.toString();
            updateExpression(val + '²');
            updateDisplay(currentExpression);
            addHistory(val + '² = ' + squared);
          }
        }
        break;

      case 'inv':
        if(currentExpression.length > 0) {
          const val = calculateExpression(currentExpression);
          if(val !== 0 && val !== 'Error') {
            const invVal = 1 / val;
            currentExpression = invVal.toString();
            updateExpression('1/' + val);
            updateDisplay(currentExpression);
            addHistory('1/' + val + ' = ' + invVal);
          }
        }
        break;

      case 'sin':
        if(currentExpression.length > 0) {
          const val = calculateExpression(currentExpression);
          if(val !== 'Error') {
            const sinVal = Math.sin(val * Math.PI / 180); // Convert to radians
            currentExpression = sinVal.toString();
            updateExpression('sin(' + val + '°)');
            updateDisplay(currentExpression);
            addHistory('sin(' + val + '°) = ' + sinVal);
          }
        }
        break;

      case 'cos':
        if(currentExpression.length > 0) {
          const val = calculateExpression(currentExpression);
          if(val !== 'Error') {
            const cosVal = Math.cos(val * Math.PI / 180); // Convert to radians
            currentExpression = cosVal.toString();
            updateExpression('cos(' + val + '°)');
            updateDisplay(currentExpression);
            addHistory('cos(' + val + '°) = ' + cosVal);
          }
        }
        break;

      case 'tan':
        if(currentExpression.length > 0) {
          const val = calculateExpression(currentExpression);
          if(val !== 'Error') {
            const tanVal = Math.tan(val * Math.PI / 180); // Convert to radians
            currentExpression = tanVal.toString();
            updateExpression('tan(' + val + '°)');
            updateDisplay(currentExpression);
            addHistory('tan(' + val + '°) = ' + tanVal);
          }
        }
        break;

      case 'margin':
      case 'markup':
        openModal(action);
        break;

      case 'openParen':
        if(justCalculated){
          currentExpression = '';
          justCalculated = false;
        }
        currentExpression += '(';
        updateExpression(currentExpression);
        updateDisplay(currentExpression);
        break;

      case 'closeParen':
        if(currentExpression.length > 0){
          currentExpression += ')';
          updateExpression(currentExpression);
          updateDisplay(currentExpression);
        }
        break;

      case 'factorial':
        if(currentExpression.length > 0){
          const val = calculateExpression(currentExpression);
          if(val >= 0 && Number.isInteger(val)){
            let fact = 1;
            for(let i = 1; i<= val; i++){
              fact *= i;
            }
            currentExpression = fact.toString();
            updateExpression(val + "!");
            updateDisplay(currentExpression);
            addHistory(val + '! = ' + fact);
          } else{
            updateDisplay('Error');
          }
        }
        break;
    }
  });

  // Memory functions

  function updateMemoryDisplay() {
    memoryValueEl.textContent = memoryValue.toString();
  }

  mcButton.addEventListener('click', () => {
    memoryValue = 0;
    updateMemoryDisplay();
  });

  mrButton.addEventListener('click', () => {
    if(justCalculated) currentExpression = '';
    currentExpression += memoryValue.toString();
    updateExpression(currentExpression);
    updateDisplay(memoryValue.toString());
    justCalculated = false;
  });

  mplusButton.addEventListener('click', () => {
    let val = calculateExpression(currentExpression);
    if(val !== 'Error') {
      memoryValue += val;
      updateMemoryDisplay();
    }
  });

  mminusButton.addEventListener('click', () => {
    let val = calculateExpression(currentExpression);
    if(val !== 'Error') {
      memoryValue -= val;
      updateMemoryDisplay();
    }
  });

  // History functions

  function addHistory(entry) {
    history.unshift(entry); // newest first
    if(history.length > 10){
      history.pop(); // keep only 10 entries
    } 
    renderHistory();
  }

  function renderHistory() {
    if(history.length === 0) {
      historyList.innerHTML = '<div class="muted">No history yet</div>';
      return;
    }
    historyList.innerHTML = history.map(item => `<div class="history-item">${item}</div>`).join('');
  }

  clearHistoryBtn.addEventListener('click', () => {
    history = [];
    renderHistory();
  });

  // Copy function

  copyBtn.addEventListener('click', () => {
    const currentValue = display.textContent;
    navigator.clipboard.writeText(currentValue).then(() => {
      // Visual feedback

      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1000);
    }).catch(() => {
      // Fallback for older browsers

      const textArea = document.createElement('textarea');
      textArea.value = currentValue;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1000);
    });
  });

  // Quick buttons

  pvfmptBtn.addEventListener('click', () => {
    openModal('pvfmpt');
  });

  marginQuickBtn.addEventListener('click', () => {
    openModal('margin');
  });

  printHistoryBtn.addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>CalcVerse History</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .history-item { margin-bottom: 10px; padding: 5px; border-bottom: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>CalcVerse History</h1>
          ${history.map(item => `<div class="history-item">${item}</div>`).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  });

  // Modal functions

  function openModal(type) {
    modal.classList.add('active');
    modalTitle.textContent = `Compute: ${capitalize(type)}`;
    modalFields.innerHTML = '';

    if(type === 'margin' || type === 'markup') {
      modalFields.innerHTML = `
        <label>Cost Price: <input type="number" name="costPrice" step="any" required></label>
        <label>Selling Price: <input type="number" name="sellingPrice" step="any" required></label>
      `;
    }
    else if(type === 'pvfmpt') {
      modalFields.innerHTML = `
        <label>Present Value (PV): <input type="number" name="pv" step="any"></label>
        <label>Future Value (FV): <input type="number" name="fv" step="any"></label>
        <label>Payment (PMT): <input type="number" name="pmt" step="any"></label>
        <label>Rate (%): <input type="number" name="rate" step="any"></label>
        <label>Periods (n): <input type="number" name="n" step="any"></label>
      `;
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    modalFields.innerHTML = '';
  }

  modalCancel.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  });

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(modalForm);
    
    if(modalTitle.textContent.toLowerCase().includes('margin')) {
      const costPrice = parseFloat(formData.get('costPrice'));
      const sellingPrice = parseFloat(formData.get('sellingPrice'));
      if(costPrice > 0 && sellingPrice > 0) {
        const margin = ((sellingPrice - costPrice) / sellingPrice) * 100;
        updateDisplay(margin.toFixed(2) + '%');
        updateExpression(`Margin (${costPrice}, ${sellingPrice})`);
        addHistory(`Margin: ${margin.toFixed(2)}%`);
      }
    }
    else if(modalTitle.textContent.toLowerCase().includes('markup')) {
      const costPrice = parseFloat(formData.get('costPrice'));
      const sellingPrice = parseFloat(formData.get('sellingPrice'));
      if(costPrice > 0 && sellingPrice > 0) {
        const markup = ((sellingPrice - costPrice) / costPrice) * 100;
        updateDisplay(markup.toFixed(2) + '%');
        updateExpression(`Markup (${costPrice}, ${sellingPrice})`);
        addHistory(`Markup: ${markup.toFixed(2)}%`);
      }
    }

    closeModal();
  });

  // Mobile panels toggle - Enhanced functionality

  openPanelsMobileBtn.addEventListener('click', () => {
    sidePanels.classList.toggle('mobile-active');
    
    // Update button text based on panel state

    if(sidePanels.classList.contains('mobile-active')) {
      openPanelsMobileBtn.textContent = 'Close';
    } else {
      openPanelsMobileBtn.textContent = 'Panels';
    }
  });

  // Close mobile panels when clicking outside

  document.addEventListener('click', (e) => {
    if(window.innerWidth <= 900 && sidePanels.classList.contains('mobile-active')) {
      if(!sidePanels.contains(e.target) && !openPanelsMobileBtn.contains(e.target)) {
        sidePanels.classList.remove('mobile-active');
        openPanelsMobileBtn.textContent = 'Panels';
      }
    }
  });

  // Close mobile panels on escape key

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && sidePanels.classList.contains('mobile-active')) {
      sidePanels.classList.remove('mobile-active');
      openPanelsMobileBtn.textContent = 'Panels';
    }
  });

  // Handle window resize for scientific mode

  window.addEventListener('resize', () => {
    if(window.innerWidth <= 700) {
      if(currentMode === 'scientific') {
        calculatorCard.classList.add('scientific-mode');
      }
    } else {
      calculatorCard.classList.remove('scientific-mode');
    }
  });

  // Keyboard support for calculator

  document.addEventListener('keydown', (e) => {
    // Don't interfere with modal inputs

    if(modal.classList.contains('active')){
      return;
    } 
    
    const key = e.key;
    
    if(key >= '0' && key <= '9') {
      const numButton = document.querySelector(`[data-num="${key}"]`);
      if(numButton){
        numButton.click();
      } 
    }
    else if(key === '+') {
      const addButton = document.querySelector('[data-action="add"]');
      if(addButton){
        addButton.click();
      } 
    }
    else if(key === '-') {
      const subButton = document.querySelector('[data-action="subtract"]');
      if(subButton){
        subButton.click();
      } 
    }
    else if(key === '*') {
      const mulButton = document.querySelector('[data-action="multiply"]');
      if(mulButton){
        mulButton.click();
      } 
    }
    else if(key === '/') {
      e.preventDefault();
      const divButton = document.querySelector('[data-action="divide"]');
      if(divButton){
        divButton.click();
      } 
    }
    else if(key === 'Enter' || key === '=') {
      const equalsButton = document.querySelector('[data-action="equals"]');
      if(equalsButton){
        equalsButton.click();
      } 
    }
    else if(key === '.') {
      const dotButton = document.querySelector('[data-action="dot"]');
      if(dotButton){
        dotButton.click();
      } 
    }
    else if(key === 'Backspace') {
      const backButton = document.querySelector('[data-action="back"]');
      if(backButton){
        backButton.click();
      } 
    }
    else if(key.toLowerCase() === 'c') {
      const clearButton = document.querySelector('[data-action="clear"]');
      if(clearButton){
        clearButton.click();
      } 
    }
    else if(key === '%') {
      const percentButton = document.querySelector('[data-action="percent"]');
      if(percentButton){
        percentButton.click();
      } 
    }
  });

  // Initial setup

  resetCalculator();
  updateMemoryDisplay();
  renderHistory();
  
  // Set initial scientific mode state for mobile

  if(window.innerWidth <= 700 && currentMode === 'scientific') {
    calculatorCard.classList.add('scientific-mode');
  }
});