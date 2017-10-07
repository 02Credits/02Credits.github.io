import * as $ from "jquery";

$(document).ready(() => {
  ($('.modal-trigger') as any).leanModal();
});

$('#settings').click(() => {
  $('label').addClass("active");
});
