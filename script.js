// Load portfolio data from localStorage
let portfolioData = null;

function loadPortfolioData() {
    const stored = localStorage.getItem('portfolioData');
    if (stored) {
        portfolioData = JSON.parse(stored);
        updatePageContent();
    }
}

function updatePageContent() {
    if (!portfolioData) return;

    // Update hero section
    const heroTitle = document.querySelector('.hero-title .line:first-child');
    const gradientText = document.querySelector('.gradient-text');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroTitle) heroTitle.textContent = `Привет, я ${portfolioData.personal.name}`;
    if (gradientText) {
        gradientText.textContent = portfolioData.personal.position;
        // Re-apply typing effect
        const text = gradientText.textContent;
        gradientText.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                gradientText.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        }
        setTimeout(type, 800);
    }
    if (heroSubtitle) heroSubtitle.textContent = portfolioData.personal.heroSubtitle;

    // Update about section
    const aboutLead = document.querySelector('.about-text .lead');
    const aboutParagraphs = document.querySelectorAll('.about-text p:not(.lead)');
    
    if (aboutLead) aboutLead.textContent = portfolioData.personal.aboutText1;
    if (aboutParagraphs[0]) aboutParagraphs[0].textContent = portfolioData.personal.aboutText2;

    // Update stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statLabels = document.querySelectorAll('.stat-label');
    
    if (statNumbers[0]) statNumbers[0].dataset.target = portfolioData.stats.projectsCount;
    if (statNumbers[1]) statNumbers[1].dataset.target = portfolioData.stats.experienceYears;
    if (statNumbers[2]) statNumbers[2].dataset.target = portfolioData.stats.stat3Value;
    if (statLabels[2]) statLabels[2].textContent = portfolioData.stats.stat3Label;

    // Update skills
    updateSkills();

    // Update projects
    updateProjects();

    // Update contacts
    updateContacts();

    // Update colors
    updateColors();
}

function updateSkills() {
    const skillsContainer = document.querySelector('.skills .container');
    if (!skillsContainer || !portfolioData.skills.length) return;

    // Group skills by category
    const grouped = portfolioData.skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    const html = `
        <h2 class="section-title">Технологии</h2>
        <div class="skills-categories">
            ${Object.entries(grouped).map(([category, skills]) => `
                <div class="skill-category">
                    <h3 class="category-title">${category}</h3>
                    <div class="skills-grid">
                        ${skills.map(skill => `
                            <div class="skill-card">
                                <div class="skill-icon">${skill.icon}</div>
                                <h4>${skill.name}</h4>
                                <div class="skill-progress">
                                    <div class="progress-bar" data-progress="${skill.progress}"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    skillsContainer.innerHTML = html;

    // Re-observe skill cards
    document.querySelectorAll('.skill-card').forEach(el => observer.observe(el));
    document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));
}

function updateProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || !portfolioData.projects.length) return;

    projectsGrid.innerHTML = portfolioData.projects.map(project => `
        <div class="project-card">
            <div class="project-image project-gradient-${project.gradient}">
                <div class="project-overlay">
                    <a href="${project.url}" class="project-link" target="_blank" rel="noopener">Посмотреть</a>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // Re-observe project cards
    document.querySelectorAll('.project-card').forEach(el => observer.observe(el));
}

function updateContacts() {
    const contactMethods = document.querySelector('.contact-methods');
    if (!contactMethods) return;

    const contacts = [
        { icon: '📧', text: portfolioData.contacts.email, href: `mailto:${portfolioData.contacts.email}` },
        { icon: '💻', text: portfolioData.contacts.github.replace('https://', ''), href: portfolioData.contacts.github },
        { icon: '✈️', text: portfolioData.contacts.telegram, href: `https://t.me/${portfolioData.contacts.telegram.replace('@', '')}` }
    ];

    if (portfolioData.contacts.linkedin) {
        contacts.push({
            icon: '💼',
            text: portfolioData.contacts.linkedin.replace('https://', ''),
            href: portfolioData.contacts.linkedin
        });
    }

    contactMethods.innerHTML = contacts.map(contact => `
        <a href="${contact.href}" class="contact-item" ${contact.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
            <span class="contact-icon">${contact.icon}</span>
            <span>${contact.text}</span>
        </a>
    `).join('');
}

function updateColors() {
    if (!portfolioData.colors) return;

    const root = document.documentElement;
    root.style.setProperty('--accent-1', portfolioData.colors.accent1);
    root.style.setProperty('--accent-2', portfolioData.colors.accent2);
    root.style.setProperty('--accent-3', portfolioData.colors.accent3);
}

// Load data on page load
loadPortfolioData();

// Particles Animation
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(179, 133, 133, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(179, 133, 133, ${0.2 * (1 - distance / 100)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    init();
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.progress-bar');
                if (progressBar) {
                    const progress = progressBar.dataset.progress;
                    progressBar.style.setProperty('--progress', `${progress}%`);
                }
            }
            
            // Animate counters
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements
const observeElements = [
    '.section-title',
    '.about-text',
    '.about-image',
    '.skill-card',
    '.skill-category',
    '.project-card',
    '.contact-info',
    '.contact-form'
];

observeElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
    });
});

// Observe stat numbers separately for counter animation
document.querySelectorAll('.stat-number').forEach(el => {
    observer.observe(el);
});

// Counter Animation
function animateCounter(element) {
    if (element.classList.contains('animated')) return;
    element.classList.add('animated');
    
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Add parallax effect to hero section (only on desktop)
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const hero = document.querySelector('.hero-content');
        if (hero) {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            
            hero.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
}

// Form submission
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = form.querySelector('.btn');
        const originalText = button.textContent;
        
        button.textContent = '✓ Отправлено!';
        button.style.background = 'linear-gradient(135deg, #b38585, #d4a5a5)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            form.reset();
        }, 3000);
    });
}

// Add typing effect to hero title
const heroTitle = document.querySelector('.hero-title .gradient-text');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';

    let charIndex = 0;
    function typeWriter() {
        if (charIndex < text.length) {
            heroTitle.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    }

    setTimeout(typeWriter, 800);
}

// Add cursor effect for active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add floating animation to skill icons on hover
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.skill-icon');
        if (icon) {
            icon.style.animation = 'float 2s ease-in-out infinite';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.skill-icon');
        if (icon) {
            icon.style.animation = '';
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            pointer-events: none;
            animation: ripple-animation 0.6s ease-out;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add tilt effect to project cards (only on desktop)
if (window.innerWidth > 768) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Performance optimization: Lazy load images if you add them
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!e.target.closest('.nav-container')) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

console.log('%c✨ Портфолио Ильи загружено! ✨', 'color: #b38585; font-size: 20px; font-weight: bold;');