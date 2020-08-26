var ep_font_color_helper_test = ep_font_color_helper_test || {};
ep_font_color_helper_test.apiUtils = {
  /**** general helper methods to handle API calls ****/
  SET_SCRIPT_TEXT_FONT_COLOR: 'set_script_text_font_color',
  TOGGLE_AUTHOR_COLOR: 'toggle_author_color',
  SET_USERS_COLORS: 'caret-set_users_colors',
  GET_USERS_COLORS: 'get_users_colors',
  ETHERPAD_RECONNECTED: 'etherpad_reconnected',

  lastDataSent: {},

  startListeningToApiEvents: function() {
    var self = this;
    this.resetLastDataSent();
    var outboundApiEventsTarget = helper.padChrome$.window.parent;
    outboundApiEventsTarget.addEventListener('message', function(e) {
      if (
        e.data.type === self.SET_SCRIPT_TEXT_FONT_COLOR ||
        e.data.type === self.GET_USERS_COLORS
      ) {
        self.lastDataSent[e.data.type] = e.data;
      }
    });
  },

  waitForDataToBeSent: function(eventType, done) {
    var self = this;
    helper.waitFor(function() {
      return self.lastDataSent[eventType];
    }).done(done);
  },

  resetLastDataSent: function() {
    this.lastDataSent = {};
  },

  /*
    message: {
      type: 'set_script_text_font_color',
      colorName: 'A1'
     }
  */

  simulateTriggerOfFontColorButtonPressed: function(colorName) {
    var message = {
      type: this.SET_SCRIPT_TEXT_FONT_COLOR,
      colorName: colorName,
    };

    var target = helper.padChrome$.window;
    target.postMessage(message, '*');
  },

  simulateToggleOfAuthorsColors: function() {
    var message = {
      type: this.TOGGLE_AUTHOR_COLOR,
    };

    var target = helper.padChrome$.window;
    target.postMessage(message, '*');
  },

  simulateCallToSetUsersColors: function(usersColors) {
    var message = {
      type: this.SET_USERS_COLORS,
      usersColors: usersColors,
    }

    var target = helper.padChrome$.window;
    target.postMessage(message, '*');
  },

  simulateCallToReconnectEtherpad: function() {
    var message = {
      type: this.ETHERPAD_RECONNECTED,
    }

    var target = helper.padChrome$.window;
    target.postMessage(message, '*');
  }
}

