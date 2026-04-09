// ═══════════════════════════════════════════════
// Ayê — Catálogo Sagrado — JS
// Mobile: poster + fullscreen viewer (zero WebGL no scroll)
// Desktop: inline model-viewer dinâmico (max 1)
// ═══════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
});

const isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

// Mapa: productElement → { goTo, getCurrent }
const productControllers = new Map();

// ══════════════════════════════════════════════
// DESKTOP: model-viewer inline (max 1 ativo)
// ══════════════════════════════════════════════
let activeModelPage = null;
const modelViewerReady = customElements.whenDefined('model-viewer');

async function createModelViewer(page3d) {
    const wrap = page3d.querySelector('.cat-model-wrap');
    if (!wrap || wrap.querySelector('model-viewer')) return;

    const src = page3d.dataset.modelSrc;
    const alt = page3d.dataset.modelAlt || '';
    if (!src) return;

    let overlay = wrap.querySelector('.cat-loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'cat-loading-overlay';
        overlay.innerHTML = '<img src="Img/logo-colorido-sem-fundo.png" alt="" class="cat-loading-logo">';
        wrap.appendChild(overlay);
    }
    overlay.classList.remove('hidden');

    await modelViewerReady;

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
    mv.setAttribute('camera-controls', '');
    mv.setAttribute('auto-rotate', '');
    mv.className = 'cat-model-viewer';

    mv.addEventListener('load', () => overlay.classList.add('hidden'), { once: true });

    const vignette = wrap.querySelector('.cat-model-vignette');
    if (vignette) wrap.insertBefore(mv, vignette);
    else wrap.appendChild(mv);

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

    const overlay = wrap.querySelector('.cat-loading-overlay');
    if (overlay) overlay.classList.remove('hidden');

    if (activeModelPage === page3d) activeModelPage = null;
}

// ══════════════════════════════════════════════
// MOBILE: poster estático + fullscreen viewer
// ══════════════════════════════════════════════

// Injeta poster + botão "Ver em 3D" nas páginas 3D (substitui o model-wrap no mobile)
function initMobilePosters() {
    document.querySelectorAll('.cat-page--3d').forEach(page3d => {
        const poster = page3d.dataset.poster;
        const src    = page3d.dataset.modelSrc;
        const alt    = page3d.dataset.modelAlt || '';

        // Esconde o model-wrap original (não precisa dele no mobile)
        const wrap = page3d.querySelector('.cat-model-wrap');
        if (wrap) wrap.style.display = 'none';

        // Esconde label "arraste para girar"
        const label = page3d.querySelector('.cat-page-label');
        if (label) label.style.display = 'none';

        // Cria container do poster
        const posterWrap = document.createElement('div');
        posterWrap.className = 'cat-mobile-poster';

        if (poster) {
            const img = document.createElement('img');
            img.src = poster;
            img.alt = alt;
            img.className = 'cat-mobile-poster-img';
            img.loading = 'lazy';
            posterWrap.appendChild(img);
        } else {
            // Fallback: fundo escuro com logo
            posterWrap.innerHTML = '<img src="Img/logo-colorido-sem-fundo.png" alt="" class="cat-mobile-poster-logo">';
        }

        // Botão "Ver em 3D"
        const btn = document.createElement('button');
        btn.className = 'cat-mobile-3d-btn';
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
            </svg>
            Ver em 3D`;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openFullscreenViewer(src, alt);
        });

        posterWrap.appendChild(btn);
        page3d.appendChild(posterWrap);
    });
}

// Abre o viewer fullscreen com um único model-viewer
async function openFullscreenViewer(src, alt) {
    const viewer = document.getElementById('fullscreenViewer');
    const body   = document.getElementById('fsBody');
    const title  = document.getElementById('fsTitle');

    if (!viewer || !body) return;

    title.textContent = alt || 'Modelo 3D';

    // Loading
    body.innerHTML = '<div class="cat-loading-overlay" style="position:relative;min-height:60vh;"><img src="Img/logo-colorido-sem-fundo.png" alt="" class="cat-loading-logo"></div>';

    // Mostra o overlay
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    await modelViewerReady;

    const mv = document.createElement('model-viewer');
    mv.setAttribute('src', src);
    mv.setAttribute('alt', alt || '');
    mv.setAttribute('auto-rotate', '');
    mv.setAttribute('auto-rotate-delay', '0');
    mv.setAttribute('rotation-per-second', '18deg');
    mv.setAttribute('camera-controls', '');
    mv.setAttribute('shadow-intensity', '0');
    mv.setAttribute('shadow-softness', '0');
    mv.setAttribute('exposure', '0.85');
    mv.className = 'cat-fs-model-viewer';

    mv.addEventListener('load', () => {
        const overlay = body.querySelector('.cat-loading-overlay');
        if (overlay) overlay.classList.add('hidden');
    }, { once: true });

    body.appendChild(mv);
}

function closeFullscreenViewer() {
    const viewer = document.getElementById('fullscreenViewer');
    const body   = document.getElementById('fsBody');

    if (!viewer) return;

    // Destrói o model-viewer antes de fechar
    const mv = body.querySelector('model-viewer');
    if (mv) {
        mv.removeAttribute('auto-rotate');
        mv.removeAttribute('camera-controls');
        mv.removeAttribute('src');
        mv.remove();
    }

    body.innerHTML = '';
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function initFullscreenControls() {
    const closeBtn = document.getElementById('fsClose');
    if (closeBtn) closeBtn.addEventListener('click', closeFullscreenViewer);

    // Fechar com Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeFullscreenViewer();
    });
}

// ══════════════════════════════════════════════
// Loading overlay nas imagens
// ══════════════════════════════════════════════
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

// ══════════════════════════════════════════════
// Paginação interna de cada produto
// ══════════════════════════════════════════════
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

            // Desktop: destruir model-viewer ao sair de página 3D
            if (!isMobile && leaving.classList.contains('cat-page--3d')) {
                destroyModelViewer(leaving);
            }

            // Desktop: criar model-viewer ao entrar em página 3D
            if (!isMobile && entering.classList.contains('cat-page--3d')) {
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

// ══════════════════════════════════════════════
// Desktop-only: lazy load + viewport cleanup
// ══════════════════════════════════════════════
function initLazyModels() {
    if (isMobile) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const product = entry.target;
            const activePage = product.querySelector('.cat-page.active');
            if (!activePage || !activePage.classList.contains('cat-page--3d')) return;

            if (activeModelPage && activeModelPage !== activePage) {
                destroyModelViewer(activeModelPage);
            }
            createModelViewer(activePage);
            observer.unobserve(product);
        });
    }, { rootMargin: '200px' });

    document.querySelectorAll('.cat-product').forEach(p => {
        const activePage = p.querySelector('.cat-page.active');
        if (activePage && activePage.classList.contains('cat-page--3d')) {
            observer.observe(p);
        }
    });
}

function initViewportCleanup() {
    if (isMobile) return;

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

// ══════════════════════════════════════════════
// Animações GSAP
// ══════════════════════════════════════════════
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

// ══════════════════════════════════════════════
// Init
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    initLoadingOverlays();

    if (isMobile) {
        initMobilePosters();
        initFullscreenControls();
    }

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
