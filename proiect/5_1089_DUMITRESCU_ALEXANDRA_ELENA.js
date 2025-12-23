// Obținere referințe canvas și context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Setare dimensiuni canvas
canvas.width = 800;
canvas.height = 600;

// Variabile globale pentru joc
let gameRunning = false;
let score = 0;
let lives = 3;
let availableRockets = 3;
const maxRockets = 3;
let pointsForExtraLife = 1000; // Puncte necesare pentru viață extra
let nextLifeAt = 1000;

// Obiecte de joc
let ship = null;
let asteroids = [];
let rockets = [];

// Stări taste
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    z: false,
    c: false,
    x: false
};

// Inițializare joc
function initGame() {
    score = 0;
    lives = 3;
    availableRockets = maxRockets;
    nextLifeAt = pointsForExtraLife;
    asteroids = [];
    rockets = [];
    gameRunning = false; // Setăm pe false temporar
    
    // Creare navă spațială
    ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 15,
        angle: 0, // Unghiul în radiani (0 = sus)
        speed: 3,
        rotationSpeed: 0.1
    };
    
    // Generare asteroizi inițiali
    createInitialAsteroids(5);
    
    updateUI();
    
    // Activăm jocul
    gameRunning = true;
}

// Creare asteroizi inițiali
function createInitialAsteroids(count) {
    for (let i = 0; i < count; i++) {
        createAsteroid();
    }
}

// Creare un asteroid nou
function createAsteroid() {
    // Generare poziție aleatoare pe margine
    let x, y, vx, vy;
    const edge = Math.floor(Math.random() * 4);
    
    switch(edge) {
        case 0: // Sus
            x = Math.random() * canvas.width;
            y = -20;
            break;
        case 1: // Dreapta
            x = canvas.width + 20;
            y = Math.random() * canvas.height;
            break;
        case 2: // Jos
            x = Math.random() * canvas.width;
            y = canvas.height + 20;
            break;
        case 3: // Stânga
            x = -20;
            y = Math.random() * canvas.height;
            break;
    }
    
    // Viteză aleatoare
    vx = (Math.random() - 0.5) * 2;
    vy = (Math.random() - 0.5) * 2;
    
    // Asigurare că asteroidul se mișcă
    if (Math.abs(vx) < 0.3) vx = vx > 0 ? 0.5 : -0.5;
    if (Math.abs(vy) < 0.3) vy = vy > 0 ? 0.5 : -0.5;
    
    const health = Math.floor(Math.random() * 4) + 1; // 1-4
    
    asteroids.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        health: health,
        maxHealth: health,
        radius: 15 + health * 8 // Dimensiune bazată pe health
    });
}

// Actualizare UI
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('rockets').textContent = availableRockets;
}

// Buclă principală de joc
function gameLoop() {
    if (!gameRunning) return;
    
    // Curățare canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Actualizare și desenare
    updateShip();
    updateAsteroids();
    updateRockets();
    
    drawShip();
    drawAsteroids();
    drawRockets();
    
    // Verificare coliziuni
    checkRocketAsteroidCollisions();
    checkShipAsteroidCollisions();
    checkAsteroidCollisions();
    
    // Continuare buclă
    requestAnimationFrame(gameLoop);
}

// Actualizare navă
function updateShip() {
    if (!gameRunning) return;
    
    // Rotire
    if (keys.z) ship.angle -= ship.rotationSpeed;
    if (keys.c) ship.angle += ship.rotationSpeed;
    
    // Deplasare în patru direcții (independent de orientare)
    if (keys.ArrowUp) ship.y -= ship.speed;
    if (keys.ArrowDown) ship.y += ship.speed;
    if (keys.ArrowLeft) ship.x -= ship.speed;
    if (keys.ArrowRight) ship.x += ship.speed;
    
    // Wrap around (trecere prin margini)
    if (ship.x < 0) ship.x = canvas.width;
    if (ship.x > canvas.width) ship.x = 0;
    if (ship.y < 0) ship.y = canvas.height;
    if (ship.y > canvas.height) ship.y = 0;
}

// Desenare navă (triunghi)
function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    
    ctx.beginPath();
    ctx.moveTo(0, -ship.size);
    ctx.lineTo(-ship.size * 0.6, ship.size * 0.8);
    ctx.lineTo(ship.size * 0.6, ship.size * 0.8);
    ctx.closePath();
    
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fill();
    
    ctx.restore();
}

// Actualizare asteroizi
function updateAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const ast = asteroids[i];
        
        ast.x += ast.vx;
        ast.y += ast.vy;
        
        // Wrap around
        if (ast.x < -ast.radius) ast.x = canvas.width + ast.radius;
        if (ast.x > canvas.width + ast.radius) ast.x = -ast.radius;
        if (ast.y < -ast.radius) ast.y = canvas.height + ast.radius;
        if (ast.y > canvas.height + ast.radius) ast.y = -ast.radius;
        
        // Ștergere asteroizi distruși
        if (ast.health <= 0) {
            asteroids.splice(i, 1);
            // Adăugare puncte
            score += ast.maxHealth * 100;
            updateUI();
            
            // Verificare viață extra
            if (score >= nextLifeAt) {
                lives++;
                nextLifeAt += pointsForExtraLife;
                updateUI();
            }
            
            // Generare asteroid nou
            createAsteroid();
        }
    }
}

// Desenare asteroizi
function drawAsteroids() {
    asteroids.forEach(ast => {
        // Culoare bazată pe health
        let color;
        switch(ast.health) {
            case 1: color = '#00ff00'; break;
            case 2: color = '#ffff00'; break;
            case 3: color = '#ff8800'; break;
            case 4: color = '#ff0000'; break;
            default: color = '#ffffff';
        }
        
        // Desenare cerc
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = color + '33'; // Transparență
        ctx.fill();
        
        // Afișare număr rachete necesare
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ast.health, ast.x, ast.y);
    });
}

