(function () {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;
  let scrollTimeout;

  // Toggle mobile menu
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.innerHTML = navMenu.classList.contains('active')
      ? '<i class="fas fa-times" aria-hidden="true"></i>'
      : '<i class="fas fa-bars" aria-hidden="true"></i>';
    mobileToggle.setAttribute('aria-label', navMenu.classList.contains('active') ? 'Cerrar menú móvil' : 'Abrir menú móvil');
    if (navMenu.classList.contains('active')) {
      header.classList.remove('hidden');
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
      mobileToggle.setAttribute('aria-label', 'Abrir menú móvil');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for card animations
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  // Dynamic gradient on cards
  document.querySelectorAll('.service-card, .enterprise-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 180;
      card.style.background = `linear-gradient(${angle}deg, rgba(255, 61, 0, 0.2), rgba(10, 10, 10, 0.1))`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '#0A0A0A';
    });
  });

  // Scroll handler with requestAnimationFrame
  function handleScroll() {
    const currentScrollY = window.scrollY;

    header.classList.toggle('scrolled', currentScrollY > 50);

    if (currentScrollY > lastScrollY && currentScrollY > 50 && !navMenu.classList.contains('active')) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (!navMenu.classList.contains('active')) {
        header.classList.remove('hidden');
      }
    }, 300);

    lastScrollY = currentScrollY;
  }

  // Initialize on load
  window.addEventListener('load', () => {
    try {
      document.querySelectorAll('.service-card, .enterprise-card').forEach(element => {
        observer.observe(element);
      });

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });
    } catch (error) {
      console.error('Error initializing scroll or observer:', error);
    }
  });

  // Handle visibility change
  document.addEventListener('visibilitychange', () => {
    try {
      document.title = document.hidden
        ? '¡Vuelve! Servicios automotrices en Antofagasta 🚗'
        : 'RevLine | Diagnóstico y Mecánica Móvil en Antofagasta';
    } catch (error) {
      console.error('Error handling visibility change:', error);
    }
  });
})();