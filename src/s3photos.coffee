# configs
bucket = "mkvphoto"
bucket_url = "http://"+bucket+".s3.amazonaws.com"

# init
content = $ ".photo_gallery"

hash = location.hash[2..-1]
match = location.search.match(/\?_escaped_fragment_=(.+)\/*/)
if match
  hash = match[1]

unless hash
  hash = location.pathname[1..-1].replace(/\/$/, '')

img_view = (src, idx) ->
  "<div class='pos#{idx}'><img src='#{bucket_url}/#{src}' /></div>"

$.get bucket_url, (data) =>
  keys = []
  $(data).find("Key").each (idx, elem) ->
    keys.push $(elem).text()
  keys.reverse()
  keys.push keys.shift()
  keys.push keys.shift()
  for img_src, idx in keys
    idx = keys.length - idx - 2
    dir = img_src.split("/")[0]
    if dir == hash && img_src.match /(jpg|png)$/i
      content.append img_view(img_src, idx)

  dfd = $(".photo_gallery").imagesLoaded
    progress: (is_broken, images, proper, broken) ->
      $(".loading span").html "#{proper.length}/#{images.length}"
    callback: (images) ->
      phogal.init ".photo_gallery"
      phogal.start()