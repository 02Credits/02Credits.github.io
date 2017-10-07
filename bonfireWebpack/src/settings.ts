import * as $ from "jquery";

var nameInput = $("#displayName");
var statusInput = $("#status");

if ("displayName" in localStorage) {
  nameInput.val(localStorage.displayName);
} else {
  var dumbNames = [
      "Village Idiot",
      "Dirty Peasant",
      "Dumbster",
      "assfaggot"
    ];
  var randomIndex = Math.floor(Math.random() * dumbNames.length);
  nameInput.val(dumbNames[randomIndex]);
  localStorage.displayName = dumbNames[randomIndex];
}

if ("status" in localStorage) {
  statusInput.val(localStorage.status);
} else {
  localStorage.status = "Breathing";
  statusInput.val(localStorage.status);
}

var settingsInputs = $(".settings-input");
settingsInputs.keydown((e: any) => {
  if (e.which == 13 || e.which == 27) {
    this.blur();
  }
});

settingsInputs.blur((e: any) => {
  localStorage[$(this).attr('id')] = $(this).val();
});
