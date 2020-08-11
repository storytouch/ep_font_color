var colorUtils = require('ep_cursortrace/static/js/colors');

var authorsColorsUtils = function(editorInfo) {
  this.usersColors = {};
  this.editorInfo = editorInfo;
  // it loads the script always with the authors colors disabled
  this.toggleAuthorsColors(false);
}

authorsColorsUtils.prototype.setUsersColors = function(usersColors) {
  this.usersColors = usersColors;
  var self = this;
  var authorsId = Object.keys(usersColors);
  authorsId.forEach(function(authorId) {
    var bgcolor = colorUtils.getColorHash(usersColors[authorId], 0.3);
    self.editorInfo.ace_setAuthorInfo(authorId, { bgcolor: bgcolor });
  })
}

// the "activate" param is optional; it is used
// in the initialization, to disable the authors colors
authorsColorsUtils.prototype.toggleAuthorsColors = function(activate) {
  var $colorsCheck = $('#options-colorscheck');
  var currentCheckedValue = $colorsCheck.is(':checked');
  var showAuthorColors = activate === undefined ? !currentCheckedValue : activate;
  pad.changeViewOption('showAuthorColors', showAuthorColors);
  $colorsCheck.prop("checked", showAuthorColors);
}

exports.init = function(editorInfo) {
  return new authorsColorsUtils(editorInfo);
}
