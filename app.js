import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { messages } from "./messages.js";
import { vaults } from "./vaults.js";

// --- FIREBASE YAPILANDIRMASI ---
const firebaseConfig = {
    apiKey: "AIzaSyCv12bIT9P0Ezho4CidHYfRLMqCN3LVq1o",
    authDomain: "nuestro-universo-70d52.firebaseapp.com",
    projectId: "nuestro-universo-70d52",
    storageBucket: "nuestro-universo-70d52.firebasestorage.app",
    messagingSenderId: "979401273604",
    appId: "1:979401273604:web:ca547072488f746ca7e051"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- AYARLAR ---
const imgbbKey = "072b34aeea28d1eab7f3865e6dcae66b";
const startDate = new Date("2025-12-27T10:45:00");
let currentUser = "";
const todayKey = new Date().toISOString().split('T')[0];

// --- GİRİŞ VE NAVİGASYON ---
window.loginUser = (user) => {
    currentUser = user;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    startGlobalSystems();
};

window.goToUniverse = () => {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("star-map-page").classList.add("active");
    renderVaults(); // Sandıkları çizdir
    initXOXGame();  // Oyunu başlat
};

window.goToHome = () => {
    document.getElementById("star-map-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
};

// MODAL KONTROLLERİ
window.openPhotoModal = () => {
    document.getElementById("photo-daily-modal").style.display = "flex";
    listenDailyPhotos();
};
window.closePhotoModal = () => {
    document.getElementById("photo-daily-modal").style.display = "none";
};

// --- SİSTEMLERİ BAŞLAT ---
function startGlobalSystems() {
    updateWeather();
    setInterval(updateClocks, 1000);
    setInterval(updateCounter, 1000);
    createStars();
}

// --- HAVA DURUMU VE SAATLER ---
async function updateWeather() {
    const cities = [
        { id: "milan", lat: 45.46, lon: 9.18 },
        { id: "bogota", lat: 4.71, lon: -74.07 }
    ];
    for (let c of cities) {
        try {
            const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`);
            const d = await r.json();
            const tempEl = document.getElementById(`${c.id}-temp`);
            if (tempEl) tempEl.innerText = Math.round(d.current_weather.temperature) + "°C";
        } catch (e) { console.error("Hata:", e); }
    }
}

function updateClocks() {
    const now = new Date();
    const milanTime = document.getElementById("milan-time");
    const bogotaTime = document.getElementById("bogota-time");
    
    if (milanTime) milanTime.innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Rome" });
    if (bogotaTime) bogotaTime.innerText = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: "America/Bogota" });
}

// --- SAYAÇ ---
function updateCounter() {
    const now = new Date();
    const diff = Math.floor((now - startDate) / 1000);
    
    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    const counterEl = document.getElementById("counter");
    if (counterEl) {
        counterEl.innerHTML = `
            <div class="time-unit"><span>${d}</span><small>DÍAS</small></div>
            <div class="time-unit"><span>${h}</span><small>HORAS</small></div>
            <div class="time-unit"><span>${m}</span><small>MIN</small></div>
            <div class="time-unit"><span>${s}</span><small>SEG</small></div>
        `;
    }

    const msgEl = document.getElementById("message");
    if (msgEl) {
        const dayIdx = Math.floor(diff / 86400);
        msgEl.innerText = messages[dayIdx] || "No sé hacia dónde vamos, pero me gusta el camino.";
    }
}

// --- SANDIK SİSTEMİ ---
function renderVaults() {
    const grid = document.getElementById("vault-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const now = new Date();

    // Görseldeki gibi 5 sandık
    vaults.slice(0, 5).forEach((v) => {
        const div = document.createElement("div");
        div.className = "chest";
        const targetDate = new Date(v.d);

        if (now >= targetDate) div.classList.add("unlocked");

        div.setAttribute("data-label", v.secret ? "???" : v.d.split("-").slice(1).join("/"));
        
        div.onclick = () => {
            if (now >= targetDate) {
                alert("💖 " + v.t);
            } else {
                alert("🔒 Se abrirá el: " + v.d);
            }
        };
        grid.appendChild(div);
    });
}

// --- REAL-TIME XOX (8x8) ---
async function initXOXGame() {
    const grid = document.getElementById("tic-tac-toe-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        cell.onclick = () => handleXOXMove(i);
        grid.appendChild(cell);
    }

    onSnapshot(doc(db, "games", todayKey), (snap) => {
        if (snap.exists()) {
            updateXOXUI(snap.data());
        } else {
            setDoc(doc(db, "games", todayKey), {
                board: Array(64).fill(""),
                turn: "anil",
                scoreAnil: 0, scoreCamila: 0
            });
        }
    });
}

async function handleXOXMove(idx) {
    const ref = doc(db, "games", todayKey);
    const snap = await getDoc(ref);
    const data = snap.data();

    if (data.board[idx] !== "" || data.turn !== currentUser) return;

    const newBoard = [...data.board];
    newBoard[idx] = currentUser === "anil" ? "X" : "O";
    const nextTurn = currentUser === "anil" ? "camila" : "anil";

    await updateDoc(ref, { board: newBoard, turn: nextTurn });
}

function updateXOXUI(data) {
    const cells = document.querySelectorAll(".cell");
    data.board.forEach((val, i) => {
        cells[i].innerText = val;
        cells[i].className = "cell " + (val ? val.toLowerCase() : "");
    });
    document.getElementById("score-anil").innerText = data.scoreAnil || 0;
    document.getElementById("score-camila").innerText = data.scoreCamila || 0;
    document.getElementById("game-status").innerText = "Turno de: " + data.turn.toUpperCase();
}

window.clearBoard = async () => {
    if(confirm("¿Reiniciar?")) {
        await setDoc(doc(db, "games", todayKey), { board: Array(64).fill(""), turn: "anil" }, { merge: true });
    }
};

// --- FOTOĞRAF YÜKLEME ---
window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const status = document.getElementById("photo-status-msg");
    status.innerText = "Subiendo... ⏳";
    const formData = new FormData();
    formData.append("image", input.files[0]);
    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: "POST", body: formData });
        const json = await res.json();
        await setDoc(doc(db, "daily", todayKey), { [currentUser]: json.data.url }, { merge: true });
        status.innerText = "¡Listo! ✨";
    } catch (e) { status.innerText = "Error ❌"; }
};

function listenDailyPhotos() {
    onSnapshot(doc(db, "daily", todayKey), (snap) => {
        if (snap.exists()) {
            const d = snap.data();
            const imgA = document.getElementById("img-anil");
            const imgC = document.getElementById("img-camila");
            if(d.anil && imgA) imgA.src = d.anil;
            if(d.camila && imgC) imgC.src = d.camila;
            if(d.anil && d.camila) {
                imgA.classList.remove("locked");
                imgC.classList.remove("locked");
            }
        }
    });
}

// --- YILDIZLAR ---
function createStars() {
    const container = document.getElementById("stars-container");
    if(!container || container.children.length > 0) return;
    for(let i=0; i<100; i++) {
        const s = document.createElement("div");
        s.className = "star";
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.opacity = Math.random();
        container.appendChild(s);
    }
}
