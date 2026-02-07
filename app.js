const startDate = new Date("2025-12-27T10:45:00");
const photos = ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg", "foto6.jpg", "foto7.jpg", "foto8.jpg", "foto9.jpg", "foto10.jpg"];
let currentPhotoIndex = 0;

// 📸 Albüm
function changePhoto() {
    const el = document.getElementById("album-photo");
    if (!el) return;
    el.style.opacity = 0;
    setTimeout(() => {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        el.src = photos[currentPhotoIndex];
        el.style.opacity = 1;
    }, 500);
}
setInterval(changePhoto, 4000);

// ✨ Kalpler
setInterval(() => {
    const h = document.createElement("div");
    h.innerHTML = "❤️"; h.className = "floating-heart";
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = (Math.random() * 15 + 10) + "px";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 6000);
}, 800);

// 📦 Sandık Mesajları
const vaults = [
    { date: "2026-02-15", icon: "📦", title: "El Espacio", text: "La distancia no es un muro, es solo un puente que estamos construyendo. Aunque mis ojos no te vean, mi alma te siente en cada latido. Te amo." },
    { date: "2026-02-22", icon: "✉️", title: "Anhelo", text: "Extrañarte es la forma más dulce de recordarme cuánto te quiero. Cada día que pasa es un día menos para nuestro próximo abrazo. Eres mi hogar." },
    { date: "2026-03-01", icon: "📜", title: "Unión", text: "Nuestras almas hablan el mismo idioma, más allá de cualquier frontera o creencia. Lo que Dios unió con amor, nada lo puede separar. Te elijo siempre." },
    { date: "2026-03-08", icon: "🌸", title: "Poesía", text: "Eres la melodía que calma mi ruido. Si el tiempo fuera arena, detendría el reloj solo para contemplar tu luz un segundo más. Mi musa eterna." },
    { date: "2026-03-15", icon: "💎", title: "Promesa", text: "No te prometo un camino sin piedras, pero te prometo que nunca caminarás sola. Mi mano siempre estará buscando la tuya, incluso a la distancia." },
    { date: "2026-03-22", icon: "🌊", title: "Océanos", text: "Los mares separan tierras, pero unen destinos. Cada vez que sientas el viento, es un beso mío cruzando el Atlántico para llegar a tus mejillas." },
    { date: "2026-03-29", icon: "🏠", title: "Destino", text: "Milán y Bogotá están conectadas por un hilo rojo que nunca se romperá. Fuimos escritos por las estrellas para encontrarnos en este tiempo." },
    { date: "2026-04-15", icon: "🎁", title: "Especial", text: "¡Feliz cumpleaños, mi Camila! 🎂 Eres el milagro más grande de mi vida. Hoy el cielo brilla más porque tú naciste. Mi mayor regalo es tu amor. ¡Te amo!", isBirthday: true }
];

function initVaults() {
    const container = document.getElementById("vault-container");
    const now = new Date();
    vaults.forEach(v => {
        const chest = document.createElement("div");
        chest.className = `chest ${v.isBirthday ? 'birthday' : ''}`;
        const unlockDate = new Date(v.date);
        if (now < unlockDate) {
            chest.classList.add("locked");
            chest.innerHTML = "🔒";
            chest.onclick = () => alert(`Disponible el ${v.date}`);
        } else {
            chest.innerHTML = v.icon;
            chest.onclick = () => showModal(v.text);
        }
        container.appendChild(chest);
    });
}

function showModal(txt) {
    const m = document.createElement("div");
    m.className = "modal";
    m.innerHTML = `<div class="modal-content"><p>${txt}</p><button onclick="this.parentElement.parentElement.remove()" style="margin-top:20px; background:#ff4d4d; color:white; border:none; padding:10px 20px; border-radius:15px;">Cerrar</button></div>`;
    document.body.appendChild(m);
}

// 🔢 Sayaç & Mesajlar
const messages = [
    "Este widget no pide nada. Solo está aquí. Como yo 🤍", "Hoy pensé en ti sin razón. Y me gustó.",
    "Tu nombre se siente tranquilo en mi mente.", "Aunque estemos lejos, hay algo que nunca se mueve.",
    // ... (Diğer tüm mesajları buraya eklersin, liste çok uzun olduğu için kısaltıldı)
    "108 días… esto es solo el comienzo. 🤍"
];

function updateWidget() {
    const now = new Date();
    const bogota = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
    if (bogota.getHours() >= 18 || bogota.getHours() < 6) document.body.classList.add("night-mode");
    else document.body.classList.remove("night-mode");

    const diff = Math.floor((bogota - startDate) / 1000);
    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    document.getElementById("counter").innerHTML = `<div>${d}d</div><div>${h}h</div><div>${m}m</div><div style="color:#ff4d4d">${s}s</div>`;
    
    const dayIndex = Math.floor((new Date(bogota.getFullYear(), bogota.getMonth(), bogota.getDate()) - startDate) / 86400000);
    document.getElementById("message").innerText = messages[dayIndex] || "Sigo aquí, contigo.";
}

// Sayfa Geçişleri
document.getElementById("star-btn").onclick = () => { document.getElementById("main-page").classList.add("hidden"); document.getElementById("star-map").classList.remove("hidden"); };
document.getElementById("back-btn").onclick = () => { document.getElementById("star-map").classList.add("hidden"); document.getElementById("main-page").classList.remove("hidden"); };

window.onload = () => { initVaults(); updateWidget(); setInterval(updateWidget, 1000); };
