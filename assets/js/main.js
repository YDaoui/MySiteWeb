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
  





    document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalContentDiv = document.getElementById('modal-content');

    // Fonction pour récupérer les données du projet (celle que tu as ajustée)
    function getProjectData(projectId) {
        // ... (ton code getProjectData ajusté ici)
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
                description: "Optimisation du suivi des livraisons et amélioration des indicateurs de rentabilité, d’administration financière et RH, en capitalisant sur les ressources existantes.",
                fullDetails: "Création d'une application logistique pour Glovo, axée sur l'optimisation des livraisons et l'amélioration des indicateurs clés. L'application permet un suivi en temps réel des coursiers, l'optimisation des itinéraires, et l'analyse des performances pour maximiser la rentabilité et l'efficacité des ressources humaines et financières. J'ai travaillé sur l'intégration de différentes sources de données et la création d'interfaces utilisateur intuitives.",
                technologies: ["React", "Node.js", "MongoDB", "D3.js", "Logistique", "Analyse de données"],
                images: [
                    { src: "assets/img/Login_Glovo.PNG", alt: "Projet Glovo - Login" },
                    { src: "assets/img/Dash_Sales_Glovo1.PNG", alt: "Projet Glovo - Tableau de bord des ventes" },
                    { src: "assets/img/Glovo1.PNG", alt: "Projet Glovo - Interface principale" },
                    { src: "assets/img/Glovo2.PNG", alt: "Projet Glovo - Suivi des livraisons" },
                    { src: "assets/img/Glovo3.PNG", alt: "Projet Glovo - Statistiques" }
                ]
            }
        };
        return projects[projectId];
    }

    projectCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.view-details');
        viewDetailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = card.dataset.projectId;
            const project = getProjectData(projectId);

            if (project) {
                modalContentDiv.innerHTML = `
                    <h3>${project.title}</h3>
                    <p><strong>Description:</strong> ${project.description}</p>
                    <p>${project.fullDetails}</p>
                    <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
                    <h4>Images du projet:</h4>
                    <div class="project-modal-gallery"></div>
                `;

                const projectModalGallery = modalContentDiv.querySelector('.project-modal-gallery');
                project.images.forEach(image => {
                    const imgElement = document.createElement('img');
                    imgElement.src = image.src;
                    imgElement.alt = image.alt;
                    imgElement.classList.add('modal-thumbnail'); // Ajoute une classe pour styliser
                    projectModalGallery.appendChild(imgElement);

                    // Ajoute l'écouteur de clic pour agrandir l'image
                    imgElement.addEventListener('click', () => {
                        const largeImageModal = document.createElement('div');
                        largeImageModal.classList.add('large-image-modal');
                        largeImageModal.innerHTML = `
                            <span class="large-image-close">&times;</span>
                            <img src="${image.src}" alt="${image.alt}">
                        `;
                        document.body.appendChild(largeImageModal);

                        largeImageModal.querySelector('.large-image-close').addEventListener('click', () => {
                            document.body.removeChild(largeImageModal);
                        });

                        largeImageModal.addEventListener('click', (e) => {
                            if (e.target === largeImageModal) {
                                document.body.removeChild(largeImageModal);
                            }
                        });
                    });
                });

                projectModal.style.display = 'block';
            }
        });
    });

    modalClose.addEventListener('click', () => {
        projectModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
        }
    });
});
// 2. Animation du titre héro améliorée
const animateHeroTitle = () => {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.innerHTML = ''; // Reset pour animation
    
    // On traite chaque caractère en gardant les espaces intacts
    let isLastCharSpace = false;
    
    text.split('').forEach((char, i) => {
        // Si c'est un espace, on l'ajoute directement sans animation
        if (char === ' ') {
            heroTitle.appendChild(document.createTextNode(' '));
            isLastCharSpace = true;
            return;
        }
        
        const span = document.createElement('span');
        span.textContent = char;
        
        // Style pour l'animation
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.display = 'inline-block';
        
        // On ajuste le délai pour compenser les espaces sautés
        const adjustedIndex = isLastCharSpace ? i - 1 : i;
        span.style.animation = `fadeInUp 0.5s forwards ${adjustedIndex * 0.05 + 0.3}s`;
        
        heroTitle.appendChild(span);
        isLastCharSpace = false;
    });
};
