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

// Animações do Hero — intro de entrada
function initHeroAnimations() {
    const pageLoadedScrolled = window.scrollY > 100;
    const chars = splitHeroPhrase();

    if (pageLoadedScrolled) {
        gsap.set(['.eyebrow-bar', '.eyebrow-text', '.hero-brand', '.hero-buttons'], { clearProps: 'all' });
        if (chars.length) gsap.set(chars, { opacity: 1 });
    } else {
        const intro = gsap.timeline({ delay: 0.3 });
        intro
            .from('.eyebrow-bar', {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.6,
                ease: 'power3.out'
            })
            .from('.eyebrow-text', { x: -20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
            .from('.hero-brand',   { x: -25, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');

        if (chars.length) {
            gsap.set(chars, { y: -18, opacity: 0 });
            intro.to(chars, {
                y: 0,
                opacity: 1,
                duration: 0.35,
                stagger: 0.018,
                ease: 'power2.out'
            }, '-=0.1');
        }

        intro.from('.hero-buttons', { y: 15, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');

        const rings = document.querySelectorAll('.hero-3d-ring, .hero-3d-glow');
        if (rings.length) {
            gsap.from(rings, {
                scale: 0.3,
                opacity: 0,
                duration: 1.4,
                ease: 'power2.out',
                stagger: 0.2,
                delay: 0.4
            });
        }
    }
}

// Animações dos cards About ao scroll - Simplificadas
function initAboutAnimations() {
    // Animações simplificadas - cards já estão visíveis
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
            trigger: '.story-img',
            start: 'top 85%',
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

// Animação do header ao scroll - Aprimorada
function initHeaderAnimation() {
    gsap.to('.header', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '+=100',
            scrub: true
        },
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(242, 231, 218, 0.98)',
        ease: 'none'
    });

    // Animação do logo no header ao scroll
    gsap.to('.logo', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '+=100',
            scrub: true
        },
        scale: 0.9,
        ease: 'none'
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
        // Animação simples e suave sem split text
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 88%',
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

    // Esconde o overlay de loading quando o modelo termina de carregar
    function setupLoadingOverlay(slide) {
        const mv = slide.querySelector('model-viewer');
        const overlay = slide.querySelector('.model-loading-overlay');
        if (!mv || !overlay) return;
        mv.addEventListener('load', () => {
            overlay.classList.add('hidden');
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

// Inicializar todas as animações quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initModelCarousel();
    initInstagramFeed();
    initCarousel();
    initStoryAnimations();
    initAboutAnimations();
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

});

// Performance: iOS Safari address bar resize loop fix
// ignoreMobileResize impede que o ScrollTrigger recalcule quando a barra
// de endereço do iOS aparece/desaparece ao rolar — sem isso, o layout
// entra em loop infinito de recálculo (causa do "refresh" constante no iPhone).
ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
});






