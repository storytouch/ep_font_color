var ep_font_color_helper_test = ep_font_color_helper_test || {};
ep_font_color_helper_test.apiUtils = {
  /**** general helper methods to handle API calls ****/
  SET_SCRIPT_TEXT_FONT_COLOR: 'set_script_text_font_color',
  lastDataSent: {},

  startListeningToApiEvents: function() {
    var self = this;
    this.resetLastDataSent();
    var outboundApiEventsTarget = helper.padChrome$.window.parent;
    outboundApiEventsTarget.addEventListener('message', function(e) {
      if(e.data.type === self.SET_SCRIPT_TEXT_FONT_COLOR) {
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
    this.lastDataSent = undefined;
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
}

