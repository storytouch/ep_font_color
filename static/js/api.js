var SET_SCRIPT_TEXT_FONT_COLOR = 'set_script_text_font_color';

exports.init = function(ace) {
  // listen to outbound calls of this API
  window.addEventListener('message', function(e) {
    _handleOutboundCalls(e, ace);
  });
};

var _handleOutboundCalls = function _handleOutboundCalls(e, ace) {
  if (e.data.type === SET_SCRIPT_TEXT_FONT_COLOR) {
    var colorName = e.data.colorName;
    _applyColorOnSelection(ace, colorName);
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
