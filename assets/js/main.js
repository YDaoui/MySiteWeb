document.addEventListener('DOMContentLoaded', function () {
    // --- Défilement fluide (Smooth scrolling) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !document.querySelector(targetId)) return; // Vérifie si l'ID cible est valide

            e.preventDefault(); // Empêche le comportement de défilement par défaut du navigateur
            const targetElement = document.querySelector(targetId);
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0; // Obtient la hauteur de l'en-tête s'il existe
            const targetPosition = targetElement.offsetTop - headerHeight; // Calcule la position de défilement

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth' // Défilement doux
            });

            // Met à jour l'URL sans recharger la page
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }

            // Ferme le menu mobile après avoir cliqué sur un lien
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navbar = document.querySelector('.navbar');
            const overlay = document.querySelector('.overlay');

            if (navbar && navbar.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navbar.classList.remove('active');
                overlay?.classList.remove('show'); // Utilisation de l'opérateur de chaînage optionnel (?) pour la sécurité

                // Réinitialise l'état des éléments de la barre de navigation
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

    // Crée et ajoute l'élément d'overlay s'il n'existe pas déjà
    let overlay = document.querySelector('.overlay');
    if (!overlay) { // Vérifie si l'overlay n'a pas déjà été créé
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
                // Anime les éléments du menu lors de l'ouverture
                document.querySelectorAll('.navbar ul li').forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    // Utilisation de setTimeout pour un léger délai avant d'appliquer l'animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = `all 0.3s ease ${index * 0.1}s`;
                    }, 10);
                });
            }
        });

        // Ferme le menu si l'overlay est cliqué
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

            // Ferme les autres cartes de service ouvertes
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

            // Bascule la carte actuelle
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
            e.stopPropagation(); // Empêche l'événement de se propager aux éléments parents
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateGallery();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche l'événement de se propager aux éléments parents
            currentIndex = (currentIndex + 1) % totalSlides;
            updateGallery();
        });

        updateGallery(); // Initialise la galerie

        // Support tactile pour mobile
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true }); // 'passive: true' pour améliorer les performances de défilement

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            if (Math.abs(touchEndX - touchStartX) > 50) { // Distance de balayage minimale
                if (touchEndX < touchStartX) {
                    currentIndex = (currentIndex + 1) % totalSlides; // Balayage vers la gauche - suivant
                } else {
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Balayage vers la droite - précédent
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

                const projectData = getProjectData(projectId); // Récupère les données du projet

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
            const elementVisible = 150; // Distance à laquelle l'élément doit être visible pour s'animer

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animated'); // Ajoute la classe 'animated' (qui doit être définie en CSS)
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialise les éléments pour l'animation en les cachant initialement
    document.querySelectorAll('.service-card, .project-card, .tech-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécute une fois au chargement pour animer les éléments déjà visibles

    // --- Validation du formulaire de contact ---
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Empêche l'envoi par défaut du formulaire

            const name = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const message = this.querySelector('textarea[name="message"]').value.trim();

            // Validation simple
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }

            // Ici, vous enverriez normalement les données du formulaire à un serveur
            // Exemple : via fetch() ou XMLHttpRequest
            alert('Message envoyé avec succès! Je vous répondrai dès que possible.');
            this.reset(); // Réinitialise le formulaire
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
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation au scroll améliorée
    const animateOnScroll = () => {
        document.querySelectorAll('[data-animate]').forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.75) && 
                            (rect.bottom >= window.innerHeight * 0.25);
            
            if (isVisible) {
                el.classList.add('animate');
                // Ajout d'un délai basé sur la position pour un effet en cascade
                const delay = Math.min(0.3, rect.top / window.innerHeight * 0.3);
                el.style.transitionDelay = `${delay}s`;
            }
        });
    };

    // 2. Animation du titre héro améliorée
    const animateHeroTitle = () => {
        const heroTitle = document.querySelector('.hero h1');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.innerHTML = ''; // Reset pour animation
        
        // Création des spans pour chaque caractère avec des délais progressifs
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

    // 3. Animation des boutons CTA
    const animateButtons = () => {
        const buttons = document.querySelectorAll('.hero .btn');
        buttons.forEach((btn, i) => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            btn.style.animation = `fadeInUp 0.6s forwards ${i * 0.2 + 0.8}s`;
            
            // Effet au survol amélioré
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    };

    // 4. Initialisation de EmailJS (si nécessaire)
    const initEmailJS = () => {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('YOUR_USER_ID'); // Remplacez par votre ID
        }
    };

    // 5. Animation des cartes de projet avec délais
   document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.innerHTML = ''; // On vide le titre

    // Création du conteneur d'animation
    const typingContainer = document.createElement('div');
    typingContainer.className = 'typing-container';
    
    // Ajout du texte qui sera animé
    const typingText = document.createElement('div');
    typingText.className = 'typing-text';
    typingText.style.color = 'white'; // Couleur lisible pendant l'animation
    
    // Ajout du curseur
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    
    typingContainer.appendChild(typingText);
    typingContainer.appendChild(cursor);
    heroTitle.appendChild(typingContainer);

    // Animation d'écriture
    let i = 0;
    const speed = 100; // Vitesse d'écriture (ms)
    
    const typeWriter = () => {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // Animation terminée - on applique le style final
            cursor.remove();
            heroTitle.classList.add('final-style');
            
            // On remplace par le texte complet pour une meilleure accessibilité
            heroTitle.innerHTML = text;
            heroTitle.classList.add('final-style');
        }
    };

    // Lancement de l'animation avec un léger délai
    setTimeout(typeWriter, 500);
});


