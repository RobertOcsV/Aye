// ═══════════════════════════════════════════════
// Ayê — Catálogo Sagrado — JS
// ═══════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// Impede o ScrollTrigger de ficar recalculando por causa do model-viewer
ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
});

// ──────────────────────────────────
// Loading overlay nas imagens e modelos 3D
// ──────────────────────────────────
function initLoadingOverlays() {
    // Imagens: overlay some quando img carrega
    document.querySelectorAll('.cat-page--img').forEach(page => {
        const img = page.querySelector('.cat-product-img');
        if (!img) return;

        const overlay = document.createElement('div');
        overlay.className = 'cat-loading-overlay';
        overlay.innerHTML = '<img src="Img/logo-colorido-sem-fundo.png" alt="" class="cat-loading-logo">';
        page.querySelector('.cat-img-wrap').appendChild(overlay);

        const hide = () => overlay.classList.add('hidden');
        if (img.complete && img.naturalWidth > 0) {
            hide();
        } else {
            img.addEventListener('load', hide);
            img.addEventListener('error', hide);
        }
    });

    // Modelos 3D: overlay some quando model-viewer dispara 'load'
    document.querySelectorAll('.cat-page--3d').forEach(page => {
        const mv = page.querySelector('model-viewer');
        if (!mv) return;

        const overlay = document.createElement('div');
        overlay.className = 'cat-loading-overlay';
        overlay.innerHTML = '<img src="Img/logo-colorido-sem-fundo.png" alt="" class="cat-loading-logo">';
        page.querySelector('.cat-model-wrap').appendChild(overlay);

        mv.addEventListener('load', () => overlay.classList.add('hidden'));
    });
}

// ──────────────────────────────────
// Touch gate — "toque para interagir" nos modelos 3D
// Impede que o model-viewer capture o scroll no mobile
// ──────────────────────────────────
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

function initTouchGates() {
    if (!isTouchDevice) return;

    document.querySelectorAll('.cat-page--3d').forEach(page => {
        const mv = page.querySelector('model-viewer');
        if (!mv) return;

        // Remove camera-controls para que o scroll passe direto
        mv.removeAttribute('camera-controls');

        // Cria o gate overlay
        const gate = document.createElement('div');
        gate.className = 'cat-3d-touch-gate active';
        gate.innerHTML = '<span class="cat-3d-touch-gate-label">Toque para interagir</span>';
        page.querySelector('.cat-model-wrap').appendChild(gate);

        // Ao tocar no gate, ativa interação
        gate.addEventListener('click', () => {
            mv.setAttribute('camera-controls', '');
            gate.classList.remove('active');
            gate.classList.add('dismissed');
        });

        // Guarda referência para resetar ao sair da página
        page._touchGate = gate;
        page._modelViewer = mv;
    });
}

function resetTouchGate(page) {
    if (!isTouchDevice || !page._touchGate) return;
    page._modelViewer.removeAttribute('camera-controls');
    page._touchGate.classList.remove('dismissed');
    page._touchGate.classList.add('active');
}

