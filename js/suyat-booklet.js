document.addEventListener('DOMContentLoaded', function() {
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

            viewport.setAttribute('aria-label', 'Website screenshot ' + (activeSlide + 1) + ' of ' + slides.length + '. Click to show the next screenshot.');
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

    var motionFrame = document.getElementById('suyat-motion');
    var motionImage = document.getElementById('suyat-motion-image');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var touchPointerActive = false;

    if (!motionFrame || !motionImage) {
        return;
    }

    var frameSources = Array.from({ length: 5 }, function(_, index) {
        var frameNumber = String(index + 1).padStart(2, '0');
        return 'images/suyat-booklet/booklet-sequence/frame-' + frameNumber + '.jpg';
    });
    var frameDuration = 750;
    var activeFrame = 0;
    var playbackTimer = null;
    var initialPlaybackActive = true;

    var showFrame = function(index) {
        activeFrame = index;
        motionImage.src = frameSources[activeFrame];
    };

    var stopSequence = function() {
        window.clearInterval(playbackTimer);
        playbackTimer = null;
        motionFrame.classList.remove('is-playing');
        showFrame(0);
    };

    var startSequence = function(loop) {
        if (reducedMotion.matches || playbackTimer !== null) {
            return;
        }

        motionFrame.classList.add('is-playing');
        showFrame(0);

        playbackTimer = window.setInterval(function() {
            var nextFrame = activeFrame + 1;

            if (nextFrame >= frameSources.length) {
                if (loop) {
                    showFrame(0);
                } else {
                    stopSequence();
                    initialPlaybackActive = false;

                    if (
                        motionFrame.matches(':hover') ||
                        document.activeElement === motionFrame
                    ) {
                        startSequence(true);
                    }
                }

                return;
            }

            showFrame(nextFrame);
        }, frameDuration);
    };

    var startHoverSequence = function() {
        if (!initialPlaybackActive) {
            startSequence(true);
        }
    };

    var stopHoverSequence = function() {
        if (!initialPlaybackActive) {
            stopSequence();
        }
    };

    motionFrame.addEventListener('mouseenter', startHoverSequence);
    motionFrame.addEventListener('mouseleave', stopHoverSequence);
    motionFrame.addEventListener('pointerdown', function(event) {
        touchPointerActive = event.pointerType === 'touch';
    });
    motionFrame.addEventListener('focus', function() {
        if (!touchPointerActive) {
            startHoverSequence();
        }
    });
    motionFrame.addEventListener('blur', stopHoverSequence);
    motionFrame.addEventListener('pointerup', function(event) {
        if (event.pointerType !== 'touch') {
            return;
        }

        if (motionFrame.classList.contains('is-playing')) {
            stopHoverSequence();
        } else {
            startHoverSequence();
        }

        window.setTimeout(function() {
            touchPointerActive = false;
        }, 0);
    });

    if (reducedMotion.matches) {
        initialPlaybackActive = false;
        return;
    }

    Promise.all(frameSources.map(function(source) {
        return new Promise(function(resolve) {
            var preloadImage = new Image();
            preloadImage.onload = resolve;
            preloadImage.onerror = resolve;
            preloadImage.src = source;
        });
    })).then(function() {
        startSequence(false);
    });
});
