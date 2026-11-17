document.addEventListener('DOMContentLoaded', function() {
    var galleryItems = Array.from(document.querySelectorAll('[data-expandable-image]'));

    if (galleryItems.length === 0) {
        return;
    }

    var pageContent = document.querySelector('main');
    var lightbox = document.createElement('div');
    var closeButton = document.createElement('button');
    var lightboxImage = document.createElement('img');
    var activeGalleryItem = null;

    lightbox.className = 'project-image-lightbox';
    lightbox.hidden = true;
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded project image');

    closeButton.className = 'project-image-lightbox-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close expanded image');
    closeButton.textContent = '[close ×]';

    lightboxImage.className = 'project-image-lightbox-image';
    lightboxImage.alt = '';

    lightbox.append(closeButton, lightboxImage);
    document.body.appendChild(lightbox);

    var updateParentLightboxState = function(isOpen) {
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'project-image-lightbox',
                isOpen: isOpen
            }, window.location.origin);
        }
    };

    var closeLightbox = function() {
        lightbox.hidden = true;
        lightboxImage.removeAttribute('src');
        lightboxImage.alt = '';
        document.body.classList.remove('is-project-lightbox-open');
        pageContent.inert = false;
        updateParentLightboxState(false);

        if (activeGalleryItem) {
            activeGalleryItem.focus();
            activeGalleryItem = null;
        }
    };

    var openLightbox = function(item) {
        var image = item.querySelector('img');

        if (!image) {
            return;
        }

        activeGalleryItem = item;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.hidden = false;
        document.body.classList.add('is-project-lightbox-open');
        pageContent.inert = true;
        updateParentLightboxState(true);
        closeButton.focus();
    };

    galleryItems.forEach(function(item) {
        item.classList.add('project-expandable-image');

        if (item.tagName !== 'BUTTON') {
            item.setAttribute('role', 'button');
            item.tabIndex = 0;
        }

        item.addEventListener('click', function(event) {
            if (event.target.closest('[data-no-image-expand]')) {
                return;
            }

            openLightbox(item);
        });

        item.addEventListener('keydown', function(event) {
            if (event.target.closest('[data-no-image-expand]')) {
                return;
            }

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(item);
            }
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !lightbox.hidden) {
            closeLightbox();
        }
    });
});
