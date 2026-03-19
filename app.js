// --- ERROR HANDLING (At the very top) ---
window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global error:", message, "at", source, lineno, ":", colno);
    if (document.body && (document.body.innerHTML.trim() === "" || !document.getElementById("login-screen"))) {
        document.body.innerHTML = `<div style="color: red; padding: 20px; text-align: center; font-family: sans-serif; background: #fff; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h3>Hata Oluştu / Error Ocurred ✨</h3>
            <p>${message}</p>
            <p>Lütfen sayfayı yenileyin. / Por favor, recarga la página.</p>
        </div>`;
    }
};

// --- DATA (Imported from separate files) ---
import { messages } from './messages.js';
import { vaults } from './vaults.js';

console.log("App starting...");

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = "https://keghnzprzywaszfxludu.supabase.co"; 
const supabaseKey = "sb_publishable_WvNvlJRpO0w2tAIXGXuOmA_Kkwqc_4f";

let supabase;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log("Supabase initialized.");
    } else {
        console.error("Supabase SDK missing.");
    }
} catch (e) { console.error("Supabase init error:", e); }

const myApiKey = "2e2dcf335d4c97a7c182b0c041eea672";
const startDate = new Date(2025, 11, 27, 10, 45, 0); // Month is 0-indexed, so 11 is December
const photos = ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg", "foto6.jpg", "foto7.jpg", "foto8.jpg", "foto9.jpg", "foto10.jpg"];
let currentIdx = 0;
let currentUser = null;

// OYUN DEĞİŞKENLERİ
let board = Array(25).fill("");
let turn = "Anıl"; 
let scores = { "Anıl": 0, "Camila": 0 };
let weeklyScores = { "Anıl": 0, "Camila": 0 };
let dailyScores = { "Anıl": 0, "Camila": 0 };
let lastResetWeek = ""; 
let lastResetDay = "";
let resetCountdownStart = null; 
const WIN_COUNT = 3; 
const GRID_SIZE = 5; 
const RESET_THRESHOLD = 0.7;
const RESET_DELAY_MS = 4 * 60 * 60 * 1000;

// --- FUNCTIONS ---

function login(user) {
    try {
        console.log("Login session for:", user);
        currentUser = user;
        localStorage.setItem("nosotros_user", user);
        
        const loginScreen = document.getElementById("login-screen");
        const mainPage = document.getElementById("main-page");
        
        if (loginScreen) loginScreen.classList.remove("active");
        if (mainPage) mainPage.classList.add("active");
        
        startSupabaseListeners();
        checkDailyReset();
        updateSelfieUI();
    } catch (e) {
        console.error("Login function failed:", e);
    }
}
window.login = login;

function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(p => {
            if (p === "granted") document.getElementById("enable-notifications").style.display = "none";
        });
    }
}
window.requestNotificationPermission = requestNotificationPermission;

