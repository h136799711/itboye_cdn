/**
 * Created by hebidu on 15/7/2.
 */
//sco.modal.js
;(function($, undefined) {
    "use strict";

    var pluginName = 'scojs_modal';

    function Modal(options) {
        this.options = $.extend({}, $.fn[pluginName].defaults, options);
        this.$modal = $(this.options.target).attr('class', 'modal fade').hide();
        var self = this;

        function init() {
            if (self.options.title === '') {
                self.options.title = '&nbsp;';
            }
        };

        init();
    }


    $.extend(Modal.prototype, {
        show: function() {
            var self = this
                ,$backdrop;

            if (!this.options.nobackdrop) {
                $backdrop = $('.modal-backdrop');
            }
            if (!this.$modal.length) {
                this.$modal = $('<div class="modal fade" id="' + this.options.target.substr(1) + '"><div class="modal-header"><a class="close" href="#" data-dismiss="modal">×</a><h3>&nbsp;</h3></div><div class="inner"/></div>').appendTo(this.options.appendTo).hide();
            }

            this.$modal.find('.modal-header h3').html(this.options.title);

            if (this.options.cssclass !== undefined) {
                this.$modal.attr('class', 'modal fade ' + this.options.cssclass);
            }

            if (this.options.width !== undefined) {
                this.$modal.width(this.options.width);
            }

            if (this.options.left !== undefined) {
                this.$modal.css({'left': this.options.left});
            }

            if (this.options.height !== undefined) {
                this.$modal.height(this.options.height);
            }

            if (this.options.top !== undefined) {
                this.$modal.css({'top': this.options.top});
            }

            if (this.options.keyboard) {
                this.escape();
            }

            if (!this.options.nobackdrop) {
                if (!$backdrop.length) {
                    $backdrop = $('<div class="modal-backdrop fade" />').appendTo(this.options.appendTo);
                }
                $backdrop[0].offsetWidth; // force reflow
                $backdrop.addClass('in');
            }

            this.$modal.off('close.' + pluginName).on('close.' + pluginName, function() {
                self.close.call(self);
            });
            if (this.options.remote !== undefined && this.options.remote != '' && this.options.remote !== '#') {
                var spinner;
                if (typeof Spinner == 'function') {
                    spinner = new Spinner({color: '#3d9bce'}).spin(this.$modal[0]);
                }
                this.$modal.find('.inner').load(this.options.remote, function() {
                    if (spinner) {
                        spinner.stop();
                    }
                    if (self.options.cache) {
                        self.options.content = $(this).html();
                        delete self.options.remote;
                    }
                });
            } else {
                this.$modal.find('.inner').html(this.options.content);
            }

            this.$modal.show().addClass('in');
            return this;
        }

        ,close: function() {
            this.$modal.hide().off('.' + pluginName).find('.inner').html('');
            if (this.options.cssclass !== undefined) {
                this.$modal.removeClass(this.options.cssclass);
            }
            $(document).off('keyup.' + pluginName);
            $('.modal-backdrop').remove();
            if (typeof this.options.onClose === 'function') {
                this.options.onClose.call(this, this.options);
            }
            return this;
        }

        ,destroy: function() {
            this.$modal.remove();
            $(document).off('keyup.' + pluginName);
            $('.modal-backdrop').remove();
            this.$modal = null;
            return this;
        }

        ,escape: function() {
            var self = this;
            $(document).on('keyup.' + pluginName, function(e) {
                if (e.which == 27) {
                    self.close();
                }
            });
        }
    });


    $.fn[pluginName] = function(options) {
        return this.each(function() {
            var obj;
            if (!(obj = $.data(this, pluginName))) {
                var  $this = $(this)
                    ,data = $this.data()
                    ,opts = $.extend({}, options, data)
                    ;
                if ($this.attr('href') !== '' && $this.attr('href') != '#') {
                    opts.remote = $this.attr('href');
                }
                obj = new Modal(opts);
                $.data(this, pluginName, obj);
            }
            obj.show();
        });
    };


    $[pluginName] = function(options) {
        return new Modal(options);
    };


    $.fn[pluginName].defaults = {
        title: '&nbsp;'		// modal title
        ,target: '#modal'	// the modal id. MUST be an id for now.
        ,content: ''		// the static modal content (in case it's not loaded via ajax)
        ,appendTo: 'body'	// where should the modal be appended to (default to document.body). Added for unit tests, not really needed in real life.
        ,cache: false		// should we cache the output of the ajax calls so that next time they're shown from cache?
        ,keyboard: false
        ,nobackdrop: false
    };


    $(document).on('click.' + pluginName, '[data-trigger="modal"]', function() {
        $(this)[pluginName]();
        if ($(this).is('a')) {
            return false;
        }
    }).on('click.' + pluginName, '[data-dismiss="modal"]', function(e) {
        e.preventDefault();
        $(this).closest('.modal').trigger('close');
    });
})(jQuery);
//sco.confirm.js

