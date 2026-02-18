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
const photoList = ["foto1.jpg", "foto2.jpg", "foto3.jpg"];
let photoIdx = 0, currentUser = "";
const todayKey = new Date().toISOString().split('T')[0];

window.loginUser = (u) => { 
    currentUser = u; 
    document.getElementById("login-overlay").classList.remove("active"); 
    document.getElementById("main-page").classList.add("active"); 
    startSystems(); 
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

window.openPhotoModal = () => document.getElementById("photo-daily-modal").style.display = "block";
window.closePhotoModal = () => document.getElementById("photo-daily-modal").style.display = "none";

function startSystems() {
    updateWeather();
    setInterval(updateClocks, 1000);
    setInterval(updateCounter, 1000);
    setInterval(slideshow, 5000);
    listenPhotos();
    createStars();
}

function renderVaults() {
    const grid = document.getElementById("vault-grid");
    grid.innerHTML = "";
    const now = new Date();
    // Vaults listesinden ilk 5 sandığı Amazon stili yolda göster
    vaults.slice(0, 5).forEach(v => {
        const div = document.createElement("div");
        div.className = "chest";
        const target = new Date(v.d);
        
        if (now >= target) div.classList.add("unlocked");
        
        div.setAttribute("data-label", v.secret ? "???" : v.d.split("-").slice(1).join("/"));
        
        div.onclick = () => {
            // Tarih kontrolü: Bugünün tarihi sandık tarihinden büyük veya eşitse açılır
            if (now >= target) {
                alert("💖 " + v.t);
            } else {
                alert(v.secret ? "✨ Hay que saber esperar..." : "🔒 " + v.d);
            }
        };
        grid.appendChild(div);
    });
}

async function initXOX() {
    const grid = document.getElementById("tic-tac-toe-grid");
    grid.innerHTML = "";
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        cell.onclick = () => handleMove(i);
        grid.appendChild(cell);
    }
    onSnapshot(doc(db, "games", todayKey), (snap) => {
        const data = snap.exists() ? snap.data() : { board: Array(64).fill(""), turn: "anil", sA: 0, sC: 0 };
        updateUI(data);
    });
}

async function handleMove(i) {
    const ref = doc(db, "games", todayKey);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : { board: Array(64).fill(""), turn: "anil", sA: 0, sC: 0 };
    if (data.board[i] !== "" || data.turn !== currentUser) return;
    data.board[i] = currentUser === "anil" ? "X" : "O";
    data.turn = currentUser === "anil" ? "camila" : "anil";
    await setDoc(ref, data);
}

function updateUI(data) {
    const cells = document.querySelectorAll(".cell");
    data.board.forEach((v, i) => { cells[i].innerText = v; cells[i].className = "cell " + (v ? v.toLowerCase() : ""); });
    document.getElementById("score-anil").innerText = data.sA || 0;
    document.getElementById("score-camila").innerText = data.sC || 0;
    document.getElementById("game-status").innerText = "Turno: " + data.turn.toUpperCase();
}

window.clearBoard = async () => { if(confirm("Reset?")) await setDoc(doc(db, "games", todayKey), { board: Array(64).fill(""), turn: "anil" }, {merge: true}); };

// DİĞER FONKSİYONLAR (Hava durumu, saat, foto yükleme vs.)
async function updateWeather() {
    const cities = [{ id: "milan", lat: 45.46, lon: 9.18 }, { id: "bogota", lat: 4.71, lon: -74.07 }];
    for (let c of cities) {
        try {
            const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`);
            const d = await r.json();
            document.getElementById(`${c.id}-temp`).innerText = Math.round(d.current_weather.temperature) + "°C";
            document.getElementById(`${c.id}-icon`).innerText = d.current_weather.weathercode <= 3 ? "☀️" : "☁️";
        } catch (e) {}
    }
}

function updateClocks() {
    const now = new Date();
    document.getElementById("milan-time").innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Rome" });
    document.getElementById("bogota-time").innerText = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: "America/Bogota" });
}

function updateCounter() {
    const now = new Date();
    const diff = Math.floor((now - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    document.getElementById("counter").innerHTML = `<div class="time-unit"><span>${d}</span><small>DÍAS</small></div><div class="time-unit"><span>${h}</span><small>HORAS</small></div><div class="time-unit"><span>${m}</span><small>MIN</small></div><div class="time-unit"><span>${s}</span><small>SEG</small></div>`;
    document.getElementById("message").innerText = messages[Math.floor((now - startDate) / 86400000)] || "🤍";
}

function slideshow() { photoIdx = (photoIdx + 1) % photoList.length; const el = document.getElementById("album-photo"); if(el){ el.style.opacity = 0; setTimeout(() => { el.src = photoList[photoIdx]; el.style.opacity = 1; }, 800); } }

window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const status = document.getElementById("photo-status-msg");
    status.innerText = "⏳";
    const fd = new FormData(); fd.append("image", input.files[0]);
    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: "POST", body: fd });
        const json = await res.json();
        await setDoc(doc(db, "daily", todayKey), { [currentUser]: json.data.url }, { merge: true });
        status.innerText = "✨";
    } catch (e) { status.innerText = "❌"; }
};

function listenPhotos() {
    onSnapshot(doc(db, "daily", todayKey), (snap) => {
        if (snap.exists()) {
            const d = snap.data();
            if(d.anil) document.getElementById("img-anil").src = d.anil;
            if(d.camila) document.getElementById("img-camila").src = d.camila;
            if(d.anil && d.camila) { document.querySelectorAll(".frame img").forEach(i => i.classList.remove("locked")); }
        }
    });
}

function createStars() {
    const c = document.getElementById("stars-container");
    if(c.children.length > 0) return;
    for(let i=0; i<80; i++) {
        const s = document.createElement("div");
        s.style.position = "absolute"; s.style.width = s.style.height = "2px"; s.style.background = "white";
        s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 100 + "%";
        s.style.borderRadius = "50%"; s.style.opacity = Math.random(); c.appendChild(s);
    }
}
