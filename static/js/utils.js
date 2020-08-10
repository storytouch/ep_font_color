exports.FONT_COLOR_ATTRIB_KEY = 'font-color';
exports.BLACK_COLOR = 'A0';
exports.ERROR_COLOR = 'ERROR';

var thisPluginFontColor;
exports.getPluginProps = function() {
  thisPluginFontColor = thisPluginFontColor || _getThisPlugin();
  return thisPluginFontColor;
}
var _getThisPlugin = function() {
  pad.plugins = pad.plugins || {};
  pad.plugins.ep_font_color = pad.plugins.ep_font_color || {};
  return pad.plugins.ep_font_color;
}
