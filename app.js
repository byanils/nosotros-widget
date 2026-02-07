// --- AYARLAR ---
const startDate = new Date("2025-12-27T10:45:00");
const photos = ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg", "foto6.jpg", "foto7.jpg", "foto8.jpg", "foto9.jpg", "foto10.jpg"];
let currentIdx = 0;

// Mesajlar Dizisi (Günlük Değişen Mesajlar)
const messages = [
    "Este widget no pide nada. Solo está aquí. Como yo 🤍", "Hoy pensé en ti sin razón. Y me gustó.",
    "Tu nombre se siente tranquilo en mi mente.", "Aunque estemos lejos, hay algo que nunca se mueve.",
    "Si supieras cuántas veces sonrío por ti...", "No es costumbre. Es elección.",
    "Hay días normales, y días donde apareces tú.", "Te pienso en silencio, y eso dice mucho.",
    "No necesito escribirte. Ya estás aquí.", "Diez días... y ya pareces una costumbre bonita.",
    "Hay personas que llegan despacio. Tú te quedaste.", "Me gusta cómo existes en mi vida.",
    "No prometo perfección. Prometo verdad.", "A veces el amor no habla. Acompaña.",
    "Quince días... ve ya te siento hogar.", "Milán aún no pasa, pero algo ya empieza.",
    "Hoy el mundo fue un poco más suave.", "No hiciste nada especial hoy. Y aún así...",
    "Hay calma cuando pienso en ti.", "Si esto es esperar, no me quejo.",
    "Tu recuerdo no pesa. Flota.", "Me gustas sin prisa.",
    "El tiempo contigo no corre. Camina.", "A veces cierro los ojos ve estás ahí.",
    "No necesito entenderlo todo.", "Hay conexiones que no piden explicación.",
    "Hoy fue uno de esos días contigo en el fondo.", "No eres ruido. Eres fondo.",
    "Si te nombro, sonrío.", "Treinta días... sigo aquí.",
    "El amor no siempre grita.", "A veces solo se sienta al lado.",
    "Pensé en Bogotá hoy.", "Pensé en tus manos.",
    "No te pienso menos por no verte.", "Hay ausencias que se sienten llenas.",
    "Hoy no pasó nada... excepto tú.", "No me canso de elegirte.",
    "Milán se acerca sin saberlo.", "Cuarenta días. Tranquilos. Firmes.",
    "Me gusta cómo eres sin intentar.", "Hay bellezza en tu forma de estar.",
    "No todo amor quema. Algunos abrigan.", "Hoy el día fue mejor contigo en él.",
    "No necesito razones para pensarte.", "El tiempo no nos separa. Nos prueba.",
    "Hay recuerdos ki aún no existen.", "Y aun así ya duelen bonito.",
    "Me quedo.", "Cincuenta días... sigo.",
    "A veces no hay ki decir nada. Solo estar.", "Eres mi notificación favorita.",
    "No sé hacia dónde vamos, pero me gusta el camino.", "Hoy el café supo a ti. Dulce ve necesario.",
    "Hay personas ki son canciones. Tú eres mi playlist entera.", "No te busqué, pero te encontré en el momento exacto.",
    "Sesenta días... ve cada uno ha valido la pena.", "Tu risa es mi sonido favorito en este world.",
    "Me gusta la paz ki me das sin pedir nada a cambio.", "Eres el 'te quiero' ki nunca me canso de sentir.",
    "No es la distanzia, es lo ki sentimos mientras la acortamos.", "A veces el amor es un mesaj a las 3 de la tarde.",
    "Setenta días... ve sigo eligiéndote a ti.", "No te necesito para vivir, pero contigo vivo mejor.",
    "Eres ese rincón de luz en mis días grises.", "Pensarte es como un abrazo a distanzia.",
    "No hay kilómetros ki puedan con lo ki hemos creado.", "Hoy Bogotá se sintió más cerca de ti.",
    "Ochenta días... ve la magia sigue intacta.", "Me gusta cómo me haces sentir, incluso sin estar cerca.",
    "Eres mi pensamiento más recurrente.", "A veces el amor es saber ki alguien te espera.",
    "No importa el mapa, importa el destino. Y mi destino eres tú.", "Gracias por ser mi lugar seguro.",
    "Noventa días... tres meses de pura verdad.", "Cada día es una página nueva. Me gusta nuestra historia.",
    "No eres un sueño, eres mi realidad favorita.", "Incluso en el silenzio, te escucho.",
    "No te idealizo, te elijo.", "Eres mi pausa favorita en este world ruidoso.",
    "Cien días... ve mi corazón sigue diciendo tu nombre.", "Me gusta lo ki somos, así sin filtros.",
    "Hay días ki solo se arreglan hablándote.", "Eres el motivo de mi mejor sonrisa hoy.",
    "No importa qué tan lejos, te llevo en cada paso.", "Tu paz mi refugio favorito.",
    "Eres la casualidad más bonita de mi vida.", "A veces solo necesito saber ki estás ahí.",
    "A veces lo más valiente es quedarse.", "Contigo la vida no pesa.",
    "Eres mi m-ejor 'hola' ve mi 'adiós' más diffizil.", "Tu amor es mi calma en medio del ruido.",
    "No eres perfecta, eres real. Y eso me encanta.", "Gracias por elegirme a mí de nuevo.",
    "108 días... ve esto es solo el comienzo. 🤍"
];

