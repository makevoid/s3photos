# foto_type .photo_gallery

phogal = {}

window.phogal = phogal

phogal.init = (@selector) ->
  @timer = null

phogal.elem = ->
  $(phogal.selector)

phogal.anim_time = 5000
# phogal.anim_time = 2000 # testing

phogal.anim_speed = 700

phogal.resize = ->
  @elem().find(".pos2 img").imagesLoaded =>
    @resize_images()

  @elem().find("img").imagesLoaded =>
    @resize_images()
    # todo: debounced resize
    $(window).on "resize", =>
      @resize_images()

phogal.resize_images = ->
  win_height = $(window).height()
  divs = @.elem().find("div")
  divs.each (idx, element) =>
    elem = $(element).find "img"
    proportion = elem.height() / elem.width()

    if proportion >= 1 # vertical
      width = win_height / proportion
      $(elem).width width
      # todo: use transitions
    else
      top = (win_height - elem.height())/2
      $(element).css { top: top  }
      # todo: use transitions

phogal.animate = ->
  @timer = setTimeout =>
    @animate_now()
    @moz_transition_end()
  , phogal.anim_time

  @watch_transition_end()


phogal.animate_now = ->
  @animate_once()
  @animate()

phogal.moz_transition_end = ->
  setTimeout =>
    @set_opacity()
    @bind_buttons()
  , @anim_speed

phogal.watch_transition_end = ->
  @elem().find("div.pos1").on "webkitTransitionEnd mozTransitionEnd", =>
    @set_opacity()
    @bind_buttons()
    #@change_title()

phogal.change_title = ->
  $("body h1").html @elem().find(".pos2").data("author")

phogal.set_opacity = ->
  @elem().find("div").css opacity: 0
  visibles = ".pos1, .pos2, .pos3"
  @elem().find(visibles).css opacity: 1


phogal.animate_once = ->
  unless @reverse
    prev = @elem().find "div:last"
    prev_copy = prev.clone()
    prev.remove()
    @elem().prepend prev_copy
  else
    prev = @elem().find "div:first"
    prev_copy = prev.clone()
    prev.remove()
    @elem().append prev_copy

  images = @elem().find "div"
  size = images.length
  images.each (idx, elem) ->
    elem = $(elem)
    elem.removeClass()

    pos_num = unless @reverse
      size-idx-1
    else
      idx

    elem.addClass "pos#{pos_num}"

phogal.next = ->
  @unbind_buttons()
  clearTimeout @timer
  @reverse = false
  @animate_now()
  @update_pause_btn_pause()
  @paused = false

phogal.prev = ->
  @unbind_buttons()
  clearTimeout @timer
  @reverse = true
  @animate_now()
  @set_opacity()
  @update_pause_btn_pause()
  @paused = false

phogal.update_pause_btn_pause = ->
  $(".pause").removeClass("play").html("▍▍")

phogal.pause = ->
  unless @paused
    clearTimeout @timer
    $(".pause").addClass("play").html(">")
  else
    @update_pause_btn_pause()
    @animate_now()
    @set_opacity()

  @paused = !@paused

phogal.unbind_buttons = ->
  @elem().find(".next, .prev, .pause").off "click"

phogal.bind_buttons = ->
  @unbind_buttons()
  @elem().find(".next").on "click", => @next()
  @elem().find(".prev").on "click", => @prev()
  @elem().find(".pause").on "click", => @pause()

phogal.main_img = ->
  @elem().find(".pos2 img")

phogal.appear = ->
  @main_img().css opacity: 0

  @main_img().imagesLoaded =>
    @main_img().animate {opacity: 1}, 1000


phogal.remove_loader = ->
  @elem().find(".loading").hide()

phogal.start = ->
  phogal.remove_loader()
  phogal.appear()
  phogal.resize()
  phogal.animate()
  phogal.set_opacity()
  phogal.bind_buttons()