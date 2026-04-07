// ═══════════════════════════════════════════════
// Ayê — Catálogo Sagrado — JS
// ═══════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// Impede o ScrollTrigger de ficar recalculando por causa do model-viewer
ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
});

// ──────────────────────────────────
// Paginação interna de cada produto
// (3D → Imagem → Descrição)
// ──────────────────────────────────
function initProductPages() {
    document.querySelectorAll('.cat-product').forEach(product => {
        const pages = product.querySelectorAll('.cat-page');
        const dots  = product.querySelectorAll('.cat-page-dot');
        const prev  = product.querySelector('.cat-nav-arrow--prev');
        const next  = product.querySelector('.cat-nav-arrow--next');
        let current = 0;

        function goTo(index) {
            if (index === current) return;
            const leaving  = pages[current];
            const entering = pages[index];

            // Saída
            gsap.to(leaving, {
                opacity: 0,
                scale: 0.96,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    leaving.classList.remove('active');
                    gsap.set(leaving, { scale: 1, visibility: 'hidden', pointerEvents: 'none' });
                }
            });

            // Entrada
            gsap.set(entering, { visibility: 'visible', opacity: 0, scale: 1.03 });
            entering.classList.add('active');
            gsap.to(entering, {
                opacity: 1,
                scale: 1,
                duration: 0.45,
                ease: 'power2.out',
                delay: 0.2,
                onStart: () => { entering.style.pointerEvents = 'auto'; }
            });

            // Dots
            dots.forEach((d, i) => d.classList.toggle('active', i === index));

            current = index;
        }

        // Dots click
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goTo(i));
        });

        // Setas
        if (prev) prev.addEventListener('click', () => goTo((current - 1 + pages.length) % pages.length));
        if (next) next.addEventListener('click', () => goTo((current + 1) % pages.length));

        // Swipe touch
        let touchStartX = 0;
        const visual = product.querySelector('.cat-product-visual');
        if (visual) {
            visual.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
            visual.addEventListener('touchend', e => {
                const delta = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(delta) > 40) {
                    delta > 0
                        ? goTo((current + 1) % pages.length)
                        : goTo((current - 1 + pages.length) % pages.length);
                }
            }, { passive: true });
        }

        // Estado inicial
        gsap.set(pages, { opacity: 0, visibility: 'hidden' });
        gsap.set(pages[0], { opacity: 1, visibility: 'visible' });
    });
}

// ──────────────────────────────────
// Animações GSAP do Hero
// ──────────────────────────────────
function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from('.cat-hero-eyebrow', {
        opacity: 0,
        y: -15,
        duration: 0.6,
        ease: 'power3.out'
    })
    .from('.cat-eyebrow-line', {
        scaleX: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.1
    }, '-=0.3')
    .from('.cat-hero-title', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.2')
    .from('.cat-hero-sub', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.cat-hero-scroll-hint', {
        opacity: 0,
        y: -15,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.1');

    // Scroll line — pulso visual sem afetar layout
    gsap.to('.cat-scroll-line', {
        scaleY: 1.3,
        transformOrigin: 'top center',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}


// ──────────────────────────────────
// Animações dos Produtos ao scroll
// ──────────────────────────────────
function initProductAnimations() {
    document.querySelectorAll('.cat-product').forEach((product, idx) => {
        const visual = product.querySelector('.cat-product-visual');
        const info   = product.querySelector('.cat-product-info');
        const isEven = idx % 2 === 1;

        // Visual: desliza do lado oposto
        gsap.fromTo(visual,
            { x: isEven ? 60 : -60, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: product,
                    start: 'top 78%',
                    toggleActions: 'play none none none',
                    once: true
                },
                x: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out'
            }
        );

        // Info: entra com delay
        gsap.fromTo(info,
            { y: 40, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: product,
                    start: 'top 75%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.25,
                ease: 'power2.out'
            }
        );

        // Tag, nome, excerpt, CTA entram em cascata
        const children = info.querySelectorAll('.cat-product-tag, .cat-product-name, .cat-product-excerpt, .cat-product-cta');
        gsap.fromTo(children,
            { y: 20, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: product,
                    start: 'top 70%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                delay: 0.4,
                ease: 'power2.out'
            }
        );
    });
}

// ──────────────────────────────────
// Parallax suave no hero
// ──────────────────────────────────
function initParallax() {
    gsap.to('.cat-hero-content', {
        scrollTrigger: {
            trigger: '.cat-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 80,
        opacity: 0.3,
        ease: 'none'
    });
}

// ──────────────────────────────────
// Header: sombra ao scroll
// ──────────────────────────────────
function initHeaderScroll() {
    gsap.to('.cat-header', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '+=80',
            scrub: true
        },
        boxShadow: '0 2px 24px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(242, 231, 218, 0.98)',
        ease: 'none'
    });
}

// ──────────────────────────────────
// CTA Final: reveal
// ──────────────────────────────────
function initFinalCTA() {
    gsap.from('.cat-final-content', {
        scrollTrigger: {
            trigger: '.cat-final-cta',
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
    });
}

// ──────────────────────────────────
// Hover nos CTAs (GSAP)
// ──────────────────────────────────
function initButtonEffects() {
    document.querySelectorAll('.cat-product-cta, .cat-final-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.04, duration: 0.25, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' });
        });
    });
}

// ──────────────────────────────────
// Init
// ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initProductPages();
    initHeroAnimations();
    initProductAnimations();
    initParallax();
    initHeaderScroll();
    initFinalCTA();
    initButtonEffects();

    ScrollTrigger.refresh();
});

