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

            // Gère l'historique du navigateur pour les URLs avec ancres
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }

            // Ferme le menu mobile après le clic sur un lien
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navbar = document.querySelector('.navbar');
            const overlay = document.querySelector('.overlay');

            if (navbar && navbar.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navbar.classList.remove('active');
                overlay?.classList.remove('show');

                // Réinitialise les styles d'animation des éléments du menu pour le prochain affichage
                document.querySelectorAll('.navbar ul li').forEach(item => {
                    item.style.opacity = ''; // Supprime les styles inline pour que le CSS prenne le relais
                    item.style.transform = '';
                    item.style.transitionDelay = '';
                });
            }
        });
    });

    // --- Basculement du menu mobile (Mobile menu toggle) ---
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');

    let overlay = document.querySelector('.overlay');
    // Crée l'overlay s'il n'existe pas
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
                // Applique les animations de délai aux éléments de liste du menu
                document.querySelectorAll('.navbar ul li').forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    // Utilisation de setTimeout pour déclencher la transition après un court délai
                    // pour s'assurer que les propriétés initiales sont appliquées avant la transition
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = `all 0.3s ease ${index * 0.1}s`;
                    }, 10);
                });
            } else {
                // Réinitialise les styles d'animation lors de la fermeture
                document.querySelectorAll('.navbar ul li').forEach(item => {
                    item.style.opacity = '';
                    item.style.transform = '';
                    item.style.transition = ''; // Supprime la transition pour éviter des comportements inattendus lors de la fermeture
                });
            }
        });

        // Ferme le menu mobile lorsque l'overlay est cliqué
        overlay.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navbar.classList.remove('active');
            overlay.classList.remove('show');
            // Réinitialise les styles des éléments du menu
            document.querySelectorAll('.navbar ul li').forEach(item => {
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
            });
        });
    }

    // --- Basculement des cartes de service avec icônes ---
    document.querySelectorAll('.service-header').forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.service-card');
            const isActive = card.classList.contains('active');
            const details = card.querySelector('.service-details');
            const arrow = header.querySelector('.service-arrow');

            // Ferme toutes les autres cartes de service
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

            // Bascule l'état de la carte cliquée
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

        const container = gallery.querySelector('.carousel-container'); // Correction du sélecteur
        const slides = gallery.querySelectorAll('.carousel-container img'); // Correction du sélecteur
        const prevBtn = gallery.querySelector('.carousel-prev'); // Correction du sélecteur
        const nextBtn = gallery.querySelector('.carousel-next'); // Correction du sélecteur
        const counter = gallery.querySelector('.slide-counter');

        // Vérifie si tous les éléments nécessaires existent
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
            e.stopPropagation(); // Empêche l'ouverture de la modale lors du clic sur le bouton de navigation
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateGallery();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche l'ouverture de la modale lors du clic sur le bouton de navigation
            currentIndex = (currentIndex + 1) % totalSlides;
            updateGallery();
        });

        updateGallery(); // Affiche la première image au chargement

        // Gestes de balayage pour les mobiles
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
            if (Math.abs(touchEndX - touchStartX) > 50) { // Détection d'un balayage significatif
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

        // Ouvre la modale lors du clic sur le bouton "Voir détails"
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
        // Sélectionne les éléments qui doivent être animés au défilement
        const elementsToAnimate = document.querySelectorAll('.service-card, .project-card, .tech-item, [data-animate]');
        const windowHeight = window.innerHeight;

        elementsToAnimate.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150; // Nombre de pixels avant l'entrée dans la vue

            // Ajoute la classe 'animate' si l'élément est dans la zone visible
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }

    // Initialise les propriétés de transition pour les éléments animés par défilement
    // Ces styles devraient idéalement être dans le CSS pour une meilleure séparation
    // mais sont maintenus ici pour respecter la structure originale.
    document.querySelectorAll('.service-card, .project-card, .tech-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Écouteur d'événement de défilement
    window.addEventListener('scroll', animateOnScroll);
    // Exécute la fonction une fois au chargement pour animer les éléments déjà visibles
    animateOnScroll();

    // --- Validation du formulaire de contact ---
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Empêche l'envoi par défaut du formulaire

            const name = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const message = this.querySelector('textarea[name="message"]').value.trim();

            // Validation simple des champs
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            // Validation du format de l'email
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }

            // Simulation d'envoi de message (remplacez par votre logique d'envoi réelle, ex: EmailJS)
            alert('Message envoyé avec succès! Je vous répondrai dès que possible.');
            this.reset(); // Réinitialise le formulaire
        });
    }

    // --- Données de projet (exemple) ---
    // Cette fonction simule la récupération des données de projet.
    // En production, ces données pourraient venir d'une API ou d'un fichier JSON.
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
                    { src: "assets/img/AccorHotels5.PNG", alt: "Bot RPA AccorHotels - Tableau de bord" },
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

        // Évite de ré-animer le titre si déjà fait
        if (heroTitle.dataset.animated === 'true') return;

        heroTitle.dataset.animated = 'true';
        const text = heroTitle.textContent.trim(); // Nettoie les espaces excessifs
        heroTitle.innerHTML = ''; // Efface l'ancien contenu

        // Crée un span pour chaque caractère pour une animation individuelle
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block'; // Important pour que les styles de transformation s'appliquent
            span.style.animation = `fadeInUp 0.5s forwards ${i * 0.05 + 0.3}s`;
            heroTitle.appendChild(span);
        });
    };

    // --- Animation des boutons CTA ---
    const animateButtons = () => {
        const buttons = document.querySelectorAll('.hero .btn');
        buttons.forEach((btn, i) => {
            // Applique les styles initiaux pour l'animation
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            btn.style.animation = `fadeInUp 0.6s forwards ${i * 0.2 + 0.8}s`;

            // Ajoute des effets au survol pour les boutons
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    };

    // --- Initialisation de EmailJS (si nécessaire) ---
    // Assurez-vous d'avoir la bibliothèque EmailJS chargée dans votre HTML avant main.js
    const initEmailJS = () => {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('YOUR_USER_ID'); // Remplacez par votre ID utilisateur EmailJS
        }
    };

    // --- Animation des cartes de projet avec délais ---
    const animateProjectCards = () => {
        document.querySelectorAll('.project-card').forEach((card, i) => {
            // Utilise une variable CSS custom pour le délai d'animation
            card.style.setProperty('--delay', `${i * 0.1}s`);
            card.style.animation = `fadeInUp 0.5s forwards var(--delay)`;
        });
    };

    // Lancement des fonctions d'animation initiales
    animateHeroTitle();
    animateButtons();
    initEmailJS();
    animateProjectCards();

    // Recalcul des animations lors du redimensionnement de la fenêtre
    // Ceci peut être utile pour réinitialiser ou ajuster certaines animations si la mise en page change drastiquement
    window.addEventListener('resize', () => {
        animateOnScroll();
        // Optionnel : réinitialiser et relancer animateHeroTitle si le titre doit ré-animer
        // Si le titre ne doit animer qu'une fois, cette ligne n'est pas nécessaire
        // const heroTitle = document.querySelector('.hero h1');
        // if (heroTitle) heroTitle.dataset.animated = 'false'; // Pour permettre une ré-animation
        // animateHeroTitle();
        animateProjectCards();
    });
});
