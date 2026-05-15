// ═══════════════════════════════════════════════
// Ayê — Catálogo Sagrado — JS
// Performance-first: max 1 model-viewer ativo
// ═══════════════════════════════════════════════

// Garante que a página sempre começa no topo ao carregar/recarregar
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

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
    mv.setAttribute('environment-image', 'neutral');
    mv.setAttribute('interaction-prompt', 'none');
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
        // Pausa o render loop antes de liberar recursos
        try { mv.pause && mv.pause(); } catch (_) {}
        mv.removeAttribute('auto-rotate');
        mv.removeAttribute('camera-controls');
        // Zera o src explicitamente para liberar o buffer do GLB do heap
        // antes do elemento ser removido (importante em Safari iOS)
        try { mv.src = ''; } catch (_) {}
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
        // Em touch devices, não ligamos auto-rotate: mantém o render loop
        // acordado continuamente e drena bateria/GPU no iPhone.
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
    // Em touch (iPhone), destrói o contexto WebGL assim que o produto sai
    // do centro da tela. Desktop pode ter margem maior sem estressar a GPU.
    const rootMargin = isTouchDevice ? '-20% 0px -20% 0px' : '100px';
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
    }, { rootMargin });

    document.querySelectorAll('.cat-product').forEach(p => observer.observe(p));
}

// ──────────────────────────────────
// Animações GSAP
// ──────────────────────────────────
function initHeroAnimations() {
    const hero = document.querySelector('.cat-hero');
    const heroInView = hero && hero.getBoundingClientRect().bottom > 0 && hero.getBoundingClientRect().top < window.innerHeight;

    if (!heroInView) {
        // Hero fora do viewport no carregamento: garante estado final visível sem animar
        gsap.set(['.cat-hero-eyebrow', '.cat-hero-title', '.cat-hero-sub', '.cat-hero-scroll-hint'], {
            opacity: 1, y: 0
        });
        gsap.set('.cat-eyebrow-line', { scaleX: 1 });
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

const revealedProducts = new WeakSet();

function initProductAnimations() {
    document.querySelectorAll('.cat-product').forEach(product => {
        gsap.fromTo(product,
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: product,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true,
                    onEnter: () => revealedProducts.add(product)
                },
                y: 0, opacity: 1, duration: 0.55, ease: 'power2.out'
            }
        );
    });
}

function revealFilteredProducts(visibleProducts) {
    visibleProducts.forEach((product, i) => {
        // Mata qualquer tween/ScrollTrigger ativo neste produto
        gsap.killTweensOf(product);
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === product) st.kill();
        });

        if (revealedProducts.has(product)) {
            gsap.set(product, { y: 0, opacity: 1, clearProps: 'transform' });
            return;
        }
        revealedProducts.add(product);
        gsap.fromTo(product,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', delay: i * 0.04 }
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
// Filtro, Pesquisa e Paginação
// ──────────────────────────────────
const ITEMS_PER_PAGE = 8;

function initCatalogFilter() {
    const searchInput = document.getElementById('catSearch');
    const filterTabs  = document.getElementById('catFilterTabs');
    const grid        = document.getElementById('catProductsGrid');
    if (!searchInput || !filterTabs || !grid) return;

    const allProducts   = Array.from(grid.querySelectorAll('.cat-product[data-category]'));
    const filterBtns    = filterTabs.querySelectorAll('.cat-filter-btn');
    const resultCount   = document.getElementById('catResultCount');
    const totalCount    = document.getElementById('catTotalCount');

    let activeFilter = 'todos';
    let currentPage  = 1;
    let filteredList = [];

    // Cria container de paginação
    const paginationWrap = document.createElement('div');
    paginationWrap.className = 'cat-pagination';
    grid.parentNode.insertBefore(paginationWrap, grid.nextSibling);

    function updateCounts() {
        const counts = { todos: allProducts.length, guia: 0, orixa: 0, entidade: 0 };
        allProducts.forEach(p => {
            const cat = p.dataset.category;
            if (counts[cat] !== undefined) counts[cat]++;
        });
        document.getElementById('countTodos').textContent    = counts.todos;
        document.getElementById('countGuia').textContent      = counts.guia;
        document.getElementById('countOrixa').textContent     = counts.orixa;
        document.getElementById('countEntidade').textContent  = counts.entidade;
        totalCount.textContent = counts.todos;
    }

    function normalize(str) {
        return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    }

    function getFilteredProducts() {
        const query = normalize(searchInput.value.trim());
        return allProducts.filter(product => {
            const name     = normalize(product.querySelector('.cat-product-name')?.textContent || '');
            const category = product.dataset.category;
            const matchesFilter = activeFilter === 'todos' || category === activeFilter;
            const matchesSearch = !query || name.includes(query);
            return matchesFilter && matchesSearch;
        });
    }

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        paginationWrap.innerHTML = '';

        if (totalPages <= 1) return;

        // Botão anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'cat-page-btn cat-page-prev';
        prevBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; applyFilter(false); } });
        paginationWrap.appendChild(prevBtn);

        // Números de página
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end   = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

        if (start > 1) {
            paginationWrap.appendChild(createPageBtn(1));
            if (start > 2) {
                const dots = document.createElement('span');
                dots.className = 'cat-page-dots';
                dots.textContent = '...';
                paginationWrap.appendChild(dots);
            }
        }

        for (let i = start; i <= end; i++) {
            paginationWrap.appendChild(createPageBtn(i));
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                const dots = document.createElement('span');
                dots.className = 'cat-page-dots';
                dots.textContent = '...';
                paginationWrap.appendChild(dots);
            }
            paginationWrap.appendChild(createPageBtn(totalPages));
        }

        // Botão próximo
        const nextBtn = document.createElement('button');
        nextBtn.className = 'cat-page-btn cat-page-next';
        nextBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; applyFilter(false); } });
        paginationWrap.appendChild(nextBtn);
    }

    function createPageBtn(page) {
        const btn = document.createElement('button');
        btn.className = 'cat-page-btn cat-page-num' + (page === currentPage ? ' active' : '');
        btn.textContent = page;
        btn.addEventListener('click', () => { if (page !== currentPage) { currentPage = page; applyFilter(false); } });
        return btn;
    }

    function applyFilter(resetPage) {
        if (resetPage !== false) currentPage = 1;

        filteredList = getFilteredProducts();
        const totalFiltered = filteredList.length;
        const totalPages    = Math.ceil(totalFiltered / ITEMS_PER_PAGE);

        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const pageItems = filteredList.slice(startIdx, startIdx + ITEMS_PER_PAGE);

        allProducts.forEach(product => {
            product.classList.toggle('hidden-by-filter', !pageItems.includes(product));
        });

        resultCount.textContent = totalFiltered;

        const existing = grid.querySelector('.cat-no-results');
        if (totalFiltered === 0 && !existing) {
            const msg = document.createElement('div');
            msg.className = 'cat-no-results';
            msg.textContent = 'Nenhuma imagem encontrada';
            grid.appendChild(msg);
        } else if (totalFiltered > 0 && existing) {
            existing.remove();
        }

        renderPagination(totalFiltered);
        revealFilteredProducts(pageItems);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilter();
        });
    });

    searchInput.addEventListener('input', () => applyFilter());

    updateCounts();
    applyFilter();
}

