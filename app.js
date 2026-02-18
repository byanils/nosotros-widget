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
let currentUser = "";

// GLOBAL FUNCTIONS
window.loginUser = (user) => {
    currentUser = user;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    listenToDailyPhotos();
    createStars();
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

function update() {
    const now = new Date();
    const diff = Math.floor((now - startDate) / 1000);
    if (diff < 0) return;
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    
    document.getElementById("counter").innerHTML = `
        <div class="time-unit"><span>${d}</span><small>DÍAS</small></div>
        <div class="time-unit"><span>${h}</span><small>HORAS</small></div>
        <div class="time-unit"><span>${m}</span><small>MIN</small></div>
        <div class="time-unit"><span>${s}</span><small>SEG</small></div>
    `;
    const dayDiff = Math.floor((now - startDate) / 86400000);
    document.getElementById("message").innerText = messages[dayDiff] || "Cada día es un regalo... 🤍";
}

function createStars() {
    const container = document.getElementById("stars-container");
    if (container.innerHTML !== "") return;
    for(let i=0; i<100; i++) {
        const s = document.createElement("div");
        s.style.position = "absolute";
        s.style.width = "2px"; s.style.height = "24px";
        s.style.width = s.style.height = Math.random() * 3 + "px";
        s.style.background = "white";
        s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 100 + "%";
        s.style.opacity = Math.random(); s.style.borderRadius = "50%";
        container.appendChild(s);
    }
}

function initUniverse() {
    const container = document.getElementById("vault-container");
    if (container.children.length > 0) return;

    vaults.forEach((v, i) => {
        const div = document.createElement("div");
        div.className = "chest";
        
        // Tek sayfaya sığması için koordinat hesaplama
        const progress = i / (vaults.length - 1 || 1);
        const yPos = 15 + (progress * 70); // %15 - %85 arası dikey
        const xPos = 50 + (Math.sin(progress * Math.PI * 2.5) * 30); // Daha dar bir S kıvrımı
        
        div.style.top = yPos + "%";
        div.style.left = xPos + "%";
        
        const displayName = v.secret ? "✨ Secreto ✨" : v.d;
        div.setAttribute("data-date", displayName);

        div.onclick = (e) => {
            e.stopPropagation();
            const now = new Date();
            const target = new Date(v.d);
            if (now < target) {
                alert(v.secret ? "🔒 Shhh... Es una sorpresa especial." : "🔒 Bloqueado hasta: " + v.d);
            } else {
                alert("💖 " + v.t);
            }
        };
        container.appendChild(div);
    });
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
        status.innerText = "¡Enviado! ✨";
    } catch (e) { status.innerText = "Error ❌"; }
};

function listenToDailyPhotos() {
    const today = new Date().toISOString().split('T')[0];
    onSnapshot(doc(db, "daily", today), (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            const imgA = document.getElementById("img-anil"), imgC = document.getElementById("img-camila");
            if(data.anil) imgA.src = data.anil;
            if(data.camila) imgC.src = data.camila;
            if(data.anil && data.camila) {
                imgA.classList.remove("locked"); imgC.classList.remove("locked");
            }
        }
    });
}

setInterval(update, 1000);
update();