async function startSupabaseListeners() {
    if (!supabase) return;
    try {
        const { data: initialGame } = await supabase.from('game_state').select('*').eq('id', 1).maybeSingle();
        if (initialGame) {
            board = initialGame.board || Array(25).fill("");
            turn = initialGame.turn || "Anıl";
            scores = initialGame.scores || { "Anıl": 0, "Camila": 0 };
            weeklyScores = initialGame.weekly_scores || { "Anıl": 0, "Camila": 0 };
            dailyScores = initialGame.daily_scores || { "Anıl": 0, "Camila": 0 };
            lastResetWeek = initialGame.last_reset_week;
            lastResetDay = initialGame.last_reset_day;
            resetCountdownStart = initialGame.reset_countdown_start ? new Date(initialGame.reset_countdown_start) : null;

            const currentWeek = getISOWeek();
            const todayStr = new Date().toLocaleDateString("en-US", {timeZone: "America/Bogota"}).replace(/\//g, "-");
            let needsSave = false;
            if (lastResetWeek !== currentWeek) { lastResetWeek = currentWeek; weeklyScores = { "Anıl": 0, "Camila": 0 }; needsSave = true; }
            if (lastResetDay !== todayStr) { lastResetDay = todayStr; dailyScores = { "Anıl": 0, "Camila": 0 }; needsSave = true; }
            if (board.length !== 25) { board = Array(25).fill(""); needsSave = true; }
            if (needsSave) saveGameState();
            updateGameUI();
        } else {
            board = Array(25).fill("");
            lastResetWeek = getISOWeek();
            lastResetDay = new Date().toLocaleDateString("en-US", {timeZone: "America/Bogota"}).replace(/\//g, "-");
            await supabase.from('game_state').insert([{ id: 1, board, turn, scores, weekly_scores: weeklyScores, daily_scores: dailyScores, last_reset_week: lastResetWeek, last_reset_day: lastResetDay }]);
        }

        supabase.channel('game_state_changes').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state', filter: 'id=eq.1' }, payload => {
            const data = payload.new;
            const oldTurn = turn;
            board = data.board; turn = data.turn; scores = data.scores;
            weeklyScores = data.weekly_scores || { "Anıl": 0, "Camila": 0 };
            dailyScores = data.daily_scores || { "Anıl": 0, "Camila": 0 };
            lastResetWeek = data.last_reset_week; lastResetDay = data.last_reset_day;
            resetCountdownStart = data.reset_countdown_start ? new Date(data.reset_countdown_start) : null;
            updateGameUI();
            if (turn === currentUser && oldTurn !== currentUser) sendTurnNotification();
        }).subscribe();

        const todayStr = new Date().toLocaleDateString("en-US", {timeZone: "America/Bogota"}).replace(/\//g, "-");
        const { data: initialSelfie } = await supabase.from('selfies').select('*').eq('day', todayStr).maybeSingle();
        if (initialSelfie) {
            if (initialSelfie.anil) localStorage.setItem("nosotros_anil_photo", initialSelfie.anil);
            if (initialSelfie.camila) localStorage.setItem("nosotros_camila_photo", initialSelfie.camila);
            updateSelfieUI();
        }

        supabase.channel('selfies_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'selfies', filter: `day=eq.${todayStr}` }, payload => {
            const data = payload.new;
            if (data.anil) localStorage.setItem("nosotros_anil_photo", data.anil);
            if (data.camila) localStorage.setItem("nosotros_camila_photo", data.camila);
            updateSelfieUI();
        }).subscribe();
    } catch (e) { console.error("Supabase error:", e); }
}

function goToUniverse() { 
    document.getElementById("main-page").classList.remove("active"); 
    document.getElementById("star-map-page").classList.add("active"); 
    initUniverse(); 
}
window.goToUniverse = goToUniverse;

function goToHome() { 
    document.getElementById("star-map-page").classList.remove("active"); 
    document.getElementById("main-page").classList.add("active"); 
}
window.goToHome = goToHome;

function openSelfie() {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("selfie-page").classList.add("active");
    updateSelfieUI();
}
window.openSelfie = openSelfie;

function closeSelfie() {
    document.getElementById("selfie-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
}
window.closeSelfie = closeSelfie;

function openGame() {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("game-page").classList.add("active");
    updateGameUI();
}
window.openGame = openGame;

function closeGame() {
    document.getElementById("game-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
}
window.closeGame = closeGame;

function saveGameState() {
    if (supabase) {
        supabase.from('game_state').update({
            board, turn, scores, weekly_scores: weeklyScores, daily_scores: dailyScores,
            last_reset_week: lastResetWeek, last_reset_day: lastResetDay,
            reset_countdown_start: resetCountdownStart ? resetCountdownStart.toISOString() : null
        }).eq('id', 1).then();
    }
}

function makeMove(index) {
    if (board[index] !== "" || turn !== currentUser) return;
    
    const symbol = (turn === "Anıl" ? "X" : "O");
    const oldWinningPatterns = getAllWinningPatterns();
    
    board[index] = symbol;
    
    const newWinningPatterns = getAllWinningPatterns();
    // Yeni oluşan kazanç setlerini bulalım (daha önce listede olmayanlar)
    const newlyCreatedWins = newWinningPatterns.filter(p => 
        !oldWinningPatterns.some(oldP => oldP.every(val => p.includes(val)))
    );

    if (newlyCreatedWins.length > 0) {
        // Her yeni 3'lü için puan verelim
        const points = newlyCreatedWins.length;
        scores[turn] += points;
        weeklyScores[turn] += points;
        dailyScores[turn] += points;
        console.log(`${turn} kazandı! +${points} puan.`);
    }

    if (board.filter(c => c !== "").length >= 25 * RESET_THRESHOLD && !resetCountdownStart) {
        resetCountdownStart = new Date();
    }
    
    turn = (turn === "Anıl" ? "Camila" : "Anıl");
    saveGameState();
    updateGameUI();
}

function getAllWinningPatterns() {
    const patterns = [];
    const directions = [
        { dr: 0, dc: 1 }, // Yatay
        { dr: 1, dc: 0 }, // Dikey
        { dr: 1, dc: 1 }, // Çapraz 1
        { dr: 1, dc: -1 } // Çapraz 2
    ];

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const symbol = board[r * 5 + c];
            if (!symbol) continue;

            for (const { dr, dc } of directions) {
                const pattern = [r * 5 + c];
                let match = true;
                for (let step = 1; step < 3; step++) {
                    const nr = r + dr * step;
                    const nc = c + dc * step;
                    if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5 || board[nr * 5 + nc] !== symbol) {
                        match = false;
                        break;
                    }
                    pattern.push(nr * 5 + nc);
                }
                if (match) {
                    patterns.push(pattern.sort((a, b) => a - b));
                }
            }
        }
    }
    // Tekrar eden pattern'ları temizleyelim
    return patterns.filter((p, index, self) =>
        index === self.findIndex((t) => t.join(',') === p.join(','))
    );
}

