// SAYFA KONTROLLERİ
function openStarMap() {
    document.getElementById("main-page").classList.add("hidden");
    document.getElementById("star-map-page").classList.remove("hidden");
}
function closeStarMap() {
    document.getElementById("star-map-page").classList.add("hidden");
    document.getElementById("main-page").classList.remove("hidden");
}

const startDate = new Date("2025-12-27T10:45:00");
const photos = ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg", "foto6.jpg", "foto7.jpg", "foto8.jpg", "foto9.jpg", "foto10.jpg"];
let currentIdx = 0;

// 108 MESAJ LİSTESİ
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

// HAZİNELER VE GİZEMLİ KİLİT MESAJLARI
const vaults = [
    { d: "2026-02-15", i: "💰", t: "La distancia no es un muro, es solo un puente que estamos construyendo. Te amo.", lock: "Un secreto se está cocinando en las estrellas..." },
    { d: "2026-02-22", i: "💰", t: "Extrañarte es la forma más dulce de recordarme cuánto te quiero. Eres mi hogar.", lock: "El destino guarda algo para ti aquí." },
    { d: "2026-03-01", i: "💰", t: "Nuestras almas hablan el mismo idioma. Nuestra unión es eterna.", lock: "Shhh... este susurro aún no puede ser escuchado." },
    { d: "2026-03-15", i: "💰", t: "Te elijo hoy y siempre. Mi promesa es cuidarte sin importar los kilómetros.", lock: "Una promesa está guardada bajo llave." },
    { d: "2026-03-29", i: "💰", t: "Bogotá y Milán están conectadas por un hilo rojo invisible. Fuimos escritos por las estrellas.", lock: "El rastro de las estrellas te guiará pronto." },
    { d: "2026-04-15", i: "✨🎁✨", t: "¡Feliz cumpleaños, mi Camila! 🎂 Eres el regalo más hermoso de mi vida. Te amo infinitamente.", b: true, lock: "El tesoro más grande espera el día más especial del año..." }
];

// EVRENİ OLUŞTUR (Yıldızlar ve Sandıklar)
function initUniverse() {
    const starContainer = document.getElementById("stars-container");
    const vaultContainer = document.getElementById("vault-container");
    const now = new Date();

    // 100 Parlayan Yıldız
    for (let i = 0; i < 100; i++) {
        const s = document.createElement("div");
        s.className = "star";
        s.style.left = Math.random() * 100 + "vw";
        s.style.top = Math.random() * 100 + "vh";
        const size = (Math.random() * 3) + "px";
        s.style.width = s.style.height = size;
        s.style.setProperty('--d', (Math.random() * 3 + 2) + "s");
        starContainer.appendChild(s);
    }

    // Dağınık Yerleşen Sandıklar
    vaults.forEach(v => {
        const div = document.createElement("div");
        div.className = `chest ${v.b ? 'birthday' : ''}`;
        
        // Ekranda rastgele ama çok kenarda olmayan konum
        div.style.left = (Math.random() * 70 + 15) + "%";
        div.style.top = (Math.random() * 70 + 15) + "%";

        if (now < new Date(v.d)) {
            div.innerHTML = "🔒";
            div.classList.add("locked");
            div.onclick = () => alert(v.lock); // Gizemli mesaj
        } else {
            div.innerHTML = v.i;
            div.onclick = () => {
                const modal = document.createElement("div");
                modal.className = "modal";
                modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
                modal.innerHTML = `<div class="modal-content"><p style='font-family:Dancing Script, cursive; font-size:24px; line-height:1.6;'>${v.t}</p><br><button onclick="this.parentElement.parentElement.remove()" style="padding:10px 25px; border:none; background:#ffd700; color:black; font-weight:bold; border-radius:12px; cursor:pointer;">Cerrar</button></div>`;
                document.body.appendChild(modal);
            };
        }
        vaultContainer.appendChild(div);
    });
}

// SAYAÇ VE MOD GÜNCELLEME
function update() {
    const now = new Date();
    const bogota = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    
    // Gece/Gündüz Modu
    if(bogota.getHours() >= 18 || bogota.getHours() < 6) document.body.classList.add("night-mode");
    else document.body.classList.remove("night-mode");

    const diff = Math.floor((bogota - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    
    document.getElementById("counter").innerHTML = `<span>${d}d</span><span>${h}h</span><span>${m}m</span><span style="color:#ff4d4d">${s}s</span>`;
    
    const dayIdx = Math.floor((new Date(bogota.getFullYear(), bogota.getMonth(), bogota.getDate()) - startDate)/86400000);
    document.getElementById("message").innerText = messages[dayIdx] || "Contigo, siempre.";
}

// ALBÜM GEÇİŞİ
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

// BAŞLAT
window.onload = () => {
    initUniverse();
    update();
    setInterval(update, 1000);
};
