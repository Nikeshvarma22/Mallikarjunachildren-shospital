// Mobile Navigation Toggle - Performance Optimized
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link - Event delegation for better performance
    navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu on window resize - Debounced for better performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });
}

// Smooth scrolling for navigation links - Performance optimized with event delegation
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Testimonials horizontal scroll enhancement
document.addEventListener('DOMContentLoaded', function() {
    const testimonialsScroll = document.querySelector('.testimonials-scroll');
    
    if (testimonialsScroll) {
        // Add smooth scrolling behavior
        testimonialsScroll.style.scrollBehavior = 'smooth';
        
        // Add touch/swipe support for mobile
        let isDown = false;
        let startX;
        let scrollLeft;
        
        testimonialsScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            testimonialsScroll.style.cursor = 'grabbing';
            startX = e.pageX - testimonialsScroll.offsetLeft;
            scrollLeft = testimonialsScroll.scrollLeft;
        });
        
        testimonialsScroll.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialsScroll.style.cursor = 'grab';
        });
        
        testimonialsScroll.addEventListener('mouseup', () => {
            isDown = false;
            testimonialsScroll.style.cursor = 'grab';
        });
        
        testimonialsScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsScroll.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsScroll.scrollLeft = scrollLeft - walk;
        });
        
        // Add scroll indicator animation
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.cursor = 'pointer';
            scrollIndicator.addEventListener('click', () => {
                testimonialsScroll.scrollBy({
                    left: 400,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Video thumbnail click functionality
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            console.log('Video thumbnail clicked!');
            const videoContainer = this.parentElement;
            const videoPlayer = videoContainer.querySelector('.video-player');
            
            if (videoPlayer) {
                console.log('Video player found, starting playback...');
                // Hide thumbnail using CSS class
                thumbnail.classList.add('hidden');
                
                // Show video player using CSS class
                videoPlayer.classList.add('active');
                
                // Play the video
                videoPlayer.play().then(() => {
                    console.log('Video started playing successfully!');
                }).catch(e => {
                    console.log('Video play failed:', e);
                    // If video fails to play, show thumbnail again
                    thumbnail.classList.remove('hidden');
                    videoPlayer.classList.remove('active');
                });
                
                // Add event listener to show thumbnail again when video ends
                videoPlayer.addEventListener('ended', function() {
                    console.log('Video ended, showing thumbnail again');
                    videoPlayer.classList.remove('active');
                    thumbnail.classList.remove('hidden');
                });
                
                // Add event listener to show thumbnail when video is paused
                videoPlayer.addEventListener('pause', function() {
                    console.log('Video paused, showing thumbnail again');
                    videoPlayer.classList.remove('active');
                    thumbnail.classList.remove('hidden');
                });
                
                // Add click event to video player to pause and show thumbnail
                videoPlayer.addEventListener('click', function() {
                    console.log('Video clicked, pausing and showing thumbnail');
                    this.pause();
                    this.classList.remove('active');
                    thumbnail.classList.remove('hidden');
                });
            } else {
                console.log('No video player found!');
            }
        });
    });
    
    // Image loading debugging
    const testimonialImages = document.querySelectorAll('.video-thumbnail img');
    testimonialImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            console.log(`Image ${index + 1} failed to load:`, this.src);
            // Show fallback text
            const fallbackText = this.parentElement.querySelector('.fallback-text');
            if (fallbackText) {
                fallbackText.style.display = 'block';
            }
            // Add a visible error indicator
            this.style.border = '3px solid red';
            this.style.backgroundColor = '#ffebee';
            console.log('Image path attempted:', this.src);
            console.log('Current working directory:', window.location.href);
        });
        
        img.addEventListener('load', function() {
            console.log(`Image ${index + 1} loaded successfully:`, this.src);
            // Force image to stay visible
            this.style.display = 'block';
            this.style.visibility = 'visible';
            this.style.opacity = '1';
        });
        

    });
});

