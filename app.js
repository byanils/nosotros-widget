const startDate = new Date("2025-12-27T10:45:00");
const photos = ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg", "foto6.jpg", "foto7.jpg", "foto8.jpg", "foto9.jpg", "foto10.jpg"];
let currentIdx = 0;

function goToUniverse() {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("star-map-page").classList.add("active");
    initUniverse();
}

function goToHome() {
    document.getElementById("star-map-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
}

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
    "Hay recuerdos que aún no existen.", "Y aun así ya duelen bonito.",
    "Me quedo.", "Cincuenta días... sigo.",
    "A veces no hay que decir nada. Solo estar.", "Eres mi notificación favorita.",
    "No sé hacia dónde vamos, pero me gusta el camino.", "Hoy el café supo a ti. Dulce ve necesario.",
    "Hay personas que son canciones. Tú eres mi playlist entera.", "No te busqué, pero te encontré en el momento exacto.",
    "Sesenta días... ve cada uno ha valido la pena.", "Tu risa es mi sonido favorito en este mundo.",
    "Me gusta la paz que me das sin pedir nada a cambio.", "Eres el 'te quiero' que nunca me canso de sentir.",
    "No es la distancia, es lo que sentimos mientras la acortamos.", "A veces el amor es un mensaje a las 3 de la tarde.",
    "Setenta días... ve sigo eligiéndote a ti.", "No te necesito para vivir, pero contigo vivo mejor.",
    "Eres ese rincón de luz en mis días grises.", "Pensarte es como un abrazo a distancia.",
    "No hay kilómetros que puedan con lo que hemos creado.", "Hoy Bogotá se sintió más cerca de ti.",
    "Ochenta días... ve la magia sigue intacta.", "Me gusta cómo me haces sentir, incluso sin estar cerca.",
    "Eres mi pensamiento más recurrente.", "A veces el amor es saber que alguien te espera.",
    "No importa el mapa, importa el destino. Y mi destino eres tú.", "Gracias por ser mi lugar seguro.",
    "Noventa días... tres meses de pura verdad.", "Cada día es una página nueva. Me gusta nuestra historia.",
    "No eres un sueño, eres mi realidad favorita.", "Incluso en el silencio, te escucho.",
    "No te idealizo, te elijo.", "Eres mi pausa favorita en este world ruidoso.",
    "Cien días... ve mi corazón sigue diciendo tu nombre.", "Me gusta lo que somos, así sin filtros.",
    "Hay días que solo se arreglan hablándote.", "Eres el motivo de mi mejor sonrisa hoy.",
    "No importa qué tan lejos, te llevo en cada paso.", "Tu paz mi refugio favorito.",
    "Eres la casualidad más bonita de mi vida.", "A veces solo necesito saber que estás ahí.",
    "A veces lo más valiente es quedarse.", "Contigo la vida no pesa.",
    "Eres mi mejor 'hola' ve mi 'adiós' más difícil.", "Tu amor es mi calma en medio del ruido.",
    "No eres perfecta, eres real. Y eso me encanta.", "Gracias por elegirme a mí también.",
    "108 días... ve esto es solo el comienzo. 🤍"
];

const vaults = [
    { d: "2026-02-15", t: "La distancia no es un muro... Te amo." },
    { d: "2026-02-22", t: "Extrañarte es la forma más dulce de recordarme..." },
    { d: "2026-03-01", t: "Nuestras almas hablan el mismo idioma." },
    { d: "2026-03-08", t: "Te elijo hoy ve siempre." },
    { d: "2026-03-15", t: "Eres mi rincón de luz." },
    { d: "2026-03-22", t: "Un paso más cerca de nuestro abrazo." },
    { d: "2026-03-29", t: "Bogotá ve Milán están conectadas." },
    { d: "2026-04-05", t: "Eres la melodía que calma mi ruido." },
    { d: "2026-04-15", t: "¡Feliz cumpleaños, Camila! 🎂", b: true, lock: "El tesoro más grande espera el día más especial... 🌌✨" }
];

function initUniverse() {
    const starContainer = document.getElementById("stars-container");
    const vaultContainer = document.getElementById("vault-container");
    const now = new Date();

    if (vaultContainer.children.length > 0) return;

    // Sabit ve Kayan Yıldızlar
    for (let i = 0; i < 100; i++) {
        const s = document.createElement("div");
        s.className = "star";
        s.style.left = Math.random() * 100 + "vw";
        s.style.top = Math.random() * 100 + "vh";
        s.style.width = s.style.height = Math.random() * 3 + "px";
        s.style.setProperty('--d', (Math.random() * 3 + 2) + "s");
        starContainer.appendChild(s);
    }
    
    setInterval(() => {
        const ss = document.createElement("div");
        ss.className = "shooting-star";
        ss.style.top = Math.random() * 30 + "vh";
        ss.style.left = Math.random() * 100 + "vw";
        starContainer.appendChild(ss);
        setTimeout(() => ss.remove(), 3000);
    }, 5000);

    // Sandıkların Konumlandırılması (Milano -> Bogotá Eğrisi)
    vaults.forEach((v, index) => {
        const div = document.createElement("div");
        div.className = `chest ${v.b ? 'birthday' : ''}`;
        
        const topPos = 20 + (index * 7.5); // Dikey dağılım
        const horizontalShift = index * 6.5; 
        const leftPos = 85 - horizontalShift; // Sağdan sola çapraz iniş

        div.style.top = topPos + "%";
        div.style.left = leftPos + "%";

        if (now < new Date(v.d)) {
            div.classList.add("locked");
            div.onclick = (e) => { e.stopPropagation(); alert(v.b ? v.lock : "Se abrirá el: " + v.d); };
        } else {
            div.onclick = (e) => { e.stopPropagation(); alert(v.t); };
        }
        vaultContainer.appendChild(div);
    });
}

function update() {
    const now = new Date();
    const bogota = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    
    if(bogota.getHours() >= 18 || bogota.getHours() < 6) document.body.classList.add("night-mode");
    else document.body.classList.remove("night-mode");

    const diff = Math.floor((bogota - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    
    document.getElementById("counter").innerHTML = `<span>${d}d</span><span>${h}h</span><span>${m}m</span><span style="color:#ff4d4d">${s}s</span>`;
    
    const dayIdx = Math.floor((new Date(bogota.getFullYear(), bogota.getMonth(), bogota.getDate()) - startDate)/86400000);
    document.getElementById("message").innerText = messages[dayIdx] || "Contigo, siempre. 🤍";
}

setInterval(() => {
    const img = document.getElementById("album-photo");
    if(img && document.getElementById("main-page").classList.contains("active")) {
        img.style.opacity = 0;
        setTimeout(() => {
            currentIdx = (currentIdx + 1) % photos.length;
            img.src = photos[currentIdx];
            img.style.opacity = 1;
        }, 500);
    }
}, 4000);

window.onload = () => { update(); setInterval(update, 1000); };
