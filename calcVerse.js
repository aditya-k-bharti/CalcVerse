/*========================================
  CalcVerse - Complete JavaScript
  Matches all elements in index.html
========================================*/

document.addEventListener('DOMContentLoaded', () => {
  const htmlEl              = document.documentElement;
  const themeToggle         = document.getElementById('themeToggle');
  const themeIcon           = document.getElementById('themeIcon');
  const modeTabs            = document.getElementById('modeTabs');
  const exprDisplay         = document.getElementById('exprDisplay');
  const display             = document.getElementById('display');
  const errorDisplay        = document.getElementById('errorDisplay');
  const keys                = document.getElementById('keys');
  const memoryValueEl       = document.getElementById('memoryValue');
  const mcButton            = document.getElementById('mc');
  const mrButton            = document.getElementById('mr');
  const mplusButton         = document.getElementById('mplus');
  const mminusButton        = document.getElementById('mminus');
  const historyList         = document.getElementById('historyList');
  const clearHistoryBtn     = document.getElementById('clearHistory');
  const printHistoryBtn     = document.getElementById('printHistory');
  const modeLabel           = document.getElementById('modeLabel');
  const openPanelsMobileBtn = document.getElementById('openPanelMobile');
  const closeDrawerBtn      = document.getElementById('closeDrawerBtn');
  const sidePanels          = document.getElementById('sidePanels');
  const copyBtn             = document.getElementById('copyBtn');
  const pasteBtn            = document.getElementById('pasteBtn');
  const pvfmptBtn           = document.getElementById('pvfmpt');
  const marginQuickBtn      = document.getElementById('marginQuick');
  const calculatorCard      = document.getElementById('calculatorCard');

  // Modal
  const modal = document.getElementById('modal');
  const modalCancel = document.getElementById('modalCancel');
  const modalTitle = document.getElementById('modalTitle');
  const modalFields = document.getElementById('modalFields');
  const modalForm = document.getElementById('modalForm');

  // Sections
  const calcBasicScientific = document.getElementById('calcBasicScientific');
  const calcFinancial = document.getElementById('calcFinancial');
  const calcBusiness = document.getElementById('calcBusiness');
  const calcPrinting = document.getElementById('calcPrinting');
  const calcProgrammable = document.getElementById('calcProgrammable');
  const calcGraph = document.getElementById('calcGraph');
  const calcConverter = document.getElementById('calcConverter');

  const allSections = [calcBasicScientific, calcFinancial, calcBusiness, calcPrinting, calcProgrammable, calcGraph, calcConverter];

  // ===== STATE =====
  let currentTheme = 'dark';
  let currentMode = 'basic';
  let memoryValue = 0;
  let currentExpression = '';
  let justCalculated = false;
  let history = [];

  // ===== HELPERS =====
  function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function updateDisplay(value) {
    display.textContent = value;
  }

  function updateExpression(expr) {
    exprDisplay.textContent = expr;
  }

  function showError(msg) {
    if (errorDisplay) {
      errorDisplay.textContent = msg;
      setTimeout(() => { errorDisplay.textContent = ''; }, 3000);
    }
  }

  function clearError(){
    if(errorDisplay) errorDisplay.textContent = '';
  }

  // ===== THEME TOGGLE =====
  themeToggle.addEventListener('click', () => {
    if(currentTheme === 'dark') {
      htmlEl.setAttribute('data-theme', 'light');
      currentTheme = 'light';
      themeToggle.setAttribute('aria-pressed', 'true');
      if(themeIcon) themeIcon.className = 'bi bi-sun-fill';
    } else {
      htmlEl.removeAttribute('data-theme');
      currentTheme = 'dark';
      themeToggle.setAttribute('aria-pressed', 'false');
      if(themeIcon) themeIcon.className = 'bi bi-moon-stars-fill';
    }
  });

  // ===== MODE TABS =====
  function showSection(mode){
    allSections.forEach(s => {
      if(s) s.classList.add('hidden');
    });
    switch(mode){
      case 'basic':
      case 'scientific':
        if(calcBasicScientific) calcBasicScientific.classList.remove('hidden');
        break;
      case 'financial':
        if(calcFinancial) calcFinancial.classList.remove('hidden');
        break;
      case 'business':
        if(calcBusiness) calcBusiness.classList.remove('hidden');
        break;
      case 'printing':
        if(calcPrinting) calcPrinting.classList.remove('hidden');
        break;
      case 'programmable':
        if(calcProgrammable) calcProgrammable.classList.remove('hidden');
        break;
      case 'graph':
        if(calcGraph) calcGraph.classList.remove('hidden');
        break;
      case 'converter':
        if(calcConverter) calcConverter.classList.remove('hidden');
        break;
      default:
        if(calcBasicScientific) calcBasicScientific.classList.remove('hidden');
    }
  }

  modeTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if(!tab) return; 
      modeTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentMode = tab.getAttribute('data-mode');
      modeLabel.innerHTML = '<i class="bi bi-info-circle"></i> Mode:' + capitalize(currentMode);

      showSection(currentMode);

      // Handle scientific mode for mobile
      if(currentMode === 'scientific') {
        calculatorCard.classList.add('scientific-mode');
      } else {
        calculatorCard.classList.remove('scientific-mode');
      }

      resetCalculator();
  });

  // ===== CALCULATOR CORE =====
  function resetCalculator() {
    currentExpression = '';
    updateExpression('');
    updateDisplay('0');
    justCalculated = false;
    clearError();
  }

  function factorial(n){
    if(n < 0) return NaN;
    if(n === 0 || n === 1) return 1;
    if(n > 170) return Infinity;
    let result = 1;
    for(let i = 2; i <= n; i++) result *= i;
    return result;
  }

  function calculateExpression(expr) {
    try {
      if(!expr || expr.trim() === '') return 'Error';
      const safeExpr = expr.replace(/[^-()\d/*+.]/g, '');
      if(!safeExpr) return 'Error';
      const result = Function('"use strict"; return('+ safeExpr + ')')();
      if(result === undefined || result === null)
      return 'Error';
      if(!Number.isFinite(result)){
        if(result === Infinity) return '∞';
        if(result === -Infinity) return '-∞';
        return "Error";
      }
      return Math.round(result * 1e12) / 1e12;
    } catch(e) {
      return 'Error';
    }
  }

  // ===== KEY HANDLER (Basic/Scientific) =====
  keys.addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if(!key) return;
    const num = key.getAttribute('data-num');
    const action = key.getAttribute('data-action');

    clearError();

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

      case 'dot':{
        if(justCalculated) {
          currentExpression = '0.';
          justCalculated = false;
        } else {
          const parts = currentExpression.split(/[+\-*/]/);
          const lastPart = parts[parts.length - 1];
          if (!lastPart.includes('.')) {
            if (currentExpression === '' || /[+\-*/]$/.test(currentExpression)) {
              currentExpression += '0.';
            } else {
              currentExpression += '.';
            }
          }
        }
        updateExpression(currentExpression);
        updateDisplay(currentExpression);
        break;
      }  

      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide': {
        if(justCalculated) justCalculated = false;
        const opMap = { 
          add: '+', 
          subtract: '-', 
          multiply: '*', 
          divide: '/' 
        };
        if (currentExpression.length === 0 && action === 'subtract') {
          currentExpression = '-';
        } else if (currentExpression.length > 0) {
          if (/[-+*/.]$/.test(currentExpression)) {
            currentExpression = currentExpression.slice(0, -1) + opMap[action];
          } else {
            currentExpression += opMap[action];
          }
        }
        updateExpression(currentExpression);
        const displayOp = { 
          add: '+', 
          subtract: '−', 
          multiply: '×', 
          divide: '÷' 
        };
        updateDisplay(displayOp[action]);
        break;
      }

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
            showError('Invalid expression');
            updateDisplay('Error');
            currentExpression = '';
          }
        }
        break;

      case 'percent':
        if(currentExpression.length > 0) {
          const val = calculateExpression(currentExpression);
          if(val !== 'Error') {
            const pVal = val / 100;
            currentExpression = pVal.toString();
            updateExpression(currentExpression);
            updateDisplay(currentExpression);
          } else{
            showError('Cannot calculate percentage');
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

      case 'sqrt': {
        const val = calculateExpression(currentExpression);
        if(val >= 0 && val !== 'Error') {
          const sqrtVal = Math.round(Math.sqrt(val) * 1e12) / 1e12;
          updateExpression('√(' + val + ')');
          updateDisplay(sqrtVal);
          addHistory('√(' + val + ') = ' + sqrtVal);
          currentExpression = sqrtVal.toString();
          justCalculated = true;
        } else{
          showError('Cannot take square root of negative number');
        }
        break;
      }

      case 'pow': {
          const val = calculateExpression(currentExpression);
          if(val !== 'Error') {
            const squared = val * val;
            updateExpression(val + '²');
            updateDisplay(squared);
            addHistory(val + '² = ' + squared);
            currentExpression = squared.toString();
            justCalculated = true;
          }
        break;
      }

      case 'inv': {
          const val = calculateExpression(currentExpression);
          if(val !== 0 && val !== 'Error') {
            const invVal = Math.round((1 / val) * 1e12) / 1e12;
            updateExpression('1/' + val);
            updateDisplay(invVal);
            addHistory('1/' + val + ' = ' + invVal);
            currentExpression = invVal.toString();
            justCalculated = true;
          } else{
            showError('Cannot divide by zero');
          }
        break;
      }

      case 'sin':{
        const val = calculateExpression(currentExpression);
        if(val !== 'Error') {
          const sinVal = Math.round(Math.sin(val * Math.PI / 180) * 1e12) / 1e12;
          updateExpression('sin(' + val + '°)');
          updateDisplay(sinVal);
          addHistory('sin(' + val + '°) = ' + sinVal);
          currentExpression = sinVal.toString();
          justCalculated = true;
        }
        break;
      }

      case 'cos':{
        const val = calculateExpression(currentExpression);
        if(val !== 'Error') {
          const cosVal = Math.round(Math.cos(val * Math.PI / 180) * 1e12) / 1e12; 
          updateExpression('cos(' + val + '°)');
          updateDisplay(cosVal);
          addHistory('cos(' + val + '°) = ' + cosVal);
          currentExpression = cosVal.toString();
          justCalculated = true;
        }
        break;
      }

      case 'tan':{
        const val = calculateExpression(currentExpression);
        if(val !== 'Error') {
          if(val % 180 === 90){
            showError('tan(90°) is undefined');
            break;
          }
          const tanVal = Math.round(Math.tan(val * Math.PI / 180) * 1e12) / 1e12; 
          updateExpression('tan(' + val + '°)');
          updateDisplay(tanVal);
          addHistory('tan(' + val + '°) = ' + tanVal);
          currentExpression = tanVal.toString();
          justCalculated = true;
        }
        break;
      }

      case 'log': {
        const val = calculateExpression(currentExpression);
        if (val !== 'Error' && val > 0) {
          const logVal = Math.round(Math.log10(val) * 1e12) / 1e12;
          updateExpression('log(' + val + ')');
          updateDisplay(logVal);
          addHistory('log(' + val + ') = ' + logVal);
          currentExpression = logVal.toString();
          justCalculated = true;
        } else {
          showError('log requires a positive number');
        }
        break;
      }

      case 'ln': {
        const val = calculateExpression(currentExpression);
        if (val !== 'Error' && val > 0) {
          const lnVal = Math.round(Math.log(val) * 1e12) / 1e12;
          updateExpression('ln(' + val + ')');
          updateDisplay(lnVal);
          addHistory('ln(' + val + ') = ' + lnVal);
          currentExpression = lnVal.toString();
          justCalculated = true;
        } else {
          showError('ln requires a positive number');
        }
        break;
      }

      case 'factorial':{
        const val = calculateExpression(currentExpression);
        if(val >= 0 && Number.isInteger(val) && val >= 0){
          const factVal = factorial(val);
          updateExpression(val + '!');
          updateDisplay(factVal === Infinity ? '∞' : factVal);
          addHistory(val + '! = ' + (factVal === Infinity ? '∞' : factVal));
          currentExpression = factVal.toString();
          justCalculated = true;
        } else {
          showError('Factorial requires a non-negative integer');
        }
        break;
      }

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
          currentExpression += ')';
          updateExpression(currentExpression);
          updateDisplay(currentExpression);
        break;

      case 'margin':
        openModal('margin');
        break;

      case 'markup':
        openModal('markup');
        break;
      }
  });

  // ===== MEMORY =====
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

  // ===== HISTORY =====
  function addHistory(entry) {
    history.unshift(entry); 
    if(history.length > 20){
      history.pop();
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

  // ===== COPY / PASTE =====
  copyBtn.addEventListener('click', () => {
    const val = display.textContent;
    navigator.clipboard.writeText(val).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1200);
    }).catch(() => {
      showError('Copy Failed');
    });
  });

  pasteBtn.addEventListener('click', () => {
    navigator.clipboard.readText().then(text => {
      const cleaned = text.replace(/[^0-9.\-+*/()]/g, '');
      if (cleaned) {
        if (justCalculated) { currentExpression = ''; justCalculated = false; }
        currentExpression += cleaned;
        updateExpression(currentExpression);
        updateDisplay(currentExpression);
      }
    }).catch(() => {
      showError('Paste failed - check clipboard permissions');
    });
  });

  // ===== PRINT HISTORY =====
  printHistoryBtn.addEventListener('click', () => {
    if (history.length === 0) { 
      showError('No history to print'); 
      return; 
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(
      '<html><head><title>CalcVerse History</title>' +
      '<style>body{font-family:Inter,Arial,sans-serif;padding:20px;} h1{color:#6c5ce7;} .item{padding:8px;border-bottom:1px solid #eee;font-family:monospace;}</style>' +
      '</head><body><h1>CalcVerse - History</h1>' +
      history.map(item => '<div class="item">' + item + '</div>').join('') +
      '<p style="color:#999;margin-top:20px;">Printed on ' + new Date().toLocaleString() + '</p>' +
      '</body></html>'
    );
    printWindow.document.close();
    printWindow.print();
  });

  // ===== MODAL (Margin/Markup/PV/FV/PMT) =====
  function openModal(type) {
    modal.classList.add('active');
    modalTitle.textContent = `Compute: ${capitalize(type)}`;
    modalFields.innerHTML = '';

    if(type === 'margin' || type === 'markup') {
      modalFields.innerHTML = `
        <label>Cost Price: <input type="number" name="costPrice" step="any" required></label>
        <label>Selling Price: <input type="number" name="sellingPrice" step="any" required></label>
      `;
    } else if(type === 'pvfmpt') {
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
    } else if(modalTitle.textContent.toLowerCase().includes('markup')) {
      const costPrice = parseFloat(formData.get('costPrice'));
      const sellingPrice = parseFloat(formData.get('sellingPrice'));
      if(costPrice > 0 && sellingPrice > 0) {
        const markup = ((sellingPrice - costPrice) / costPrice) * 100;
        updateDisplay(markup.toFixed(2) + '%');
        updateExpression(`Markup (${costPrice}, ${sellingPrice})`);
        addHistory(`Markup: ${markup.toFixed(2)}%`);
      }
    } else if (modalTitle.textContent.toLowerCase().includes('pvfmpt')) {
      const pv = parseFloat(formData.get('pv')) || 0;
      const fv = parseFloat(formData.get('fv')) || 0;
      const pmt = parseFloat(formData.get('pmt')) || 0;
      const rate = parseFloat(formData.get('rate')) || 0;
      const n = parseFloat(formData.get('n')) || 0;

      if (rate > 0 && n > 0) {
        const r = rate / 100;
        if (pv === 0 && fv > 0) {
          const computedPV = fv / Math.pow(1 + r, n);
          updateDisplay('PV = ' + computedPV.toFixed(2));
          addHistory('PV = ' + computedPV.toFixed(2));
        } else if (fv === 0 && pv > 0) {
          const computedFV = pv * Math.pow(1 + r, n);
          updateDisplay('FV = ' + computedFV.toFixed(2));
          addHistory('FV = ' + computedFV.toFixed(2));
        } else {
          updateDisplay('Provide PV or FV (not both)');
        }
      }
    }

    closeModal();
  });

  // Quick buttons
  pvfmptBtn.addEventListener('click', () => { 
    openModal('pvfmpt'); 
  });

  marginQuickBtn.addEventListener('click', () => {
    openModal('margin'); 
  });

  // ===== MOBILE PANELS =====
  function openDrawer() { 
    sidePanels.classList.add('mobile-active'); 
  }
  function closeDrawer() { 
    sidePanels.classList.remove('mobile-active'); 
  }

  openPanelsMobileBtn.addEventListener('click', () => {
    if(sidePanels.classList.contains('mobile-active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  document.addEventListener('click', (e) => {
    if(window.innerWidth <= 991 && sidePanels.classList.contains('mobile-active')) {
      if (!sidePanels.contains(e.target) && !openPanelsMobileBtn.contains(e.target)) {
        closeDrawer();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      if(sidePanels.classList.contains('mobile-active')) closeDrawer();
      if(modal.classList.contains('active')) closeModal();
    }
  });

  // ===== RESIZE HANDLER =====
  window.addEventListener('resize', () => {
    if(currentMode === 'scientific') {
      calculatorCard.classList.add('scientific-mode');
    } else {
      calculatorCard.classList.remove('scientific-mode');
    }
  });

  // ===== KEYBOARD SUPPORT =====
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    if (modal.classList.contains('active')) return;
    if (currentMode !== 'basic' && currentMode !== 'scientific') return;
    
    const k = e.key;    
    if (k >= '0' && k <= '9') {
      document.querySelector('[data-num="' + k + '"]')?.click();
    } else if (k === '+') {
      document.querySelector('[data-action="add"]')?.click();
    } else if (k === '-') {
      document.querySelector('[data-action="subtract"]')?.click();
    } else if (k === '*') {
      document.querySelector('[data-action="multiply"]')?.click();
    } else if (k === '/') {
      e.preventDefault();
      document.querySelector('[data-action="divide"]')?.click();
    } else if (k === 'Enter' || k === '=') {
      document.querySelector('[data-action="equals"]')?.click();
    } else if (k === '.') {
      document.querySelector('[data-action="dot"]')?.click();
    } else if (k === 'Backspace') {
      document.querySelector('[data-action="back"]')?.click();
    } else if (k.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
      document.querySelector('[data-action="clear"]')?.click();
    } else if (k === '%') {
      document.querySelector('[data-action="percent"]')?.click();
    } else if (k === '(') {
      document.querySelector('[data-action="openParen"]')?.click();
    } else if (k === ')') {
      document.querySelector('[data-action="closeParen"]')?.click();
    }
  });

  // ========================================
  // FINANCIAL CALCULATOR
  // ========================================
  const finTabs = document.querySelectorAll('.fin-tab');
  const finEmi = document.getElementById('finEmi');
  const finCompound = document.getElementById('finCompound');
  const finDiscount = document.getElementById('finDiscount');
  const finPanels = { emi: finEmi, compound: finCompound, discount: finDiscount };

  finTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      finTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-fin');
      Object.values(finPanels).forEach(p => {
        if (p) p.classList.add('hidden');
      });
      if (finPanels[mode]) finPanels[mode].classList.remove('hidden');
    });
  });

  // EMI Calculator
  document.getElementById('emiCalcBtn')?.addEventListener('click', () => {
    const P = parseFloat(document.getElementById('emiPrincipal')?.value);
    const annualRate = parseFloat(document.getElementById('emiRate')?.value);
    const N = parseInt(document.getElementById('emiTenure')?.value);
    const area = document.getElementById('emiResultArea');

    if (!P || !annualRate || !N || P <= 0 || annualRate <= 0 || N <= 0) {
      area.innerHTML = '<div class="result-card"><div class="result-value" style="color:var(--error);">Please enter valid values</div></div>';
      return;
    }

    const r = annualRate / 12 / 100;
    const emi = P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    area.innerHTML =
      '<div class="result-card">' +
      '<div class="result-label">Monthly EMI</div>' +
      '<div class="result-value">₹' + emi.toFixed(2) + '</div>' +
      '<div class="result-sub">Total Payment: ₹' + totalPayment.toFixed(2) + ' | Interest: ₹' + totalInterest.toFixed(2) + '</div>' +
      '</div>';

    document.getElementById('financialResult').textContent = '₹' + emi.toFixed(2);
    addHistory('EMI: ₹' + emi.toFixed(2) + ' (P=' + P + ', R=' + annualRate + '%, N=' + N + 'm)');
  });

  // Compound Interest
  document.getElementById('ciCalcBtn')?.addEventListener('click', () => {
    const P = parseFloat(document.getElementById('ciPrincipal')?.value);
    const r = parseFloat(document.getElementById('ciRate')?.value);
    const t = parseFloat(document.getElementById('ciTime')?.value);
    const n = parseInt(document.getElementById('ciCompound')?.value);
    const area = document.getElementById('ciResultArea');

    if (!P || !r || !t || P <= 0 || r <= 0 || t <= 0) {
      area.innerHTML = '<div class="result-card"><div class="result-value" style="color:var(--error);">Please enter valid values</div></div>';
      return;
    }

    const amount = P * Math.pow(1 + (r / 100) / n, n * t);
    const interest = amount - P;

    area.innerHTML =
      '<div class="result-card">' +
      '<div class="result-label">Maturity Amount</div>' +
      '<div class="result-value">₹' + amount.toFixed(2) + '</div>' +
      '<div class="result-sub">Interest Earned: ₹' + interest.toFixed(2) + ' | Principal: ₹' + P.toFixed(2) + '</div>' +
      '</div>';

    document.getElementById('financialResult').textContent = '₹' + amount.toFixed(2);
    addHistory('CI: ₹' + amount.toFixed(2) + ' (P=' + P + ', R=' + r + '%, T=' + t + 'y)');
  });

  // Discount Calculator
  document.getElementById('discCalcBtn')?.addEventListener('click', () => {
    const original = parseFloat(document.getElementById('discOriginal')?.value);
    const discPct = parseFloat(document.getElementById('discPercent')?.value);
    const area = document.getElementById('discResultArea');

    if (!original || !discPct || original <= 0 || discPct < 0) {
      area.innerHTML = '<div class="result-card"><div class="result-value" style="color:var(--error);">Please enter valid values</div></div>';
      return;
    }

    const savings = original * discPct / 100;
    const finalPrice = original - savings;

    area.innerHTML =
      '<div class="result-card">' +
      '<div class="result-label">Final Price</div>' +
      '<div class="result-value">₹' + finalPrice.toFixed(2) + '</div>' +
      '<div class="result-sub">You Save: ₹' + savings.toFixed(2) + ' (' + discPct + '% off)</div>' +
      '</div>';

    document.getElementById('financialResult').textContent = '₹' + finalPrice.toFixed(2);
    addHistory('Discount: ₹' + finalPrice.toFixed(2) + ' (' + discPct + '% off ₹' + original + ')');
  });

  // ========================================
  // BUSINESS CALCULATOR (Margin & Markup)
  // ========================================
  const bizTabs = document.querySelectorAll('.biz-tab');
  const bizMargin = document.getElementById('bizMargin');
  const bizMarkup = document.getElementById('bizMarkup');
  const bizPanels = { margin: bizMargin, markup: bizMarkup };

  bizTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      bizTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-biz');
      Object.values(bizPanels).forEach(p => {
        if (p) p.classList.add('hidden');
      });
      if (bizPanels[mode]) bizPanels[mode].classList.remove('hidden');
    });
  });

  // Margin Calculator
  document.getElementById('marginCalcBtn')?.addEventListener('click', () => {
    const cost = parseFloat(document.getElementById('marginCost')?.value);
    const selling = parseFloat(document.getElementById('marginSelling')?.value);
    const area = document.getElementById('marginResultArea');
    const resultDisplay = document.getElementById('businessResult');

    if (!cost || !selling || cost <= 0 || selling <= 0) {
      area.innerHTML = '<div class="result-card"><div class="result-value" style="color:var(--error);">Please enter valid positive values</div></div>';
      return;
    }

    const margin = ((selling - cost) / selling) * 100;
    const profit = selling - cost;

    area.innerHTML =
      '<div class="result-card">' +
      '<div class="result-label">Profit Margin</div>' +
      '<div class="result-value">' + margin.toFixed(2) + '%</div>' +
      '<div class="result-sub">Profit: ₹' + profit.toFixed(2) + ' | Cost: ₹' + cost.toFixed(2) + ' | Selling: ₹' + selling.toFixed(2) + '</div>' +
      '</div>';

    resultDisplay.textContent = margin.toFixed(2) + '%';
    addHistory('Margin: ' + margin.toFixed(2) + '% (Cost=' + cost + ', Sell=' + selling + ')');
  });

  // Markup Calculator
  document.getElementById('markupCalcBtn')?.addEventListener('click', () => {
    const cost = parseFloat(document.getElementById('markupCost')?.value);
    const selling = parseFloat(document.getElementById('markupSelling')?.value);
    const area = document.getElementById('markupResultArea');
    const resultDisplay = document.getElementById('businessResult');

    if (!cost || !selling || cost <= 0 || selling <= 0) {
      area.innerHTML = '<div class="result-card"><div class="result-value" style="color:var(--error);">Please enter valid positive values</div></div>';
      return;
    }

    const markup = ((selling - cost) / cost) * 100;
    const profit = selling - cost;

    area.innerHTML =
      '<div class="result-card">' +
      '<div class="result-label">Markup Percentage</div>' +
      '<div class="result-value">' + markup.toFixed(2) + '%</div>' +
      '<div class="result-sub">Profit: ₹' + profit.toFixed(2) + ' | Cost: ₹' + cost.toFixed(2) + ' | Selling: ₹' + selling.toFixed(2) + '</div>' +
      '</div>';

    resultDisplay.textContent = markup.toFixed(2) + '%';
    addHistory('Markup: ' + markup.toFixed(2) + '% (Cost=' + cost + ', Sell=' + selling + ')');
  });

  // ========================================
  // PRINTING CALCULATOR
  // ========================================
  const printingDisplay = document.getElementById('printingDisplay');
  const printingKeys = document.getElementById('printingKeys');
  const tapeList = document.getElementById('tapeList');
  const clearTapeBtn = document.getElementById('clearTapeBtn');
  const printTapeBtn = document.getElementById('printTapeBtn');

  let printExpr = '';
  let printRunningTotal = 0;
  let printLastOp = '';
  let printCurrentNum = '';
  let tapeEntries = [];
  let printJustCalculated = false;

  function updatePrintingDisplay(val) {
    if (printingDisplay) printingDisplay.textContent = val;
  }

  function addTapeEntry(num, op, isTotal) {
    tapeEntries.push({ num: num, op: op, isTotal: isTotal || false });
    renderTape();
  }

  function renderTape() {
    if (!tapeList) return;
    if (tapeEntries.length === 0) {
      tapeList.innerHTML = '<div class="muted">Start calculating to see tape</div>';
      return;
    }
    tapeList.innerHTML = tapeEntries.map(entry => {
      const cls = entry.isTotal ? 'tape-entry tape-total' : 'tape-entry';
      return '<div class="' + cls + '">' +
        '<span class="tape-op">' + (entry.op || '') + '</span>' +
        '<span class="tape-num">' + entry.num + '</span>' +
        '</div>';
    }).join('');
    tapeList.scrollTop = tapeList.scrollHeight;
  }

  function processPrintOp() {
    const num = parseFloat(printCurrentNum) || 0;
    if (printLastOp === '') {
      printRunningTotal = num;
    } else if (printLastOp === '+') {
      printRunningTotal += num;
    } else if (printLastOp === '-') {
      printRunningTotal -= num;
    } else if (printLastOp === '*') {
      printRunningTotal *= num;
    } else if (printLastOp === '/') {
      if (num !== 0) {
        printRunningTotal /= num;
      } else {
        printRunningTotal = 0;
        showError('Cannot divide by zero');
      }
    }
    printRunningTotal = Math.round(printRunningTotal * 1e12) / 1e12;
  }

  if (printingKeys) {
    printingKeys.addEventListener('click', (e) => {
      const key = e.target.closest('.key');
      if (!key) return;
      const num = key.getAttribute('data-pnum');
      const action = key.getAttribute('data-paction');

      if (num !== null) {
        if (printJustCalculated) {
          printCurrentNum = '';
          printJustCalculated = false;
        }
        printCurrentNum += num;
        updatePrintingDisplay(printCurrentNum);
        return;
      }

      const opSymbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
      const opChars = { add: '+', subtract: '-', multiply: '*', divide: '/' };

      switch (action) {
        case 'clear':
          printExpr = '';
          printRunningTotal = 0;
          printLastOp = '';
          printCurrentNum = '';
          printJustCalculated = false;
          tapeEntries = [];
          renderTape();
          updatePrintingDisplay('0');
          break;

        case 'back':
          if (printJustCalculated) {
            printCurrentNum = '';
            printJustCalculated = false;
            updatePrintingDisplay('0');
          } else {
            printCurrentNum = printCurrentNum.slice(0, -1);
            updatePrintingDisplay(printCurrentNum || '0');
          }
          break;

        case 'dot':
          if (printJustCalculated) {
            printCurrentNum = '0.';
            printJustCalculated = false;
          } else if (!printCurrentNum.includes('.')) {
            if (printCurrentNum === '') printCurrentNum = '0';
            printCurrentNum += '.';
          }
          updatePrintingDisplay(printCurrentNum);
          break;

        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide': {
          if (printCurrentNum !== '') {
            const displayNum = printCurrentNum;
            const tapeOp = printLastOp === '' ? '' : (printLastOp === '+' ? '+' : printLastOp === '-' ? '−' : printLastOp === '*' ? '×' : '÷');
            addTapeEntry(displayNum, tapeOp, false);
            processPrintOp();
          }
          printLastOp = opChars[action];
          printCurrentNum = '';
          printJustCalculated = false;
          updatePrintingDisplay(opSymbols[action]);
          break;
        }

        case 'percent':
          if (printCurrentNum !== '') {
            const pctVal = parseFloat(printCurrentNum) / 100;
            printCurrentNum = pctVal.toString();
            updatePrintingDisplay(printCurrentNum);
            addTapeEntry(printCurrentNum, '%', false);
          }
          break;

        case 'equals': {
          if (printCurrentNum !== '') {
            const tapeOp = printLastOp === '' ? '' : (printLastOp === '+' ? '+' : printLastOp === '-' ? '−' : printLastOp === '*' ? '×' : '÷');
            addTapeEntry(printCurrentNum, tapeOp, false);
            processPrintOp();
          }

          addTapeEntry(printRunningTotal.toString(), '=', true);
          updatePrintingDisplay(printRunningTotal);
          addHistory('Print: ' + printRunningTotal);

          printCurrentNum = printRunningTotal.toString();
          printLastOp = '';
          printJustCalculated = true;
          break;
        }
      }
    });
  }

  // Clear Tape
  if (clearTapeBtn) {
    clearTapeBtn.addEventListener('click', () => {
      tapeEntries = [];
      renderTape();
      printExpr = '';
      printRunningTotal = 0;
      printLastOp = '';
      printCurrentNum = '';
      printJustCalculated = false;
      updatePrintingDisplay('0');
    });
  }

  // Print Tape
  if (printTapeBtn) {
    printTapeBtn.addEventListener('click', () => {
      if (tapeEntries.length === 0) {
        showError('No tape entries to print');
        return;
      }
      const printWindow = window.open('', '_blank');
      const tapeHTML = tapeEntries.map(entry => {
        const style = entry.isTotal ? 'font-weight:800; border-top:2px solid #6c5ce7; padding-top:8px; font-size:18px;' : '';
        return '<div style="display:flex; justify-content:space-between; padding:4px 0; ' + style + '">' +
          '<span style="color:#6c5ce7; font-weight:700; min-width:30px;">' + (entry.op || '') + '</span>' +
          '<span style="text-align:right; flex:1;">' + entry.num + '</span>' +
          '</div>';
      }).join('');

      printWindow.document.write(
        '<html><head><title>CalcVerse - Printing Tape</title>' +
        '<style>body{font-family:Inter,Arial,sans-serif;padding:20px;max-width:400px;margin:0 auto;} h1{color:#6c5ce7;font-size:20px;}</style>' +
        '</head><body>' +
        '<h1><i>🧮</i> CalcVerse - Printing Tape</h1>' +
        '<div style="border:1px solid #eee;padding:16px;border-radius:8px;font-family:monospace;">' +
        tapeHTML +
        '</div>' +
        '<p style="color:#999;margin-top:20px;font-size:12px;">Printed on ' + new Date().toLocaleString() + '</p>' +
        '</body></html>'
      );
      printWindow.document.close();
      printWindow.print();
    });
  }

  // ========================================
  // PROGRAMMER CALCULATOR
  // ========================================
  document.getElementById('progConvertBtn')?.addEventListener('click', () => {
    const fromBase = parseInt(document.getElementById('progFromBase')?.value);
    const inputVal = document.getElementById('progInput')?.value.trim();
    const progResult = document.getElementById('progResult');

    if (!inputVal) {
      progResult.textContent = 'Please enter a value';
      progResult.style.color = 'var(--error)';
      setTimeout(() => { progResult.style.color = ''; }, 3000);
      return;
    }

    try {
      const decimalValue = parseInt(inputVal, fromBase);
      if (isNaN(decimalValue)) {
        progResult.textContent = 'Invalid number for selected base';
        progResult.style.color = 'var(--error)';
        setTimeout(() => { progResult.style.color = ''; }, 3000);
        return;
      }

      document.getElementById('progDec').textContent = decimalValue.toString(10);
      document.getElementById('progBin').textContent = decimalValue >= 0 ? decimalValue.toString(2) : (decimalValue >>> 0).toString(2);
      document.getElementById('progOct').textContent = decimalValue >= 0 ? decimalValue.toString(8) : (decimalValue >>> 0).toString(8);
      document.getElementById('progHex').textContent = (decimalValue >= 0 ? decimalValue.toString(16) : (decimalValue >>> 0).toString(16)).toUpperCase();
      progResult.textContent = 'DEC: ' + decimalValue;
      progResult.style.color = '';

      addHistory('Convert: ' + inputVal + '(base' + fromBase + ') = DEC:' + decimalValue + ' BIN:' + decimalValue.toString(2) + ' HEX:' + decimalValue.toString(16).toUpperCase());
    } catch (e) {
      progResult.textContent = 'Conversion error';
      progResult.style.color = 'var(--error)';
      setTimeout(() => { progResult.style.color = ''; }, 3000);
    }
  });

  // ========================================
  // GRAPH CALCULATOR
  // ========================================
  document.getElementById('graphPlotBtn')?.addEventListener('click', () => {
    const funcStr = document.getElementById('graphFunc')?.value.trim();
    const range = parseInt(document.getElementById('graphRange')?.value) || 10;

    if (!funcStr) {
      showError('Please enter a function');
      return;
    }

    const canvas = document.getElementById('graphCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Clear
    ctx.fillStyle = currentTheme === 'dark' ? '#111114' : '#f8f9fa';
    ctx.fillRect(0, 0, W, H);

    const centerX = W / 2;
    const centerY = H / 2;
    const scaleX = W / (2 * range);
    const scaleY = H / (2 * range);

    // Grid
    ctx.strokeStyle = currentTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    for (let i = -range; i <= range; i++) {
      const px = centerX + i * scaleX;
      const py = centerY - i * scaleY;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = currentTheme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(W, centerY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, H); ctx.stroke();

    // Axis labels
    ctx.fillStyle = currentTheme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(range / 5));
    for (let i = -range; i <= range; i += step) {
      if (i === 0) continue;
      const px = centerX + i * scaleX;
      ctx.fillText(i.toString(), px, centerY + 14);
      const py = centerY - i * scaleY;
      ctx.fillText(i.toString(), centerX - 14, py + 4);
    }

    // Plot function
    try {
      ctx.strokeStyle = '#6c5ce7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let started = false;

      for (let px = 0; px < W; px++) {
        const x = (px - centerX) / scaleX;
        let y;
        try {
          y = Function('x', '"use strict"; return (' + funcStr + ')')(x);
        } catch (err) {
          continue;
        }

        if (!Number.isFinite(y)) {
          started = false;
          continue;
        }

        const py = centerY - y * scaleY;
        if (py < -100 || py > H + 100) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      addHistory('Graph: f(x) = ' + funcStr);
    } catch (e) {
      showError('Invalid function expression');
    }
  });

  // ========================================
  // UNIT CONVERTER
  // ========================================
  const convUnits = {
    length: {
      units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
      toBase: [1, 1000, 0.01, 0.001, 1609.344, 0.9144, 0.3048, 0.0254]
    },
    weight: {
      units: ['Kilogram', 'Gram', 'Milligram', 'Pound', 'Ounce', 'Ton'],
      toBase: [1, 0.001, 0.000001, 0.453592, 0.0283495, 1000]
    },
    temperature: {
      units: ['Celsius', 'Fahrenheit', 'Kelvin'],
      special: true
    },
    speed: {
      units: ['m/s', 'km/h', 'mph', 'knot'],
      toBase: [1, 0.277778, 0.44704, 0.514444]
    }
  };

  let currentConvCategory = 'length';

  const convTabs = document.querySelectorAll('.convo-tab');
  const convFrom = document.getElementById('convFrom');
  const convTo = document.getElementById('convTo');

  function populateConvUnits(category) {
    currentConvCategory = category;
    const data = convUnits[category];
    if (!data || !convFrom || !convTo) return;

    convFrom.innerHTML = '';
    convTo.innerHTML = '';
    data.units.forEach((unit, i) => {
      convFrom.innerHTML += '<option value="' + i + '">' + unit + '</option>';
      convTo.innerHTML += '<option value="' + i + '">' + unit + '</option>';
    });
    if (data.units.length > 1) convTo.value = '1';
  }

  convTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      convTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      populateConvUnits(tab.getAttribute('data-conv'));
    });
  });

  populateConvUnits('length');

  document.getElementById('convCalcBtn')?.addEventListener('click', () => {
    const value = parseFloat(document.getElementById('convValue')?.value);
    const fromIdx = parseInt(convFrom?.value);
    const toIdx = parseInt(convTo?.value);
    const area = document.getElementById('convoResultArea');
    const resultDisplay = document.getElementById('converterResult');
    const data = convUnits[currentConvCategory];

    if (isNaN(value)) {
      area.innerHTML = '<div class="result-card"><div class="result-value" style="color:var(--error);">Please enter a valid number</div></div>';
      return;
    }

    let result;

    if (data.special && currentConvCategory === 'temperature') {
      const fromUnit = data.units[fromIdx];
      const toUnit = data.units[toIdx];

      let celsius;
      if (fromUnit === 'Celsius') celsius = value;
      else if (fromUnit === 'Fahrenheit') celsius = (value - 32) * 5 / 9;
      else celsius = value - 273.15;

      if (toUnit === 'Celsius') result = celsius;
      else if (toUnit === 'Fahrenheit') result = celsius * 9 / 5 + 32;
      else result = celsius + 273.15;
    } else {
      const baseValue = value * data.toBase[fromIdx];
      result = baseValue / data.toBase[toIdx];
    }

    result = Math.round(result * 1e10) / 1e10;

    const fromName = data.units[fromIdx];
    const toName = data.units[toIdx];

    area.innerHTML =
      '<div class="result-card">' +
      '<div class="result-label">' + fromName + ' → ' + toName + '</div>' +
      '<div class="result-value">' + result + '</div>' +
      '<div class="result-sub">' + value + ' ' + fromName + ' = ' + result + ' ' + toName + '</div>' +
      '</div>';

    resultDisplay.textContent = result;
    addHistory('Convert: ' + value + ' ' + fromName + ' = ' + result + ' ' + toName);
  });

  // ===== INIT =====
  resetCalculator();
  updateMemoryDisplay();
  renderHistory();
  showSection('basic');

  if (currentMode === 'scientific') {
    calculatorCard.classList.add('scientific-mode');
  }
});