// ===============================
// NOSOTROS WIDGET – app.js
// ===============================

const startDate = new Date("2025-12-27T10:45:00");

function updateWidget() {
    const now = new Date();
    const bogotaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));

    // Gün farkı (Mesaj seçimi için)
    const today = new Date(bogotaTime.getFullYear(), bogotaTime.getMonth(), bogotaTime.getDate());
    const dayCount = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    // Canlı Sayaç Hesaplama
    const totalSeconds = Math.floor((bogotaTime - startDate) / 1000);
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    // Ekrana Yazdırma
    document.getElementById("counter").innerHTML = `
        <span>${d}d</span>
        <span>${h}h</span>
        <span>${m}m</span>
        <span class="seconds">${s}s</span>
    `;

    // Mesaj Seçimi
    const messages = [
        "Este widget no pide nada. Solo está aquí. Como yo 🤍",
        "Hoy pensé en ti sin razón. Y me gustó.",
        "Tu nombre se siente tranquilo en mi mente.",
        "Aunque estemos lejos, hay algo que nunca se mueve.",
        "Si supieras cuántas veces sonrío por ti…",
        "No es costumbre. Es elección.",
        "Hay días normales, y días donde apareces tú.",
        "Te pienso en silencio, y eso dice mucho.",
        "No necesito escribirte. Ya estás aquí.",
        "Diez días… ve ya pareces una costumbre bonita.",
        "Hay personas que llegan despacio. Tú te quedaste.",
        "Me gusta cómo existes en mi vida.",
        "No prometo perfección. Prometo verdad.",
        "A veces el amor no habla. Acompaña.",
        "Quince días… y ya te siento hogar.",
        "Milán aún no pasa, pero algo ya empieza.",
        "Hoy el mundo fue un poco más suave.",
        "No hiciste nada especial hoy. Y aún así…",
        "Hay calma cuando pienso en ti.",
        "Si esto es esperar, no me quejo.",
        "Tu recuerdo no pesa. Flota.",
        "Me gustas sin prisa.",
        "El tiempo contigo no corre. Camina.",
        "A veces cierro los ojos y estás ahí.",
        "No necesito entenderlo todo.",
        "Hay conexiones que no piden explicación.",
        "Hoy fue uno de esos días contigo en el fondo.",
        "No eres ruido. Eres fondo.",
        "Si te nombro, sonrío.",
        "Treinta días… sigo aquí.",
        "El amor no siempre grita.",
        "A veces solo se sienta al lado.",
        "Pensé en Bogotá hoy.",
        "Pensé en tus manos.",
        "No te pienso menos por no verte.",
        "Hay ausencias que se sienten llenas.",
        "Hoy no pasó nada… excepto tú.",
        "No me canso de elegirte.",
        "Milán se acerca sin saberlo.",
        "Cuarenta días. Tranquilos. Firmes.",
        "Me gusta cómo eres sin intentar.",
        "Hay belleza en tu forma de estar.",
        "No todo amor quema. Algunos abrigan.",
        "Hoy el día fue mejor contigo en él.",
        "No necesito razones para pensarte.",
        "El tiempo no nos separa. Nos prueba.",
        "Hay recuerdos ki aún no existen.",
        "Y aun así ya duelen bonito.",
        "Me quedo.",
        "Cincuenta días… sigo."
    ];

    let finalMessage = "";
    if (now.getMonth() === 1 && now.getDate() === 14) {
        finalMessage = "Hoy es San Valentín 🤍\nY no estás aquí, pero estás en todo.\nFeliz San Valentín, Camila.";
    } else if (dayCount === 109) {
        finalMessage = "Feliz cumpleaños, mi Camila 🤍\nHoy el mundo es mejor porque tú naciste.";
    } else if (dayCount === 16) {
        finalMessage = "Milán. El Duomo. Tú y yo. Ese día entendí que el amor tiene un lugar físico 🤍";
    } else {
        finalMessage = messages[dayCount] || "Estoy aquí. Siempre.";
    }

    // Mesajı sadece saniyede bir değişmemesi için kontrolle yazdırıyoruz
    if (document.getElementById("message").innerText !== finalMessage) {
        document.getElementById("message").innerText = finalMessage;
    }
}

// Her saniye güncelle
setInterval(updateWidget, 1000);
updateWidget(); // İlk açılışta çalıştır
