document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation
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
        });
    });

    // Project filtering - Correction pour un meilleur fonctionnement
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Reset all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // Activate clicked button
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            
            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const match = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
                if (match) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.visibility = 'visible';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                        card.style.visibility = 'hidden';
                    }, 300);
                }
            });
        });
    });

    // Service cards toggle - Nouvelle implémentation plus robuste
    const serviceHeaders = document.querySelectorAll('.service-header');
    serviceHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.service-card');
            const isActive = card.classList.contains('active');
            
            // Fermer toutes les autres cartes
            document.querySelectorAll('.service-card').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('active');
                }
            });
            
            // Basculer l'état de la carte actuelle
            card.classList.toggle('active', !isActive);
            
            // Animation du chevron
            const arrow = header.querySelector('.service-arrow');
            if (arrow) {
                arrow.style.transform = card.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
            }
        });
    });

    // Project image carousel - Nouvelle implémentation
    document.querySelectorAll('.project-card').forEach(card => {
        const imagesContainer = card.querySelector('.project-images-container');
        const images = card.querySelectorAll('.project-image');
        const prevBtn = card.querySelector('.project-nav.prev');
        const nextBtn = card.querySelector('.project-nav.next');
        
        if (!imagesContainer || !images.length || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        const totalImages = images.length;
        
        const updateCarousel = () => {
            imagesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        };
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateCarousel();
        });
        
        // Initialisation
        imagesContainer.style.width = `${totalImages * 100}%`;
        images.forEach(img => {
            img.style.width = `${100 / totalImages}%`;
        });
        updateCarousel();
    });

    // Scroll animations (conservé tel quel)
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .project-card, .tech-item, .contact-item, .form-group');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const animationTrigger = windowHeight * 0.85;

            if (elementTop < animationTrigger) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });

        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.classList.toggle('visible', window.pageYOffset > 300);
        }
    };

    // Initial styles (conservé tel quel)
    document.querySelectorAll('.service-card, .project-card, .tech-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
    });

    document.querySelectorAll('.contact-item').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-20px)';
        el.style.transition = `all 0.5s ease ${index * 0.1}s`;
    });

    document.querySelectorAll('.form-group').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(20px)';
        el.style.transition = `all 0.5s ease ${index * 0.1}s`;
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Le reste du code original est conservé inchangé...
    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Contact form validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();

            if (!name || !email || !message) {
                showAlert('Veuillez remplir tous les champs du formulaire.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showAlert('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            showAlert('Message envoyé avec succès! Je vous répondrai dès que possible.', 'success');
            this.reset();
        });
    }

    function showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.textContent = message;
        document.body.appendChild(alertBox);

        setTimeout(() => alertBox.classList.add('show'), 10);
        setTimeout(() => {
            alertBox.classList.remove('show');
            setTimeout(() => alertBox.remove(), 500);
        }, 5000);
    }

    // Floating animation
    document.querySelectorAll('.floating').forEach(el => {
        el.style.animationDelay = `${Math.random() * 2}s`;
    });

    // IntersectionObserver for data-animate
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));

    // GSAP ScrollTrigger Animation
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const navLinks = document.querySelectorAll('.navbar ul li a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, { y: -3, duration: 0.3, ease: "power2.out" });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, { y: 0, duration: 0.3, ease: "power2.out" });
            });

            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                const targetElement = document.querySelector(href);
                if (!targetElement) return;

                e.preventDefault();
                gsap.to(this, {
                    y: 3,
                    duration: 0.1,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(this, { y: 0, duration: 0.3 });
                        const offset = document.querySelector('.header').offsetHeight;
                        window.scrollTo({
                            top: targetElement.offsetTop - offset,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });
    }

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            navbar.classList.toggle('open');
        });
    }

    // Close menu on nav link click (mobile)
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) navbar.classList.remove('active', 'open');
        });
    });
});

