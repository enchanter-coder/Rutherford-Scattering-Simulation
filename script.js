// Canvas setup
const canvas = document.getElementById('scatteringCanvas');
const ctx = canvas.getContext('2d');

// Constants
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;
const NUCLEUS_X = CANVAS_WIDTH / 2;
const NUCLEUS_Y = CANVAS_HEIGHT / 2;
// Reduced radius to show "concentrated mass" better
const NUCLEUS_RADIUS = 15; 
// Increased constant to ensure strong repulsion at close range (Real Physics)
const COULOMB_CONSTANT = 15.0; 

// State
let isPlaying = false;
let particles = [];
let protons = 80;
let neutrons = 121;
let energy = 75;
let showTraces = true;
let nucleusModel = 'rutherford';
let lastParticleTime = 0;
let animationId = null;

// Alpha Particle Class
class AlphaParticle {
    constructor(y, speed) {
        this.x = -20;
        this.y = y;
        this.vx = speed;
        this.vy = 0;
        this.path = [{x: this.x, y: this.y}];
        this.charge = 2; // Alpha particle charge
        this.mass = 4;   // Alpha particle mass
        this.isActive = true;
    }

    update(nucleusCharge) {
        if (!this.isActive) return;

        // Calculate distance to nucleus
        const dx = this.x - NUCLEUS_X;
        const dy = this.y - NUCLEUS_Y;
        // Avoid division by zero with a small epsilon
        const distanceSq = dx * dx + dy * dy; 
        const distance = Math.sqrt(distanceSq);

        // Apply Coulomb force
        // F = k * q1 * q2 / r^2
        // We apply this force continuously for Rutherford model
        if (nucleusModel === 'rutherford') {
            // We removed the 'distance < 300' limit to allow realistic long-range minor deflections
            const forceMagnitude = (COULOMB_CONSTANT * this.charge * nucleusCharge) / distanceSq;
            
            // F = ma -> a = F/m
            const ax = (dx / distance) * forceMagnitude / this.mass;
            const ay = (dy / distance) * forceMagnitude / this.mass;

            // Update velocity
            this.vx += ax;
            this.vy += ay;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Store path for traces
        this.path.push({x: this.x, y: this.y});
        if (this.path.length > 200) {
            this.path.shift();
        }

        // Deactivate if out of bounds
        if (this.x > CANVAS_WIDTH + 50 || this.x < -50 || 
            this.y > CANVAS_HEIGHT + 50 || this.y < -50) {
            this.isActive = false;
        }
    }

    draw() {
        // Draw trace
        if (showTraces && this.path.length > 1) {
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)'; // Slightly more transparent
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(this.path[0].x, this.path[0].y);
            for (let i = 1; i < this.path.length; i++) {
                ctx.lineTo(this.path[i].x, this.path[i].y);
            }
            ctx.stroke();
        }

        // Draw particle body
        ctx.fillStyle = '#ff0066';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create new particle with Physics-based distribution
function createParticle() {
    // PHYSICS FIX:
    // Instead of forcing 80% to go straight using if/else,
    // we randomly distribute the 'y' start position (Impact Parameter).
    // Most particles naturally miss the center because the center is small.
    
    // Spread particles across a beam width (e.g., 300px high)
    const beamWidth = 300; 
    const yOffset = (Math.random() - 0.5) * beamWidth;
    
    const speed = 2 + (energy / 100) * 4; // Adjusted speed scale
    
    const particle = new AlphaParticle(
        NUCLEUS_Y + yOffset,
        speed
    );
    particles.push(particle);
}

// Draw nucleus
function drawNucleus() {
    if (nucleusModel === 'rutherford') {
        // Rutherford model - concentrated nucleus
        
        // Draw Protons and Neutrons clustered tight
        const protonCount = Math.min(protons, 50); // Cap visual count for performance
        const neutronCount = Math.min(neutrons, 50);
        
        // Draw Nucleus Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff6600';
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(NUCLEUS_X, NUCLEUS_Y, NUCLEUS_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Helper to draw nucleon
        function drawNucleon(color, angleOffset) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.sqrt(Math.random()) * (NUCLEUS_RADIUS - 2);
            const cx = NUCLEUS_X + Math.cos(angle) * dist;
            const cy = NUCLEUS_Y + Math.sin(angle) * dist;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 0; i < protonCount; i++) drawNucleon('#ff3333');
        for (let i = 0; i < neutronCount; i++) drawNucleon('#bbbbbb');

    } else {
        // Plum pudding model - diffuse positive charge
        const gradient = ctx.createRadialGradient(NUCLEUS_X, NUCLEUS_Y, 0, NUCLEUS_X, NUCLEUS_Y, 120);
        gradient.addColorStop(0, 'rgba(255, 100, 100, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 100, 100, 0.05)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(NUCLEUS_X, NUCLEUS_Y, 120, 0, Math.PI * 2);
        ctx.fill();

        // Draw scattered electrons
        for (let i = 0; i < 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const radius = 25 + Math.random() * 80;
            const ex = NUCLEUS_X + Math.cos(angle) * radius;
            const ey = NUCLEUS_Y + Math.sin(angle) * radius;
            
            ctx.fillStyle = '#0066ff';
            ctx.beginPath();
            ctx.arc(ex, ey, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Draw gold foil
function drawGoldFoil() {
    // REMOVED THE FILL RECTANGLE THAT OBSCURED THE NUCLEUS
    // Only drawing faint lines to suggest the foil exists
    
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)'; // Very transparent gold
    ctx.lineWidth = 1;
    
    // Draw top and bottom borders only, not through the center
    ctx.beginPath();
    ctx.moveTo(NUCLEUS_X, 0);
    ctx.lineTo(NUCLEUS_X, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(NUCLEUS_X, CANVAS_HEIGHT);
    ctx.lineTo(NUCLEUS_X, CANVAS_HEIGHT - 50);
    ctx.stroke();
    
    // Add dashed vertical line to indicate the plane
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(NUCLEUS_X, 0);
    ctx.lineTo(NUCLEUS_X, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Animation loop
function animate(timestamp) {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw gold foil background elements
    drawGoldFoil();

    // Draw nucleus
    drawNucleus();

    // Generate new particles
    // Rate depends on energy slider slightly
    if (isPlaying && timestamp - lastParticleTime > (400 - energy*2)) {
        createParticle();
        lastParticleTime = timestamp;
    }

    // Update and draw particles
    const nucleusCharge = protons;
    particles = particles.filter(particle => {
        particle.update(nucleusCharge);
        if (particle.isActive) {
            particle.draw();
            return true;
        }
        return false;
    });

    // Draw Scale Information
    ctx.fillStyle = '#888';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Most space is empty ->', 20, CANVAS_HEIGHT - 20);
    
    animationId = requestAnimationFrame(animate);
}

// --- EVENT LISTENERS (UNCHANGED) ---

document.getElementById('playBtn').addEventListener('click', () => {
    isPlaying = true;
    document.getElementById('playBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'flex';
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    isPlaying = false;
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('playBtn').style.display = 'flex';
});

document.getElementById('resetBtn').addEventListener('click', () => {
    particles = [];
    isPlaying = false;
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('playBtn').style.display = 'flex';
});

document.getElementById('energySlider').addEventListener('input', (e) => {
    energy = parseInt(e.target.value);
});

document.getElementById('tracesCheckbox').addEventListener('change', (e) => {
    showTraces = e.target.checked;
});

// Protons control
document.getElementById('protonsSlider').addEventListener('input', (e) => {
    protons = parseInt(e.target.value);
    document.getElementById('protonsInput').value = protons;
});

document.getElementById('protonsInput').addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    if (value >= 20 && value <= 100) {
        protons = value;
        document.getElementById('protonsSlider').value = protons;
    }
});

// Neutrons control
document.getElementById('neutronsSlider').addEventListener('input', (e) => {
    neutrons = parseInt(e.target.value);
    document.getElementById('neutronsInput').value = neutrons;
});

document.getElementById('neutronsInput').addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    if (value >= 20 && value <= 150) {
        neutrons = value;
        document.getElementById('neutronsSlider').value = neutrons;
    }
});

// Number buttons
document.querySelectorAll('.number-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        const action = btn.dataset.action;
        
        if (target === 'protons') {
            if (action === 'increase' && protons < 100) protons++;
            else if (action === 'decrease' && protons > 20) protons--;
            document.getElementById('protonsInput').value = protons;
            document.getElementById('protonsSlider').value = protons;
        } else if (target === 'neutrons') {
            if (action === 'increase' && neutrons < 150) neutrons++;
            else if (action === 'decrease' && neutrons > 20) neutrons--;
            document.getElementById('neutronsInput').value = neutrons;
            document.getElementById('neutronsSlider').value = neutrons;
        }
    });
});

// Model selector
document.querySelectorAll('.model-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        nucleusModel = btn.dataset.model;
        particles = []; // Clear particles when switching models
    });
});

// Start animation
animate(0);