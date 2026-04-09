// ═══════════════════════════════════════════════
// Ayê — Catálogo Sagrado — JS
// Performance-first: max 1 model-viewer ativo
// ═══════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
});

const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

// ──────────────────────────────────
// Gerenciador global de model-viewer
// Garante no máximo 1 contexto WebGL ativo por vez
// ──────────────────────────────────
let activeModelPage = null;

// Mapa: productElement → { goTo, getCurrent } — permite resetar de fora
const productControllers = new Map();

// Espera o custom element <model-viewer> estar registrado
const modelViewerReady = customElements.whenDefined('model-viewer');

async function createModelViewer(page3d) {
    const wrap = page3d.querySelector('.cat-model-wrap');
    if (!wrap || wrap.querySelector('model-viewer')) return;

    const src = page3d.dataset.modelSrc;
    const alt = page3d.dataset.modelAlt || '';
    if (!src) return;

    // Mostra overlay de loading
    let overlay = wrap.querySelector('.cat-loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'cat-loading-overlay';
        overlay.innerHTML = '<img src="Img/logo-colorido-sem-fundo.png" alt="" class="cat-loading-logo">';
        wrap.appendChild(overlay);
    }
    overlay.classList.remove('hidden');

    await modelViewerReady;

    // Guarda: usuário pode ter saído durante o await
    if (!page3d.classList.contains('active')) return;
    if (wrap.querySelector('model-viewer')) return;

    const mv = document.createElement('model-viewer');
    mv.setAttribute('src', src);
    mv.setAttribute('alt', alt);
    mv.setAttribute('auto-rotate-delay', '0');
    mv.setAttribute('rotation-per-second', '18deg');
    mv.setAttribute('shadow-intensity', '0');
    mv.setAttribute('shadow-softness', '0');
    mv.setAttribute('exposure', '0.85');
    mv.className = 'cat-model-viewer';

    // Mobile: sem auto-rotate para economizar GPU, camera-controls via touch gate
    if (isTouchDevice) {
        // camera-controls será adicionado pelo touch gate
    } else {
        mv.setAttribute('camera-controls', '');
        mv.setAttribute('auto-rotate', '');
    }

    mv.addEventListener('load', () => overlay.classList.add('hidden'), { once: true });

    const vignette = wrap.querySelector('.cat-model-vignette');
    if (vignette) wrap.insertBefore(mv, vignette);
    else wrap.appendChild(mv);

    if (isTouchDevice) setupTouchGate(page3d, mv);

    activeModelPage = page3d;
}

function destroyModelViewer(page3d) {
    if (!page3d) return;
    const wrap = page3d.querySelector('.cat-model-wrap');
    if (!wrap) return;

    const mv = wrap.querySelector('model-viewer');
    if (mv) {
        mv.removeAttribute('auto-rotate');
        mv.removeAttribute('camera-controls');
        mv.removeAttribute('src');
        mv.remove();
    }

    const gate = wrap.querySelector('.cat-3d-touch-gate');
    if (gate) gate.remove();

    const overlay = wrap.querySelector('.cat-loading-overlay');
    if (overlay) overlay.classList.remove('hidden');

    if (activeModelPage === page3d) activeModelPage = null;
}

// ──────────────────────────────────
// Touch gate — "toque para interagir"
// ──────────────────────────────────
function setupTouchGate(page3d, mv) {
    let gate = page3d.querySelector('.cat-3d-touch-gate');
    if (gate) {
        gate.classList.remove('dismissed');
        gate.classList.add('active');
        return;
    }

    gate = document.createElement('div');
    gate.className = 'cat-3d-touch-gate active';
    gate.innerHTML = '<span class="cat-3d-touch-gate-label">Toque para interagir</span>';
    page3d.querySelector('.cat-model-wrap').appendChild(gate);

    gate.addEventListener('click', () => {
        mv.setAttribute('camera-controls', '');
        mv.setAttribute('auto-rotate', '');
        gate.classList.remove('active');
        gate.classList.add('dismissed');
    });
}

// ──────────────────────────────────
// Loading overlay nas imagens
// ──────────────────────────────────
function initLoadingOverlays() {
    document.querySelectorAll('.cat-page--img').forEach(page => {
        const img = page.querySelector('.cat-product-img');
        if (!img) return;

        const overlay = document.createElement('div');
        overlay.className = 'cat-loading-overlay';
        overlay.innerHTML = '<img src="Img/logo-colorido-sem-fundo.png" alt="" class="cat-loading-logo">';
        page.querySelector('.cat-img-wrap').appendChild(overlay);

        const hide = () => overlay.classList.add('hidden');
        if (img.complete && img.naturalWidth > 0) hide();
        else {
            img.addEventListener('load', hide);
            img.addEventListener('error', hide);
        }
    });
}

