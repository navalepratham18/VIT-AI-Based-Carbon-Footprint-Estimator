/* ═══════════════════════════════════════════════════════════════
   ECOGUARD Virtual Forest — Frontend Logic
   SVG tree rendering, chart, leaderboard, particles
   ═══════════════════════════════════════════════════════════════ */

const API = '';
let currentUserId = null;
let currentTab = 'forest';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── SVG Tree Templates ────────────────────────────────────────

function generateTreeSVG(species, health) {
    const colors = {
        healthy: {
            oak:    { crown: '#22c55e', crownDark: '#16a34a', trunk: '#92400e' },
            pine:   { crown: '#10b981', crownDark: '#059669', trunk: '#78350f' },
            maple:  { crown: '#34d399', crownDark: '#10b981', trunk: '#a16207' },
            birch:  { crown: '#6ee7b7', crownDark: '#34d399', trunk: '#d4d4d8' },
            cherry: { crown: '#f9a8d4', crownDark: '#f472b6', trunk: '#92400e' },
            willow: { crown: '#86efac', crownDark: '#4ade80', trunk: '#78350f' },
        },
        neutral: {
            oak:    { crown: '#a3a3a3', crownDark: '#737373', trunk: '#78716c' },
            pine:   { crown: '#a3a3a3', crownDark: '#737373', trunk: '#78716c' },
            maple:  { crown: '#a3a3a3', crownDark: '#737373', trunk: '#78716c' },
            birch:  { crown: '#a3a3a3', crownDark: '#737373', trunk: '#a8a29e' },
            cherry: { crown: '#a3a3a3', crownDark: '#737373', trunk: '#78716c' },
            willow: { crown: '#a3a3a3', crownDark: '#737373', trunk: '#78716c' },
        },
        unhealthy: {
            oak:    { crown: '#854d0e', crownDark: '#713f12', trunk: '#57534e' },
            pine:   { crown: '#854d0e', crownDark: '#713f12', trunk: '#57534e' },
            maple:  { crown: '#92400e', crownDark: '#78350f', trunk: '#57534e' },
            birch:  { crown: '#78350f', crownDark: '#713f12', trunk: '#78716c' },
            cherry: { crown: '#9f1239', crownDark: '#881337', trunk: '#57534e' },
            willow: { crown: '#854d0e', crownDark: '#713f12', trunk: '#57534e' },
        }
    };

    const c = colors[health]?.[species] || colors.healthy.oak;
    const id = `tree_${Math.random().toString(36).substr(2, 5)}`;

    const shapes = {
        oak: `
            <ellipse cx="40" cy="35" rx="28" ry="25" fill="url(#${id}_g)"/>
            <ellipse cx="28" cy="45" rx="18" ry="16" fill="url(#${id}_g)" opacity="0.8"/>
            <ellipse cx="52" cy="45" rx="18" ry="16" fill="url(#${id}_g)" opacity="0.8"/>
            <rect x="36" y="55" width="8" height="30" rx="3" fill="${c.trunk}"/>
        `,
        pine: `
            <polygon points="40,8 58,40 22,40" fill="url(#${id}_g)"/>
            <polygon points="40,20 62,52 18,52" fill="url(#${id}_g)"/>
            <polygon points="40,32 65,65 15,65" fill="url(#${id}_g)"/>
            <rect x="36" y="62" width="8" height="22" rx="3" fill="${c.trunk}"/>
        `,
        maple: `
            <ellipse cx="40" cy="32" rx="25" ry="22" fill="url(#${id}_g)"/>
            <circle cx="25" cy="40" r="12" fill="url(#${id}_g)" opacity="0.7"/>
            <circle cx="55" cy="40" r="12" fill="url(#${id}_g)" opacity="0.7"/>
            <circle cx="40" cy="25" r="14" fill="url(#${id}_g)" opacity="0.6"/>
            <rect x="36" y="52" width="8" height="30" rx="3" fill="${c.trunk}"/>
        `,
        birch: `
            <ellipse cx="40" cy="30" rx="20" ry="22" fill="url(#${id}_g)"/>
            <ellipse cx="40" cy="42" rx="16" ry="14" fill="url(#${id}_g)" opacity="0.7"/>
            <rect x="37" y="50" width="6" height="35" rx="2" fill="${c.trunk}"/>
            <line x1="39" y1="55" x2="39" y2="84" stroke="#52525b" stroke-width="0.5" opacity="0.4"/>
            <line x1="41" y1="60" x2="41" y2="84" stroke="#52525b" stroke-width="0.5" opacity="0.3"/>
        `,
        cherry: `
            <circle cx="30" cy="30" r="14" fill="url(#${id}_g)"/>
            <circle cx="50" cy="30" r="14" fill="url(#${id}_g)"/>
            <circle cx="40" cy="22" r="14" fill="url(#${id}_g)"/>
            <circle cx="35" cy="38" r="10" fill="url(#${id}_g)" opacity="0.8"/>
            <circle cx="48" cy="38" r="10" fill="url(#${id}_g)" opacity="0.8"/>
            <rect x="37" y="45" width="6" height="35" rx="3" fill="${c.trunk}"/>
        `,
        willow: `
            <ellipse cx="40" cy="28" rx="22" ry="18" fill="url(#${id}_g)"/>
            <path d="M22,35 Q15,60 12,75" stroke="${c.crown}" stroke-width="2.5" fill="none" opacity="0.6"/>
            <path d="M30,38 Q25,58 22,72" stroke="${c.crown}" stroke-width="2" fill="none" opacity="0.5"/>
            <path d="M50,38 Q55,58 58,72" stroke="${c.crown}" stroke-width="2" fill="none" opacity="0.5"/>
            <path d="M58,35 Q65,60 68,75" stroke="${c.crown}" stroke-width="2.5" fill="none" opacity="0.6"/>
            <rect x="37" y="40" width="6" height="40" rx="2" fill="${c.trunk}"/>
        `
    };

    return `
        <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="tree-svg">
            <defs>
                <radialGradient id="${id}_g" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stop-color="${c.crown}"/>
                    <stop offset="100%" stop-color="${c.crownDark}"/>
                </radialGradient>
            </defs>
            ${shapes[species] || shapes.oak}
        </svg>
    `;
}


