/* ---------- 1. STORAGE HELPERS ---------- */
const KEYS = {
  users: "ue_users", events: "ue_events", regs: "ue_regs",
  session: "ue_session", demoRegsSeeded: "ue_demo_regs_seeded"
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error("Could not read", key, err);
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Could not save", key, err);
  }
}

/* ---------- 2. SEED DATA ---------- */
const seedEvents = [
  { id: 1, title: "Petanque", category: "Sports", date: "2026-11-20", time: "07:00", capacity: 200, venue: "Main Field", description: "Take part in a friendly campus petanque tournament.", image: "images/petanque.jpg" },
  { id: 2, title: "Badminton", category: "Sports", date: "2026-11-21", time: "10:00", capacity: 40, venue: "Sports Hall", description: "Compete in a friendly badminton tournament open to all students.", image: "images/badminton.jpg" },
  { id: 3, title: "Futsal", category: "Sports", date: "2026-11-22", time: "08:30", capacity: 60, venue: "Sports Hall", description: "Cheer on your faculty in our annual futsal tournament.", image: "images/futsal.jpg" },
  { id: 4, title: "Handball", category: "Sports", date: "2026-12-01", time: "09:00", capacity: 300, venue: "Sports Hall", description: "Support your team at the campus handball tournament.", image: "images/handball.jpg" },
  { id: 5, title: "Basketball", category: "Sports", date: "2026-12-02", time: "08:00", capacity: 80, venue: "Sports Hall", description: "Join the student basketball league and cheer on the teams.", image: "images/keranjang.jpg" }
];

const seedUsers = [
  { id: 1, name: "Admin", email: "admin@univent.edu", password: "admin123", role: "admin" },
  { id: 2, name: "Demo Student", email: "student@univent.edu", password: "student123", role: "student" }
];

const demoRegistrations = [
  { id: "demo-reg-1", eventId: 1, userId: "demo-student-aisha", userName: "Aisha Rahman", userEmail: "aisha.demo@example.edu" },
  { id: "demo-reg-2", eventId: 1, userId: "demo-student-daniel", userName: "Daniel Tan", userEmail: "daniel.demo@example.edu" },
  { id: "demo-reg-3", eventId: 1, userId: "demo-student-priya", userName: "Priya Kumar", userEmail: "priya.demo@example.edu" },
  { id: "demo-reg-4", eventId: 1, userId: "demo-student-amir", userName: "Amir Hakim", userEmail: "amir.demo@example.edu" },
  { id: "demo-reg-5", eventId: 2, userId: "demo-student-mei", userName: "Mei Lin", userEmail: "mei.demo@example.edu" },
  { id: "demo-reg-6", eventId: 2, userId: "demo-student-farah", userName: "Farah Zainal", userEmail: "farah.demo@example.edu" },
  { id: "demo-reg-7", eventId: 2, userId: "demo-student-irfan", userName: "Irfan Rosli", userEmail: "irfan.demo@example.edu" },
  { id: "demo-reg-8", eventId: 3, userId: "demo-student-amina", userName: "Amina Yusuf", userEmail: "amina.demo@example.edu" },
  { id: "demo-reg-9", eventId: 3, userId: "demo-student-haziq", userName: "Haziq Ismail", userEmail: "haziq.demo@example.edu" },
  { id: "demo-reg-10", eventId: 3, userId: "demo-student-sara", userName: "Sara Lee", userEmail: "sara.demo@example.edu" },
  { id: "demo-reg-11", eventId: 4, userId: "demo-student-jason", userName: "Jason Lim", userEmail: "jason.demo@example.edu" },
  { id: "demo-reg-12", eventId: 4, userId: "demo-student-nurul", userName: "Nurul Iman", userEmail: "nurul.demo@example.edu" },
  { id: "demo-reg-13", eventId: 5, userId: "demo-student-kavitha", userName: "Kavitha Raj", userEmail: "kavitha.demo@example.edu" },
  { id: "demo-reg-14", eventId: 5, userId: "demo-student-ethan", userName: "Ethan Wong", userEmail: "ethan.demo@example.edu" },
  { id: "demo-reg-15", eventId: 5, userId: "demo-student-zara", userName: "Zara Abdullah", userEmail: "zara.demo@example.edu" }
];

