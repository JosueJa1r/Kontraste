document.addEventListener('DOMContentLoaded', () => {
    // --- HAMBURGER MENU LOGIC ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // --- SLIDER LOGIC ---
    const setupSlider = (sliderSelector, slideItemSelector, interval) => {
        const slider = document.querySelector(sliderSelector);
        if (!slider) return;

        const slides = slider.querySelectorAll(slideItemSelector);
        if (slides.length > 1) {
            let currentSlide = 0;
            const maxSlide = slides.length - 1;

            const goToSlide = (slideIndex) => {
                slides.forEach((s, i) => {
                    s.style.transform = `translateX(${100 * (i - slideIndex)}%)`;
                });
            };

            const nextSlide = () => {
                currentSlide = (currentSlide === maxSlide) ? 0 : currentSlide + 1;
                goToSlide(currentSlide);
            };
            
            goToSlide(0);
            setInterval(nextSlide, interval);
        }
    };

    setupSlider('.slider', '.slide', 5000);
    setupSlider('.mini-slider', '.mini-slide', 4000);

    // --- REVEAL SECTIONS ON SCROLL ---
    const allSections = document.querySelectorAll('.section--hidden');

    const revealSection = function (entries, observer) {
        const [entry] = entries;

        if (!entry.isIntersecting) return;

        entry.target.classList.remove('section--hidden');
        observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15, // Section is revealed when 15% is visible
    });

    allSections.forEach(section => sectionObserver.observe(section));

    // --- IMAGE MODAL FUNCTIONALITY ---
    let currentImageSet = [];
    let currentImageIndex = 0;

    window.openImageModal = function(img) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const captionText = document.getElementById('caption');
        const imageCounter = document.getElementById('imageCounter');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Find the slider container for this image
        const slider = img.closest('.image-slider');
        if (slider) {
            // Get all images from the same slider
            const sliderImages = slider.querySelectorAll('.slider-img');
            currentImageSet = Array.from(sliderImages).map(img => ({
                src: img.src,
                alt: img.alt
            }));
        } else {
            // Single image
            currentImageSet = [{
                src: img.src,
                alt: img.alt
            }];
        }
        
        // Find current image index
        currentImageIndex = currentImageSet.findIndex(image => image.src === img.src);
        
        modal.style.display = 'block';
        modalImg.src = currentImageSet[currentImageIndex].src;
        captionText.innerHTML = currentImageSet[currentImageIndex].alt;
        
        // Update counter
        imageCounter.innerHTML = `${currentImageIndex + 1} / ${currentImageSet.length}`;
        
        // Show/hide navigation buttons
        prevBtn.style.display = currentImageSet.length > 1 ? 'block' : 'none';
        nextBtn.style.display = currentImageSet.length > 1 ? 'block' : 'none';
        
        // Update button states
        updateNavigationButtons();
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    };

    window.closeImageModal = function() {
        const modal = document.getElementById('imageModal');
        modal.style.display = 'none';
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    };

    window.nextImage = function() {
        if (currentImageSet.length <= 1) return;
        
        currentImageIndex = (currentImageIndex + 1) % currentImageSet.length;
        updateModalImage();
    };

    window.previousImage = function() {
        if (currentImageSet.length <= 1) return;
        
        currentImageIndex = (currentImageIndex - 1 + currentImageSet.length) % currentImageSet.length;
        updateModalImage();
    };

    function updateModalImage() {
        const modalImg = document.getElementById('modalImage');
        const captionText = document.getElementById('caption');
        const imageCounter = document.getElementById('imageCounter');
        
        modalImg.src = currentImageSet[currentImageIndex].src;
        captionText.innerHTML = currentImageSet[currentImageIndex].alt;
        imageCounter.innerHTML = `${currentImageIndex + 1} / ${currentImageSet.length}`;
        
        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Enable/disable buttons based on current position
        prevBtn.disabled = currentImageSet.length <= 1;
        nextBtn.disabled = currentImageSet.length <= 1;
    }

    // Close modal when clicking outside the image
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        
        if (event.target === modal) {
            closeImageModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeImageModal();
        } else if (event.key === 'ArrowLeft') {
            previousImage();
        } else if (event.key === 'ArrowRight') {
            nextImage();
        }
    });

    // --- IMAGE SLIDER FUNCTIONALITY ---
    const setupImageSlider = (sliderId, interval) => {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const images = slider.querySelectorAll('.slider-img');
        if (images.length <= 1) return;

        let currentImageIndex = 0;

        const showImage = (index) => {
            images.forEach((img, i) => {
                img.classList.remove('active');
                if (i === index) {
                    img.classList.add('active');
                }
            });
        };

        const nextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showImage(currentImageIndex);
        };

        // Start the slider
        showImage(0);
        setInterval(nextImage, interval);
    };

    // Setup the comercio3 slider
    setupImageSlider('comercio3-slider', 3000); // Change image every 3 seconds

    // Setup the comercio4 slider
    setupImageSlider('comercio4-slider', 3000); // Change image every 3 seconds

    // --- SMOOTH SCROLL FOR PORTFOLIO SECTIONS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Remove section--hidden class to make section visible immediately
                targetElement.classList.remove('section--hidden');
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // --- HANDLE ANCHOR LINKS FROM OTHER PAGES ---
    // Check if there's an anchor in the URL when page loads
    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.getElementById(hash.substring(1));
            if (targetElement) {
                // Remove section--hidden class to make section visible
                targetElement.classList.remove('section--hidden');
                
                // Scroll to the section after a short delay to ensure page is loaded
                setTimeout(() => {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    });

});