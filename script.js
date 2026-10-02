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
const customerNameInput = document.getElementById('customerName');
const customerPhoneInput = document.getElementById('customerPhone');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeQueueItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const number = Number(item.number);
  if (!Number.isFinite(number)) {
    return null;
  }

  return {
    number,
    name: item.name ? String(item.name).trim() : '顧客',
    phone: item.phone ? String(item.phone).trim() : '未填寫',
  };
}

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
    const queue = Array.isArray(parsed.queue)
      ? parsed.queue
          .map(normalizeQueueItem)
          .filter(Boolean)
      : [];

    return {
      nextNumber: Number(parsed.nextNumber) || Math.max(queue.length + 1, 1),
      queue,
      currentServing: normalizeQueueItem(parsed.currentServing),
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
  return state.queue.length ? state.queue[0].number : '—';
}

function getLastNumber() {
  return state.queue.length ? state.queue[state.queue.length - 1].number : '—';
}

function getCurrentDisplayNumber() {
  return state.currentServing ? state.currentServing.number : '—';
}

function render() {
  firstNumberEl.textContent = getFirstNumber();
  lastNumberEl.textContent = getLastNumber();
  currentNumberEl.textContent = getCurrentDisplayNumber();
  queueCountEl.textContent = `${state.queue.length} 人`;

  if (!state.queue.length) {
    queueListEl.innerHTML = '<div class="empty-state">目前沒有排隊顧客</div>';
    return;
  }

  queueListEl.innerHTML = state.queue
    .map(
      (customer) => `
        <div class="queue-ticket">
          <div class="queue-badge">${customer.number}</div>
          <div class="queue-meta">
            <span>${escapeHtml(customer.name)}</span>
            <small>${escapeHtml(customer.phone)}</small>
          </div>
        </div>
      `
    )
    .join('');
}

function takeNumber() {
  const name = customerNameInput.value.trim();
  const phone = customerPhoneInput.value.trim();

  if (!name || !phone) {
    alert('請先輸入稱呼與電話。');
    return;
  }

  const number = state.nextNumber;
  state.queue.push({ number, name, phone });
  state.nextNumber += 1;
  customerNameInput.value = '';
  customerPhoneInput.value = '';
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
