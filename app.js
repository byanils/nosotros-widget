import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// --- CONFIG & CONSTANTS ---
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
const myApiKey = "2e2dcf335d4c97a7c182b0c041eea672";
const startDate = new Date("2025-12-27T10:45:00");
const photos = ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg", "foto6.jpg", "foto7.jpg", "foto8.jpg", "foto9.jpg", "foto10.jpg"];
let currentIdx = 0;
let currentUser = "";

const messages = [
    "Este widget no pide nada. Solo está aquí. Como yo 🤍", "Hoy pensé en ti sin razón. Y me gustó.",
    "Tu nombre se siente tranquilo en mi mente.", "Aunque estemos lejos, hay algo que nunca se mueve.",
    "Si supieras cuántas veces sonrío por ti...", "No es costumbre. Es elección.",
    "Hay días normales, y días donde apareces tú.", "Te pienso en silencio, y eso dice mucho.",
    "No necesito escribirte. Ya estás aquí.", "Diez días... y ya pareces una costumbre bonita.",
    "Hay personas que llegan despacio. Tú te quedaste.", "Me gusta cómo existes en mi vida.",
    "No prome-to perfección. Prometo verdad.", "A veces el amor no habla. Acompaña.",
    "Quince días... ve ya te siento hogar.", "Milán aún no pasa, pero algo ya empieza.",
    "Hoy el world fue un poco más suave.", "No hiciste nada spezial hoy. Y aún así...",
    "Hay calma cuando pienso en ti.", "Si esto es esperar, no me quejo.",
    "Tu recuerdo no pesa. Flota.", "Me gustas sin prisa.",
    "El tempo contigo no corre. Camina.", "A veces cierro los ojos ve estás ahí.",
    "No necesito entenderlo todo.", "Hay conexiones ki no piden explicación.",
    "Hoy fue uno de esos días contigo en el fondo.", "No eres ruido. Eres fondo.",
    "Si te nombro, sonrío.", "Treinta días... sigo aquí.",
    "El amor no siempre grita.", "A veces solo se sienta al lado.",
    "Pensé en Bogotá hoy.", "Pensé en tus manos.",
    "No te pienso menos por no verte.", "Hay ausencias ki se sienten llenas.",
    "Hoy no pasó nada... excepto tú.", "No me canso de elegirte.",
    "Milán se acerca sin saberlo.", "Cuarenta días. Tranquilos. Firmes.",
    "Me gusta cómo eres sin intentar.", "Hay bellezza en tu forma de estar.",
    "No todo amor quema. Algunos abrigan.", "Hoy el día fue mejor contigo en él.",
    "No nezesito razones para pensarte.", "El tiempo no nos separa. Nos prueba.",
    "Hay recuerdos ki aún no existen.", "Y aun así ya duelen bonito.",
    "Me quedo.", 
    `Hoy es San Valentín 🤍
Y no estás aquí, pero estás en todo.
En cada segundo que pasa,
en cada recuerdo de Milán,
en cada latido silencioso.
Feliz San Valentín, Camila.`,
    "A veces no hay ki decir nada. Solo estar.", "Eres mi notificación favorita.",
    "No sé hazia dónde vamos, pero me gusta el camino.", "Hoy el café supo a ti. Dulce ve nezesario.",
    "Hay personas ki son canziones. Tú eres mi playlist entera.", "No te buzké, pero te encontré en el momento exacto.",
    "Sesenta días... ve cada uno ha valido la pena.", "Tu risa es mi sonido favorito en este world.",
    "Me gusta la paz ki me das sin pedir nada a cambio.", "Eres el 'te quiero' ki nunca me canso de sentir.",
    "No es la distanzia, es lo ki sentimos mientras la acortamos.", "A veces el amor es un mesaj a las 3 de la tarde.",
    "Setenta días... ve sigo eligiéndote a ti.", "No te nezesito para vivir, pero contigo vivo mejor.",
    "Eres ese rincón de luz en mis días grises.", "Pensarte es como un abrazo a distanzia.",
    "No hay kilómetros ki puedan con lo ki hemos creado.", "Hoy Bogotá se sintió más cerca de ti.",
    "Ochenta días... ve la magia sigue intacta.", "Me gusta cómo me hazes sentir, incluso sin estar cerca.",
    "Eres mi pensamiento más recurrente.", "A veces el amor es saber ki alguien te espera.",
    "No importa el mapa, importa el destino. Y mi destino eres tú.", "Grazias por ser mi lugar seguro.",
    "Noventa días... tres meses de pura verdad.", "Cada día es una página nueva. Me gusta nuestra historia.",
    "No eres un sueño, eres mi reality favorita.", "Incluso en el silenzio, te escucho.",
    "No te idealizo, te elijo.", "Eres mi pausa favorita en este world ruidoso.",
    "Cien días... ve mi corazón sigue diziendo tu nombre.", "Me gusta lo ki somos, así sin filtros.",
    "Hay días ki solo se arreglan hablándote.", "Eres el motivo de mi mejor sonrisa hoy.",
    "No importa qué tan lejos, te llevo en cada paso.", "Tu paz mi refugio favorito.",
    "Eres la casualidad más bonita de mi vida.", "A veces solo nezesito saber ki estás ahí.",
    "A veces lo más valiente es quedarse.", "Contigo la vida no pesa.",
    "Eres mi mejor 'hola' ve mi 'adiós' daha diffizil.", "Tu amor es mi calma en medio del ruido.",
    "No eres perfecta, eres real. Y eso me encanta.", "Grazias por elegirme a mí de nuevo.",
    "108 días... ve esto es solo el comienzo. 🤍"
];

