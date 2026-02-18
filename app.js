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

// BUTONLARI ÇALIŞTIRAN GLOBAL BAĞLANTILAR
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

// SAYAÇ
function update() {
    const now = new Date();
    const diff = Math.floor((now - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    
    const counter = document.getElementById("counter");
    if(counter) {
        counter.innerHTML = `
            <div class="time-unit"><span>${d}</span><small>DÍAS</small></div>
            <div class="time-unit"><span>${h}</span><small>HORAS</small></div>
            <div class="time-unit"><span>${m}</span><small>MIN</small></div>
            <div class="time-unit"><span>${s}</span><small>SEG</small></div>
        `;
    }
    const msg = document.getElementById("message");
    if(msg) {
        const dayDiff = Math.floor((now - startDate) / 86400000);
        msg.innerText = messages[dayDiff] || "Cada día es un paso más en nuestra historia. 🤍";
    }
}

// ARKA PLAN YILDIZLARI
function createStars() {
    const container = document.getElementById("stars-container");
    if (container.innerHTML !== "") return;
    for(let i=0; i<150; i++) {
        const s = document.createElement("div");
        s.style.position = "absolute";
        s.style.width = Math.random() * 3 + "px";
        s.style.height = s.style.width;
        s.style.background = "white";
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.opacity = Math.random();
        s.style.borderRadius = "50%";
        container.appendChild(s);
    }
}

// SANDIKLARIN OLUŞTURULMASI (S YOLU)
function initUniverse() {
    const container = document.getElementById("vault-container");
    if (container.children.length > 0) return;

    vaults.forEach((v, i) => {
        const div = document.createElement("div");
        div.className = "chest";
        
        const progress = i / (vaults.length - 1 || 1);
        const yPos = 5 + (progress * 90); // Yükseklik %5'ten %95'e
        const xPos = 50 + (Math.sin(progress * Math.PI * 4) * 35); // S kıvrımı
        
        div.style.top = yPos + "%";
        div.style.left = xPos + "%";
        div.setAttribute("data-date", v.d);
        div.innerHTML = "🎁";

        div.onclick = (e) => {
            e.stopPropagation();
            if (new Date() < new Date(v.d)) {
                alert("🔒 Bloqueado hasta: " + v.d);
            } else {
                alert("💖 " + v.t);
            }
        };
        container.appendChild(div);
    });
}

// FOTOĞRAF YÜKLEME
window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const status = document.getElementById("photo-status-msg");
    status.innerText = "Subiendo a las estrellas... ⏳";
    
    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: "POST", body: formData });
        const json = await res.json();
        const today = new Date().toISOString().split('T')[0];
        
        await setDoc(doc(db, "daily", today), { [currentUser]: json.data.url }, { merge: true });
        status.innerText = "¡Foto enviada! ✨";
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
                imgA.classList.remove("locked"); 
                imgC.classList.remove("locked");
            }
        }
    });
}

setInterval(update, 1000);
update();
