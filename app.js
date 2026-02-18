import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// --- CONFIGURATION ---
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

// --- TÜM GÜNLÜK MESAJLAR ---
const messages = [
    "Este widget no pide nada. Solo está aquí. Como yo 🤍", "Hoy pensé en ti sin razón. Y me gustó.",
    "Tu nombre se siente tranquilo en mi mente.", "Aunque estemos lejos, hay algo que nunca se mueve.",
    "Si supieras cuántas veces sonrío por ti...", "No es costumbre. Es elección.",
    "Hay días normales, y días donde apareces tú.", "Te pienso en silencio, y eso dice mucho.",
    "No necesito escribirte. Ya estás aquí.", "Diez días... y ya pareces una costumbre bonita.",
    "Hay personas que llegan despacio. Tú te quedaste.", "Me gusta cómo existes en mi vida.",
    "No prome-to perfection. Prometo verdad.", "A veces el amor no habla. Acompaña.",
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
    `Hoy es San Valentín 🤍. No estás aquí, pero estás en todo. Feliz San Valentín, Camila.`,
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
    "Eres mi de pensamiento más recurrente.", "A veces el amor es saber ki alguien te espera.",
    "No importa el mapa, importa el destino. Y mi destino eres tú.", "Grazias por ser mi lugar seguro.",
    "Noventa días... tres meses de pura verdad.", "Cada día es una página nueva. Me gusta nuestra historia.",
    "No eres un sueño, eres mi reality favorita.", "Incluso en el silenzio, te escucho.",
    "No te idealizo, te elijo.", "Eres mi pausa favorita en este world ruidoso.",
    "Cien días... ve mi corazón sigue diziendo tu nombre.", "Me gusta lo ki somos, así sin filtros.",
    "Hay días ki solo se arreglan hablándote.", "Eres el motivo de mi de mejor sonrisa hoy.",
    "No importa qué tan lejos, te llevo en cada paso.", "Tu paz mi refugio favorito.",
    "Eres la casualidad más bonita de mi vida.", "A veces solo nezesito saber ki estás ahí.",
    "A veces lo más valiente es quedarse.", "Contigo la vida no pesa.",
    "Eres mi de mejor 'hola' ve mi 'adiós' daha diffizil.", "Tu amor es mi calma en medio del ruido.",
    "No eres perfecta, eres real. Y eso me encanta.", "Grazias por elegirme a mí de nuevo.",
    "108 días... ve esto es solo el comienzo. 🤍"
];

// --- EVREN SANDIKLARI ---
const vaults = [
    { d: "2026-02-15", t: "Las distancias solo están en los mapas. Tu lugar en mi corazón es tan firme. Te amo." },
    { d: "2026-02-22", t: "A veces, solo escuchar tu voz borra todo el cansancio del día." },
    { d: "2026-03-01", t: "Mi alma solo se siente 'en casa' a tu lado. Eres mi puerto más seguro." },
    { d: "2026-03-08", t: "Cada día me despierto y elijo amarte de nuevo. Es la decisión más hermosa." },
    { d: "2026-03-15", t: "Cuando cierro los ojos, el vacío desaparece. Solo quedamos tú y yo." },
    { d: "2026-03-29", t: "Nuestra historia no conoce fronteras. Miramos el mismo cielo." },
    { d: "2026-04-15", t: "¡Feliz Cumpleaños, mi amor! Mi tesoro eres tú.", b: true, lock: "Abrir el 15 de Abril... 🌌" }
];

// --- INITIALIZE ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- NAVIGATION ---
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