function seedData() {
  if (!localStorage.getItem(KEYS.events)) save(KEYS.events, seedEvents);
  if (!localStorage.getItem(KEYS.users)) save(KEYS.users, seedUsers);
  if (!localStorage.getItem(KEYS.regs)) save(KEYS.regs, []);
  if (!localStorage.getItem(KEYS.demoRegsSeeded)) {
    const regs = getRegs();
    const existingIds = new Set(regs.map(reg => reg.id));
    const eventIds = new Set(getEvents().map(event => event.id));
    save(KEYS.regs, [...regs, ...demoRegistrations.filter(reg => eventIds.has(reg.eventId) && !existingIds.has(reg.id))]);
    localStorage.setItem(KEYS.demoRegsSeeded, "true");
  }
}

/* ---------- 3. AUTH / SESSION ---------- */
const getUsers = () => load(KEYS.users, []);
const getSession = () => load(KEYS.session, null);

function login(email, password) {
  const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return null;
  save(KEYS.session, { id: user.id, name: user.name, email: user.email, role: user.role });
  return user;
}
function logout() {
  localStorage.removeItem(KEYS.session);
  window.location.href = "login.html";
}
function registerUser(name, email, password) {
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, message: "That email is already registered." };
  }
  users.push({ id: Date.now(), name, email, password, role: "student" });
  save(KEYS.users, users);
  return { ok: true };
}
function requireRole(role) {
  const s = getSession();
  if (!s || (role && s.role !== role)) {
    window.location.href = "login.html";
    return null;
  }
  return s;
}

/* ---------- 4. EVENT HELPERS ---------- */
const getEvents = () => load(KEYS.events, []);
const getRegs = () => load(KEYS.regs, []);
const regsForEvent = id => getRegs().filter(r => r.eventId === id);
const seatsLeft = ev => Math.max(0, ev.capacity - regsForEvent(ev.id).length);
const isRegistered = (eventId, userId) => getRegs().some(r => r.eventId === eventId && r.userId === userId);

function registerForEvent(eventId) {
  const s = getSession();
  if (!s) { window.location.href = "login.html"; return; }
  if (s.role !== "student") { alert("Only student accounts can register."); return; }
  const ev = getEvents().find(e => e.id === eventId);
  if (!ev) return;
  if (isRegistered(eventId, s.id)) { alert("You are already registered. Thank you for your interest."); return; }
  if (seatsLeft(ev) === 0) { alert("Sorry, this event is full. You can try again next time."); return; }
  const regs = getRegs();
  regs.push({ id: Date.now(), eventId, userId: s.id, userName: s.name, userEmail: s.email });
  save(KEYS.regs, regs);
}
function cancelRegistration(eventId) {
  const s = getSession();
  if (!s) return;
  save(KEYS.regs, getRegs().filter(r => !(r.eventId === eventId && r.userId === s.id)));
}
function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function isSupportedEventImage(source) {
  return /^https?:\/\/\S+$/i.test(source) ||
    /^images\/(?:[A-Za-z0-9_-][A-Za-z0-9._ -]*\/)*[A-Za-z0-9_-][A-Za-z0-9._ -]*\.(?:avif|gif|jpe?g|png|webp)$/i.test(source);
}

