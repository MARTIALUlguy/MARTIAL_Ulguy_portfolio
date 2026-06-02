/*═══════════════════════════════════
    MODALES
═══════════════════════════════════*/

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
    if (event.target === event.currentTarget) {
        closeModal(id);
    }
}

/*═══════════════════════════════════
    ESCAPE = FERMER MODALE
═══════════════════════════════════*/

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        document
            .querySelectorAll(".modal-overlay.active")
            .forEach(modal => {
                modal.classList.remove("active");
            });

        document.body.style.overflow = "";
    }
});

/*═══════════════════════════════════
    REVEAL ON SCROLL
═══════════════════════════════════*/

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }

        });

    },
    {
        threshold: 0.15
    }
);

document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});

/*═══════════════════════════════════
    NAV ACTIVE LINK
═══════════════════════════════════*/

const sections = document.querySelectorAll("section[id], div[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {
            link.classList.add("active");
        }
    });
});

/*═══════════════════════════════════
    CURSEUR GLOW
═══════════════════════════════════*/

const glow = document.createElement("div");
glow.className = "cursor-glow";

document.body.appendChild(glow);

document.addEventListener("mousemove", e => {

    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";

});

/*═══════════════════════════════════
    PARALLAX HERO
═══════════════════════════════════*/

const orb1 = document.querySelector(".hero-orb-1");
const orb2 = document.querySelector(".hero-orb-2");
const orb3 = document.querySelector(".hero-orb-3");

window.addEventListener("mousemove", e => {

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    if (orb1) {
        orb1.style.transform =
            `translate(${x * -30}px, ${y * -30}px)`;
    }

    if (orb2) {
        orb2.style.transform =
            `translate(${x * 40}px, ${y * 40}px)`;
    }

    if (orb3) {
        orb3.style.transform =
            `translate(${x * -20}px, ${y * 20}px)`;
    }

});

/*═══════════════════════════════════
    SCROLL PROGRESS BAR
═══════════════════════════════════*/

const progressBar = document.createElement("div");

progressBar.style.position = "fixed";
progressBar.style.top = "0";
progressBar.style.left = "0";
progressBar.style.height = "3px";
progressBar.style.zIndex = "9999";

progressBar.style.background =
    "linear-gradient(90deg,#00ffff,#8b5cf6)";

progressBar.style.width = "0%";

document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {

    const scroll =
        window.scrollY;

    const height =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        (scroll / height) * 100;

    progressBar.style.width =
        progress + "%";
});

/*═══════════════════════════════════
    SMOOTH SCROLL
═══════════════════════════════════*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target =
            document.querySelector(
                this.getAttribute("href")
            );

        if (!target) return;

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

});

/*═══════════════════════════════════
    LOGO CURSOR BLINK
═══════════════════════════════════*/

const logo = document.querySelector(".nav-logo");

if (logo) {

    let blink = true;

    setInterval(() => {

        logo.style.borderRight =
            blink
                ? "2px solid var(--accent-primary)"
                : "2px solid transparent";

        blink = !blink;

    }, 600);
}

/*═══════════════════════════════════
    EASTER EGG TERMINAL
═══════════════════════════════════*/

let keySequence = "";

document.addEventListener("keydown", e => {

    keySequence += e.key.toLowerCase();

    if (keySequence.length > 20) {
        keySequence =
            keySequence.slice(-20);
    }

    if (keySequence.includes("martial")) {

        showTerminal();

        keySequence = "";
    }

});

function showTerminal() {

    if (
        document.querySelector(".terminal-popup")
    ) return;

    const terminal =
        document.createElement("div");

    terminal.className =
        "terminal-popup";

    terminal.innerHTML = `
        <div class="terminal-line">
            > USER IDENTIFIED
        </div>

        <div class="terminal-line">
            > Loading profile...
        </div>

        <div class="terminal-line">
            > BUT INFO Rank: TOP STUDENT
        </div>

        <div class="terminal-line">
            > React ✓
        </div>

        <div class="terminal-line">
            > Django ✓
        </div>

        <div class="terminal-line">
            > Java ✓
        </div>

        <div class="terminal-line">
            > Mission: EFREI Alternance
        </div>
    `;

    document.body.appendChild(
        terminal
    );

    setTimeout(() => {

        terminal.remove();

    }, 6000);
}

/*═══════════════════════════════════
    FUN STATS COUNTER
═══════════════════════════════════*/

const counters =
    document.querySelectorAll("[data-count]");

const counterObserver =
    new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const counter =
                entry.target;

            const target =
                parseInt(
                    counter.dataset.count
                );

            let current = 0;

            const step =
                Math.ceil(target / 50);

            const update = () => {

                current += step;

                if (current >= target) {

                    counter.textContent =
                        target;

                    return;
                }

                counter.textContent =
                    current;

                requestAnimationFrame(update);
            };

            update();

            counterObserver.unobserve(
                counter
            );
        });

    });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

console.log(`
███╗   ███╗██╗   ██╗
████╗ ████║██║   ██║
██╔████╔██║██║   ██║
██║╚██╔╝██║██║   ██║
██║ ╚═╝ ██║╚██████╔╝
╚═╝     ╚═╝ ╚═════╝

Portfolio by Martial Ulguy
`);