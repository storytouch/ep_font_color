var colorUtils = require('ep_cursortrace/static/js/colors');
var utils = require('./utils');

var GET_USERS_COLORS = 'get_users_colors';

var authorsColorsUtils = function(context) {
  this.usersColors = {};
  this.editorInfo = context.editorInfo;
  this.rep = context.rep;
  this.documentAttributeManager = context.documentAttributeManager;

  // it loads the script always with the authors colors disabled
  this.toggleAuthorsColors(false);

  var thisPlugin = utils.getPluginProps();
  thisPlugin.api.setHandleApplyColor(this.applyColorOnSelection.bind(this));
  thisPlugin.api.setHandleSetUsersColors(this.setUsersColors.bind(this));
  thisPlugin.api.setHandleToggleAuthorsColors(this.toggleAuthorsColors.bind(this));
  thisPlugin.api.setHandleEditorReconnected(this.getUsersColors.bind(this));
  this.api = thisPlugin.api;

  this.getUsersColors(); // always request user colors when user loads the pad
}

authorsColorsUtils.prototype.applyColorOnSelection = function(colorName) {
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || colorName === undefined) {
    return;
  }

  var new_color = [utils.FONT_COLOR_ATTRIB_KEY, colorName]; // e.g. [ 'font-color' , 'A1' ]
  this.editorInfo.ace_inCallStackIfNecessary('applyFontColor', function() {
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [new_color]);
  })
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

exports.init = function(context) {
  return new authorsColorsUtils(context);
}
