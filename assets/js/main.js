document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !document.querySelector(targetId)) return;

      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        location.hash = targetId;
      }
    });
  });

  // Project filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });

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

  // Service cards toggle
  const serviceHeaders = document.querySelectorAll('.service-header');
  serviceHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.service-card');
      if (!card) return;

      const isActive = card.classList.contains('active');

      document.querySelectorAll('.service-card.active').forEach(activeCard => {
        if (activeCard !== card) activeCard.classList.remove('active');
      });

      card.classList.toggle('active', !isActive);

      const arrow = header.querySelector('.service-arrow');
      if (arrow) {
        arrow.style.transform = card.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  });

  // Project image carousel
  document.querySelectorAll('.project-card').forEach(card => {
    const gallery = card.querySelector('.project-gallery');
    if (!gallery) return;

    const container = gallery.querySelector('.gallery-container');
    const slides = gallery.querySelectorAll('.gallery-slide');
    const prevBtn = gallery.querySelector('.project-nav.prev');
    const nextBtn = gallery.querySelector('.project-nav.next');
    const counter = card.querySelector('.slide-counter');

    if (!container || !slides.length || !prevBtn || !nextBtn || !counter) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    const updateCarousel = () => {
      container.style.transform = `translateX(-${currentIndex * 100}%)`;
      counter.textContent = `${currentIndex + 1}/${totalSlides}`;
      slides.forEach((slide, index) => slide.classList.toggle('active', index === currentIndex));
    };

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    });

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      if (Math.abs(touchEndX - touchStartX) > 50) {
        currentIndex = touchEndX < touchStartX
          ? (currentIndex + 1) % totalSlides
          : (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
      }
    };

    container.style.width = `${totalSlides * 100}%`;
    slides.forEach(slide => {
      slide.style.width = `${100 / totalSlides}%`;
    });

    updateCarousel();
  });

  // Scroll animations
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .project-card, .tech-item, .contact-item, .form-group');
    const windowHeight = window.innerHeight;

    elements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const triggerPoint = windowHeight * 0.85;
      if (elementTop < triggerPoint) {
        el.classList.add('animated');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });

    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      backToTop.classList.toggle('visible', window.pageYOffset > 300);
    }
  };

  // Initial styles for animated elements
  document.querySelectorAll('.service-card, .project-card, .tech-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease';
  });

  document.querySelectorAll('.contact-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-20px)';
    el.style.transition = `all 0.5s ease ${i * 0.1}s`;
  });

  document.querySelectorAll('.form-group').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition = `all 0.5s ease ${i * 0.1}s`;
  });

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();

  // Back to top button
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Contact form validation
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = contactForm.querySelector('input[type="text"]').value.trim();
      const email = contactForm.querySelector('input[type="email"]').value.trim();
      const message = contactForm.querySelector('textarea').value.trim();

      if (!name || !email || !message) {
        showAlert('Veuillez remplir tous les champs du formulaire.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAlert('Veuillez entrer une adresse email valide.', 'error');
        return;
      }

      showAlert('Message envoyé avec succès! Je vous répondrai dès que possible.', 'success');
      contactForm.reset();
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

  // Floating animation delay randomization
  document.querySelectorAll('.floating').forEach(el => {
    el.style.animationDelay = `${Math.random() * 2}s`;
  });

  // IntersectionObserver for data-animate
  const animatedElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(entries => {
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

      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        const targetElement = document.querySelector(href);
        if (!targetElement) return;

        e.preventDefault();
        gsap.to(link, {
          y: 3,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(link, { y: 0, duration: 0.3 });
            const offset = document.querySelector('.header').offsetHeight || 0;
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

  // Close mobile menu on nav link click
  document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
      if (navbar && navbar.classList.contains('open')) {
        navbar.classList.remove('active');
        navbar.classList.remove('open');
      }
    });
  });
});
