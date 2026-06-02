// =============================================
// MODALES (pour les projets ou autres sections)
// =============================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
}

function closeOnOverlay(event, id) {
    const modal = document.getElementById(id);
    if (event.target === modal) {
        closeModal(id);
    }
}

// =============================================
// ANIMATIONS AU SCROLL
// =============================================
function animateOnScroll() {
    const elements = document.querySelectorAll('section, .card, .project-card, .experience-item');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// =============================================
// EFFETS DE SURVOL POUR LES CARTES
// =============================================
document.querySelectorAll('.card, .project-card, .social-link').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// =============================================
// PARTICLES.JS (si tu veux un arrière-plan dynamique)
// =============================================
// Ajoute ce code si tu veux des particules (nécessite la librairie particles.js)
if (document.getElementById('particles')) {
    particlesJS('particles', {
        particles: {
            number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: "#00d4ff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#00d4ff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });
}