/* ---------- 5. RENDERING ---------- */
function eventCard(ev, mode) {
  const s = getSession();
  const left = seatsLeft(ev);
  const image = isSupportedEventImage(ev.image || "") ? ev.image : "";
  let action = "";
  if (mode === "mine") {
    action = `<button class="btn btn-outline btn-small" data-cancel="${ev.id}">Cancel registration</button>`;
  } else if (s && isRegistered(ev.id, s.id)) {
    action = `<button class="btn btn-outline btn-small" disabled>Registered</button>`;
  } else if (left === 0) {
    action = `<button class="btn btn-outline btn-small" disabled>Full</button>`;
  } else {
    action = `<button class="btn btn-small" data-register="${ev.id}">Register</button>`;
  }
  return `<article class="event-card">
    <div class="event-image-wrap">
      <div class="event-image-placeholder" aria-hidden="true">🏆</div>
      ${image ? `<img class="event-image" src="${escapeHtml(image)}" alt="Photo for ${escapeHtml(ev.title)}" loading="lazy" onerror="this.hidden=true">` : ""}
    </div>
    <span class="tag">${escapeHtml(ev.category)}</span>
    <h3>${escapeHtml(ev.title)}</h3>
    <p class="muted">${escapeHtml(ev.description)}</p>
    <ul class="event-meta">
      <li>📅 ${formatDate(ev.date)} at ${escapeHtml(ev.time)}</li>
      <li>📍 ${escapeHtml(ev.venue)}</li>
      <li>👥 ${regsForEvent(ev.id).length} students joined</li>
      <li>🎟️ ${left} of ${ev.capacity} seats left</li>
    </ul>
    ${action}
  </article>`;
}
function renderList(container, events, mode, emptyText) {
  if (!container) return;
  container.innerHTML = events.length
    ? events.map(e => eventCard(e, mode)).join("")
    : `<p class="empty">${emptyText}</p>`;
}
function bindCardButtons(refresh) {
  document.addEventListener("click", e => {
    const reg = e.target.closest("[data-register]");
    const can = e.target.closest("[data-cancel]");
    if (reg) { registerForEvent(Number(reg.dataset.register)); refresh(); }
    if (can) {
      if (confirm("Cancel this registration?")) { cancelRegistration(Number(can.dataset.cancel)); refresh(); }
    }
  });
}

/* ---------- 6. PAGE CONTROLLERS ---------- */
function initHome() {
  const box = document.getElementById("featured-events");
  if (!box) return;
  const draw = () => renderList(box, getEvents().slice(0, 3), "all", "No events yet.");
  draw(); bindCardButtons(draw);
}

function initEvents() {
  const box = document.getElementById("all-events");
  if (!box) return;
  const search = document.getElementById("event-search");
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    const list = getEvents().filter(ev =>
      ev.category === "Sports" &&
      (ev.title + ev.description + ev.venue).toLowerCase().includes(q));
    renderList(box, list, "all", "No events match your search.");
  };
  search.addEventListener("input", draw);
  draw(); bindCardButtons(draw);
}

function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const msg = document.getElementById("form-message");
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value;
    const user = login(email, password);
    if (!user) { msg.textContent = "Wrong email or password."; msg.className = "form-message error"; return; }
    window.location.href = user.role === "admin" ? "admin-dashboard.html" : "student-dashboard.html";
  });
}

function initRegister() {
  const form = document.getElementById("register-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const msg = document.getElementById("form-message");
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value;
    const res = registerUser(name, email, password);
    if (!res.ok) { msg.textContent = res.message; msg.className = "form-message error"; return; }
    msg.textContent = "Account created. Redirecting to login...";
    msg.className = "form-message success";
    setTimeout(() => (window.location.href = "login.html"), 1200);
  });
}

function initStudentDashboard() {
  const box = document.getElementById("my-events");
  if (!box) return;
  const s = requireRole("student");
  if (!s) return;
  const chartCanvas = document.getElementById("student-category-chart");
  const chartMessage = document.getElementById("student-chart-message");
  let categoryChart = null;
  document.getElementById("welcome-name").textContent = `Welcome back, ${s.name}!`;

  function drawCategoryChart(events) {
    if (!chartCanvas) return;
    if (!events.length) {
      chartCanvas.parentElement.hidden = true;
      chartMessage.textContent = "Register for a sport event to see your breakdown.";
      return;
    }
    if (!window.Chart) {
      chartCanvas.parentElement.hidden = true;
      chartMessage.textContent = "Your sport event chart could not be loaded.";
      return;
    }
    chartCanvas.parentElement.hidden = false;
    chartMessage.textContent = "";
    const counts = events.reduce((t, ev) => { t[ev.title] = (t[ev.title] || 0) + 1; return t; }, {});
    const data = {
      labels: Object.keys(counts),
      datasets: [{ data: Object.values(counts), backgroundColor: ["#5b3df5", "#ff6b8b", "#2bb3a3", "#f0a43c", "#5887e8"] }]
    };
    if (categoryChart) { categoryChart.data = data; categoryChart.update(); return; }
    categoryChart = new Chart(chartCanvas, {
      type: "doughnut", data,
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
    });
  }

  const draw = () => {
    const mineIds = getRegs().filter(r => r.userId === s.id).map(r => r.eventId);
    const mine = getEvents().filter(ev => mineIds.includes(ev.id));
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById("my-count").textContent = mine.length;
    document.getElementById("upcoming-count").textContent = mine.filter(ev => ev.date >= today).length;
    drawCategoryChart(mine);
    renderList(box, mine, "mine", "You have not registered for any events yet. Find one to join.");
  };
  draw(); bindCardButtons(draw);
}

