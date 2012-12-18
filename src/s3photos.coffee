# configs
bucket = "mkvphoto"
bucket_url = "http://"+bucket+".s3.amazonaws.com"

# init
content = $ ".content"

hash = location.hash[2..-1]
match = location.search.match(/\?_escaped_fragment_=(.+)\/*/)
if match
  hash = match[1]

unless hash
  hash = location.pathname[1..-1].replace(/\/$/, '')

img_view = (src) ->
  "<img src='#{bucket_url}/#{src}' />"

$.get bucket_url, (data) ->
  $(data).find("Key").each (idx, elem) ->
    img_src = $(elem).text()
    dir = img_src.split("/")[0]
    if dir == hash && img_src.match /(jpg|png)$/i
      content.append img_view(img_src)