// =============================================
// FILTRES POUR LES PROJETS
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retire la classe "active" de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajoute "active" au bouton cliqué
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Affiche/masque les projets
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // =============================================
    // ANIMATIONS AU SCROLL
    // =============================================
    function animateOnScroll() {
        const elements = document.querySelectorAll('section, .card, .project-card, .experience-item, .quality-item');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialise les animations
    document.querySelectorAll('section, .card, .project-card, .experience-item, .quality-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // =============================================
    // EFFETS DE SURVOL POUR LES CARTES
    // =============================================
    document.querySelectorAll('.project-card, .social-link, .quality-item, .btn').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // =============================================
    // BARRES DE COMPÉTENCES ANIMÉES
    // =============================================
    const skillBars = document.querySelectorAll('.skill-level');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
});