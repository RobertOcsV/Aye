// Registrar plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Configurações
const WHATSAPP_NUMBER = '5511965391991';

// Quebra o texto do hero-phrase-static em spans por letra, agrupando por palavra
function splitHeroPhrase() {
    const el = document.querySelector('.hero-phrase-static');
    if (!el) return [];
    const text = el.textContent.trim();
    el.textContent = '';
    el.setAttribute('aria-label', text);

    const chars = [];
    text.split(' ').forEach((word, wi, arr) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.cssText = 'display:inline-block; white-space:nowrap;';

        word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.style.cssText = 'display:inline-block; opacity:0;';
            wordSpan.appendChild(charSpan);
            chars.push(charSpan);
        });

        el.appendChild(wordSpan);

        // espaço entre palavras (exceto após a última)
        if (wi < arr.length - 1) {
            el.appendChild(document.createTextNode(' '));
        }
    });

    return chars;
}

// Animações do Hero — intro de entrada.
// O hero fica abaixo do banner Portal: a intro toca quando ele ENTRA na tela
// (se a página já abrir com o hero passado, o ScrollTrigger dispara na hora).
function initHeroAnimations() {
    const chars = splitHeroPhrase();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (chars.length) gsap.set(chars, { opacity: 1 });
        return;
    }

    const intro = gsap.timeline({
        scrollTrigger: { trigger: '.hero', start: 'top 72%', once: true }
    });

    intro
        .from('.eyebrow-bar', {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.6,
            ease: 'power3.out'
        })
        .from('.eyebrow-text', { x: -20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .from('.hero-brand',   { x: -25, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
        .from('.hero-3d-stage', { y: 40, opacity: 0, duration: 1, ease: 'power2.out' }, 0.1);

    if (chars.length) {
        gsap.set(chars, { y: -18, opacity: 0 });
        intro.to(chars, {
            y: 0,
            opacity: 1,
            duration: 0.35,
            stagger: 0.018,
            ease: 'power2.out'
        }, '-=0.5');
    }

    intro.from('.hero-buttons', { y: 15, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');

    const rings = document.querySelectorAll('.hero-3d-ring, .hero-3d-glow');
    if (rings.length) {
        intro.from(rings, {
            scale: 0.3,
            opacity: 0,
            duration: 1.4,
            ease: 'power2.out',
            stagger: 0.2
        }, 0.4);
    }
}

// Animações dos cards About ao scroll - Simplificadas
function initAboutAnimations() {
    // Animações simplificadas - cards já estão visíveis
}

// Scroll-reveal sutil dos cards About + micro-interação no ícone
function initAboutCardReveal() {
    const cards = gsap.utils.toArray('.about-card');
    if (!cards.length) return;

    gsap.from(cards, {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 78%',
            toggleActions: 'play none none reverse'
        },
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
    });

    cards.forEach(card => {
        const icon = card.querySelector('.card-icon-wrap');
        if (!icon) return;
        card.addEventListener('mouseenter', () => {
            gsap.to(icon, { rotate: -6, scale: 1.06, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(icon, { rotate: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
        });
    });
}

// Animações dos produtos ao scroll - Simplificadas
function initProductsAnimations() {
    // Animações de entrada desabilitadas - elementos já estão visíveis

    // Animação das imagens dos produtos ao entrar na viewport
    gsap.utils.toArray('.product-img').forEach((img, index) => {
        gsap.from(img, {
            scrollTrigger: {
                trigger: img,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });

    // Hover effect nos cards de produtos
    gsap.utils.toArray('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                scale: 1.05,
                boxShadow: '0 20px 50px rgba(166, 91, 66, 0.25)',
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
}

// Animação da seção Story
function initStoryAnimations() {
    // Animações desabilitadas - elementos já estão visíveis no CSS

    // Animação da imagem da story ao entrar na viewport
    gsap.from('.story-img', {
        scrollTrigger: {
            trigger: '.story',
            start: 'top 60%',
            toggleActions: 'play none none none',
            once: true
        },
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: 'power2.out'
    });

    // Flutuação sutil na imagem
    gsap.to('.story-img', {
        y: -6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// Animação da seção Process
function initProcessAnimations() {
    // Animações de entrada desabilitadas - elementos já estão visíveis

    // Pulso sutil nos números (mantido)
    gsap.utils.toArray('.step-number').forEach((num, index) => {
        gsap.to(num, {
            scale: 1.1,
            boxShadow: '0 8px 25px rgba(166, 91, 66, 0.5)',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
        });
    });
}

// Animação da seção Benefits
function initBenefitsAnimations() {
    // Animações desabilitadas - elementos já estão visíveis
    return;
}

// Animação da seção Newsletter
function initNewsletterAnimations() {
    // Animações desabilitadas - elementos já estão visíveis
    return;
}

// Animação da seção Testimonials
function initTestimonialsAnimations() {
    // Animações de entrada desabilitadas - elementos já estão visíveis

    // Efeito de flutuação nos cards de depoimentos (mantido)
    gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
        gsap.to(card, {
            y: -10,
            duration: 2.5 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
        });
    });
}

// Animação do formulário ao scroll - Desabilitada
function initContactAnimations() {
    // Animações desabilitadas - elementos já estão visíveis
    return;
}

// Header: transparente enquanto está sobre o banner Portal (.is-over);
// depois dele, volta ao creme com sombra (.is-scrolled). As cores ficam no CSS.
function initHeaderAnimation() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const banner = document.querySelector('[data-banner]');
    if (!banner) return;

    const setOver = over => header.classList.toggle('is-over', over);
    setOver(window.scrollY < banner.offsetHeight - header.offsetHeight);

    ScrollTrigger.create({
        trigger: banner,
        start: 'top top',
        end: () => `bottom top+=${header.offsetHeight || 80}`,
        onLeave: () => setOver(false),
        onEnterBack: () => setOver(true),
        onRefresh: self => setOver(self.scroll() < self.end)
    });
}

// Parallax suave e sofisticado
function initParallax() {
    // Parallax no hero logo
    gsap.to('.hero-brand-logo', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 150,
        scale: 0.7,
        opacity: 0.3,
        rotation: 5,
        ease: 'none'
    });

    // Parallax nas seções de fundo
    gsap.to('.about', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        backgroundPosition: '50% 100%',
        ease: 'none'
    });

    gsap.to('.contact', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        backgroundPosition: '50% 100%',
        ease: 'none'
    });
}

// Animação de reveal nos títulos das seções
function initTitleRevealAnimations() {
    gsap.utils.toArray('.section-title').forEach(title => {
        const section = title.closest('section') || title;
        gsap.from(title, {
            scrollTrigger: {
                trigger: section,
                start: 'top 65%',
                toggleActions: 'play none none none',
                once: true
            },
            opacity: 0,
            y: 14,
            duration: 0.55,
            ease: 'power2.out'
        });
    });
}

// Hover effects com GSAP nos botões
function initButtonHoverEffects() {
    // Botões CTA principais
    gsap.utils.toArray('.cta-primary, .cta-secondary, .nav-cta').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Efeito de pulso
            gsap.to(button, {
                boxShadow: '0 0 0 10px rgba(166, 91, 66, 0)',
                duration: 0.6,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Botão de formulário (newsletter — apenas se presente)
    const formButton = document.querySelector('.lead-form button');
    if (formButton) {
        formButton.addEventListener('mouseenter', () => {
            gsap.to(formButton, { scale: 1.03, y: -3, duration: 0.3, ease: 'power2.out' });
        });
        formButton.addEventListener('mouseleave', () => {
            gsap.to(formButton, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        });
    }
}

// Scroll indicator animado
function initScrollIndicator() {
    // Criar elemento do scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = `
        <div class="scroll-indicator-line"></div>
        <div class="scroll-indicator-text">Role para descobrir</div>
    `;
    document.querySelector('.hero').appendChild(scrollIndicator);

    // Animação de entrada
    gsap.from(scrollIndicator, {
        opacity: 0,
        y: -20,
        duration: 1,
        delay: 2,
        ease: 'power2.out'
    });

    // Animação contínua
    gsap.to('.scroll-indicator-line', {
        height: '60px',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // Desaparecer ao scroll
    gsap.to(scrollIndicator, {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'top center',
            scrub: true
        },
        opacity: 0,
        y: -30,
        ease: 'none'
    });
}

// WhatsApp
document.querySelector('.cta-whatsapp').addEventListener('click', () => {
    const message = encodeURIComponent('Olá! Vim do site e gostaria de conhecer os produtos da Ayê.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
});

// Scroll suave para formulário
document.querySelector('.scroll-to-form').addEventListener('click', () => {
    document.querySelector('.contact').scrollIntoView({
        behavior: 'smooth'
    });
});

// Botão do nav também scroll para contato
document.querySelector('.nav-cta').addEventListener('click', () => {
    document.querySelector('.contact').scrollIntoView({
        behavior: 'smooth'
    });
});

// Formulário de Newsletter (Lead Form) — apenas se a seção estiver presente no HTML
const leadForm = document.getElementById('leadForm');

if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = leadForm.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;

        submitButton.innerHTML = '<span>Enviando...</span>';
        submitButton.disabled = true;

        const formData = new FormData(leadForm);

        try {
            const templateParamsAdmin = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                reply_to: formData.get('email'),
                to_name: 'Ayê',
                message: 'Novo cadastro na newsletter',
                timestamp: new Date().toLocaleString('pt-BR'),
                source: 'Newsletter'
            };

            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, templateParamsAdmin);

            const templateParamsCliente = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                message: 'Obrigado por se cadastrar na nossa newsletter!'
            };

            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_AUTOREPLY, templateParamsCliente);

            gsap.to(leadForm, { scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 });
            alert('✨ Obrigado! Você está cadastrado para receber nossas novidades.');
            leadForm.reset();

        } catch {
            alert('❌ Erro ao enviar. Por favor, tente novamente.');
        } finally {
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }
    });

    const leadEmailInput = leadForm.querySelector('input[type="email"]');
    if (leadEmailInput) {
        leadEmailInput.addEventListener('blur', (e) => {
            const email = e.target.value;
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            e.target.style.borderColor = (email && !isValid) ? '#e74c3c' : '';
        });
    }
}

// Formulário de Contato — envio direto via WhatsApp
const sendWhatsappBtn = document.getElementById('sendWhatsapp');
if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', () => {
        const textarea = document.getElementById('whatsappMessage');
        const msg = textarea ? textarea.value.trim() : '';
        const text = msg || 'Olá! Vim do site e gostaria de conhecer os produtos da Ayê.';
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    });
}

// Carousel (banner — mantido como fallback, guard adicionado)
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const track = document.querySelector('.carousel-track');
    if (!slides.length || !track) return; // seção removida — sai silenciosamente
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Criar dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        // Remove active de todos
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Adiciona active no atual
        slides[index].classList.add('active');
        dots[index].classList.add('active');

        // Anima com GSAP
        gsap.to(track, {
            x: -index * 100 + '%',
            duration: 0.8,
            ease: 'power3.inOut'
        });

        // Anima a imagem entrando
        gsap.from(slides[index].querySelector('img'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.5)',
            delay: 0.2
        });

        gsap.from(slides[index].querySelector('p'), {
            y: 30,
            opacity: 0,
            duration: 0.5,
            delay: 0.4
        });

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prev);
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-play
    let autoplayInterval = setInterval(nextSlide, 5000);

    // Pausar autoplay no hover
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });

    // Animações da seção desabilitadas - elementos já estão visíveis
}

// ─────────────────────────────────────
// Carousel de Modelos 3D (model-viewer)
// ─────────────────────────────────────
function initModelCarousel() {
    const slides      = document.querySelectorAll('.model-slide');
    const dotsWrap    = document.querySelector('.model-dots');
    const prevBtn     = document.querySelector('.model-nav--prev');
    const nextBtn     = document.querySelector('.model-nav--next');

    if (!slides.length || !dotsWrap) return;

    let current = 0;
    const total = slides.length;

    // Criar dots dinamicamente
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'model-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Modelo ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.model-dot');

    // Esconde o overlay de loading (ou imagem de capa) quando o modelo termina de carregar
    function setupLoadingOverlay(slide) {
        const mv = slide.querySelector('model-viewer');
        const overlay = slide.querySelector('.model-loading-overlay');
        const cover = slide.querySelector('.model-cover-img');
        if (!mv || (!overlay && !cover)) return;
        mv.addEventListener('load', () => {
            if (overlay) overlay.classList.add('hidden');
            if (cover) cover.classList.add('hidden');
        }, { once: true });
    }

    // Carrega o src de um model-viewer a partir do data-src (se ainda não carregado)
    function loadModel(slide) {
        const mv = slide.querySelector('model-viewer');
        if (mv && !mv.getAttribute('src') && mv.dataset.src) {
            const overlay = slide.querySelector('.model-loading-overlay');
            if (overlay) overlay.classList.remove('hidden');
            mv.setAttribute('src', mv.dataset.src);
            setupLoadingOverlay(slide);
        }
    }

    // Pré-carrega o próximo slide em background após um delay
    function prefetchNext(index) {
        const nextIndex = (index + 1) % total;
        setTimeout(() => loadModel(slides[nextIndex]), 1200);
    }

    function goTo(index) {
        if (index === current) return;

        const leaving  = slides[current];
        const entering = slides[index];

        // Garante que o modelo do slide destino esteja carregado
        loadModel(entering);

        const mv = entering.querySelector('model-viewer');

        // Sai: fade + leve escala para baixo
        gsap.to(leaving, {
            opacity: 0,
            scale: 0.94,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
                leaving.classList.remove('active');
                gsap.set(leaving, { scale: 1, visibility: 'hidden', pointerEvents: 'none' });
                const leavingMv = leaving.querySelector('model-viewer');
                if (leavingMv) leavingMv.removeAttribute('auto-rotate');
            }
        });

        // Entra: fade + escala sobe a partir de 1.04
        gsap.set(entering, { visibility: 'visible', opacity: 0, scale: 1.04 });
        entering.classList.add('active');
        gsap.to(entering, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.25,
            onStart: () => {
                entering.style.pointerEvents = 'auto';
                if (mv) mv.setAttribute('auto-rotate', '');
            }
        });

        // Atualiza dots
        dots.forEach((d, i) => d.classList.toggle('active', i === index));

        current = index;

        // Pré-carrega o próximo em background
        prefetchNext(index);
    }

    const next = () => goTo((current + 1) % total);
    const prev = () => goTo((current - 1 + total) % total);

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    // Navegação apenas por botões — sem swipe para não conflitar com rotação do model-viewer

    // Estado inicial: garante que só o slide 0 seja visível
    gsap.set(slides, { opacity: 0, visibility: 'hidden' });
    gsap.set(slides[0], { opacity: 1, visibility: 'visible' });

    // Carrega o modelo do primeiro slide (usa data-src como os demais)
    loadModel(slides[0]);
    prefetchNext(0);

    // iOS: remove o atributo auto-rotate dos model-viewers inativos para
    // reduzir pressão na GPU (cada auto-rotate mantém render loop ativo).
    slides.forEach((slide, i) => {
        const mv = slide.querySelector('model-viewer');
        if (mv && i !== 0) mv.removeAttribute('auto-rotate');
    });

    // Configura overlay de loading para cada slide
    slides.forEach(slide => setupLoadingOverlay(slide));

    // Pré-carrega o segundo modelo logo após o primeiro terminar de carregar
    const firstMv = slides[0].querySelector('model-viewer');
    if (firstMv) {
        firstMv.addEventListener('load', () => prefetchNext(0), { once: true });
    }
}

// ─────────────────────────────────────
// Feed do Instagram — Meta Graph API
// ─────────────────────────────────────
async function initInstagramFeed() {
    const grid  = document.getElementById('instagramGrid');
    if (!grid) return;

    // Skeletons de carregamento
    grid.innerHTML = Array(6).fill('<div class="ig-skeleton"></div>').join('');

    try {
        // Chama o proxy serverless — token fica seguro no servidor
        const res  = await fetch('/api/instagram');
        if (!res.ok) throw new Error(`API ${res.status}`);
        const { data } = await res.json();

        // Filtra só imagens e álbuns (sem vídeos puros)
        const posts = (data || []).filter(p => p.media_type !== 'VIDEO').slice(0, 6);
        if (!posts.length) throw new Error('Nenhum post encontrado');

        grid.innerHTML = '';

        posts.forEach((post, i) => {
            const imgSrc  = post.media_url || post.thumbnail_url || '';
            const rawCap  = (post.caption || '').replace(/#\S+/g, '').trim();
            const caption = rawCap.slice(0, 140) + (rawCap.length > 140 ? '…' : '');
            const date    = new Date(post.timestamp).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            const isAlbum = post.media_type === 'CAROUSEL_ALBUM';

            const a = document.createElement('a');
            a.className = 'ig-post';
            a.href      = post.permalink;
            a.target    = '_blank';
            a.rel       = 'noopener noreferrer';
            a.setAttribute('aria-label', caption.slice(0, 60) || 'Post no Instagram');

            a.innerHTML = `
                <div class="ig-post-img-wrap">
                    <img src="${imgSrc}" alt="" class="ig-post-img" loading="lazy">
                    <div class="ig-post-overlay">
                        ${caption ? `<p class="ig-post-caption">${caption}</p>` : ''}
                        <span class="ig-post-date">${date}</span>
                    </div>
                    ${isAlbum ? `<span class="ig-post-type">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    </span>` : ''}
                </div>`;

            grid.appendChild(a);

            // Entrada animada com GSAP ScrollTrigger
            gsap.from(a, {
                scrollTrigger: {
                    trigger: a,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                    once: true
                },
                opacity: 0,
                y: 22,
                scale: 0.95,
                duration: 0.6,
                ease: 'power2.out',
                delay: i * 0.08
            });
        });

    } catch {
        grid.innerHTML = `
            <div class="instagram-error">
                <p>Visite nosso Instagram para ver as últimas novidades ✨</p>
            </div>`;
    }
}

// ─────────────────────────────────────
// Recalcula o ScrollTrigger quando a altura do <main> muda depois do init.
// Conteúdo assíncrono (feed do Instagram trocando skeleton por posts/erro,
// imagem lazy da Story, fontes) empurra as seções de baixo; sem refresh os
// gatilhos ficam na posição velha e as animações disparam atrasadas.
// Só altura do <main>: no mobile a barra de endereço do iOS não altera essa
// altura (.hero com min-height: auto), então o loop de refresh não volta.
// ─────────────────────────────────────
function initLayoutRefresh() {
    const main = document.querySelector('main');
    if (!main || typeof ResizeObserver === 'undefined') return;

    let lastHeight = main.offsetHeight;
    let timer;

    new ResizeObserver(() => {
        const height = main.offsetHeight;
        if (height === lastHeight) return;
        lastHeight = height;
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    }).observe(main);
}

// Executa fn uma única vez, quando o elemento chega perto da viewport
function whenNear(selector, fn, rootMargin) {
    const el = document.querySelector(selector);
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
        fn();
        return;
    }
    const io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
            io.disconnect();
            fn();
        }
    }, { rootMargin: rootMargin || '0px' });
    io.observe(el);
}

/* ═══════════════════════════════════════════════════════════
   PORTAL — banner do topo  ·  "Do Orum ao Ayê"

   • canvas: céu do Orum (estrelas com profundidade) + poeira de
     estrelas que gira em redemoinho e forma a Sankofa (pontos
     amostrados do PNG do logo)
   • scroll (palco sticky): a câmera atravessa o portal, estrelas
     viram rastros e o creme do Ayê se abre a partir do centro
   • mouse: paralaxe nas estrelas + partículas se afastam do cursor

   Via file:// o navegador bloqueia a leitura dos pixels do logo:
   aí entra o modo reserva (anel de partículas + logo em imagem).
   ═══════════════════════════════════════════════════════════ */
function initPortal() {
    const root = document.querySelector('.portal');
    if (!root) return;

    const $ = sel => root.querySelector(sel);
    const stage       = $('.portal-stage');
    const canvas      = $('.portal-canvas');
    const ctx         = canvas.getContext('2d');
    const rings       = $('.portal-rings');
    const dawn        = $('.portal-dawn');
    const arrival     = $('.portal-arrival');
    const lineOrum    = $('.portal-title-line--orum');
    const lineAye     = $('.portal-title-line--aye');
    const intro       = $('.portal-intro');
    const cue         = $('.portal-scroll-cue');
    const fallbackImg = $('.portal-logo-fallback');
    const framePath   = $('.portal-frame-path');
    const dotsGroup   = $('.portal-frame-dots');
    const descendBtn  = $('[data-portal-descend]');

    const REDUCED  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MOBILE   = window.matchMedia('(max-width: 968px)').matches;
    const LOGO_SRC = 'Img/logo-colorido-sem-fundo.png';
    const SVG_NS   = 'http://www.w3.org/2000/svg';
    const TAU      = Math.PI * 2;

    const RGB = {
        creme: 'rgb(242,231,218)',
        gold:  'rgb(233,196,140)',
        terra: 'rgb(226,160,131)',
        ring:  'rgb(157,190,140)',
        seed:  'rgb(234,140,100)'
    };

    // ── utilidades ─────────────────────────────────────────
    const rand           = (a, b) => a + Math.random() * (b - a);
    const clamp          = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
    const smooth         = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
    const easeInCubic    = t => t * t * t;
    const easeOutCubic   = t => 1 - Math.pow(1 - t, 3);
    const easeInOutCubic = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    // ── medidas ────────────────────────────────────────────
    let W = 1, H = 1, DPR = 1, cx = 0, cy = 0, halfDiag = 1, logoSize = 360;

    function resize() {
        const w = Math.max(1, stage.clientWidth);
        const h = Math.max(1, stage.clientHeight);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (w === W && h === H && dpr === DPR) return;
        W = w; H = h; DPR = dpr;
        canvas.width = Math.round(W * DPR);
        canvas.height = Math.round(H * DPR);
        cx = W / 2;
        cy = H * (MOBILE ? .47 : .5);          // igual ao --portal-y do CSS
        halfDiag = Math.hypot(W, H) / 2;
        logoSize = clamp(Math.min(W, H) * (MOBILE ? .5 : .42), 190, 440);
        if (fallbackImg) fallbackImg.style.width = Math.round(logoSize) + 'px';
        lastP = -1;                             // força atualizar o DOM
    }

    // ── anel do portal (SVG, mesmo desenho do anel do logo) ─
    function buildFrame() {
        const C = 500, R = 392, DEPTH = 24, HALF = 6;
        const NOTCHES = [-90, 0, 90, 180];      // entalhes em V, como no logo
        const GAP_FROM = 300, GAP_TO = 338;     // abertura no alto à direita (onde fica a espiral)
        const pts = [];

        for (let a = GAP_TO; a <= GAP_FROM + 360; a += 1) {
            const deg = a % 360;
            let r = R;
            for (const n of NOTCHES) {
                const d = Math.abs((((deg - n) % 360) + 540) % 360 - 180);
                if (d < HALF) r = Math.min(r, R - DEPTH * (1 - d / HALF));
            }
            const rad = deg * Math.PI / 180;
            pts.push(`${(C + r * Math.cos(rad)).toFixed(1)} ${(C + r * Math.sin(rad)).toFixed(1)}`);
        }
        framePath.setAttribute('d', 'M' + pts.join(' L'));

        for (let k = 0; k < 12; k++) {
            const deg = k * 30 + 15;
            if (deg > GAP_FROM - 6 && deg < GAP_TO + 6) continue;
            const rad = deg * Math.PI / 180;
            const dot = document.createElementNS(SVG_NS, 'circle');
            dot.setAttribute('class', 'portal-frame-dot');
            dot.setAttribute('cx', (C + (R + 34) * Math.cos(rad)).toFixed(1));
            dot.setAttribute('cy', (C + (R + 34) * Math.sin(rad)).toFixed(1));
            dot.setAttribute('r', '7');
            dotsGroup.appendChild(dot);
        }

        return framePath.getTotalLength();
    }

    // ── estrelas ───────────────────────────────────────────
    const FOCAL  = .36;
    const STAR_N = MOBILE ? 230 : 520;
    const stars  = [];
    const star   = { a: REDUCED ? 1 : 0 };   // fade global (intro)

    function resetStar(s, z) {
        s.x = rand(-1, 1);
        s.y = rand(-1, 1);
        s.z = z;
        s.r = rand(.35, 1.2);
        s.tw = rand(0, TAU);
        s.sp = rand(.6, 2.2);
        const k = Math.random();
        s.c = k < .7 ? RGB.creme : k < .93 ? RGB.gold : RGB.terra;
        s.glyph = Math.random() < .035;     // estrelas de 8 pontas, como na estampa
        s.px = null;
        s.py = null;
        return s;
    }
    for (let i = 0; i < STAR_N; i++) stars.push(resetStar({}, rand(.02, 1)));

    const GLYPH = [];
    for (let i = 0; i < 16; i++) {
        const a = i * Math.PI / 8 - Math.PI / 2;
        const r = i % 2 ? .4 : 1;
        GLYPH.push([Math.cos(a) * r, Math.sin(a) * r]);
    }

    function drawGlyph(x, y, size, rot) {
        const c = Math.cos(rot), s = Math.sin(rot);
        ctx.beginPath();
        for (let i = 0; i < 16; i++) {
            const gx = GLYPH[i][0] * size, gy = GLYPH[i][1] * size;
            const X = x + gx * c - gy * s, Y = y + gx * s + gy * c;
            if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // ── partículas da Sankofa ──────────────────────────────
    let groups = [];                 // [{ color, list }]
    let fallbackMode = false;
    let formT0 = Infinity;           // início da formação (ms)
    const FORM_DUR = 2600;

    // alvo (u, v) em fração do tamanho do logo, centrado em 0
    function makeParticle(u, v, size) {
        const ta = Math.atan2(v, u);
        const sa = rand(0, TAU);
        let da = (((ta - sa) % TAU) + TAU) % TAU;          // sempre no mesmo sentido: redemoinho
        if (Math.random() < .3) da += TAU;
        return {
            u, v,
            tr: Math.hypot(u, v),
            sa, da,
            sr: rand(.42, .95),                            // começa espalhada pelo céu
            delay: rand(0, 750),
            size,
            ph: rand(0, TAU),
            ox: 0,
            oy: 0
        };
    }

    // Lê os pixels do logo e devolve pontos por cor (pássaro, anel, semente)
    function sampleLogo(img) {
        const S = MOBILE ? 150 : 210;
        const step = 2;
        const off = document.createElement('canvas');
        off.width = off.height = S;
        const octx = off.getContext('2d', { willReadFrequently: true });
        octx.drawImage(img, 0, 0, S, S);
        const data = octx.getImageData(0, 0, S, S).data;   // lança erro em file:// (canvas "tainted")
        const pts = [];
        for (let y = 0; y < S; y += step) {
            for (let x = 0; x < S; x += step) {
                const i = (y * S + x) * 4;
                if (data[i + 3] < 150) continue;
                const r = data[i], g = data[i + 1], b = data[i + 2];
                if (r > 225 && g > 215 && b > 200) continue;     // fundo claro, se houver
                let kind = 'bird';
                if (g > r + 8 && g >= b) kind = 'ring';
                else if (r > 140 && r > g + 40) kind = 'seed';
                pts.push({ u: x / S - .5, v: y / S - .5, kind });
            }
        }
        return pts;
    }

    function buildFromSamples(pts) {
        const max = MOBILE ? 1900 : 3600;
        if (pts.length > max) {
            for (let i = pts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pts[i], pts[j]] = [pts[j], pts[i]];
            }
            pts.length = max;
        }
        const by = { ring: [], bird: [], seed: [] };
        for (const p of pts) {
            const size = p.kind === 'seed' ? 2.3 : p.kind === 'ring' ? 2 : 1.8;
            by[p.kind].push(makeParticle(p.u, p.v, size));
        }
        groups = [
            { color: RGB.ring,  list: by.ring },
            { color: RGB.creme, list: by.bird },
            { color: RGB.seed,  list: by.seed }
        ];
    }

    // Modo reserva: anel de partículas em volta do logo em imagem
    function buildFallback() {
        fallbackMode = true;
        root.classList.add('is-fallback');
        const list = [];
        const N = MOBILE ? 520 : 900;
        const R = .62;
        for (let i = 0; i < N; i++) {
            const a = (i / N) * TAU;
            const jitter = rand(-.006, .006);
            list.push(makeParticle(Math.cos(a) * (R + jitter), Math.sin(a) * (R + jitter), 1.7));
        }
        for (let k = 0; k < 12; k++) {
            const a = (k * 30 + 15) * Math.PI / 180;
            for (let j = 0; j < 14; j++) {
                const rr = rand(0, .013), aa = rand(0, TAU);
                list.push(makeParticle(Math.cos(a) * .68 + Math.cos(aa) * rr, Math.sin(a) * .68 + Math.sin(aa) * rr, 2));
            }
        }
        groups = [{ color: RGB.gold, list }];
    }

    function loadLogo() {
        const begin = () => { formT0 = performance.now() + (REDUCED ? -1e7 : 500); };
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
            let pts = null;
            try { pts = sampleLogo(img); } catch (err) { pts = null; }
            if (pts && pts.length > 300) buildFromSamples(pts);
            else buildFallback();
            begin();
        };
        img.onerror = () => { buildFallback(); begin(); };
        img.src = LOGO_SRC;
    }

    // ── ponteiro ───────────────────────────────────────────
    const pointer = { x: 0, y: 0, active: false };
    let mx = 0, my = 0, pmx = 0, pmy = 0;

    stage.addEventListener('pointermove', e => {
        const r = stage.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
        pointer.active = true;
        mx = (pointer.x / W) * 2 - 1;
        my = (pointer.y / H) * 2 - 1;
    }, { passive: true });

    stage.addEventListener('pointerleave', () => {
        pointer.active = false;
        mx = my = 0;
    });

    // ── scroll ─────────────────────────────────────────────
    let pTarget = 0, p = 0, lastP = -1;

    ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => { pTarget = self.progress; },
        onRefresh: self => { pTarget = self.progress; }
    });

    function applyDom() {
        if (Math.abs(p - lastP) < .0004) return;
        lastP = p;

        // títulos se afastam
        const out = smooth(0, .3, p);
        const fade = (1 - smooth(.03, .24, p)).toFixed(3);
        lineOrum.style.transform = `translate3d(${(-out * 10).toFixed(2)}vw, ${(-out * 12).toFixed(2)}vh, 0)`;
        lineAye.style.transform  = `translate3d(${(out * 10).toFixed(2)}vw, ${(out * 12).toFixed(2)}vh, 0)`;
        lineOrum.style.opacity = fade;
        lineAye.style.opacity  = fade;

        const introOut = smooth(0, .1, p);
        intro.style.opacity = (1 - introOut).toFixed(3);
        intro.style.transform = `translate3d(0, ${(introOut * 26).toFixed(1)}px, 0)`;
        intro.style.visibility = introOut > .98 ? 'hidden' : '';
        if (cue) cue.style.opacity = (1 - smooth(0, .04, p)).toFixed(3);

        // anéis: a câmera passa por dentro do portal
        const zoomT = easeInCubic(smooth(.03, .7, p));
        rings.style.setProperty('--ring-scale', (1 + zoomT * 7).toFixed(4));
        rings.style.setProperty('--ring-opacity', (1 - smooth(.4, .68, p)).toFixed(3));

        if (fallbackMode && fallbackImg) {
            fallbackImg.style.transform = `translate(-50%, -50%) scale(${(1 + zoomT * 9).toFixed(4)})`;
        }

        // amanhecer no Ayê: círculo creme abrindo do centro
        const maxR = Math.hypot(W / 2, Math.max(cy, H - cy)) + 4;
        const r = easeInOutCubic(smooth(.4, .86, p)) * maxR;
        dawn.style.clipPath = `circle(${r.toFixed(1)}px at 50% ${(cy / H * 100).toFixed(2)}%)`;

        const a = smooth(.68, .9, p);
        arrival.style.opacity = a.toFixed(3);
        arrival.style.transform = `translate3d(0, ${((1 - a) * 28).toFixed(1)}px, 0) scale(${(.94 + a * .06).toFixed(4)})`;

        // header escuro quando o creme já cobre o topo
        const theme = p > .74 ? 'light' : 'dark';
        if (document.body.dataset.bannerTheme !== theme) document.body.dataset.bannerTheme = theme;
    }

    // ── desenho ────────────────────────────────────────────
    let idle = 0;
    let lastImgO = -1;

    function draw(now, dt) {
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';

        pmx += (mx - pmx) * .05;
        pmy += (my - pmy) * .05;

        // câmera: deriva lenta + viagem conduzida pelo scroll
        if (!REDUCED) idle += dt * .000012;
        const cam = idle + easeInCubic(p) * 2.6;
        const spread = Math.max(W, H) * .5;
        const t = now * .001;

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            let d = s.z - cam;
            let guard = 0;
            while (d <= .02 && guard++ < 6) { resetStar(s, s.z + 1); d = s.z - cam; }
            while (d > 1 && guard++ < 12) { resetStar(s, s.z - 1); d = s.z - cam; }

            const k = FOCAL / d;
            const sx = cx + (s.x * spread + pmx * 18) * k;
            const sy = cy + (s.y * spread + pmy * 18) * k;
            if (sx < -30 || sx > W + 30 || sy < -30 || sy > H + 30) { s.px = null; continue; }

            const tw = .5 + .5 * Math.sin(t * s.sp + s.tw);
            const alpha = (.3 + .7 * tw) * smooth(1, .7, d) * star.a;
            if (alpha < .01) { s.px = sx; s.py = sy; continue; }

            const rs = clamp(s.r * k * 1.3, .3, 3.2);
            ctx.globalAlpha = alpha;

            if (s.px !== null) {
                const dx = sx - s.px, dy = sy - s.py;
                if (dx * dx + dy * dy > 5) {            // andou rápido → vira rastro
                    ctx.strokeStyle = s.c;
                    ctx.lineWidth = rs;
                    ctx.beginPath();
                    ctx.moveTo(sx - dx * 1.4, sy - dy * 1.4);
                    ctx.lineTo(sx, sy);
                    ctx.stroke();
                    s.px = sx;
                    s.py = sy;
                    continue;
                }
            }

            if (s.glyph && rs > .9) {
                ctx.strokeStyle = s.c;
                ctx.lineWidth = .8;
                drawGlyph(sx, sy, rs * 3.4, t * .2 + s.tw);
            } else {
                ctx.fillStyle = s.c;
                ctx.beginPath();
                ctx.arc(sx, sy, rs, 0, TAU);
                ctx.fill();
            }
            s.px = sx;
            s.py = sy;
        }

        // partículas
        const zoomT = easeInCubic(smooth(.03, .7, p));
        const zoom = 1 + zoomT * 9;
        const pa = 1 - smooth(.2, .5, p);
        const tf = now - formT0;

        if (groups.length && pa > .004) {
            const REP = 80, REP2 = REP * REP;
            const usePointer = pointer.active && p < .05;

            for (const g of groups) {
                ctx.fillStyle = g.color;
                for (const q of g.list) {
                    const e = clamp((tf - q.delay) / FORM_DUR);
                    let x, y, alpha;

                    if (e <= 0) {                         // ainda é estrela, esperando
                        x = cx + Math.cos(q.sa) * q.sr * halfDiag;
                        y = cy + Math.sin(q.sa) * q.sr * halfDiag;
                        alpha = .22 * star.a;
                    } else if (e < 1) {                   // redemoinho até o lugar
                        const ang = q.sa + q.da * easeInOutCubic(e);
                        const rad = q.sr * halfDiag + (q.tr * logoSize - q.sr * halfDiag) * easeOutCubic(e);
                        x = cx + Math.cos(ang) * rad;
                        y = cy + Math.sin(ang) * rad;
                        alpha = .25 + .75 * e;
                    } else {                              // formado: respira
                        x = cx + q.u * logoSize + Math.sin(now * .0016 + q.ph) * .55;
                        y = cy + q.v * logoSize + Math.cos(now * .0013 + q.ph * 1.3) * .55;
                        alpha = .78 + .22 * Math.sin(now * .0021 + q.ph * 3);
                    }

                    if (usePointer && e >= 1) {
                        const dx = x - pointer.x, dy = y - pointer.y, d2 = dx * dx + dy * dy;
                        if (d2 < REP2 && d2 > .01) {
                            const dd = Math.sqrt(d2), f = 1 - dd / REP, push = f * f * 30;
                            q.ox += (dx / dd * push - q.ox) * .2;
                            q.oy += (dy / dd * push - q.oy) * .2;
                        } else {
                            q.ox *= .9;
                            q.oy *= .9;
                        }
                    } else {
                        q.ox *= .9;
                        q.oy *= .9;
                    }

                    x += q.ox;
                    y += q.oy;
                    if (zoom !== 1) {
                        x = cx + (x - cx) * zoom;
                        y = cy + (y - cy) * zoom;
                    }

                    const sz = q.size * (1 + zoomT * 2.2);
                    ctx.globalAlpha = alpha * pa;
                    ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
                }
            }
        }

        if (fallbackMode && fallbackImg) {
            const o = smooth(0, 1, clamp((tf - 700) / FORM_DUR)) * pa * .95;
            if (Math.abs(o - lastImgO) > .004) {
                fallbackImg.style.opacity = o.toFixed(3);
                lastImgO = o;
            }
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }

    // ── loop ───────────────────────────────────────────────
    let raf = 0, last = 0, inView = true, canvasBlank = false;

    function frame(now) {
        raf = requestAnimationFrame(frame);
        const dt = last ? Math.min(64, now - last) : 16;
        last = now;

        p += (pTarget - p) * (1 - Math.exp(-dt / 85));
        if (Math.abs(pTarget - p) < .0002) p = pTarget;

        applyDom();

        // o amanhecer já cobre a tela inteira: não precisa desenhar o céu
        if (p > .88) {
            if (!canvasBlank) {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvasBlank = true;
            }
            return;
        }
        canvasBlank = false;
        draw(now, dt);
    }

    function start() {
        if (raf) return;
        last = 0;
        raf = requestAnimationFrame(frame);
    }

    function stop() {
        cancelAnimationFrame(raf);
        raf = 0;
    }

    // ── intro ──────────────────────────────────────────────
    function splitChars(el) {
        const text = el.textContent.trim();
        el.textContent = '';
        const out = [];
        for (const ch of text) {
            const s = document.createElement('span');
            s.className = 'char';
            s.textContent = ch === ' ' ? ' ' : ch;
            el.appendChild(s);
            out.push(s);
        }
        return out;
    }

    function playIntro(frameLen) {
        const cO = splitChars(lineOrum);
        const cA = splitChars(lineAye);
        if (REDUCED) return;

        framePath.style.strokeDasharray = `${frameLen} ${frameLen}`;
        framePath.style.strokeDashoffset = frameLen;
        gsap.set([...cO, ...cA], { yPercent: 70, opacity: 0, filter: 'blur(12px)' });

        gsap.timeline({ delay: .2 })
            .to(star, { a: 1, duration: 1.8, ease: 'power2.out' }, 0)
            .to(framePath, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut' }, .3)
            .from(dotsGroup.children, { opacity: 0, scale: 0, transformOrigin: '50% 50%', duration: .5, stagger: .07, ease: 'back.out(3)' }, 1.2)
            .from('.portal-ring--names', { opacity: 0, duration: 2.2, ease: 'power1.out' }, .8)
            .from('.portal-ring--inner', { opacity: 0, duration: 1.6 }, 1.1)
            .to(cO, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: .055, ease: 'power3.out' }, 1)
            .to(cA, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: .055, ease: 'power3.out' }, 1.6)
            .from('.portal-lede', { y: 22, opacity: 0, duration: .9, ease: 'power2.out' }, 2.1)
            .from('.portal-actions', { y: 22, opacity: 0, duration: .9, ease: 'power2.out' }, 2.25)
            .from('.portal-scroll-cue-inner', { y: -12, opacity: 0, duration: .8, ease: 'power2.out' }, 2.8);
    }

    // ── "Descer ao Ayê": desce o portal inteiro, devagar ───
    function smoothScrollTo(y, dur) {
        const html = document.documentElement;
        const prev = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';      // o styles.css usa smooth — atrapalharia o rAF
        const y0 = window.scrollY, dy = y - y0, t0 = performance.now();
        let cancelled = false;
        const cancel = () => { cancelled = true; };
        window.addEventListener('wheel', cancel, { once: true, passive: true });
        window.addEventListener('touchstart', cancel, { once: true, passive: true });

        function step(now) {
            if (cancelled) { html.style.scrollBehavior = prev; return; }
            const k = dur > 0 ? clamp((now - t0) / dur) : 1;
            window.scrollTo(0, y0 + dy * easeInOutCubic(k));
            if (k < 1) requestAnimationFrame(step);
            else html.style.scrollBehavior = prev;
        }
        requestAnimationFrame(step);
    }

    if (descendBtn) {
        descendBtn.addEventListener('click', () => {
            // para no topo do hero, descontando o header fixo (não esconde o começo do hero)
            const header = document.querySelector('.header');
            const offset = header ? header.offsetHeight : 0;
            smoothScrollTo(root.offsetTop + root.offsetHeight - offset, REDUCED ? 0 : 3400);
        });
    }

    // ── boot ───────────────────────────────────────────────
    resize();
    const frameLen = buildFrame();
    playIntro(frameLen);
    loadLogo();

    window.addEventListener('resize', resize);

    const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) start(); else stop();
    });
    io.observe(root);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && inView) start(); else stop();
    });

    start();
}

// Inicializar todas as animações quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    // Portal primeiro: é a seção do topo (gatilhos de scroll criados de cima pra baixo)
    initPortal();
    initHeroAnimations();
    // O modelo 3D do hero só começa a carregar perto dele — não disputa com a intro do portal
    whenNear('.hero', initModelCarousel, '150% 0px');
    initInstagramFeed();
    initCarousel();
    initStoryAnimations();
    initAboutAnimations();
    initAboutCardReveal();
    initProcessAnimations();
    initProductsAnimations();
    initContactAnimations();
    initHeaderAnimation();
    initParallax();
    initTitleRevealAnimations();
    initButtonHoverEffects();
    initScrollIndicator();

    // Força recálculo do ScrollTrigger após tudo inicializado.
    // Essencial quando a página carrega em scroll diferente de 0 (F5 no meio da página).
    ScrollTrigger.refresh();

    // Mantém os gatilhos certos quando conteúdo assíncrono muda a altura da página.
    initLayoutRefresh();

});

// Performance: iOS Safari address bar resize loop fix
// ignoreMobileResize impede que o ScrollTrigger recalcule quando a barra
// de endereço do iOS aparece/desaparece ao rolar — sem isso, o layout
// entra em loop infinito de recálculo (causa do "refresh" constante no iPhone).
ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
});

// Como o resize saiu do autoRefresh acima, recalcula os gatilhos quando a
// LARGURA da janela muda (desktop) — o portal e o header dependem das posições.
(() => {
    let lastWidth = window.innerWidth;
    let timer;
    window.addEventListener('resize', () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });
})();






