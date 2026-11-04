// ============================================
// PORTFOLIO SCRIPT - Ulguy Martial
// Version: um_v2 (migration from P0... to PRO_... and PERSO_...)
// ============================================

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// State with version
let S = { xp: 0, done: [], v: 1 };
try {
  S = JSON.parse(localStorage.getItem('um') || '') || S;
} catch {}

// Migration to v2: reset done array, keep xp
if (S.v !== 2) {
  S = { xp: S.xp || 0, done: [], v: 2 };
}

const save = () => {
  try {
    localStorage.setItem('um', JSON.stringify(S));
  } catch {}
};

const toast = m => {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('show');
  clearTimeout(t._);
  t._ = setTimeout(() => t.classList.remove('show'), 2200);
};

function confetti() {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  for (let n = 0; n < 26; n++) {
    const c = document.createElement('i');
    c.className = 'conf';
    c.style.cssText = `left:50%;top:40%;background:hsl(${n * 37} 90% 60%);--x:${(Math.random() - .5) * 600}px;--y:${Math.random() * 400 - 100}px`;
    document.body.append(c);
    setTimeout(() => c.remove(), 1200);
  }
}

function renderXP() {
  const lv = Math.floor(S.xp / 100) + 1;
  $('#lvl').textContent = 'Niv. ' + lv;
  $('#xptxt').textContent = S.xp + ' XP';
  $('#xpfill').style.width = S.xp % 100 + '%';

  $('#quests').innerHTML = QUESTS.map(q => `
    <li class="${S.done.includes(q[1]) ? 'ok' : ''}">
      ${S.done.includes(q[1]) ? '✅' : '⬜'} ${q[0]}<em>+${q[2]} XP</em>
    </li>
  `).join('');

  // A4: Restore done state for nodes
  $$('.node').forEach(n => {
    n.classList.toggle('done', S.done.includes('PRO_' + n.dataset.id));
  });
}

function award(id, pts, msg) {
  if (S.done.includes(id)) return false;
  S.done.push(id);
  const l = Math.floor(S.xp / 100);
  S.xp += pts;
  toast(`+${pts} XP · ${msg}`);
  if (Math.floor(S.xp / 100) > l) {
    confetti();
    toast(`Niveau ${l + 2} atteint !`);
  }
  save();
  renderXP();
  return true;
}

function count(p) {
  return S.done.filter(x => x.startsWith(p)).length;
}

// ============================================
// DEVICON HELPERS
// ============================================

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons';

function getDeviconUrl(tech) {
  const entry = DEVICON_MAP[tech.toLowerCase()];
  if (!entry) return null;
  
  const [iconName, variant] = entry;
  return `${DEVICON_BASE}/${iconName}/${iconName}-${variant}.svg`;
}

function createTechLogo(tech, size = 24) {
  const techLower = tech.toLowerCase();
  const deviconUrl = getDeviconUrl(techLower);
  const displayName = tech;
  
  if (deviconUrl) {
    const img = document.createElement('img');
    img.src = deviconUrl;
    img.alt = displayName;
    img.width = size;
    img.height = size;
    img.loading = 'lazy';
    img.onerror = () => {
      const span = document.createElement('span');
      span.className = 'tech-badge';
      span.textContent = displayName;
      span.title = displayName;
      img.replaceWith(span);
    };
    return img.outerHTML;
  } else {
    return `<span class="tech-badge" title="${displayName}">${displayName}</span>`;
  }
}

function createTechLogosRow(techList, size = 24) {
  return techList.map(tech => createTechLogo(tech, size)).join('');
}

// ============================================
// RENDER PROJECTS PATH (PRO)
// ============================================

function renderPath() {
  $('#path').innerHTML = PROJECTS_PRO.map((p) => {
    const techLogos = p.stack && p.stack.length > 0 
      ? createTechLogosRow(p.stack, 20)
      : '';
    
    return `
      <li class="node" data-id="${p.id}" data-theme="${p.theme}">
        <button data-id="${p.id}" aria-label="Ouvrir ${p.title}">${p.icon}</button>
        <div>
          <strong>${p.title}</strong>
          <small>${p.date}</small>
          ${techLogos ? `<div class="tech-logos">${techLogos}</div>` : ''}
        </div>
      </li>
    `;
  }).join('');

  // Add click handlers
  $('#path').onclick = e => {
    const b = e.target.closest('button[data-id]');
    if (!b) return;
    const projectId = b.dataset.id;
    const index = PROJECTS_PRO.findIndex(p => p.id === projectId);
    if (index !== -1) {
      openProjectModal('pro', index);
    }
  };
}

// ============================================
// RENDER PERSO PROJECTS
// ============================================

