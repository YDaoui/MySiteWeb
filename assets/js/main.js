document.addEventListener('DOMContentLoaded', function () {
    // Initialisation des modales - cachées par défaut
    const modal = document.getElementById('project-modal');
    const popup = document.getElementById('image-popup');
    if (modal) modal.style.display = 'none';
    if (popup) popup.style.display = 'none';

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const navbar = document.querySelector('.navbar');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');

            if (navbar && navbar.classList.contains('active') && mobileToggle) {
                navbar.classList.remove('active');
                mobileToggle.classList.remove('active');
                const icon = mobileToggle.querySelector('ion-icon');
                if (icon) icon.setAttribute('name', 'menu-outline');
            }

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

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navbar.classList.toggle('active');
            const icon = this.querySelector('ion-icon');
            if (icon) {
                icon.setAttribute('name', this.classList.contains('active') ? 'close-outline' : 'menu-outline');
            }

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

    // Service cards toggle
    document.querySelectorAll('.service-header').forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = header.closest('.service-card');
            if (!card) return;

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
            if (details) details.style.maxHeight = !isActive ? details.scrollHeight + 'px' : null;
            if (arrow) {
                arrow.classList.toggle('active', !isActive);
                arrow.innerHTML = !isActive
                    ? '<ion-icon name="chevron-up-outline"></ion-icon>'
                    : '<ion-icon name="chevron-down-outline"></ion-icon>';
            }
        });
    });

    // Project galleries
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
            slides.forEach(slide => slide.classList.remove('active'));
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

        // Touch support
        let touchStartX = 0, touchEndX = 0;
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (Math.abs(touchEndX - touchStartX) > 50) {
                if (touchEndX < touchStartX) currentIndex = (currentIndex + 1) % totalSlides;
                else currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateGallery();
            }
        }, { passive: true });
    });

    // Project modal with enhanced image popup
    if (modal) {
        const modalClose = modal.querySelector('.modal-close');
        const modalContent = modal.querySelector('#modal-content');
        
        // Close modal
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.stopPropagation();
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Project details click handler
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const projectCard = this.closest('.project-card');
                if (!projectCard) return;

                const projectId = projectCard.dataset.projectId;
                const projectData = getProjectData(projectId);

                if (projectData && modalContent) {
                    modalContent.innerHTML = `
                        <h3>${projectData.title}</h3>
                        <div class="modal-gallery">
                            ${projectData.images.map((img, index) =>
                                `<img src="${img.src}" alt="${img.alt}"
                                        class="modal-gallery-image"
                                        data-index="${index}">`
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
                    document.body.style.overflow = 'hidden';

                const modalImages = modalContent.querySelectorAll('.modal-gallery-image');
                modalImages.forEach(img => {
                    img.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const popup = document.getElementById('image-popup');
                        const popupImg = document.getElementById('popup-image');
                        
                        if (popup && popupImg) {
                            popupImg.src = this.src;
                            popup.dataset.currentIndex = this.dataset.index;
                            popup.dataset.projectId = projectId;
                            popup.style.display = 'flex';
                            document.body.style.overflow = 'hidden';
                        }
                    });
                });
                }
            });
        });
    }

    // Image popup handling
    const popupImg = document.getElementById('popup-image');
    const popupClose = document.getElementById('popup-close');
    const popupPrev = document.getElementById('popup-prev');
    const popupNext = document.getElementById('popup-next');

    if (popup && popupClose && popupImg) {
        popupClose.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.style.display = 'none';
        });

        // Navigation for popup images
        const navigatePopup = (direction) => {
            const currentIndex = parseInt(popup.dataset.currentIndex || 0);
            const projectId = popup.dataset.projectId;
            const projectData = getProjectData(projectId);
            
            if (!projectData || !projectData.images.length) return;

            let newIndex = currentIndex;
            if (direction === 'prev') {
                newIndex = (currentIndex - 1 + projectData.images.length) % projectData.images.length;
            } else if (direction === 'next') {
                newIndex = (currentIndex + 1) % projectData.images.length;
            }
            popupImg.src = projectData.images[newIndex].src;
            popup.dataset.currentIndex = newIndex;
        };

        if (popupPrev) {
            popupPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                navigatePopup('prev');
            });
        }
        if (popupNext) {
            popupNext.addEventListener('click', (e) => {
                e.stopPropagation();
                navigatePopup('next');
            });
        }

        // Keyboard navigation for popup
        document.addEventListener('keydown', function(e) {
            if (popup.style.display === 'flex') {
                if (e.key === 'Escape') {
                    popup.style.display = 'none';
                } else if (e.key === 'ArrowLeft') {
                    navigatePopup('prev');
                } else if (e.key === 'ArrowRight') {
                    navigatePopup('next');
                }
            }
        });

        // Close popup when clicking outside of the image
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    }

    // Scroll animations
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .project-card, .tech-item');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
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

    // Contact form
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[name="name"]')?.value.trim();
            const email = this.querySelector('input[name="email"]')?.value.trim();
            const message = this.querySelector('textarea[name="message"]')?.value.trim();

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

    // Typing animations
    const animateHeroTitleTyping = () => {
        const heroTitle = document.querySelector('.hero h1');
        if (!heroTitle) return;

        const originalText = heroTitle.textContent || '';
        heroTitle.textContent = '';
        let charIndex = 0;

        function typeChar() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 70);
            }
        }
        typeChar();
    };

    const animateSubtitleTyping = () => {
        const text = "Spécialiste en analyse de données, développement et automatisation de processus";
        const element = document.getElementById('typewriter-text');
        if (!element) return;

        element.innerHTML = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                const charSpan = document.createElement('span');
                charSpan.className = 'typewriter-char';
                charSpan.textContent = text.charAt(i);
                element.appendChild(charSpan);

                if (i > 0) element.children[i-1].classList.remove('typewriter-char');
                i++;
                setTimeout(typeWriter, 50);
            } else {
                Array.from(element.children).forEach(el => el.classList.remove('typewriter-char'));
            }
        }
        setTimeout(typeWriter, 800);
    };

    animateHeroTitleTyping();
    animateSubtitleTyping();

    // Project data
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
                title: "Dashbord Vente & Recolt",
                description: "Optimisation du suivi des ventes et amélioration des indicateurs de rentabilité, d'administration financière et RH, en capitalisant sur les ressources existantes.",
                fullDetails: "Création d'une application logistique pour Total, axée sur l'optimisation des livraisons et l'amélioration des indicateurs clés. L'application permet un suivi en temps réel des coursiers, l'optimisation des itinéraires, et l'analyse des performances pour maximiser la rentabilité et l'efficacité des ressources humaines et financières. J'ai travaillé sur l'intégration de différentes sources de données et la création d'interfaces utilisateur intuitives.",
                technologies: ["Merise", "Analyse de données", "SQL Server", "Power Query", "Power Bi", "DAX","Logistique"],
                images: [
                    { src: "assets/img/Total_Bi_1.JPG", alt: "Projet Glovo - Login" },
                    { src: "assets/img/Total_Bi_2.JPG", alt: "Projet Glovo - Login" },
                    { src: "assets/img/Total_Bi_3.JPG", alt: "Projet Glovo - Login" },
                    { src: "assets/img/Total_Bi_4.JPG", alt: "Projet Glovo - Login" },
                    { src: "assets/img/Total_Bi_Mobile_6.JPG", alt: "Projet Glovo - Login" }
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
            }
        };
        return projects[projectId] || null;
    }
});
// Gestion du formulaire de contact





// Gestion du formulaire de contact
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        
        button.disabled = true;
        button.innerHTML = '<span>Envoi en cours...</span>';
        
        try {
            // Essai avec FormSubmit
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(new FormData(form))
            });
            
            if (response.ok) {
                window.location.href = form.querySelector('input[name="_next"]').value;
            } else {
                throw new Error('Erreur FormSubmit');
            }
        } catch (error) {
            console.error('Erreur avec FormSubmit:', error);
            // Fallback vers mailto
            const name = encodeURIComponent(form.querySelector('[name="name"]').value);
            const email = encodeURIComponent(form.querySelector('[name="email"]').value);
            const subject = encodeURIComponent(form.querySelector('[name="subject"]').value);
            const message = encodeURIComponent(form.querySelector('[name="message"]').value);
            
            window.location.href = `mailto:daoui00yassine@gmail.com?subject=${subject}&body=Nom: ${name}%0AEmail: ${email}%0A%0AMessage: ${message}`;
            
            button.disabled = false;
            button.innerHTML = '<span>Envoyer le message</span><ion-icon name="send-outline" class="button__icon"></ion-icon>';
            
            alert("Le formulaire a rencontré un problème. Une fenêtre d'email s'est ouverte à la place.");
        }
    });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Cache les overlays immédiatement
    gsap.set([".first", ".second", ".third"], { top: "-100%" });
    
    // Initialise le formulaire
    initContactForm();
});
// Gestion du formulaire de contact
function initContactForm() {
    // Les éléments du formulaire sont récupérés ici pour la structure,
    // mais le submit n'est plus géré par JS pour l'envoi FormSubmit
    const form = document.getElementById('contactForm');
    const successPopup = document.getElementById('successPopup');
    const closePopupBtn = document.querySelector('.close-popup-btn');

    // Vérifie si la pop-up existe pour éviter des erreurs
    if (!successPopup) {
        console.warn("Élément 'successPopup' introuvable. La pop-up de succès ne fonctionnera pas.");
        return; // Sort de la fonction si la pop-up n'est pas trouvée
    }

    // Écouteur pour le bouton de fermeture de la pop-up
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            successPopup.classList.remove('show-popup');
            // Nettoie l'URL pour un aspect plus propre après la fermeture manuelle
            history.replaceState({}, document.title, window.location.pathname);
        });
    }
    // Note: L'événement 'submit' du formulaire n'est PAS intercepté ici.
    // FormSubmit gère la soumission via les attributs 'action' et 'method' du HTML.
}

// Fonction pour afficher la pop-up de succès
function showSuccessPopup() {
    const successPopup = document.getElementById('successPopup');
    if (successPopup) {
        successPopup.classList.add('show-popup'); // Ajoute la classe pour afficher la pop-up

        // Ferme la pop-up automatiquement après 5 secondes
        setTimeout(() => {
            successPopup.classList.remove('show-popup');
            // Nettoie l'URL pour un aspect plus propre après la fermeture automatique
            history.replaceState({}, document.title, window.location.pathname);
        }, 5000);
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Cache les overlays GSAP si vous les utilisez pour une animation de chargement
    gsap.set([".first", ".second", ".third"], { top: "-100%" });

    // Initialise le formulaire et les écouteurs de la pop-up
    initContactForm();

    // Vérifie le paramètre d'URL pour afficher la pop-up après redirection de FormSubmit
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showSuccessPopup();
        // Optionnel: Nettoyer l'URL immédiatement pour qu'elle ne soit pas visible longtemps
        // history.replaceState({}, document.title, window.location.pathname);
        // La ligne ci-dessus est désormais dans showSuccessPopup et closePopupBtn
        // pour s'assurer qu'elle est appelée après un délai ou une action utilisateur.
    }

    // Vos autres initialisations de scripts et animations ici
    // Exemple : timeline.from(...)
});
