document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation (unchanged)
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

            // Close mobile menu after clicking a link
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navbar = document.querySelector('.navbar');
            if (navbar && navbar.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navbar.classList.remove('active');
                document.querySelectorAll('.navbar ul li').forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    item.style.transitionDelay = '0s';
                });
            }
        });
    });

    // Mobile menu toggle (unchanged)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            if (navbar.classList.contains('active')) {
                document.querySelectorAll('.navbar ul li').forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = `all 0.3s ease ${index * 0.1}s`;
                    }, 10);
                });
            }
        });
    }

    // Service cards toggle (unchanged)
    document.querySelectorAll('.service-header').forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.service-card');
            const isActive = card.classList.contains('active');
            const details = card.querySelector('.service-details');
            const arrow = header.querySelector('.service-arrow');

            document.querySelectorAll('.service-card').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('active');
                    const otherDetails = otherCard.querySelector('.service-details');
                    const otherArrow = otherCard.querySelector('.service-header .service-arrow');
                    if (otherDetails) otherDetails.style.maxHeight = null;
                    if (otherArrow) {
                        otherArrow.classList.remove('active');
                        otherArrow.innerHTML = '<ion-icon name="chevron-down-outline"></ion-icon>';
                    }
                }
            });

            card.classList.toggle('active', !isActive);
            if (details) {
                details.style.maxHeight = !isActive ? details.scrollHeight + 'px' : null;
            }
            if (arrow) {
                arrow.classList.toggle('active', !isActive);
                arrow.innerHTML = !isActive 
                    ? '<ion-icon name="chevron-up-outline"></ion-icon>' 
                    : '<ion-icon name="chevron-down-outline"></ion-icon>';
            }
        });
    });

    // Improved Project image galleries with unified behavior
    document.querySelectorAll('.project-card').forEach(card => {
        const gallery = card.querySelector('.project-gallery');
        if (!gallery) return;

        const container = gallery.querySelector('.gallery-container');
        const slides = gallery.querySelectorAll('.gallery-slide');
        const prevBtn = gallery.querySelector('.project-nav.prev');
        const nextBtn = gallery.querySelector('.project-nav.next');
        const counter = gallery.querySelector('.slide-counter');
        
        if (!container || !slides.length || !prevBtn || !nextBtn || !counter) return;

        let currentIndex = 0;
        const totalSlides = slides.length;

        function updateGallery() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentIndex);
                slide.style.opacity = index === currentIndex ? '1' : '0';
                slide.style.transform = index === currentIndex ? 'translateX(0)' : 
                                      (index < currentIndex ? 'translateX(-100%)' : 'translateX(100%)');
                slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
            
            counter.textContent = `${currentIndex + 1}/${totalSlides}`;
            
            // Update button states
            prevBtn.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
            nextBtn.style.visibility = currentIndex === totalSlides - 1 ? 'hidden' : 'visible';
        }

        // Navigation buttons
        [prevBtn, nextBtn].forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = btn === prevBtn 
                    ? (currentIndex - 1 + totalSlides) % totalSlides 
                    : (currentIndex + 1) % totalSlides;
                updateGallery();
            });
        });

        // Touch support
        let touchStartX = 0;
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > 50) {
                if (diff < 0 && currentIndex < totalSlides - 1) {
                    // Swipe left - next
                    currentIndex++;
                } else if (diff > 0 && currentIndex > 0) {
                    // Swipe right - previous
                    currentIndex--;
                }
                updateGallery();
            }
        }, { passive: true });

        // Initialize
        updateGallery();
    });

    // Unified Project Modal System
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalClose = modal.querySelector('.modal-close');
        const modalContent = modal.querySelector('#modal-content');

        const closeModal = () => {
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        };

        const openModal = (content) => {
            modalContent.innerHTML = content;
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
            
            // Initialize modal gallery if exists
            const modalGallery = modalContent.querySelector('.modal-gallery');
            if (modalGallery) {
                initModalGallery(modalGallery);
            }
        };

        modalClose.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => e.target === modal && closeModal());

        // Initialize modal gallery navigation
        function initModalGallery(gallery) {
            const images = gallery.querySelectorAll('img');
            if (images.length <= 1) return;

            let currentImgIndex = 0;
            const totalImages = images.length;
            
            images.forEach((img, index) => {
                img.style.display = index === 0 ? 'block' : 'none';
            });
            
            // Add navigation buttons if not exists
            if (!gallery.querySelector('.modal-nav')) {
                gallery.innerHTML += `
                    <div class="modal-nav">
                        <button class="modal-prev">‹</button>
                        <span class="modal-counter">1/${totalImages}</span>
                        <button class="modal-next">›</button>
                    </div>
                `;
                
                const prevBtn = gallery.querySelector('.modal-prev');
                const nextBtn = gallery.querySelector('.modal-next');
                const counter = gallery.querySelector('.modal-counter');
                
                const updateModalGallery = () => {
                    images.forEach((img, index) => {
                        img.style.display = index === currentImgIndex ? 'block' : 'none';
                    });
                    counter.textContent = `${currentImgIndex + 1}/${totalImages}`;
                };
                
                prevBtn.addEventListener('click', () => {
                    currentImgIndex = (currentImgIndex - 1 + totalImages) % totalImages;
                    updateModalGallery();
                });
                
                nextBtn.addEventListener('click', () => {
                    currentImgIndex = (currentImgIndex + 1) % totalImages;
                    updateModalGallery();
                });
            }
        }

        // Handle project detail clicks
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectCard = btn.closest('.project-card');
                const projectId = projectCard.dataset.projectId;
                const projectData = getProjectData(projectId);
                
                if (projectData) {
                    const imagesHTML = projectData.images.map(img => 
                        `<img src="${img.src}" alt="${img.alt}">`
                    ).join('');
                    
                    const technologiesHTML = projectData.technologies ? `
                        <div class="modal-technologies">
                            <h4>Technologies utilisées</h4>
                            <ul>
                                ${projectData.technologies.map(tech => `<li>${tech}</li>`).join('')}
                            </ul>
                        </div>
                    ` : '';
                    
                    const content = `
                        <div class="modal-header">
                            <h3>${projectData.title}</h3>
                        </div>
                        <div class="modal-body">
                            <div class="modal-gallery">
                                ${imagesHTML}
                            </div>
                            <div class="modal-content-text">
                                <div class="modal-description">
                                    <p>${projectData.description}</p>
                                </div>
                                <div class="modal-full-details">
                                    <h4>Détails du projet</h4>
                                    <p>${projectData.fullDetails || 'Plus de détails seront disponibles bientôt.'}</p>
                                    ${technologiesHTML}
                                </div>
                            </div>
                        </div>
                    `;
                    
                    openModal(content);
                }
            });
        });
    }

    // Scroll animations with unified timing
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .project-card, .tech-item');
        const windowHeight = window.innerHeight;
        const scrollOffset = 100;

        elements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - scrollOffset) {
                element.style.transitionDelay = `${index * 0.1}s`;
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize elements for animation
    document.querySelectorAll('.service-card, .project-card, .tech-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Contact form validation (unchanged)
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const message = this.querySelector('textarea[name="message"]').value.trim();
            
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs.');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }
            
            alert('Message envoyé avec succès! Je vous répondrai dès que possible.');
            this.reset();
        });
    }

    // Updated Project Data with consistent structure
    function getProjectData(projectId) {
        const projects = {
            "1": {
                title: "Dashboard de ventes",
                description: "Visualisation interactive des performances commerciales avec Power BI.",
                fullDetails: "Ce projet consistait à créer un tableau de bord complet pour analyser les performances de vente. J'ai utilisé Power BI pour connecter plusieurs sources de données, créer des mesures DAX complexes et développer des visualisations interactives qui permettent aux utilisateurs de filtrer et explorer les données selon différents axes.",
                technologies: ["Power BI", "DAX", "SQL", "Python", "Data Modeling"],
                images: [
                    { src: "assets/img/Dentale_Capture_screen_siteweb.jpg", alt: "Dashboard Power BI et Python" },
                    { src: "assets/img/Dentale_Capture_screen_siteweb1.jpg", alt: "Dashboard Power BI" },
                    { src: "assets/img/Dentale_Capture_screen_siteweb12.jpg", alt: "Dashboard Python" },
                    { src: "assets/img/Dentale_Capture_screen_siteweb13.jpg", alt: "Dashboard Power BI - Python" }
                ]
            },
            "2": {
                title: "Bot de collecte de données",
                description: "Automatisation de tâche quotidienne à l'aide du VB Script et la récupération de données via Selenium (Python).",
                fullDetails: "Développement d'une solution complète d'automatisation comprenant un script VBScript pour l'interaction avec les applications Windows et un composant Python/Selenium pour la collecte web. Le système permet une récupération automatisée des données avec validation et correction des erreurs, puis un stockage structuré dans une base de données SQL Server.",
                technologies: ["VBScript", "Python", "Selenium", "SQL Server", "Automation"],
                images: [
                    { src: "assets/img/Planning_VBA.PNG", alt: "Interface principale" },
                    { src: "assets/img/Planning_VBA4.PNG", alt: "Code VBScript" },
                    { src: "assets/img/Planning_VBA1.PNG", alt: "Vision Agent" },
                    { src: "assets/img/Planning_VBA2.PNG", alt: "Vision Manager" },
                    { src: "assets/img/Planning_VBA3.PNG", alt: "Export des résultats" }
                ]
            },
            "3": {
                title: "Bot RPA de collecte de données",
                description: "Automatisation de la récupération de données via Selenium (Python).",
                fullDetails: "Conception et implémentation d'un robot RPA complet utilisant Selenium avec Python pour naviguer sur des sites web complexes, extraire des données dynamiques et les structurer dans des rapports automatisés. Le système inclut une gestion des erreurs, un mécanisme de reprise et une intégration avec des API tierces.",
                technologies: ["Python", "Selenium", "Pandas", "BeautifulSoup", "RPA"],
                images: [
                    { src: "assets/img/project2.jpg", alt: "Architecture du bot" },
                    { src: "assets/img/project2_detail1.jpg", alt: "Code Python" },
                    { src: "assets/img/project2_detail2.jpg", alt: "Résultats exportés" }
                ]
            },
            "4": {
                title: "Optimisation réseau Bouygues Telecom",
                description: "Analyse des performances réseau et recommandations pour l'amélioration de la qualité de service.",
                fullDetails: "Projet d'analyse avancée des données réseau pour identifier les zones problématiques et proposer des solutions d'optimisation. J'ai développé des algorithmes de traitement du signal et de clustering pour catégoriser les types de problèmes, ainsi que des dashboards interactifs pour visualiser les résultats sur des cartes géographiques.",
                technologies: ["Python", "GeoPandas", "Tableau", "Spark", "Data Analysis"],
                images: [
                    { src: "assets/img/Byg_1.jpg", alt: "Dashboard principal" },
                    { src: "assets/img/Byg_2.jpg", alt: "Architecture technique" },
                    { src: "assets/img/Byg_3.jpg", alt: "Analyse des données" },
                    { src: "assets/img/Byg_4.jpg", alt: "Résultats d'optimisation" }
                ]
            },
            "5": {
                title: "Application logistique Glovo",
                description: "Optimisation du suivi des livraisons et amélioration des statistiques d'activité.",
                fullDetails: "Développement d'une application web complète pour la gestion logistique des livraisons. L'outil permet un suivi en temps réel des livreurs, une optimisation dynamique des tournées, et génère des analyses avancées sur la performance opérationnelle et financière. L'application a permis une réduction de 15% des coûts logistiques.",
                technologies: ["React", "Node.js", "MongoDB", "D3.js", "Express"],
                images: [
                    { src: "assets/img/Glovo1.PNG", alt: "Interface principale" },
                    { src: "assets/img/Glovo2.PNG", alt: "Gestion des livraisons" },
                    { src: "assets/img/Glovo3.PNG", alt: "Tableau de bord analytique" }
                ]
            }
        };
        
        return projects[projectId] || null;
    }
});
