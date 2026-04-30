// --- 1. MOTOR DE FÍSICA REACTIVA (Canvas) ---
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };

window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
canvas.width = window.innerWidth; canvas.height = window.innerHeight;

// Seguimiento del Mouse para Física y Aura
const aura = document.getElementById('cursor-aura');
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    aura.style.left = `${e.clientX}px`; aura.style.top = `${e.clientY}px`;
});
window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY;
    aura.style.left = `${mouse.x}px`; aura.style.top = `${mouse.y}px`;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8; this.vy = (Math.random() - 0.5) * 0.8;
        this.baseRadius = Math.random() * 20 + 15; // Más grandes para crear el 'Líquido Zafiro'
        this.radius = this.baseRadius;
    }
    update() {
        // Física Reactiva: Orbitan suavemente alrededor del cursor como un imán
        let dx = mouse.x - this.x; let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 250 && mouse.x !== -1000) {
            const forceDirectionX = dx / dist; const forceDirectionY = dy / dist;
            const attractionForce = 0.03; // Fuerza de imán
            
            // Vector tangencial para rotar (orbitar)
            const orbitSpeed = 0.06;
            const tangentialX = -forceDirectionY * orbitSpeed;
            const tangentialY = forceDirectionX * orbitSpeed;
            
            this.vx += forceDirectionX * attractionForce + tangentialX;
            this.vy += forceDirectionY * attractionForce + tangentialY;
            this.radius = this.baseRadius * 1.5; // Crecen al acercarse
        } else {
            this.radius = this.baseRadius;
        }

        
        // Fricción y límite de velocidad para estabilizar la órbita
        this.vx *= 0.98; this.vy *= 0.98; // Se calman solas
        
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 4;
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
        
        this.x += this.vx; 
        this.y += this.vy;

        // Rebote suave en bordes
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00E5FF'; // Cian eléctrico (base del líquido)
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    let numParticles = window.innerWidth < 768 ? 50 : 100;
    for (let i = 0; i < numParticles; i++) particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(); particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

// --- 2. DIRECTOR CINEMATOGRÁFICO ---
const cinematicText = "No tienes que ser fuerte hoy.<br><br>Está bien no tener ganas de nada. Este espacio cuántico fue creado para ti. Cierra los ojos, escucha la música y recibe este abrazo desde Piura.<br><br><span class='highlight'>Eres la mejor socia del universo.</span>";

