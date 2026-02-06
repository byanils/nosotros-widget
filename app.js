// ===============================
// NOSOTROS WIDGET – app.js
// ===============================

const startDate = new Date("2025-12-27T10:45:00");
const now = new Date();

// Bogotá saatine çevir (UTC-5)
const bogotaTime = new Date(
  now.toLocaleString("en-US", { timeZone: "America/Bogota" })
);

// Gün farkı hesaplama (Mesaj indeksi için)
const todayBogota = new Date(
  bogotaTime.getFullYear(),
  bogotaTime.getMonth(),
  bogotaTime.getDate()
);
const diffTime = todayBogota - startDate;
const dayCount = Math.floor(diffTime / (1000 * 60 * 60 * 24));

// Sayaç hesaplama (Gün / Saat / Dakika)
const totalSeconds = Math.floor((bogotaTime - startDate) / 1000);
const days = Math.floor(totalSeconds / (3600 * 24));
const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);

// Günlük Mesajlar Listesi
const messages = [
    "Este widget no pide nada. Solo está aquí. Como yo 🤍",
    "Hoy pensé en ti sin razón. Y me gustó.",
    "Tu name se siente tranquilo en mi mente.",
    "Aunque estemos lejos, hay algo que nunca se mueve.",
    "Si supieras cuántas veces sonrío por ti…",
    "No es costumbre. Es elección.",
    "Hay días normales, y días donde apareces tú.",
    "Te pienso en silencio, y eso dice mucho.",
    "No necesito escribirte. Ya estás aquí.",
    "Diez días… y ya pareces una costumbre bonita.",
    "Hay personas que llegan despacio. Tú te quedaste.",
    "Me gusta cómo existes en mi vida.",
    "No prometo perfection. Prometo verdad.",
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
    "Me gusta cómo eres sin intentar.", // 41. Gün
    "Hay belleza en tu forma de estar.",
    "No todo amor quema. Algunos abrigan.",
    "Hoy el día fue mejor contigo en él.",
    "No necesito razones para pensarte.",
    "El tiempo no nos separa. Nos prueba.",
    "Hay recuerdos que aún no existen.",
    "Y aun así ya duelen bonito.",
    "Me quedo.",
    "Cincuenta días… sigo."
    // Listeye devam edebilirsin...
];

// Ekrana Yazdırma Mantığı
const counterElement = document.getElementById("counter");
const messageElement = document.getElementById("message");

// Önce Sayacı Yazdıralım
counterElement.innerText = `${days} días · ${hours} horas · ${minutes} min`;

// Mesaj Seçimi (Öncelik Sırasına Göre)
if (now.getMonth() === 1 && now.getDate() === 14) {
    // 1. Öncelik: San Valentín
    messageElement.innerText = "Hoy es San Valentín 🤍\nY no estás aquí, pero estás en todo.\nFeliz San Valentín, Camila.";
} else if (dayCount === 109) {
    // 2. Öncelik: Cumpleaños
    messageElement.innerText = "Feliz cumpleaños, mi Camila 🤍\nHoy el mundo es mejor porque tú naciste.";
} else if (dayCount === 16) {
    // 3. Öncelik: Milán Hatırası
    messageElement.innerText = "Milán. El Duomo. Tú y yo. Ese día entendí que el amor tiene un lugar físico 🤍";
} else {
    // 4. Genel: Günlük Mesajlar
    messageElement.innerText = messages[dayCount] || "Estoy aquí. Siempre.";
}
