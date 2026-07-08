const KEYS = {
  theme: "basecamp:theme",
  todos: "basecamp:todos",
  planner: "basecamp:planner",
  goals: "basecamp:goals",
  focus: "basecamp:focus",
};

const ICONS = {
  sun: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5V5M12 19V21.5M4.2 4.2L6 6M18 18L19.8 19.8M2.5 12H5M19 12H21.5M4.2 19.8L6 18M18 6L19.8 4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  moon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  cloud: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17.5a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.6 1.4A3.6 3.6 0 0 1 17 17.5H7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  cloudSun: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 2.5V4M8 12V13.5M2.5 8H4M12.5 8H14M4 4L5.2 5.2M11 11L12.2 12.2M12.2 4L11 5.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M9 19.5a3.6 3.6 0 0 1 .3-7.1 5 5 0 0 1 9.4 1.4A3.2 3.2 0 0 1 18 19.5H9Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
};

const dashboard = document.getElementById("dashboard");
const featureSections = document.querySelectorAll(".feature");
let activeFeature = null;

function openFeature(name) {
  if (activeFeature === name) return;
  const section = document.getElementById("feature-" + name);
  if (!section) return;
  dashboard.classList.add("hidden");
  featureSections.forEach((f) => f.classList.add("hidden"));
  section.classList.remove("hidden");
  activeFeature = name;
  window.scrollTo(0, 0);
}

function closeFeature() {
  featureSections.forEach((f) => f.classList.add("hidden"));
  dashboard.classList.remove("hidden");
  activeFeature = null;
  refreshPreviews();
}

document.getElementById("cardGrid").addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (tile) openFeature(tile.dataset.feature);
});

document.querySelectorAll("[data-back]").forEach((btn) => btn.addEventListener("click", closeFeature));

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoListEl = document.getElementById("todoList");
const todoEmpty = document.getElementById("todoEmpty");
const todoPreview = document.getElementById("todoPreview");

let todos = loadJSON(KEYS.todos, []);

function saveTodos() {
  localStorage.setItem(KEYS.todos, JSON.stringify(todos));
  renderTodos();
}

function renderTodos() {
  todoListEl.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "list-item" + (todo.completed ? " completed" : "") + (todo.important ? " important" : "");
    li.dataset.id = todo.id;
    li.innerHTML = `
      <button class="icon-btn complete-btn ${todo.completed ? "checked" : ""}" title="Mark complete">${todo.completed ? "✓" : ""}</button>
      <span class="item-text">${escapeHTML(todo.text)}</span>
      <button class="icon-btn important-btn ${todo.important ? "active" : ""}" title="Mark important">!</button>
      <button class="icon-btn delete-btn" title="Delete">×</button>
    `;
    todoListEl.appendChild(li);
  });
  todoEmpty.classList.toggle("hidden", todos.length > 0);
  const remaining = todos.filter((t) => !t.completed).length;
  todoPreview.textContent = todos.length === 0 ? "No tasks yet" : `${remaining} of ${todos.length} remaining`;
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ id: makeId(), text, completed: false, important: false });
  todoInput.value = "";
  saveTodos();
});

todoListEl.addEventListener("click", (e) => {
  const li = e.target.closest(".list-item");
  if (!li) return;
  const todo = todos.find((t) => t.id === li.dataset.id);
  if (!todo) return;
  if (e.target.closest(".complete-btn")) todo.completed = !todo.completed;
  else if (e.target.closest(".important-btn")) todo.important = !todo.important;
  else if (e.target.closest(".delete-btn")) todos = todos.filter((t) => t.id !== li.dataset.id);
  else return;
  saveTodos();
});

const plannerList = document.getElementById("plannerList");
const plannerPreview = document.getElementById("plannerPreview");
let plannerData = loadJSON(KEYS.planner, {});

function renderPlanner() {
  plannerList.innerHTML = "";
  const currentHour = new Date().getHours();
  for (let hour = 6; hour <= 22; hour++) {
    const row = document.createElement("div");
    row.className = "planner-row" + (hour === currentHour ? " current-hour" : "");
    row.innerHTML = `
      <span class="planner-time">${formatHourLabel(hour)}</span>
      <input type="text" class="planner-input" data-hour="${hour}" placeholder="Nothing planned">
    `;
    plannerList.appendChild(row);
    row.querySelector("input").value = plannerData[hour] || "";
  }
  updatePlannerPreview();
}

