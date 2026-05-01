// ===== TOTP Configuration =====
// Generate your own: crypto.getRandomValues(new Uint8Array(20)) then base32 encode
// Add this secret to Google Authenticator
const TOTP_SECRET = 'F5WOSGGAPDJCGVHE';

// ===== GitHub Config =====
const GITHUB_OWNER = 'rutvikjoshi63';
const GITHUB_REPO = 'fitness-data';
const GITHUB_API = 'https://api.github.com';

// ===== Targets =====
const TARGETS = { calories: 2200, protein: 150, carbs: 280, fat: 70 };

// ===== State =====
let state = {
  currentTab: 'food',
  currentDate: todayStr(),
  foodLog: [],
  workoutLog: [],
  weightLog: {},
  prs: {},
  currentSets: [],
  isOnline: navigator.onLine
};

// ===== TOTP Implementation (Web Crypto) =====

function base32Decode(encoded) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const c of encoded.toUpperCase().replace(/=+$/, '')) {
    const val = chars.indexOf(c);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

async function generateTOTP(secret, timeStep = 30) {
  const key = base32Decode(secret);
  const time = Math.floor(Date.now() / 1000 / timeStep);
  const timeBytes = new Uint8Array(8);
  let t = time;
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = t & 0xff;
    t = Math.floor(t / 256);
  }
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, timeBytes);
  const hmac = new Uint8Array(sig);
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24 | hmac[offset+1] << 16 | hmac[offset+2] << 8 | hmac[offset+3]) % 1000000;
  return code.toString().padStart(6, '0');
}

async function validateTOTP(input) {
  // Check current, previous, and next time steps (±30s tolerance)
  for (const offset of [0, -1, 1]) {
    const time = Math.floor(Date.now() / 1000 / 30) + offset;
    const timeBytes = new Uint8Array(8);
    let t = time;
    for (let i = 7; i >= 0; i--) {
      timeBytes[i] = t & 0xff;
      t = Math.floor(t / 256);
    }
    const key = base32Decode(TOTP_SECRET);
    const cryptoKey = await crypto.subtle.importKey(
      'raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', cryptoKey, timeBytes);
    const hmac = new Uint8Array(sig);
    const off = hmac[hmac.length - 1] & 0x0f;
    const code = ((hmac[off] & 0x7f) << 24 | hmac[off+1] << 16 | hmac[off+2] << 8 | hmac[off+3]) % 1000000;
    if (input === code.toString().padStart(6, '0')) return true;
  }
  return false;
}

// ===== Auth Flow =====

function checkSession() {
  const session = sessionStorage.getItem('ft_auth');
  if (session === 'true') return true;
  const remembered = localStorage.getItem('ft_remember_until');
  if (remembered && Date.now() < parseInt(remembered)) {
    sessionStorage.setItem('ft_auth', 'true');
    return true;
  }
  return false;
}

function getGithubPAT() {
  return localStorage.getItem('ft_github_pat');
}

function initAuth() {
  if (checkSession()) {
    if (getGithubPAT()) {
      showApp();
    } else {
      showPATScreen();
    }
    return;
  }
  showAuthScreen();
}

function showAuthScreen() {
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('pat-screen').style.display = 'none';
  document.getElementById('app').style.display = 'none';
}

function showPATScreen() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('pat-screen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function showApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('pat-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  initApp();
}

// Numpad handler
let totpInput = '';

function handleNumpad(num) {
  if (totpInput.length >= 6) return;
  totpInput += num;
  updateTOTPDisplay();
  if (totpInput.length === 6) {
    validateAndProceed();
  }
}

function handleDelete() {
  totpInput = totpInput.slice(0, -1);
  updateTOTPDisplay();
}

function updateTOTPDisplay() {
  for (let i = 0; i < 6; i++) {
    const el = document.getElementById('d' + i);
    el.textContent = totpInput[i] || '';
    el.className = 'totp-digit' + (i === totpInput.length ? ' active' : '') + (totpInput[i] ? ' filled' : '');
  }
}

