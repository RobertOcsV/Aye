# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ayê** is a landing page for a Brazilian business specializing in 3D-printed religious products for Umbanda (an Afro-Brazilian religion). The name "Ayê" means "world" or "earth" in Yoruba, representing the mission to bring elements from Orum (spiritual world) to Ayê (material world).

This is a static website built with vanilla HTML, CSS, and JavaScript, enhanced with GSAP (GreenSock Animation Platform) for sophisticated scroll-based animations and interactive effects.

## Technology Stack

- **HTML5**: Single-page structure with semantic sections
- **CSS3**: Custom properties (CSS variables), Grid, Flexbox, animations
- **JavaScript (ES6+)**: Vanilla JS for interactions and form handling
- **GSAP 3.12.5**: Professional animation library with ScrollTrigger plugin
- **CDN Dependencies**: GSAP loaded from cdnjs.cloudflare.com

## File Structure

```
Aye/
├── index.html          # Main HTML structure (single page, ~263 lines)
├── script.js           # All JavaScript logic and animations (~868 lines)
├── styles.css          # All styling and responsive design (~934 lines)
└── Img/                # Image assets (logos)
    ├── logo-colorido-sem-fundo.png
    ├── Ayê-Logo-Principal-horizontal-sem-fundo.png
    └── logo-principal-sem-fundo-branco.png
```

## Color Scheme

The design uses a spiritual, earthy palette defined in CSS custom properties:

```css
--terracota: #A65B42   /* Terracotta/rust - accent color */
--marrom: #41322A      /* Dark brown - primary text */
--verde: #4b6043       /* Green - secondary color */
--creme: #F2E7DA       /* Cream - background */
```

## Key Architecture Patterns

### 1. Animation System (GSAP-based)

The site uses a modular animation initialization system. Each major section has its own animation function:

- `initHeroAnimations()` - Hero section reveal with staggered text appearance
- `initStoryAnimations()` - Story section with parallax icon rotation
- `initAboutAnimations()` - Cards with floating effect and icon glow
- `initProcessAnimations()` - Step-by-step process reveal with number animations
- `initProductsAnimations()` - Product cards with entrance and hover effects
- `initBenefitsAnimations()` - Benefits list with slide-in effects
- `initNewsletterAnimations()` - Newsletter form animations
- `initTestimonialsAnimations()` - Testimonial cards with float effect
- `initContactAnimations()` - Contact form reveal animations
- `initHeaderAnimation()` - Sticky header with scroll-based styling
- `initParallax()` - Parallax effects on hero logo and backgrounds
- `initTitleRevealAnimations()` - Character-by-character title reveals
- `initButtonHoverEffects()` - Interactive button hover states
- `initScrollIndicator()` - Animated scroll indicator at bottom of hero

All animations are initialized on `DOMContentLoaded` event.

### 2. ScrollTrigger Integration

GSAP's ScrollTrigger plugin is used extensively for scroll-based animations:

- Most animations trigger at `start: 'top 70%'` (when element enters viewport)
- `toggleActions: 'play none none reverse'` pattern for clean entrance/exit
- Parallax effects use `scrub: true` for smooth scroll-linked animations
- Optimized for mobile with reduced `autoRefreshEvents`

### 3. Form Handling

Two forms exist with identical submission patterns:

**Newsletter Form** (`#leadForm`): Simple name + email capture
**Contact Form** (`#contactForm`): Full contact form with name, email, phone, subject, message

Both forms:
- Prevent default submission
- Show "Enviando..." loading state
- Collect data with timestamp and source tracking
- Currently log to console (integration points commented out)
- Support FormSubmit.co or Google Sheets Web App integration
- Include real-time email validation on blur
- Reset form after successful submission

### 4. Call-to-Action System

Three main CTAs throughout the page:
- **WhatsApp button** (`.cta-whatsapp`): Opens WhatsApp with pre-filled message
- **"Receber Novidades" button** (`.scroll-to-form`): Smooth scrolls to contact form
- **Header "Contato" button** (`.nav-cta`): Smooth scrolls to contact form

## Configuration Required

Before deployment, update these values in `script.js`:

```javascript
const WHATSAPP_NUMBER = '5511999999999'; // Line 5 - Replace with actual WhatsApp number
const FORM_ENDPOINT = '';                 // Line 6 - Add Google Sheets or FormSubmit endpoint
```

### Form Integration Options

**Option 1: FormSubmit.co** (easiest)
- Uncomment lines 683-692 (newsletter) and 771-780 (contact)
- Replace `SEU_EMAIL@gmail.com` with your email

**Option 2: Google Sheets Web App**
- Uncomment lines 695-705 (newsletter) and 783-793 (contact)
- Set `FORM_ENDPOINT` to your Google Apps Script Web App URL

## Development Workflow

### Running Locally

This is a static site - simply open `index.html` in a browser, or use a local server:

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js http-server
npx http-server

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

### Making Changes

**Modifying Content**: Edit `index.html` directly (all content is inline)

**Styling Updates**: Edit `styles.css`
- Use existing CSS custom properties for colors
- Responsive breakpoints: 968px and 600px
- All animations use `will-change` for performance

**Animation Adjustments**: Edit animation functions in `script.js`
- Duration, easing, and stagger values are configurable
- ScrollTrigger `start/end` values control trigger points
- Use GSAP DevTools for debugging: `gsap.registerPlugin(GSAPDevTools)`

### Performance Considerations

- Images should be optimized (WebP format recommended)
- GSAP animations use hardware acceleration (`transform`, `opacity`)
- Mobile devices have simplified animations (line 857-861)
- `will-change` property pre-applied to animated elements

## Section Structure

The landing page follows this flow:

1. **Hero** - Main value proposition with logo and CTA buttons
2. **Story** - Brand story and values (two-column layout)
3. **About** - Three cards explaining tradition, technology, personalization
4. **Process** - Four-step creation process
5. **Products** - Six product categories with descriptions
6. **Benefits** - Four benefit cards with detailed explanations
7. **Testimonials** - Three customer testimonials
8. **Newsletter** - Email capture form (simple)
9. **Contact** - Full contact form
10. **Footer** - Logo and copyright

## Responsive Design

- Desktop-first approach
- Two main breakpoints:
  - **968px**: Switch to single-column layouts
  - **600px**: Compact header, hide scroll indicator
- Grid layouts automatically adapt with `grid-template-columns: repeat(auto-fit, minmax(...))`

## Git Information

- **Current branch**: pbase
- **Recent changes**: Modified index.html, script.js, styles.css (uncommitted)
- **Last commit**: "inital commit" (99b75bc)

## Common Pitfalls

1. **GSAP not loading**: Ensure CDN links in `index.html` are accessible
2. **Animations not triggering**: Check ScrollTrigger registration (line 2 in script.js)
3. **Forms not submitting**: Remember to configure `WHATSAPP_NUMBER` and `FORM_ENDPOINT`
4. **Image paths**: Paths are case-sensitive (`Img/` directory)
5. **Mobile performance**: Test animations on actual devices, not just responsive mode

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge) - last 2 versions
- GSAP requires ES6 support
- Uses CSS Grid and Custom Properties (no IE11 support)

## Language & Content

All content is in **Brazilian Portuguese (pt-BR)**.

When editing content:
- Maintain the spiritual/respectful tone regarding Umbanda
- Keep the balance between tradition and technology themes
- Preserve cultural terminology (Orixás, terreiros, axé, etc.)
