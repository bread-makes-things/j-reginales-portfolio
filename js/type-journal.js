document.addEventListener('DOMContentLoaded', function() {
    var motionFrame = document.getElementById('type-journal-motion');
    var sequenceImage = document.getElementById('type-journal-sequence');

    var frameSources = Array.from({ length: 20 }, function(_, index) {
        var frameNumber = String(index + 1).padStart(2, '0');
        return 'images/type-journal/sequence/frame-' + frameNumber + '.jpg';
    });
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var activeFrame = 0;
    var animationTimer = null;
    var preloadPromise = null;
    var shouldPlay = false;
    var touchPointerActive = false;

    var loadFrames = function(sources) {
        return Promise.all(sources.map(function(source) {
            return new Promise(function(resolve) {
                var image = new Image();
                image.onload = resolve;
                image.onerror = resolve;
                image.src = source;
            });
        }));
    };

    var preloadFrames = function() {
        if (!preloadPromise) {
            preloadPromise = loadFrames(frameSources);
        }

        return preloadPromise;
    };

    var showFrame = function(index) {
        activeFrame = index;
        sequenceImage.src = frameSources[activeFrame];
    };

    var startAnimation = function() {
        if (animationTimer || reducedMotion.matches) {
            return;
        }

        shouldPlay = true;
        motionFrame.classList.add('is-playing');

        preloadFrames().then(function() {
            if (!shouldPlay || animationTimer) {
                return;
            }

            showFrame((activeFrame + 1) % frameSources.length);
            animationTimer = window.setInterval(function() {
                showFrame((activeFrame + 1) % frameSources.length);
            }, 500);

        });
    };

    var stopAnimation = function() {
        shouldPlay = false;
        motionFrame.classList.remove('is-playing');

        if (animationTimer) {
            window.clearInterval(animationTimer);
            animationTimer = null;
        }

        showFrame(0);
    };

    if (motionFrame && sequenceImage) {
        motionFrame.addEventListener('mouseenter', startAnimation);
        motionFrame.addEventListener('mouseleave', stopAnimation);
        motionFrame.addEventListener('pointerdown', function(event) {
            touchPointerActive = event.pointerType === 'touch';
        });

        motionFrame.addEventListener('focus', function() {
            if (!touchPointerActive) {
                startAnimation();
            }
        });
        motionFrame.addEventListener('blur', stopAnimation);

        motionFrame.addEventListener('pointerup', function(event) {
            if (event.pointerType !== 'touch') {
                return;
            }

            if (shouldPlay) {
                stopAnimation();
            } else {
                startAnimation();
            }

            window.setTimeout(function() {
                touchPointerActive = false;
            }, 0);
        });

        motionFrame.addEventListener('pointercancel', function() {
            touchPointerActive = false;
        });

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                if (entries.some(function(entry) { return entry.isIntersecting; })) {
                    preloadFrames();
                    observer.disconnect();
                }
            }, { rootMargin: '400px' });

            observer.observe(motionFrame);
        }
    }

    document.querySelectorAll('[data-carousel]').forEach(function(carousel) {
        var viewport = carousel.querySelector('[data-carousel-viewport]');
        var slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
        var dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
        var activeSlide = 0;

        if (!viewport || slides.length === 0) {
            return;
        }

        var showSlide = function(index) {
            activeSlide = (index + slides.length) % slides.length;

            slides.forEach(function(slide, slideIndex) {
                var isActive = slideIndex === activeSlide;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });

            dots.forEach(function(dot, dotIndex) {
                var isActive = dotIndex === activeSlide;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-pressed', String(isActive));
            });

            viewport.setAttribute(
                'aria-label',
                'Photograph ' + (activeSlide + 1) + ' of ' + slides.length + '. Click to show the next photograph.'
            );
        };

        viewport.addEventListener('click', function() {
            showSlide(activeSlide + 1);
        });

        viewport.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                showSlide(activeSlide + 1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showSlide(activeSlide - 1);
            } else if (event.key === 'Home') {
                event.preventDefault();
                showSlide(0);
            } else if (event.key === 'End') {
                event.preventDefault();
                showSlide(slides.length - 1);
            }
        });

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener('click', function() {
                showSlide(dotIndex);
            });
        });
    });
});
