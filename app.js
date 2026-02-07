// 1. FONKSİYONLAR (Sayfa geçişleri en üstte olmalı)
function openStarMap() {
    const mainPage = document.getElementById("main-page");
    const starMap = document.getElementById("star-map-page");
    if (mainPage && starMap) {
        mainPage.classList.add("hidden");
        starMap.classList.remove("hidden");
    }
}

function closeStarMap() {
    const mainPage = document.getElementById("main-page");
    const starMap = document.getElementById("star-map-page");
    if (mainPage && starMap) {
        starMap.classList.add("hidden");
        mainPage.classList.remove("hidden");
    }
}

// 2. AYARLAR VE VERİLER
const startDate = new Date("2025-12-27T10:45:00");
const photos = ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg", "foto6.jpg", "foto7.jpg", "foto8.jpg", "foto9.jpg", "foto10.jpg"];
let currentIdx = 0;

const messages = [
    "Este widget no pide nada. Solo está aquí. Como yo 🤍", "Hoy pensé en ti sin razón. Y me gustó.",
    "Tu nombre se siente tranquilo en mi mente.", "Aunque estemos lejos, hay algo que nunca se mueve.",
    "Si supieras cuántas veces sonrío por ti...", "No es costumbre. Es elección.",
    "Hay días normales, y días donde apareces tú.", "Te pienso en silencio, y eso dice mucho.",
    "No necesito escribirte. Ya estás aquí.", "Diez días... y ya pareces una costumbre bonita.",
    "Hay personas que llegan despacio. Tú te quedaste.", "Me gusta cómo existes en mi vida.",
    "No prometo perfección. Prometo verdad.", "A veces el amor no habla. Acompaña.",
    "Quince días... y ya te siento hogar.", "Milán aún no pasa, pero algo ya empieza.",
    "Hoy el mundo fue un poco más suave.", "No hiciste nada especial hoy. Y aún así...",
    "Hay calma cuando pienso en ti.", "Si esto es esperar, no me quejo.",
    "Tu recuerdo no pesa. Flota.", "Me gustas sin prisa.",
    "El tiempo contigo no corre. Camina.", "A veces cierro los ojos y estás ahí.",
    "No necesito entenderlo todo.", "Hay conexiones que no piden explicación.",
    "Hoy fue uno de esos días contigo en el fondo.", "No eres ruido. Eres fondo.",
    "Si te nombro, sonrío.", "Treinta días... sigo aquí.",
    "El amor no siempre grita.", "A veces solo se sienta al lado.",
    "Pensé en Bogotá hoy.", "Pensé en tus manos.",
    "No te pienso menos por no verte.", "Hay ausencias que se sienten llenas.",
    "Hoy no pasó nada... excepto tú.", "No me canso de elegirte.",
    "Milán se acerca sin saberlo.", "Cuarenta días. Tranquilos. Firmes.",
    "Me gusta cómo eres sin intentar.", "Hay belleza en tu forma de estar.",
    "No todo amor quema. Algunos abrigan.", "Hoy el día fue mejor contigo en él.",
    "No necesito razones para pensarte.", "El tiempo no nos separa. Nos prueba.",
    "Hay recuerdos que aún no existen.", "Y aun así ya duelen bonito.",
    "Me quedo.", "Cincuenta días... sigo.",
    "A veces no hay que decir nada. Solo estar.", "Eres mi notificación favorita.",
    "No sé hacia dónde vamos, pero me gusta el camino.", "Hoy el café supo a ti. Dulce y necesario.",
    "Hay personas que son canciones. Tú eres mi playlist entera.", "No te busqué, pero te encontré en el momento exacto.",
    "Sesenta días... y cada uno ha valido la pena.", "Tu risa es mi sonido favorito en este mundo.",
    "Me gusta la paz que me das sin pedir nada a cambio.", "Eres el 'te quiero' que nunca me canso de sentir.",
    "No es la distancia, es lo que sentimos mientras la acortamos.", "A veces el amor es un mensaje a las 3 de la tarde.",
    "Setenta días... y sigo eligiéndote a ti.", "No te necesito para vivir, pero contigo vivo mejor.",
    "Eres ese rincón de luz en mis días grises.", "Pensarte es como un abrazo a distancia.",
    "No hay kilómetros que puedan con lo que hemos creado.", "Hoy Bogotá se sintió más cerca de ti.",
    "Ochenta días... y la magia sigue intacta.", "Me gusta cómo me haces sentir, incluso sin estar cerca.",
    "Eres mi pensamiento más recurrente.", "A veces el amor es saber que alguien te espera.",
    "No importa el mapa, importa el destino. Y mi destino eres tú.", "Gracias por ser mi lugar seguro.",
    "Noventa días... tres meses de pura verdad.", "Cada día es una página nueva. Me gusta nuestra historia.",
    "No eres un sueño, eres mi realidad favorita.", "Incluso en el silencio, te escucho.",
    "No te idealizo, te elijo.", "Eres mi pausa favorita en este mundo ruidoso.",
    "Cien días... y mi corazón sigue diciendo tu nombre.", "Me gusta lo que somos, así sin filtros.",
    "Hay días que solo se arreglan hablándote.", "Eres el motivo de mi mejor sonrisa hoy.",
    "No importa qué tan lejos, te llevo en cada paso.", "Tu paz es mi refugio favorito.",
    "Eres la casualidad más bonita de mi vida.", "A veces solo necesito saber que estás ahí.",
    "A veces lo más valiente es quedarse.", "Contigo la vida no pesa.",
    "Eres mi mejor 'hola' y mi 'adiós' más difícil.", "Tu amor es mi calma en medio del ruido.",
    "No eres perfecta, eres real. Y eso me encanta.", "Gracias por elegirme a mí también.",
    "108 días... y esto es solo el comienzo. 🤍"
];