// Navbar background change on scroll - Performance optimized with throttling
let ticking = false;
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 64, 128, 0.15)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 64, 128, 0.1)';
    }
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick, { passive: true });

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.story-card, .service-card, .testimonial-card, .education-card, .doctor-content');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Button click animations - Performance optimized with event delegation
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary, .btn-secondary, .nav-cta')) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        `;
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn-primary, .btn-secondary, .nav-cta {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section - Performance optimized with throttling
let parallaxTicking = false;
function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
    parallaxTicking = false;
}

function requestParallaxTick() {
    if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
    }
}

window.addEventListener('scroll', requestParallaxTick, { passive: true });

// Counter animation for statistics (if you want to add them later)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Form validation for appointment booking (placeholder)
// This is now handled by the appointment modal functionality above

// Wellness section button functionality
// This is now handled by the appointment modal functionality above

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
        this.style.transform = 'scale(1)';
    });
    
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';
    img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Enhanced hover effects for cards
document.querySelectorAll('.story-card, .service-card, .testimonial-card, .education-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
});

revealSections.forEach(section => {
    section.classList.add('reveal-section');
    revealObserver.observe(section);
});

// Add reveal animation styles
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .reveal-section {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .reveal-section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyle);

// Emergency number highlight effect
const emergencyNumber = document.querySelector('.emergency-number');
if (emergencyNumber) {
    setInterval(() => {
        emergencyNumber.style.textShadow = '0 0 10px #C6D300';
        setTimeout(() => {
            emergencyNumber.style.textShadow = 'none';
        }, 500);
    }, 2000);
}

// Add scroll progress indicator - Performance optimized with throttling
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #3BAFDA, #C6D300);
    z-index: 1001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

let progressTicking = false;
function updateProgress() {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
    progressTicking = false;
}

function requestProgressTick() {
    if (!progressTicking) {
        requestAnimationFrame(updateProgress);
        progressTicking = true;
    }
}

window.addEventListener('scroll', requestProgressTick, { passive: true });