function renderPersoProjects() {
  $('#perso-grid').innerHTML = PROJECTS_PERSO.map((p, i) => {
    const techLogos = p.stack && p.stack.length > 0
      ? createTechLogosRow(p.stack, 24)
      : '';
    
    const isSoon = p.status === 'soon';
    
    // For soon projects, no open button
    let actionsHtml = '';
    if (isSoon) {
      actionsHtml = '<span class="btn ghost" style="cursor:not-allowed;opacity:0.5" aria-disabled="true">Bientôt</span>';
    } else {
      actionsHtml = `
        <a href="${p.vercelUrl}" target="_blank" rel="noopener" class="btn blue" data-perso-id="${p.id}">Voir en ligne</a>
        <a href="${p.repoUrl}" target="_blank" rel="noopener" class="btn ghost" data-perso-id="${p.id}">Code</a>
      `;
    }
    
    // A6: Make title a button for keyboard accessibility
    let titleHtml = `<h3>${p.icon} ${p.title}</h3>`;
    if (!isSoon) {
      titleHtml = `<button class="perso-open" data-index="${i}" aria-label="Ouvrir ${p.title}">${p.icon} ${p.title}</button>`;
    }
    
    return `
      <article class="perso-card ${isSoon ? 'soon' : ''}" data-index="${i}" data-theme="${p.theme}">
        ${titleHtml}
        <div class="date">${p.date}</div>
        <p class="summary">${p.summary}</p>
        ${techLogos ? `<div class="tech-logos">${techLogos}</div>` : ''}
        <div class="actions">${actionsHtml}</div>
      </article>
    `;
  }).join('');

  // A3: New click handler for perso grid
  $('#perso-grid').onclick = e => {
    const link = e.target.closest('a[data-perso-id]');
    if (link) {
      // Link click: XP, no modal
      award('PERSO_' + link.dataset.persoId, 15, 'Projet perso');
      award('pp', 30, 'Quête : projet perso');
      return;
    }
    const open = e.target.closest('.perso-open');
    if (open) {
      openProjectModal('perso', parseInt(open.dataset.index));
    }
  };
}

// ============================================
// MODAL HANDLING
// ============================================

let currentModalTheme = 'default';
let lastFocusedElement = null;

function resetModalTheme() {
  const modal = $('#modal');
  modal.removeAttribute('data-theme');
  currentModalTheme = 'default';
}

function setModalTheme(theme) {
  const modal = $('#modal');
  if (theme !== currentModalTheme) {
    resetModalTheme();
    if (theme !== 'default') {
      modal.setAttribute('data-theme', theme);
    }
    currentModalTheme = theme;
  }
}

function openProjectModal(type, index) {
  const data = type === 'pro' ? PROJECTS_PRO[index] : PROJECTS_PERSO[index];
  const modal = $('#modal');
  const mbody = $('#mbody');
  
  // Save last focused element for A6
  lastFocusedElement = document.activeElement;
  
  // Reset theme first
  resetModalTheme();
  
  // Set theme for this modal
  if (data.theme && data.theme !== 'default') {
    setModalTheme(data.theme);
  }
  
  let content = '';
  
  // Special handling for Open Cowork (B2)
  if (data.id === 'opencowork') {
    content = renderOpenCoworkModalContent(data);
  }
  // Special handling for Lunio (B3)
  else if (data.id === 'lunio') {
    content = renderLunioModalContent(data);
  }
  // Default modal for other projects
  else {
    content = `
      <h3>${data.icon} ${data.title}</h3>
      <p class="sub">${data.date}</p>
      <p>${data.summary}</p>
    `;
    
    if (data.bullets && data.bullets.length > 0) {
      content += '<ul>' + data.bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
    }
    
    if (data.stack && data.stack.length > 0) {
      content += '<div class="tech-logos">' + createTechLogosRow(data.stack, 24) + '</div>';
    }
    
    // For perso projects with links
    if (type === 'perso' && data.status === 'live' && (data.vercelUrl || data.repoUrl)) {
      content += '<div class="row" style="margin-top:16px">';
      if (data.vercelUrl) {
        content += `<a href="${data.vercelUrl}" target="_blank" rel="noopener" class="btn blue">Voir en ligne</a>`;
      }
      if (data.repoUrl) {
        content += `<a href="${data.repoUrl}" target="_blank" rel="noopener" class="btn ghost">Code</a>`;
      }
      content += '</div>';
    }
  }
  
  mbody.innerHTML = content;
  
  // A1 & A2: Unified award logic for pro projects
  if (type === 'pro') {
    award('PRO_' + data.id, 15, data.title);
    // Check for "Ouvre 3 projets" quest
    if (count('PRO_') >= 3 && !S.done.includes('p3')) {
      award('p3', 40, 'Quête : 3 projets');
    }
    // Special: Open Cowork also triggers its own quest
    if (data.id === 'opencowork') {
      award('oc', 20, 'Quête : Ouvre Open Cowork');
    }
  } else if (type === 'perso') {
    award('PERSO_' + data.id, 15, data.title);
    // Check for "Teste un projet perso" quest
    if (!S.done.includes('pp')) {
      const liveCount = PROJECTS_PERSO.filter(p => p.status === 'live').length;
      const visitedCount = S.done.filter(x => x.startsWith('PERSO_')).length;
      if (visitedCount >= liveCount) {
        award('pp', 30, 'Quête : Teste un projet perso');
      }
    }
  }
  
  modal.showModal();
  
  // A6: Focus first focusable element in modal
  setTimeout(() => {
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
  }, 50);
}

