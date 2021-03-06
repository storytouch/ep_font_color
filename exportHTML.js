var eejs = require('ep_etherpad-lite/node/eejs/');
var _ = require('ep_etherpad-lite/static/js/underscore');

var colors = ['black', 'red', 'green', 'blue', 'yellow', 'orange'];

// Add the props to be supported in export
exports.exportHtmlAdditionalTagsWithData = async function(hook, pad) {
  var colorsUsed = findAllColorUsedOn(pad);
  var tags = transformColorsIntoTags(colorsUsed);
  return tags;
};

// Iterate over pad attributes to find only the color ones
function findAllColorUsedOn(pad) {
  var colors_used = [];

  pad.pool.eachAttrib(function(key, value){
    if (key === "font-color" && value != "A0") { // skip black (A0) color
      colors_used.push(value);
    }
  });

  return colors_used;
}

// Transforms an array of color names into color tags like ["color", "red"]
function transformColorsIntoTags(color_names) {
  return _.map(color_names, function(color_name) {
    return ["font-color", color_name];
  });
}

// Include CSS for HTML export
exports.stylesForExport = function(hook, padId, cb){
  var style = eejs.require("ep_font_color/static/css/color.css");
  cb(style);
};

// TODO: when "asyncLineHTMLForExport" hook is available on Etherpad, use it instead of "getLineHTMLForExport"
// exports.asyncLineHTMLForExport = function (hook, context, cb) {
//   cb(rewriteLine);
// }

exports.getLineHTMLForExport = function (hook, context) {
  rewriteLine(context);
}

function rewriteLine(context){
  var lineContent = context.lineContent;
  lineContent = replaceDataByClass(lineContent);
  // TODO: when "asyncLineHTMLForExport" hook is available on Etherpad, return "lineContent" instead of re-setting it
  context.lineContent = lineContent;
}

// Change from <span data-color:x  to <span class:color:x
function replaceDataByClass(text) {
  return text.replace(/data-font-color=["|']([0-9a-zA-Z]+)["|']/gi, "class='font-color-$1'");
}