function updateGameUI() {
    const cells = document.querySelectorAll(".cell");
    const winningPatterns = getAllWinningPatterns();
    const winningCells = new Set(winningPatterns.flat());
    
    const notifyBtn = document.getElementById("enable-notifications");
    if (notifyBtn) notifyBtn.style.display = ("Notification" in window && Notification.permission === "default") ? "inline-block" : "none";

    const timerEl = document.getElementById("reset-timer");
    const countdownEl = document.getElementById("timer-countdown");
    if (resetCountdownStart) {
        const timeLeft = RESET_DELAY_MS - (new Date() - resetCountdownStart);
        if (timeLeft > 0) {
            if (timerEl) timerEl.style.display = "block";
            const hours = Math.floor(timeLeft / 3600000);
            const mins = Math.floor((timeLeft % 3600000) / 60000);
            if (countdownEl) countdownEl.innerText = `${hours}h ${mins}m`;
        } else { 
            if (currentUser === "Anıl") resetBoard(false); 
        }
    } else if (timerEl) timerEl.style.display = "none";

    cells.forEach((cell, i) => {
        cell.innerText = board[i];
        cell.className = "cell" + (board[i] ? " taken" : "") + (winningCells.has(i) ? " winner" : "");
    });

    const turnEl = document.getElementById("game-turn");
    if (turnEl) {
        if (board.every(c => c !== "")) turnEl.innerText = "¡Tablero Lleno! 🤝";
        else turnEl.innerText = (turn === currentUser) ? "¡Es tu turno! ✨" : `Turno de ${turn} ⏳`;
    }

    const dsEl = document.getElementById("daily-score"), wsEl = document.getElementById("weekly-score"), tsEl = document.getElementById("total-score");
    if (dsEl) dsEl.innerText = `Anıl: ${dailyScores["Anıl"]} - Camila: ${dailyScores["Camila"]}`;
    if (wsEl) wsEl.innerText = `Anıl: ${weeklyScores["Anıl"]} - Camila: ${weeklyScores["Camila"]}`;
    if (tsEl) tsEl.innerText = `Anıl: ${scores["Anıl"]} - Camila: ${scores["Camila"]}`;
}

function getISOWeek() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return `${d.getUTCFullYear()}-W${Math.ceil((((d - yearStart) / 86400000) + 1) / 7)}`;
}

function sendTurnNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("¡Tu turno! 🎮", { body: `Es tu momento de jugar con ${currentUser === "Anıl" ? "Camila" : "Anıl"}`, icon: "foto1.jpg", tag: "turn-notification" });
    }
}

function testNotification() {
    if ("Notification" in window) {
        Notification.requestPermission().then(p => {
            if (p === "granted") new Notification("¡Prueba de Éxito! ✅", { body: "Las notificaciones están configuradas.", icon: "foto1.jpg" });
            else alert("Permite las notificaciones.");
        });
    }
}
window.testNotification = testNotification;

function resetBoard(resetScores = false) {
    board = Array(25).fill(""); 
    resetCountdownStart = null;
    if (resetScores) { 
        scores = { "Anıl": 0, "Camila": 0 }; 
        weeklyScores = { "Anıl": 0, "Camila": 0 }; 
        dailyScores = { "Anıl": 0, "Camila": 0 }; 
    }
    saveGameState(); 
    updateGameUI();
}
window.resetBoard = resetBoard;

