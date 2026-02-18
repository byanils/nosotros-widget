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
const imgbbKey = "072b34aeea28d1eab7f3865e6dcae66b";
const startDate = new Date("2025-12-27T10:45:00");
let currentUser = "";
const todayKey = new Date().toISOString().split('T')[0];

// NAVİGASYON
window.loginUser = (u) => {
    currentUser = u;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    startGlobalSystems();
};

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
window.openPhotoModal = () => {
    document.getElementById("photo-daily-modal").style.display = "flex";
    listenDailyPhotos();
};
window.closePhotoModal = () => document.getElementById("photo-daily-modal").style.display = "none";

// SİSTEMLER
function startGlobalSystems() {
    updateWeather();
    setInterval(updateClocks, 1000);
    setInterval(updateCounter, 1000);
}

async function updateWeather() {
    const cities = [{ id: "milan", lat: 45.46, lon: 9.18 }, { id: "bogota", lat: 4.71, lon: -74.07 }];
    for (let c of cities) {
        try {
            const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`);
            const d = await r.json();
            const el = document.getElementById(`${c.id}-temp`);
            if(el) el.innerText = Math.round(d.current_weather.temperature) + "°C";
        } catch (e) {}
    }
}

function updateClocks() {
    const now = new Date();
    const milan = document.getElementById("milan-time");
    if(milan) milan.innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Rome" });
}

function updateCounter() {
    const now = new Date();
    const diff = Math.floor((now - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    
    document.getElementById("counter").innerHTML = `
        <div class="time-unit"><span>${d}</span><small>Días</small></div>
        <div class="time-unit"><span>${h}</span><small>Horas</small></div>
        <div class="time-unit"><span>${m}</span><small>Min</small></div>
        <div class="time-unit"><span>${s}</span><small>Seg</small></div>
    `;
    document.getElementById("message").innerText = messages[Math.floor(diff/86400)] || "🤍";
}

// SANDIKLAR
function renderVaults() {
    const grid = document.getElementById("vault-grid");
    grid.innerHTML = "";
    const now = new Date();
    vaults.slice(0, 5).forEach(v => {
        const div = document.createElement("div");
        div.className = "chest";
        const target = new Date(v.d);
        if(now >= target) div.classList.add("unlocked");
        div.onclick = () => {
            if(now >= target) alert("💖 " + v.t);
            else alert("🔒 Se abre el: " + v.d);
        };
        grid.appendChild(div);
    });
}

// XOX (8x8)
async function initXOX() {
    const grid = document.getElementById("tic-tac-toe-grid");
    grid.innerHTML = "";
    for(let i=0; i<64; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = () => handleMove(i);
        grid.appendChild(cell);
    }
    onSnapshot(doc(db, "games", todayKey), (snap) => {
        if(snap.exists()) {
            const data = snap.data();
            const cells = document.querySelectorAll(".cell");
            data.board.forEach((v, i) => { 
                cells[i].innerText = v; 
                cells[i].style.color = v === "X" ? "#ff4d4d" : "#448aff";
            });
            document.getElementById("game-status").innerText = "Turno de: " + data.turn.toUpperCase();
        } else {
            setDoc(doc(db, "games", todayKey), { board: Array(64).fill(""), turn: "anil" });
        }
    });
}

async function handleMove(i) {
    const ref = doc(db, "games", todayKey);
    const snap = await getDoc(ref);
    const data = snap.data();
    if(data.board[i] !== "" || data.turn !== currentUser) return;
    data.board[i] = currentUser === "anil" ? "X" : "O";
    data.turn = currentUser === "anil" ? "camila" : "anil";
    await updateDoc(ref, data);
}

window.clearBoard = async () => { if(confirm("Reset?")) await setDoc(doc(db, "games", todayKey), { board: Array(64).fill(""), turn: "anil" }); };

// FOTO YÜKLEME VE TAKİP
window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const status = document.getElementById("photo-status-msg");
    status.innerText = "⏳";
    const fd = new FormData(); fd.append("image", input.files[0]);
    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: "POST", body: fd });
        const json = await res.json();
        await setDoc(doc(db, "daily", todayKey), { [currentUser]: json.data.url }, { merge: true });
        status.innerText = "✅";
    } catch (e) { status.innerText = "❌"; }
};

function listenDailyPhotos() {
    onSnapshot(doc(db, "daily", todayKey), (snap) => {
        if (snap.exists()) {
            const d = snap.data();
            if(d.anil) document.getElementById("img-anil").src = d.anil;
            if(d.camila) document.getElementById("img-camila").src = d.camila;
            if(d.anil && d.camila) {
                document.getElementById("img-anil").classList.remove("locked");
                document.getElementById("img-camila").classList.remove("locked");
            }
        }
    });
}
