var SET_SCRIPT_TEXT_FONT_COLOR = 'set_script_text_font_color';
var TOGGLE_AUTHOR_COLOR = 'toggle_author_color';

// this event receives a map containing the authors ids and their colors;
// this information is used to toggle the authors colors
// when the TOGGLE_AUTHOR_COLOR event is received;
var SET_USERS_COLORS = 'caret-set_users_colors';
var ETHERPAD_RECONNECTED = 'etherpad_reconnected';

var utils = require('./utils');

var fontColorApi = function(ace) {
  this.onApplyColorOnSelection = function() {};
  this.onSetUsersColors = function() {};
  this.onToggleAuthorsColors = function() {};
  this.onEditorReconnected = [];

  var self = this;

  // listen to outbound calls of this API
  window.addEventListener('message', function(e) {
    self._handleOutboundCalls(e, ace);
  });
}

fontColorApi.prototype._handleOutboundCalls = function(e, ace) {
  var authorsColors = utils.getPluginProps().authorsColors;

  switch (e.data.type) {
    case SET_SCRIPT_TEXT_FONT_COLOR: {
      var colorName = e.data.colorName;
      this.onApplyColorOnSelection(colorName);
      break;
    }

    case TOGGLE_AUTHOR_COLOR: {
      this.onToggleAuthorsColors();
      break;
    }

    case SET_USERS_COLORS: {
      var usersColors = e.data.usersColors;
      this.onSetUsersColors(usersColors);
      break;
    }

    case ETHERPAD_RECONNECTED: {
      this.onEditorReconnected.forEach(function(fn) {
        fn();
      });
      break;
    }
  }
};

fontColorApi.prototype.setHandleApplyColor = function(fn) {
  this.onApplyColorOnSelection = fn;
}

fontColorApi.prototype.setHandleSetUsersColors = function(fn) {
  this.onSetUsersColors = fn;
}

fontColorApi.prototype.setHandleToggleAuthorsColors = function(fn) {
  this.onToggleAuthorsColors = fn;
}

fontColorApi.prototype.setHandleEditorReconnected = function(fn) {
  this.onEditorReconnected.push(fn);
}

fontColorApi.prototype.triggerEvent = function(message) {
  // if there's a wrapper to Etherpad, send data to it; otherwise use Etherpad own window
  var target = window.parent ? window.parent : window;
  target.postMessage(message, '*');
}

exports.init = function(ace) {
  return new fontColorApi(ace);
};
