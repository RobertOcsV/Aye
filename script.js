// Registrar plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Configurações
const WHATSAPP_NUMBER = '5511999999999'; // SUBSTITUIR com seu número
const FORM_ENDPOINT = ''; // SUBSTITUIR com endpoint do Google Sheets ou FormSubmit

// Animações iniciais do Hero
function initHeroAnimations() {
    const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    tl.to('.hero-content', {
        opacity: 1,
        duration: 0.3
    })
    .from('.hero-title-line', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    })
    .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, '-=0.4')
    .to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, '-=0.4')
    .to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, '-=0.4')
    .to('.hero-image', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)'
    }, '-=0.8');
}

// Animações dos cards About ao scroll
function initAboutAnimations() {
    gsap.from('.about-card', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
}

// Animações dos produtos ao scroll
function initProductsAnimations() {
    gsap.from('.product-card', {
        scrollTrigger: {
            trigger: '.products',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });
}

// Animação do formulário ao scroll
function initContactAnimations() {
    gsap.from('.lead-form', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
}

// Animação do header ao scroll
function initHeaderAnimation() {
    gsap.to('.header', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '+=100',
            scrub: true
        },
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
        ease: 'none'
    });
}

// Parallax suave no hero
function initParallax() {
    gsap.to('.hero-logo', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        scale: 0.8,
        opacity: 0.5,
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

// Formulário
const form = document.getElementById('leadForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Feedback visual
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        timestamp: new Date().toISOString(),
        source: 'Landing Page Ayê'
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
        
        alert('✨ Obrigado! Você receberá nossas novidades em breve.');
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

// Inicializar todas as animações quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initAboutAnimations();
    initProductsAnimations();
    initContactAnimations();
    initHeaderAnimation();
    initParallax();
    
    // Log para debug
    console.log('%c🌿 Ayê - Landing Page carregada com GSAP', 'color: #4b6043; font-size: 16px; font-weight: bold;');
    console.log('%c⚠️ Lembre-se de configurar WHATSAPP_NUMBER e FORM_ENDPOINT', 'color: #A65B42; font-size: 12px;');
});

// Performance: adicionar animações mais suaves em dispositivos móveis
if (window.innerWidth < 768) {
    ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
    });
}