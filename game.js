// --- 1. MOTOR DE FÍSICA REACTIVA (Canvas) ---
let canvas, ctx, aura;
let particles = [];
let mouse = { x: -1000, y: -1000 };
let particleSpeedModifier = 1;

window.addEventListener('DOMContentLoaded', () => {
    // Carga segura del DOM
    canvas = document.getElementById('network-canvas');
    ctx = canvas ? canvas.getContext('2d') : null;
    aura = document.getElementById('cursor-aura');

    if (canvas) {
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    }

    // Seguimiento del Mouse para Física y Aura
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY;
        if (aura) { aura.style.left = `${e.clientX}px`; aura.style.top = `${e.clientY}px`; }
    });
    window.addEventListener('touchmove', (e) => {
        mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY;
        if (aura) { aura.style.left = `${mouse.x}px`; aura.style.top = `${mouse.y}px`; }
    });
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
        
        this.x += this.vx * particleSpeedModifier; 
        this.y += this.vy * particleSpeedModifier;

        // Rebote suave en bordes
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00E5FF'; // Cian eléctrico (base del líquido)
        ctx.fill();
    }
}

function initParticles() {
    if (!canvas) return;
    particles = [];
    let numParticles = window.innerWidth < 768 ? 50 : 100;
    for (let i = 0; i < numParticles; i++) particles.push(new Particle());
}

function animateParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(); particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

// --- 2. DIRECTOR CINEMATOGRÁFICO ---
const cinematicText = "No tienes que ser fuerte hoy.<br><br>Está bien no tener ganas de nada. Este espacio cuántico fue creado para ti. Cierra los ojos, escucha la música y recibe este abrazo desde Piura.<br><br><span class='highlight'>Eres la mejor socia del universo.</span>";

async function typeWriterEffect(element, htmlString, speed = 40) {
    if (!element) return Promise.resolve();
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
    const fogLayer = document.getElementById('lima-fog');
    const oasisStage = document.getElementById('oasis-stage');
    const awakenBtn = document.getElementById('awaken-btn');
    const zafiroCard = document.getElementById('zafiro-card');
    const canvasEl = document.getElementById('network-canvas');
    const bgMusic = document.getElementById('bg-music');
    const textContainer = document.getElementById('cinematic-text');
    const claimBtn = document.getElementById('claim-btn');
    const bromaBtn = document.getElementById('broma-btn');
    const bromaStatus = document.getElementById('broma-status');
    const finalMessage = document.getElementById('final-message');
    const sendBtn = document.getElementById('send-btn');
    const buzonInput = document.getElementById('buzon-input');
    const moodBtns = document.querySelectorAll('.mood-btn');

    // --- AISLAMIENTO DE LA PANTALLA DE CARGA ---
    const hideSplashScreen = () => {
        try {
            if (fogLayer) {
                fogLayer.style.opacity = '0';
                fogLayer.style.pointerEvents = 'none'; // Libera la pantalla para clics/scroll instantáneamente
                setTimeout(() => { if (fogLayer) fogLayer.style.display = 'none'; }, 2500);
            }
            if (canvasEl) canvasEl.style.opacity = '1';
            if (oasisStage) oasisStage.classList.remove('hidden');
        } catch (error) {
            console.error("Error al ocultar Splash Screen:", error);
        }
    };

    // --- INTERACCIÓN POR VOZ (El Suspiro) ---
    let recognition;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        try {
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.lang = 'es-ES';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
                if (transcript.includes('estoy cansada') || transcript.includes('cansada') || transcript.includes('suspiro')) {
                    if (awakenBtn && fogLayer && fogLayer.style.display !== 'none') {
                        awakenBtn.style.boxShadow = '0 0 150px rgba(0, 229, 255, 1), 0 0 50px rgba(0, 229, 255, 0.8)';
                        awakenBtn.style.transform = 'scale(1.3)';
                        awakenBtn.style.background = 'var(--cyan-electric)';
                        awakenBtn.innerText = 'Ráfaga Zafiro 💎';
                        
                        setTimeout(() => {
                            fogLayer.style.transition = 'all 0.3s ease-out'; 
                            awakenBtn.click();
                        }, 800);
                    }
                }
            };
            try { recognition.start(); } catch(e) { console.warn("Micro no iniciado:", e); }
        } catch(err) {
            console.warn("SpeechRecognition bloqueado por el WebView de Android:", err);
        }
    }

    // Despertar el Santuario
    const awakenHandler = async (e) => {
        if (e && e.type === 'touchstart') e.preventDefault(); // Evitar doble ejecución en táctil

        // 1. Iniciar Audio y Aura
        try {
            if (bgMusic) {
                bgMusic.volume = 0.5;
                bgMusic.play().catch(e => console.log("Audio autoplay bloqueado, requiere interacción."));
            }
        } catch (err) {
            console.error("Error de audio evitado:", err);
        }
        const cursorAura = document.getElementById('cursor-aura');
        if (cursorAura) cursorAura.style.opacity = '1';

        // 2. Disipar Neblina y 3. Revelar Universo
        hideSplashScreen();

        // Apagar el micro al disipar la neblina
        if (recognition) {
            try { recognition.stop(); } catch(e) {}
        }

        // 4. Secuencia Cinematográfica (Empieza a escribir después de 2 seg)
        setTimeout(async () => {
            if (textContainer) await typeWriterEffect(textContainer, cinematicText, 45);
            // Mostrar botón final suavemente
            if (claimBtn) {
                claimBtn.classList.remove('hidden');
                claimBtn.style.opacity = 0;
                setTimeout(() => { claimBtn.style.opacity = 1; }, 500);
            }

            // Revelar mensaje secreto de identidad en el fondo
            const identityMsg = document.getElementById('identity-secret-msg');
            if (identityMsg) setTimeout(() => identityMsg.classList.add('reveal'), 2000);
        }, 2000);
    };

    // Protección Quirúrgica (Optional Chaining)
    awakenBtn?.addEventListener('click', awakenHandler);
    awakenBtn?.addEventListener('touchstart', awakenHandler, { passive: false });

    // Efecto 3D de la tarjeta (Suavizado Extremo)
    if (zafiroCard) {
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
    }

    // Botón Final
    if (claimBtn) {
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
    }

