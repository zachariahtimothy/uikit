(function(addon) {

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-slideshow", ["uikit"], function() {
            return component || addon(jQuery, jQuery.UIkit);
        });
    }

})(function($, UI) {

    "use strict";

    var Animations;

    UI.component('slideshow', {

        defaults: {
            animation        : "fade",
            duration         : 500,
            height           : "auto",
            start            : 0,
            autoplay         : false,
            autoplayInterval : 7000,
            videoautoplay    : true,
            videomute        : true,
            kenburns         : false,
            slices           : 15
        },

        current  : false,
        interval : null,
        hovering : false,

        init: function() {

            var $this = this, canvas;

            this.container   = this.find('.uk-slideshow').andSelf().filter('.uk-slideshow'),
            this.slides      = this.container.children(),
            this.slidesCount = this.slides.length,
            this.current     = this.options.start,
            this.animating   = false,
            this.triggers    = this.find('[data-uk-slideshow-item]');

            this.slides.each(function(index) {

                var slide = $(this),
                    media = slide.children('img,video,iframe').eq(0);

                slide.data('media', media);
                slide.data('sizer', media);

                if (media.length) {

                    var placeholder;

                    switch(media[0].nodeName) {
                        case 'IMG':

                            var cover = $('<div class="uk-cover-background uk-position-cover"></div>').css({'background-image':'url('+ media.attr('src') + ')'});

                            media.css({'width': '100%','height': 'auto'});
                            slide.prepend(cover).data('cover', cover);
                            break;
                        case 'IFRAME':

                            var src = media[0].src;

                            media.attr('src', '').on('load', function(){

                                if (index !== $this.current || (index == $this.current && $this.options.videoautoplay)) {
                                    $this.pausemedia(media);
                                }

                                if ($this.options.videomute) {
                                    this.contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');
                                }

                            })
                            .attr('src', [src, (src.indexOf('?') > -1 ? '&':'?'), 'enablejsapi=1&api=1'].join(''))
                            .addClass('uk-position-absolute')
                            .css('pointer-events', 'none');

                            placeholder = true;

                            if (UI.cover) {
                                UI.cover(media);
                                media.attr('data-uk-cover', '{}');
                            }

                            break;
                        case 'VIDEO':
                            media.addClass('uk-cover-object uk-position-absolute');
                            placeholder = true;
                    }

                    if (placeholder) {

                        canvas  = $('<canvas></canvas>').attr({'width': media[0].width, 'height': media[0].height});
                        var img = $('<img style="width:100%;height:auto;">').attr('src', canvas[0].toDataURL());

                        slide.prepend(img);
                        slide.data('sizer', img);
                    }

                } else {
                    slide.data('sizer', slide);
                }
            });

            this.on("click", '[data-uk-slideshow-item]', function(e) {

                e.preventDefault();

                var slide = $(this).data('ukSlideshowItem');

                if ($this.current == slide) return;

                switch(slide) {
                    case 'next':
                    case 'previous':
                        $this[slide=='next' ? 'next':'previous']();
                        break;
                    default:
                        $this.show(slide);
                }

                $this.stop();
            });

            // Set start slide
            this.slides.eq(this.current).addClass('uk-active');
            this.triggers.filter('[data-uk-slideshow-item="'+this.current+'"]').addClass('uk-active');

            UI.$win.on("resize load", UI.Utils.debounce(function() { $this.resize(); }, 100));

            this.resize();

            // Set autoplay
            if (this.options.autoplay) {
                this.start();
            }

            if (this.options.videoautoplay && this.slides.eq(this.current).data('media')) {
                this.playmedia(this.slides.eq(this.current).data('media'));
            }

            if (this.options.kenburns) {
                this.applyKenBurns(this.slides.eq(this.current));
            }

            this.container.on({
                mouseenter: function() { $this.hovering = true;  },
                mouseleave: function() { $this.hovering = false; }
            });

            this.on('swipeRight swipeLeft', function(e) {
                $this[e.type=='swipeLeft' ? 'next' : 'previous']();
            });
        },


        resize: function() {

            if (this.container.hasClass('uk-slideshow-fullscreen')) return;

            var $this = this, height = this.options.height;

            if (this.options.height === 'auto') {

                height = 0;

                this.slides.css('height', '').each(function() {
                    height = Math.max(height, $(this).data('sizer').height());
                });
            }

            this.container.css('height', height);
            this.slides.css('height', height);
        },

        show: function(index, direction) {

            if (this.animating) return;

            this.animating = true;

            var $this        = this,
                current      = this.slides.eq(this.current),
                next         = this.slides.eq(index),
                dir          = direction ? direction : this.current < index ? -1 : 1,
                currentmedia = current.data('media'),
                animation    = Animations[this.options.animation] ? this.options.animation : 'fade',
                nextmedia    = next.data('media'),
                finalize     = function() {

                    if(!$this.animating) return;

                    if(currentmedia.is('video,iframe')) {
                        $this.pausemedia(currentmedia);
                    }

                    if(nextmedia.is('video,iframe')) {
                        $this.playmedia(nextmedia);
                    }

                    next.addClass("uk-active");
                    current.removeClass('uk-active');

                    $this.animating = false;
                    $this.current   = index;

                    UI.Utils.checkDisplay(next, '[class*="uk-animation-"]:not(.uk-cover-background.uk-position-cover)');

                    $this.trigger('uk.slideshow.show', [next]);
                };

            $this.applyKenBurns(next);

            // animation fallback
            if (!UI.support.animation) {
                animation = 'none';
            }

            Animations[animation].apply(this, [current, next, dir]).then(finalize);

            $this.triggers.filter('[data-uk-slideshow-item="'+$this.current+'"]').removeClass('uk-active').end().filter('[data-uk-slideshow-item="'+index+'"]').addClass('uk-active');
        },

        applyKenBurns: function(slide) {

            if (!this.hasKenBurns(slide)) {
                return;
            }

            var animations = [
                    'uk-animation-middle-left',
                    'uk-animation-top-right',
                    'uk-animation-bottom-left',
                    'uk-animation-top-center',
                    '', // middle-center
                    'uk-animation-bottom-right'
                ],
                index = this.kbindex || 0;


            slide.data('cover').attr('class', 'uk-cover-background uk-position-cover').width();
            slide.data('cover').addClass(['uk-animation-scale', 'uk-animation-reverse', 'uk-animation-15', animations[index]].join(' '));

            this.kbindex = animations[index + 1] ? (index+1):0;
        },

        hasKenBurns: function(slide) {
            return (this.options.kenburns && slide.data('cover'));
        },

        next: function() {
            this.show(this.slides[this.current + 1] ? (this.current + 1) : 0);
        },

        previous: function() {
            this.show(this.slides[this.current - 1] ? (this.current - 1) : (this.slides.length - 1));
        },

        start: function() {

            this.stop();

            var $this = this;

            this.interval = setInterval(function() {
                if (!$this.hovering) $this.show($this.options.start, $this.next());
            }, this.options.autoplayInterval);

        },

        stop: function() {
            if (this.interval) clearInterval(this.interval);
        },

        playmedia: function(media) {

            if (!(media && media[0])) return;


            switch(media[0].nodeName) {
                case 'VIDEO':
                    media[0].play();
                    break;
                case 'IFRAME':
                    media[0].contentWindow.postMessage('{ "event": "command", "func": "playVideo", "method":"play"}', '*');
                    break;
            }
        },

        pausemedia: function(media) {

            switch(media[0].nodeName) {
                case 'VIDEO':
                    media[0].pause();
                    break;
                case 'IFRAME':
                    media[0].contentWindow.postMessage('{ "event": "command", "func": "pauseVideo", "method":"pause"}', '*');
                    break;
            }
        }
    });

    Animations = {

        'none': function() {

            var d = $.Deferred();
            d.resolve();
            return d.promise();
        },

        'scroll': function(current, next, dir) {

            var d = $.Deferred();

            current.css('animation-duration', this.options.duration+'ms');
            next.css('animation-duration', this.options.duration+'ms');

            next.css('opacity', 1).one(UI.support.animation.end, function() {

                current.removeClass(dir === 1 ? 'uk-slideshow-scroll-backward-out' : 'uk-slideshow-scroll-forward-out');
                next.css('opacity', '').removeClass(dir === 1 ? 'uk-slideshow-scroll-backward-in' : 'uk-slideshow-scroll-forward-in');
                d.resolve();

            }.bind(this));

            current.addClass(dir == 1 ? 'uk-slideshow-scroll-backward-out' : 'uk-slideshow-scroll-forward-out');
            next.addClass(dir == 1 ? 'uk-slideshow-scroll-backward-in' : 'uk-slideshow-scroll-forward-in');
            next.width(); // force redraw

            return d.promise();
        },

        'swipe': function(current, next, dir) {

            var d = $.Deferred();

            current.css('animation-duration', this.options.duration+'ms');
            next.css('animation-duration', this.options.duration+'ms');

            next.css('opacity', 1).one(UI.support.animation.end, function() {

                current.removeClass(dir === 1 ? 'uk-slideshow-swipe-backward-out' : 'uk-slideshow-swipe-forward-out');
                next.css('opacity', '').removeClass(dir === 1 ? 'uk-slideshow-swipe-backward-in' : 'uk-slideshow-swipe-forward-in');
                d.resolve();

            }.bind(this));

            current.addClass(dir == 1 ? 'uk-slideshow-swipe-backward-out' : 'uk-slideshow-swipe-forward-out');
            next.addClass(dir == 1 ? 'uk-slideshow-swipe-backward-in' : 'uk-slideshow-swipe-forward-in');
            next.width(); // force redraw

            return d.promise();
        },

        'scale': function(current, next, dir) {

            var d = $.Deferred();

            current.css('animation-duration', this.options.duration+'ms');
            next.css('animation-duration', this.options.duration+'ms');

            next.css('opacity', 1);

            current.one(UI.support.animation.end, function() {

                current.removeClass('uk-slideshow-scale-out');
                next.css('opacity', '');
                d.resolve();

            }.bind(this));

            current.addClass('uk-slideshow-scale-out');
            current.width(); // force redraw

            return d.promise();
        },

        'fade': function(current, next, dir) {

            var d = $.Deferred();

            current.css('animation-duration', this.options.duration+'ms');
            next.css('animation-duration', this.options.duration+'ms');

            next.css('opacity', 1);

            current.one(UI.support.animation.end, function() {

                current.removeClass('uk-slideshow-fade-out');
                next.css('opacity', '');
                d.resolve();

            }.bind(this));

            current.addClass('uk-slideshow-fade-out');
            current.width(); // force redraw

            return d.promise();
        }
    };

    UI.slideshow.animations = Animations;

    // init code
    UI.ready(function(context) {

        $('[data-uk-slideshow]', context).each(function() {

            var slideshow = $(this);

            if (!slideshow.data("slideshow")) {
                var obj = UI.slideshow(slideshow, UI.Utils.options(slideshow.attr("data-uk-slideshow")));
            }
        });
    });

});