// ─── Initialize App ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    setupNavTabs();
    loadUsers().then(() => {
        loadCurrentTab();
    });
    initLeafParticles();
});


// ─── Navigation ────────────────────────────────────────────────

function setupNavTabs() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`tab-${target}`).classList.add('active');
            currentTab = target;
            loadCurrentTab();
        });
    });
}

function loadCurrentTab() {
    switch (currentTab) {
        case 'forest': loadForest(); break;
        case 'dashboard': loadDashboard(); break;
        case 'leaderboard': loadLeaderboard(); break;
    }
}


// ─── Users ─────────────────────────────────────────────────────

async function loadUsers() {
    try {
        const res = await fetch(`${API}/api/users`);
        const users = await res.json();
        const select = document.getElementById('userSelect');
        select.innerHTML = '';
        users.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.id;
            opt.textContent = u.username;
            select.appendChild(opt);
        });
        if (users.length > 0) {
            currentUserId = users[0].id;
            select.value = currentUserId;
        }
        
        select.addEventListener('change', () => {
            currentUserId = select.value;
            loadCurrentTab();
        });
    } catch (e) {
        console.error('Failed to load users:', e);
    }
}


// ─── Forest Tab ────────────────────────────────────────────────

async function loadForest() {
    try {
        const [forestRes, statsRes] = await Promise.all([
            fetch(`${API}/api/users/${currentUserId}/forest`),
            fetch(`${API}/api/users/${currentUserId}/stats`)
        ]);
        const forest = await forestRes.json();
        const stats = await statsRes.json();

        // Update pills
        document.getElementById('forestTotalTrees').textContent = stats.total_trees || 0;
        document.getElementById('forestHealthy').textContent = stats.healthy_trees || 0;
        document.getElementById('forestUnhealthy').textContent = (stats.total_trees - stats.healthy_trees) || 0;
        document.getElementById('forestStreak').textContent = stats.streak || 0;

        // Render trees
        const landscape = document.getElementById('forestLandscape');
        landscape.innerHTML = '';

        if (forest.trees.length === 0) {
            landscape.innerHTML = `
                <div style="text-align:center; padding:80px 20px; color: var(--text-muted);">
                    <div style="font-size:64px; margin-bottom:16px;">🌱</div>
                    <p style="font-size:16px; font-weight:500;">Your forest is empty!</p>
                    <p style="font-size:13px; margin-top:8px;">Log your first monthly footprint to plant a tree.</p>
                </div>
            `;
            return;
        }

        forest.trees.forEach((tree, i) => {
            const div = document.createElement('div');
            div.className = `tree-item ${tree.health}`;
            div.style.animationDelay = `${i * 0.1}s`;
            div.innerHTML = `
                ${generateTreeSVG(tree.species, tree.health)}
                <span class="tree-label">${tree.species} · ${MONTH_NAMES[tree.earned_month]} ${tree.earned_year}</span>
            `;
            landscape.appendChild(div);
        });
    } catch (e) {
        console.error('Failed to load forest:', e);
    }
}