// Add "Back to Top" button
const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #3BAFDA;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(59, 175, 218, 0.3);
`;

document.body.appendChild(backToTop);

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

let backToTopTicking = false;
function updateBackToTop() {
    if (window.scrollY > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
    }
    backToTopTicking = false;
}

function requestBackToTopTick() {
    if (!backToTopTicking) {
        requestAnimationFrame(updateBackToTop);
        backToTopTicking = true;
    }
}

window.addEventListener('scroll', requestBackToTopTick, { passive: true });

backToTop.addEventListener('mouseenter', () => {
    backToTop.style.transform = 'scale(1.1)';
    backToTop.style.background = '#2A9BC7';
});

backToTop.addEventListener('mouseleave', () => {
    backToTop.style.transform = 'scale(1)';
    backToTop.style.background = '#3BAFDA';
});

console.log('Mallikarjuna Children\'s Hospital website loaded successfully! 🏥');

// Animated statistics counter
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + '+';
        }, 16);
    });
    
    // Handle the "24/7" text that doesn't need animation
    const staticStats = document.querySelectorAll('.stat-number:not([data-target])');
    staticStats.forEach(stat => {
        if (stat.textContent === '0') {
            stat.textContent = '24/7';
        }
    });
}

// Intersection Observer for stats animation
const statsSection = document.querySelector('.impact-stats-section');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// Doctor section interactions
const doctorCards = document.querySelectorAll('.achievement-item, .stat-item');
doctorCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Mission/Vision cards interaction
const missionCards = document.querySelectorAll('.mission-card, .vision-card');
missionCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Feature items interaction
const featureItems = document.querySelectorAll('.feature-item');
featureItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Appointment Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('appointmentModal');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    // Function to open modal
    function openAppointmentModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Function to close modal
    function closeAppointmentModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
    
    // Close modal when clicking close buttons
    closeModal.addEventListener('click', closeAppointmentModal);
    closeModalBtn.addEventListener('click', closeAppointmentModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAppointmentModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeAppointmentModal();
        }
    });
    
    // Add click event to navigation bar "Book Appointment" button
    const navCtaButton = document.querySelector('.nav-cta');
    if (navCtaButton) {
        navCtaButton.addEventListener('click', function(e) {
            e.preventDefault();
            openAppointmentModal();
        });
    }
    
    // Add click event to all appointment/consultation buttons - Performance optimized with event delegation
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-primary, .btn-consultation, .btn-wellness')) {
            const text = e.target.textContent.toLowerCase();
            if (text.includes('appointment') || text.includes('consultation') || text.includes('book')) {
                e.preventDefault();
                openAppointmentModal();
            }
        }
    });
    
    // Add click event to "Find a Doctor" button
    const findDoctorButton = document.querySelector('.btn-secondary');
    if (findDoctorButton && findDoctorButton.textContent.toLowerCase().includes('find a doctor')) {
        findDoctorButton.addEventListener('click', function(e) {
            e.preventDefault();
            const doctorsSection = document.getElementById('doctors');
            if (doctorsSection) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = doctorsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Add click event to doctor consultation buttons
    const doctorConsultationButtons = document.querySelectorAll('.btn-consultation');
    doctorConsultationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openAppointmentModal();
        });
    });
    
    // Add click event to wellness buttons
    const wellnessButtons = document.querySelectorAll('.btn-wellness');
    wellnessButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openAppointmentModal();
        });
    });
    
    console.log('Appointment modal functionality loaded successfully! 📞');
});

// Responsive Image Handling
function makeImagesResponsive() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add responsive class if not already present
        if (!img.classList.contains('responsive-img')) {
            img.classList.add('responsive-img');
        }
        
        // Ensure proper loading
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            // Add fallback styling for broken images
            this.style.border = '2px dashed #ccc';
            this.style.padding = '20px';
            this.style.backgroundColor = '#f9f9f9';
        });
    });
}

// Enhanced Mobile Touch Support
function enhanceMobileTouch() {
    // Add touch-friendly hover effects for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Remove hover effects on touch devices
        const style = document.createElement('style');
        style.textContent = `
            .touch-device .service-card:hover,
            .touch-device .testimonial-card:hover,
            .touch-device .wellness-card:hover,
            .touch-device .contact-card:hover,
            .touch-device .feature-card:hover,
            .touch-device .stat-card:hover {
                transform: none !important;
            }
            
            .touch-device .btn-primary:hover,
            .touch-device .btn-secondary:hover,
            .touch-device .service-cta:hover,
            .touch-device .btn-wellness:hover {
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced Mobile Scroll Behavior
function enhanceMobileScroll() {
    // Improve scroll performance on mobile
    let ticking = false;
    
    function updateScroll() {
        // Add any scroll-based animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    // Use passive listeners for better performance
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Prevent zoom on double tap for better mobile experience
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Mobile Viewport Height Fix
function fixMobileViewport() {
    // Fix for mobile viewport height issues
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
}

// Initialize responsive features
document.addEventListener('DOMContentLoaded', function() {
    makeImagesResponsive();
    enhanceMobileTouch();
    enhanceMobileScroll();
    fixMobileViewport();
    
    // Add responsive video handling
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.classList.add('responsive-img');
    });
    
    // Handle window resize for responsive adjustments - Already debounced
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            makeImagesResponsive();
            fixMobileViewport();
        }, 250);
    });
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize parallax effects
    initializeParallaxEffects();
    
    console.log('Enhanced responsive features loaded successfully! 📱');
});

// Scroll Animations with IntersectionObserver
function initializeScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // If user prefers reduced motion, show all elements immediately
        const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-card-3d, .animate-zoom-in');
        animatedElements.forEach(el => {
            el.classList.add('animate-in');
        });
        return;
    }
    
    // Create intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('animate-in');
                }, delay);
                
                // Unobserve after animation to improve performance
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-card-3d, .animate-zoom-in');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Parallax Effects
function initializeParallaxEffects() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return;
    }
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(element => {
            const speed = 0.5; // Parallax speed (0.5 = half the scroll speed)
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial call
    updateParallax();
}

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80; // Account for fixed header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll-triggered animations for sections
function addSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize section animations
document.addEventListener('DOMContentLoaded', addSectionAnimations);
