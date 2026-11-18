document.addEventListener('DOMContentLoaded', function() {
    var dateDisplay = document.querySelector('.home-intro-date');
    var menuLinks = document.querySelectorAll('.home-menu a');
    var resumeSection = document.getElementById('resume');
    var resumeClear = document.querySelector('.resume-clear');
    var resumeToggle = document.querySelector('.resume-toggle');
    var resumeDownloadClosed = document.querySelector('.resume-download-closed');
    var worksToggle = document.querySelector('.works-toggle');
    var worksProjectList = document.getElementById('works-project-list');
    var projectLinks = document.querySelectorAll('.project-link');
    var contactLink = document.querySelector('.home-menu a[href^="mailto:"]');
    var projectViewer = document.getElementById('project-viewer');
    var projectFrame = document.getElementById('project-frame');
    var projectViewerClose = document.querySelector('.project-viewer-close');

    if (dateDisplay) {
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');

        dateDisplay.textContent = year + '.' + month + '.' + day;
        dateDisplay.setAttribute('datetime', year + '-' + month + '-' + day);
    }

    var setWorksOpen = function(isOpen) {
        worksProjectList.hidden = !isOpen;
        worksToggle.setAttribute('aria-expanded', String(isOpen));
    };

    var setMenuItemActive = function(link, isActive) {
        link.classList.toggle('is-selected', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'true');
        } else {
            link.removeAttribute('aria-current');
        }
    };

    var clearProjectSelection = function() {
        projectLinks.forEach(function(link) {
            setMenuItemActive(link, false);
        });
    };

    var setResumeOpen = function(isOpen) {
        resumeSection.hidden = !isOpen;
        resumeToggle.hidden = isOpen;
        resumeDownloadClosed.hidden = isOpen;
        resumeToggle.classList.toggle('is-selected', isOpen);
        resumeToggle.setAttribute('aria-expanded', String(isOpen));

        if (isOpen) {
            resumeSection.classList.add('resume-fast-reveal');
        } else {
            resumeSection.classList.remove('resume-fast-reveal');
        }

    };

    var openProjectViewer = function(source) {
        document.body.classList.remove('is-project-image-open');

        if (projectFrame.getAttribute('src') !== source) {
            projectFrame.setAttribute('src', source);
        }

        projectViewer.hidden = false;
        document.body.classList.add('is-project-open');
        projectViewerClose.focus();
    };

    var closeProjectViewer = function() {
        projectViewer.hidden = true;
        document.body.classList.remove('is-project-open');
        document.body.classList.remove('is-project-image-open');
        clearProjectSelection();
        document.querySelector('.project-link[data-project-frame="nabua"]').focus();
    };

    menuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var target = link.getAttribute('href');

            if (target === '#projects') {
                e.preventDefault();
                var shouldOpen = worksProjectList.hidden;
                setWorksOpen(shouldOpen);
                setMenuItemActive(worksToggle, shouldOpen);
                setMenuItemActive(contactLink, false);

                if (!shouldOpen) {
                    clearProjectSelection();
                }
            } else if (link.classList.contains('project-link')) {
                e.preventDefault();
                setResumeOpen(false);
                setWorksOpen(true);
                setMenuItemActive(worksToggle, true);
                setMenuItemActive(contactLink, false);
                clearProjectSelection();
                setMenuItemActive(link, true);

                if (link.dataset.projectFrame) {
                    openProjectViewer(target);
                }
            } else {
                setWorksOpen(false);
                setMenuItemActive(worksToggle, false);
                clearProjectSelection();
                setMenuItemActive(contactLink, true);
            }
        });
    });

    resumeToggle.addEventListener('click', function() {
        setResumeOpen(resumeSection.hidden);
        setMenuItemActive(contactLink, false);
    });

    resumeClear.addEventListener('click', function() {
        setResumeOpen(false);
        resumeToggle.focus();
    });

    projectViewerClose.addEventListener('click', closeProjectViewer);

    window.addEventListener('message', function(e) {
        if (
            e.origin !== window.location.origin ||
            e.source !== projectFrame.contentWindow ||
            !e.data ||
            e.data.type !== 'project-image-lightbox'
        ) {
            return;
        }

        document.body.classList.toggle('is-project-image-open', Boolean(e.data.isOpen));
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !projectViewer.hidden) {
            closeProjectViewer();
        }
    });
});