// ─── Dashboard Tab ─────────────────────────────────────────────

async function loadDashboard() {
    try {
        const res = await fetch(`${API}/api/users/${currentUserId}/stats`);
        const stats = await res.json();

        // Stat cards
        const fps = stats.footprints || [];
        const avg = fps.length > 0
            ? (fps.reduce((s, f) => s + f.co2_kg, 0) / fps.length).toFixed(1)
            : '—';
        document.getElementById('dashAvgCO2').textContent = avg;

        const best = stats.best_month;
        document.getElementById('dashBestMonth').textContent = best
            ? `${best.co2_kg.toFixed(0)} kg`
            : '—';

        document.getElementById('dashStreak').textContent = stats.streak || 0;
        document.getElementById('dashTotalTrees').textContent = stats.total_trees || 0;

        // Chart
        renderChart(fps, stats.trees || []);

        // Setup form
        setupLogForm();
    } catch (e) {
        console.error('Failed to load dashboard:', e);
    }
}

function renderChart(footprints, trees) {
    const container = document.getElementById('chartContainer');
    container.innerHTML = '';

    if (footprints.length === 0) {
        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;color:var(--text-muted);font-size:14px;">No data yet. Log your first footprint!</div>`;
        return;
    }

    const maxCO2 = Math.max(...footprints.map(f => f.co2_kg));

    footprints.forEach((fp, i) => {
        const pct = maxCO2 > 0 ? (fp.co2_kg / maxCO2) * 100 : 0;

        // Find matching tree health
        const tree = trees.find(t => t.earned_month === fp.month && t.earned_year === fp.year);
        let barClass = 'bar-neutral';
        if (tree) {
            barClass = tree.health === 'healthy' ? 'bar-healthy'
                     : tree.health === 'unhealthy' ? 'bar-unhealthy'
                     : 'bar-neutral';
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'chart-bar-wrapper';
        wrapper.innerHTML = `
            <span class="chart-bar-value">${fp.co2_kg.toFixed(0)}</span>
            <div class="chart-bar ${barClass}" style="height: ${Math.max(pct, 3)}%;" title="${fp.co2_kg.toFixed(2)} kg CO₂"></div>
            <span class="chart-bar-label">${MONTH_NAMES[fp.month]}<br>${fp.year}</span>
        `;
        wrapper.style.animationDelay = `${i * 0.05}s`;
        container.appendChild(wrapper);
    });
}


// ─── Log Footprint Form ────────────────────────────────────────

function setupLogForm() {
    // Manual logging is disabled - data is synced from EcoGuard main app
    const form = document.getElementById('logForm');
    if (form) form.style.display = 'none';
}

function showLogResult(msg, type) {
    const el = document.getElementById('logResult');
    el.textContent = msg;
    el.className = `log-result ${type}`;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 6000);
}


// ─── Tree Modal ────────────────────────────────────────────────

function showTreeModal(tree) {
    const modal = document.getElementById('treeModal');
    const titleEl = document.getElementById('modalTitle');
    const msgEl = document.getElementById('modalMessage');
    const svgContainer = document.getElementById('modalTreeSVG');

    svgContainer.innerHTML = generateTreeSVG(tree.species, tree.health);

    const titles = {
        healthy: '🌳 New Healthy Tree!',
        neutral: '🌲 Tree Added',
        unhealthy: '🥀 Tree Needs Care'
    };
    const messages = {
        healthy: `Amazing! Your carbon footprint went down. You earned a beautiful ${tree.species} tree for your forest!`,
        neutral: `Your footprint stayed about the same. Keep pushing to grow healthier trees!`,
        unhealthy: `Your footprint went up this month. This ${tree.species} tree isn't looking great — reduce your emissions to help it recover!`
    };

    titleEl.textContent = titles[tree.health];
    msgEl.textContent = messages[tree.health];
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('treeModal').classList.add('hidden');
}


