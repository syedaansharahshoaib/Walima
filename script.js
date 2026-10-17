/* =====================================================
   EDIT YOUR DETAILS HERE
   ===================================================== */
const INVITE = {
  bride: "Syeda Ansharah Shoaib",
  groom: "Hamza Shakeel",
  hosts: "Abdul Shakeel\nand Family",
  dateISO: "2026-11-16T19:00:00",
  dateText: "Monday, 16th November 2026",
  timeText: "8:00 PM onwards",
  venue: "Al-Zubair Banquet",
  address: "SB-41-42, Sector 5-D, Surjani Town, Karachi.",
  mapLink: "https://maps.app.goo.gl/igiM2BtvaBqHCDPg9?g_st=aw",
  rsvpNote: "Kindly confirm your presence so we can host you well",
  rsvpWhatsApp: "923000000000",
  schedule: [
    { t: "8:00 PM", h: "Guest Arrival", p: "Welcome drinks and warm greetings." },
    { t: "9:00 PM", h: "Couple's Entry", p: "The newlyweds join the celebration." },
    { t: "10:00 PM", h: "Dinner", p: "A lavish spread to delight everyone." },
    { t: "11:30 PM", h: "Dua & Farewell", p: "Prayers and photographs with the couple." }
  ]
};

const $ = id => document.getElementById(id);
const initial = value => (value.trim()[0] || "?").toUpperCase();
$("intro-g").textContent = initial(INVITE.groom);
$("intro-b").textContent = initial(INVITE.bride);
$("n-groom").textContent = INVITE.groom;
$("n-bride").textContent = INVITE.bride;
$("date-line").textContent = INVITE.dateText;
$("d-date").textContent = INVITE.dateText;
$("d-time").textContent = INVITE.timeText;
$("d-venue").textContent = INVITE.venue;
$("d-address").textContent = INVITE.address;
// Map embed — build iframe src from venue+address, link goes to original mapLink
(function(){
  const wrap = document.getElementById("map-wrap");
  const frame = document.getElementById("map-frame");
  if (!wrap || !frame) return;
  const q = encodeURIComponent(INVITE.venue + " " + INVITE.address);
  frame.src = "https://maps.google.com/maps?q=" + q + "&output=embed&z=16";
  wrap.href = INVITE.mapLink;
})();
$("hosts").textContent = INVITE.hosts;
$("rsvp-note").textContent = INVITE.rsvpNote;
$("foot-names").textContent = `${INVITE.groom} & ${INVITE.bride}`;
$("flow").innerHTML = INVITE.schedule
  .map(e => `<div class="step"><time>${e.t}</time><h5>${e.h}</h5><p>${e.p}</p></div>`).join("");

/* ---------- shared envelope opening ---------- */
const envelope = $("envelope");
function openInvite() {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  $("card").classList.remove("hidden");
  for (let i = 0; i < 160; i++) addSpark(innerWidth / 2, innerHeight / 2, true);
  setTimeout(() => {
    $("intro").classList.add("gone");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    const audio = new Audio("assets/walima.mp3");
    audio.loop = true;
    audio.volume = 0.7;
    audio.play().catch(() => {});
    reveal();
  }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 2550);
}
envelope.addEventListener("click", openInvite);

/* ---------- reveal ---------- */
function reveal() {
  const els = document.querySelectorAll(".reveal,.step");
  els.forEach((el, i) => el.style.setProperty("--d", (i % 4) * .13 + "s"));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .2 });
  els.forEach(el => io.observe(el));
}

/* ---------- countdown ---------- */
const target = new Date(INVITE.dateISO).getTime();
const cd = { d: $("c-d"), h: $("c-h"), m: $("c-m"), s: $("c-s") };
function tick() {
  const diff = Math.max(0, target - Date.now());
  const v = { d: Math.floor(diff / 864e5), h: Math.floor(diff % 864e5 / 36e5), m: Math.floor(diff % 36e5 / 6e4), s: Math.floor(diff % 6e4 / 1e3) };
  for (const k in v) {
    const t = String(v[k]).padStart(2, "0");
    if (cd[k].textContent !== t) {
      cd[k].textContent = t;
      cd[k].classList.remove("tick"); void cd[k].offsetWidth; cd[k].classList.add("tick");
    }
  }
}
tick(); setInterval(tick, 1000);

/* ---------- gold & silver sparkle dust ---------- */
const cv = $("sparkle"), ctx = cv.getContext("2d");
let W, H, sparks = [];
function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
resize(); addEventListener("resize", resize);
const COLS = ["#f3dfa2", "#c9a24b", "#ffffff", "#dfe3ea", "#a9afb8", "#fff3c4"];
function addSpark(x, y, burst) {
  const a = Math.random() * 6.283, sp = burst ? 2 + Math.random() * 7 : 0;
  sparks.push({
    x, y, vx: burst ? Math.cos(a) * sp : (Math.random() - .5) * .3,
    vy: burst ? Math.sin(a) * sp : .25 + Math.random() * .6,
    r: 1 + Math.random() * 3, c: COLS[(Math.random() * COLS.length) | 0],
    life: burst ? 90 + Math.random() * 50 : Infinity, tw: Math.random() * 6.28, burst
  });
}
for (let i = 0; i < 70; i++) addSpark(Math.random() * innerWidth, Math.random() * innerHeight, false);
function star(x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 ? r * .25 : r;
    const a = i * Math.PI / 4;
    ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath(); ctx.fill();
}
function loop() {
  ctx.clearRect(0, 0, W, H);
  sparks.forEach(p => {
    p.tw += .06; p.x += p.vx; p.y += p.vy;
    if (p.burst) { p.vx *= .97; p.vy = p.vy * .97 + .05; p.life--; }
    else if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
    ctx.globalAlpha = p.burst ? Math.max(0, p.life / 70) : .35 + .55 * Math.abs(Math.sin(p.tw));
    ctx.fillStyle = p.c;
    ctx.shadowColor = p.c; ctx.shadowBlur = 8;
    star(p.x, p.y, p.r * (p.burst ? 1.6 : 1.8));
  });
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  sparks = sparks.filter(p => p.life > 0);
  requestAnimationFrame(loop);
}
loop();

/* sparkle trail on pointer move */
let last = 0;
addEventListener("pointermove", e => {
  const now = performance.now();
  if (now - last < 40) return;
  last = now;
  for (let i = 0; i < 2; i++) {
    sparks.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - .5) * 1.5, vy: (Math.random() - .5) * 1.5,
      r: 1 + Math.random() * 2, c: COLS[(Math.random() * COLS.length) | 0], life: 40, tw: 0, burst: true });
  }
});