const vaults = [
    { d: "2026-02-10", i: "✉️", t: "La distancia no es un muro, es solo un puente que estamos construyendo. Aunque mis ojos no te vean, mi alma te siente en cada latido. Te amo." },
    { d: "2026-02-17", i: "📦", t: "Extrañarte es la forma más dulce de recordarme cuánto te quiero. Cada día que pasa es un día menos para nuestro próximo abrazo. Eres mi hogar." },
    { d: "2026-02-24", i: "📜", t: "Nuestras almas hablan el mismo idioma. Lo que sentimos es más fuerte que cualquier frontera o creencia. Nuestra unión es eterna." },
    { d: "2026-03-03", i: "🌸", t: "Eres la melodía que calma mi ruido. Si el tiempo fuera arena, detendría el reloj solo para contemplar tu luz un segundo más." },
    { d: "2026-03-10", i: "💎", t: "Te elijo hoy y siempre. Mi promesa es cuidarte y estar contigo, sin importar los kilómetros que nos separen hoy." },
    { d: "2026-03-17", i: "🌊", t: "Los mares separan tierras, pero unen destinos. Mi amor por ti cruza el océano cada mañana para despertarte con un beso." },
    { d: "2026-03-24", i: "🏠", t: "Bogotá y Milán están conectadas por un hilo rojo invisible. Fuimos escritos por las estrellas para encontrarnos en este tiempo." },
    { d: "2026-04-15", i: "🎁", t: "¡Feliz cumpleaños, mi Camila! 🎂 Eres el regalo más hermoso de mi vida. Hoy celebro tu existencia y nuestro amor. Te amo infinitamente.", b: true }
];

// 3. ÇALIŞTIRICI FONKSİYONLAR
function update() {
    const now = new Date();
    const bogota = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    
    // Gece/Gündüz Modu
    if(bogota.getHours() >= 18 || bogota.getHours() < 6) document.body.classList.add("night-mode");
    else document.body.classList.remove("night-mode");

    // Sayaç
    const diff = Math.floor((bogota - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    
    const counterEl = document.getElementById("counter");
    if (counterEl) {
        counterEl.innerHTML = `<span>${d}d</span><span>${h}h</span><span>${m}m</span><span style="color:#ff4d4d">${s}s</span>`;
    }
    
    // Mesajlar
    const dayIndex = Math.floor((new Date(bogota.getFullYear(), bogota.getMonth(), bogota.getDate()) - startDate)/86400000);
    const messageEl = document.getElementById("message");
    if (messageEl) {
        messageEl.innerText = messages[dayIndex] || "Contigo, en cada latido.";
    }
}

function initVaults() {
    const container = document.getElementById("vault-container");
    if (!container) return;
    container.innerHTML = ""; // Tekrar eklemeyi önle
    const now = new Date();
    vaults.forEach(v => {
        const div = document.createElement("div");
        div.className = `chest ${v.b ? 'birthday' : ''}`;
        if (now < new Date(v.d)) {
            div.innerHTML = "🔒"; div.classList.add("locked");
            div.onclick = () => alert("Disponible el " + v.d);
        } else {
            div.innerHTML = v.i;
            div.onclick = () => {
                const m = document.createElement("div");
                m.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;justify-content:center;align-items:center;z-index:3000;padding:30px;color:white;text-align:center;";
                m.innerHTML = `<div><p style='line-height:1.6;font-size:18px'>${v.t}</p><br><button onclick="this.parentElement.parentElement.remove()" style="padding:10px 20px; border-radius:10px; border:none; background:#ff4d4d; color:white; cursor:pointer">Cerrar</button></div>`;
                document.body.appendChild(m);
            };
        }
        container.appendChild(div);
    });
}

// Albüm Geçişi
setInterval(() => {
    const img = document.getElementById("album-photo");
    if(img) {
        img.style.opacity = 0;
        setTimeout(() => {
            currentIdx = (currentIdx + 1) % photos.length;
            img.src = photos[currentIdx];
            img.style.opacity = 1;
        }, 500);
    }
}, 4000);

// Süzülen Kalpler
setInterval(() => {
    const h = document.createElement("div");
    h.innerHTML = "❤️"; h.className = "floating-heart";
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = (Math.random() * 15 + 10) + "px";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 6000);
}, 1000);

// SAYFA YÜKLENDİĞİNDE BAŞLAT
window.onload = () => {
    update();
    initVaults();
    setInterval(update, 1000);
};