function initAdminDashboard() {
  const list = document.getElementById("admin-events");
  if (!list) return;
  if (!requireRole("admin")) return;
  const form = document.getElementById("event-form");
  const msg = document.getElementById("admin-message");
  const title = document.getElementById("event-form-title");
  const chartCanvas = document.getElementById("registration-chart");
  const chartMessage = document.getElementById("chart-message");
  const categoryCanvas = document.getElementById("admin-category-chart");
  const categoryMessage = document.getElementById("admin-category-chart-message");
  const capacityCanvas = document.getElementById("capacity-chart");
  const capacityMessage = document.getElementById("capacity-chart-message");
  let registrationChart = null, categoryRegistrationChart = null, capacityChart = null;

  function drawRegistrationChart(events) {
    if (!chartCanvas) return;
    if (!window.Chart) { chartMessage.textContent = "Chart could not be loaded."; return; }
    const data = {
      labels: events.map(ev => ev.title),
      datasets: [{ label: "Registrations", data: events.map(ev => regsForEvent(ev.id).length), backgroundColor: "rgba(91, 61, 245, 0.75)", borderColor: "#5b3df5", borderWidth: 1, borderRadius: 6 }]
    };
    if (registrationChart) { registrationChart.data = data; registrationChart.update(); return; }
    registrationChart = new Chart(chartCanvas, {
      type: "bar", data,
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { ticks: { autoSkip: false } } } }
    });
  }

  function drawCategoryRegistrationChart(events) {
    if (!categoryCanvas) return;
    const counts = events.reduce((c, ev) => { c[ev.title] = (c[ev.title] || 0) + regsForEvent(ev.id).length; return c; }, {});
    const titles = Object.keys(counts).filter(t => counts[t] > 0);
    if (!titles.length) { categoryCanvas.parentElement.hidden = true; categoryMessage.textContent = "Event totals will appear after students register."; return; }
    if (!window.Chart) { categoryCanvas.parentElement.hidden = true; categoryMessage.textContent = "Chart could not be loaded."; return; }
    categoryCanvas.parentElement.hidden = false;
    categoryMessage.textContent = "";
    const data = {
      labels: titles,
      datasets: [{ label: "Registrations", data: titles.map(t => counts[t]), backgroundColor: ["#5b3df5", "#ff6b8b", "#2bb3a3", "#f0a43c", "#5887e8"] }]
    };
    if (categoryRegistrationChart) { categoryRegistrationChart.data = data; categoryRegistrationChart.update(); return; }
    categoryRegistrationChart = new Chart(categoryCanvas, {
      type: "doughnut", data,
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
    });
  }

  function drawCapacityChart(events) {
    if (!capacityCanvas) return;
    if (!events.length) { capacityCanvas.parentElement.hidden = true; return; }
    if (!window.Chart) { capacityCanvas.parentElement.hidden = true; return; }
    capacityCanvas.parentElement.hidden = false;
    const data = {
      labels: events.map(ev => ev.title),
      datasets: [
        { label: "Registered", data: events.map(ev => regsForEvent(ev.id).length), backgroundColor: "#5b3df5" },
        { label: "Available seats", data: events.map(ev => seatsLeft(ev)), backgroundColor: "#d8d1ff" }
      ]
    };
    if (capacityChart) { capacityChart.data = data; capacityChart.update(); return; }
    capacityChart = new Chart(capacityCanvas, {
      type: "bar", data,
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, ticks: { autoSkip: false } }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } } }
    });
  }

  function draw() {
    const events = getEvents();
    const regs = getRegs();
    drawRegistrationChart(events);
    drawCategoryRegistrationChart(events);
    drawCapacityChart(events);
    document.getElementById("admin-event-count").textContent = events.length;
    document.getElementById("admin-reg-count").textContent = regs.length;
    document.getElementById("admin-seat-count").textContent = events.reduce((n, ev) => n + seatsLeft(ev), 0);

    list.innerHTML = events.map(ev => `<div class="admin-event">
        <div><b>${escapeHtml(ev.title)}</b><small class="muted">${formatDate(ev.date)} · ${escapeHtml(ev.venue)}</small></div>
        <div class="admin-actions">
          <button class="btn btn-outline btn-small" data-edit="${ev.id}">Edit</button>
          <button class="btn btn-danger btn-small" data-delete="${ev.id}">Delete</button>
        </div></div>`).join("") || `<p class="empty">No events yet.</p>`;

    document.getElementById("participant-overview").innerHTML = events.map(ev => {
      const people = regsForEvent(ev.id);
      return `<div class="participant-group"><h3>${escapeHtml(ev.title)} <span class="tag">${people.length}/${ev.capacity}</span></h3>` +
        (people.length ? `<ul>${people.map(p => `<li>${escapeHtml(p.userName)} <small class="muted">${escapeHtml(p.userEmail)}</small></li>`).join("")}</ul>` : `<p class="muted">No registrations yet.</p>`) + `</div>`;
    }).join("");
  }

  function resetForm() {
    form.reset(); form.id.value = ""; form.capacity.value = 50;
    title.textContent = "Add a new event";
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const events = getEvents();
    const image = form.image.value.trim();
    if (image && !isSupportedEventImage(image)) {
      msg.textContent = "Enter an http(s) image URL or a file path under images/.";
      msg.className = "form-message error";
      return;
    }
    const data = {
      title: form.title.value.trim(), category: "Sports", date: form.date.value,
      time: form.time.value, capacity: Number(form.capacity.value),
      venue: form.venue.value.trim(), description: form.description.value.trim(), image
    };
    const editingId = Number(form.elements["id"].value);
    if (editingId) {
      const i = events.findIndex(ev => ev.id === editingId);
      events[i] = { ...events[i], ...data };
    } else {
      events.push({ id: Date.now(), ...data });
    }
    save(KEYS.events, events);
    msg.textContent = "Event saved."; msg.className = "form-message success";
    resetForm(); draw();
  });
  document.getElementById("reset-event").addEventListener("click", () => setTimeout(resetForm, 0));

  list.addEventListener("click", e => {
    const edit = e.target.closest("[data-edit]");
    const del = e.target.closest("[data-delete]");
    if (edit) {
      const ev = getEvents().find(x => x.id === Number(edit.dataset.edit));
      form.elements["id"].value = ev.id;
      ["title", "category", "date", "time", "capacity", "venue", "description", "image"].forEach(k => (form.elements[k].value = ev[k] || ""));
      title.textContent = "Edit event";
      form.scrollIntoView({ behavior: "smooth" });
    }
    if (del && confirm("Delete this event and its registrations?")) {
      const id = Number(del.dataset.delete);
      save(KEYS.events, getEvents().filter(ev => ev.id !== id));
      save(KEYS.regs, getRegs().filter(r => r.eventId !== id));
      draw();
    }
  });
  draw();
}

/* ---------- 7. START-UP ---------- */
document.addEventListener("DOMContentLoaded", () => {
  seedData();
  document.querySelectorAll("[data-logout]").forEach(b => b.addEventListener("click", logout));
  initHome(); initEvents(); initLogin(); initRegister();
  initStudentDashboard(); initAdminDashboard();
});
