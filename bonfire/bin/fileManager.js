// Generated by CoffeeScript 1.12.0
(function() {
  define(["arbiter"], function(arbiter) {
    var div;
    div = document.getElementById('content');
    div.ondragenter = div.ondragover = function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      return false;
    };
    return div.ondrop = function(e) {
      var file, formData, i, len, ref, xhr;
      if (e.dataTransfer.files == null) {
        arbiter.publish("messages/send", {
          text: "<iframe src=" + (e.dataTransfer.getData('Url')) + "></iframe>",
          author: localStorage.displayName
        });
      }
      ref = e.dataTransfer.files;
      for (i = 0, len = ref.length; i < len; i++) {
        file = ref[i];
        formData = new FormData();
        formData.append("file", file, file.name);
        xhr = new XMLHttpRequest();
        xhr.open('post', 'upload', true);
        xhr.onreadystatechange = function() {
          if (this.readyState !== 4) {

          }
        };
        xhr.send(formData);
      }
      return e.preventDefault();
    };
  });

}).call(this);