// ──────────────────────────────────
// Paginação interna de cada produto
// (Imagem → 3D → Descrição)
// ──────────────────────────────────
function initProductPages() {
    document.querySelectorAll('.cat-product').forEach(product => {
        const pages = product.querySelectorAll('.cat-page');
        const dots  = product.querySelectorAll('.cat-page-dot');
        const prev  = product.querySelector('.cat-nav-arrow--prev');
        const next  = product.querySelector('.cat-nav-arrow--next');
        let current = 0;
        let animating = false;

        function goTo(index) {
            if (index === current || animating) return;
            animating = true;

            const leaving  = pages[current];
            const entering = pages[index];

            // Se saindo de uma página 3D, reseta o touch gate
            if (leaving.classList.contains('cat-page--3d')) {
                resetTouchGate(leaving);
            }

            // Saída rápida
            leaving.classList.remove('active');
            gsap.to(leaving, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
                onComplete() {
                    gsap.set(leaving, { visibility: 'hidden', pointerEvents: 'none' });
                }
            });

            // Lazy-load: se a página entrando tem model-viewer com data-src, carrega agora
            const mv = entering.querySelector('model-viewer[data-src]:not([src])');
            if (mv) {
                mv.setAttribute('src', mv.getAttribute('data-src'));
            }

            // Entrada suave
            gsap.set(entering, { visibility: 'visible', opacity: 0 });
            entering.classList.add('active');
            gsap.to(entering, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                delay: 0.1,
                onStart() { entering.style.pointerEvents = 'auto'; },
                onComplete() { animating = false; }
            });

            // Dots
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            current = index;
        }

        // Dots click
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goTo(i));
        });

        // Setas (única forma de navegar entre páginas — sem swipe para não conflitar com model-viewer)
        if (prev) prev.addEventListener('click', () => goTo((current - 1 + pages.length) % pages.length));
        if (next) next.addEventListener('click', () => goTo((current + 1) % pages.length));

        // Estado inicial
        gsap.set(pages, { opacity: 0, visibility: 'hidden' });
        gsap.set(pages[0], { opacity: 1, visibility: 'visible' });

        // Se a página inicial ativa tem model-viewer com data-src, carrega imediatamente
        const initialMv = pages[0].querySelector('model-viewer[data-src]:not([src])');
        if (initialMv) {
            initialMv.setAttribute('src', initialMv.getAttribute('data-src'));
        }
    });
}

// ──────────────────────────────────
// Animações GSAP do Hero
// ──────────────────────────────────
function initHeroAnimations() {
    // Se a página carregou já scrollada (F5 com scroll), pula intro
    if (window.scrollY > 100) {
        gsap.set(['.cat-hero-eyebrow', '.cat-eyebrow-line', '.cat-hero-title', '.cat-hero-sub', '.cat-hero-scroll-hint'], {
            clearProps: 'all'
        });
        return;
    }

    const tl = gsap.timeline({ delay: 0.15 });

    tl.from('.cat-hero-eyebrow', {
        opacity: 0,
        y: -10,
        duration: 0.45,
        ease: 'power2.out'
    })
    .from('.cat-eyebrow-line', {
        scaleX: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.08
    }, '-=0.2')
    .from('.cat-hero-title', {
        opacity: 0,
        y: 25,
        duration: 0.55,
        ease: 'power2.out'
    }, '-=0.15')
    .from('.cat-hero-sub', {
        opacity: 0,
        y: 15,
        duration: 0.4,
        ease: 'power2.out'
    }, '-=0.2')
    .from('.cat-hero-scroll-hint', {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out'
    }, '-=0.1');

    // Scroll line — pulso sutil
    gsap.to('.cat-scroll-line', {
        scaleY: 1.2,
        transformOrigin: 'top center',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// ──────────────────────────────────
// Animações dos Produtos ao scroll
// (uma única timeline por card)
// ──────────────────────────────────
function initProductAnimations() {
    document.querySelectorAll('.cat-product').forEach(product => {
        const visual = product.querySelector('.cat-product-visual');
        const info   = product.querySelector('.cat-product-info');

        // Uma única animação por card — leve e fluída
        gsap.fromTo(product,
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: product,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 0,
                opacity: 1,
                duration: 0.55,
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
        y: 50,
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
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
        },
        y: 30,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.out'
    });
}

// ──────────────────────────────────
// Hover nos CTAs
// ──────────────────────────────────
function initButtonEffects() {
    document.querySelectorAll('.cat-final-btn, .cat-nav-contact').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.03, duration: 0.2, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
        });
    });
}

// ──────────────────────────────────
// Init
// ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initLoadingOverlays();
    initTouchGates();
    initProductPages();
    initHeroAnimations();
    initProductAnimations();
    initParallax();
    initHeaderScroll();
    initFinalCTA();
    initButtonEffects();

    ScrollTrigger.refresh();
});
