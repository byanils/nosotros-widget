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

window.loginUser = (user) => {
    currentUser = user;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    startSystem();
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

function startSystem() {
    updateWeather();
    setInterval(updateTime, 1000);
    setInterval(updateCounter, 1000);
    setInterval(slideshow, 5000);
    listenPhotos();
    createStars();
}

async function updateWeather() {
    const cities = [{ id: "milan", lat: 45.46, lon: 9.18 }, { id: "bogota", lat: 4.71, lon: -74.07 }];
    for (let c of cities) {
        try {
            const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`);
            const d = await r.json();
            document.getElementById(`${c.id}-temp`).innerText = Math.round(d.current_weather.temperature) + "°C";
            document.getElementById(`${c.id}-icon`).innerText = d.current_weather.weathercode <= 3 ? "☀️" : "☁️";
        } catch (e) { console.log(e); }
    }
}

function updateTime() {
    const now = new Date();
    document.getElementById("milan-time").innerText = now.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit', timeZone: "Europe/Rome" });
    document.getElementById("bogota-time").innerText = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: "America/Bogota" });
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
        const today = new Date().toISOString().split('T')[0];
        await setDoc(doc(db, "daily", today), { [currentUser]: json.data.url }, { merge: true });
        status.innerText = "¡Listo! ✨";
    } catch (e) { status.innerText = "Error ❌"; }
};

function listenPhotos() {
    const today = new Date().toISOString().split('T')[0];
    onSnapshot(doc(db, "daily", today), (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            if(data.anil) document.getElementById("img-anil").src = data.anil;
            if(data.camila) document.getElementById("img-camila").src = data.camila;
            if(data.anil && data.camila) {
                document.getElementById("img-anil").classList.remove("locked");
                document.getElementById("img-camila").classList.remove("locked");
            }
        }
    });
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
        div.setAttribute("data-label", v.secret ? "Un momento especial..." : v.d);
        div.onclick = () => {
            if (new Date() < new Date(v.d)) {
                alert(v.secret ? "✨ Hay que saber esperar por las cosas hermosas..." : "🔒 Se abrirá el: " + v.d);
            } else alert("💖 " + v.t);
        };
        container.appendChild(div);
    });
}

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
    document.getElementById("message").innerText = messages[Math.floor((now - startDate) / 86400000)] || "🤍";
}

function createStars() {
    const container = document.getElementById("stars-container");
    for(let i=0; i<80; i++) {
        const s = document.createElement("div");
        s.className = "star";
        s.style.position = "absolute";
        s.style.width = s.style.height = Math.random() * 2 + "px";
        s.style.background = "white";
        s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 100 + "%";
        s.style.borderRadius = "50%";
        container.appendChild(s);
    }
}
