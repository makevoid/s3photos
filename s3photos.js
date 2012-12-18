(function() {
  var bucket, bucket_url, content, hash, img_view, match;

  bucket = "mkvphoto";

  bucket_url = "http://" + bucket + ".s3.amazonaws.com";

  content = $(".content");

  hash = location.hash.slice(2);

  match = location.search.match(/\?_escaped_fragment_=(.+)\/*/);

  if (match) {
    hash = match[1];
  }

  if (!hash) {
    hash = location.pathname.slice(1).replace(/\/$/, '');
  }

  img_view = function(src) {
    return "<img src='" + bucket_url + "/" + src + "' />";
  };

  $.get(bucket_url, function(data) {
    return $(data).find("Key").each(function(idx, elem) {
      var dir, img_src;
      img_src = $(elem).text();
      dir = img_src.split("/")[0];
      if (dir === hash && img_src.match(/(jpg|png)$/i)) {
        return content.append(img_view(img_src));
      }
    });
  });

}).call(this);
