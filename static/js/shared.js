var collectContentPre = function(hook, context) {
  var fontColor = /(?:^| )font-color-([A-Za-z0-9]*)/.exec(context.cls);
  if (fontColor && fontColor[1]) {
    context.cc.doAttrib(context.state, 'font-color::' + fontColor[1]); // e.g. 'font-color::A1'
  }
};

// TODO: remove it
var collectContentPost = function(hook, context) {
  /*
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(colors, tname);

  if(tagIndex >= 0){
    delete lineAttributes['color'];
  }
*/
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
