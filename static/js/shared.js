exports.collectContentPre = function(hook, context) {
  var fontColor = /(?:^| )font-color-([A-Za-z0-9]*)/.exec(context.cls);
  if (fontColor && fontColor[1]) {
    context.cc.doAttrib(context.state, 'font-color::' + fontColor[1]); // e.g. 'font-color::A1'
  }
}