// ─── Leaderboard Tab ───────────────────────────────────────────

async function loadLeaderboard() {
    try {
        const res = await fetch(`${API}/api/leaderboard`);
        const data = await res.json();

        renderPodium(data.slice(0, 3));
        renderRankings(data);
    } catch (e) {
        console.error('Failed to load leaderboard:', e);
    }
}

function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function renderPodium(top3) {
    const podium = document.getElementById('podium');
    podium.innerHTML = '';

    // Reorder: 2nd, 1st, 3rd for visual layout
    const order = [1, 0, 2];
    const medals = ['🥇', '🥈', '🥉'];
    const rankNums = ['1', '2', '3'];

    order.forEach(idx => {
        const user = top3[idx];
        if (!user) return;
        const div = document.createElement('div');
        div.className = 'podium-item';
        div.innerHTML = `
            <div class="podium-avatar">
                ${getInitials(user.username)}
                <span class="podium-medal">${medals[idx]}</span>
            </div>
            <span class="podium-name">${user.username}</span>
            <span class="podium-score">${user.tree_requirement_score} kg/mo</span>
            <div class="podium-pedestal">${rankNums[idx]}</div>
        `;
        div.addEventListener('click', () => {
            document.getElementById('userSelect').value = user.id;
            currentUserId = user.id;
            document.querySelector('[data-tab="forest"]').click();
        });
        podium.appendChild(div);
    });
}

function renderRankings(data) {
    const table = document.getElementById('rankingsTable');
    table.innerHTML = '';

    data.forEach((user, i) => {
        const row = document.createElement('div');
        row.className = 'ranking-row';
        row.innerHTML = `
            <span class="rank-num">${i + 1}</span>
            <div class="rank-user">
                <div class="rank-avatar" style="background: hsl(${user.avatar_seed * 37 % 360}, 60%, 45%)">${getInitials(user.username)}</div>
                <span class="rank-name">${user.username}</span>
            </div>
            <span class="rank-trees">🌳 ${user.total_trees}</span>
            <span class="rank-months">${user.months_tracked} mo</span>
            <span class="rank-score">${user.tree_requirement_score} kg/mo</span>
        `;
        row.addEventListener('click', () => {
            document.getElementById('userSelect').value = user.id;
            currentUserId = user.id;
            document.querySelector('[data-tab="forest"]').click();
        });
        table.appendChild(row);
    });
}


// ═══════════════════════════════════════════════════════════════
// FLOATING LEAF PARTICLES
// ═══════════════════════════════════════════════════════════════

function initLeafParticles() {
    const canvas = document.getElementById('leafCanvas');
    const ctx = canvas.getContext('2d');
    let leaves = [];
    const LEAF_COUNT = 20;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Leaf {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = 4 + Math.random() * 6;
            this.speedY = 0.3 + Math.random() * 0.7;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.03;
            this.opacity = 0.15 + Math.random() * 0.25;
            this.wobbleAmp = 20 + Math.random() * 30;
            this.wobbleFreq = 0.01 + Math.random() * 0.02;
            this.wobbleOffset = Math.random() * 1000;
            // Green-ish leaf colors
            const hue = 100 + Math.random() * 60;
            const sat = 40 + Math.random() * 30;
            const light = 35 + Math.random() * 25;
            this.color = `hsla(${hue}, ${sat}%, ${light}%, ${this.opacity})`;
        }
        update(t) {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin((t + this.wobbleOffset) * this.wobbleFreq) * 0.3;
            this.rotation += this.rotSpeed;
            if (this.y > canvas.height + 20) this.reset();
        }
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Leaf shape
            ctx.moveTo(0, -this.size);
            ctx.bezierCurveTo(this.size, -this.size * 0.5, this.size, this.size * 0.5, 0, this.size);
            ctx.bezierCurveTo(-this.size, this.size * 0.5, -this.size, -this.size * 0.5, 0, -this.size);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < LEAF_COUNT; i++) {
        leaves.push(new Leaf());
    }

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t++;
        leaves.forEach(leaf => {
            leaf.update(t);
            leaf.draw(ctx);
        });
        requestAnimationFrame(animate);
    }
    animate();
}