document.addEventListener("DOMContentLoaded", () => {
    const boardEl = document.getElementById("game-board");
    if (boardEl) boardEl.addEventListener("click", (e) => { if (e.target.classList.contains("cell")) makeMove(parseInt(e.target.dataset.index)); });
});

document.addEventListener('mousemove', (e) => createSparkle(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => createSparkle(e.touches[0].clientX, e.touches[0].clientY));

function createSparkle(x, y) {
    const s = document.createElement("div"); s.className = "sparkle"; s.style.left = x + "px"; s.style.top = y + "px";
    document.body.appendChild(s); setTimeout(() => s.remove(), 700);
}

function createFloatingHeart() {
    const heart = document.createElement("div"); heart.innerHTML = "❤️"; heart.className = "floating-heart";
    heart.style.left = Math.random() * 100 + "vw"; heart.style.fontSize = (Math.random() * 20 + 10) + "px";
    heart.style.animationDuration = (Math.random() * 2 + 3) + "s";
    document.body.appendChild(heart); setTimeout(() => heart.remove(), 4000);
}

async function fetchWeather() {
    try {
        const rMilan = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Milan,it&units=metric&appid=${myApiKey}`);
        const dMilan = await rMilan.json();
        const rBogota = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bogota,co&units=metric&appid=${myApiKey}`);
        const dBogota = await rBogota.json();
        if(dMilan.main) document.getElementById("milan-temp").innerText = `${Math.round(dMilan.main.temp)}°C ${getWEmoji(dMilan.weather[0].main)}`;
        if(dBogota.main) document.getElementById("bogota-temp").innerText = `${Math.round(dBogota.main.temp)}°C ${getWEmoji(dBogota.weather[0].main)}`;
    } catch(e) {}
}

function getWEmoji(s) { return {"Clear":"☀️","Clouds":"☁️","Rain":"🌧️","Snow":"❄️","Drizzle":"🌦️"}[s] || "✨"; }

function initUniverse() {
    const starContainer = document.getElementById("stars-container");
    const vaultContainer = document.getElementById("vault-container");
    if (!vaultContainer || vaultContainer.children.length > 0) return;
    for (let i = 0; i < 80; i++) {
        const s = document.createElement("div"); s.className = "star";
        s.style.left = Math.random() * 100 + "vw"; s.style.top = Math.random() * 100 + "vh";
        s.style.width = "2px"; s.style.height = "2px"; s.style.position = "absolute"; s.style.background = "white"; s.style.borderRadius = "50%";
        s.style.setProperty('--d', (Math.random() * 3 + 2) + "s");
        if (starContainer) starContainer.appendChild(s);
    }
    vaults.forEach((v, index) => {
        const div = document.createElement("div"); div.className = `chest ${v.b ? 'birthday' : ''}`;
        const ratio = index / (vaults.length - 1);
        div.style.top = (20 + (ratio * 58)) + "%"; div.style.left = (82 - (ratio * 64) + (Math.sin(ratio * Math.PI) * 15)) + "%";
        div.onclick = (e) => { e.stopPropagation(); if (new Date() < new Date(v.d)) alert(v.b ? v.lock : "Se abrirá el: " + v.d); else alert(v.t); };
        vaultContainer.appendChild(div);
    });
}

