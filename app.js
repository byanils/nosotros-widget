import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

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
const storage = getStorage(app);
const startDate = new Date("2025-12-27T10:45:00");
let currentUser = "";
const todayKey = new Date().toISOString().split('T')[0];

// GİRİŞ
window.loginUser = (u) => {
    currentUser = u;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    syncAll();
};

// NAVİGASYON
window.goToUniverse = () => {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("star-map-page").classList.add("active");
    initXOX();
};
window.goToHome = () => {
    document.getElementById("star-map-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
};

// SİSTEM SENKRONİZASYONU (FOTOĞRAF + SAAT + HAVA DURUMU)
function syncAll() {
    // 1. Fotoğrafı Dinle (Anlık Karşı Taraf Yükleyince Değişir)
    onSnapshot(doc(db, "settings", "album"), (snap) => {
        if(snap.exists()) document.getElementById("album-photo").src = snap.data().url;
    });

    // 2. Hava Durumu
    updateWeather();

    // 3. Saat ve Sayaç
    setInterval(() => {
        const now = new Date();
        document.getElementById("m-time").innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Rome" });
        document.getElementById("b-time").innerText = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: "America/Bogota" });

        const diff = Math.floor((now - startDate) / 1000);
        const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
        document.getElementById("counter").innerHTML = `
            <div class="time-unit"><span>${d}</span><small>Días</small></div>
            <div class="time-unit"><span>${h}</span><small>Horas</small></div>
            <div class="time-unit"><span>${m}</span><small>Mins</small></div>
            <div class="time-unit"><span>${s}</span><small>Segs</small></div>
        `;
    }, 1000);
}

// FOTOĞRAF YÜKLEME
window.triggerUpload = () => document.getElementById("photo-input").click();
window.uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const sRef = ref(storage, 'shared_moment.jpg');
    await uploadBytes(sRef, file);
    const url = await getDownloadURL(sRef);
    await setDoc(doc(db, "settings", "album"), { url: url, timestamp: Date.now() });
};

// HAVA DURUMU
async function updateWeather() {
    const fetchW = async (lat, lon) => {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const d = await r.json();
        return Math.round(d.current_weather.temperature) + "°C";
    };
    document.getElementById("m-temp").innerText = await fetchW(45.46, 9.18);
    document.getElementById("b-temp").innerText = await fetchW(4.71, -74.07);
}

// XOX OYUNU
async function initXOX() {
    const grid = document.getElementById("tic-tac-toe-grid");
    grid.innerHTML = "";
    for(let i=0; i<64; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = () => makeMove(i);
        grid.appendChild(cell);
    }
    onSnapshot(doc(db, "games", todayKey), (snap) => {
        const data = snap.exists() ? snap.data() : { board: Array(64).fill(""), turn: "anil" };
        const cells = document.querySelectorAll(".cell");
        data.board.forEach((v, i) => { 
            cells[i].innerText = v; 
            cells[i].style.color = v === "X" ? "#ff4d4d" : "#448aff"; 
        });
        document.getElementById("game-status").innerText = "Turno de: " + data.turn.toUpperCase();
    });
}

async function makeMove(i) {
    const ref = doc(db, "games", todayKey);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : { board: Array(64).fill(""), turn: "anil" };
    if(data.board[i] === "" && data.turn === currentUser) {
        data.board[i] = currentUser === "anil" ? "X" : "O";
        data.turn = currentUser === "anil" ? "camila" : "anil";
        await setDoc(ref, data);
    }
}
window.clearBoard = () => setDoc(doc(db, "games", todayKey), { board: Array(64).fill(""), turn: "anil" });
