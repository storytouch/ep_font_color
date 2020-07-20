describe('ep_font_color - API - apply color to font', function() {
  var helperFunctions, apiUtils;

  before(function(done) {
    helperFunctions = ep_font_color_helper.changeFontColor;
    apiUtils = ep_font_color_helper_test.apiUtils;
    helper.newPad(function() {
      apiUtils.startListeningToApiEvents();
      helperFunctions.createPadWithSE(done);
    });
    this.timeout(60000);
  });

  context('when API receives a message to apply a font color', function() {
    var lineNumber = 0;
    var colorName;

    before(function(done) {
      colorName = 'A3';
      helperFunctions.selectLineAndApplyColor(lineNumber, colorName, done);
      this.timeout(10000);
    });

    context('and there is text selected', function() {
      it('applies the color on the selection', function(done) {
        var lineHexColor = helperFunctions.getHexColorOfLine(lineNumber);
        var expectedColor = helperFunctions.fontColorRgb[colorName];
        expect(lineHexColor).to.be(expectedColor);
        done();
      });

      context('and user performs undo', function() {
        before(function(done) {
          helperFunctions.undo();
          helper
            .waitFor(function() {
              return helperFunctions.checkIfHasFontColorClass(lineNumber) === false;
            }, 4000)
            .done(done);
        });

        it('removes the color applied', function(done) {
          var lineHexColor = helperFunctions.getHexColorOfLine(lineNumber);
          var defaultFontColor = helperFunctions.defaultFontColor;
          expect(lineHexColor).to.be(defaultFontColor);
          done();
        });

        context('and user performs redo', function() {
          before(function(done) {
            helperFunctions.redo();
            helper
              .waitFor(function() {
                return helperFunctions.checkIfHasFontColorClass(lineNumber);
              }, 4000)
              .done(done);
          });

          it('displays the font color previously applied', function(done) {
            var lineHexColor = helperFunctions.getHexColorOfLine(lineNumber);
            var expectedColor = helperFunctions.fontColorRgb[colorName];
            expect(lineHexColor).to.be(expectedColor);
            done();
          });
        });
      });

      context('and user applies a second color over this text', function() {
        before(function(done) {
          colorName = 'A2';
          helperFunctions.selectLineAndApplyColor(lineNumber, colorName, done);
          this.timeout(10000);
        });

        it('removes the previous color class', function(done) {
          var hasPreviousColorClass = helperFunctions.checkIfHasFontColorClass(lineNumber, 'A3');
          expect(hasPreviousColorClass).to.be(false);
          done();
        });

        it('applies the new color selected', function(done) {
          var lineHexColor = helperFunctions.getHexColorOfLine(lineNumber);
          var expectedColor = helperFunctions.fontColorRgb[colorName];
          expect(lineHexColor).to.be(expectedColor);
          done();
        });
      });

      context('and API receives colorName A0', function() {
        before(function(done) {
          // we need to apply a color before removing it
          var colorName = 'A1';
          helperFunctions.selectLineAndApplyColor(lineNumber, colorName, function() {
            var defaultFontColorName = 'A0'; // remove color, same as apply black (default color)
            apiUtils.simulateTriggerOfFontColorButtonPressed(defaultFontColorName);
            helper
              .waitFor(function() {
                return helperFunctions.checkIfHasFontColorClass(lineNumber) === false;
              }, 4000)
              .done(done);
          });
          this.timeout(10000);
        });

        it('removes the color applied', function(done) {
          var lineHexColor = helperFunctions.getHexColorOfLine(lineNumber);
          var defaultFontColor = helperFunctions.defaultFontColor;
          expect(lineHexColor).to.be(defaultFontColor);
          done();
        });
      });
    });
  });
});

var ep_font_color_helper = ep_font_color_helper || {};
ep_font_color_helper.changeFontColor = {
  undo: function() {
    ep_script_elements_test_helper.utils.undo();
  },
  redo: function() {
    ep_script_elements_test_helper.utils.redo();
  },
  fontColorRgb: {
    A1: '#FF0000',
    A2: '#FF7E00',
    A3: '#FFCC00',
  },
  defaultFontColor: '#3E3E3E', // grayish
  convertRgbToHex: function(rgb) {
    // copied from https://stackoverflow.com/a/3627747
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ('0' + parseInt(x).toString(16)).slice(-2);
    }
    var hexColor = '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    return hexColor.toUpperCase();
  },
  createPadWithSE: function(done) {
    var utils = ep_script_elements_test_helper.utils;
    var lastLineText = 'action';
    var general = utils.general('general');
    var action = utils.action(lastLineText);

    var script = general + action;
    utils.createScriptWith(script, lastLineText, done);
  },
  checkIfHasFontColorClass: function(lineNumber, suffix) {
    var colorSuffix = suffix || '';
    var $targetElement = helper.padInner$('div').eq(lineNumber);
    var classNames = $targetElement.children().attr('class') || '';
    return classNames.includes('font-color-' + colorSuffix);
  },
  getHexColorOfLine: function(lineNumber) {
    var $targetElement = helper.padInner$('div').eq(lineNumber);
    var lineColor = $targetElement.children().css('color');
    var lineHexColor = this.convertRgbToHex(lineColor);
    return lineHexColor;
  },
  selectLineAndApplyColor: function(lineNumber, colorName, cb) {
    var self = this;
    var apiUtils = ep_font_color_helper_test.apiUtils;
    var $targetElement = helper.padInner$('div').eq(lineNumber);
    helper.selectLines($targetElement, $targetElement);
    apiUtils.simulateTriggerOfFontColorButtonPressed(colorName);
    helper
      .waitFor(function() {
        return self.checkIfHasFontColorClass(lineNumber, colorName);
      }, 4000)
      .done(cb);
  },
};
