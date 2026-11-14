(function() {
    var root = document.documentElement;
    var fadeTimer = null;

    var revealScrollbar = function() {
        root.classList.add('is-project-scrollbar-visible');

        if (fadeTimer) {
            window.clearTimeout(fadeTimer);
        }

        fadeTimer = window.setTimeout(function() {
            root.classList.remove('is-project-scrollbar-visible');
        }, 500);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', revealScrollbar, { once: true });
    } else {
        revealScrollbar();
    }

    window.addEventListener('pageshow', revealScrollbar);
    window.addEventListener('scroll', revealScrollbar, { passive: true });
})();
