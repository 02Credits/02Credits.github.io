// Generated by CoffeeScript 1.12.3
(function() {
  define(["jquery", "materialize", "cards"], function($, materialize, cards) {
    $(document).ready(function() {
      return $('.modal-trigger').leanModal();
    });
    $('#settings').click(function(e) {
      return $('label').addClass("active");
    });
    return cards();
  });

}).call(this);