;(function($, undefined) {
    "use strict";

    var pluginName = 'scojs_confirm';

    function Confirm(options) {
        this.options = $.extend({}, $.fn[pluginName].defaults, options);

        var $modal = $(this.options.target);
        if (!$modal.length) {
            $modal = $('<div class="modal" id="' + this.options.target.substr(1) + '"><div class="modal-body inner"/><div class="modal-footer"><a class="btn btn-sm cancel" href="#" data-dismiss="modal">取消</a> <a href="#" class="btn btn-sm btn-danger" data-action="1">确定</a></div></div>').appendTo(this.options.appendTo).hide();
            if (typeof this.options.action == 'function') {
                var self = this;
                $modal.find('[data-action]').attr('href', '#').on('click.' + pluginName, function(e) {
                    e.preventDefault();
                    self.options.action.call(self);
                    self.close();
                });
            } else if (typeof this.options.action == 'string') {
                $modal.find('[data-action]').attr('href', this.options.action);
            }
        }
        this.scomodal = $.scojs_modal(this.options);
    }

    $.extend(Confirm.prototype, {
        show: function() {
            this.scomodal.show();
            return this;
        }

        ,close: function() {
            this.scomodal.close();
            return this;
        }

        ,destroy: function() {
            this.scomodal.destroy();
            return this;
        }
    });


    $.fn[pluginName] = function(options) {
        return this.each(function() {
            var obj;
            if (!(obj = $.data(this, pluginName))) {
                var $this = $(this)
                    ,data = $this.data()
                    ,title = $this.attr('title') || data.title
                    ,opts = $.extend({}, $.fn[pluginName].defaults, options, data)
                    ;
                if (!title) {
                    title = 'this';
                }
                opts.content = opts.content.replace(':title', title);
                if (!opts.action) {
                    opts.action = $this.attr('href');
                } else if (typeof window[opts.action] == 'function') {
                    opts.action = window[opts.action];
                }
                obj = new Confirm(opts);
                $.data(this, pluginName, obj);
            }
            obj.show();
        });
    };

    $[pluginName] = function(options) {
        return new Confirm(options);
    };

    $.fn[pluginName].defaults = {
        content: 'Are you sure you want to delete :title?'
        ,cssclass: 'confirm_modal'
        ,target: '#confirm_modal'	// this must be an id. This is a limitation for now, @todo should be fixed
        ,appendTo: 'body'	// where should the modal be appended to (default to document.body). Added for unit tests, not really needed in real life.
    };

    $(document).on('click.' + pluginName, '[data-trigger="confirm"]', function() {
        $(this)[pluginName]();
        return false;
    });
})(jQuery);

//sco.message.js

;(function($, undefined) {
    "use strict";

    var pluginName = 'scojs_message';

    $[pluginName] = function(message, type) {
        clearTimeout($[pluginName].timeout);
        var $selector = $('#' + $[pluginName].options.id);
        if (!$selector.length) {
            $selector = $('<div/>', {id: $[pluginName].options.id}).appendTo($[pluginName].options.appendTo);
        }
        if ($[pluginName].options.animate) {
            $selector.addClass('page_mess_animate');
        } else {
            $selector.removeClass('page_mess_animate');
        }
        $selector.html(message);
        if (type === undefined || type == $[pluginName].TYPE_ERROR) {
            $selector.removeClass($[pluginName].options.okClass).addClass($[pluginName].options.errClass);
        } else if (type == $[pluginName].TYPE_OK) {
            $selector.removeClass($[pluginName].options.errClass).addClass($[pluginName].options.okClass);
        }
        $selector.slideDown('fast', function() {
            $[pluginName].timeout = setTimeout(function() { $selector.slideUp('fast'); }, $[pluginName].options.delay);
        });
    };


    $.extend($[pluginName], {
        options: {
            id: 'page_message'
            ,okClass: 'page_mess_ok'
            ,errClass: 'page_mess_error'
            ,animate: true
            ,delay: 4000
            ,appendTo: 'body'	// where should the modal be appended to (default to document.body). Added for unit tests, not really needed in real life.
        },

        TYPE_ERROR: 1,
        TYPE_OK: 2
    });
})(jQuery);