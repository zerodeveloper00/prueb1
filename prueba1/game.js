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
        this.baseRadius = Math.random() * 2 + 1; this.radius = this.baseRadius;
    }
    update() {
        // Física Reactiva: Huyen del cursor
        let dx = mouse.x - this.x; let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
            const forceDirectionX = dx / dist; const forceDirectionY = dy / dist;
            const force = (150 - dist) / 150;
            this.vx -= forceDirectionX * force * 0.5;
            this.vy -= forceDirectionY * force * 0.5;
            this.radius = this.baseRadius * 2; // Brillan al acercarse
        } else {
            this.radius = this.baseRadius;
        }

        // Fricción y movimiento
        this.vx *= 0.98; this.vy *= 0.98; // Se calman solas
        this.x += this.vx + (Math.random() - 0.5) * 0.5; 
        this.y += this.vy + (Math.random() - 0.5) * 0.5;

        // Rebote suave en bordes
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00E5FF'; ctx.fill();
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
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath(); ctx.strokeStyle = `rgba(0, 229, 255, ${1 - dist/120})`;
                ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
            }
        }
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
const bromaPhrases = [
    "¡Gua, socia! Te falta rapidez limeña.",
    "No me ampayas, churre. ¡Intenta de nuevo!",
    "Ese Metropolitano te ha vuelto lenta, ¿no?",
    "¿Me atrapas o te traigo chifles?",
    "¡La última, pues!",
    "Ya, ya, está bien, te dejé ganar."
];
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
            bromaBtn.innerText = "¡Casi!";
        }
        bromaBtn.style.left = `${randomX}px`;
        bromaBtn.style.top = `${randomY}px`;
        
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