// Toggle service details - Fonction conservée pour compatibilité
function toggleServiceDetails(id) {
    const detail = document.getElementById(id);
    if (detail) {
        detail.classList.toggle('active');
        const arrow = detail.querySelector('.service-arrow');
        if (arrow) {
            arrow.style.transform = detail.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
        }
    }
}
// Gestion des carrousels de projets
function initProjectCarousels() {
    document.querySelectorAll('.project-gallery').forEach(gallery => {
        const container = gallery.querySelector('.gallery-container');
        const slides = gallery.querySelectorAll('.gallery-slide');
        const prevBtn = gallery.querySelector('.gallery-prev');
        const nextBtn = gallery.querySelector('.gallery-next');
        const counter = gallery.querySelector('.slide-counter');
        
        if (!slides.length) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        const updateCarousel = () => {
            container.style.transform = `translateX(-${currentIndex * 100}%)`;
            counter.textContent = `${currentIndex + 1}/${totalSlides}`;
            
            // Mise à jour des classes active
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentIndex);
            });
        };
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
            });
            
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            });
        }
        
        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                // Swipe left
                currentIndex = (currentIndex + 1) % totalSlides;
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            }
            updateCarousel();
        };
        
        // Initialize
        updateCarousel();
    });
}

// Gestion de la modal des détails
function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.querySelector('.modal-close');
    const detailBtns = document.querySelectorAll('.view-details');
    
    // Données des projets (pourrait aussi être chargé via AJAX)
    const projectsData = {
        1: {
            title: "Dashboard de ventes",
            description: "Visualisation interactive des performances commerciales avec Power BI.",
            fullDescription: "<p>Ce projet consistait à créer un tableau de bord interactif pour suivre les performances commerciales d'une entreprise dentaire.</p><p><strong>Technologies utilisées :</strong> Power BI, Python (pour le traitement des données), SQL</p><p><strong>Fonctionnalités :</strong></p><ul><li>Visualisation des ventes par région</li><li>Suivi des objectifs mensuels</li><li>Analyse des tendances saisonnières</li></ul>",
            images: [
                "assets/img/Dentale_Capture_screen_siteweb.jpg",
                "assets/img/Dentale_detail1.jpg"
            ]
        },
        2: {
            title: "Bot de collecte de données",
            description: "Automatisation de la récupération de données via Selenium (Python).",
            fullDescription: "<p>Développement d'un bot RPA pour automatiser la collecte de données sur différents sites web.</p><p><strong>Technologies utilisées :</strong> Python, Selenium, Pandas</p><p><strong>Fonctionnalités :</strong></p><ul><li>Navigation automatique sur les sites cibles</li><li>Extraction et structuration des données</li><li>Génération de rapports quotidiens</li></ul><p>Ce bot a permis de réduire le temps de collecte de données de 8 heures à 30 minutes par jour.</p>",
            images: [
                "assets/img/project2.jpg",
                "assets/img/project2_detail1.jpg",
                "assets/img/project2_detail2.jpg"
            ]
        },
        3: {
            title: "Optimisation réseau Bouygues Telecom",
            description: "Analyse des performances réseau et recommandations pour l'amélioration de la qualité de service.",
            fullDescription: "<p>Projet d'analyse et d'optimisation du réseau mobile pour Bouygues Telecom.</p><p><strong>Technologies utilisées :</strong> Python, Tableau, outils de monitoring réseau</p><p><strong>Résultats :</strong></p><ul><li>Identification des zones de couverture faible</li><li>Proposition de repositionnement d'antennes</li><li>Amélioration de 15% de la qualité de service dans les zones cibles</li></ul><p>Ce projet a permis de réduire significativement le nombre de réclamations clients.</p>",
            images: [
                "assets/img/Byg_1.jpg",
                "assets/img/Byg_2.jpg",
                "assets/img/Byg_3.jpg",
                "assets/img/Byg_4.jpg"
            ]
        }
    };
    
    // Ouvrir la modal
    detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            const project = projectsData[projectId];
            
            if (project) {
                modalContent.innerHTML = `
                    <div class="project-details">
                        <div class="project-details-gallery">
                            ${project.images.map(img => `<img src="${img}" alt="${project.title}">`).join('')}
                        </div>
                        <div class="project-details-content">
                            <h3>${project.title}</h3>
                            ${project.fullDescription}
                            <div class="project-technologies">
                                <h4>Compétences associées :</h4>
                                <div class="tech-tags">
                                    <span class="tech-tag">Data Analysis</span>
                                    <span class="tech-tag">Visualisation</span>
                                    <span class="tech-tag">Optimisation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                modal.style.display = "block";
                document.body.style.overflow = "hidden";
            }
        });
    });
    
    // Fermer la modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    });
    
    // Fermer en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initProjectCarousels();
    initProjectModals();
});
