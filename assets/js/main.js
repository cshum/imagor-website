// Main JavaScript for Imagor website

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Slideshow functionality
    const slideshowTrack = document.querySelector('.slideshow-track');
    const allSlides = document.querySelectorAll('.slide');
    const realSlides = document.querySelectorAll('.slide:not(.slide-clone)');
    const dots = document.querySelectorAll('.dot');
    const arrows = document.querySelectorAll('.slideshow-arrow');
    const mobileArrows = document.querySelectorAll('.mobile-arrow');
    let currentSlide = 1; // Start at first real slide (index 1, after clone)
    let slideInterval;
    let autoScrollEnabled = true; // Track if auto-scroll is active
    let isTransitioning = false; // Track if slideshow is transitioning
    const totalSlides = allSlides.length;
    const realSlideCount = realSlides.length;

    function disableNavigation() {
        isTransitioning = true;
        // Disable all navigation elements
        [...arrows, ...mobileArrows, ...dots].forEach(element => {
            element.style.pointerEvents = 'none';
            element.style.opacity = '0.6';
        });
    }

    function enableNavigation() {
        isTransitioning = false;
        // Re-enable all navigation elements
        [...arrows, ...mobileArrows, ...dots].forEach(element => {
            element.style.pointerEvents = 'auto';
            element.style.opacity = '1';
        });
    }

    function showSlide(index, instant = false) {
        currentSlide = index;
        
        // Move the track using CSS transform
        if (slideshowTrack) {
            const translateX = -index * 100;
            
            if (instant) {
                // Disable transition for instant jump
                slideshowTrack.style.transition = 'none';
                slideshowTrack.style.transform = `translateX(${translateX}%)`;
                // Force reflow and re-enable transition
                slideshowTrack.offsetHeight;
                slideshowTrack.style.transition = '';
            } else {
                slideshowTrack.style.transform = `translateX(${translateX}%)`;
            }
        }
        
        // Update active dot based on real slide index
        const realSlideIndex = getRealSlideIndex(index);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === realSlideIndex);
        });
    }

    function getRealSlideIndex(slideIndex) {
        // Convert slide index to real slide index (0, 1, 2)
        if (slideIndex === 0) return 2; // Clone of last slide
        if (slideIndex === totalSlides - 1) return 0; // Clone of first slide
        return slideIndex - 1; // Real slides are at index 1, 2, 3
    }

    function nextSlide() {
        if (isTransitioning) return; // Prevent multiple clicks during transition
        
        disableNavigation();
        const nextIndex = currentSlide + 1;
        
        if (nextIndex >= totalSlides) {
            // We're at the last clone, jump to first real slide
            showSlide(nextIndex - 1); // Show the clone first
            setTimeout(() => {
                showSlide(1, true); // Then instantly jump to first real slide
                enableNavigation();
            }, 600); // Wait for transition to complete
        } else {
            showSlide(nextIndex);
            
            // If we just moved to the last clone, prepare to jump back
            if (nextIndex === totalSlides - 1) {
                setTimeout(() => {
                    showSlide(1, true); // Jump to first real slide
                    enableNavigation();
                }, 600);
            } else {
                setTimeout(enableNavigation, 600);
            }
        }
    }

    function prevSlide() {
        if (isTransitioning) return; // Prevent multiple clicks during transition
        
        disableNavigation();
        const prevIndex = currentSlide - 1;
        
        if (prevIndex < 0) {
            // We're before the first slide, jump to last real slide
            showSlide(0); // Show the first clone
            setTimeout(() => {
                showSlide(realSlideCount, true); // Jump to last real slide
                enableNavigation();
            }, 600);
        } else {
            showSlide(prevIndex);
            
            // If we just moved to the first clone, prepare to jump forward
            if (prevIndex === 0) {
                setTimeout(() => {
                    showSlide(realSlideCount, true); // Jump to last real slide
                    enableNavigation();
                }, 600);
            } else {
                setTimeout(enableNavigation, 600);
            }
        }
    }

    function goToSlide(realIndex) {
        if (isTransitioning) return; // Prevent multiple clicks during transition
        
        disableNavigation();
        // Convert real slide index to actual slide index
        const slideIndex = realIndex + 1; // Real slides start at index 1
        showSlide(slideIndex);
        setTimeout(enableNavigation, 600);
    }

    function startAutoScroll() {
        if (autoScrollEnabled && realSlideCount > 1) {
            slideInterval = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
        }
    }

    function disableAutoScroll() {
        autoScrollEnabled = false;
        clearInterval(slideInterval);
    }

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            disableAutoScroll(); // Disable auto-scroll on manual interaction
            goToSlide(index);
        });
    });

    // Add click event listeners to arrows
    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            disableAutoScroll(); // Disable auto-scroll on manual interaction
            const direction = arrow.dataset.direction;
            if (direction === 'next') {
                nextSlide();
            } else if (direction === 'prev') {
                prevSlide();
            }
        });
    });

    // Add click event listeners to mobile arrows
    mobileArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            disableAutoScroll(); // Disable auto-scroll on manual interaction
            const direction = arrow.dataset.direction;
            if (direction === 'next') {
                nextSlide();
            } else if (direction === 'prev') {
                prevSlide();
            }
        });
    });

    // Initialize slideshow
    if (allSlides.length > 0) {
        // Start at first real slide (index 1)
        showSlide(1, true);
        startAutoScroll(); // Start auto-scrolling
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .feature-item, .stat-item').forEach(el => {
        observer.observe(el);
    });

    // Stats counter animation
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number based on the target
            if (target >= 1000) {
                element.textContent = Math.floor(current / 1000) + 'k+';
            } else if (element.textContent.includes('x')) {
                element.textContent = Math.floor(current) + 'x';
            } else if (element.textContent.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target.querySelector('h3');
                const text = statElement.textContent;
                
                // Extract number from text
                let target = 0;
                if (text.includes('4-8x')) {
                    target = 8;
                } else if (text.includes('300+')) {
                    target = 300;
                } else if (text.includes('10k+')) {
                    target = 10000;
                } else if (text.includes('100%')) {
                    target = 100;
                }
                
                if (target > 0) {
                    animateCounter(statElement, target);
                    statsObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(el => {
        statsObserver.observe(el);
    });


    // Button hover effects (removed translateY, kept shadow)
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (this.classList.contains('btn-primary') || this.classList.contains('btn-accent')) {
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });

    // Mobile menu toggle (if needed in future)
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav');
        const header = document.querySelector('.header-content');
        
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                const toggle = document.createElement('button');
                toggle.className = 'mobile-menu-toggle';
                toggle.innerHTML = '☰';
                toggle.style.cssText = `
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--primary-color);
                `;
                
                toggle.addEventListener('click', () => {
                    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
                    nav.style.flexDirection = 'column';
                    nav.style.position = 'absolute';
                    nav.style.top = '100%';
                    nav.style.left = '0';
                    nav.style.right = '0';
                    nav.style.background = 'white';
                    nav.style.padding = '1rem';
                    nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                });
                
                header.appendChild(toggle);
            }
        }
    };

    // Initialize mobile menu on load and resize
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);


    // Form validation for contact forms (if added)
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };


    // Lazy loading for images (when added)
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }

    // Error handling for external resources
    window.addEventListener('error', (e) => {
        console.warn('Resource failed to load:', e.target.src || e.target.href);
    });

    // Add smooth transitions to all interactive elements
    const style = document.createElement('style');
    style.textContent = `
        .product-card,
        .feature-item,
        .btn,
        .nav-link {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lazy.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
