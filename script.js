const STORAGE_KEY = 'restaurantQueueState';

const state = loadState();

const firstNumberEl = document.getElementById('firstNumber');
const lastNumberEl = document.getElementById('lastNumber');
const currentNumberEl = document.getElementById('currentNumber');
const queueListEl = document.getElementById('queueList');
const queueCountEl = document.getElementById('queueCount');
const takeNumberBtn = document.getElementById('takeNumberBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');

function loadState() {
  const defaultState = {
    nextNumber: 1,
    queue: [],
    currentServing: null,
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;

    const parsed = JSON.parse(saved);
    return {
      nextNumber: Number(parsed.nextNumber) || 1,
      queue: Array.isArray(parsed.queue) ? parsed.queue.map(Number) : [],
      currentServing: Number(parsed.currentServing) || null,
    };
  } catch (error) {
    console.warn('讀取排隊狀態失敗，使用預設值。', error);
    return defaultState;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getFirstNumber() {
  return state.queue.length ? state.queue[0] : '—';
}

function getLastNumber() {
  return state.queue.length ? state.queue[state.queue.length - 1] : '—';
}

function render() {
  firstNumberEl.textContent = getFirstNumber();
  lastNumberEl.textContent = getLastNumber();
  currentNumberEl.textContent = state.currentServing ?? '—';
  queueCountEl.textContent = `${state.queue.length} 人`;

  if (!state.queue.length) {
    queueListEl.innerHTML = '<div class="empty-state">目前沒有排隊顧客</div>';
    return;
  }

  queueListEl.innerHTML = state.queue
    .map((number) => `<span class="queue-badge">${number}</span>`)
    .join('');
}

function takeNumber() {
  const number = state.nextNumber;
  state.queue.push(number);
  state.nextNumber += 1;
  saveState();
  render();
}

function callNext() {
  if (!state.queue.length) {
    alert('目前沒有排隊人員，請先取號。');
    return;
  }

  state.currentServing = state.queue.shift();
  saveState();
  render();
}

function resetQueue() {
  const confirmed = window.confirm('確定要重置所有排隊號碼嗎？');
  if (!confirmed) return;

  state.nextNumber = 1;
  state.queue = [];
  state.currentServing = null;
  saveState();
  render();
}

takeNumberBtn.addEventListener('click', takeNumber);
nextBtn.addEventListener('click', callNext);
resetBtn.addEventListener('click', resetQueue);

render();
