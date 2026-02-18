import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { messages } from "./messages.js";

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

// Sandıklar - Derin ve Uzun Mesajlar
const vaults = [
    { d: "2026-02-15", t: "A veces me quedo mirando el mapa y me doy cuenta de que la distancia es solo un número. Porque no importa cuántos kilómetros nos separen, mi mente siempre encuentra el camino de regreso a ti. Eres mi hogar, sin importar en qué parte del mundo estemos. ❤️" },
    { d: "2026-02-22", t: "Dicen que el amor a distancia es para valientes, y nosotros lo somos. Cada videollamada, cada 'te extraño' y cada sueño compartido nos hace más fuertes. No estamos lejos, solo nos estamos preparando para el momento en que el 'hola' sea para siempre. ✨" },
    { d: "2026-03-01", t: "Mi alma se siente en paz cuando te escucho reír. Es increíble cómo alguien que está a miles de kilómetros puede hacerme sentir más acompañado que cualquier persona que tenga cerca. Gracias por ser mi lugar seguro, mi paz y mi mayor motivación todos los días. 🌊" },
    { d: "2026-03-15", t: "Cuando el silencio me rodea, cierro los ojos y puedo sentir tu mano junto a la mía. Esta distancia es temporal, pero lo que hemos construido es eterno. Cada día que pasa es un día menos para volver a abrazarte y no soltarte nunca más. 💍" },
    { d: "2026-04-15", t: "¡FELIZ CUMPLEAÑOS, MI VIDA! 🎂 Hoy el universo celebra el día en que naciste, y yo celebro la fortuna de tenerte. Desearía estar ahí para llenarte de besos, pero prometo que recuperaremos cada segundo. Eres el regalo más hermoso que la vida me ha dado. ¡Te amo! 🥳💖" }
];

// LOGIN
window.loginUser = (user) => {
    currentUser = user;
    document.getElementById("login-overlay").classList.remove("active");
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
    document.getElementById("message").innerText = messages[dayDiff] || "Nuestro viaje continúa... 🤍";
}

// EVREN - S YOLU DİZİLİMİ
function initUniverse() {
    const container = document.getElementById("vault-container");
    if (container.innerHTML !== "") return;

    vaults.forEach((v, i) => {
        const div = document.createElement("div");
        div.className = "chest";
        const progress = i / (vaults.length - 1);
        const yPos = 10 + (progress * 80);
        const xPos = 50 + (Math.sin(progress * Math.PI * 2.5) * 35);
        
        div.style.top = yPos + "%";
        div.style.left = xPos + "%";
        div.setAttribute("data-date", v.d);

        div.onclick = (e) => {
            e.stopPropagation();
            if (new Date() < new Date(v.d)) alert("🔒 Bloqueado hasta: " + v.d);
            else alert(v.t);
        };
        container.appendChild(div);
    });

    // Yıldızlar
    const stars = document.getElementById("stars-container");
    for(let i=0; i<100; i++) {
        const s = document.createElement("div");
        s.style.position = "absolute";
        s.style.width = "2px"; s.style.height = "2px"; s.style.background = "white";
        s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 200 + "%";
        s.style.opacity = Math.random();
        stars.appendChild(s);
    }
}

// FOTOĞRAF YÜKLEME VE SENKRONİZASYON
function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const status = document.getElementById("photo-status-msg");
    status.innerText = "Subiendo foto... ⏳";

    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: "POST", body: formData });
        const json = await res.json();
        const today = getTodayKey();
        
        await setDoc(doc(db, "daily", today), { [currentUser]: json.data.url }, { merge: true });
        status.innerText = "¡Foto enviada! ✨";
    } catch (e) { status.innerText = "Error al subir ❌"; }
};

function listenToDailyPhotos() {
    const today = getTodayKey();
    onSnapshot(doc(db, "daily", today), (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            const imgA = document.getElementById("img-anil"), imgC = document.getElementById("img-camila");
            if(data.anil) imgA.src = data.anil;
            if(data.camila) imgC.src = data.camila;
            if(data.anil && data.camila) {
                imgA.classList.remove("locked"); imgC.classList.remove("locked");
                document.getElementById("photo-status-msg").innerText = "✨ ¡Momento Desbloqueado! ✨";
            }
        }
    });
}

setInterval(update, 1000);
update();