function update() {
    try {
        const now = new Date();
        const milan = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
        const bogota = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
        
        if (milan.toString() !== "Invalid Date" && document.getElementById("milan-time")) {
            document.getElementById("milan-time").innerText = milan.getHours() + ":" + String(milan.getMinutes()).padStart(2, '0');
        }
        if (bogota.toString() !== "Invalid Date" && document.getElementById("bogota-time")) {
            document.getElementById("bogota-time").innerText = bogota.getHours() + ":" + String(bogota.getMinutes()).padStart(2, '0');
            if(bogota.getHours() >= 18 || bogota.getHours() < 6) document.body.classList.add("night-mode"); 
            else document.body.classList.remove("night-mode");
        }

        const diff = Math.floor((bogota - startDate) / 1000);
        if (!isNaN(diff)) {
            const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
            if (document.getElementById("counter")) document.getElementById("counter").innerHTML = `<span>${d}d</span><span>${h}h</span><span>${m}m</span><span style="color:#ff4d4d">${s}s</span>`;
        }

        if (document.getElementById("message") && bogota.toString() !== "Invalid Date" && startDate.toString() !== "Invalid Date") {
            const dayDiff = Math.floor((new Date(bogota.getFullYear(), bogota.getMonth(), bogota.getDate()) - new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / 86400000);
            document.getElementById("message").innerText = messages[dayDiff] || "Contigo, siempre. 🤍";
        }

        const resetTime = new Date(bogota); 
        if (resetTime.toString() !== "Invalid Date") {
            resetTime.setHours(24, 0, 0, 0);
            const timeToReset = Math.floor((resetTime - bogota) / 1000);
            if (document.getElementById("reset-info")) document.getElementById("reset-info").innerText = `Las fotos se reinician en: ${Math.floor(timeToReset / 3600)}h ${Math.floor((timeToReset % 3600) / 60)}m (Bogotá 00:00)`;
        }
        checkDailyReset();
    } catch (e) {
        console.error("Update error:", e);
    }
}

function checkDailyReset() {
    try {
        const bDate = new Date().toLocaleDateString("en-US", {timeZone: "America/Bogota"});
        if (localStorage.getItem("nosotros_last_reset") !== bDate) {
            localStorage.removeItem("nosotros_anil_photo"); 
            localStorage.removeItem("nosotros_camila_photo");
            localStorage.setItem("nosotros_last_reset", bDate); 
            updateSelfieUI();
        }
    } catch (e) {
        console.error("Daily reset check failed:", e);
    }
}

function updateSelfieUI() {
    const aP = localStorage.getItem("nosotros_anil_photo"), cP = localStorage.getItem("nosotros_camila_photo");
    const aI = document.getElementById("anil-photo"), cI = document.getElementById("camila-photo"), aPh = document.getElementById("anil-placeholder"), cPh = document.getElementById("camila-placeholder");
    if (aI && aPh) { if (aP) { aI.src = aP; aI.classList.add("active"); aPh.style.display = "none"; } else { aI.classList.remove("active"); aPh.style.display = "flex"; } }
    if (cI && cPh) { if (cP) { cI.src = cP; cI.classList.add("active"); cPh.style.display = "none"; } else { cI.classList.remove("active"); cPh.style.display = "flex"; } }
    if (aI && cI) {
        if (aP && cP) { aI.classList.remove("blurred"); cI.classList.remove("blurred"); }
        else {
            if (currentUser === "Anıl") { if (aP) aI.classList.remove("blurred"); if (cP && !aP) cI.classList.add("blurred"); }
            else { if (cP) cI.classList.remove("blurred"); if (aP && !cP) aI.classList.add("blurred"); }
        }
    }
}

document.getElementById("selfie-input")?.addEventListener("change", function(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(event) {
        let img = new Image(); img.src = event.target.result;
        img.onload = async function() {
            let canvas = document.createElement('canvas'), mW = 600, w = img.width, h = img.height;
            if (w > mW) { h *= mW / w; w = mW; }
            canvas.width = w; canvas.height = h; canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            let cB64 = canvas.toDataURL('image/jpeg', 0.6), today = new Date().toLocaleDateString("en-US", {timeZone: "America/Bogota"}).replace(/\//g, "-");
            if (supabase) {
                let uD = {}; uD[currentUser === "Anıl" ? "anil" : "camila"] = cB64; uD["day"] = today;
                await supabase.from('selfies').upsert(uD, { onConflict: 'day' });
            }
        };
    };
    reader.readAsDataURL(file);
});

setInterval(() => {
    const img = document.getElementById("album-photo");
    if(img && document.getElementById("main-page").classList.contains("active")) {
        img.style.opacity = 0; setTimeout(() => { currentIdx = (currentIdx + 1) % photos.length; img.src = photos[currentIdx]; img.style.opacity = 1; }, 500);
    }
}, 4000);

window.onload = () => { 
     console.log("App starting...");
     try {
         update(); 
         setInterval(update, 1000); 
         fetchWeather(); 
         setInterval(fetchWeather, 3600000); 
         setInterval(createFloatingHeart, 600); // Moved here for safety
         
         const sU = localStorage.getItem("nosotros_user");
         const loginScreen = document.getElementById("login-screen");
         
         if (sU) { 
             console.log("Auto-login for:", sU);
             if (loginScreen) loginScreen.classList.remove("active"); 
             login(sU); 
         } else { 
             console.log("No user found, showing login.");
             if (loginScreen) loginScreen.classList.add("active"); 
         }
     } catch (e) {
         console.error("Onload error:", e);
     }
 };