// B2: Open Cowork modal content
function renderOpenCoworkModalContent(data) {
  return `
    <div class="oc-header">
      <div class="oc-monogram">OC</div>
      <div class="oc-title">
        <h3>Open Cowork</h3>
        <p class="oc-subtitle">Paris-Saclay · stage 2026</p>
      </div>
    </div>
    
    <div class="oc-banner">
      <h2>${data.tagline}</h2>
      <p>${data.subtitle}</p>
    </div>
    
    <h4 class="oc-section-title">CONTEXTE</h4>
    <div class="oc-card yellow">
      <p>${data.context}</p>
    </div>
    
    <h4 class="oc-section-title">CE QUE J'AI FAIT</h4>
    ${data.work.map(item => `
      <div class="oc-card green">
        <p><strong>${item.title}.</strong> ${item.text}</p>
      </div>
    `).join('')}
    
    <h4 class="oc-section-title">STACK</h4>
    <div class="oc-card yellow">
      <div class="tech-logos">${createTechLogosRow(data.stack, 28)}</div>
    </div>
    
    <h4 class="oc-section-title">DÉFI RELEVÉ</h4>
    <div class="oc-card orange">
      <p>${data.challenge}</p>
    </div>
  `;
}

// B3: Lunio modal content
function renderLunioModalContent(data) {
  return `
    <h3 class="lunio-title">${data.icon} ${data.title}</h3>
    <p class="sub">${data.date}</p>
    <p style="margin-bottom:12px;">${data.summary}</p>
    
    <ul style="margin:10px 0 14px 20px;">
      ${data.bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>
    
    <div class="tech-logos">${createTechLogosRow(data.stack, 24)}</div>
  `;
}

// ============================================
// BADGES
// ============================================

function renderBadges() {
  $('#badges').innerHTML = SKILLS.map((s, i) => `
    <button class="badge" data-i="${i}" aria-expanded="false">
      ${s[0]}<small>${s[1] || 'Appris en cours / projets scolaires'}</small>
    </button>
  `).join('');

  $('#badges').onclick = e => {
    const b = e.target.closest('.badge');
    if (!b) return;
    b.classList.toggle('open');
    b.setAttribute('aria-expanded', b.classList.contains('open'));
    
    if (award('B' + b.dataset.i, 5, SKILLS[b.dataset.i][0]) && count('B') >= 3) {
      award('b3', 30, 'Quête : 3 badges');
    }
  };
}

// ============================================
// CONTACT
// ============================================

function initContact() {
  document.querySelectorAll('[data-contact]').forEach(a => {
    a.addEventListener('click', () => {
      award('ct', 50, 'Quête : contact');
    });
  });
}

// ============================================
// INTRO
// ============================================

let started = false;

function start() {
  if (started) return;
  started = true;
  $('#intro').classList.add('off');
  document.body.classList.add('go');
  award('hero', 10, 'Bienvenue !');
}

const L = [...document.querySelectorAll('.lights i')];

if (S.done.includes('hero') || matchMedia('(prefers-reduced-motion:reduce)').matches) {
  start();
} else {
  L.forEach((l, i) => setTimeout(() => l.classList.add('on'), 500 + i * 450));
  setTimeout(() => L.forEach(l => l.classList.remove('on')), 500 + 5 * 450 + 700);
  setTimeout(start, 500 + 5 * 450 + 1000);
}

$('#skip').onclick = start;

// ============================================
// MODAL CLOSE HANDLING (A6 & A7)
// ============================================

function handleModalClose() {
  const modal = $('#modal');
  resetModalTheme();
  // A6: Restore focus to last focused element
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

// Listen to dialog close event
$('#modal').addEventListener('close', handleModalClose);

// Also handle backdrop click
$('#modal').onclick = e => {
  if (e.target === e.currentTarget) {
    e.currentTarget.close();
  }
};

// Close button handler
$('[method="dialog"] .close').onclick = () => {
  $('#modal').close();
};

// Escape key closes modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#modal').open) {
    $('#modal').close();
  }
});

// ============================================
// INITIALIZE
// ============================================

function init() {
  renderXP();
  renderPath();
  renderPersoProjects();
  renderBadges();
  initContact();
}

// Start when DOM is ready
init();
