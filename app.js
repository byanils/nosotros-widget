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

const startDate = new Date("2024-12-27T10:45:00");
let currentUser = "";
let photoIndex = 1;

// GİRİŞ FONKSİYONU
window.loginUser = (u) => {
    currentUser = u;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    initApp();
};

function initApp() {
    startCounter();
    updateWeather();
    syncSelfies();
    setInterval(updateWeather, 600000); // 10 dk bir hava durumu
}

// SAYAÇ VE YEREL SAATLER
function startCounter() {
    setInterval(() => {
        const now = new Date();
        // Zaman Dilimleri
        document.getElementById("m-time").innerText = now.toLocaleTimeString("it-IT", {hour:'2-digit', minute:'2-digit', timeZone:"Europe/Rome"});
        document.getElementById("b-time").innerText = now.toLocaleTimeString("it-IT", {hour:'2-digit', minute:'2-digit', timeZone:"America/Bogota"});

        // Sayaç Hesaplama
        const diff = Math.floor((now - startDate) / 1000);
        const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
        document.getElementById("counter").innerHTML = `
            <div class="unit"><b>${d}</b><small>DÍAS</small></div>
            <div class="unit"><b>${h}</b><small>HRS</small></div>
            <div class="unit"><b>${m}</b><small>MIN</small></div>
            <div class="unit"><b>${s}</b><small>SEG</small></div>`;
    }, 1000);
}

// HAVA DURUMU (Open-Meteo)
async function updateWeather() {
    const fetchTemp = async (lat, lon) => {
        try {
            const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const d = await r.json();
            return Math.round(d.current_weather.temperature) + "°C";
        } catch { return "--°C"; }
    };
    document.getElementById("m-temp").innerText = await fetchTemp(45.46, 9.18);
    document.getElementById("b-temp").innerText = await fetchTemp(4.71, -74.07);
}

// KALP ALBÜMÜ (foto1-foto9)
window.nextPhoto = () => {
    photoIndex = photoIndex >= 9 ? 1 : photoIndex + 1;
    document.getElementById("album-photo").src = `foto${photoIndex}.jpg`;
};

// SELFIE SİSTEMİ
function syncSelfies() {
    onSnapshot(doc(db, "settings", "selfies"), (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            if (data.anil) document.getElementById("slot-anil").innerHTML = `<img src="${data.anil}">`;
            if (data.camila) document.getElementById("slot-camila").innerHTML = `<img src="${data.camila}">`;
        }
    });
}

window.triggerUpload = () => document.getElementById("photo-input").click();

window.uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const btn = document.querySelector(".btn-secondary");
    btn.innerText = "Cargando...";
    
    try {
        const sRef = ref(storage, `selfies/${currentUser}_${Date.now()}.jpg`);
        await uploadBytes(sRef, file);
        const url = await getDownloadURL(sRef);
        await setDoc(doc(db, "settings", "selfies"), { [currentUser]: url }, { merge: true });
        btn.innerText = "✅ ¡Listo!";
        setTimeout(() => btn.innerText = "📸 Subir Nuestro Momento", 2000);
    } catch {
        btn.innerText = "❌ Error";
    }
};

// OYUN SİSTEMİ
const gameDoc = doc(db, "games", "tic-tac-toe");

window.goToUniverse = () => {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("game-page").classList.add("active");
    renderGame();
};

function renderGame() {
    // 9 Sandık Oluştur (sandik.png)
    const chestCont = document.getElementById("chest-container");
    chestCont.innerHTML = "";
    for(let i=1; i<=9; i++) {
        const img = document.createElement("img");
        img.src = "sandik.png";
        img.className = "chest";
        img.id = `chest-${i}`;
        chestCont.appendChild(img);
    }

    // Grid Oluştur (8x8 = 64)
    const grid = document.getElementById("tic-tac-toe-grid");
    grid.innerHTML = "";
    for(let i=0; i<64; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = () => makeMove(i);
        grid.appendChild(cell);
    }

    // Firebase Dinleyici
    onSnapshot(gameDoc, (snap) => {
        const data = snap.exists() ? snap.data() : { board: Array(64).fill(""), turn: "anil", wins: 0 };
        const cells = document.querySelectorAll(".cell");
        data.board.forEach((val, idx) => cells[idx].innerText = val);
        document.getElementById("game-status").innerText = `Turno de: ${data.turn.toUpperCase()}`;
        
        // Sandıkları aktif et
        for(let i=1; i<=9; i++) {
            if(data.wins >= i) document.getElementById(`chest-${i}`).classList.add("active");
        }
    });
}

async function makeMove(i) {
    const snap = await getDoc(gameDoc);
    const data = snap.exists() ? snap.data() : { board: Array(64).fill(""), turn: "anil", wins: 0 };
    if (data.board[i] === "" && data.turn === currentUser) {
        data.board[i] = currentUser === "anil" ? "X" : "O";
        data.turn = currentUser === "anil" ? "camila" : "anil";
        // Kazanma kontrolü buraya eklenebilir (wins artırımı için)
        await setDoc(gameDoc, data);
    }
}

window.clearBoard = () => setDoc(gameDoc, { board: Array(64).fill(""), turn: "anil", wins: 0 });
window.goToHome = () => {
    document.getElementById("game-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
};
