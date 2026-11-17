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
