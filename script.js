// Registrar plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Configurações
const WHATSAPP_NUMBER = '5511999999999'; // SUBSTITUIR com seu número
const FORM_ENDPOINT = ''; // SUBSTITUIR com endpoint do Google Sheets ou FormSubmit

// Animações iniciais do Hero - Desabilitadas para evitar bugs
function initHeroAnimations() {
    // Animações desabilitadas - elementos já estão visíveis no CSS
    return;

    // Efeito de brilho sutil no logo após aparecer
    gsap.to('.hero-logo', {
        filter: 'drop-shadow(0 10px 30px rgba(166, 91, 66, 0.3)) brightness(1.05)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5
    });
}

// Animações dos cards About ao scroll - Simplificadas
function initAboutAnimations() {
    // Animações simplificadas - cards já estão visíveis
    return;

    // Efeito de flutuação contínua nos cards (energia espiritual)
    gsap.utils.toArray('.about-card').forEach((card, index) => {
        gsap.to(card, {
            y: -15,
            duration: 2 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
        });
    });

    // Animação dos ícones com brilho
    gsap.utils.toArray('.card-icon').forEach((icon, index) => {
        gsap.to(icon, {
            scale: 1.1,
            textShadow: '0 0 20px rgba(166, 91, 66, 0.6)',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.5
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

    // Rotação contínua do ícone
    gsap.to('.story-icon', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
    });

    // Animação da imagem da story ao entrar na viewport
    gsap.from('.story-img', {
        scrollTrigger: {
            trigger: '.story-img',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });

    // Flutuação sutil na imagem
    gsap.to('.story-img', {
        y: -10,
        duration: 2.5,
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
    gsap.to('.hero-logo', {
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
                start: 'top 80%',
                toggleActions: 'play none none none', // Não reverter
                once: true // Animar apenas uma vez
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
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

    // Botão de formulário
    const formButton = document.querySelector('.lead-form button');
    formButton.addEventListener('mouseenter', () => {
        gsap.to(formButton, {
            scale: 1.03,
            y: -3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    formButton.addEventListener('mouseleave', () => {
        gsap.to(formButton, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
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

// Formulário de Newsletter (Lead Form)
const leadForm = document.getElementById('leadForm');

leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = leadForm.querySelector('button[type="submit"]');
    const originalHTML = submitButton.innerHTML;

    // Feedback visual
    submitButton.innerHTML = '<span>Enviando...</span>';
    submitButton.disabled = true;

    const formData = new FormData(leadForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        timestamp: new Date().toISOString(),
        source: 'Landing Page Ayê - Newsletter'
    };

    try {
        // INTEGRAÇÃO COM GOOGLE SHEETS OU FORMSUBMIT
        // Opção 1: FormSubmit (mais fácil)
        // Descomentar e substituir SEU_EMAIL:
        /*
        const response = await fetch('https://formsubmit.co/ajax/SEU_EMAIL@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        */

        // Opção 2: Google Sheets Web App
        // Descomentar e substituir FORM_ENDPOINT:
        /*
        const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        */

        // Por enquanto, apenas simula sucesso
        console.log('Lead Newsletter capturado:', data);

        // Animação de sucesso
        gsap.to(leadForm, {
            scale: 0.95,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });

        alert('✨ Obrigado! Você está cadastrado para receber nossas novidades.');
        leadForm.reset();

    } catch (error) {
        console.error('Erro ao enviar:', error);
        alert('❌ Erro ao enviar. Por favor, tente novamente.');
    } finally {
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
    }
});

// Validação de email em tempo real - Newsletter
const leadEmailInput = leadForm.querySelector('input[type="email"]');
leadEmailInput.addEventListener('blur', (e) => {
    const email = e.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (email && !isValid) {
        e.target.style.borderColor = '#e74c3c';
    } else {
        e.target.style.borderColor = '';
    }
});

// Formulário de Contato
const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Feedback visual
    submitButton.innerHTML = '<span>Enviando...</span>';
    submitButton.disabled = true;

    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        source: 'Landing Page Ayê - Formulário de Contato'
    };
    
    try {
        // INTEGRAÇÃO COM GOOGLE SHEETS OU FORMSUBMIT
        // Opção 1: FormSubmit (mais fácil)
        // Descomentar e substituir SEU_EMAIL:
        /*
        const response = await fetch('https://formsubmit.co/ajax/SEU_EMAIL@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        */
        
        // Opção 2: Google Sheets Web App
        // Descomentar e substituir FORM_ENDPOINT:
        /*
        const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        */
        
        // Por enquanto, apenas simula sucesso
        console.log('Lead capturado:', data);
        
        // Animação de sucesso
        gsap.to(form, {
            scale: 0.95,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
        
        alert('✨ Obrigado! Sua mensagem foi enviada com sucesso. Retornaremos em breve!');
        form.reset();
        
    } catch (error) {
        console.error('Erro ao enviar:', error);
        alert('❌ Erro ao enviar. Por favor, tente novamente.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Validação de email em tempo real
const emailInput = form.querySelector('input[type="email"]');
emailInput.addEventListener('blur', (e) => {
    const email = e.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (email && !isValid) {
        e.target.style.outline = '3px solid #e74c3c';
    } else {
        e.target.style.outline = '';
    }
});

// Carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const track = document.querySelector('.carousel-track');
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

// Inicializar todas as animações quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initCarousel();
    initStoryAnimations();
    initAboutAnimations();
    initProcessAnimations();
    initProductsAnimations();
    initBenefitsAnimations();
    initNewsletterAnimations();
    initTestimonialsAnimations();
    initContactAnimations();
    initHeaderAnimation();
    initParallax();
    initTitleRevealAnimations();
    initButtonHoverEffects();
    initScrollIndicator();

    // Log para debug
    console.log('%c🌿 Ayê - Landing Page carregada com GSAP', 'color: #4b6043; font-size: 16px; font-weight: bold;');
    console.log('%c✨ Animações aprimoradas ativas!', 'color: #A65B42; font-size: 14px; font-weight: bold;');
    console.log('%c📧 Dois formulários: Newsletter (simples) + Contato (completo)!', 'color: #4b6043; font-size: 12px;');
    console.log('%c📝 Conteúdo expandido com valores, processo e descrições detalhadas!', 'color: #4b6043; font-size: 12px;');
    console.log('%c⚠️ Lembre-se de configurar WHATSAPP_NUMBER e FORM_ENDPOINT', 'color: #A65B42; font-size: 12px;');
});

// Performance: adicionar animações mais suaves em dispositivos móveis
if (window.innerWidth < 768) {
    ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
    });
}






