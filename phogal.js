(function() {
  var phogal;

  phogal = {};

  window.phogal = phogal;

  phogal.init = function(selector) {
    this.selector = selector;
    return this.timer = null;
  };

  phogal.elem = function() {
    return $(phogal.selector);
  };

  phogal.anim_time = 5000;

  phogal.anim_speed = 700;

  phogal.resize = function() {
    var _this = this;
    this.elem().find(".pos2 img").imagesLoaded(function() {
      return _this.resize_images();
    });
    return this.elem().find("img").imagesLoaded(function() {
      _this.resize_images();
      return $(window).on("resize", function() {
        return _this.resize_images();
      });
    });
  };

  phogal.resize_images = function() {
    var divs, win_height,
      _this = this;
    win_height = $(window).height();
    divs = this.elem().find("div");
    return divs.each(function(idx, element) {
      var elem, proportion, top, width;
      elem = $(element).find("img");
      proportion = elem.height() / elem.width();
      if (proportion >= 1) {
        width = win_height / proportion;
        return $(elem).width(width);
      } else {
        top = (win_height - elem.height()) / 2;
        return $(element).css({
          top: top
        });
      }
    });
  };

  phogal.animate = function() {
    var _this = this;
    this.timer = setTimeout(function() {
      _this.animate_now();
      return _this.moz_transition_end();
    }, phogal.anim_time);
    return this.watch_transition_end();
  };

  phogal.animate_now = function() {
    this.animate_once();
    return this.animate();
  };

  phogal.moz_transition_end = function() {
    var _this = this;
    return setTimeout(function() {
      _this.set_opacity();
      return _this.bind_buttons();
    }, this.anim_speed);
  };

  phogal.watch_transition_end = function() {
    var _this = this;
    return this.elem().find("div.pos1").on("webkitTransitionEnd mozTransitionEnd", function() {
      _this.set_opacity();
      return _this.bind_buttons();
    });
  };

  phogal.change_title = function() {
    return $("body h1").html(this.elem().find(".pos2").data("author"));
  };

  phogal.set_opacity = function() {
    var visibles;
    this.elem().find("div").css({
      opacity: 0
    });
    visibles = ".pos1, .pos2, .pos3";
    return this.elem().find(visibles).css({
      opacity: 1
    });
  };

  phogal.animate_once = function() {
    var images, prev, prev_copy, size;
    if (!this.reverse) {
      prev = this.elem().find("div:last");
      prev_copy = prev.clone();
      prev.remove();
      this.elem().prepend(prev_copy);
    } else {
      prev = this.elem().find("div:first");
      prev_copy = prev.clone();
      prev.remove();
      this.elem().append(prev_copy);
    }
    images = this.elem().find("div");
    size = images.length;
    return images.each(function(idx, elem) {
      var pos_num;
      elem = $(elem);
      elem.removeClass();
      pos_num = !this.reverse ? size - idx - 1 : idx;
      return elem.addClass("pos" + pos_num);
    });
  };

  phogal.next = function() {
    this.unbind_buttons();
    clearTimeout(this.timer);
    this.reverse = false;
    this.animate_now();
    this.update_pause_btn_pause();
    return this.paused = false;
  };

  phogal.prev = function() {
    this.unbind_buttons();
    clearTimeout(this.timer);
    this.reverse = true;
    this.animate_now();
    this.set_opacity();
    this.update_pause_btn_pause();
    return this.paused = false;
  };

  phogal.update_pause_btn_pause = function() {
    return $(".pause").removeClass("play").html("▍▍");
  };

  phogal.pause = function() {
    if (!this.paused) {
      clearTimeout(this.timer);
      $(".pause").addClass("play").html(">");
    } else {
      this.update_pause_btn_pause();
      this.animate_now();
      this.set_opacity();
    }
    return this.paused = !this.paused;
  };

  phogal.unbind_buttons = function() {
    return this.elem().find(".next, .prev, .pause").off("click");
  };

  phogal.bind_buttons = function() {
    var _this = this;
    this.unbind_buttons();
    this.elem().find(".next").on("click", function() {
      return _this.next();
    });
    this.elem().find(".prev").on("click", function() {
      return _this.prev();
    });
    return this.elem().find(".pause").on("click", function() {
      return _this.pause();
    });
  };

  phogal.main_img = function() {
    return this.elem().find(".pos2 img");
  };

  phogal.appear = function() {
    var _this = this;
    this.main_img().css({
      opacity: 0
    });
    return this.main_img().imagesLoaded(function() {
      return _this.main_img().animate({
        opacity: 1
      }, 1000);
    });
  };

  phogal.remove_loader = function() {
    return this.elem().find(".loading").hide();
  };

  phogal.start = function() {
    phogal.remove_loader();
    phogal.appear();
    phogal.resize();
    phogal.animate();
    phogal.set_opacity();
    return phogal.bind_buttons();
  };

}).call(this);