// --- SAYAÇ VE SAAT ---
function update() {
    const now = new Date();
    
    // Saatler
    const milanTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
    const bogotaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    
    document.getElementById("milan-time").innerText = milanTime.getHours() + ":" + String(milanTime.getMinutes()).padStart(2, '0');
    document.getElementById("bogota-time").innerText = bogotaTime.getHours() + ":" + String(bogotaTime.getMinutes()).padStart(2, '0');

    // Büyük Sayaç
    const diff = Math.floor((now - startDate) / 1000);
    const d = Math.floor(diff/86400);
    const h = Math.floor((diff%86400)/3600);
    const m = Math.floor((diff%3600)/60);
    const s = diff%60;
    
    document.getElementById("counter").innerHTML = `
        <span>${d}<small>Gün</small></span>
        <span>${h}<small>Saat</small></span>
        <span>${m}<small>Dak</small></span>
        <span style="color:#ff4d4d">${s}<small>Sn</small></span>
    `;

    // Günlük Mesaj
    const dayDiff = Math.floor((now - startDate) / 86400000);
    document.getElementById("message").innerText = messages[dayDiff] || "Contigo, siempre. 🤍";
}

// --- HAVA DURUMU ---
async function fetchWeather() {
    try {
        const rM = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Milan,it&units=metric&appid=${myApiKey}`);
        const dM = await rM.json();
        const rB = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bogota,co&units=metric&appid=${myApiKey}`);
        const dB = await rB.json();
        if(dM.main) document.getElementById("milan-temp").innerText = `${Math.round(dM.main.temp)}°C`;
        if(dB.main) document.getElementById("bogota-temp").innerText = `${Math.round(dB.main.temp)}°C`;
    } catch(e) { console.error("Hava durumu çekilemedi."); }
}

// --- EVREN DÜZENİ ---
function initUniverse() {
    const vaultContainer = document.getElementById("vault-container");
    if (vaultContainer.innerHTML !== "") return;

    // Sandıkları Bogotá'dan Milán'a doğru diyagonal diz
    vaults.forEach((v, index) => {
        const div = document.createElement("div");
        div.className = "chest";
        const ratio = index / (vaults.length - 1);
        
        // Çapraz pozisyonlama: Sol alt (Bogota) -> Sağ üst (Milan)
        div.style.bottom = (20 + (ratio * 60)) + "%";
        div.style.left = (20 + (ratio * 60)) + "%";

        div.onclick = (e) => {
            e.stopPropagation();
            if (new Date() < new Date(v.d)) alert("🔒 Se abrirá el: " + v.d);
            else alert("❤️ " + v.t);
        };
        vaultContainer.appendChild(div);
    });

    // Yıldızlar
    const starWrap = document.getElementById("stars-container");
    for(let i=0; i<100; i++) {
        const s = document.createElement("div");
        s.className = "star";
        s.style.left = Math.random() * 100 + "vw";
        s.style.top = Math.random() * 100 + "vh";
        s.style.opacity = Math.random();
        starWrap.appendChild(s);
    }
}

// --- FOTOĞRAF YÖNETİMİ ---
window.uploadSelfie = async (input) => {
    if(!input.files[0]) return;
    const status = document.getElementById("photo-status-msg");
    status.innerText = "Subiendo... ⏳";

    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?expiration=86400&key=${imgbbKey}`, { method: "POST", body: formData });
        const json = await res.json();
        const today = new Date().toLocaleDateString('en-CA');
        await setDoc(doc(db, "daily", today), { [currentUser]: json.data.url }, { merge: true });
        status.innerText = "¡Listo! ❤️";
    } catch (e) { status.innerText = "Error ❌"; }
};

function listenToDailyPhotos() {
    const today = new Date().toLocaleDateString('en-CA');
    onSnapshot(doc(db, "daily", today), (snap) => {
        const data = snap.data() || {};
        const imgA = document.getElementById("img-anil"), imgC = document.getElementById("img-camila");
        if(data.anil) imgA.src = data.anil;
        if(data.camila) imgC.src = data.camila;
        if(data.anil && data.camila) {
            imgA.classList.remove("locked");
            imgC.classList.remove("locked");
            document.getElementById("photo-status-msg").innerText = "✨ ¡Desbloqueado! ✨";
        }
    });
}

// --- START ---
setInterval(update, 1000);
fetchWeather();
update();
