// KeyScale Growth - Main JavaScript

import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initNavbar();
  initScrollReveal();
  initCounters();
  initTestimonialSlider();
  initServiceTabs();
  initAccordion();
  initBackToTop();
  initMobileMenu();
  initSmoothScroll();
});

// Navbar scroll effect
function initNavbar() {
  const navbar = document.getElementById('navbar');

  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial state
}

// Scroll reveal animations
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (!reveals.length) return;

  const revealOnScroll = () => {
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // Check initial state
}

// Animated counters
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');

  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = parseFloat(counter.dataset.target);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const isDecimal = target % 1 !== 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (target - start) * easeOutQuart;

      if (isDecimal) {
        counter.textContent = current.toFixed(1);
      } else {
        counter.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (isDecimal) {
          counter.textContent = target.toFixed(1);
        } else {
          counter.textContent = target;
        }
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Use Intersection Observer to trigger counters when visible
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// Testimonial slider
function initTestimonialSlider() {
  const slider = document.getElementById('testimonial-slider');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');

  if (!slider || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();

  function getSlidesPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function updateSlider() {
    const slideWidth = slider.children[0].offsetWidth;
    const maxIndex = Math.max(0, slider.children.length - slidesPerView);
    currentIndex = Math.min(currentIndex, maxIndex);
    slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  function nextSlide() {
    const maxIndex = Math.max(0, slider.children.length - slidesPerView);
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateSlider();
  }

  function prevSlide() {
    const maxIndex = Math.max(0, slider.children.length - slidesPerView);
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex;
    }
    updateSlider();
  }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Auto-slide
  let autoSlide = setInterval(nextSlide, 5000);

  slider.parentElement.addEventListener('mouseenter', () => {
    clearInterval(autoSlide);
  });

  slider.parentElement.addEventListener('mouseleave', () => {
    autoSlide = setInterval(nextSlide, 5000);
  });

  // Handle resize
  window.addEventListener('resize', () => {
    slidesPerView = getSlidesPerView();
    updateSlider();
  });

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (diff > swipeThreshold) {
      nextSlide();
    } else if (diff < -swipeThreshold) {
      prevSlide();
    }
  }
}

// Service tabs
function initServiceTabs() {
  const tabs = document.querySelectorAll('.service-tab');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!tabs.length || !serviceCards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide service cards
      serviceCards.forEach(card => {
        if (card.classList.contains(category)) {
          card.classList.remove('hidden');
          card.classList.add('reveal', 'active');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// FAQ Accordion
function initAccordion() {
  const accordionBtns = document.querySelectorAll('.accordion-btn');

  if (!accordionBtns.length) return;

  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      // Close all other accordions
      accordionBtns.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.classList.remove('open');
          otherBtn.nextElementSibling.classList.remove('open');
        }
      });

      // Toggle current accordion
      btn.classList.toggle('open');
      content.classList.toggle('open');
    });
  });
}

// Back to top button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');

  if (!backToTopBtn) return;

  const toggleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.visibility = 'visible';
    } else {
      backToTopBtn.classList.remove('visible');
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
    }
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');

    // Update icon
    const icon = mobileMenuBtn.querySelector('svg');
    if (mobileMenu.classList.contains('hidden')) {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    } else {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
    }
  });

  // Close menu when clicking menu links
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetPosition = targetElement.offsetTop - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// Utility: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility: Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Add loading class to body when DOM is ready
document.body.classList.add('loaded');

// Console branding
console.log('%c KeyScale Growth ', 'background: linear-gradient(135deg, #2563eb, #0ea5e9); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%c Premium B2B Lead Generation & Appointment Setting ', 'color: #64748b; font-size: 14px;');