// --- 5. SISTEMA DE MANÁ DIARIO ---
const mannaVerses = [
    "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré. (Isaías 41:10)",
    "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones. (Salmo 46:1)",
    "Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar. (Salmo 23:1)",
    "Porque yo sé los pensamientos que tengo acerca de ti, pensamientos de paz y no de mal. (Jeremías 29:11)",
    "Todo lo puedo en Cristo que me fortalece. (Filipenses 4:13)",
    "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. (Mateo 11:28)",
    "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros. (1 Pedro 5:7)",
    "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. (Proverbios 3:5)",
    "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. (Juan 14:27)",
    "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes. (Josué 1:9)"
];

function initDailyManna() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('mana_last_date');
    let visitCount = parseInt(localStorage.getItem('mana_visit_count') || '0');

    if (lastVisit !== today) {
        localStorage.setItem('mana_last_date', today);
        visitCount = 1;
    } else {
        visitCount++;
    }
    localStorage.setItem('mana_visit_count', visitCount);

    let verse = (visitCount >= 2) 
        ? "Dios sigue siendo tu refugio, Yulexi. 🛡️" 
        : mannaVerses[Math.floor(Math.random() * mannaVerses.length)];

    const scroll = document.createElement('div');
    scroll.id = 'mana-scroll';
    scroll.innerHTML = `<div class="scroll-inner"><p>${verse}</p></div>`;
    document.body.appendChild(scroll);

    setTimeout(() => {
        scroll.classList.add('fade-out');
        setTimeout(() => scroll.remove(), 2500);
    }, 6000);
}
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

    // --- LÓGICA DE LA BROMITA FUGITIVA ---
    const handleEscape = (e) => {
        if (escapeCount >= maxEscapes) return; // Ya se dejó atrapar

        escapeCount++;
        
        // Cambiamos el mensaje para picarla un poco
        if (bromaStatus) bromaStatus.innerHTML = bromaPhrases[escapeCount - 1] || bromaPhrases[0];
        
        if (!zafiroCard || !bromaBtn) return; // Seguridad extra si faltan elementos clave
        
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
        if (bromaBtn) {
            bromaBtn.removeEventListener('mouseover', handleEscape);
            bromaBtn.removeEventListener('touchstart', handleEscape);
            
            // Restauramos el botón y cambiamos el estado
            bromaBtn.classList.add('atrapado');
            bromaBtn.innerText = "¡Me ampayaste! ✨";
        }
        if (bromaStatus) bromaStatus.style.opacity = 0; // Ocultar mensajes de broma
        
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
                checkGraceMemory(); // Verificar memoria al revelar el altar
            }
        }, 1000);
    }

    // Activamos la broma para desktop y móvil
    if (bromaBtn) {
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
    }

    // --- EASTER EGG: Ritmo Piurano (3 Rápidas, 2 Lentas) ---
    let clickTimes = [];
    document.addEventListener('click', (e) => {
        // Ondas Expansivas (Ripple) al hacer clic en cualquier parte del fondo
        if (e.target.id === 'network-canvas' || e.target.tagName === 'BODY') {
            for(let p of particles) {
                let dx = p.x - e.clientX; let dy = p.y - e.clientY;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 150) {
                    p.vx += (dx / dist) * 8; p.vy += (dy / dist) * 8;
                }
            }
        }

        if(!e.target || e.target.closest('button') || e.target.closest('.glass-card-3d')) return;

        const now = Date.now();
        // Reiniciar si pasa más de 2 segundos desde el último clic
        if (clickTimes.length > 0 && now - clickTimes[clickTimes.length - 1] > 2000) {
            clickTimes = []; 
        }

        clickTimes.push(now);
        if (clickTimes.length > 5) clickTimes.shift();

        if (clickTimes.length === 5) {
            const diffs = [
                clickTimes[1] - clickTimes[0], clickTimes[2] - clickTimes[1],
                clickTimes[3] - clickTimes[2], clickTimes[4] - clickTimes[3]
            ];

            const isFast = (t) => t < 350; 
            const isSlow = (t) => t >= 350 && t < 1200;

            if (isFast(diffs[0]) && isFast(diffs[1]) && isSlow(diffs[2]) && isSlow(diffs[3])) {
                document.body.classList.add('festa-zafiro');
                
                const msg = document.createElement('div');
                msg.innerText = '¡Esa es la energía, socia! 🪩✨';
                msg.className = 'floating-neon-msg';
                msg.style.left = `${e.clientX}px`;
                msg.style.top = `${e.clientY}px`;
                document.body.appendChild(msg);
                
                setTimeout(() => msg.remove(), 4000);
                clickTimes = [];
            }
        }
    });
    let selectedMood = '';
    let moodTimeout;

    moodBtns.forEach(btn => {
        // Efecto de sonido al pasar el mouse (hover)
        btn.addEventListener('mouseenter', () => playTone(600, 'sine', 0.1, 0.02));
        
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMood = btn.getAttribute('data-mood');
            playTone(800, 'triangle', 0.2, 0.05); // Efecto de sonido al seleccionar

            // Mapeo de ánimos a las clases de animación en styles.css
            const moodClasses = {
                'Agradecida': 'mood-agradecida',
                'Cansada': 'mood-cansada',
                'Bendecida': 'mood-bendecida',
                'Con chispa': 'mood-chispa'
            };

            const moodClass = moodClasses[selectedMood];
            if (moodClass) {
                // Limpiar estados previos y aplicar el nuevo al body
                if (moodTimeout) clearTimeout(moodTimeout);
                Object.values(moodClasses).forEach(cls => document.body.classList.remove(cls));
                document.body.classList.add(moodClass);

                // Ajuste de física según el ánimo
                if (selectedMood === 'Cansada') particleSpeedModifier = 0.4; // Calma total
                else if (selectedMood === 'Con chispa') particleSpeedModifier = 2.5; // Vibración alta
                else particleSpeedModifier = 1;

                // Retorno a la calma tras 4 segundos
                moodTimeout = setTimeout(() => {
                    document.body.classList.remove(moodClass);
                    particleSpeedModifier = 1;
                }, 4000);
            }
        });
    });

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

    // Easter Egg sorpresa al escribir palabras clave
    if (buzonInput) {
        buzonInput.addEventListener('input', (e) => {
            const text = e.target.value.toLowerCase();
            const secretMsg = document.getElementById('mensaje-secreto');
            if (secretMsg) {
                if (text.includes('socia') || text.includes('piura') || text.includes('yulexi')) {
                    secretMsg.innerText = "¡Yo también te quiero, churre! 💛";
                    secretMsg.classList.add('visible');
                } else {
                    secretMsg.classList.remove('visible');
                }
            }
        });
    }

    if (sendBtn && buzonInput) {
        sendBtn.addEventListener('click', async () => {
            const message = buzonInput.value.trim();
            if (!message) return; // Evita enviar mensajes en blanco

            // Feedback de Interfaz: Enviando
            const originalText = sendBtn.innerText;
            sendBtn.innerText = "Enviando al cielo... ✨";
            sendBtn.disabled = true;
            sendBtn.style.transform = 'scale(0.95)';
            sendBtn.style.opacity = '0.7';

            const webhookUrl = "https://discord.com/api/webhooks/1499446491419508947/Bp03dS7u2fOjF2fYDoke1eSqeV4s5w1u5FKuElm_lcUi6qWbIV7N3MpJZ-gbQixaq3rg";
            const moodPrefix = selectedMood ? `✨ Estado de ánimo: ${selectedMood} ✨\n\n` : '';

            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: `${moodPrefix}**🕊️ Entrega en el Altar de Gracia**\n> ${message}`
                    })
                });

                if (response.ok) {
                    buzonInput.value = ''; // Limpiar el campo
                    
                    // Guardar en Memoria de Gracia
                    localStorage.setItem('grace_last_text', message);
                    localStorage.setItem('grace_last_date', new Date().toDateString());
                    checkGraceMemory();

                    // Respuesta personalizada según el ánimo
                    if (selectedMood === 'Cansada') {
                        sendBtn.innerText = "Descansa en Su soberanía, Yulexi";
                    } else if (selectedMood === 'Con chispa') {
                        sendBtn.innerText = "¡Esa es mi socia! Me hiciste el día";
                    } else {
                        sendBtn.innerText = "Tu oración ha sido entregada. Respira, Abejita... 🙏";
                    }
                    
                    // Limpieza visual tras el envío
                    selectedMood = '';
                    moodBtns.forEach(b => b.classList.remove('selected'));
                    document.body.classList.remove('mood-agradecida', 'mood-cansada', 'mood-bendecida', 'mood-chispa');
                    particleSpeedModifier = 1;
                    
                    // Efecto de liberación (Partículas saltan)
                    playTone(1200, 'sine', 0.6, 0.05); // Sonido celestial de envío
                    for(let p of particles) {
                        p.vx = (Math.random() - 0.5) * 12;
                        p.vy = (Math.random() - 0.5) * 12;
                    }
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
                sendBtn.style.transform = 'none';
            }, 3000);
        });
    }

    // --- INICIALIZACIÓN FINAL ---
    initParticles(); 
    animateParticles();
    initDailyManna();
    checkGraceMemory();
});

