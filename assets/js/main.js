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

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Animate menu items when opening
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

    // Service cards toggle with icons
    document.querySelectorAll('.service-header').forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.service-card');
            const isActive = card.classList.contains('active');
            const details = card.querySelector('.service-details');
            const arrow = header.querySelector('.service-arrow');

            // Close other open service cards
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

            // Toggle current card
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

    // Project image galleries
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
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Show current slide
            slides[currentIndex].classList.add('active');
            counter.textContent = `${currentIndex + 1}/${totalSlides}`;
        }

        // Previous button
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateGallery();
        });

        // Next button
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % totalSlides;
            updateGallery();
        });

        // Initialize
        updateGallery();

        // Touch support for mobile
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
            if (Math.abs(touchEndX - touchStartX) > 50) { // Minimum swipe distance
                if (touchEndX < touchStartX) {
                    // Swipe left - next
                    currentIndex = (currentIndex + 1) % totalSlides;
                } else {
                    // Swipe right - previous
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                }
                updateGallery();
            }
        }
    });

    // Project details modal
    const modal = document.getElementById('project-modal');
    if (modal) {
        const modalClose = modal.querySelector('.modal-close');
        const modalContent = modal.querySelector('#modal-content');

        // Close modal
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Handle project detail clicks
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectCard = btn.closest('.project-card');
                const projectId = projectCard.dataset.projectId;
                
                // Get project data (you would replace this with your actual data)
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

    // Scroll animations
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

    // Initialize elements for animation
    document.querySelectorAll('.service-card, .project-card, .tech-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Contact form validation
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const message = this.querySelector('textarea[name="message"]').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs.');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }
            
            // Here you would typically send the form data to a server
            alert('Message envoyé avec succès! Je vous répondrai dès que possible.');
            this.reset();
        });
    }



    
    // Sample project data - replace with your actual project data
    animateSubtitleTyping();

    // Sample project data (conservé)
    function getProjectData(projectId) {
        const projects = {
            "1": {
                title: "Dashboard Coaching & Ventes",
                description: "Gestion des coachings et tableau de bord de vente optimisé avec Python Streamlit",
                fullDetails: "Ce projet consistait à créer un tableau de bord complet pour analyser les performances de vente et gérer les coachings. J'ai utilisé Power BI pour connecter plusieurs sources de données et créer des mesures DAX complexes, puis j'ai développé une interface interactive avec Python Streamlit pour la gestion des coachings. Les visualisations interactives permettent aux utilisateurs de filtrer et explorer les données selon différents axes, et l'intégration de Python a permis d'ajouter des fonctionnalités de gestion dynamique.",
                technologies: ["Power BI", "DAX", "SQL", "Python", "Streamlit"],
                images: [
                    { src: "assets/img/Dentale_1.PNG", alt: "Dashboard principal" },
                    { src: "assets/img/Dentale_H.PNG", alt: "Dashboard Power BI " },
                    { src: "assets/img/Dentale_12.PNG", alt: "Dashboard Power BI - Python" },
                    { src: "assets/img/Dentale_123.PNG", alt: "Dashboard Python" },
                    { src: "assets/img/Dentale_1234.PNG", alt: "Dashboard Power BI - Python" },
                    { src: "assets/img/Dentale_12345.PNG", alt: "Dashboard Power BI - Python" }
                ]
            },
            "2": {
                title: "Scheduler VBScript & Python",
                description: "Automatisation de tâche quotidienne de planification de ressources à l'aide du VB Script et (Python).",
                fullDetails: "Développement d'un système d'automatisation pour la planification quotidienne des ressources. J'ai utilisé VBScript pour les interactions avec les applications existantes et Python pour des traitements de données plus complexes et la génération de rapports. Ce projet a permis de réduire considérablement le temps passé sur les tâches répétitives de planification et d'assurer une meilleure allocation des ressources.",
                technologies: ["VBScript", "Python", "Automatisation"],
                images: [
                    { src: "assets/img/Planning_VBA_Login.PNG", alt: "Login Planing" },
                    { src: "assets/img/Planning_VBA4.PNG", alt: "Interface Planing" },
                    { src: "assets/img/Planning_VBA.PNG", alt: "Planing" },
                    { src: "assets/img/Planning_VBA1.PNG", alt: "Vision Agent" },
                    { src: "assets/img/Planning_VBA2.PNG", alt: "Vision Manager" },
                    { src: "assets/img/Planning_VBA3.PNG", alt: "Vision Manager" }
                ]
            },
            "3": {
                title: "Management avec Python",
                description: "Automatisation de la récupération des demandes de congés, de la planification et du suivi managérial avec Python.",
                fullDetails: "Mise en place d'une solution complète en Python pour automatiser le cycle de gestion des congés et le suivi managérial. Le script récupère les demandes de congés, les intègre dans un planning, et génère des rapports pour les managers, améliorant ainsi l'efficacité administrative et le suivi des équipes.",
                technologies: ["Python", "Automatisation", "Gestion RH"],
                images: [
                    { src: "assets/img/AccorHotels1.PNG", alt: "Interface de gestion des congés" },
                    { src: "assets/img/AccorHotels2.PNG", alt: "Détail des demandes" },
                    { src: "assets/img/AccorHotels3.PNG", alt: "Planning des équipes" },
                    { src: "assets/img/AccorHotels4.PNG", alt: "Suivi des performances" },
                    { src: "assets/img/AccorHotels5.PNG", alt: "Rapports managériaux" },
                    { src: "assets/img/AccorHotels6.PNG", alt: "Tableau de bord" },
                    { src: "assets/img/AccorHotels7.PNG", alt: "Vue d'ensemble" }
                ]
            },
            "4": {
                title: "Optimisation des évaluations Bouygues Telecom",
                description: "Automatisation du processus de récupération des écoutes et évaluation des performances réseau pour améliorer la qualité de service et optimiser la rentabilité.",
                fullDetails: "Ce projet a visé à automatiser la collecte et l'analyse des données d'écoute et de performance réseau pour Bouygues Telecom. J'ai développé des scripts Python pour récupérer automatiquement les données, puis j'ai mis en place des outils d'analyse pour identifier les problèmes de qualité de service et proposer des améliorations. Le but était d'optimiser la rentabilité en améliorant l'efficacité opérationnelle.",
                technologies: ["Python", "Analyse de données", "Optimisation réseau", "Automatisation"],
                images: [
                    { src: "assets/img/Planning_VBA_Login_Byg.PNG", alt: "Projet Bouygues Telecom - Interface de login" },
                    { src: "assets/img/Byg_4.jpg", alt: "Projet Bouygues Telecom - Dashboard" },
                    { src: "assets/img/Byg_2.jpg", alt: "Projet Bouygues Telecom - Architecture" },
                    { src: "assets/img/Byg_3.jpg", alt: "Projet Bouygues Telecom - Analyse" },
                    { src: "assets/img/Byg_1.jpg", alt: "Projet Bouygues Telecom - Résultats" }
                ]
            },
            "5": {
                title: "Application logistique Glovo",
                description: "Optimisation du suivi des livraisons et amélioration des indicateurs de rentabilité, d'administration financière et RH, en capitalisant sur les ressources existantes.",
                fullDetails: "Création d'une application logistique pour Glovo, axée sur l'optimisation des livraisons et l'amélioration des indicateurs clés. L'application permet un suivi en temps réel des coursiers, l'optimisation des itinéraires, et l'analyse des performances pour maximiser la rentabilité et l'efficacité des ressources humaines et financières. J'ai travaillé sur l'intégration de différentes sources de données et la création d'interfaces utilisateur intuitives.",
                technologies: ["React", "Node.js", "MongoDB", "D3.js", "Logistique", "Analyse de données"],
                images: [
                    { src: "assets/img/Login_Glovo.PNG", alt: "Projet Glovo - Login" },
                    { src: "assets/img/Dash_Sales_Glovo1.PNG", alt: "Projet Glovo - Tableau de bord des ventes" },
                    { src: "assets/img/Glovo1.PNG", alt: "Projet Glovo - Interface principale" },
                    { src: "assets/img/Glovo2.PNG", alt: "Projet Glovo - Suivi des livraisons" },
                    { src: "assets/img/Glovo3.PNG", alt: "Projet Glovo - Statistiques" }
                ]
            },
            "6": {
                title: "Dashbord Vente & Recolt",
                description: "Optimisation du suivi des ventes et amélioration des indicateurs de rentabilité, d'administration financière et RH, en capitalisant sur les ressources existantes.",
                fullDetails: "Création d'une application logistique pour Total, axée sur l'optimisation des livraisons et l'amélioration des indicateurs clés. L'application permet un suivi en temps réel des coursiers, l'optimisation des itinéraires, et l'analyse des performances pour maximiser la rentabilité et l'efficacité des ressources humaines et financières. J'ai travaillé sur l'intégration de différentes sources de données et la création d'interfaces utilisateur intuitives.",
                technologies: ["React", "Node.js", "MongoDB", "D3.js", "Logistique", "Analyse de données"],
                images: [
                    { src: "assets/img/Total_Bi_1.JPG", alt: "Projet Glovo - Login" },
                    { src: "assets/img/Total_Bi_2.JPG", alt: "Projet Glovo - Login" }
                ]
            }
        };
        
        return projects[projectId] || null;
    }
});
// 2. Animation du titre héro améliorée
document.addEventListener('DOMContentLoaded', () => {
    const animateHeroTitleTyping = () => {
        const heroTitle = document.querySelector('.hero h1');
        if (!heroTitle) return;

        const originalText = heroTitle.textContent;
        heroTitle.textContent = ''; // Vider le titre initialement

        let charIndex = 0;
        const typingSpeed = 70; // Vitesse de frappe en ms par caractère

        function typeChar() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            }
        }
        typeChar(); // Démarrer l'animation
    };

    // Assurez-vous que cette fonction est appelée pour démarrer l'animation
    animateHeroTitleTyping();

    // Gardez vos autres fonctions d'animation (boutons, scroll, etc.) si vous en avez besoin
    // animateButtons();
    // animateOnScroll();
    // animateProjectCards();
});

///////////////////////////////




document.addEventListener('DOMContentLoaded', () => {
    const text = "Spécialiste en analyse de données, développement et automatisation de processus";
    const element = document.getElementById('typewriter-text');
    element.innerHTML = ''; // Efface le contenu initial
    let i = 0;
    const speed = 50; // Vitesse en ms

    function typeWriter() {
        if (i < text.length) {
            const charSpan = document.createElement('span');
            charSpan.className = 'typewriter-char';
            charSpan.textContent = text.charAt(i);
            element.appendChild(charSpan);
            
            // Effet spécial sur le dernier caractère
            if (i > 0) {
                element.children[i-1].classList.remove('typewriter-char');
            }
            
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // Supprime l'effet neon quand terminé
            Array.from(element.children).forEach(el => el.classList.remove('typewriter-char'));
        }
    }

    // Délai avant démarrage
    setTimeout(typeWriter, 1000);
});
