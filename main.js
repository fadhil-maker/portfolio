// --- RUNTIME APPLICATION MATRIX ARCHITECTURE ---
const canvas = document.getElementById('aether-canvas');
const ctx = canvas.getContext('2d');
const statsDisplay = document.querySelector('.weather-stats');
const searchInput = document.getElementById('weather-search-input');
const flashOverlay = document.querySelector('.thunder-flash');

let particles = [];
let weatherCondition = 'rain'; // Dynamic states: rain, mist, snow, thunder
let animationFrameId = null;

// Synchronize system frame buffer resolution to monitor viewports
function syncViewportMetrics() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', syncViewportMetrics);
syncViewportMetrics();

// --- ATMOSPHERIC PARTICLE VECTOR VECTORING MODEL ---
class AtmosphericVector {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Stagger initial frame placement
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        
        if (weatherCondition === 'rain' || weatherCondition === 'thunder') {
            // High velocity linear descent streams
            this.vx = -1.5 - Math.random() * 1;
            this.vy = 8 + Math.random() * 4;
            this.length = 20 + Math.random() * 15;
            this.alpha = Math.random() * 0.25 + 0.05;
        } else if (weatherCondition === 'snow') {
            // Lazy oscillating drift matrices
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = 1 + Math.random() * 1.5;
            this.radius = 1.5 + Math.random() * 2.5;
            this.alpha = Math.random() * 0.4 + 0.2;
        } else { // Mist / Fog
            // Suspended gaseous cloud elements
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = 0.2 + Math.random() * 0.3;
            this.radius = 3 + Math.random() * 4;
            this.alpha = Math.random() * 0.12 + 0.02;
        }
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundaries overflow reset tracking
        if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        if (weatherCondition === 'rain' || weatherCondition === 'thunder') {
            ctx.strokeStyle = `rgba(176, 161, 113, ${this.alpha})`; // Muted Gold
            ctx.lineWidth = 1;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.vx, this.y + this.length);
            ctx.stroke();
        } else if (weatherCondition === 'snow') {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        } else { // Mist
            ctx.fillStyle = `rgba(234, 234, 234, ${this.alpha})`;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// --- THUNDERSTORM ILLUMINATION LOGIC TIMELINE ---
function executeLightningDischarge() {
    if (weatherCondition !== 'thunder') return;
    flashOverlay.style.opacity = '0.6';
    setTimeout(() => { flashOverlay.style.opacity = '0'; }, 50);
    setTimeout(() => { if(Math.random() > 0.4) executeLightningDischarge(); }, 120);
}

// Automated strobe iteration array checker
setInterval(() => {
    if (weatherCondition === 'thunder' && Math.random() > 0.6) {
        executeLightningDischarge();
    }
}, 3000);

function populateEnvironment(particleDensity) {
    particles = [];
    for (let i = 0; i < particleDensity; i++) {
        particles.push(new AtmosphericVector());
    }
}

// --- RENDER RECURSION PIPELINE LOOP ---
function runAnimationPipeline() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    animationFrameId = requestAnimationFrame(runAnimationPipeline);
}

// --- ASYNCHRONOUS ATMOSPHERIC TELEMETRY LINK ---
async function fetchMeteorologicalMetrics(lat, lon, cityName) {
    try {
        statsDisplay.innerHTML = `SYS // QUERYING ATMOSPHERIC DATA FIELD SECTORS...`;
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        const code = data.current_weather.weathercode;
        
        // Map WMO structural code sequences directly to operational vectors
        if ([95, 96, 99].includes(code)) {
            weatherCondition = 'thunder';
            statsDisplay.innerHTML = `LIVE // LOC: ${cityName.toUpperCase()} // COND: THUNDERSTORM ENERGY STREAM`;
            populateEnvironment(150);
        } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
            weatherCondition = 'snow';
            statsDisplay.innerHTML = `LIVE // LOC: ${cityName.toUpperCase()} // COND: CRYOSPHERIC SNOWFALL DRIFT`;
            populateEnvironment(200);
        } else if ([45, 48].includes(code)) {
            weatherCondition = 'mist';
            statsDisplay.innerHTML = `LIVE // LOC: ${cityName.toUpperCase()} // COND: CONDENSED MIST BOUNDARY`;
            populateEnvironment(250);
        } else {
            weatherCondition = 'rain';
            statsDisplay.innerHTML = `LIVE // LOC: ${cityName.toUpperCase()} // COND: AMBIENT LUXURY GOLDEN RAIN`;
            populateEnvironment(110);
        }
    } catch (error) {
        weatherCondition = 'rain';
        statsDisplay.innerHTML = `FAILSAFE // OFFLINE SYSTEM APPLIED // RENDERING AMBIENT MODEL`;
        populateEnvironment(90);
    }
    if (!animationFrameId) runAnimationPipeline();
}

