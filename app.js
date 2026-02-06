const startDate = new Date("2025-12-27T10:45:00");

const messages = [
    "Este widget no pide nada. Solo está aquí. Como yo 🤍", "Hoy pensé en ti sin razón. Y me gustó.",
    "Tu nombre se siente tranquilo en mi mente.", "Aunque estemos lejos, hay algo que nunca se mueve.",
    "Si supieras cuántas veces sonrío por ti…", "No es costumbre. Es elección.",
    "Hay dıas normales, y dıas donde apareces tú.", "Te pienso en silencio, y eso dice mucho.",
    "No necesito escribirte. Ya estás aquí.", "Diez dıas… y ya pareces una costumbre bonita.",
    "Hay personas que llegan despacio. Tú te quedaste.", "Me gusta cómo existes en mi vida.",
    "No prometo perfección. Prometo verdad.", "A veces el amor no habla. Acompaña.",
    "Quince dıas… y ya te siento hogar.", "Milán aún no pasa, pero algo ya empieza.",
    "Hoy el mundo fue un poco más suave.", "No hiciste nada especial hoy. Y aún así…",
    "Hay calma cuando pienso en ti.", "Si esto es esperar, no me quejo.",
    "Tu recuerdo no pesa. Flota.", "Me gustas sin prisa.",
    "El tiempo contigo no corre. Camina.", "A veces cierro los ojos y estás ahí.",
    "No necesito entenderlo todo.", "Hay conexiones que no piden explicación.",
    "Hoy fue uno de esos dıas contigo en el fondo.", "No eres ruido. Eres fondo.",
    "Si te nombro, sonrío.", "Treinta dıas… sigo aquí.",
    "El amor no siempre grita.", "A veces solo se sienta al lado.",
    "Pensé en Bogotá hoy.", "Pensé en tus manos.",
    "No te pienso menos por no verte.", "Hay ausencias que se sienten llenas.",
    "Hoy no pasó nada… excepto tú.", "No me canso de elegirte.",
    "Milán se acerca sin saberlo.", "Cuarenta dıas. Tranquilos. Firmes.",
    "Me gusta cómo eres sin intentar.", "Hay belleza en tu forma de estar.",
    "No todo amor quema. Algunos abrigan.", "Hoy el dıa fue mejor contigo en él.",
    "No necesito razones para pensarte.", "El tiempo no nos separa. Nos prueba.",
    "Hay recuerdos ki aún no existen.", "Y aun así ya duelen bonito.",
    "Me quedo.", "Cincuenta dıas… sigo.",
    "A veces no hay que decir nada. Solo estar.", "Eres mi notificación favorita.",
    "No sé hacia dónde vamos, pero me gusta el camino.", "Hoy el café supo a ti. Dulce y necesario.",
    "Hay personas que son canciones. Tú eres mi playlist entera.", "No te busqué, ama te encontré en el momento exacto.",
    "Sesenta dıas… y cada uno ha valido la pena.", "Tu risa es mi sonido favorito en este mundo.",
    "Me gusta la paz que me das sin pedir nada a cambio.", "Eres el 'te quiero' que nunca me canso de sentir.",
    "No es la distancia, es lo que sentimos mientras la acortamos.", "A veces el amor es un mensaje a las 3 de la tarde.",
    "Setenta dıas… y sigo eligiéndote a ti.", "No te necesito para vivir, pero contigo vivo mejor.",
    "Eres ese rincón de luz en mis dıas grises.", "Pensarte es como un abrazo a distancia.",
    "No hay kilómetros que puedan con lo que hemos creado.", "Hoy Bogotá se sintió más cerca de ti.",
    "Ochenta dıas… y la magia sigue intacta.", "Me gusta cómo me haces sentir, incluso sin estar cerca.",
    "Eres mi pensamiento más recurrente.", "A veces el amor es saber que alguien te espera.",
    "No importa el mapa, importa el destino. Y mi destino eres tú.", "Gracias por ser mi lugar seguro.",
    "Noventa dıas… tres meses de pura verdad.", "Cada dıa es una página nueva. Me gusta nuestra historia.",
    "No eres un sueño, eres mi realidad favorita.", "Incluso en el silencio, te escucho.",
    "No te idealizo, te elijo.", "Eres mi pausa favorita en este mundo ruidoso.",
    "Cien dıas… y mi corazón sigue diciendo tu nombre.", "Me gusta lo que somos, ası sin filtros.",
    "Hay dıas que solo se arreglan hablándote.", "Eres el motivo de mi mejor sonrisa hoy.",
    "No importa qué tan lejos, te llevo en cada paso.", "Tu paz es mi refugio favorito.",
    "Eres la casualidad más bonita de mi vida.", "A veces solo necesito saber que estás ahí.",
    "108 dıas… y esto es solo el comienzo. Mañana es un dıa especial. 🤍"
];

function updateWidget() {
    const now = new Date();
    const bogotaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));

    const today = new Date(bogotaTime.getFullYear(), bogotaTime.getMonth(), bogotaTime.getDate());
    const dayCount = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    const totalSeconds = Math.floor((bogotaTime - startDate) / 1000);
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    document.getElementById("counter").innerHTML = `
        <div>${d}d</div><div>${h}h</div><div>${m}m</div><div style="color:#ff4d4d">${s}s</div>
    `;

    let finalMessage = "";
    if (now.getMonth() === 1 && now.getDate() === 14) {
        finalMessage = "Hoy es San Valentín 🤍\nY no estás aquí, pero estás en todo.\nFeliz San Valentín, Camila.";
    } else if (dayCount === 109) {
        finalMessage = "Feliz cumpleaños, mi Camila 🤍\nHoy el mundo es mejor porque tú naciste.\nGracias por tu luz.\nYo te elijo cada dıa.";
    } else if (dayCount === 16) {
        finalMessage = "Milán. El Duomo. Tú y yo. Ese dıa entendı́ que el amor tiene un lugar fı́sico 🤍";
    } else {
        finalMessage = messages[dayCount] || "Estoy aquí. Siempre.";
    }

    if (document.getElementById("message").innerText !== finalMessage) {
        document.getElementById("message").innerText = finalMessage;
    }
}

setInterval(updateWidget, 1000);
updateWidget();