// ──────────────────────────────────
// Modal de Expansão
// Apenas Imagem + 3D, abre no 3D
// ──────────────────────────────────
function initExpandModal() {
    const overlay = document.createElement('div');
    overlay.className = 'cat-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = `
      <div class="cat-modal">
        <button class="cat-modal-close" aria-label="Fechar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div class="cat-modal-visual">
          <div class="cat-page-indicator">
            <button class="cat-page-dot" data-page="0" aria-label="Imagem"></button>
            <button class="cat-page-dot active" data-page="1" aria-label="Modelo 3D"></button>
          </div>
          <div class="cat-page cat-page--img">
            <div class="cat-img-wrap">
              <img class="cat-product-img" alt="" loading="lazy">
            </div>
          </div>
          <div class="cat-page cat-page--3d active" data-model-src="" data-model-alt="">
            <div class="cat-model-wrap">
              <div class="cat-model-vignette"></div>
            </div>
            <span class="cat-page-label">Arraste para girar</span>
          </div>
          <button class="cat-nav-arrow cat-nav-arrow--prev" aria-label="Anterior">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="cat-nav-arrow cat-nav-arrow--next" aria-label="Próximo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div class="cat-modal-info">
          <span class="cat-product-tag"></span>
          <h2 class="cat-modal-name"></h2>
          <p class="cat-product-excerpt"></p>
          <hr class="cat-modal-divider">
          <p class="cat-modal-desc-text"></p>
          <ul class="cat-modal-specs"></ul>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const modal    = overlay.querySelector('.cat-modal');
    const closeBtn = overlay.querySelector('.cat-modal-close');
    const pages    = overlay.querySelectorAll('.cat-modal-visual > .cat-page');
    const dots     = overlay.querySelectorAll('.cat-modal-visual .cat-page-dot');
    const prevBtn  = overlay.querySelector('.cat-modal-visual .cat-nav-arrow--prev');
    const nextBtn  = overlay.querySelector('.cat-modal-visual .cat-nav-arrow--next');
    const imgEl    = overlay.querySelector('.cat-modal-visual .cat-product-img');
    const page3d   = overlay.querySelector('.cat-modal-visual .cat-page--3d');
    const tagEl    = overlay.querySelector('.cat-modal-info .cat-product-tag');
    const nameEl   = overlay.querySelector('.cat-modal-name');
    const excerptEl = overlay.querySelector('.cat-modal-info .cat-product-excerpt');
    const descText  = overlay.querySelector('.cat-modal-desc-text');
    const specsList = overlay.querySelector('.cat-modal-specs');

    let modalCurrentPage = 1;
    let isOpen = false;

    function modalGoTo(index) {
        if (index === modalCurrentPage || index < 0 || index >= pages.length) return;
        const leaving  = pages[modalCurrentPage];
        const entering = pages[index];

        if (leaving.classList.contains('cat-page--3d')) destroyModelViewer(leaving);

        if (entering.classList.contains('cat-page--3d')) {
            if (activeModelPage) {
                const prod = activeModelPage.closest('.cat-product');
                const ctrl = prod && productControllers.get(prod);
                if (ctrl) ctrl.goTo(0, true); else destroyModelViewer(activeModelPage);
            }
            createModelViewer(entering);
        }

        leaving.classList.remove('active');
        gsap.to(leaving, {
            opacity: 0, duration: 0.2, ease: 'power2.in',
            onComplete() { gsap.set(leaving, { visibility: 'hidden', pointerEvents: 'none' }); }
        });
        gsap.set(entering, { visibility: 'visible', opacity: 0 });
        entering.classList.add('active');
        gsap.to(entering, {
            opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.1,
            onStart() { entering.style.pointerEvents = 'auto'; }
        });

        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        modalCurrentPage = index;
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => modalGoTo(i)));
    prevBtn.addEventListener('click', () => modalGoTo((modalCurrentPage - 1 + pages.length) % pages.length));
    nextBtn.addEventListener('click', () => modalGoTo((modalCurrentPage + 1) % pages.length));

    function open(product) {
        const cardImg     = product.querySelector('.cat-page--img .cat-product-img');
        const cardPage3d  = product.querySelector('.cat-page--3d');
        const cardTag     = product.querySelector('.cat-product-tag');
        const cardName    = product.querySelector('.cat-product-name');
        const cardExcerpt = product.querySelector('.cat-product-excerpt');
        const cardDescText = product.querySelector('.cat-desc-text');
        const cardSpecs   = product.querySelector('.cat-desc-specs');

        imgEl.src = cardImg ? cardImg.src : '';
        imgEl.alt = cardImg ? cardImg.alt : '';
        page3d.dataset.modelSrc = cardPage3d ? (cardPage3d.dataset.modelSrc || '') : '';
        page3d.dataset.modelAlt = cardPage3d ? (cardPage3d.dataset.modelAlt || '') : '';
        tagEl.textContent     = cardTag     ? cardTag.textContent     : '';
        nameEl.textContent    = cardName    ? cardName.textContent    : '';
        excerptEl.textContent = cardExcerpt ? cardExcerpt.textContent : '';
        descText.textContent  = cardDescText ? cardDescText.textContent : '';
        specsList.innerHTML   = cardSpecs   ? cardSpecs.innerHTML     : '';

        if (activeModelPage) {
            const prod = activeModelPage.closest('.cat-product');
            const ctrl = prod && productControllers.get(prod);
            if (ctrl) ctrl.goTo(0, true); else destroyModelViewer(activeModelPage);
        }

        modalCurrentPage = 1;
        pages.forEach((p, i) => {
            const is3d = i === 1;
            p.classList.toggle('active', is3d);
            gsap.set(p, {
                opacity: is3d ? 1 : 0,
                visibility: is3d ? 'visible' : 'hidden',
                pointerEvents: is3d ? 'auto' : 'none'
            });
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === 1));

        createModelViewer(page3d);

        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        overlay.classList.add('open');

        gsap.fromTo(modal,
            { scale: 0.88, opacity: 0, y: 24 },
            { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'back.out(1.5)' }
        );

        isOpen = true;
    }

    function close() {
        if (!isOpen) return;
        if (page3d.querySelector('model-viewer')) destroyModelViewer(page3d);

        gsap.to(modal, {
            scale: 0.92, opacity: 0, y: 12, duration: 0.22, ease: 'power2.in',
            onComplete() {
                overlay.classList.remove('open');
                overlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                isOpen = false;
            }
        });
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });

    const expandSVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>`;

    document.querySelectorAll('.cat-product').forEach(product => {
        const visual = product.querySelector('.cat-product-visual');
        if (!visual) return;
        const btn = document.createElement('button');
        btn.className = 'cat-expand-btn';
        btn.setAttribute('aria-label', 'Expandir');
        btn.innerHTML = expandSVG;
        btn.addEventListener('click', e => { e.stopPropagation(); open(product); });
        visual.appendChild(btn);
    });
}

// ──────────────────────────────────
// Init
// ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initCatalogFilter();
    initLoadingOverlays();
    initProductPages();
    initExpandModal();
    initViewportCleanup();
    initHeroAnimations();
    initProductAnimations();
    initParallax();
    initHeaderScroll();
    initFinalCTA();
    initButtonEffects();

    // Libera o modelo ativo quando a aba some ou a página é backgrounded.
    // Evita estado "zumbi" no Safari iOS quando o usuário troca de app
    // e volta: o iOS pode ter despejado o contexto WebGL e a página
    // voltaria inconsistente, causando o reload automático.
    const releaseActiveModel = () => {
        if (activeModelPage) {
            const prod = activeModelPage.closest('.cat-product');
            const ctrl = prod && productControllers.get(prod);
            if (ctrl) ctrl.goTo(0, true);
            else destroyModelViewer(activeModelPage);
        }
    };
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) releaseActiveModel();
    });
    window.addEventListener('pagehide', releaseActiveModel);

    ScrollTrigger.refresh();
});
