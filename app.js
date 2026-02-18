/**
 * NUESTRO UNIVERSO - Core Application logic
 * Version: 2.0 (Optimized for Modular Assets)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Veri dosyalarından içe aktarma
import { messages } from "./messages.js";
import { vaults } from "./vaults.js";

// --- Yapılandırma ---
const firebaseConfig = {
    apiKey: "AIzaSyCv12bIT9P0Ezho4CidHYfRLMqCN3LVq1o",
    authDomain: "nuestro-universo-70d52.firebaseapp.com",
    projectId: "nuestro-universo-70d52",
    storageBucket: "nuestro-universo-70d52.firebasestorage.app",
    messagingSenderId: "979401273604",
    appId: "1:979401273604:web:ca547072488f746ca7e051"
};

const imgbbKey = "072b34aeea28d1eab7f3865e6dcae66b";
const startDate = new Date("2025-12-27T10:45:00");

// App Başlatma
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let currentUser = "";

// --- Global Fonksiyonlar (HTML onclick için) ---

window.loginUser = (user) => {
    currentUser = user;
    document.getElementById("login-overlay").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    listenToDailyPhotos();
    createStars(); // Arka plan yıldızlarını oluştur
};

window.goToUniverse = () => {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("star-map-page").classList.add("active");
    initUniverse(); // Galaksi yolunu oluştur
};

window.goToHome = () => {
    document.getElementById("star-map-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
};

window.openPhotoModal = () => document.getElementById("photo-daily-modal").style.display = "block";
window.closePhotoModal = () => document.getElementById("photo-daily-modal").style.display = "none";

// --- Sayaç Sistemi ---

function updateCounter() {
    const now = new Date();
    const diff = Math.floor((now - startDate) / 1000);
    
    if (diff < 0) return;

    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    
    const counterEl = document.getElementById("counter");
    if (counterEl) {
        counterEl.innerHTML = `
            <div class="time-unit"><span>${d}</span><small>DÍAS</small></div>
            <div class="time-unit"><span>${h}</span><small>HORAS</small></div>
            <div class="time-unit"><span>${m}</span><small>MIN</small></div>
            <div class="time-unit" style="border: 1px solid var(--primary)"><span>${s}</span><small>SEG</small></div>
        `;
    }

    const dayDiff = Math.floor((now - startDate) / 86400000);
    const messageEl = document.getElementById("message");
    if (messageEl) {
        messageEl.innerText = messages[dayDiff] || "Cada día es una nueva estrella en nuestro cielo. 🤍";
    }
}

// --- Görsel Efektler ---

function createStars() {
    const container = document.getElementById("stars-container");
    if (!container || container.innerHTML !== "") return;
    
    for(let i=0; i<150; i++) {
        const star = document.createElement("div");
        const size = Math.random() * 2 + 1;
        star.style.position = "absolute";
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.background = "white";
        star.style.borderRadius = "50%";
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.opacity = Math.random();
        star.style.boxShadow = `0 0 ${size * 2}px white`;
        star.style.zIndex = "0";
        container.appendChild(star);
    }
}

// --- Evren Haritası (S Yolu) ---

function initUniverse() {
    const container = document.getElementById("vault-container");
    if (!container || container.children.length > 0) return;

    vaults.forEach((v, i) => {
        const div = document.createElement("div");
        div.className = "chest";
        
        // S-yolu hesaplaması (Daha dengeli bir yayılım)
        const progress = i / (vaults.length - 1 || 1);
        const yPos = 10 + (progress * 80); // %10 ile %90 arası dikey yayılım
        const xPos = 50 + (Math.sin(progress * Math.PI * 3) * 30); // Sinüs dalgası ile S şekli
        
        div.style.top = yPos + "%";
        div.style.left = xPos + "%";
        div.setAttribute("data-date", v.d);
        div.innerHTML = "✨";

        // Kilit kontrolü
        const isLocked = new Date() < new Date(v.d);
        if(isLocked) {
            div.style.filter = "grayscale(1) brightness(0.4)";
            div.style.boxShadow = "none";
        }

        div.onclick = () => {
            if (isLocked) {
                alert("🔒 Este momento está guardado bajo llave hasta el " + v.d);
            } else {
                alert("💖 Mensaje del Destino:\n\n" + v.t);
            }
        };
        container.appendChild(div);
    });
}

// --- Fotoğraf Yükleme ve Senkronizasyon ---

function getTodayKey() {
    const d = new Date();
    // Firebase döküman ismi için format: 2026-2-18
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const status = document.getElementById("photo-status-msg");
    const originalText = status.innerText;
    status.innerText = "Subiendo a las estrellas... ⏳";

    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        // ImgBB Upload
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { 
            method: "POST", 
            body: formData 
        });
        const json = await res.json();
        
        if(json.success) {
            const today = getTodayKey();
            // Firebase Güncelleme
            await setDoc(doc(db, "daily", today), { 
                [currentUser]: json.data.url 
            }, { merge: true });
            
            status.innerText = "¡Foto enviada con éxito! ✨";
        } else {
            throw new Error("Upload failed");
        }
    } catch (e) { 
        status.innerText = "Error al subir ❌"; 
        setTimeout(() => status.innerText = originalText, 3000);
    }
};

function listenToDailyPhotos() {
    const today = getTodayKey();
    onSnapshot(doc(db, "daily", today), (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            const imgA = document.getElementById("img-anil");
            const imgC = document.getElementById("img-camila");
            const status = document.getElementById("photo-status-msg");
            
            // Placeholder'ları gerçek fotolarla değiştir
            if(data.anil) imgA.src = data.anil;
            if(data.camila) imgC.src = data.camila;
            
            // İkisi de yüklendiyse kilidi kaldır
            if(data.anil && data.camila) {
                imgA.classList.remove("locked");
                imgC.classList.remove("locked");
                status.innerHTML = "<strong>✨ ¡Momento Desbloqueado! ✨</strong>";
            }
        }
    });
}

// --- Başlatıcılar ---
setInterval(updateCounter, 1000);
updateCounter();
