document.addEventListener('DOMContentLoaded', function () {
    // --- Défilement fluide (Smooth scrolling) ---
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

            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navbar = document.querySelector('.navbar');
            const overlay = document.querySelector('.overlay');

            if (navbar && navbar.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navbar.classList.remove('active');
                overlay?.classList.remove('show');

                document.querySelectorAll('.navbar ul li').forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    item.style.transitionDelay = '0s';
                });
            }
        });
    });

    // --- Basculement du menu mobile (Mobile menu toggle) ---
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');

    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }

    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            overlay.classList.toggle('show');

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

        overlay.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navbar.classList.remove('active');
            overlay.classList.remove('show');
        });
    }

    // --- Basculement des cartes de service avec icônes ---
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

    // --- Galeries d'images de projet ---
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
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            slides[currentIndex].classList.add('active');
            counter.textContent = `${currentIndex + 1}/${totalSlides}`;
        }

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateGallery();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % totalSlides;
            updateGallery();
        });

        updateGallery();

        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            if (Math.abs(touchEndX - touchStartX) > 50) {
                if (touchEndX < touchStartX) {
                    currentIndex = (currentIndex + 1) % totalSlides;
                } else {
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                }
                updateGallery();
            }
        }
    });

    // --- Modale de détails de projet (Project details modal) ---
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalClose = modal.querySelector('.modal-close');
        const modalContent = modal.querySelector('#modal-content');

        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectCard = btn.closest('.project-card');
                const projectId = projectCard.dataset.projectId;

                const projectData = getProjectData(projectId);

                if (projectData) {
                    modalContent.innerHTML = `
                        <h3>${projectData.title}</h3>
                        <div class="modal-gallery">
                            ${projectData.images.map(img =>
                                `<img src="${img.src}" alt="${img.alt}">`
                            ).join('')}
                        </div>
                        <div class="modal-description">
                            <p>${projectData.description}</p>
                        </div>
                        <div class="modal-full-details">
                            <h4>Détails du projet</h4>
                            <p>${projectData.fullDetails || 'Plus de détails seront disponibles bientôt.'}</p>
                            ${projectData.technologies ? `
                            <div class="modal-technologies">
                                <h4>Technologies utilisées</h4>
                                <ul>
                                    ${projectData.technologies.map(tech => `<li>${tech}</li>`).join('')}
                                </ul>
                            </div>
                            ` : ''}
                        </div>
                    `;
                    modal.style.display = 'block';
                }
            });
        });
    }

    // --- Animations au défilement (Scroll animations) ---
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .project-card, .tech-item');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    document.querySelectorAll('.service-card, .project-card, .tech-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // --- Validation du formulaire de contact ---
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
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

    // --- Données de projet (exemple) ---
    function getProjectData(projectId) {
        const projects = {
            "1": {
                title: "Dashboard de ventes",
                description: "Visualisation interactive des performances commerciales avec Power BI.",
                fullDetails: "Ce projet consistait à créer un tableau de bord complet pour analyser les performances de vente. J'ai utilisé Power BI pour connecter plusieurs sources de données, créer des mesures DAX complexes et développer des visualisations interactives qui permettent aux utilisateurs de filtrer et explorer les données selon différents axes.",
                technologies: ["Power BI", "DAX", "SQL", "Python"],
                images: [
                    { src: "assets/img/Dentale_1.PNG", alt: "Dashboard principal" },
                    { src: "assets/img/Dentale_H.PNG", alt: "Dashboard principal" },
                    { src: "assets/img/Dentale_12.PNG", alt: "Dashboard principal" },
                    { src: "assets/img/Dentale_123.PNG", alt: "Dashboard principal" },
                    { src: "assets/img/Dentale_1234.PNG", alt: "Dashboard principal" },
                    { src: "assets/img/Dentale_12345.PNG", alt: "Dashboard principal" }
                ]
            },
            "2": {
                title: "Scheduler Manager (Bot de collecte de données)",
                description: "Automatisation de la récupération de données via Selenium (Python) et gestion des plannings via VBA.",
                fullDetails: "Développement d'un robot RPA pour automatiser la collecte quotidienne de données sur plusieurs sites web. Le bot navigue de manière autonome, remplit des formulaires, extrait des données structurées et les enregistre dans une base de données SQL. Une interface de monitoring permet de suivre l'exécution des tâches. Ce projet inclut également un système de gestion de plannings développé avec VBA.",
                technologies: ["Python", "Selenium", "SQL", "Pandas", "VBA", "Excel"],
                images: [
                    { src: "assets/img/Planning_VBA_Login.PNG", alt: "Scheduler Manager - Connexion" },
                    { src: "assets/img/Planning_VBA.PNG", alt: "Scheduler Manager - Planning" },
                    { src: "assets/img/Planning_VBA1.PNG", alt: "Scheduler Manager - Code VBA" },
                    { src: "assets/img/Planning_VBA2.PNG", alt: "Scheduler Manager - Vue Agent" },
                    { src: "assets/img/Planning_VBA4.PNG", alt: "Scheduler Manager - Vue Manager" },
                    { src: "assets/img/Planning_VBA3.PNG", alt: "Scheduler Manager - Vue Manager Détaillée" }
                ]
            },
            "3": {
                title: "Bot de collecte de données (AccorHotels)",
                description: "Automatisation de la récupération de données via Selenium (Python) pour AccorHotels.",
                fullDetails: "Développement d'un robot RPA spécifique pour automatiser la collecte quotidienne de données sur les plateformes d'AccorHotels. Le bot navigue de manière autonome, gère les sessions, extrait des données structurées importantes pour l'analyse, et les enregistre dans une base de données optimisée. L'objectif était de fournir des données à jour pour le reporting et la prise de décision.",
                technologies: ["Python", "Selenium", "SQL", "BeautifulSoup"],
                images: [
                    { src: "assets/img/AccorHotels1.PNG", alt: "Bot RPA AccorHotels - Interface" },
                    { src: "assets/img/AccorHotels2.PNG", alt: "Bot RPA AccorHotels - Données extraites" },
                    { src: "assets/img/AccorHotels3.PNG", alt: "Bot RPA AccorHotels - Processus" },
                    { src: "assets/img/AccorHotels4.PNG", alt: "Bot RPA AccorHotels - Rapports" },
                    { src: "assets:img/AccorHotels5.PNG", alt: "Bot RPA AccorHotels - Tableau de bord" },
                    { src: "assets/img/AccorHotels6.PNG", alt: "Bot RPA AccorHotels - Graphe" },
                    { src: "assets/img/AccorHotels7.PNG", alt: "Bot RPA AccorHotels - Détails" }
                ]
            },
            "4": {
                title: "Optimisation réseau Bouygues Telecom",
                description: "Analyse des performances réseau et recommandations pour l'amélioration de la qualité de service afin d'améliorer la qualité et la rentabilité.",
                fullDetails: "Projet complexe d'analyse des données réseau pour identifier les points faibles de couverture et proposer des solutions d'optimisation. J'ai développé des algorithmes de clustering pour catégoriser les zones problématiques et créé des visualisations géographiques interactives pour présenter les résultats. L'objectif était d'optimiser l'allocation des ressources et d'améliorer l'expérience utilisateur.",
                technologies: ["Python", "GeoPandas", "Tableau", "Spark", "PostGIS"],
                images: [
                    { src: "assets/img/Planning_VBA_Login_Byg.PNG", alt: "Projet Bouygues Telecom - Dashboard d'analyse" },
                    { src: "assets/img/Byg_4.jpg", alt: "Projet Bouygues Telecom - Dashboard d'analyse" },
                    { src: "assets/img/Byg_2.jpg", alt: "Projet Bouygues Telecom - Architecture de données" },
                    { src: "assets/img/Byg_3.jpg", alt: "Projet Bouygues Telecom - Cartographie d'analyse" },
                    { src: "assets/img/Byg_1.jpg", alt: "Projet Bouygues Telecom - Résultat de l'optimisation" }
                ]
            },
            "5": {
                title: "Application logistique Glovo",
                description: "Optimisation du suivi des livraisons et amélioration des statistiques d'activité de rentabilité et d'administration financière et humaine en capitalisant les ressources.",
                fullDetails: "Développement d'une application interne robuste pour optimiser la logistique des livraisons de Glovo. L'outil permet de suivre en temps réel les performances des livreurs, d'optimiser les tournées en fonction de la demande, et de générer des rapports analytiques détaillés. Ces rapports couvrent les statistiques d'activité, la rentabilité par zone, et l'administration des ressources humaines, permettant une capitalisation efficace des ressources.",
                technologies: ["React", "Node.js", "MongoDB", "D3.js", "Express.js", "AWS"],
                images: [
                    { src: "assets/img/Login_Glovo.PNG", alt: "Projet Glovo - Page de Connexion" },
                    { src: "assets/img/Dash_Sales_Glovo1.PNG", alt: "Projet Glovo - Tableau de Bord des Ventes" },
                    { src: "assets/img/Glovo1.PNG", alt: "Projet Glovo - Interface de Gestion" },
                    { src: "assets/img/Glovo2.PNG", alt: "Projet Glovo - Suivi des Livraisons" },
                    { src: "assets/img/Glovo3.PNG", alt: "Projet Glovo - Rapports Statistiques" }
                ]
            }
        };
        return projects[projectId] || null;
    }

    // --- Animation du titre héro améliorée ---
    const animateHeroTitle = () => {
        const heroTitle = document.querySelector('.hero h1');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.innerHTML = ''; // Reset pour animation

        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.display = 'inline-block';
            span.style.animation = `fadeInUp 0.5s forwards ${i * 0.05 + 0.3}s`;
            heroTitle.appendChild(span);
        });
    };

    // --- Animation des boutons CTA ---
    const animateButtons = () => {
        const buttons = document.querySelectorAll('.hero .btn');
        buttons.forEach((btn, i) => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            btn.style.animation = `fadeInUp 0.6s forwards ${i * 0.2 + 0.8}s`;

            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    };

    // --- Initialisation de EmailJS (si nécessaire) ---
    const initEmailJS = () => {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('YOUR_USER_ID'); // Remplacez par votre ID
        }
    };

    // --- Animation des cartes de projet avec délais ---
    const animateProjectCards = () => {
        document.querySelectorAll('.project-card').forEach((card, i) => {
            card.style.setProperty('--delay', `${i * 0.1}s`);
            card.style.animation = `fadeInUp 0.5s forwards var(--delay)`;
        });
    };

    // Lancement des fonctions d'animation initiales
    animateHeroTitle();
    animateButtons();
    initEmailJS();
    animateProjectCards();

    // Recalcul des animations lors du redimensionnement
    window.addEventListener('resize', () => {
        animateOnScroll();
        animateProjectCards();
    });
});