const vaults = [
    { d: "2026-02-15", t: "Las distancias solo están en los mapas. Tu lugar en mi corazón es tan firme. Te amo." },
    { d: "2026-02-22", t: "A veces, solo escuchar tu voz borra todo el cansancio del día." },
    { d: "2026-03-01", t: "Mi alma solo se siente 'en casa' a tu lado. Eres mi puerto más seguro." },
    { d: "2026-03-08", t: "Cada día me despierto y elijo amarte de nuevo. Es la decisión más hermosa." },
    { d: "2026-03-15", t: "Cuando cierro los ojos, el vacío desaparece. Solo quedamos tú y yo." },
    { d: "2026-03-22", t: "Cada segundo que pasa nos acerca un paso más a ese gran abrazo." },
    { d: "2026-03-29", t: "Nuestra historia no conoce fronteras. Miramos el mismo cielo." },
    { d: "2026-04-05", t: "Tu amor es la melodía más tranquila dentro de mí." },
    { d: "2026-04-15", t: "¡Feliz Cumpleaños, mi amor! Mi corazón late hoy totalmente a tu lado.", b: true, lock: "El tesoro espera el 15 de Abril... 🌌✨" }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- APP NAVIGATION ---
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

// --- PHOTO LOGIC (IMGBB + FIREBASE) ---
window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const msg = document.getElementById("photo-status-msg");
    msg.innerText = "Subiendo... ⏳";
    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?expiration=86400&key=${imgbbKey}`, { method: "POST", body: formData });
        const json = await res.json();
        const url = json.data.url;
        const today = new Date().toLocaleDateString('en-CA');
        await setDoc(doc(db, "daily", today), { [currentUser]: url }, { merge: true });
        msg.innerText = "¡Subido! ❤️";
    } catch (e) { msg.innerText = "Error ❌"; }
};

function listenToDailyPhotos() {
    const today = new Date().toLocaleDateString('en-CA');
    onSnapshot(doc(db, "daily", today), (snap) => {
        const imgA = document.getElementById("img-anil");
        const imgC = document.getElementById("img-camila");
        const statusMsg = document.getElementById("photo-status-msg");
        
        if (snap.exists()) {
            const data = snap.data();
            if(data.anil) imgA.src = data.anil;
            if(data.camila) imgC.src = data.camila;
            if(data.anil && data.camila) {
                imgA.classList.remove("locked"); imgC.classList.remove("locked");
                statusMsg.innerText = "✨ ¡Desbloqueado! ✨";
            } else { statusMsg.innerText = "Falta una selfie... 📸"; }
        } else { statusMsg.innerText = "Ninguna selfie hoy. 🔥"; }
    });
}

// --- UNIVERSE LOGIC ---
function initUniverse() {
    const starContainer = document.getElementById("stars-container");
    const vaultContainer = document.getElementById("vault-container");
    if (vaultContainer.innerHTML !== "") return;

    for (let i = 0; i < 80; i++) {
        const s = document.createElement("div"); s.className = "star";
        s.style.position = "absolute"; s.style.width = "2px"; s.style.height = "2px"; s.style.background = "white";
        s.style.left = Math.random() * 100 + "vw"; s.style.top = Math.random() * 100 + "vh";
        starContainer.appendChild(s);
    }

    vaults.forEach((v, index) => {
        const div = document.createElement("div"); 
        div.className = `chest ${v.b ? 'birthday' : ''}`;
        const ratio = index / (vaults.length - 1);
        div.style.top = (20 + (ratio * 58)) + "%";
        div.style.left = (82 - (ratio * 64) + (Math.sin(ratio * Math.PI) * 15)) + "%";
        div.onclick = (e) => { 
            e.stopPropagation(); 
            if (new Date() < new Date(v.d)) alert(v.b ? v.lock : "Se abrirá el: " + v.d); 
            else alert(v.t); 
        };
        vaultContainer.appendChild(div);
    });
}

// --- UPDATES ---
function update() {
    const now = new Date();
    const milan = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
    const bogota = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    
    document.getElementById("milan-time").innerText = milan.getHours() + ":" + String(milan.getMinutes()).padStart(2, '0');
    document.getElementById("bogota-time").innerText = bogota.getHours() + ":" + String(bogota.getMinutes()).padStart(2, '0');

    if(bogota.getHours() >= 18 || bogota.getHours() < 6) document.body.classList.add("night-mode");
    else document.body.classList.remove("night-mode");

    const diff = Math.floor((now - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    document.getElementById("counter").innerHTML = `<span>${d}d</span><span>${h}h</span><span>${m}m</span><span style="color:#ff4d4d">${s}s</span>`;
    
    const dayDiff = Math.floor((now - startDate) / 86400000);
    document.getElementById("message").innerText = messages[dayDiff] || "Contigo, siempre. 🤍";
}

async function fetchWeather() {
    try {
        const rM = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Milan,it&units=metric&appid=${myApiKey}`);
        const dM = await rM.json();
        const rB = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bogota,co&units=metric&appid=${myApiKey}`);
        const dB = await rB.json();
        if(dM.main) document.getElementById("milan-temp").innerText = `${Math.round(dM.main.temp)}°C`;
        if(dB.main) document.getElementById("bogota-temp").innerText = `${Math.round(dB.main.temp)}°C`;
    } catch(e) {}
}

function createFloatingHeart() {
    const heart = document.createElement("div"); heart.innerHTML = "❤️"; heart.className = "floating-heart";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 10) + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
}

document.addEventListener('mousemove', (e) => {
    const s = document.createElement("div"); s.className = "sparkle";
    s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
});

// Slideshow
setInterval(() => {
    const img = document.getElementById("album-photo");
    if(img && document.getElementById("main-page").classList.contains("active")) {
        img.style.opacity = 0;
        setTimeout(() => { currentIdx = (currentIdx + 1) % photos.length; img.src = photos[currentIdx]; img.style.opacity = 1; }, 500);
    }
}, 4000);

setInterval(update, 1000);
setInterval(createFloatingHeart, 600);
fetchWeather();
update();
