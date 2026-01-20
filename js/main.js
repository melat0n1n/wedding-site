/**
 * Wedding Invitation - Vladimir & Maria
 * 30.05.2026
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initPreloader();
    initNavigation();
    initCountdown();
    initMap();
    initScrollAnimations();
    initRSVPForm();
});

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            // Trigger entrance animations
            document.body.classList.add('loaded');
        }, 1000);
    });
    
    // Fallback: hide preloader after 3 seconds max
    setTimeout(function() {
        preloader.classList.add('hidden');
    }, 3000);
}

/**
 * Navigation
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu on link click
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Countdown Timer
 */
function initCountdown() {
    const weddingDate = new Date('2026-05-30T16:00:00').getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            // Wedding day has passed
            daysEl.textContent = '0';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        daysEl.textContent = days;
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

/**
 * Yandex Map
 */
function initMap() {
    // Wait for Yandex Maps API to load
    if (typeof ymaps === 'undefined') {
        console.warn('Yandex Maps API not loaded');
        return;
    }
    
    ymaps.ready(function() {
        const coordinates = [56.321890, 44.001827];
        
        const map = new ymaps.Map('map', {
            center: coordinates,
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
        });
        
        // Create custom placemark
        const placemark = new ymaps.Placemark(coordinates, {
            balloonContentHeader: 'Ресторан «Краса»',
            balloonContentBody: 'Октябрьская ул., 9<br>Нижний Новгород',
            balloonContentFooter: '<a href="https://yandex.ru/maps/?rtext=~56.321890,44.001827" target="_blank">Построить маршрут</a>',
            hintContent: 'Ресторан «Краса»'
        }, {
            preset: 'islands#redHeartIcon',
            iconColor: '#d4a574'
        });
        
        map.geoObjects.add(placemark);
        
        // Disable scroll zoom on mobile
        if (window.innerWidth < 768) {
            map.behaviors.disable('scrollZoom');
            map.behaviors.disable('drag');
        }
        
        // Custom styling (dark theme)
        map.panes.get('ground').getElement().style.filter = 'grayscale(80%) brightness(0.6) contrast(1.1)';
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('.section-header, .about-photo, .about-text, .event-card, .hotel-content, .wish-card, .palette, .dresscode-examples, .rsvp-form');
    
    animatedElements.forEach(function(el) {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/**
 * RSVP Form
 */
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    const questionsGroup = document.getElementById('questionsGroup');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('rsvpSuccess');
    
    // Show/hide additional questions based on attendance
    attendanceRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                questionsGroup.classList.add('visible');
            } else {
                questionsGroup.classList.remove('visible');
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        
        // Submit to Formspree
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                // Success
                form.style.display = 'none';
                successMessage.classList.add('visible');
                
                // Trigger confetti
                triggerConfetti();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую.');
        })
        .finally(function() {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    });
    
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked');
        
        if (!name) {
            alert('Пожалуйста, введите ваше имя');
            return false;
        }
        
        if (!phone) {
            alert('Пожалуйста, введите номер телефона');
            return false;
        }
        
        if (!attendance) {
            alert('Пожалуйста, укажите, сможете ли вы прийти');
            return false;
        }
        
        return true;
    }
}

/**
 * Confetti Effect
 */
function triggerConfetti() {
    if (typeof confetti === 'undefined') {
        return;
    }
    
    // Colors matching the wedding palette
    const colors = ['#354037', '#767154', '#6F171F', '#BF9B7A', '#D6CCA8'];
    
    // First burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
    });
    
    // Continuous confetti for 3 seconds
    const duration = 3000;
    const end = Date.now() + duration;
    
    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });
        
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

/**
 * Phone number formatting
 */
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
                if (value[0] !== '7') {
                    value = '7' + value;
                }
                
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.slice(1, 4);
                }
                if (value.length > 4) {
                    formatted += ') ' + value.slice(4, 7);
                }
                if (value.length > 7) {
                    formatted += '-' + value.slice(7, 9);
                }
                if (value.length > 9) {
                    formatted += '-' + value.slice(9, 11);
                }
                
                e.target.value = formatted;
            }
        });
    }
});

/**
 * Smooth reveal on scroll (parallax-like effect)
 */
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroCountdown = document.querySelector('.hero-countdown');
    
    if (heroContent && scrolled < window.innerHeight) {
        const opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        const translateY = scrolled * 0.3;
        
        heroContent.style.opacity = Math.max(0, opacity);
        heroContent.style.transform = `translateY(${translateY}px)`;
        
        if (heroCountdown) {
            heroCountdown.style.opacity = Math.max(0, opacity);
            heroCountdown.style.transform = `translateY(${translateY}px)`;
        }
    }
});


