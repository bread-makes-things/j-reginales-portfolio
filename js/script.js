document.addEventListener('DOMContentLoaded', function() {
    var dateDisplay = document.querySelector('.home-intro-date');
    var menuLinks = document.querySelectorAll('.home-menu a');
    var resumeSection = document.getElementById('resume');
    var resumeClear = document.querySelector('.resume-clear');
    var resumeToggle = document.querySelector('.resume-toggle');
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
            e.data.type !== 'nabua-image-lightbox'
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

$(document).ready(function() {
    var eventDivs = $('.event');
    var $projectsFrame = $('#projects');
    var currentIndex = 0;
    var moveBoxes = false;
    var isActive = false;
    var secondIndex = 1;
    var thirdIndex = 2;
    var fourthIndex = 3;
    var eventClicked = false;
    var mouseMove = function(e) {
      var static = 'images/suyat/output-onlinegiftoolsStatic.png';
      var gif = 'images/suyat/output-onlinegiftools.gif'; // Ensure this GIF loops forever
  
      var motionStatic = 'images/motion/motionStatic.jpg';
      var motionGif = 'images/motion/motion.gif'; // Ensure this GIF loops forever

      var HMstatic = 'images/hotMess/hotMess.jpg';
      var HMGif = 'images/hotMess/hotmess.gif';
    
      $('#suyat').hover(

        function() {
            // console.log("Hovering over #suyat");
            $(this).find('.suyatGif').attr('src', gif);
        },
        function() {
            $(this).find('.suyatGif').attr('src', static);
        }
      );
  
      $('#takahashi_kuan').hover(
        function() {
            $(this).find('.DucGIF').attr('src', motionGif);
        },
        function() {
            $(this).find('.DucGIF').attr('src', motionStatic);
        }
      );

      $('#sebastian_aubin').hover(
        function() {
            $(this).find('.hotMessGif').attr('src', HMGif);
        },
        function() {
            $(this).find('.hotMessGif').attr('src', HMstatic);
        }
        );
  
      var mouseFollow = function() {

//------------- title following mouse -------------------------
        // var mouseX = e.pageX;
        // var mouseY = e.pageY;
  
        // var gdElement = $('.GD');
        // var gdX = gdElement.offset().left;
        // var gdY = gdElement.offset().top;
  
        // var gdXdistanceFromMiddle = Math.abs(mouseX - gdX) - gdElement.width() / 2;
        // var gdYdistanceFromMiddle = Math.abs(mouseY - gdY) - gdElement.height() / 2;
  
        // var newgdX = gdX - gdXdistanceFromMiddle;
        // var newgdY = gdY - gdYdistanceFromMiddle;
  
        // $('.GD').css({
        //     "top": newgdY / 25 + "px",
        //     "left": newgdX / 25 + "px",
        // });
  //------------- title following mouse -------------------------

  
        if (!isActive) {
            var $currentEventDiv = $(eventDivs[currentIndex]);
            var frameBounds = $projectsFrame[0].getBoundingClientRect();
            var eventWidth = $currentEventDiv.outerWidth();
            var eventHeight = $currentEventDiv.outerHeight();
            var leftPos = e.clientX - frameBounds.left - (eventWidth / 2);
            var topPos = e.clientY - frameBounds.top - (eventHeight / 2);
            var maxLeft = Math.max(0, frameBounds.width - eventWidth);
            var maxTop = Math.max(0, frameBounds.height - eventHeight);

            leftPos = Math.max(0, Math.min(leftPos, maxLeft));
            topPos = Math.max(0, Math.min(topPos, maxTop));
  
            $currentEventDiv.css({
                "top": topPos + "px",
                "left": leftPos + "px",
                "z-index": 999,
                "font-family": "RedactionReg",
                "font-size": "8pt",
                "line-height": "12pt",
                "text-decoration": "none",
            });
  
            $(eventDivs[currentIndex]).css({
                "transform": "scale(1)",
            });
  
            $(eventDivs[secondIndex]).css({
                "transform": "scale(0.5)",
                "overflow": "hidden"
            });
  
            $(eventDivs[thirdIndex]).css({
                "transform": "scale(0.75)",
                "overflow": "hidden"
            });
  
            $(eventDivs[fourthIndex]).css({
                "transform": "scale(0.85)",
                "overflow": "hidden"
            });
  
            currentIndex = (currentIndex + 1) % eventDivs.length;
            secondIndex = (secondIndex + 1) % eventDivs.length;
            thirdIndex = (thirdIndex + 1) % eventDivs.length;
            fourthIndex = (fourthIndex + 1) % eventDivs.length;
            isActive = true;
            eventClicked = false;
        }
      };
      mouseFollow();
    };
  
    $projectsFrame.on('mousemove', mouseMove);


  
    $('.event').on('mouseleave', function() {
        if (!moveBoxes) {
            // $('.GD').text("Portfolio!");
            isActive = false;
  
            // $(".close").css({
            //     'opacity': '0',
            // });
  
            $('.event').css({
                "z-index": 1,
            });
  
            // $("body").css({
            //     'background-image': "none"
            // });
        }




        var topEvent = $(this).attr('id');

        if (topEvent === 'suyat') {
            $('.name').text('"Motion Studies"')
        }

        if (topEvent === 'takahashi_kuan') {
            $('.name').text('"Sirius"')
        }

        if (topEvent === 'e_roon_kang') {
            $('.name').text('"Hot Mess"')
        }

        if (topEvent === 'sebastian_aubin') {
            $('.name').text('"Suyat Scripts"')
        }

        
    });
  
    $('.event').on('click', function() {

        var eventID = $(this).attr('id');
  
        if (!eventClicked) {

            if (eventID === 'suyat') {
                console.log("WORKS");
                window.location.href = 'booksIndex.html'; // Link to suyatindex.html
            }

            //----------------------------------------- MOTION I-frame-------------------------
  
            if (eventID === 'takahashi_kuan') {
                console.log("Takahashi");
  
                window.location.href = 'motionIndex.html'; // Link to suyatindex.html
            
            }

            if (eventID === 'sebastian_aubin') {
                console.log("Seb");
  
                window.location.href = 'hotmessIndex.html'; // Link to suyatindex.html
            
            }
            
        }
  
        eventClicked = true;
    });
  
    var currentHeight = $(eventDivs[fourthIndex]).height();
    $(eventDivs[fourthIndex]).height(currentHeight);
  
    if ($(eventDivs[fourthIndex]).height() > 33 * $(window).height() / 100) {
        $(eventDivs).draggable({
            containment: '#projects'
        });
  
        $('.event').css({
            'position': 'absolute',
        });
    }
  
    // $('.event').on('click', function() {
    //     var eventID = $(this).attr('id');
  
    //     var textMappings = {
    //         'takahashi_kuan': 'Text for Emi Takahashi & Michelle Kuan',
    //         'e_roon_kang': 'Text for E Roon Kang',
    //         'sebastian_aubin': 'Text for Sebastian Aubin',
    //         'suyat': 'SUYAT',
    //     };
  
    //     if ($(this).is(eventDivs[fourthIndex])) {
    //         $('.GD').text(textMappings[eventID]);
    //     }
    // });
  });





  //----------------iframe stuff---------------------

            //   var iframeContainer = $('<div class="iframe-container"></div>').css({
            //     'width': '93%',
            //     'height': '100%',
            //     'z-index': '9999',
            //     'position': 'fixed',
            //     'padding-left': '30px',
            //     'top': '50%',
            //     'left': '50%',
            //     'transform': 'translate(-50%, -50%)',
            //     'background-color': '#fff',
            //     'border-left': '1px solid black',
            // });

            // var closeButton = $('<button class="close-button" title="back">&#x261C;</button>').css({
            //     position: 'absolute',
            //     left: '0px',
            //     'margin-top': '20px',
            //     // 'border': 'red 1px solid',
            // });

            // closeButton.on('click', function() {
            //     iframeContainer.remove();
            //     isActive = false;
            //     moveBoxes = false;

            //     $('.event').css({
            //       'opacity': '1',
            //     });

            //     $('section').css({
            //       'height': 'auto',
            //     });
            // });
      // $('.event').on('click', function(e) {
    //     var $currentEventDiv = $(eventDivs[currentIndex]);
    //     var leftPos = e.pageX - ($currentEventDiv.outerWidth() / 2);
    //     var topPos = e.pageY - ($currentEventDiv.outerHeight() / 2);
  
    //     if (!eventClicked) {
    //         var eventID = $(this).attr('id');
    //         isActive = true;
    //         moveBoxes = true;

    //         if (eventID === 'suyat') {
    //             console.log("WORKS");
  
    //             var booksIndex = 'booksIndex.html';
  
    //             var iframe = $('<iframe>', {
    //                 src: booksIndex,
    //                 width: '100%',
    //                 height: '100%',
    //                 frameborder: '0',
    //                 margin: '20px',
    //             });
  
    //             iframeContainer.append(closeButton);
    //             iframeContainer.(iframe);
  
    //             $('body').append(iframeContainer);
  
    //             $('.event').css({
    //               'opacity': '0',
    //             });

    //         }
