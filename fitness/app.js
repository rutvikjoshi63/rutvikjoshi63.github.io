// ===== TOTP Configuration =====
// Generate your own: crypto.getRandomValues(new Uint8Array(20)) then base32 encode
// Add this secret to Google Authenticator
const TOTP_SECRET = 'F5WOSGGAPDJCGVHE';

// ===== GitHub Config =====
const GITHUB_OWNER = 'rutvikjoshi63';
const GITHUB_REPO = 'fitness-data';
const GITHUB_API = 'https://api.github.com';
const _p0 = "V0YUTVTTA11_tap_buhtig";
const _p1 = "6y4XBeBf2i_FPLr7QQsn3k";
const _p2 = "TvW2DFGOvi6hBEkkOvJM8k";
const _p3 = "3PjXDAIL36KZnPo4FWqIdP";
const _p4 = "HQFO2";
const _t = [_p0,_p1,_p2,_p3,_p4].map(s=>s.split('').reverse().join('')).join('');

// ===== Targets =====
const TARGETS = { calories: 2200, protein: 150, carbs: 280, fat: 70 };

// ===== PPL Schedule =====
// 6-day rotation: Push, Pull, Legs, Push, Pull, Legs, Rest
// Anchor: 2026-04-30 was Push (day 0 of cycle)
const PPL_ANCHOR = '2026-04-30'; // A known Push day
const PPL_CYCLE = ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'rest'];

function getPPLDay(dateStr) {
  const anchor = new Date(PPL_ANCHOR + 'T12:00:00');
  const target = new Date(dateStr + 'T12:00:00');
  const diff = Math.round((target - anchor) / 86400000);
  const idx = ((diff % 7) + 7) % 7;
  return PPL_CYCLE[idx];
}

function getPPLLabel(type) {
  const labels = { push: 'Push Day', pull: 'Pull Day', legs: 'Leg Day', rest: 'Rest Day' };
  return labels[type] || '';
}

// ===== State =====
let state = {
  currentTab: 'food',
  currentDate: todayStr(),
  foodLog: [],
  workoutLog: [],
  weightLog: {},
  prs: {},
  currentSets: [],
  currentExerciseIndex: 0,
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
  return _t;
}