function formatHourLabel(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  let h = hour % 12;
  if (h === 0) h = 12;
  return `${h}:00 ${period}`;
}

function updatePlannerPreview() {
  const filled = Object.values(plannerData).filter((v) => v && v.trim()).length;
  plannerPreview.textContent = filled === 0 ? "Plan your hours" : `${filled} slot${filled === 1 ? "" : "s"} filled`;
}

let plannerSaveTimeout = null;
plannerList.addEventListener("input", (e) => {
  const input = e.target.closest(".planner-input");
  if (!input) return;
  plannerData[input.dataset.hour] = input.value;
  clearTimeout(plannerSaveTimeout);
  plannerSaveTimeout = setTimeout(() => {
    localStorage.setItem(KEYS.planner, JSON.stringify(plannerData));
    updatePlannerPreview();
  }, 300);
});

const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");
const goalList = document.getElementById("goalList");
const goalEmpty = document.getElementById("goalEmpty");
const goalProgressFill = document.getElementById("goalProgressFill");
const goalProgressLabel = document.getElementById("goalProgressLabel");
const goalsStat = document.getElementById("goalsStat");

let goals = loadJSON(KEYS.goals, []);

function saveGoals() {
  localStorage.setItem(KEYS.goals, JSON.stringify(goals));
  renderGoals();
}

function renderGoals() {
  goalList.innerHTML = "";
  goals.forEach((goal) => {
    const li = document.createElement("li");
    li.className = "list-item" + (goal.completed ? " completed" : "");
    li.dataset.id = goal.id;
    li.innerHTML = `
      <button class="icon-btn complete-btn ${goal.completed ? "checked" : ""}" title="Mark done">${goal.completed ? "✓" : ""}</button>
      <span class="item-text">${escapeHTML(goal.text)}</span>
      <button class="icon-btn delete-btn" title="Remove">×</button>
    `;
    goalList.appendChild(li);
  });
  goalEmpty.classList.toggle("hidden", goals.length > 0);
  const total = goals.length;
  const done = goals.filter((g) => g.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  goalProgressFill.style.width = pct + "%";
  goalProgressLabel.textContent = `${done} of ${total} completed`;
  goalsStat.textContent = `${done}/${total}`;
}

goalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = goalInput.value.trim();
  if (!text) return;
  goals.push({ id: makeId(), text, completed: false });
  goalInput.value = "";
  saveGoals();
});

goalList.addEventListener("click", (e) => {
  const li = e.target.closest(".list-item");
  if (!li) return;
  if (e.target.closest(".complete-btn")) {
    const goal = goals.find((g) => g.id === li.dataset.id);
    if (goal) goal.completed = !goal.completed;
  } else if (e.target.closest(".delete-btn")) {
    goals = goals.filter((g) => g.id !== li.dataset.id);
  } else return;
  saveGoals();
});

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const timerDisplay = document.getElementById("timerDisplay");
const sessionLabel = document.getElementById("sessionLabel");
const pomodoroHint = document.getElementById("pomodoroHint");
const pomodoroPreview = document.getElementById("pomodoroPreview");
const focusStat = document.getElementById("focusStat");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let timerIntervalId = null;
let secondsRemaining = WORK_SECONDS;
let isBreak = false;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

let focusRecord = loadJSON(KEYS.focus, { day: todayKey(), seconds: 0 });
if (focusRecord.day !== todayKey()) focusRecord = { day: todayKey(), seconds: 0 };

function renderFocusStat() {
  focusStat.textContent = Math.floor(focusRecord.seconds / 60);
}

