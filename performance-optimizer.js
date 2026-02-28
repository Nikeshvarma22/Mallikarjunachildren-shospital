// Performance Optimizer - Only speed improvements, no UI changes
(function() {
    'use strict';
    
    // Optimize image loading
    function optimizeImageLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Optimize scroll performance
    function optimizeScrollPerformance() {
        let ticking = false;
        
        function updateScrollElements() {
            // Update all scroll-dependent elements here
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Optimize resize performance
    function optimizeResizePerformance() {
        let resizeTimeout;
        
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Handle resize operations here
            }, 250);
        }
        
        window.addEventListener('resize', handleResize, { passive: true });
    }
    
    // Optimize animation performance
    function optimizeAnimations() {
        // Use transform and opacity for better performance
        const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-card-3d, .animate-zoom-in');
        
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    }
    
    // Optimize font loading
    function optimizeFontLoading() {
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                document.body.classList.add('fonts-loaded');
            });
        }
    }
    
    // Initialize performance optimizations
    function init() {
        optimizeImageLoading();
        optimizeScrollPerformance();
        optimizeResizePerformance();
        optimizeAnimations();
        optimizeFontLoading();
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Clean up will-change properties after animations
    function cleanupWillChange() {
        const elements = document.querySelectorAll('[style*="will-change"]');
        elements.forEach(el => {
            setTimeout(() => {
                el.style.willChange = 'auto';
            }, 1000);
        });
    }
    
    // Run cleanup periodically
    setInterval(cleanupWillChange, 5000);
    
})();
