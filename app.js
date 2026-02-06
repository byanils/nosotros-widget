// ===============================
// NOSOTROS WIDGET – app.js
// ===============================

// 🔹 Başlangıç tarihi
const startDate = new Date("2025-12-27T10:45:00");

// 🔹 Şu anki zaman
const now = new Date();

// 🔹 Bogotá saatine çevir (UTC-5)
const bogotaTime = new Date(
  now.toLocaleString("en-US", { timeZone: "America/Bogota" })
);

// 🔹 Bugün (Bogotá – 00:00)
const todayBogota = new Date(
  bogotaTime.getFullYear(),
  bogotaTime.getMonth(),
  bogotaTime.getDate()
);

// 🔹 Gün farkı
const diffTime = todayBogota - startDate;
const dayCount = Math.floor(diffTime / (1000 * 60 * 60 * 24));

// ===============================
// ⏳ Sayaç (gün / saat / dakika)
// ===============================
const totalSeconds = Math.floor((bogotaTime - startDate) / 1000);

const days = Math.floor(totalSeconds / (3600 * 24));
const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);

document.getElementById("counter").innerText =
  `${days} días · ${hours} horas · ${minutes} minutos`;

// ===============================
// 🤍 Günlük Mesajlar
// ===============================

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
"Diez días… y ya pareces una costumbre bonita.",

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
"Treinta días… y sigo aquí.",

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
"Hay recuerdos que aún no existen.",
"Y aun así ya duelen bonito.",
"Me quedo.",
"Cincuenta días… sigo.",

"Pensarte se volvió natural.",
"No ocupas espacio. Lo llenas.",
"A veces el amor es simple.",
"Y simple no es poco.",
"Hoy te imaginé sonriendo.",
"Eso bastó.",
"No escribo para impresionar.",
"Escribo porque estás.",
"Cada día contigo es una decisión.",
"Sesenta días… presentes.",

"Hay palabras que solo te diría a ti.",
"Hoy no las escribo. Las guardo.",
"El amor también sabe esperar.",
"Y espera bien.",
"No hay prisa cuando hay certeza.",
"Tu nombre sigue siendo suave.",
"Milán ya empieza a doler.",
"Pero de lo bonito.",
"Te llevo conmigo.",
"Setenta días… sin ruido.",

"Hay silencios que dicen todo.",
"Este es uno de ellos.",
"Hoy pensé en el Duomo.",
"En cómo te miré.",
"En cómo el mundo se calló.",
"No lo olvido.",
"No quiero olvidarlo.",
"Eso también es amor.",
"Persistir.",
"Ochenta días… y firmes.",

"No te idealizo.",
"Te elijo.",
"Hoy el amor fue tranquilo.",
"Como tú.",
"No necesito más.",
"Ni menos.",
"Estás.",
"Eso basta.",
"Milán vive en mí.",
"Noventa días… contigo.",

"Hay historias que no gritan.",
"La nuestra susurra.",
"Hoy me sentí cerca.",
"Aunque no lo estemos.",
"El amor también es memoria.",
"Y promesa.",
"No corro.",
"Espero.",
"Cien días… aquí.",

"Te pienso sin urgencia.",
"Eso es nuevo.",
"Eso es bueno.",
"El amor maduro no empuja.",
"Acompaña.",
"Ya casi es tu día.",
"Y yo estoy aquí.",
"Como siempre.",
"Como quise.",
"Últimos días…",

  // … (diğer mesajlar aynen kalıyor)
];

// ===============================
// 🎯 Mesaj seçimi
// ===============================
let message = messages[dayCount] || "Estoy aquí. Siempre.";

// 🔹 12 Ocak 2026 – Milano / Duomo
if (dayCount === 16) {
  message = "Milán. El Duomo. Tú y yo. Ese día entendí que el amor también tiene un lugar físico 🤍";
}

// 🔹 15 Nisan 2026 – Cumpleaños
if (dayCount === 109) {
  message =
    "Feliz cumpleaños, mi Camila 🤍\n" +
    "Hoy el mundo es mejor porque tú naciste.\n" +
    "Gracias por tu luz, por tu calma, por tu forma de amar.\n" +
    "En algún lugar del mundo,\n" +
    "alguien te elige cada día.\n" +
    "Yo.";
}

// ===============================
// 📺 Ekrana yaz
// ===============================
document.getElementById("message").innerText = message;