// Sandıklar Dizisi
const vaults = [
    { d: "2026-02-15", t: "La distanzia no es un muro... Te amo." },
    { d: "2026-02-22", t: "Extrañarte es la forma más dulce de recordarme..." },
    { d: "2026-03-01", t: "Nuestras almas hablan el mismo idioma." },
    { d: "2026-03-08", t: "Te elijo hoy ve siempre." },
    { d: "2026-03-15", t: "Eres mi rincón de luz." },
    { d: "2026-03-22", t: "Un paso más cerca de nuestro abrazo." },
    { d: "2026-03-29", t: "Bogotá ve Milán están conectadas." },
    { d: "2026-04-05", t: "Eres la melodía ki calma mi ruido." },
    { d: "2026-04-15", t: "¡Feliz cumpleaños, Camila! 🎂", b: true, lock: "El tesoro más grande espera el día más spezial... 🌌✨" }
];

// --- FONKSİYONLAR ---

function goToUniverse() {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("star-map-page").classList.add("active");
    initUniverse();
}

function goToHome() {
    document.getElementById("star-map-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
}

function initUniverse() {
    const starContainer = document.getElementById("stars-container");
    const vaultContainer = document.getElementById("vault-container");
    const now = new Date();

    if (vaultContainer.children.length > 0) return;

    // Yıldız Oluşturma
    for (let i = 0; i < 80; i++) {
        const s = document.createElement("div");
        s.className = "star";
        s.style.left = Math.random() * 100 + "vw";
        s.style.top = Math.random() * 100 + "vh";
        s.style.width = s.style.height = "2px";
        s.style.setProperty('--d', (Math.random() * 3 + 2) + "s");
        starContainer.appendChild(s);
    }

    // Sandık Oluşturma ve Dizme
    const total = vaults.length;
    vaults.forEach((v, index) => {
        const div = document.createElement("div");
        div.className = `chest ${v.b ? 'birthday' : ''}`;
        
        const ratio = index / (total - 1);
        const topPos = 20 + (ratio * 58); 
        const curve = Math.sin(ratio * Math.PI) * 15; 
        const leftPos = (82 - (ratio * 64)) + curve; 

        div.style.top = `${topPos}%`;
        div.style.left = `${leftPos}%`;

        // Tıklama Olayı (addEventListener kullanarak daha sağlam hale getirdik)
        div.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const vaultDate = new Date(v.d);
            if (now < vaultDate) {
                alert(v.b ? v.lock : "Se abrirá el: " + v.d);
            } else {
                alert(v.t);
            }
        });

        vaultContainer.appendChild(div);
    });
}

function update() {
    const now = new Date();
    // Bogotá Saat Dilimine Göre Ayarla
    const bogota = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    
    // Gece/Gündüz Modu (18:00 - 06:00 arası gece)
    if(bogota.getHours() >= 18 || bogota.getHours() < 6) {
        document.body.classList.add("night-mode");
    } else {
        document.body.classList.remove("night-mode");
    }

    // Sayaç Hesaplama
    const diff = Math.floor((bogota - startDate) / 1000);
    const d = Math.floor(diff/86400);
    const h = Math.floor((diff%86400)/3600);
    const m = Math.floor((diff%3600)/60);
    const s = diff%60;
    
    const counterEl = document.getElementById("counter");
    if(counterEl) {
        counterEl.innerHTML = `<span>${d}d</span><span>${h}h</span><span>${m}m</span><span style="color:#ff4d4d">${s}s</span>`;
    }
    
    // Günlük Mesajı Güncelle
    const dayDiff = Math.floor((new Date(bogota.getFullYear(), bogota.getMonth(), bogota.getDate()) - new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / 86400000);
    const msgEl = document.getElementById("message");
    if(msgEl) {
        msgEl.innerText = messages[dayDiff] || "Contigo, siempre. 🤍";
    }
}

// Fotoğraf Değiştirme Döngüsü
setInterval(() => {
    const img = document.getElementById("album-photo");
    const mainPage = document.getElementById("main-page");
    if(img && mainPage && mainPage.classList.contains("active")) {
        img.style.opacity = 0;
        setTimeout(() => {
            currentIdx = (currentIdx + 1) % photos.length;
            img.src = photos[currentIdx];
            img.style.opacity = 1;
        }, 500);
    }
}, 4000);

// Sayfa yüklendiğinde başlat
window.onload = () => { 
    update(); 
    setInterval(update, 1000); 
};