// Lansare rachetă
function launchRocket() {
    if (!gameRunning) return;
    if (availableRockets > 0 && rockets.length < maxRockets) {
        // Calculare direcție bazată pe unghiul navei
        const dx = Math.sin(ship.angle);
        const dy = -Math.cos(ship.angle);
        
        rockets.push({
            x: ship.x + dx * ship.size,
            y: ship.y + dy * ship.size,
            vx: dx * 5,
            vy: dy * 5,
            radius: 3
        });
        
        availableRockets--;
        updateUI();
    }
}

// Actualizare rachete
function updateRockets() {
    for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];
        
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        
        // Ștergere rachete care ies din ecran
        if (rocket.x < 0 || rocket.x > canvas.width || 
            rocket.y < 0 || rocket.y > canvas.height) {
            rockets.splice(i, 1);
            availableRockets++;
            updateUI();
        }
    }
}

// Desenare rachete
function drawRockets() {
    ctx.fillStyle = '#ff00ff';
    rockets.forEach(rocket => {
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, rocket.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Verificare coliziuni rachetă-asteroid
function checkRocketAsteroidCollisions() {
    for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];
        
        for (let j = 0; j < asteroids.length; j++) {
            const ast = asteroids[j];
            const dx = rocket.x - ast.x;
            const dy = rocket.y - ast.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ast.radius + rocket.radius) {
                // Coliziune detectată
                ast.health--;
                rockets.splice(i, 1);
                availableRockets++;
                updateUI();
                break;
            }
        }
    }
}

// Verificare coliziuni navă-asteroid
function checkShipAsteroidCollisions() {
    for (let i = 0; i < asteroids.length; i++) {
        const ast = asteroids[i];
        const dx = ship.x - ast.x;
        const dy = ship.y - ast.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ast.radius + ship.size) {
            // Coliziune - pierdere viață
            lives--;
            updateUI();
            
            if (lives <= 0) {
                endGame();
            } else {
                // Repoziționare navă
                ship.x = canvas.width / 2;
                ship.y = canvas.height / 2;
                ship.angle = 0;
            }
            break;
        }
    }
}

// Verificare coliziuni între asteroizi
function checkAsteroidCollisions() {
    for (let i = 0; i < asteroids.length; i++) {
        for (let j = i + 1; j < asteroids.length; j++) {
            const ast1 = asteroids[i];
            const ast2 = asteroids[j];
            
            const dx = ast2.x - ast1.x;
            const dy = ast2.y - ast1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ast1.radius + ast2.radius) {
                // Coliziune - schimbare traiectorii (reflexie elastică simplificată)
                const tempVx = ast1.vx;
                const tempVy = ast1.vy;
                ast1.vx = ast2.vx;
                ast1.vy = ast2.vy;
                ast2.vx = tempVx;
                ast2.vy = tempVy;
                
                // Separare asteroizi pentru a evita suprapunerea
                const angle = Math.atan2(dy, dx);
                const targetDist = ast1.radius + ast2.radius;
                const currentDist = distance;
                const overlap = (targetDist - currentDist) / 2;
                
                ast1.x -= Math.cos(angle) * overlap;
                ast1.y -= Math.sin(angle) * overlap;
                ast2.x += Math.cos(angle) * overlap;
                ast2.y += Math.sin(angle) * overlap;
            }
        }
    }
}

// Terminare joc
function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Event listeners pentru tastatură
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
        e.preventDefault();
    }
    
    if (e.key === 'x' && gameRunning) {
        launchRocket();
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
        e.preventDefault();
    }
});

// Event listeners pentru butoane
document.getElementById('startGame').addEventListener('click', () => {
    document.getElementById('startScreen').classList.add('hidden');
    initGame();
    gameLoop();
});

document.getElementById('restartGame').addEventListener('click', () => {
    document.getElementById('gameOver').classList.add('hidden');
    initGame();
    gameLoop();
});

document.getElementById('saveScore').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (playerName) {
        saveHighScore(playerName, score);
        displayHighScores();
        document.getElementById('playerName').value = '';
    }
});

// Funcții pentru Web Storage (High Scores)
function saveHighScore(name, playerScore) {
    let scores = getHighScores();
    scores.push({ name: name, score: playerScore });
    
    // Sortare descrescător după scor
    scores.sort((a, b) => b.score - a.score);
    
    // Păstrare doar top 5
    scores = scores.slice(0, 5);
    
    localStorage.setItem('asteroids_highscores', JSON.stringify(scores));
}

function getHighScores() {
    const stored = localStorage.getItem('asteroids_highscores');
    return stored ? JSON.parse(stored) : [];
}

function displayHighScores() {
    const scores = getHighScores();
    const list = document.getElementById('scoresList');
    list.innerHTML = '';
    
    scores.forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score} puncte`;
        list.appendChild(li);
    });
}

// Control touchscreen (pentru mobil)
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touchDuration = Date.now() - touchStartTime;
    
    // Tap rapid = lansare rachetă
    if (touchDuration < 200) {
        launchRocket();
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // Deplasare navă bazată pe direcția swipe
    const threshold = 10;
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Mișcare orizontală
            keys.ArrowLeft = deltaX < 0;
            keys.ArrowRight = deltaX > 0;
        } else {
            // Mișcare verticală
            keys.ArrowUp = deltaY < 0;
            keys.ArrowDown = deltaY > 0;
        }
    }
}, { passive: false });

// Inițializare la încărcare pagină
displayHighScores();