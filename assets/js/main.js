document.addEventListener('DOMContentLoaded', function () {
    // --- Smooth scrolling ---
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

    // --- Mobile menu toggle ---
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');

    // Create and append the overlay element
    let overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

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

        // Close menu if overlay is clicked
        overlay.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navbar.classList.remove('active');
            overlay.classList.remove('show');
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
                title: "Bot de collecte de données",
                description: "Automatisation de la récupération de données via Selenium (Python).",
                fullDetails: "Développement d'un robot RPA pour automatiser la collecte quotidienne de données sur plusieurs sites web. Le bot navigue de manière autonome, remplit des formulaires, extrait des données structurées et les enregistre dans une base de données SQL. Une interface de monitoring permet de suivre l'exécution des tâches.",
                technologies: ["Python", "Selenium", "SQL", "Pandas"],
                images: [
		    { src: "assets/img/Planning_VBA_Login.PNG", alt: "Sheduler Manager" },
                    { src: "assets/img/Planning_VBA.PNG", alt: "Planing" },
                    { src: "assets/img/Planning_VBA1.PNG", alt: "Code Planning" },
                    { src: "assets/img/Planning_VBA2.PNG", alt: "Vision Agent" },
		    {src: "assets/img/Planning_VBA4.PNG", alt: "Vision Manager" },
                    { src: "assets/img/Planning_VBA3.PNG", alt: "Vision Manager" }
                ]
            },
            "3": {
                title: "Bot de collecte de données",
                description: "Automatisation de la récupération de données via Selenium (Python).",
                fullDetails: "Développement d'un robot RPA pour automatiser la collecte quotidienne de données sur plusieurs sites web. Le bot navigue de manière autonome, remplit des formulaires, extrait des données structurées et les enregistre dans une base de données SQL. Une interface de monitoring permet de suivre l'exécution des tâches.",
                technologies: ["Python", "Selenium", "SQL", "Pandas"],
                images: [
                    { src: "assets/img/AccorHotels1.PNG", alt: "Bot RPA" },
                     { src: "assets/img/AccorHotels2.PNG", alt: "Bot RPA" },
			 { src: "assets/img/AccorHotels3.PNG", alt: "Bot RPA" },
			 { src: "assets/img/AccorHotels4.PNG", alt: "Bot RPA" },
			 { src: "assets/img/AccorHotels5.PNG", alt: "Bot RPA" },
			 { src: "assets/img/AccorHotels6.PNG", alt: "Bot RPA" },
			 { src: "assets/img/AccorHotels7.PNG", alt: "Bot RPA" }
			
                ]
            },
            "4": {
                title: "Optimisation réseau Bouygues Telecom",
                description: "Analyse des performances réseau et recommandations pour l'amélioration de la qualité de service afin d'améliorer la qualité et la rentabilité.",
                fullDetails: "Projet complexe d'analyse des données réseau pour identifier les points faibles de couverture et proposer des solutions d'optimisation. J'ai développé des algorithmes de clustering pour catégoriser les zones problématiques et créé des visualisations géographiques interactives pour présenter les résultats.",
                technologies: ["Python", "GeoPandas", "Tableau", "Spark"],
                images: [
                    { src: "assets/img/Byg_4.jpg", alt: "Projet Bouygues Telecom - Dashboard" },
                    { src: "assets/img/Byg_2.jpg", alt: "Projet Bouygues Telecom - Architecture" },
                    { src: "assets/img/Byg_3.jpg", alt: "Projet Bouygues Telecom - Analyse" },
                    { src: "assets/img/Byg_1.jpg", alt: "Résultats" }
                ]
            },
            "5": {
                title: "Application logistique Glovo",
                description: "Optimisation du suivi des livraisons et amélioration des statistiques d'activité de rentabilité et d'administration financiére et humaine en capitalisant les ressources.",
                fullDetails: "Développement d'une application interne pour optimiser la logistique des livraisons. L'outil permet de suivre en temps réel les performances des livreurs, d'optimiser les tournées et de générer des rapports analytiques pour identifier les opportunités d'amélioration.",
                technologies: ["React", "Node.js", "MongoDB", "D3.js"],
                images: [

			
		    { src: "assets/img/Login_Glovo.PNG", alt: "Projet Glovo - Interface" },
		    { src: "assets/img/Dash_Sales_Glovo1.PNG", alt: "Projet Glovo - Interface" },
                    { src: "assets/img/Glovo1.PNG", alt: "Projet Glovo - Interface" },
                    { src: "assets/img/Glovo2.PNG", alt: "Projet Glovo - Livraison" },
                    { src: "assets/img/Glovo3.PNG", alt: "Projet Glovo - Statistiques" }
                ]
            }
        };
        
        return projects[projectId] || null;
    }
});
// Initialisation d'EmailJS
(function() {
    emailjs.init('YOUR_USER_ID'); // Remplacez par votre vrai User ID
})();















// Animation au scroll
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du scroll
    const animateOnScroll = () => {
        document.querySelectorAll('[data-animate]').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('animate');
            }
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Animation du titre
    const animateTitle = () => {
        const title = document.getElementById('animated-title');
        const text = title.textContent;
        title.textContent = '';
        
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${i * 0.1}s`;
            title.appendChild(span);
        });
        
        title.setAttribute('data-text', text);
    };

    animateTitle();

    // Animation des projets
    document.querySelectorAll('.project-card').forEach((card, i) => {
        card.style.setProperty('--order', i);
    });
});