function saveFocusRecord() {
  localStorage.setItem(KEYS.focus, JSON.stringify(focusRecord));
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function renderTimer() {
  const text = formatTime(secondsRemaining);
  timerDisplay.textContent = text;
  sessionLabel.textContent = isBreak ? "Break session" : "Work session";
  pomodoroPreview.textContent = `${text} · ${isBreak ? "Break" : "Focus"} session`;
}

function tick() {
  secondsRemaining--;
  if (!isBreak) {
    focusRecord.seconds++;
    renderFocusStat();
  }
  if (secondsRemaining < 0) {
    isBreak = !isBreak;
    secondsRemaining = isBreak ? BREAK_SECONDS : WORK_SECONDS;
    pomodoroHint.textContent = isBreak
      ? "Break time. Step away from the screen for a bit."
      : "Back to focus. 25 minutes on one task.";
  }
  renderTimer();
}

startBtn.addEventListener("click", () => {
  if (timerIntervalId !== null) return;
  timerIntervalId = setInterval(tick, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(timerIntervalId);
  timerIntervalId = null;
  saveFocusRecord();
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerIntervalId);
  timerIntervalId = null;
  isBreak = false;
  secondsRemaining = WORK_SECONDS;
  pomodoroHint.textContent = "25 minutes of focus, then a 5 minute break.";
  renderTimer();
  saveFocusRecord();
});

window.addEventListener("beforeunload", saveFocusRecord);
setInterval(saveFocusRecord, 15000);

renderTimer();
renderFocusStat();

const QUOTES = [
  { text: "Small steps, done daily, outrun big plans done never.", author: "Basecamp" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "Well begun is half done.", author: "Aristotle" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", author: "Dale Carnegie" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
];

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");
let lastQuoteIndex = -1;

function showRandomQuote() {
  let index;
  do {
    index = Math.floor(Math.random() * QUOTES.length);
  } while (index === lastQuoteIndex && QUOTES.length > 1);
  lastQuoteIndex = index;
  const quote = QUOTES[index];
  quoteText.textContent = `“${quote.text}”`;
  quoteAuthor.textContent = `— ${quote.author}`;
}

newQuoteBtn.addEventListener("click", showRandomQuote);
showRandomQuote();

const clockTime = document.getElementById("clockTime");
const clockDate = document.getElementById("clockDate");

function renderClock() {
  const now = new Date();
  let hours = now.getHours();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  clockTime.textContent = `${hours}:${minutes}:${seconds} ${period}`;
  clockDate.textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

renderClock();
setInterval(renderClock, 1000);

function applyTimeOfDayBackground() {
  const hour = new Date().getHours();
  const root = document.documentElement;
  let tone;
  if (hour >= 5 && hour < 12) tone = "#DFDEE2";
  else if (hour >= 12 && hour < 17) tone = "#DBDADF";
  else if (hour >= 17 && hour < 21) tone = "#DCD8DD";
  else tone = "#D6D5DA";
  if (root.getAttribute("data-theme") !== "dark") root.style.setProperty("--canvas", tone);
}

applyTimeOfDayBackground();
setInterval(applyTimeOfDayBackground, 5 * 60 * 1000);

const WEATHER_BY_HOUR = [
  { range: [0, 6], temp: [16, 19], condition: "Clear night", icon: "moon" },
  { range: [6, 9], temp: [18, 21], condition: "Soft morning light", icon: "cloudSun" },
  { range: [9, 12], temp: [22, 26], condition: "Sunny", icon: "sun" },
  { range: [12, 16], temp: [27, 32], condition: "Warm and bright", icon: "sun" },
  { range: [16, 19], temp: [24, 28], condition: "Partly cloudy", icon: "cloud" },
  { range: [19, 22], temp: [20, 23], condition: "Cooling down", icon: "cloudSun" },
  { range: [22, 24], temp: [17, 19], condition: "Clear night", icon: "moon" },
];

const weatherTemp = document.getElementById("weatherTemp");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");

function renderWeather() {
  const hour = new Date().getHours();
  const slot = WEATHER_BY_HOUR.find((s) => hour >= s.range[0] && hour < s.range[1]) || WEATHER_BY_HOUR[0];
  const [minT, maxT] = slot.temp;
  const temp = Math.round(minT + Math.random() * (maxT - minT));
  weatherTemp.textContent = `${temp}°C`;
  weatherCondition.textContent = slot.condition;
  weatherIcon.innerHTML = ICONS[slot.icon];
}

renderWeather();
setInterval(renderWeather, 10 * 60 * 1000);

const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.getElementById("themeToggleIcon");

function applyThemeIcon() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  themeToggleIcon.innerHTML = isDark ? ICONS.sun : ICONS.moon;
}

applyThemeIcon();

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(KEYS.theme, next);
  applyThemeIcon();
});

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (err) {
    return fallback;
  }
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function refreshPreviews() {
  renderTodos();
  updatePlannerPreview();
  renderGoals();
}

renderTodos();
renderPlanner();
renderGoals();