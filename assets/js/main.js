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

            // Check if targetId is just '#' or if the target element doesn't exist
            if (targetId === '#' || !document.querySelector(targetId)) return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            const header = document.querySelector('.header');
            // Calculate header height, defaulting to 0 if header is not found
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL hash for direct linking and better user experience
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
            e.stopPropagation(); // Prevent event from bubbling up and closing the menu immediately
            this.classList.toggle('active');
            navbar.classList.toggle('active');
            const icon = this.querySelector('ion-icon');
            if (icon) {
                icon.setAttribute('name', this.classList.contains('active') ? 'close-outline' : 'menu-outline');
            }

            // Animate individual menu items when the navbar becomes active
            if (navbar.classList.contains('active')) {
                document.querySelectorAll('.navbar ul li').forEach((item, index) => {
                    item.style.opacity = '0'; // Start invisible
                    item.style.transform = 'translateY(-20px)'; // Start slightly above
                    // Apply a small delay for a staggered animation effect
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.style.transition = `all 0.3s ease ${index * 0.1}s`; // Staggered transition
                    }, 10); // Small delay to ensure styles are applied before transition
                });
            }
        });
    }

    // Service cards toggle
    document.querySelectorAll('.service-header').forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent potential propagation issues
            const card = header.closest('.service-card');
            if (!card) return; // Ensure a service card is found

            const isActive = card.classList.contains('active');
            const details = card.querySelector('.service-details');
            const arrow = header.querySelector('.service-arrow');

            // Close other open service cards
            document.querySelectorAll('.service-card').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('active');
                    const otherDetails = otherCard.querySelector('.service-details');
                    const otherArrow = otherCard.querySelector('.service-header .service-arrow');
                    if (otherDetails) otherDetails.style.maxHeight = null; // Collapse details
                    if (otherArrow) {
                        otherArrow.classList.remove('active');
                        otherArrow.innerHTML = '<ion-icon name="chevron-down-outline"></ion-icon>'; // Reset arrow icon
                    }
                }
            });

            // Toggle active class on the clicked card
            card.classList.toggle('active', !isActive); // Explicitly set based on !isActive
            // Adjust maxHeight for smooth expand/collapse transition
            if (details) details.style.maxHeight = !isActive ? details.scrollHeight + 'px' : null;
            // Toggle arrow icon and active class
            if (arrow) {
                arrow.classList.toggle('active', !isActive);
                arrow.innerHTML = !isActive
                    ? '<ion-icon name="chevron-up-outline"></ion-icon>' // Up arrow when active
                    : '<ion-icon name="chevron-down-outline"></ion-icon>'; // Down arrow when inactive
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

        // Ensure all necessary elements exist before proceeding
        if (!container || !slides.length || !prevBtn || !nextBtn || !counter) return;

        let currentIndex = 0;
        const totalSlides = slides.length;

        // Function to update the displayed slide and counter
        function updateGallery() {
            slides.forEach(slide => slide.classList.remove('active')); // Hide all slides
            slides[currentIndex].classList.add('active'); // Show the current slide
            counter.textContent = `${currentIndex + 1}/${totalSlides}`; // Update counter text
        }

        // Event listener for previous button
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Loop back if at the beginning
            updateGallery();
        });

        // Event listener for next button
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % totalSlides; // Loop to the beginning if at the end
            updateGallery();
        });

        // Initial gallery setup
        updateGallery();

        // Touch support for swiping
        let touchStartX = 0, touchEndX = 0;
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true }); // Use passive listener for better performance

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            // Determine if a swipe occurred (threshold of 50 pixels)
            if (Math.abs(touchEndX - touchStartX) > 50) {
                if (touchEndX < touchStartX) currentIndex = (currentIndex + 1) % totalSlides; // Swipe left for next
                else currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Swipe right for previous
                updateGallery();
            }
        }, { passive: true }); // Use passive listener
    });

    // Project modal with enhanced image popup
    if (modal) {
        const modalClose = modal.querySelector('.modal-close');
        const modalContent = modal.querySelector('#modal-content');
        
        // Close modal when close button is clicked
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.stopPropagation();
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scrolling on body
            });
        }

        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === modal) { // Check if the click occurred directly on the modal overlay
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Project details click handler
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default link behavior
                e.stopPropagation(); // Stop propagation to avoid closing modal immediately
                const projectCard = this.closest('.project-card');
                if (!projectCard) return;

                const projectId = projectCard.dataset.projectId; // Get project ID from data attribute
                const projectData = getProjectData(projectId); // Retrieve project data

                if (projectData && modalContent) {
                    // Populate modal content with project data
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
                            ${projectData.link ? `<p><a href="${projectData.link}" target="_blank" rel="noopener noreferrer" class="project-link">Voir le projet en direct</a></p>` : ''}
                        </div>
                    `;
                    modal.style.display = 'block'; // Show the modal
                    document.body.style.overflow = 'hidden'; // Prevent scrolling on body

                    // Add click listeners to images within the modal for the popup
                    const modalImages = modalContent.querySelectorAll('.modal-gallery-image');
                    modalImages.forEach(img => {
                        img.addEventListener('click', function(e) {
                            e.stopPropagation(); // Stop propagation to prevent modal from closing
                            const popup = document.getElementById('image-popup');
                            const popupImg = document.getElementById('popup-image');
                            
                            if (popup && popupImg) {
                                popupImg.src = this.src; // Set popup image source
                                popup.dataset.currentIndex = this.dataset.index; // Store current image index
                                popup.dataset.projectId = projectId; // Store project ID for navigation
                                popup.style.display = 'flex'; // Show the image popup
                                document.body.style.overflow = 'hidden'; // Prevent scrolling on body
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
    const popup = document.getElementById('image-popup');

    if (popup && popupClose && popupImg) {
        // Close image popup
        popupClose.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.style.display = 'none';
            // Determine if the project modal should remain open or if body scrolling should be restored
            if (modal && modal.style.display === 'block') {
                document.body.style.overflow = 'hidden'; // Keep body overflow hidden if project modal is still open
            } else {
                document.body.style.overflow = 'auto'; // Restore body scrolling if no other modal is open
            }
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
            popup.dataset.currentIndex = newIndex; // Update stored index
        };

        // Event listeners for popup navigation buttons
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
            if (popup.style.display === 'flex') { // Only active if popup is open
                if (e.key === 'Escape') {
                    popup.style.display = 'none';
                    if (modal && modal.style.display === 'block') {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = 'auto';
                    }
                } else if (e.key === 'ArrowLeft') {
                    navigatePopup('prev');
                } else if (e.key === 'ArrowRight') {
                    navigatePopup('next');
                }
            }
        });

        // Close popup when clicking outside of the image
        popup.addEventListener('click', (e) => {
            if (e.target === popup) { // Check if the click occurred directly on the popup overlay
                popup.style.display = 'none';
                if (modal && modal.style.display === 'block') {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = 'auto';
                }
            }
        });
    }

    // Scroll animations
    function animateOnScroll() {
        // Select elements for animation
        const elements = document.querySelectorAll('.service-card, .project-card, .tech-item');
        const windowHeight = window.innerHeight; // Get current viewport height

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top; // Get top position of the element
            // Check if element is within the viewport with an offset
            if (elementTop < windowHeight - 150) {
                element.classList.add('animated'); // Add 'animated' class to trigger CSS animation
                // Ensure initial styles are correctly set for transition
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize elements for scroll animation (set initial hidden state)
    document.querySelectorAll('.service-card, .project-card, .tech-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)'; // Start slightly below
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Define transition properties
    });

    // Attach scroll event listener and trigger initial check
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run on load in case elements are already in view

    // Contact form validation and submission
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            // Get form field values, trimming whitespace
            const name = this.querySelector('input[name="name"]')?.value.trim();
            const email = this.querySelector('input[name="email"]')?.value.trim();
            const message = this.querySelector('textarea[name="message"]')?.value.trim();

            // Basic validation
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            // Email format validation using a simple regex
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }

            // Simulate form submission (in a real application, you'd send this to a server)
            alert('Message envoyé avec succès! Je vous répondrai dès que possible.');
            this.reset(); // Clear form fields after successful submission
        });
    }

    // Typing animations for hero section
    const animateHeroTitleTyping = () => {
        const heroTitle = document.querySelector('.hero h1');
        if (!heroTitle) return;

        const originalText = heroTitle.textContent || '';
        heroTitle.textContent = ''; // Clear text to start typing animation
        let charIndex = 0;

        // Function to type out each character with a delay
        function typeChar() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 70); // Adjust typing speed here (milliseconds per character)
            }
        }
        typeChar(); // Start the typing animation
    };

    const animateSubtitleTyping = () => {
        const text = "Spécialiste en analyse de données, développement et automatisation de processus";
        const element = document.getElementById('typewriter-text');
        if (!element) return;

        element.innerHTML = ''; // Clear element content
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                const charSpan = document.createElement('span');
                charSpan.className = 'typewriter-char'; // Add class for potential styling
                charSpan.textContent = text.charAt(i);
                element.appendChild(charSpan);

                // Optional: remove class from previous char for a "blinking" effect
                if (i > 0) element.children[i-1].classList.remove('typewriter-char');
                i++;
                setTimeout(typeWriter, 50); // Typing speed for subtitle
            } else {
                // Ensure all chars remain visible at the end
                Array.from(element.children).forEach(el => el.classList.remove('typewriter-char'));
            }
        }
        setTimeout(typeWriter, 800); // Delay start of subtitle typing
    };

    // Trigger typing animations
    animateHeroTitleTyping();
    animateSubtitleTyping();

    // Project data function
    function getProjectData(projectId) {
        // This object acts as a simple database for project information
        const projects = {
            "1": {
                title: "Dashboard Coaching & Ventes",
                description: "Gestion des coachings et tableau de bord de vente optimisé avec Python Streamlit",
                fullDetails: "Ce projet consistait à créer un tableau de bord complet pour analyser les performances de vente et gérer les coachings. J'ai utilisé Power BI pour connecter plusieurs sources de données et créer des mesures DAX complexes, puis j'ai développé une interface interactive avec Python Streamlit pour la gestion des coachings. Les visualisations interactives permettent aux utilisateurs de filtrer et explorer les données selon différents axes, et l'intégration de Python a permis d'ajouter des fonctionnalités de gestion dynamique.",
                technologies: ["Python", "Streamlit", "NumPy", "Pandas", "Plotly", "GeoPandas", "SQL (SQLite3)"],
                link: "https://dentalpro-uzvwutpfyfsoozqpjm8u76.streamlit.app/",
                images: [
                    { src: "assets/img/Dentale_1.PNG", alt: "Dashboard principal" },
                    { src: "assets/img/Dentale_H.PNG", alt: "Dashboard Power BI " },
                    { src: "assets/img/Dentale_12.PNG", alt: "Dashboard Power BI - Python" },
                    { src: "assets/img/Dentale_5.PNG", alt: "Dashboard Power BI - Python" },
                    { src: "assets/img/Dentale_123.PNG", alt: "Dashboard Python" },
                    { src: "assets/img/Dentale_1234.PNG", alt: "Dashboard Power BI - Python" },
                    { src: "assets/img/Dentale_12345.PNG", alt: "Dashboard Power BI - Python" },
                    { src: "assets/img/Dentale_H1.PNG", alt: "Dashboard Power BI - Python" },
                    { src: "assets/img/Dentale_H15.PNG", alt: "Dashboard Power BI - Python" }
                ]
            },
            "2": {
                title: "Dashboard Vente & Recolt",
                description: "Optimisation du suivi des ventes et amélioration des indicateurs de rentabilité, d'administration financière et RH, en capitalisant sur les ressources existantes.",
                fullDetails: "Mise en place d'une solution complète en Python pour automatiser le cycle de gestion des congés et le suivi managérial. Le script récupère les demandes de congés, les intègre dans un planning, et génère des rapports pour les managers, améliorant ainsi l'efficacité administrative et le suivi des équipes.",
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
                fullDetails: "Développement d'une application de gestion et suivi des ventes et recettes, avec une optimisation de la saisie personnalisée via des accès spécifiques. Conçue avec Python, Java et SQLite3, cette solution permet un suivi transactionnel précis et une analyse des performances. Accès démo : Login = YDaoui / MDP = H800000 (mode hyperviseur). Lien : https://dentalpro-uzvwutpfyfsoozqpjm8u76.streamlit.app/",
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
                    { src: "assets/img/Byg_5.jpg", alt: "Projet Bouygues Telecom - Dashboard" },
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
        return projects[projectId] || null; // Return project data or null if not found
    }
});

// Contact form (moved outside DOMContentLoaded to prevent re-declaration issues if it was called multiple times)
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successPopup = document.getElementById('successPopup');
    const closePopupBtn = document.querySelector('.close-popup-btn');

    if (!form) return; // Exit if the form doesn't exist

    // Handle popup closing
    if (successPopup && closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            successPopup.classList.remove('show-popup');
            // Clean up URL to remove success parameter
            history.replaceState({}, document.title, window.location.pathname);
        });
    }

    // Check URL parameters to show popup after redirection (e.g., from a server-side submission)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showSuccessPopup();
    }
}

function showSuccessPopup() {
    const successPopup = document.getElementById('successPopup');
    if (successPopup) {
        successPopup.classList.add('show-popup');
        
        // Auto-close popup after 5 seconds
        setTimeout(() => {
            successPopup.classList.remove('show-popup');
            history.replaceState({}, document.title, window.location.pathname); // Clean URL
        }, 5000);
    }
}

// Initialize on DOM content loaded for the contact form and GSAP
document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded before trying to use it
    if (typeof gsap !== 'undefined') {
        gsap.set([".first", ".second", ".third"], { top: "-100%" });
    }
    initContactForm(); // Initialize contact form logic
});