// --- GEOLOCATION BOUNDARY DECODER ENGINE ---
async function processGeocodeSearch(queryStr) {
    try {
        statsDisplay.innerHTML = `SYS // DECODING GEOLOCATION COORDINATE MATRIX LINK...`;
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(queryStr)}&count=1&format=json`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const coordinateTarget = data.results[0];
            fetchMeteorologicalMetrics(coordinateTarget.latitude, coordinateTarget.longitude, coordinateTarget.name);
        } else {
            statsDisplay.innerHTML = `ERROR // CRITICAL: TARGET LOCATION VALUE REJECTED`;
        }
    } catch(err) {
        statsDisplay.innerHTML = `ERROR // COMMUNICATIONS NETWORK TRAFFIC TIMEOUT`;
    }
}

// Intercept terminal commands via key interception configurations
if (searchInput) {
    searchInput.onkeydown = (e) => {
        if (e.key === 'Enter' && searchInput.value.trim() !== "") {
            processGeocodeSearch(searchInput.value.trim());
            searchInput.value = ""; // Flush input field control buffer
        }
    };
}

// --- INITIAL ENGINE IGNITION ROUTINE ---
// Boots the framework targeting default geographical monitoring telemetry vectors
fetchMeteorologicalMetrics(10.5276, 76.2144, "Thrissur");
// --- PHASE 2: SPA STATE ROUTER ---

// Central Router: Handles seamless screen transitions and automatic state resets
function switchView(targetViewId) {
    // 1. Terminate any active animation frames or weather intervals safely
    if (typeof terminateActiveAnimations === 'function') {
        terminateActiveAnimations();
    }

    // 2. Hide all view containers by removing the 'active' class
    const views = document.querySelectorAll('.app-view');
    views.forEach(view => {
        view.classList.remove('active');
    });

    // 3. Mount the target view screen
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
        targetView.classList.add('active');
        
        // Scroll back to the top of the viewport
        window.scrollTo(0, 0); 
        
        // ====================================================
        // CENTRAL STATE CLEANUP INTERCEPTOR
        // ====================================================
        if (targetViewId === 'home-view') {
            // Restore global navigation capsule layout visibility
            document.body.classList.remove('immersive-mode-active');
            
            // Restore Gravity Golf HUD layout opacity
            const golfHud = document.querySelector('.golf-hud-overlay');
            if (golfHud) golfHud.style.opacity = '1';
            
            // Hide all potential game-over or victory overlays instantly
            const gameOverScreens = document.querySelectorAll('.arcade-game-over');
            gameOverScreens.forEach(screen => {
                screen.style.display = 'none';
            });
        } else {
            // Hide global nav bar when stepping inside any deep immersion sandbox
            document.body.classList.add('immersive-mode-active');
        }
        
        // 4. Safely initialize engines only when their specific view mounts
        if (targetViewId === 'aether-view' && typeof startAetherEngine === 'function') startAetherEngine();
        else if (targetViewId === 'chroma-view' && typeof startChromaStudio === 'function') startChromaStudio();
        else if (targetViewId === 'typing-view' && typeof startTypingDefender === 'function') startTypingDefender();
        else if (targetViewId === 'golf-view' && typeof startGravityGolfPhysics === 'function') startGravityGolfPhysics();
        else if (targetViewId === 'glyph-view' && typeof startGlyphMatrixLab === 'function') startGlyphMatrixLab();
    }
}

// Attach click listeners to all project cards on the Hub
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        // Read the "data-target" attribute we added in the HTML
        const targetViewId = card.getAttribute('data-target');
        switchView(targetViewId);
    });
});

// Attach click listeners to all "Return to Portfolio" buttons
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Always route back to the main hub
        switchView('home-view');
    });
});