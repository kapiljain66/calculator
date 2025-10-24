
const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let current = '0';
let previous = null;
let operator = null;
let awaiting = false;

function updateDisplay() {
  display.textContent = String(current).slice(0,18) || '0';
  display.style.animation = 'flash 0.2s';
  setTimeout(()=> display.style.animation = '', 200);
}

function inputNumber(num){
  if(awaiting){
    current = num === '.' ? '0.' : num;
    awaiting = false;
  } else {
    if(num === '.' && current.includes('.')) return;
    current = current === '0' && num !== '.' ? num : current + num;
  }
  updateDisplay();
}

function handleOperator(nextOp){
  const value = parseFloat(current);
  if(operator && awaiting){
    operator = nextOp;
    return;
  }
  if(previous == null){
    previous = value;
  } else if(operator){
    const result = calculate(previous, value, operator);
    previous = result;
    current = String(result);
  }
  operator = nextOp;
  awaiting = true;
  updateDisplay();
}

function calculate(a,b,op){
  switch(op){
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 'Error' : a / b;
    default: return b;
  }
}

function clearAll(){
  current = '0'; previous = null; operator = null; awaiting = false; updateDisplay();
}

function backspace(){
  if(awaiting) return;
  current = current.length === 1 ? '0' : current.slice(0,-1);
  updateDisplay();
}

function percent(){
  const val = parseFloat(current);
  current = String(val / 100);
  updateDisplay();
}

function equals(){
  if(operator == null || previous == null) return;
  const result = calculate(previous, parseFloat(current), operator);
  current = String(result);
  previous = null; operator = null; awaiting = false;
  updateDisplay();
}

keys.addEventListener('click', e => {
  const t = e.target;
  if(t.matches('button')){
    t.classList.add('pressed');
    setTimeout(()=>t.classList.remove('pressed'),150);

    if(t.hasAttribute('data-number')){ inputNumber(t.textContent); return; }
    const action = t.getAttribute('data-action');
    if(action === 'clear'){ clearAll(); return; }
    if(action === 'back'){ backspace(); return; }
    if(action === 'percent'){ percent(); return; }
    if(action === 'equals'){ equals(); return; }
    if(action === 'operator'){ handleOperator(t.textContent); return; }
  }
});

window.addEventListener('keydown', e => {
  if((/\d/).test(e.key)) inputNumber(e.key);
  if(e.key === '.') inputNumber('.');
  if(['+','-','*','/'].includes(e.key)) handleOperator(e.key);
  if(e.key === 'Enter' || e.key === '=') equals();
  if(e.key === 'Backspace') backspace();
  if(e.key === 'Escape') clearAll();
});

updateDisplay();

// Button press animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes flash {from{opacity:0.6;} to{opacity:1;}}
.pressed{transform:scale(0.9)!important; background:var(--accent)!important; color:#000!important;}
`;
document.head.appendChild(style);