$(document).ready(function() {
    var eventDivs = $('.event');
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
            var leftPos = e.pageX - ($currentEventDiv.outerWidth() / 2);
            var topPos = e.pageY - ($currentEventDiv.outerHeight() / 2);
  
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
  
    $(document).on('mousemove', mouseMove);


  
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
        $(eventDivs).draggable();
  
        $('.event').css({
            'position': 'fixed',
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