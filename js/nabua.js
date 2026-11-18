document.addEventListener('DOMContentLoaded', function() {
    var glyphGrid = document.getElementById('glyph-grid');
    var glyphCanvas = document.getElementById('glyph-canvas');
    var metricField = document.querySelector('.metric-field');
    var glyphName = document.getElementById('glyph-name');
    var unicodeName = document.getElementById('unicode-name');
    var unicodeHex = document.getElementById('unicode-hex');
    var scriptToggle = document.getElementById('script-toggle');
    var gridTitle = document.getElementById('grid-title');
    var glyphCount = document.getElementById('glyph-count');
    var layout = document.querySelector('.nabua-layout');
    var typeTesterText = document.getElementById('type-tester-text');
    var typeTesterSize = document.getElementById('type-tester-size');
    var introCarousel = document.querySelector('.intro-carousel');
    var introCarouselViewport = document.querySelector('.intro-carousel-viewport');
    var introSlides = Array.from(document.querySelectorAll('.intro-slide'));
    var introDots = Array.from(document.querySelectorAll('.intro-carousel-dot'));
    var currentSet = 'latin';
    var currentGlyph = null;
    var activeButton = null;
    var combiningCanvases = [];
    var notdefGlyph = window.NabuaNotdef;
    var notdefPath = new Path2D();
    var markPaths = {};

    var appendPathCommands = function(path, commands) {
        commands.forEach(function(command) {
            if (command[0] === 'M') {
                path.moveTo(command[1], command[2]);
            } else if (command[0] === 'L') {
                path.lineTo(command[1], command[2]);
            } else if (command[0] === 'Q') {
                path.quadraticCurveTo(command[1], command[2], command[3], command[4]);
            } else if (command[0] === 'C') {
                path.bezierCurveTo(
                    command[1],
                    command[2],
                    command[3],
                    command[4],
                    command[5],
                    command[6]
                );
            } else if (command[0] === 'Z') {
                path.closePath();
            }
        });
    };

    appendPathCommands(notdefPath, notdefGlyph.commands);
    Object.keys(notdefGlyph.marks).forEach(function(codePoint) {
        var markPath = new Path2D();
        appendPathCommands(markPath, notdefGlyph.marks[codePoint].commands);
        markPaths[codePoint] = markPath;
    });

    var punctuationNames = {
        32: 'Space', 33: 'Exclamation Mark', 34: 'Quotation Mark', 35: 'Number Sign',
        36: 'Dollar Sign', 37: 'Percent Sign', 38: 'Ampersand', 39: 'Apostrophe',
        40: 'Left Parenthesis', 41: 'Right Parenthesis', 42: 'Asterisk', 43: 'Plus Sign',
        44: 'Comma', 45: 'Hyphen-Minus', 46: 'Full Stop', 47: 'Solidus',
        58: 'Colon', 59: 'Semicolon', 60: 'Less-Than Sign', 61: 'Equals Sign',
        62: 'Greater-Than Sign', 63: 'Question Mark', 64: 'Commercial At',
        91: 'Left Square Bracket', 92: 'Reverse Solidus', 93: 'Right Square Bracket',
        94: 'Circumflex Accent', 95: 'Low Line', 96: 'Grave Accent',
        123: 'Left Curly Bracket', 124: 'Vertical Line', 125: 'Right Curly Bracket',
        126: 'Tilde'
    };

    var baybayinNames = {
        0x1700: 'Tagalog Letter A', 0x1701: 'Tagalog Letter I', 0x1702: 'Tagalog Letter U',
        0x1703: 'Tagalog Letter Ka', 0x1704: 'Tagalog Letter Ga', 0x1705: 'Tagalog Letter Nga',
        0x1706: 'Tagalog Letter Ta', 0x1707: 'Tagalog Letter Da', 0x1708: 'Tagalog Letter Na',
        0x1709: 'Tagalog Letter Pa', 0x170A: 'Tagalog Letter Ba', 0x170B: 'Tagalog Letter Ma',
        0x170C: 'Tagalog Letter Ya', 0x170D: 'Tagalog Letter Ra', 0x170E: 'Tagalog Letter La',
        0x170F: 'Tagalog Letter Wa', 0x1710: 'Tagalog Letter Sa', 0x1711: 'Tagalog Letter Ha',
        0x1712: 'Tagalog Vowel Sign I', 0x1713: 'Tagalog Vowel Sign U',
        0x1714: 'Tagalog Sign Virama', 0x1715: 'Tagalog Sign Pamudpod',
        0x171F: 'Tagalog Letter Archaic Ra'
    };

    var combiningBaybayin = new Set([0x1712, 0x1713, 0x1714, 0x1715]);

    var unicodeLabel = function(codePoint) {
        if (codePoint >= 65 && codePoint <= 90) {
            return 'Latin Capital Letter ' + String.fromCodePoint(codePoint);
        }

        if (codePoint >= 97 && codePoint <= 122) {
            return 'Latin Small Letter ' + String.fromCodePoint(codePoint).toUpperCase();
        }

        if (codePoint >= 48 && codePoint <= 57) {
            return 'Digit ' + String.fromCodePoint(codePoint);
        }

        return punctuationNames[codePoint] || 'Basic Latin Character';
    };

    var makeGlyph = function(codePoint, name) {
        var value = String.fromCodePoint(codePoint);
        var isCombining = combiningBaybayin.has(codePoint);

        return {
            value: value,
            preview: codePoint === 32 ? '' : value,
            name: codePoint === 32 ? 'Space' : (isCombining ? '\u25CC' + value : value),
            unicodeName: name,
            hex: 'U+' + codePoint.toString(16).toUpperCase().padStart(4, '0'),
            decimal: codePoint,
            isCombining: isCombining
        };
    };

    var latinGlyphs = Array.from({ length: 95 }, function(_, index) {
        var codePoint = index + 32;
        return makeGlyph(codePoint, unicodeLabel(codePoint));
    });

    var baybayinGlyphs = Object.keys(baybayinNames).map(function(codePoint) {
        var numericCodePoint = Number(codePoint);
        return makeGlyph(numericCodePoint, baybayinNames[numericCodePoint]);
    });
    var measurement = function(context, character, property, fallback) {
        var value = context.measureText(character)[property];
        return Number.isFinite(value) && value > 0 ? value : fallback;
    };

    var textInkBounds = function(context, glyph) {
        var metrics = context.measureText(glyph.preview);
        var halfAdvance = metrics.width / 2;

        return {
            left: Number.isFinite(metrics.actualBoundingBoxLeft)
                ? Math.max(0, metrics.actualBoundingBoxLeft)
                : halfAdvance,
            right: Number.isFinite(metrics.actualBoundingBoxRight)
                ? Math.max(0, metrics.actualBoundingBoxRight)
                : halfAdvance,
            ascent: Number.isFinite(metrics.actualBoundingBoxAscent)
                ? Math.max(0, metrics.actualBoundingBoxAscent)
                : 0,
            descent: Number.isFinite(metrics.actualBoundingBoxDescent)
                ? Math.max(0, metrics.actualBoundingBoxDescent)
                : 0
        };
    };

    var combiningInkBounds = function(glyph) {
        var metrics = guideMetrics(glyph);
        var notdefHalfWidth = metrics.notdefBounds.width / 2;
        var mark = notdefGlyph.marks[glyph.hex.slice(2)].bounds;

        return {
            left: Math.max(notdefHalfWidth, -metrics.markLeft),
            right: Math.max(notdefHalfWidth, metrics.markRight),
            ascent: Math.max(
                metrics.notdefBounds.y + metrics.notdefBounds.height,
                mark.y + mark.height
            ),
            descent: Math.max(-metrics.notdefBounds.y, -mark.y)
        };
    };

    var scriptInkBounds = function(context, glyphs) {
        var bounds = {
            left: 1,
            right: 1,
            ascent: 1,
            descent: 1
        };

        context.save();
        context.font = notdefGlyph.unitsPerEm + 'px Nabua';
        context.textAlign = 'center';
        context.textBaseline = 'alphabetic';

        glyphs.forEach(function(glyph) {
            if (!glyph.preview) {
                return;
            }

            var glyphBounds = glyph.isCombining
                ? combiningInkBounds(glyph)
                : textInkBounds(context, glyph);

            bounds.left = Math.max(bounds.left, glyphBounds.left);
            bounds.right = Math.max(bounds.right, glyphBounds.right);
            bounds.ascent = Math.max(bounds.ascent, glyphBounds.ascent);
            bounds.descent = Math.max(bounds.descent, glyphBounds.descent);
        });

        context.restore();
        return bounds;
    };

    var scriptFit = function(context, glyphs, width, height) {
        var referenceSize = notdefGlyph.unitsPerEm;
        var bounds = scriptInkBounds(context, glyphs);
        var horizontalExtent = Math.max(bounds.left, bounds.right);
        var horizontalPadding = Math.max(12, width * 0.09);
        var verticalPadding = Math.max(12, height * 0.06);
        var horizontalScale = (width / 2 - horizontalPadding) / horizontalExtent;
        var verticalScale = (height - verticalPadding * 2) / (bounds.ascent + bounds.descent);
        var scale = Math.max(0.001, Math.min(horizontalScale, verticalScale));
        var usedHeight = (bounds.ascent + bounds.descent) * scale;
        var baseline = (height - usedHeight) / 2 + bounds.ascent * scale;

        context.save();
        context.font = referenceSize + 'px Nabua';
        var ascender = measurement(context, 'l', 'actualBoundingBoxAscent', 780);
        var capHeight = measurement(context, 'B', 'actualBoundingBoxAscent', 700);
        var xHeight = measurement(context, 'x', 'actualBoundingBoxAscent', 500);
        var descender = measurement(context, 'J', 'actualBoundingBoxDescent', 200);
        context.restore();

        return {
            fontSize: referenceSize * scale,
            baseline: baseline,
            metricPositions: {
                ascender: baseline - ascender * scale,
                cap: baseline - capHeight * scale,
                x: baseline - xHeight * scale,
                baseline: baseline,
                descender: baseline + descender * scale
            }
        };
    };

    var guideMetrics = function(glyph) {
        var referenceSize = notdefGlyph.unitsPerEm;
        var notdefBounds = notdefGlyph.bounds;
        var notdefCenterXOffset = notdefBounds.x + notdefBounds.width / 2;
        var notdefCenterYOffset = -(notdefBounds.y + notdefBounds.height / 2);
        var kaCenterXOffset = notdefGlyph.kaBounds.x + notdefGlyph.kaBounds.width / 2;
        var mark = notdefGlyph.marks[glyph.hex.slice(2)];
        var markLeft = mark.bounds.x - kaCenterXOffset;
        var markRight = mark.bounds.x + mark.bounds.width - kaCenterXOffset;
        var markTop = -(mark.bounds.y + mark.bounds.height);
        var markBottom = -mark.bounds.y;

        return {
            referenceSize: referenceSize,
            notdefBounds: notdefBounds,
            notdefCenterXOffset: notdefCenterXOffset,
            notdefCenterYOffset: notdefCenterYOffset,
            kaCenterXOffset: kaCenterXOffset,
            markLeft: markLeft,
            markRight: markRight,
            markTop: markTop,
            markBottom: markBottom
        };
    };

    var paintGuide = function(context, glyph, metrics, centerX, baseline, fontSize) {
        var scale = fontSize / metrics.referenceSize;
        var notdefOriginX = centerX - metrics.notdefCenterXOffset * scale;
        var markOriginX = centerX - metrics.kaCenterXOffset * scale;
        var markPath = markPaths[glyph.hex.slice(2)];

        context.save();
        context.fillStyle = '#ffffff';
        context.translate(notdefOriginX, baseline);
        context.scale(scale, -scale);
        context.fill(notdefPath);
        context.restore();

        context.save();
        context.fillStyle = '#ffffff';
        context.translate(markOriginX, baseline);
        context.scale(scale, -scale);
        context.fill(markPath);
        context.restore();
    };

    var drawCenteredGuide = function(context, glyph, width, height, fontSize) {
        var metrics = guideMetrics(glyph);
        var scale = fontSize / metrics.referenceSize;
        var centerY = height / 2;
        var baseline = centerY - metrics.notdefCenterYOffset * scale;

        paintGuide(context, glyph, metrics, width / 2, baseline, fontSize);
    };

    var drawCombiningCells = function() {
        var preparedCanvases = [];
        var sharedFontSize = 0;

        combiningCanvases.forEach(function(canvas) {
            var button = canvas.parentElement;
            var width = button.clientWidth;
            var height = button.clientHeight;
            var pixelRatio = window.devicePixelRatio || 1;

            if (!width || !height) {
                return;
            }

            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            var context = canvas.getContext('2d');
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            context.clearRect(0, 0, width, height);
            sharedFontSize = Number.parseFloat(window.getComputedStyle(button).fontSize);
            preparedCanvases.push({
                context: context,
                glyph: canvas.glyphData,
                width: width,
                height: height
            });
        });

        preparedCanvases.forEach(function(prepared) {
            drawCenteredGuide(
                prepared.context,
                prepared.glyph,
                prepared.width,
                prepared.height,
                sharedFontSize
            );
        });
    };

    var drawInspector = function() {
        if (!currentGlyph) {
            return;
        }

        var width = metricField.clientWidth;
        var height = metricField.clientHeight;

        if (!width || !height) {
            return;
        }

        var pixelRatio = window.devicePixelRatio || 1;
        glyphCanvas.width = Math.round(width * pixelRatio);
        glyphCanvas.height = Math.round(height * pixelRatio);
        var context = glyphCanvas.getContext('2d');
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, width, height);

        var glyphs = currentSet === 'baybayin' ? baybayinGlyphs : latinGlyphs;
        var fit = scriptFit(context, glyphs, width, height);

        Object.keys(fit.metricPositions).forEach(function(key) {
            metricField.style.setProperty('--metric-' + key, fit.metricPositions[key] + 'px');
        });

        context.fillStyle = '#ffffff';

        if (currentGlyph.isCombining) {
            paintGuide(
                context,
                currentGlyph,
                guideMetrics(currentGlyph),
                width / 2,
                fit.baseline,
                fit.fontSize
            );
        } else {
            context.textAlign = 'center';
            context.textBaseline = 'alphabetic';
            context.font = fit.fontSize + 'px Nabua';
            context.fillText(currentGlyph.preview, width / 2, fit.baseline);
        }
    };

    var showGlyph = function(glyph, button) {
        if (activeButton) {
            activeButton.classList.remove('is-active');
        }

        currentGlyph = glyph;
        activeButton = button;
        activeButton.classList.add('is-active');
        glyphName.textContent = glyph.name;
        unicodeName.textContent = glyph.unicodeName;
        unicodeHex.textContent = glyph.hex;
        drawInspector();
    };

    var renderGlyphs = function() {
        var isBaybayin = currentSet === 'baybayin';
        var glyphs = isBaybayin ? baybayinGlyphs : latinGlyphs;
        var title = isBaybayin ? 'Baybayin' : 'Basic Latin';

        glyphGrid.replaceChildren();
        activeButton = null;
        combiningCanvases = [];
        layout.classList.toggle('is-baybayin', isBaybayin);
        gridTitle.textContent = title;
        glyphCount.textContent = glyphs.length + ' glyphs';
        if (scriptToggle) {
            scriptToggle.textContent = isBaybayin ? '[Switch to Latin]' : '[Switch to Baybayin]';
            scriptToggle.setAttribute('aria-pressed', String(isBaybayin));
        }

        glyphs.forEach(function(glyph) {
            var button = document.createElement('button');
            button.className = 'glyph-cell';
            button.type = 'button';
            button.setAttribute('aria-label', glyph.unicodeName + ', ' + glyph.hex);
            if (glyph.isCombining) {
                button.classList.add('is-combining');
                var combiningCanvas = document.createElement('canvas');
                combiningCanvas.className = 'combining-canvas';
                combiningCanvas.glyphData = glyph;
                combiningCanvas.setAttribute('aria-hidden', 'true');
                button.appendChild(combiningCanvas);
                combiningCanvases.push(combiningCanvas);
            } else {
                button.textContent = glyph.preview;
            }

            button.addEventListener('mouseenter', function() {
                showGlyph(glyph, button);
            });
            button.addEventListener('focus', function() {
                showGlyph(glyph, button);
            });
            button.addEventListener('click', function() {
                showGlyph(glyph, button);
            });
            glyphGrid.appendChild(button);
        });

        // Preserve the full Latin grid footprint so switching scripts never
        // moves the vertically centered composition.
        if (isBaybayin) {
            while (glyphGrid.children.length < latinGlyphs.length) {
                var placeholder = document.createElement('div');
                placeholder.className = 'glyph-cell glyph-placeholder';
                placeholder.setAttribute('aria-hidden', 'true');
                glyphGrid.appendChild(placeholder);
            }
        }

        var defaultIndex = isBaybayin ? 0 : glyphs.findIndex(function(glyph) {
            return glyph.decimal === 66;
        });

        showGlyph(glyphs[defaultIndex], glyphGrid.children[defaultIndex]);
        window.requestAnimationFrame(drawCombiningCells);
    };

    if (scriptToggle) {
        scriptToggle.addEventListener('click', function() {
            layout.classList.add('is-switching');

            window.setTimeout(function() {
                currentSet = currentSet === 'latin' ? 'baybayin' : 'latin';
                renderGlyphs();
                layout.classList.remove('is-switching');
            }, 120);
        });
    }

    if (typeTesterText && typeTesterSize) {
        var updateTesterSize = function() {
            var size = typeTesterSize.value + 'px';
            typeTesterText.style.fontSize = size;
            typeTesterSize.setAttribute('aria-valuetext', size);
        };

        typeTesterSize.addEventListener('input', updateTesterSize);
        updateTesterSize();
    }

    if (introCarousel && introSlides.length && introDots.length) {
        var activeIntroSlide = 0;

        var showIntroSlide = function(index) {
            activeIntroSlide = (index + introSlides.length) % introSlides.length;

            introSlides.forEach(function(slide, slideIndex) {
                var isActive = slideIndex === activeIntroSlide;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });

            introDots.forEach(function(dot, dotIndex) {
                var isActive = dotIndex === activeIntroSlide;
                dot.classList.toggle('is-active', isActive);

                if (isActive) {
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.removeAttribute('aria-current');
                }
            });
        };

        introDots.forEach(function(dot, dotIndex) {
            dot.addEventListener('click', function() {
                showIntroSlide(dotIndex);
            });
        });

        if (introCarouselViewport) {
            introCarouselViewport.addEventListener('click', function() {
                showIntroSlide(activeIntroSlide + 1);
            });

            introCarouselViewport.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    showIntroSlide(activeIntroSlide + 1);
                }
            });
        }

        introCarousel.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                showIntroSlide(activeIntroSlide + 1);
                introDots[activeIntroSlide].focus();
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showIntroSlide(activeIntroSlide - 1);
                introDots[activeIntroSlide].focus();
            } else if (event.key === 'Home') {
                event.preventDefault();
                showIntroSlide(0);
                introDots[activeIntroSlide].focus();
            } else if (event.key === 'End') {
                event.preventDefault();
                showIntroSlide(introSlides.length - 1);
                introDots[activeIntroSlide].focus();
            }
        });

        showIntroSlide(0);
    }


    if ('ResizeObserver' in window) {
        new ResizeObserver(drawInspector).observe(metricField);
        new ResizeObserver(drawCombiningCells).observe(glyphGrid);
    } else {
        window.addEventListener('resize', drawInspector);
    }

    document.fonts.ready.then(function() {
        renderGlyphs();
        drawInspector();
        drawCombiningCells();
    });

    renderGlyphs();
});
