var SET_SCRIPT_TEXT_FONT_COLOR = 'set_script_text_font_color';
var TOGGLE_AUTHOR_COLOR = 'toggle_author_color';

// this event receives a map containing the authors ids and their colors;
// this information is used to toggle the authors colors
// when the TOGGLE_AUTHOR_COLOR event is received;
var SET_USERS_COLORS = 'caret-set_users_colors';

var utils = require('./utils');

exports.init = function(ace) {
  // listen to outbound calls of this API
  window.addEventListener('message', function(e) {
    _handleOutboundCalls(e, ace);
  });
};

var _handleOutboundCalls = function _handleOutboundCalls(e, ace) {
  var authorsColors = utils.getPluginProps().authorsColors;

  switch (e.data.type) {
    case SET_SCRIPT_TEXT_FONT_COLOR: {
      var colorName = e.data.colorName;
      _applyColorOnSelection(ace, colorName);
      break;
    }

    case TOGGLE_AUTHOR_COLOR: {
      authorsColors.toggleAuthorsColors();
      break;
    }

    case SET_USERS_COLORS: {
      authorsColors.setUsersColors(e.data.usersColors);
      break;
    }
  }
};

var _applyColorOnSelection = function(ace, colorName) {
  ace.callWithAce(
    function(ace) {
      ace.ace_doInsertColors(colorName);
    },
    'insertColor',
    true
  );
};