// ──────────────────────────────────
// Paginação interna de cada produto
// ──────────────────────────────────
function initProductPages() {
    document.querySelectorAll('.cat-product').forEach(product => {
        const pages = product.querySelectorAll('.cat-page');
        const dots  = product.querySelectorAll('.cat-page-dot');
        const prev  = product.querySelector('.cat-nav-arrow--prev');
        const next  = product.querySelector('.cat-nav-arrow--next');
        let current = 0;
        let animating = false;

        function goTo(index, instant) {
            if (index === current || animating) return;
            if (!instant) animating = true;

            const leaving  = pages[current];
            const entering = pages[index];

            // Sai de página 3D → destrói model-viewer
            if (leaving.classList.contains('cat-page--3d')) {
                destroyModelViewer(leaving);
            }

            // Entra em página 3D → reseta outros cards para capa e cria viewer
            if (entering.classList.contains('cat-page--3d')) {
                productControllers.forEach((ctrl, prod) => {
                    if (prod === product) return;
                    const otherPage3d = prod.querySelector('.cat-page--3d');
                    if (otherPage3d && otherPage3d.querySelector('model-viewer')) {
                        ctrl.goTo(0, true);
                    }
                });
                createModelViewer(entering);
            }

            if (instant) {
                leaving.classList.remove('active');
                gsap.set(leaving, { opacity: 0, visibility: 'hidden', pointerEvents: 'none' });
                entering.classList.add('active');
                gsap.set(entering, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
                dots.forEach((d, i) => d.classList.toggle('active', i === index));
                current = index;
                return;
            }

            leaving.classList.remove('active');
            gsap.to(leaving, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
                onComplete() {
                    gsap.set(leaving, { visibility: 'hidden', pointerEvents: 'none' });
                }
            });

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

            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            current = index;
        }

        dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
        if (prev) prev.addEventListener('click', () => goTo((current - 1 + pages.length) % pages.length));
        if (next) next.addEventListener('click', () => goTo((current + 1) % pages.length));

        gsap.set(pages, { opacity: 0, visibility: 'hidden' });
        gsap.set(pages[0], { opacity: 1, visibility: 'visible' });

        productControllers.set(product, { goTo, getCurrent: () => current });
    });
}

// ──────────────────────────────────
// Viewport cleanup: destrói model-viewer fora da tela
// ──────────────────────────────────
function initViewportCleanup() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) return;
            const product = entry.target;
            const page3d = product.querySelector('.cat-page--3d');
            if (page3d && page3d.querySelector('model-viewer')) {
                const ctrl = productControllers.get(product);
                if (ctrl) ctrl.goTo(0, true);
                else destroyModelViewer(page3d);
            }
        });
    }, { rootMargin: '100px' });

    document.querySelectorAll('.cat-product').forEach(p => observer.observe(p));
}

// ──────────────────────────────────
// Animações GSAP
// ──────────────────────────────────
function initHeroAnimations() {
    if (window.scrollY > 100) {
        gsap.set(['.cat-hero-eyebrow', '.cat-eyebrow-line', '.cat-hero-title', '.cat-hero-sub', '.cat-hero-scroll-hint'], {
            clearProps: 'all'
        });
        return;
    }

    const tl = gsap.timeline({ delay: 0.15 });
    tl.from('.cat-hero-eyebrow', { opacity: 0, y: -10, duration: 0.45, ease: 'power2.out' })
      .from('.cat-eyebrow-line', { scaleX: 0, duration: 0.4, ease: 'power2.out', stagger: 0.08 }, '-=0.2')
      .from('.cat-hero-title', { opacity: 0, y: 25, duration: 0.55, ease: 'power2.out' }, '-=0.15')
      .from('.cat-hero-sub', { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      .from('.cat-hero-scroll-hint', { opacity: 0, duration: 0.35, ease: 'power2.out' }, '-=0.1');

    gsap.to('.cat-scroll-line', {
        scaleY: 1.2, transformOrigin: 'top center',
        duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
}

function initProductAnimations() {
    document.querySelectorAll('.cat-product').forEach(product => {
        gsap.fromTo(product,
            { y: 30, opacity: 0 },
            {
                scrollTrigger: { trigger: product, start: 'top 85%', toggleActions: 'play none none none', once: true },
                y: 0, opacity: 1, duration: 0.55, ease: 'power2.out'
            }
        );
    });
}

function initParallax() {
    gsap.to('.cat-hero-content', {
        scrollTrigger: { trigger: '.cat-hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: 50, opacity: 0.3, ease: 'none'
    });
}

function initHeaderScroll() {
    gsap.to('.cat-header', {
        scrollTrigger: { trigger: 'body', start: 'top top', end: '+=80', scrub: true },
        boxShadow: '0 2px 24px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(242, 231, 218, 0.98)', ease: 'none'
    });
}

function initFinalCTA() {
    gsap.from('.cat-final-content', {
        scrollTrigger: { trigger: '.cat-final-cta', start: 'top 80%', toggleActions: 'play none none none', once: true },
        y: 30, opacity: 0, duration: 0.55, ease: 'power2.out'
    });
}

function initButtonEffects() {
    document.querySelectorAll('.cat-final-btn, .cat-nav-contact').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.03, duration: 0.2, ease: 'power2.out' }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' }));
    });
}

// ──────────────────────────────────
// Init
// ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initLoadingOverlays();
    initProductPages();
    initViewportCleanup();
    initHeroAnimations();
    initProductAnimations();
    initParallax();
    initHeaderScroll();
    initFinalCTA();
    initButtonEffects();

    ScrollTrigger.refresh();
});
