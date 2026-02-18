import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCv12bIT9P0Ezho4CidHYfRLMqCN3LVq1o",
    authDomain: "nuestro-universo-70d52.firebaseapp.com",
    projectId: "nuestro-universo-70d52",
    storageBucket: "nuestro-universo-70d52.firebasestorage.app",
    appId: "1:979401273604:web:ca547072488f746ca7e051"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const startDate = new Date("2024-12-27T10:45:00"); // 53 gün önceye tekabül eder
let currentUser = "";

// GİRİŞ
window.loginUser = (u) => {
    currentUser = u;
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("main-page").classList.add("active");
    startAppSystems();
};

// SİSTEMLERİ BAŞLAT
function startAppSystems() {
    syncAlbum();
    updateWeather();
    setInterval(updateTimeAndCounter, 1000);
}

// ALBÜM VE FOTOĞRAF (BURASI ÇALIŞMAYAN KISIMDI)
function syncAlbum() {
    onSnapshot(doc(db, "settings", "album"), (snap) => {
        const img = document.getElementById("album-photo");
        if (snap.exists() && snap.data().url) {
            img.src = snap.data().url;
            img.onload = () => img.style.opacity = "1";
        } else {
            img.src = "https://via.placeholder.com/300?text=Subir+Foto";
            img.style.opacity = "1";
        }
    });
}

window.triggerUpload = () => document.getElementById("photo-input").click();

window.uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const btn = document.querySelector(".btn-secondary");
    btn.innerText = "Yükleniyor...";

    try {
        const fileName = `moment_${Date.now()}.jpg`;
        const sRef = ref(storage, 'shared/' + fileName);
        await uploadBytes(sRef, file);
        const url = await getDownloadURL(sRef);

        await setDoc(doc(db, "settings", "album"), { 
            url: url, 
            by: currentUser, 
            time: Date.now() 
        });
        btn.innerText = "✅ ¡Listo!";
        setTimeout(() => btn.innerText = "📸 Subir Nuestro Momento", 2000);
    } catch (err) {
        alert("Hata: " + err.message);
        btn.innerText = "📸 Subir Nuestro Momento";
    }
};

// SAYAÇ VE HAVA DURUMU
function updateTimeAndCounter() {
    const now = new Date();
    // Saatler
    document.getElementById("m-time").innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Rome" });
    document.getElementById("b-time").innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit', timeZone: "America/Bogota" });

    // Sayaç
    const diff = Math.floor((now - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    document.getElementById("counter").innerHTML = `
        <div class="unit"><b>${d}</b><small>Días</small></div>
        <div class="unit"><b>${h}</b><small>Hrs</small></div>
        <div class="unit"><b>${m}</b><small>Min</small></div>
        <div class="unit"><b>${s}</b><small>Seg</small></div>`;
}

async function updateWeather() {
    const fetchW = async (lat, lon) => {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const d = await r.json();
        return Math.round(d.current_weather.temperature) + "°C";
    };
    document.getElementById("m-temp").innerText = await fetchW(45.46, 9.18);
    document.getElementById("b-temp").innerText = await fetchW(4.71, -74.07);
}

// OYUN
const gameKey = "shared_xox";
window.goToUniverse = () => {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("game-page").classList.add("active");
    initGame();
};

function initGame() {
    const grid = document.getElementById("tic-tac-toe-grid");
    grid.innerHTML = "";
    for(let i=0; i<64; i++) {
        const c = document.createElement("div");
        c.className = "cell";
        c.onclick = () => makeMove(i);
        grid.appendChild(c);
    }
    onSnapshot(doc(db, "games", gameKey), (snap) => {
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
    const dRef = doc(db, "games", gameKey);
    const snap = await getDoc(dRef);
    const data = snap.exists() ? snap.data() : { board: Array(64).fill(""), turn: "anil" };
    if(data.board[i] === "" && data.turn === currentUser) {
        data.board[i] = currentUser === "anil" ? "X" : "O";
        data.turn = currentUser === "anil" ? "camila" : "anil";
        await setDoc(dRef, data);
    }
}

window.goToHome = () => {
    document.getElementById("game-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
};
window.clearBoard = () => setDoc(doc(db, "games", gameKey), { board: Array(64).fill(""), turn: "anil" });
