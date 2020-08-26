var colorUtils = require('ep_cursortrace/static/js/colors');
var utils = require('./utils');

var GET_USERS_COLORS = 'get_users_colors';

var authorsColorsUtils = function(editorInfo, ace) {
  this.usersColors = {};
  this.editorInfo = editorInfo;
  this.ace = ace;
  // it loads the script always with the authors colors disabled
  this.toggleAuthorsColors(false);

  var thisPlugin = utils.getPluginProps();
  thisPlugin.api.setHandleApplyColor(this.applyColorOnSelection.bind(this));
  thisPlugin.api.setHandleSetUsersColors(this.setUsersColors.bind(this));
  thisPlugin.api.setHandleToggleAuthorsColors(this.toggleAuthorsColors.bind(this));
  thisPlugin.api.setHandleEditorReconnected(this.getUsersColors.bind(this));
  this.api = thisPlugin.api;
}

authorsColorsUtils.prototype.applyColorOnSelection = function(colorName) {
  this.ace.callWithAce(
    function(ace) {
      ace.ace_doInsertColors(colorName);
    },
    'insertColor',
    true
  );
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

authorsColorsUtils.prototype.getUsersColors = function() {
  this.api.triggerEvent({ type: GET_USERS_COLORS });
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
