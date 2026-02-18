import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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
let photoIdx = 0;
let currentUser = "";

// GLOBAL BAĞLANTILAR
window.loginUser = (user) => {
    currentUser = user;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    startApp();
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

function startApp() {
    updateWeather();
    setInterval(updateClocks, 1000);
    setInterval(updateCounter, 1000);
    setInterval(slideshow, 5000);
    listenToDailyPhotos();
    createStars();
}

// HAVA DURUMU (Milan & Bogota)
async function updateWeather() {
    const cities = [
        { id: "milan", lat: 45.46, lon: 9.18 },
        { id: "bogota", lat: 4.71, lon: -74.07 }
    ];
    for (let city of cities) {
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`);
            const data = await res.json();
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            document.getElementById(`${city.id}-temp`).innerText = temp + "°C";
            document.getElementById(`${city.id}-icon`).innerText = getWeatherEmoji(code);
        } catch (e) { console.error("Weather error", e); }
    }
}

function getWeatherEmoji(code) {
    if (code <= 3) return "☀️";
    if (code <= 48) return "☁️";
    if (code <= 67) return "🌧️";
    return "⛈️";
}

// SAATLER
function updateClocks() {
    const now = new Date();
    document.getElementById("milan-time").innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Rome" });
    document.getElementById("bogota-time").innerText = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: "America/Bogota" });
}

// FOTOĞRAF YÜKLEME (ImgBB Fix)
window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const status = document.getElementById("photo-status-msg");
    status.innerText = "Subiendo... ⏳";
    
    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: "POST", body: formData });
        const json = await res.json();
        const today = new Date().toISOString().split('T')[0];
        
        await setDoc(doc(db, "daily", today), { [currentUser]: json.data.url }, { merge: true });
        status.innerText = "¡Enviado con éxito! ✨";
    } catch (e) { 
        status.innerText = "Error al subir ❌";
        console.error(e);
    }
};

function listenToDailyPhotos() {
    const today = new Date().toISOString().split('T')[0];
    onSnapshot(doc(db, "daily", today), (snap) => {
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

// Slayt, Sayaç ve Evren fonksiyonları (Aynen devam ediyor...)
function slideshow() {
    photoIdx = (photoIdx + 1) % photoList.length;
    const el = document.getElementById("album-photo");
    el.style.opacity = 0;
    setTimeout(() => { el.src = photoList[photoIdx]; el.style.opacity = 1; }, 800);
}

function updateCounter() {
    const now = new Date();
    const diff = Math.floor((now - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    document.getElementById("counter").innerHTML = `<div class="time-unit"><span>${d}</span><small>DÍAS</small></div><div class="time-unit"><span>${h}</span><small>HORAS</small></div><div class="time-unit"><span>${m}</span><small>MIN</small></div><div class="time-unit"><span>${s}</span><small>SEG</small></div>`;
    const dayDiff = Math.floor((now - startDate) / 86400000);
    document.getElementById("message").innerText = messages[dayDiff] || "Cada día es un regalo... 🤍";
}

function initUniverse() {
    const container = document.getElementById("vault-container");
    if (container.children.length > 0) return;
    vaults.forEach((v, i) => {
        const div = document.createElement("div");
        div.className = "chest";
        const progress = i / (vaults.length - 1 || 1);
        div.style.top = (15 + progress * 70) + "%";
        div.style.left = (50 + Math.sin(progress * Math.PI * 2.5) * 30) + "%";
        div.setAttribute("data-date", v.secret ? "✨ Secreto" : v.d);
        div.onclick = () => {
            if (new Date() < new Date(v.d)) alert(v.secret ? "🔒 Sorpresa." : "🔒 Bloqueado.");
            else alert("💖 " + v.t);
        };
        container.appendChild(div);
    });
}

function createStars() {
    const container = document.getElementById("stars-container");
    for(let i=0; i<80; i++) {
        const s = document.createElement("div");
        s.style.position = "absolute";
        s.style.width = s.style.height = Math.random() * 2 + "px";
        s.style.background = "white";
        s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 100 + "%";
        s.style.opacity = Math.random(); s.style.borderRadius = "50%";
        container.appendChild(s);
    }
}
