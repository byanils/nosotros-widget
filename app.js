import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { messages } from "./messages.js"; // Mesajları buradan alıyoruz

// --- CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyCv12bIT9P0Ezho4CidHYfRLMqCN3LVq1o",
    authDomain: "nuestro-universo-70d52.firebaseapp.com",
    projectId: "nuestro-universo-70d52",
    storageBucket: "nuestro-universo-70d52.firebasestorage.app",
    messagingSenderId: "979401273604",
    appId: "1:979401273604:web:ca547072488f746ca7e051",
    measurementId: "G-NY9FG93DSY"
};

const imgbbKey = "072b34aeea28d1eab7f3865e6dcae66b";
const startDate = new Date("2025-12-27T10:45:00");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentUser = "";

// Sandıklar (S-Yolu İçin)
const vaults = [
    { d: "2026-02-15", t: "Las distancias solo están en los mapas. Te amo." },
    { d: "2026-03-01", t: "Mi alma se siente en casa contigo." },
    { d: "2026-04-15", t: "¡Feliz Cumpleaños mi amor!" }
];

// LOGIN & NAV
window.loginUser = (user) => {
    currentUser = user;
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("main-page").classList.add("active");
    listenToDailyPhotos();
};

window.goToUniverse = () => {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("star-map-page").classList.add("active");
    initUniverse();
};

window.goToHome = () => {
    document.getElementById("star-map-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
};

window.openPhotoModal = () => document.getElementById("photo-daily-modal").style.display = "block";
window.closePhotoModal = () => document.getElementById("photo-daily-modal").style.display = "none";

// SAYAÇ (İSPANYOLCA)
function update() {
    const now = new Date();
    const diff = Math.floor((now - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    
    document.getElementById("counter").innerHTML = `
        <div class="time-unit"><span>${d}</span><small>DÍAS</small></div>
        <div class="time-unit"><span>${h}</span><small>HORAS</small></div>
        <div class="time-unit"><span>${m}</span><small>MIN</small></div>
        <div class="time-unit" style="color:#ff4d4d"><span>${s}</span><small>SEG</small></div>
    `;

    const dayDiff = Math.floor((now - startDate) / 86400000);
    document.getElementById("message").innerText = messages[dayDiff] || "Contigo, siempre. 🤍";
}

// SANDIKLARIN S DİZİLİMİ
function initUniverse() {
    const container = document.getElementById("vault-container");
    if (container.innerHTML !== "") return;

    vaults.forEach((v, i) => {
        const div = document.createElement("div");
        div.className = "chest";
        const progress = i / (vaults.length > 1 ? vaults.length - 1 : 1);
        const yPos = 10 + (progress * 80);
        const xPos = 50 + (Math.sin(progress * Math.PI * 2) * 35); // Geniş bir S çizsin
        
        div.style.top = yPos + "%";
        div.style.left = xPos + "%";

        div.onclick = () => {
            if (new Date() < new Date(v.d)) alert("🔒 Bloqueado hasta: " + v.d);
            else alert("❤️ " + v.t);
        };
        container.appendChild(div);
    });
}

// FOTOĞRAF SENKRONİZASYONU
function getTodayKey() {
    const d = new Date();
    // Farklı saat dilimleri sorun yaratmasın diye YYYY-MM-DD sabitliyoruz
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const status = document.getElementById("photo-status-msg");
    status.innerText = "Subiendo... ⏳";

    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: "POST", body: formData });
        const json = await res.json();
        const today = getTodayKey();
        
        await setDoc(doc(db, "daily", today), { [currentUser]: json.data.url }, { merge: true });
        status.innerText = "¡Listo! Esperando a tu amor...";
    } catch (e) { 
        status.innerText = "Error ❌"; 
        console.error(e);
    }
};

function listenToDailyPhotos() {
    const today = getTodayKey();
    onSnapshot(doc(db, "daily", today), (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            const imgA = document.getElementById("img-anil");
            const imgC = document.getElementById("img-camila");
            
            if(data.anil) imgA.src = data.anil;
            if(data.camila) imgC.src = data.camila;
            
            if(data.anil && data.camila) {
                imgA.classList.remove("locked");
                imgC.classList.remove("locked");
                document.getElementById("photo-status-msg").innerText = "✨ ¡Nuestro Momento! ✨";
            }
        }
    });
}

setInterval(update, 1000);
update();