async function validateAndProceed() {
  const valid = await validateTOTP(totpInput);
  if (valid) {
    sessionStorage.setItem('ft_auth', 'true');
    if (document.getElementById('remember-device').checked) {
      localStorage.setItem('ft_remember_until', (Date.now() + 86400000).toString());
    }
    if (getGithubPAT()) {
      showApp();
    } else {
      showPATScreen();
    }
  } else {
    document.getElementById('auth-error').textContent = 'Invalid code. Try again.';
    totpInput = '';
    updateTOTPDisplay();
    setTimeout(() => {
      document.getElementById('auth-error').textContent = '';
    }, 3000);
  }
}

// ===== GitHub API =====

async function ghRead(path) {
  const pat = getGithubPAT();
  if (!pat) return null;
  try {
    const res = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
      headers: { Authorization: `Bearer ${pat}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();
    return { content: JSON.parse(atob(data.content)), sha: data.sha };
  } catch (e) {
    console.error('ghRead error:', e);
    return null;
  }
}

async function ghWrite(path, content, sha) {
  const pat = getGithubPAT();
  if (!pat) return false;
  const body = {
    message: `Update ${path}`,
    content: btoa(JSON.stringify(content, null, 2)),
  };
  if (sha) body.sha = sha;
  try {
    const res = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${pat}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`GitHub write error: ${res.status}`);
    const data = await res.json();
    return data.content.sha;
  } catch (e) {
    console.error('ghWrite error:', e);
    showToast('Save failed - stored offline', 'error');
    return false;
  }
}

// ===== Local Storage Fallback =====

function localSave(key, data) {
  localStorage.setItem(`ft_${key}`, JSON.stringify(data));
}

function localLoad(key) {
  const raw = localStorage.getItem(`ft_${key}`);
  return raw ? JSON.parse(raw) : null;
}

// ===== Data Layer =====

async function loadDayData(date, type) {
  const path = `logs/${type}/${date}.json`;
  const cached = localLoad(`${type}_${date}`);

  if (!state.isOnline) return cached || [];

  const remote = await ghRead(path);
  if (remote) {
    localSave(`${type}_${date}`, remote.content);
    localSave(`${type}_${date}_sha`, remote.sha);
    return remote.content;
  }
  return cached || [];
}

async function saveDayData(date, type, data) {
  localSave(`${type}_${date}`, data);
  const path = `logs/${type}/${date}.json`;
  const sha = localLoad(`${type}_${date}_sha`);
  const newSha = await ghWrite(path, data, sha);
  if (newSha) {
    localSave(`${type}_${date}_sha`, newSha);
    updateStatus(true);
  } else {
    updateStatus(false);
  }
}

async function loadPRs() {
  const remote = await ghRead('prs.json');
  if (remote) {
    state.prs = remote.content;
    localSave('prs', remote.content);
    localSave('prs_sha', remote.sha);
  } else {
    state.prs = localLoad('prs') || {};
  }
}

async function savePRs() {
  localSave('prs', state.prs);
  const sha = localLoad('prs_sha');
  const newSha = await ghWrite('prs.json', state.prs, sha);
  if (newSha) localSave('prs_sha', newSha);
}

// ===== Utility Functions =====

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  if (dateStr === todayStr()) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === yesterday.toISOString().slice(0, 10)) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function shiftDate(dateStr, days) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  setTimeout(() => { el.className = 'toast'; }, 2500);
}

function updateStatus(online) {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  if (online) {
    dot.className = 'status-dot';
    text.textContent = 'Connected';
  } else {
    dot.className = 'status-dot offline';
    text.textContent = 'Offline (local)';
  }
}

// ===== App Initialization =====

async function initApp() {
  document.getElementById('header-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Load current day data
  state.foodLog = await loadDayData(state.currentDate, 'food');
  state.workoutLog = await loadDayData(state.currentDate, 'workout');
  await loadPRs();

  // Load weight
  const weightData = await ghRead('logs/weight/' + state.currentDate + '.json');
  if (weightData) {
    document.getElementById('weight-input').value = weightData.content.weight || '';
  }

  renderFoodTab();
  renderWorkoutTab();
  updateSummary();
}

// ===== Tab Navigation =====

function switchTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

  if (tab === 'trends') renderTrends();
  if (tab === 'summary') updateSummary();
}

// ===== Food Tab =====

function renderFoodTab() {
  document.getElementById('food-date').textContent = formatDate(state.currentDate);
  renderFoodLog();
  updateMacroSummary();
}

function updateMacroSummary() {
  const totals = state.foodLog.reduce((acc, item) => ({
    calories: acc.calories + (item.calories || 0),
    protein: acc.protein + (item.protein || 0),
    carbs: acc.carbs + (item.carbs || 0),
    fat: acc.fat + (item.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  document.getElementById('total-cal').textContent = Math.round(totals.calories);
  document.getElementById('total-pro').textContent = Math.round(totals.protein) + 'g';
  document.getElementById('total-carb').textContent = Math.round(totals.carbs) + 'g';
  document.getElementById('total-fat').textContent = Math.round(totals.fat) + 'g';

  document.getElementById('prog-cal').style.width = Math.min(100, (totals.calories / TARGETS.calories) * 100) + '%';
  document.getElementById('prog-pro').style.width = Math.min(100, (totals.protein / TARGETS.protein) * 100) + '%';
  document.getElementById('prog-carb').style.width = Math.min(100, (totals.carbs / TARGETS.carbs) * 100) + '%';
  document.getElementById('prog-fat').style.width = Math.min(100, (totals.fat / TARGETS.fat) * 100) + '%';
}

function renderFoodLog() {
  const el = document.getElementById('food-log');
  if (state.foodLog.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🍽️</div><div class="empty-state-text">No food logged yet</div></div>';
    return;
  }
  el.innerHTML = state.foodLog.map((item, i) => `
    <li class="food-entry fade-in">
      <div class="food-entry-info">
        <div class="food-entry-name">${item.name}${item.qty > 1 ? ` × ${item.qty}` : ''}</div>
        <div class="food-entry-macros">P: ${Math.round(item.protein)}g · C: ${Math.round(item.carbs)}g · F: ${Math.round(item.fat)}g</div>
      </div>
      <div class="food-entry-cal">${Math.round(item.calories)}</div>
      <button class="food-entry-delete" onclick="deleteFood(${i})">×</button>
    </li>
  `).join('');
}

function searchFood(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 8);
}

function addFood(food, qty = 1) {
  const entry = {
    name: food.name,
    calories: food.calories * qty,
    protein: food.protein * qty,
    carbs: food.carbs * qty,
    fat: food.fat * qty,
    qty,
    time: new Date().toTimeString().slice(0, 5)
  };
  state.foodLog.push(entry);
  saveDayData(state.currentDate, 'food', state.foodLog);
  renderFoodTab();
  showToast('Added: ' + food.name);
}

function addCustomFood() {
  const name = document.getElementById('custom-food-name').value.trim();
  const cal = parseInt(document.getElementById('custom-food-cal').value) || 0;
  const pro = parseInt(document.getElementById('custom-food-pro').value) || 0;
  if (!name) return;
  const entry = { name, calories: cal, protein: pro, carbs: 0, fat: 0, qty: 1, time: new Date().toTimeString().slice(0, 5) };
  state.foodLog.push(entry);
  saveDayData(state.currentDate, 'food', state.foodLog);
  renderFoodTab();
  document.getElementById('custom-food-name').value = '';
  document.getElementById('custom-food-cal').value = '';
  document.getElementById('custom-food-pro').value = '';
  showToast('Added: ' + name);
}

function deleteFood(index) {
  state.foodLog.splice(index, 1);
  saveDayData(state.currentDate, 'food', state.foodLog);
  renderFoodTab();
}

// ===== Workout Tab =====

function renderWorkoutTab() {
  document.getElementById('workout-date').textContent = formatDate(state.currentDate);
  renderWorkoutLog();
}

function renderWorkoutLog() {
  const el = document.getElementById('workout-log');
  if (state.workoutLog.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏋️</div><div class="empty-state-text">No exercises logged</div></div>';
    return;
  }
  el.innerHTML = state.workoutLog.map(ex => {
    const isPR = ex.pr;
    return `
      <div class="workout-entry fade-in">
        <div class="workout-entry-header">
          <span class="workout-entry-name">${ex.name} ${isPR ? '<span class="pr-badge">PR</span>' : ''}</span>
          <span class="workout-entry-sets">${ex.sets.length} sets</span>
        </div>
        ${ex.sets.map((s, i) => `<div class="workout-set-detail">Set ${i + 1}: ${s.weight}kg × ${s.reps}</div>`).join('')}
      </div>
    `;
  }).join('');
}

function addSet() {
  const name = document.getElementById('exercise-name').value.trim();
  const weight = parseFloat(document.getElementById('exercise-weight').value) || 0;
  const reps = parseInt(document.getElementById('exercise-reps').value) || 0;
  if (!name || !reps) return;

  state.currentSets.push({ weight, reps });
  document.getElementById('exercise-name').disabled = true;
  renderCurrentSets();
  document.getElementById('save-exercise').classList.remove('hidden');
  document.getElementById('exercise-weight').value = '';
  document.getElementById('exercise-reps').value = '';
  document.getElementById('exercise-reps').focus();
}

function renderCurrentSets() {
  const el = document.getElementById('current-sets');
  el.innerHTML = state.currentSets.map((s, i) =>
    `<div class="workout-set-detail" style="padding:6px 12px;background:var(--bg-card);border-radius:6px;margin-bottom:4px">Set ${i + 1}: ${s.weight}kg × ${s.reps}</div>`
  ).join('');
}

function saveExercise() {
  const name = document.getElementById('exercise-name').value.trim();
  if (!name || state.currentSets.length === 0) return;

  // Check for PR
  const maxWeight = Math.max(...state.currentSets.map(s => s.weight));
  const prevPR = state.prs[name] || 0;
  const isPR = maxWeight > prevPR && maxWeight > 0;

  if (isPR) {
    state.prs[name] = maxWeight;
    savePRs();
    showToast(`New PR! ${name}: ${maxWeight}kg`, 'success');
  }

  const exercise = { name, sets: [...state.currentSets], pr: isPR, time: new Date().toTimeString().slice(0, 5) };
  state.workoutLog.push(exercise);
  saveDayData(state.currentDate, 'workout', state.workoutLog);

  // Reset
  state.currentSets = [];
  document.getElementById('exercise-name').value = '';
  document.getElementById('exercise-name').disabled = false;
  document.getElementById('exercise-weight').value = '';
  document.getElementById('exercise-reps').value = '';
  document.getElementById('current-sets').innerHTML = '';
  document.getElementById('save-exercise').classList.add('hidden');
  document.getElementById('exercise-suggestions').classList.remove('show');
  renderWorkoutTab();
}

function applyTemplate(tpl) {
  document.querySelectorAll('.template-chip').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-tpl="${tpl}"]`).classList.add('active');
  // Set first exercise from template
  const template = WORKOUT_TEMPLATES[tpl];
  if (template && template.exercises.length > 0) {
    document.getElementById('exercise-name').value = template.exercises[0];
    document.getElementById('exercise-weight').focus();
  }
}

function showExerciseSuggestions(query) {
  const el = document.getElementById('exercise-suggestions');
  if (!query || query.length < 2) { el.classList.remove('show'); return; }
  const q = query.toLowerCase();
  const matches = EXERCISES.filter(e => e.toLowerCase().includes(q)).slice(0, 6);
  if (matches.length === 0) { el.classList.remove('show'); return; }
  el.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="selectExercise('${m}')">${m}</div>`).join('');
  el.classList.add('show');
}

function selectExercise(name) {
  document.getElementById('exercise-name').value = name;
  document.getElementById('exercise-suggestions').classList.remove('show');
  document.getElementById('exercise-weight').focus();
}

// ===== Weight =====

async function saveWeight() {
  const w = parseFloat(document.getElementById('weight-input').value);
  if (!w) return;
  const date = state.currentDate;
  const path = `logs/weight/${date}.json`;
  const existing = await ghRead(path);
  const sha = existing ? existing.sha : null;
  await ghWrite(path, { weight: w, date }, sha);
  showToast(`Weight saved: ${w}kg`);
}

// ===== Steps =====

async function saveSteps() {
  const steps = parseInt(document.getElementById('steps-input').value);
  if (!steps) return;
  // Add steps to workout log
  const existingIdx = state.workoutLog.findIndex(e => e.name === 'Steps');
  if (existingIdx >= 0) {
    state.workoutLog[existingIdx] = { name: 'Steps', sets: [{ weight: 0, reps: steps }], pr: false };
  } else {
    state.workoutLog.push({ name: 'Steps', sets: [{ weight: 0, reps: steps }], pr: false });
  }
  await saveDayData(state.currentDate, 'workout', state.workoutLog);
  renderWorkoutTab();
  showToast(`Steps saved: ${steps.toLocaleString()}`);
}

// ===== Trends =====

async function renderTrends() {
  const selected = document.querySelector('.chart-chip.active')?.dataset.trend || 'weight';
  const canvas = document.getElementById('trend-chart');
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width - 32;
  canvas.height = 200;

  // Gather last 30 days data
  const dates = [];
  const values = [];
  for (let i = 29; i >= 0; i--) {
    const date = shiftDate(todayStr(), -i);
    dates.push(date);
    let val = 0;
    if (selected === 'weight') {
      const d = localLoad(`weight_${date}`) || (await ghRead(`logs/weight/${date}.json`))?.content;
      val = d?.weight || 0;
    } else if (selected === 'calories' || selected === 'protein') {
      const food = localLoad(`food_${date}`) || [];
      val = food.reduce((sum, f) => sum + (f[selected === 'calories' ? 'calories' : 'protein'] || 0), 0);
    } else if (selected === 'volume') {
      const workout = localLoad(`workout_${date}`) || [];
      val = workout.reduce((sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);
    }
    values.push(val);
  }

  drawChart(ctx, canvas.width, canvas.height, dates, values, selected);
  renderTrendTable(dates, values, selected);
  document.getElementById('trend-title').textContent = `${selected.charAt(0).toUpperCase() + selected.slice(1)} (30 days)`;
}

function drawChart(ctx, w, h, dates, values, type) {
  ctx.clearRect(0, 0, w, h);
  const filtered = values.filter(v => v > 0);
  if (filtered.length === 0) {
    ctx.fillStyle = '#5f6368';
    ctx.font = '14px -apple-system';
    ctx.textAlign = 'center';
    ctx.fillText('No data yet', w / 2, h / 2);
    return;
  }

  const padding = { top: 20, right: 10, bottom: 30, left: 45 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const min = Math.min(...filtered) * 0.95;
  const max = Math.max(...filtered) * 1.05;
  const range = max - min || 1;

  // Grid lines
  ctx.strokeStyle = '#2d3140';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    ctx.fillStyle = '#5f6368';
    ctx.font = '10px -apple-system';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (range / 4) * i).toString(), padding.left - 5, y + 4);
  }

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = '#4fc3f7';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  let firstPoint = true;
  values.forEach((v, i) => {
    if (v === 0) return;
    const x = padding.left + (i / (values.length - 1)) * chartW;
    const y = padding.top + chartH - ((v - min) / range) * chartH;
    if (firstPoint) { ctx.moveTo(x, y); firstPoint = false; }
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // 7-day moving average
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 183, 77, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  firstPoint = true;
  values.forEach((_, i) => {
    const slice = values.slice(Math.max(0, i - 6), i + 1).filter(v => v > 0);
    if (slice.length === 0) return;
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    const x = padding.left + (i / (values.length - 1)) * chartW;
    const y = padding.top + chartH - ((avg - min) / range) * chartH;
    if (firstPoint) { ctx.moveTo(x, y); firstPoint = false; }
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // Date labels
  ctx.fillStyle = '#5f6368';
  ctx.font = '9px -apple-system';
  ctx.textAlign = 'center';
  [0, 9, 19, 29].forEach(i => {
    if (i < dates.length) {
      const x = padding.left + (i / (values.length - 1)) * chartW;
      ctx.fillText(dates[i].slice(5), x, h - 5);
    }
  });
}

function renderTrendTable(dates, values, type) {
  const body = document.getElementById('trend-table-body');
  const rows = dates.map((d, i) => {
    if (values[i] === 0) return '';
    const slice = values.slice(Math.max(0, i - 6), i + 1).filter(v => v > 0);
    const avg = slice.length ? Math.round(slice.reduce((a, b) => a + b, 0) / slice.length) : '--';
    return `<tr><td>${d.slice(5)}</td><td>${Math.round(values[i])}</td><td>${avg}</td></tr>`;
  }).filter(Boolean).reverse().slice(0, 14);
  body.innerHTML = rows.join('');
}

// ===== Summary Tab =====

async function updateSummary() {
  const today = todayStr();
  const weekStart = shiftDate(today, -6);
  let totalCal = 0, totalPro = 0, trainDays = 0, totalVolume = 0, prsThisWeek = 0;
  let daysWithFood = 0;
  const weights = [];

  for (let i = 0; i < 7; i++) {
    const date = shiftDate(weekStart, i);
    const food = localLoad(`food_${date}`) || [];
    const workout = localLoad(`workout_${date}`) || [];
    const weight = localLoad(`weight_${date}`);

    if (food.length > 0) {
      daysWithFood++;
      totalCal += food.reduce((s, f) => s + (f.calories || 0), 0);
      totalPro += food.reduce((s, f) => s + (f.protein || 0), 0);
    }
    if (workout.length > 0) {
      trainDays++;
      totalVolume += workout.reduce((s, ex) => s + ex.sets.reduce((ss, set) => ss + set.weight * set.reps, 0), 0);
      prsThisWeek += workout.filter(e => e.pr).length;
    }
    if (weight?.weight) weights.push(weight.weight);
  }

  document.getElementById('week-avg-cal').textContent = daysWithFood ? Math.round(totalCal / daysWithFood) : '--';
  document.getElementById('week-avg-pro').textContent = daysWithFood ? Math.round(totalPro / daysWithFood) + 'g' : '--';
  document.getElementById('week-train-days').textContent = trainDays + '/7';
  document.getElementById('week-volume').textContent = totalVolume ? (totalVolume / 1000).toFixed(1) + 'k' : '--';
  document.getElementById('week-prs').textContent = prsThisWeek;

  const weightDelta = weights.length >= 2 ? (weights[weights.length - 1] - weights[0]).toFixed(1) : '--';
  document.getElementById('week-weight-delta').textContent = typeof weightDelta === 'string' ? weightDelta : (weightDelta > 0 ? '+' : '') + weightDelta + 'kg';

  if (weights.length > 0) {
    document.getElementById('current-weight').textContent = weights[weights.length - 1];
  }

  // Streak calculation
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const date = shiftDate(today, -i);
    const food = localLoad(`food_${date}`);
    if (food && food.length > 0) streak++;
    else break;
  }
  document.getElementById('streak-count').textContent = streak;

  // Weight mini chart
  renderWeightMiniChart();
}

async function renderWeightMiniChart() {
  const canvas = document.getElementById('weight-mini-chart');
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width - 32;
  canvas.height = 150;

  const dates = [];
  const values = [];
  for (let i = 29; i >= 0; i--) {
    const date = shiftDate(todayStr(), -i);
    dates.push(date);
    const d = localLoad(`weight_${date}`);
    values.push(d?.weight || 0);
  }
  drawChart(ctx, canvas.width, canvas.height, dates, values, 'weight');
}

// ===== Date Navigation =====

async function navigateDate(direction) {
  state.currentDate = shiftDate(state.currentDate, direction);
  state.foodLog = await loadDayData(state.currentDate, 'food');
  state.workoutLog = await loadDayData(state.currentDate, 'workout');
  renderFoodTab();
  renderWorkoutTab();
}

// ===== Event Listeners =====

document.addEventListener('DOMContentLoaded', () => {
  initAuth();

  // Numpad
  document.querySelectorAll('.numpad-btn[data-num]').forEach(btn => {
    btn.addEventListener('click', () => handleNumpad(btn.dataset.num));
  });
  document.getElementById('numpad-delete').addEventListener('click', handleDelete);

  // PAT save
  document.getElementById('pat-save').addEventListener('click', () => {
    const pat = document.getElementById('pat-input').value.trim();
    if (pat) {
      localStorage.setItem('ft_github_pat', pat);
      showApp();
    }
  });

  // Tab navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  // Food search
  const searchInput = document.getElementById('food-search');
  const searchResults = document.getElementById('food-results');
  searchInput.addEventListener('input', () => {
    const results = searchFood(searchInput.value);
    if (results.length > 0) {
      searchResults.innerHTML = results.map(f => `
        <div class="search-item" data-food='${JSON.stringify(f)}'>
          <div>
            <div class="search-item-name">${f.name}</div>
            <div class="search-item-meta">${f.serving} · P:${f.protein}g</div>
          </div>
          <div class="search-item-meta">${f.calories} cal</div>
        </div>
      `).join('');
      searchResults.classList.add('show');
    } else {
      searchResults.classList.remove('show');
    }
  });

  searchResults.addEventListener('click', (e) => {
    const item = e.target.closest('.search-item');
    if (item) {
      const food = JSON.parse(item.dataset.food);
      addFood(food);
      searchInput.value = '';
      searchResults.classList.remove('show');
    }
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => searchResults.classList.remove('show'), 200);
  });

  // Custom food add
  document.getElementById('custom-food-add').addEventListener('click', addCustomFood);

  // Workout
  document.getElementById('add-set').addEventListener('click', addSet);
  document.getElementById('save-exercise').addEventListener('click', saveExercise);

  // Exercise suggestions
  document.getElementById('exercise-name').addEventListener('input', (e) => {
    showExerciseSuggestions(e.target.value);
  });

  // Templates
  document.querySelectorAll('.template-chip').forEach(chip => {
    chip.addEventListener('click', () => applyTemplate(chip.dataset.tpl));
  });

  // Weight
  document.getElementById('weight-save').addEventListener('click', saveWeight);

  // Steps
  document.getElementById('steps-save').addEventListener('click', saveSteps);

  // Date navigation
  document.getElementById('food-prev').addEventListener('click', () => navigateDate(-1));
  document.getElementById('food-next').addEventListener('click', () => navigateDate(1));
  document.getElementById('workout-prev').addEventListener('click', () => navigateDate(-1));
  document.getElementById('workout-next').addEventListener('click', () => navigateDate(1));

  // Trend selector
  document.querySelectorAll('.chart-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chart-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderTrends();
    });
  });

  // Online/offline detection
  window.addEventListener('online', () => { state.isOnline = true; updateStatus(true); });
  window.addEventListener('offline', () => { state.isOnline = false; updateStatus(false); });
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
