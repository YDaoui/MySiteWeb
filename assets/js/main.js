document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des carrousels de projets
    initProjectCarousels();
    // Initialisation des modales de projets
    initProjectModals();

    // Smooth scrolling pour la navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !document.querySelector(targetId)) return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }

            // Fermer le menu mobile après avoir cliqué sur un lien
            const navbar = document.querySelector('.navbar');
            if (navbar && navbar.classList.contains('active')) {
                navbar.classList.remove('active', 'open');
            }
        });
    });

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const match = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
                card.style.display = match ? 'block' : 'none';
            });
        });
    });

    // Service cards toggle
    const serviceHeaders = document.querySelectorAll('.service-header');
    serviceHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.service-card');
            card.classList.toggle('active');
            const arrow = header.querySelector('.service-arrow');
            if (arrow) {
                arrow.style.transform = card.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
            }
        });
    });

    // Scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .project-card, .tech-item, .contact form > *, footer');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animated');
            }
        });

        const header = document.querySelector('.header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > header.offsetHeight / 2);
        }
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }

    // Close menu on nav link click (mobile)
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            if (navbar && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
            }
        });
    });

    // Technologies scroll buttons
    const techScrollContainer = document.querySelector('.tech-scroll-container');
    const techLeftBtn = document.querySelector('.left-scroll-btn');
    const techRightBtn = document.querySelector('.right-scroll-btn');

    if (techScrollContainer && techLeftBtn && techRightBtn) {
        const scrollAmount = 300;

        techLeftBtn.addEventListener('click', () => {
            techScrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        techRightBtn.addEventListener('click', () => {
            techScrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        const updateButtonVisibility = () => {
            techLeftBtn.style.display = techScrollContainer.scrollLeft > 0 ? 'flex' : 'none';
            techRightBtn.style.display =
                techScrollContainer.scrollLeft < (techScrollContainer.scrollWidth - techScrollContainer.clientWidth)
                    ? 'flex' : 'none';
        };

        techScrollContainer.addEventListener('scroll', updateButtonVisibility);
        updateButtonVisibility(); // Initial check
    }
});

// Carousel pour les projets
function initProjectCarousels() {
    document.querySelectorAll('.project-gallery').forEach(gallery => {
        const container = gallery.querySelector('.gallery-container');
        const slides = gallery.querySelectorAll('.gallery-slide');
        const prevBtn = gallery.querySelector('.project-nav.prev');
        const nextBtn = gallery.querySelector('.project-nav.next');

        if (!container || !slides.length || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const totalSlides = slides.length;

        const updateCarousel = () => {
            container.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Mise à jour de la classe active pour les indicateurs si vous en avez
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentIndex);
            });
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });

        // Initialisation
        updateCarousel();
    });
}

// Gestion de la modal des projets
function initProjectModals() {
    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.modal-close');
    const projectCards = document.querySelectorAll('.project-card');

    if (!modal || !modalContent || !closeBtn) return;

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.project-info h3').textContent;
            const description = card.querySelector('.project-info p').textContent;
            const tags = Array.from(card.querySelectorAll('.project-tag')).map(tag => tag.textContent);
            // Vous devrez peut-être extraire plus d'informations de la carte ou avoir un système de données plus complexe

            modalContent.innerHTML = `
                <h3>${title}</h3>
                <p>${description}</p>
                ${tags.length > 0 ? `<div class="project-tags">${tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}</div>` : ''}
                <p>Plus de détails sur le projet ici...</p>
                `;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}
