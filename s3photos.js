(function() {
  var bucket, bucket_url, content, hash, img_view, match,
    _this = this;

  bucket = "mkvphoto";

  bucket_url = "http://" + bucket + ".s3.amazonaws.com";

  content = $(".photo_gallery");

  hash = location.hash.slice(2);

  match = location.search.match(/\?_escaped_fragment_=(.+)\/*/);

  if (match) {
    hash = match[1];
  }

  if (!hash) {
    hash = location.pathname.slice(1).replace(/\/$/, '');
  }

  img_view = function(src, idx) {
    return "<div class='pos" + idx + "'><img src='" + bucket_url + "/" + src + "' /></div>";
  };

  $.get(bucket_url, function(data) {
    var dfd, dir, idx, img_src, keys, _i, _len;
    keys = [];
    $(data).find("Key").each(function(idx, elem) {
      return keys.push($(elem).text());
    });
    keys.reverse();
    keys.push(keys.shift());
    keys.push(keys.shift());
    for (idx = _i = 0, _len = keys.length; _i < _len; idx = ++_i) {
      img_src = keys[idx];
      idx = keys.length - idx - 2;
      dir = img_src.split("/")[0];
      if (dir === hash && img_src.match(/(jpg|png)$/i)) {
        content.append(img_view(img_src, idx));
      }
    }
    return dfd = $(".photo_gallery").imagesLoaded({
      progress: function(is_broken, images, proper, broken) {
        return $(".loading span").html("" + proper.length + "/" + images.length);
      },
      callback: function(images) {
        phogal.init(".photo_gallery");
        return phogal.start();
      }
    });
  });

}).call(this);