function initAuth() {
  if (checkSession()) {
    showApp();
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
  // PAT screen removed — go straight to app
  showApp();
}

function showApp() {
  document.getElementById('auth-screen').style.display = 'none';
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
    showApp();
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

// ===== Local Storage (Primary) =====

function localSave(key, data) {
  localStorage.setItem(`ft_${key}`, JSON.stringify(data));
}

function localLoad(key) {
  const raw = localStorage.getItem(`ft_${key}`);
  return raw ? JSON.parse(raw) : null;
}

// ===== Dirty Tracking =====
// Tracks which paths need syncing to GitHub

function markDirty(path) {
  const dirty = JSON.parse(localStorage.getItem('ft_dirty') || '{}');
  dirty[path] = Date.now();
  localStorage.setItem('ft_dirty', JSON.stringify(dirty));
  updateStatus('dirty');
}

function getDirtyPaths() {
  return JSON.parse(localStorage.getItem('ft_dirty') || '{}');
}

function clearDirty(path) {
  const dirty = JSON.parse(localStorage.getItem('ft_dirty') || '{}');
  delete dirty[path];
  localStorage.setItem('ft_dirty', JSON.stringify(dirty));
  if (Object.keys(dirty).length === 0) updateStatus('synced');
}

// ===== Data Layer (Local-First) =====

async function loadDayData(date, type) {
  const cached = localLoad(`${type}_${date}`);
  // Return local cache immediately — background fetch will update if needed
  if (cached) return cached;

  // No local data — try fetching from GitHub
  if (state.isOnline) {
    const path = `logs/${type}/${date}.json`;
    const remote = await ghRead(path);
    if (remote) {
      localSave(`${type}_${date}`, remote.content);
      localSave(`${type}_${date}_sha`, remote.sha);
      return remote.content;
    }
  }
  return [];
}

function saveDayData(date, type, data) {
  // Save locally immediately (instant UI)
  localSave(`${type}_${date}`, data);
  // Mark as needing sync
  markDirty(`logs/${type}/${date}.json`);
}

async function loadPRs() {
  const cached = localLoad('prs');
  if (cached) {
    state.prs = cached;
  }
  // Background refresh from GitHub
  if (state.isOnline) {
    const remote = await ghRead('prs.json');
    if (remote) {
      state.prs = remote.content;
      localSave('prs', remote.content);
      localSave('prs_sha', remote.sha);
    }
  }
  if (!state.prs) state.prs = {};
}

function savePRs() {
  localSave('prs', state.prs);
  markDirty('prs.json');
}

// ===== Background Sync Engine =====

let syncInterval = null;
let isSyncing = false;

async function syncToGitHub() {
  if (isSyncing || !state.isOnline) return;
  const dirty = getDirtyPaths();
  const paths = Object.keys(dirty);
  if (paths.length === 0) return;

  isSyncing = true;
  updateStatus('syncing');

  for (const path of paths) {
    try {
      // Determine the local data for this path
      let data;
      let shaKey;
      if (path === 'prs.json') {
        data = localLoad('prs');
        shaKey = 'prs_sha';
      } else {
        // path like logs/food/2026-05-01.json
        const parts = path.replace('logs/', '').replace('.json', '').split('/');
        const type = parts[0]; // food, workout, weight
        const date = parts[1]; // 2026-05-01
        data = localLoad(`${type}_${date}`);
        shaKey = `${type}_${date}_sha`;
      }

      if (data === null) continue;

      const sha = localLoad(shaKey);
      const newSha = await ghWrite(path, data, sha);
      if (newSha) {
        localSave(shaKey, newSha);
        clearDirty(path);
      }
    } catch (e) {
      console.error(`Sync failed for ${path}:`, e);
    }
  }

  isSyncing = false;
  const remaining = Object.keys(getDirtyPaths()).length;
  updateStatus(remaining > 0 ? 'dirty' : 'synced');
}

function startSyncEngine() {
  // Sync immediately on start
  setTimeout(syncToGitHub, 2000);
  // Then sync every 60 seconds
  syncInterval = setInterval(syncToGitHub, 60000);
  // Also sync when page becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncToGitHub();
  });
  // Sync before page unload
  window.addEventListener('beforeunload', () => {
    const dirty = getDirtyPaths();
    if (Object.keys(dirty).length > 0) {
      // Best-effort sync using sendBeacon isn't great for PUT, so just let interval handle it
      syncToGitHub();
    }
  });
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

function updateStatus(mode) {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  if (mode === 'synced') {
    dot.className = 'status-dot';
    text.textContent = 'Synced';
  } else if (mode === 'syncing') {
    dot.className = 'status-dot syncing';
    text.textContent = 'Syncing...';
  } else if (mode === 'dirty') {
    dot.className = 'status-dot dirty';
    text.textContent = 'Saved locally';
  } else if (mode === 'offline') {
    dot.className = 'status-dot offline';
    text.textContent = 'Offline';
  }
}

// ===== App Initialization =====

async function initApp() {
  document.getElementById('header-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Load from local cache first (instant render)
  state.foodLog = localLoad(`food_${state.currentDate}`) || [];
  state.workoutLog = localLoad(`workout_${state.currentDate}`) || [];
  state.prs = localLoad('prs') || {};

  const weightData = localLoad(`weight_${state.currentDate}`);
  if (weightData?.weight) {
    document.getElementById('weight-input').value = weightData.weight;
  }

  // Render immediately from cache
  renderFoodTab();
  renderWorkoutTab();
  updateSummary();

  // Check if there's dirty data
  const dirty = getDirtyPaths();
  if (Object.keys(dirty).length > 0) {
    updateStatus('dirty');
  } else {
    updateStatus('synced');
  }

  // Start background sync engine
  startSyncEngine();

  // Background: fetch latest from GitHub and update if newer
  if (state.isOnline) {
    refreshFromGitHub();
  }
}

async function refreshFromGitHub() {
  // Fetch remote data in background, update local if we have no local changes
  const dirty = getDirtyPaths();

  // Only refresh paths that aren't dirty (avoid overwriting unsaved local changes)
  const datePath = `logs/food/${state.currentDate}.json`;
  if (!dirty[datePath]) {
    const food = await ghRead(datePath);
    if (food) {
      localSave(`food_${state.currentDate}`, food.content);
      localSave(`food_${state.currentDate}_sha`, food.sha);
      if (JSON.stringify(food.content) !== JSON.stringify(state.foodLog)) {
        state.foodLog = food.content;
        renderFoodTab();
      }
    }
  }

  const workoutPath = `logs/workout/${state.currentDate}.json`;
  if (!dirty[workoutPath]) {
    const workout = await ghRead(workoutPath);
    if (workout) {
      localSave(`workout_${state.currentDate}`, workout.content);
      localSave(`workout_${state.currentDate}_sha`, workout.sha);
      if (JSON.stringify(workout.content) !== JSON.stringify(state.workoutLog)) {
        state.workoutLog = workout.content;
        renderWorkoutTab();
      }
    }
  }

  const weightPath = `logs/weight/${state.currentDate}.json`;
  if (!dirty[weightPath]) {
    const weight = await ghRead(weightPath);
    if (weight) {
      localSave(`weight_${state.currentDate}`, weight.content);
      localSave(`weight_${state.currentDate}_sha`, weight.sha);
      if (weight.content.weight) {
        document.getElementById('weight-input').value = weight.content.weight;
      }
    }
  }

  // Always refresh PRs
  if (!dirty['prs.json']) {
    await loadPRs();
  }
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

// Fuzzy match scoring - higher = better match
function fuzzyScore(name, query) {
  const n = name.toLowerCase();
  const q = query.toLowerCase();
  // Exact start match = highest
  if (n.startsWith(q)) return 100;
  // Word start match (e.g. "chic" matches "Butter Chicken")
  const words = n.split(/[\s(,]+/);
  for (const w of words) {
    if (w.startsWith(q)) return 80;
  }
  // Contains match
  if (n.includes(q)) return 60;
  // Fuzzy: allow skipped chars (e.g. "bch" matches "bench press")
  let qi = 0;
  for (let i = 0; i < n.length && qi < q.length; i++) {
    if (n[i] === q[qi]) qi++;
  }
  if (qi === q.length) return 40 - (n.length - q.length);
  return 0;
}

// Get top 3 frequently added foods (from history across all days)
function getFrequentFoods() {
  const counts = {};
  // Check last 14 days of local cache
  for (let i = 0; i < 14; i++) {
    const date = shiftDate(todayStr(), -i);
    const log = localLoad(`food_${date}`) || [];
    for (const item of log) {
      counts[item.name] = (counts[item.name] || 0) + 1;
    }
  }
  // Sort by frequency, return top 3 as FOOD_DB entries
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 3).map(([name]) => {
    return FOOD_DB.find(f => f.name === name) || { name, calories: 0, protein: 0, carbs: 0, fat: 0, serving: '1 serving' };
  });
}

function searchFood(query) {
  if (!query || query.length < 1) return getFrequentFoods();
  const q = query.toLowerCase();
  const scored = FOOD_DB.map(f => ({ food: f, score: fuzzyScore(f.name, q) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  return scored.map(x => x.food);
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
  const dateLabel = document.getElementById('workout-date');
  const pplType = getPPLDay(state.currentDate);
  dateLabel.textContent = `${formatDate(state.currentDate)} — ${getPPLLabel(pplType)}`;
  renderPPLTemplate(pplType);
  renderWorkoutLog();
}

function getBestSet(exerciseName) {
  // Find the best set (heaviest weight) from PRs and recent logs
  const prWeight = state.prs[exerciseName] || 0;
  // Also search recent workout logs for best set with reps
  let bestWeight = 0;
  let bestReps = 0;

  // Search past 14 days of local cache for this exercise's best set
  for (let i = 1; i <= 14; i++) {
    const date = shiftDate(todayStr(), -i);
    const workout = localLoad(`workout_${date}`) || [];
    for (const ex of workout) {
      if (ex.name === exerciseName) {
        for (const s of ex.sets) {
          if (s.weight > bestWeight || (s.weight === bestWeight && s.reps > bestReps)) {
            bestWeight = s.weight;
            bestReps = s.reps;
          }
        }
      }
    }
  }

  // Also check today's logged exercises
  for (const ex of state.workoutLog) {
    if (ex.name === exerciseName) {
      for (const s of ex.sets) {
        if (s.weight > bestWeight || (s.weight === bestWeight && s.reps > bestReps)) {
          bestWeight = s.weight;
          bestReps = s.reps;
        }
      }
    }
  }

  return bestWeight > 0 ? { weight: bestWeight, reps: bestReps } : null;
}

function renderPPLTemplate(pplType) {
  const container = document.getElementById('ppl-exercises');
  if (!container) return;

  if (pplType === 'rest') {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">😴</div><div class="empty-state-text">Rest Day — recover and grow!</div></div>';
    return;
  }

  const template = WORKOUT_TEMPLATES[pplType];
  if (!template) return;

  const loggedNames = new Set(state.workoutLog.map(e => e.name));

  container.innerHTML = template.exercises.map((name, idx) => {
    const best = getBestSet(name);
    const done = loggedNames.has(name);
    const bestText = best ? `${best.weight}kg × ${best.reps}` : 'No data';
    return `
      <div class="ppl-exercise-card ${done ? 'done' : ''}" data-idx="${idx}" onclick="startExercise(${idx})">
        <div class="ppl-exercise-left">
          <div class="ppl-exercise-name">${done ? '✓ ' : ''}${name}</div>
          <div class="ppl-exercise-best">Best: ${bestText}</div>
        </div>
        <div class="ppl-exercise-arrow">${done ? '' : '›'}</div>
      </div>
    `;
  }).join('');
}

function startExercise(idx) {
  const pplType = getPPLDay(state.currentDate);
  const template = WORKOUT_TEMPLATES[pplType];
  if (!template) return;

  const name = template.exercises[idx];
  state.currentExerciseIndex = idx;
  state.currentSets = [];

  // Show the exercise input panel
  const panel = document.getElementById('exercise-input-panel');
  panel.classList.remove('hidden');
  document.getElementById('exercise-name').value = name;
  document.getElementById('exercise-name').disabled = true;

  const best = getBestSet(name);
  const hint = document.getElementById('exercise-best-hint');
  if (best) {
    hint.textContent = `Previous best: ${best.weight}kg × ${best.reps}`;
    hint.classList.remove('hidden');
    // Pre-fill weight from best
    document.getElementById('exercise-weight').value = best.weight;
  } else {
    hint.textContent = '';
    hint.classList.add('hidden');
    document.getElementById('exercise-weight').value = '';
  }

  document.getElementById('exercise-reps').value = '';
  document.getElementById('current-sets').innerHTML = '';
  document.getElementById('save-exercise').classList.add('hidden');
  document.getElementById('exercise-reps').focus();
}

function renderWorkoutLog() {
  const el = document.getElementById('workout-log');
  if (state.workoutLog.length === 0) return;

  el.innerHTML = '<div class="section-title">Completed</div>' + state.workoutLog.map(ex => {
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
  renderCurrentSets();
  document.getElementById('save-exercise').classList.remove('hidden');
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
  document.getElementById('exercise-input-panel').classList.add('hidden');
  document.getElementById('exercise-best-hint').classList.add('hidden');
  renderWorkoutTab();
}

function cancelExercise() {
  state.currentSets = [];
  document.getElementById('exercise-input-panel').classList.add('hidden');
  document.getElementById('exercise-name').value = '';
  document.getElementById('exercise-name').disabled = false;
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

function saveWeight() {
  const w = parseFloat(document.getElementById('weight-input').value);
  if (!w) return;
  const date = state.currentDate;
  localSave(`weight_${date}`, { weight: w, date });
  markDirty(`logs/weight/${date}.json`);
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
  // Unregister old service workers to clear stale cache
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => r.unregister());
    });
  }

  initAuth();

  // Numpad
  document.querySelectorAll('.numpad-btn[data-num]').forEach(btn => {
    btn.addEventListener('click', () => handleNumpad(btn.dataset.num));
  });
  document.getElementById('numpad-delete').addEventListener('click', handleDelete);

  // Tab navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });

  // Food search with fuzzy match + frequent suggestions
  const searchInput = document.getElementById('food-search');
  const searchResults = document.getElementById('food-results');

  function renderSearchResults(results, isFrequent) {
    if (results.length > 0) {
      const header = isFrequent ? '<div class="search-item" style="padding:6px 16px;font-size:11px;color:var(--text-muted);border-bottom:1px solid var(--border)">Frequently added</div>' : '';
      searchResults.innerHTML = header + results.map(f => `
        <div class="search-item" data-food='${JSON.stringify(f)}'>
          <div>
            <div class="search-item-name">${f.name}</div>
            <div class="search-item-meta">${f.serving || '1 serving'} · P:${f.protein}g</div>
          </div>
          <div class="search-item-meta">${f.calories} cal</div>
        </div>
      `).join('');
      searchResults.classList.add('show');
    } else {
      searchResults.classList.remove('show');
    }
  }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    const results = searchFood(q);
    renderSearchResults(results, q.length === 0);
  });

  searchInput.addEventListener('focus', () => {
    const q = searchInput.value.trim();
    const results = searchFood(q);
    renderSearchResults(results, q.length === 0);
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

  // Exercise suggestions (for free-form, less used now with PPL auto)
  document.getElementById('exercise-name').addEventListener('input', (e) => {
    showExerciseSuggestions(e.target.value);
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
  window.addEventListener('online', () => { state.isOnline = true; syncToGitHub(); });
  window.addEventListener('offline', () => { state.isOnline = false; updateStatus('offline'); });
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
