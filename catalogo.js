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
let activeModelPage = null; // referência à .cat-page--3d que tem model-viewer vivo

// Mapa: productElement → { goTo, getCurrent } — permite resetar de fora
const productControllers = new Map();

// Promessa que resolve quando o custom element <model-viewer> estiver registrado
const modelViewerReady = customElements.whenDefined('model-viewer');

async function createModelViewer(page3d) {
    const wrap = page3d.querySelector('.cat-model-wrap');
    if (!wrap || wrap.querySelector('model-viewer')) return; // já existe

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

    // Espera o módulo model-viewer carregar antes de criar o elemento
    await modelViewerReady;

    // Checa se a página ainda está ativa (o usuário pode ter saído durante o await)
    if (!page3d.classList.contains('active')) return;
    // Checa se já não foi criado por outra chamada concorrente
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

    // No mobile: sem auto-rotate para economizar GPU, sem camera-controls até tocar
    if (isTouchDevice) {
        // camera-controls será adicionado pelo touch gate
    } else {
        mv.setAttribute('camera-controls', '');
        mv.setAttribute('auto-rotate', '');
    }

    mv.addEventListener('load', () => {
        overlay.classList.add('hidden');
    }, { once: true });

    // Insere antes do vignette
    const vignette = wrap.querySelector('.cat-model-vignette');
    if (vignette) {
        wrap.insertBefore(mv, vignette);
    } else {
        wrap.appendChild(mv);
    }

    // Touch gate no mobile
    if (isTouchDevice) {
        setupTouchGate(page3d, mv);
    }

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

    // Remove touch gate se existir
    const gate = wrap.querySelector('.cat-3d-touch-gate');
    if (gate) gate.remove();

    // Reseta overlay para próxima vez
    const overlay = wrap.querySelector('.cat-loading-overlay');
    if (overlay) overlay.classList.remove('hidden');

    if (activeModelPage === page3d) {
        activeModelPage = null;
    }
}

function destroyAllModelViewers() {
    document.querySelectorAll('.cat-model-wrap model-viewer').forEach(mv => {
        const page3d = mv.closest('.cat-page--3d');
        destroyModelViewer(page3d);
    });
    activeModelPage = null;
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
        if (img.complete && img.naturalWidth > 0) {
            hide();
        } else {
            img.addEventListener('load', hide);
            img.addEventListener('error', hide);
        }
    });
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

        function goTo(index, instant) {
            if (index === current || animating) return;
            if (!instant) animating = true;

            const leaving  = pages[current];
            const entering = pages[index];

            // Se saindo de página 3D → DESTRUIR o model-viewer (libera WebGL)
            if (leaving.classList.contains('cat-page--3d')) {
                destroyModelViewer(leaving);
            }

            // Se entrando em página 3D → reseta qualquer OUTRO card para sua capa
            if (entering.classList.contains('cat-page--3d')) {
                productControllers.forEach((ctrl, prod) => {
                    if (prod === product) return;
                    const otherPage3d = prod.querySelector('.cat-page--3d');
                    if (otherPage3d && otherPage3d.querySelector('model-viewer')) {
                        ctrl.goTo(0, true); // volta para capa instantaneamente
                    }
                });
                createModelViewer(entering);
            }

            if (instant) {
                // Troca instantânea (sem animação) — usado ao resetar outro card
                leaving.classList.remove('active');
                gsap.set(leaving, { opacity: 0, visibility: 'hidden', pointerEvents: 'none' });
                entering.classList.add('active');
                gsap.set(entering, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
                dots.forEach((d, i) => d.classList.toggle('active', i === index));
                current = index;
                return;
            }

            // Saída animada
            leaving.classList.remove('active');
            gsap.to(leaving, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
                onComplete() {
                    gsap.set(leaving, { visibility: 'hidden', pointerEvents: 'none' });
                }
            });

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

            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            current = index;
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goTo(i));
        });

        if (prev) prev.addEventListener('click', () => goTo((current - 1 + pages.length) % pages.length));
        if (next) next.addEventListener('click', () => goTo((current + 1) % pages.length));

        // Estado inicial
        gsap.set(pages, { opacity: 0, visibility: 'hidden' });
        gsap.set(pages[0], { opacity: 1, visibility: 'visible' });

        // Registra controller para acesso externo
        productControllers.set(product, { goTo, getCurrent: () => current });
    });
}

// ──────────────────────────────────
// Lazy-load para cards que começam com 3D ativo
// (Exu e Iemanjá — sem imagem de capa)
// Cria o model-viewer apenas quando o card entra no viewport
// ──────────────────────────────────
function initLazyModels() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const product = entry.target;
            const activePage = product.querySelector('.cat-page.active');
            if (!activePage || !activePage.classList.contains('cat-page--3d')) return;

            // Se já existe um model-viewer ativo em outro card, destroi primeiro
            if (activeModelPage && activeModelPage !== activePage) {
                destroyModelViewer(activeModelPage);
            }

            createModelViewer(activePage);
            observer.unobserve(product);
        });
    }, { rootMargin: '200px' });

    // Observa apenas cards que começam com 3D ativo (sem imagem de capa)
    document.querySelectorAll('.cat-product').forEach(p => {
        const activePage = p.querySelector('.cat-page.active');
        if (activePage && activePage.classList.contains('cat-page--3d')) {
            observer.observe(p);
        }
    });
}

// ──────────────────────────────────
// Libera WebGL quando o card sai do viewport
// (evita modelo ativo fora da tela)
// ──────────────────────────────────
function initViewportCleanup() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) return;

            const product = entry.target;
            const page3d = product.querySelector('.cat-page--3d');
            if (page3d && page3d.querySelector('model-viewer')) {
                // Volta para a capa e destrói o model-viewer
                const ctrl = productControllers.get(product);
                if (ctrl) {
                    ctrl.goTo(0, true);
                } else {
                    destroyModelViewer(page3d);
                }
            }
        });
    }, { rootMargin: '100px' });

    document.querySelectorAll('.cat-product').forEach(p => observer.observe(p));
}

// ──────────────────────────────────
// Animações GSAP do Hero
// ──────────────────────────────────
function initHeroAnimations() {
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
// ──────────────────────────────────
function initProductAnimations() {
    document.querySelectorAll('.cat-product').forEach(product => {
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
    initProductPages();
    initLazyModels();
    initViewportCleanup();
    initHeroAnimations();
    initProductAnimations();
    initParallax();
    initHeaderScroll();
    initFinalCTA();
    initButtonEffects();

    ScrollTrigger.refresh();
});
