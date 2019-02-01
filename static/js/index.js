var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');

var api = require('./api');
var utils = require('./utils');

exports.postAceInit = function(hook, context) {
  api.init(context.ace);
};

exports.aceAttribsToClasses = function(hook, context) {
  var key = context.key;
  var value = context.value;

  // black color is the same as not applying color
  if (key === utils.FONT_COLOR_ATTRIB_KEY && value !== utils.BLACK_COLOR) {
    return [utils.FONT_COLOR_ATTRIB_KEY + '-' + value];
  }
};

function doInsertColors(colorName) {
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || colorName === undefined) {
    return;
  }

  var new_color = [utils.FONT_COLOR_ATTRIB_KEY, colorName]; // e.g. [ 'font-color' , 'A1' ]
  documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [new_color]);
}

// Once ace is initialized, we set ace_doInsertColors and bind it to the context
exports.aceInitialized = function(hook, context) {
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertColors = _(doInsertColors).bind(context);
};