async function typeWriterEffect(element, htmlString, speed = 40) {
    element.innerHTML = "";
    let i = 0;
    let isTag = false;
    let textStr = "";

    return new Promise(resolve => {
        function type() {
            if (i < htmlString.length) {
                let char = htmlString.charAt(i);
                if (char === '<') isTag = true;
                textStr += char;
                element.innerHTML = textStr;
                if (char === '>') isTag = false;
                
                i++;
                setTimeout(type, isTag ? 0 : speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initParticles(); animateParticles();

    const fogLayer = document.getElementById('lima-fog');
    const oasisStage = document.getElementById('oasis-stage');
    const awakenBtn = document.getElementById('awaken-btn');
    const zafiroCard = document.getElementById('zafiro-card');
    const canvasEl = document.getElementById('network-canvas');
    const bgMusic = document.getElementById('bg-music');
    const textContainer = document.getElementById('cinematic-text');
    const claimBtn = document.getElementById('claim-btn');

    // Despertar el Santuario
    awakenBtn.addEventListener('click', async () => {
        // 1. Iniciar Audio y Aura
        bgMusic.volume = 0.5;
        bgMusic.play().catch(e => console.log("Audio autoplay bloqueado, requiere interacción."));
        document.getElementById('cursor-aura').style.opacity = '1';

        // 2. Disipar Neblina
        fogLayer.style.opacity = '0';
        setTimeout(() => fogLayer.style.display = 'none', 2500);
        
        // 3. Revelar Universo
        canvasEl.style.opacity = '1';
        oasisStage.classList.remove('hidden');

        // 4. Secuencia Cinematográfica (Empieza a escribir después de 2 seg)
        setTimeout(async () => {
            await typeWriterEffect(textContainer, cinematicText, 45);
            // Mostrar botón final suavemente
            claimBtn.classList.remove('hidden');
            claimBtn.style.opacity = 0;
            setTimeout(() => { claimBtn.style.opacity = 1; }, 500);
        }, 2000);
    });

    // Efecto 3D de la tarjeta (Suavizado Extremo)
    const handleTilt = (clientX, clientY) => {
        const rect = zafiroCard.getBoundingClientRect();
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        const rotateX = -(y / rect.height) * 20; 
        const rotateY = (x / rect.width) * 20;
        zafiroCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        zafiroCard.style.setProperty('--mouse-x', `${x}px`);
        zafiroCard.style.setProperty('--mouse-y', `${y}px`);
    };

    document.addEventListener('mousemove', (e) => handleTilt(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => handleTilt(e.touches[0].clientX, e.touches[0].clientY));
    
    document.addEventListener('mouseleave', () => zafiroCard.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`);
    document.addEventListener('touchend', () => zafiroCard.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`);

    // Botón Final
    claimBtn.addEventListener('click', function() {
        this.innerText = "Energía Transferida 💛";
        this.style.background = "var(--sunset-orange)";
        this.style.color = "#000";
        this.style.pointerEvents = "none";
        
        // Efecto de Explosión de Partículas
        for(let p of particles) {
            p.vx = (Math.random() - 0.5) * 20;
            p.vy = (Math.random() - 0.5) * 20;
        }
    });
});
// ... (Todo el código del Motor de Partículas anterior se mantiene igual) ...

// --- 1. CONFIGURACIÓN DE LA BROMITA ---
function obtenerFrasesPorDia() {
    const dia = new Date().getDay(); // 0 es Domingo, 1 es Lunes...
    if (dia === 1) { // Lunes
        return [
            "¡Gua, socia! Lunes de empezar con todo, atrápame si puedes.",
            "Esa energía de inicio de semana está buena, churre.",
            "El lunes pesa, pero tú puedes más. ¡Casi, casi!",
            "¿Me atrapas o necesitas cafecito, di?",
            "¡La última de calentamiento para la semana!",
            "Ya, socia, que tengas un lunes pajita. Te dejé ganar."
        ];
    } else if (dia === 5) { // Viernes
        return [
            "¡Gua, socia! Hoy es viernes y el cuerpo lo sabe.",
            "¿Ya pensando en la jarana, churre? ¡Concéntrate!",
            "¡Viernes de chifles y clarito! Pero primero ampayame.",
            "¡Qué lenta te dejó la semana! ¡Intenta de nuevo!",
            "¡Último esfuerzo antes del finde!",
            "¡Ganaste! Ahora sí, ¡a celebrar, socia!"
        ];
    } else if (dia === 0 || dia === 6) { // Fin de semana
        return [
            "¡Gua, socia! Fin de semana de descanso total, tómalo con calma.",
            "No te estreses, churre, persígueme suavecito.",
            "Hoy toca hamaca y relax, pero inténtalo otra vez.",
            "Relájate, respira, ¡y atrápame si quieres!",
            "¡Ya falta poquito para volver a descansar!",
            "¡Ampay! A seguir descansando, mi churre."
        ];
    } else { // Martes a Jueves
        return [
            "¡Gua, socia! Te falta rapidez limeña.",
            "No me ampayas, churre. ¡Intenta de nuevo!",
            "Ese Metropolitano te ha vuelto lenta, ¿no?",
            "¿Me atrapas o te traigo chifles?",
            "¡La última, pues!",
            "Ya, ya, está bien, te dejé ganar."
        ];
    }
}
const bromaPhrases = obtenerFrasesPorDia();
let escapeCount = 0;
const maxEscapes = 5; // Cuántas veces escapa antes de dejarse atrapar

// --- 2. MOTOR CINEMATOGRÁFICO Y BROMISTA ---
document.addEventListener('DOMContentLoaded', () => {
    initParticles(); animateParticles();

    const fogLayer = document.getElementById('lima-fog');
    const oasisStage = document.getElementById('oasis-stage');
    const awakenBtn = document.getElementById('awaken-btn');
    const zafiroCard = document.getElementById('zafiro-card');
    const bromaBtn = document.getElementById('broma-btn');
    const bromaStatus = document.getElementById('broma-status');
    const finalMessage = document.getElementById('final-message');

    // Despertar el Santuario
    awakenBtn.addEventListener('click', () => {
        document.getElementById('cursor-aura').style.opacity = '1';
        fogLayer.style.opacity = '0';
        setTimeout(() => fogLayer.style.display = 'none', 2500);
        document.getElementById('network-canvas').style.opacity = '1';
        oasisStage.classList.remove('hidden');
    });

    // --- LÓGICA DE LA BROMITA FUGITIVA ---
    const handleEscape = (e) => {
        if (escapeCount >= maxEscapes) return; // Ya se dejó atrapar

        escapeCount++;
        
        // Cambiamos el mensaje para picarla un poco
        bromaStatus.innerHTML = bromaPhrases[escapeCount - 1] || bromaPhrases[0];
        
        // Calculamos nueva posición aleatoria dentro de la tarjeta
        // Obtenemos dimensiones de la tarjeta (zafiroCard)
        const cardRect = zafiroCard.getBoundingClientRect();
        const btnRect = bromaBtn.getBoundingClientRect();
        
        // Márgenes para que no se salga de la tarjeta
        const padding = 30;
        const availableWidth = cardRect.width - btnRect.width - padding * 2;
        const availableHeight = cardRect.height - btnRect.height - padding * 2;

        // Posición aleatoria
        const randomX = Math.random() * availableWidth + padding;
        const randomY = Math.random() * availableHeight + padding;

        // Aplicamos la posición (Cambiamos a absolute solo al primer escape)
        if (escapeCount === 1) {
            bromaBtn.style.position = 'absolute';
        }
        bromaBtn.innerText = "¡Casi!";
        bromaBtn.style.left = `${randomX}px`;
        bromaBtn.style.top = `${randomY}px`;
        
        // Generar 3 Clones Falsos (Decoys)
        const parent = bromaBtn.parentElement;
        for (let i = 0; i < 3; i++) {
            const clone = document.createElement('button');
            clone.className = bromaBtn.className;
            clone.innerText = "¡Casi!";
            clone.style.position = 'absolute';
            const cloneX = Math.random() * availableWidth + padding;
            const cloneY = Math.random() * availableHeight + padding;
            clone.style.left = `${cloneX}px`;
            clone.style.top = `${cloneY}px`;
            clone.style.opacity = '0.6';
            clone.style.pointerEvents = 'none'; // Clones no interactuables
            parent.appendChild(clone);
            
            // Desaparecer después de 2 segundos
            setTimeout(() => {
                if (parent.contains(clone)) clone.remove();
            }, 2000);
        }

        // Si llega al límite, se detiene y se rinde
        if (escapeCount === maxEscapes) {
            endPrank();
        }
    };

    function endPrank() {
        // Quitamos la lógica de escape
        bromaBtn.removeEventListener('mouseover', handleEscape);
        bromaBtn.removeEventListener('touchstart', handleEscape);
        
        // Restauramos el botón y cambiamos el estado
        bromaBtn.classList.add('atrapado');
        bromaBtn.innerText = "¡Me ampayaste! ✨";
        bromaStatus.style.opacity = 0; // Ocultar mensajes de broma
        
        // Unos segundos después, mostramos el abrazo real
        setTimeout(() => {
            bromaStatus.style.display = 'none';
            finalMessage.classList.remove('hidden');
            finalMessage.style.opacity = 1;
            
            // Revelar la Cápsula del Tiempo
            const dailyMantra = document.getElementById('daily-mantra');
            if (dailyMantra) {
                dailyMantra.classList.remove('hidden');
                dailyMantra.style.opacity = 1;
            }
            
            // Revelar el Buzón Zafiro
            const buzonZafiro = document.getElementById('buzon-zafiro');
            if (buzonZafiro) {
                buzonZafiro.classList.remove('hidden');
                buzonZafiro.style.opacity = 1;
            }
        }, 1000);
    }

    // Activamos la broma para desktop y móvil
    bromaBtn.addEventListener('mouseover', handleEscape); // Cuando el mouse se acerca
    bromaBtn.addEventListener('touchstart', (e) => { // Cuando el dedo toca
        e.preventDefault(); // Evita el clic real en el primer toque
        handleEscape(e);
    });

    // Botón Final (Cuando ya lo atrapó)
    bromaBtn.addEventListener('click', function() {
        if (!this.classList.contains('atrapado')) return; // No hace nada si está escapando
        
        this.innerText = "Abrazo Transferido 💛";
        this.style.pointerEvents = "none";
        
        // Explosión suave de partículas
        for(let p of particles) {
            p.vx = (Math.random() - 0.5) * 15;
            p.vy = (Math.random() - 0.5) * 15;
        }
    });

    // ... (Todo el código del Efecto 3D anterior se mantiene igual) ...
});

// --- 3. EXPERIMENTOS: VOZ Y RITMO PIURANO ---
document.addEventListener('DOMContentLoaded', () => {
    // 3.1 Interacción por Voz (El Suspiro)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'es-ES';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            
            if (transcript.includes('estoy cansada') || transcript.includes('cansada') || transcript.includes('suspiro')) {
                const awakenBtn = document.getElementById('awaken-btn');
                const fogLayer = document.getElementById('lima-fog');
                
                if(awakenBtn && fogLayer.style.display !== 'none') {
                    // Triple intensidad en el brillo (Ráfaga)
                    awakenBtn.style.boxShadow = '0 0 150px rgba(0, 229, 255, 1), 0 0 50px rgba(0, 229, 255, 0.8)';
                    awakenBtn.style.transform = 'scale(1.3)';
                    awakenBtn.style.background = 'var(--cyan-electric)';
                    awakenBtn.innerText = 'Ráfaga Zafiro 💎';
                    
                    // Disipación instantánea y disparo
                    setTimeout(() => {
                        fogLayer.style.transition = 'all 0.3s ease-out'; 
                        awakenBtn.click();
                    }, 800);
                }
            }
        };
        
        // Iniciar reconocimiento de forma invisible
        try { recognition.start(); } catch(e) {}
        
        // Apagar el micro al disipar la neblina
        document.getElementById('awaken-btn').addEventListener('click', () => {
            if (recognition) recognition.stop();
        });
    }

    // 3.2 Easter Egg de 'Ritmo Piurano' (3 rápidas, 2 lentas)
    let clickTimes = [];
    document.addEventListener('click', (e) => {
        // Evitar el combo al dar click a botones o la carta
        if(e.target.closest('button') || e.target.closest('.glass-card-3d')) return;

        clickTimes.push(Date.now());
        if (clickTimes.length > 5) clickTimes.shift();

        if (clickTimes.length === 5) {
            const diffs = [
                clickTimes[1] - clickTimes[0], clickTimes[2] - clickTimes[1],
                clickTimes[3] - clickTimes[2], clickTimes[4] - clickTimes[3]
            ];

            // Rápidas: menos de 350ms | Lentas: entre 350ms y 1200ms
            const isFast = (t) => t < 350; 
            const isSlow = (t) => t >= 350 && t < 1200;

            if (isFast(diffs[0]) && isFast(diffs[1]) && isSlow(diffs[2]) && isSlow(diffs[3])) {
                document.body.classList.add('festa-zafiro');
                
                // Mensaje Flotante
                const msg = document.createElement('div');
                msg.innerText = '¡Esa es la energía, socia! 🪩✨';
                msg.className = 'floating-neon-msg';
                msg.style.left = `${e.clientX}px`;
                msg.style.top = `${e.clientY}px`;
                document.body.appendChild(msg);
                
                setTimeout(() => msg.remove(), 4000); // Se borra luego de la animación
                clickTimes = []; // Reset
            }
        }
    });
});

// --- 4. BUZÓN ZAFIRO (Conexión con el Universo) ---
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-universe-btn');
    const buzonInput = document.getElementById('buzon-input');

    if (buzonInput) {
        const placeholders = [
            '¿Qué piensas ahora?',
            '¿A dónde te gustaría escapar?',
            'Pide un deseo aquí...',
            '¿Qué quisieras decirme?'
        ];
        let pIndex = 0;
        setInterval(() => {
            pIndex = (pIndex + 1) % placeholders.length;
            buzonInput.placeholder = placeholders[pIndex];
        }, 3500); // Rota el texto cada 3.5 segundos
    }

    if (sendBtn && buzonInput) {
        sendBtn.addEventListener('click', async () => {
            const message = buzonInput.value.trim();
            if (!message) return; // Evita enviar mensajes en blanco

            // Feedback de Interfaz: Enviando
            const originalText = sendBtn.innerText;
            sendBtn.innerText = "Guardando en el cofre... ✨";
            sendBtn.disabled = true;
            sendBtn.style.opacity = '0.7';

            const webhookUrl = "https://discord.com/api/webhooks/1499446491419508947/Bp03dS7u2fOjF2fYDoke1eSqeV4s5w1u5FKuElm_lcUi6qWbIV7N3MpJZ-gbQixaq3rg";

            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: `**Nuevo mensaje del Buzón Zafiro 💎:**\n> ${message}`
                    })
                });

                if (response.ok) {
                    buzonInput.value = ''; // Limpiar el campo
                    sendBtn.innerText = "Recibido en Piura ✨";
                } else {
                    throw new Error('Error en la petición');
                }
            } catch (error) {
                console.error("Error al conectar con el universo:", error);
                sendBtn.innerText = "La neblina bloqueó el mensaje 😔";
            }
            
            // Restaurar el botón después de 3 segundos
            setTimeout(() => {
                sendBtn.innerText = originalText;
                sendBtn.disabled = false;
                sendBtn.style.opacity = '1';
            }, 3000);
        });
    }
});
