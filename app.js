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
const gameKey = new Date().toISOString().split('T')[0];

// GİRİŞ
window.loginUser = (u) => {
    currentUser = u;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    
    // Dinlemeleri başlat
    syncAlbum();
    startAppSystems();
};

// ALBÜM SENKRONİZASYONU (FOTOĞRAF ÇALIŞMIYOR DEDİĞİN KISIM)
function syncAlbum() {
    // Firestore'u anlık dinle: biri 'album' dokümanını güncellerse resim anında değişir
    onSnapshot(doc(db, "settings", "album"), (snap) => {
        if(snap.exists()) {
            const url = snap.data().url;
            const imgElement = document.getElementById("album-photo");
            imgElement.src = url;
        }
    });
}

// FOTOĞRAF YÜKLEME TETİKLEYİCİSİ
window.triggerUpload = () => {
    document.getElementById("photo-input").click();
};

window.uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    // Buton metnini değiştir (feedback için)
    const btn = document.querySelector(".btn-secondary");
    const originalText = btn.innerText;
    btn.innerText = "Yükleniyor...";

    try {
        // Storage'a yükle (ismini her seferinde aynı tutarsak üzerine yazar)
        const sRef = ref(storage, 'shared/current_selfie.jpg');
        await uploadBytes(sRef, file);
        const url = await getDownloadURL(sRef);
        
        // Firestore'a linki kaydet (Bunu yapınca onSnapshot sayesinde diğer kişide de anında değişir)
        await setDoc(doc(db, "settings", "album"), { 
            url: url, 
            uploadedBy: currentUser, 
            timestamp: Date.now() 
        });
        
        btn.innerText = "¡Listo! ✨";
        setTimeout(() => btn.innerText = originalText, 2000);
    } catch (err) {
        console.error(err);
        btn.innerText = "Hata oluştu!";
    }
};

// SİSTEMLER (SAAT, HAVA, SAYAÇ)
function startAppSystems() {
    updateWeather();
    setInterval(() => {
        const now = new Date();
        document.getElementById("m-time").innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Rome" });
        document.getElementById("b-time").innerText = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: "America/Bogota" });
        
        const diff = Math.floor((now - startDate) / 1000);
        const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
        document.getElementById("counter").innerHTML = `
            <div class="time-unit"><span>${d}</span><small>Días</small></div>
            <div class="time-unit"><span>${h}</span><small>Hrs</small></div>
            <div class="time-unit"><span>${m}</span><small>Min</small></div>
            <div class="time-unit ="><span>${s}</span><small>Seg</small></div>`;
    }, 1000);
}

async function updateWeather() {
    const fetchTemp = async (lat, lon) => {
        try {
            const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const d = await r.json();
            return Math.round(d.current_weather.temperature) + "°C";
        } catch(e) { return "--°C"; }
    };
    document.getElementById("m-temp").innerText = await fetchTemp(45.46, 9.18);
    document.getElementById("b-temp").innerText = await fetchTemp(4.71, -74.07);
}

// OYUN MANTIĞI
window.initXOX = () => {
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
        data.board.forEach((val, idx) => {
            cells[idx].innerText = val;
            cells[idx].style.color = val === "X" ? "#ff4d4d" : "#448aff";
        });
        document.getElementById("game-status").innerText = "Turno: " + data.turn.toUpperCase();
    });
};

async function makeMove(i) {
    const ref = doc(db, "games", gameKey);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : { board: Array(64).fill(""), turn: "anil" };
    if(data.board[i] === "" && data.turn === currentUser) {
        data.board[i] = currentUser === "anil" ? "X" : "O";
        data.turn = currentUser === "anil" ? "camila" : "anil";
        await setDoc(ref, data);
    }
}

// NAVİGASYON
window.goToUniverse = () => {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("star-map-page").classList.add("active");
    window.initXOX();
};
window.goToHome = () => {
    document.getElementById("star-map-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
};
window.clearBoard = () => setDoc(doc(db, "games", gameKey), { board: Array(64).fill(""), turn: "anil" });