// --- 6. MEMORIA DE GRACIA ---
function checkGraceMemory() {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('grace_last_date');
    const lastText = localStorage.getItem('grace_last_text');
    const buzon = document.getElementById('buzon-zafiro');
    const historyIcon = document.getElementById('grace-history');
    const historyMsg = document.getElementById('history-msg');

    if (!buzon) return;

    // Si ya envió una gratitud hoy, activar el aura dorada
    if (lastDate === today) {
        buzon.classList.add('aura-gold');
    }

    // Si hay un historial de un día anterior, mostrar el icono
    if (lastText && lastDate !== today) {
        historyIcon.classList.remove('hidden');
        if (historyMsg) {
            historyMsg.innerText = `¿Recuerdas que anteriormente estabas agradecida por: "${lastText}"? Dios es fiel.`;
        }
    }
}

// --- 7. SINTETIZADOR DE SONIDO (Web Audio API) ---
// ¡Crea sonidos mágicos sin necesidad de descargar archivos MP3!
function playTone(freq, type = 'sine', duration = 0.3, vol = 0.1) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!window.audioCtx) window.audioCtx = new AudioContext();
        if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
        
        const osc = window.audioCtx.createOscillator();
        const gain = window.audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, window.audioCtx.currentTime);
        
        gain.gain.setValueAtTime(vol, window.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, window.audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(window.audioCtx.destination);
        
        osc.start();
        osc.stop(window.audioCtx.currentTime + duration);
    } catch(e) { console.log("Audio no soportado en este dispositivo"); }
}