import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { messages } from "./messages.js";
import { vaults } from "./vaults.js";

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
const startDate = new Date("2025-12-27T10:45:00");
let currentUser = "";
const todayKey = new Date().toISOString().split('T')[0];

// GİRİŞ
window.loginUser = (u) => {
    currentUser = u;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    startSystems();
};

// NAVİGASYON
window.goToUniverse = () => {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("star-map-page").classList.add("active");
    renderVaults();
    initXOX();
};
window.goToHome = () => {
    document.getElementById("star-map-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
};

// MODAL
window.openPhotoModal = () => document.getElementById("photo-daily-modal").style.display = "flex";
window.closePhotoModal = () => document.getElementById("photo-daily-modal").style.display = "none";

function startSystems() {
    updateWeather();
    setInterval(() => {
        const now = new Date();
        document.getElementById("milan-time").innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' });
        updateCounter();
    }, 1000);
}

// HAVA DURUMU
async function updateWeather() {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=45.46&longitude=9.18&current_weather=true`);
    const d = await r.json();
    document.getElementById("milan-temp").innerText = Math.round(d.current_weather.temperature) + "°C";
}

// SAYAÇ
function updateCounter() {
    const diff = Math.floor((new Date() - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    document.getElementById("counter").innerHTML = `
        <div class="time-unit"><span>${d}</span><small>Días</small></div>
        <div class="time-unit"><span>${h}</span><small>Horas</small></div>
        <div class="time-unit"><span>${m}</span><small>Min</small></div>
        <div class="time-unit"><span>${s}</span><small>Seg</small></div>
    `;
    document.getElementById("message").innerText = messages[d] || "🤍";
}

// SANDIKLAR
function renderVaults() {
    const grid = document.getElementById("vault-grid");
    grid.innerHTML = "";
    const now = new Date();
    vaults.slice(0, 5).forEach(v => {
        const div = document.createElement("div");
        div.className = "chest " + (now >= new Date(v.d) ? "unlocked" : "");
        div.onclick = () => now >= new Date(v.d) ? alert("💖 " + v.t) : alert("🔒 " + v.d);
        grid.appendChild(div);
    });
}

// XOX OYUNU
async function initXOX() {
    const grid = document.getElementById("tic-tac-toe-grid");
    grid.innerHTML = "";
    for(let i=0; i<64; i++) {
        const c = document.createElement("div");
        c.className = "cell";
        c.onclick = () => makeMove(i);
        grid.appendChild(c);
    }
    onSnapshot(doc(db, "games", todayKey), (snap) => {
        if(snap.exists()){
            const data = snap.data();
            const cells = document.querySelectorAll(".cell");
            data.board.forEach((v, i) => cells[i].innerText = v);
            document.getElementById("game-status").innerText = "Turno de: " + data.turn.toUpperCase();
        } else {
            setDoc(doc(db, "games", todayKey), { board: Array(64).fill(""), turn: "anil" });
        }
    });
}

async function makeMove(i) {
    const ref = doc(db, "games", todayKey);
    const snap = await getDoc(ref);
    const data = snap.data();
    if(data.board[i] !== "" || data.turn !== currentUser) return;
    data.board[i] = currentUser === "anil" ? "X" : "O";
    data.turn = currentUser === "anil" ? "camila" : "anil";
    await updateDoc(ref, data);
}
