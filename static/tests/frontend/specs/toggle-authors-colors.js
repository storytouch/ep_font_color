describe('ep_font_color - toggle authors colors', function() {
  var multipleUsers, originalUser, otherUser, firstBgColorOfOriginalUser;
  var DEFAULT_COLOR = 'rgba(0, 0, 0, 0)';
  var A7_COLOR = 'rgba(22, 170, 255, 0.3)';
  var A8_COLOR = 'rgba(32, 110, 255, 0.3)';
  var B13_COLOR = 'rgba(164, 135, 32, 0.3)';
  var B14_COLOR = 'rgba(54, 153, 8, 0.3)';

  var getUserId = function() {
    return helper.padChrome$.window.pad.myUserInfo.userId;
  }

  var testColors = function(originalUserExpectedColor, otherUserExpectedColor, done) {
    helper.waitFor(function() {
      var textOfOriginalUser = helper.padInner$('span').first();
      var textOfOtherUser = helper.padInner$('span').last();
      var colorOfOriginalUser = $(textOfOriginalUser).css('background-color');
      var colorOfOtherUser = $(textOfOtherUser).css('background-color');
      return colorOfOriginalUser === originalUserExpectedColor && colorOfOtherUser === otherUserExpectedColor;
    }).done(done);
  }

  before(function(done) {
    multipleUsers = ep_script_copy_cut_paste_test_helper.multipleUsers;
    apiUtils = ep_font_color_helper_test.apiUtils;

    helper.newPad(function() {
      helper.padInner$('div').last().sendkeys('user1');
      originalUser = getUserId();

      multipleUsers.openSamePadOnWithAnotherUser(function() {
        multipleUsers.startActingLikeOtherUser();
        helper.padInner$('div').last().sendkeys('{selectall}{rightarrow}user2');
        otherUser = getUserId();
        apiUtils.simulateCallToSetUsersColors({
          [originalUser]: 'A7',
          [otherUser]: 'B13',
        });
        done();
      });
    });
    this.timeout(20000);
  });

  context('when the pad is opened', function() {
    it('does not show the authors colors', function(done) {
      testColors(DEFAULT_COLOR, DEFAULT_COLOR, done);
    });
  });

  context('when the user toggles the authors colors', function() {
    before(function(done) {
      apiUtils.simulateToggleOfAuthorsColors();
      done();
    });

    it('shows the authors colors', function(done) {
      testColors(A7_COLOR, B13_COLOR, done);
    });
  });

  context('when the user changes its color', function() {
    before(function(done) {
      apiUtils.simulateCallToSetUsersColors({
        [originalUser]: 'A8',
        [otherUser]: 'B14',
      });
      done();
    });

    it('updates the authors colors', function(done) {
      testColors(A8_COLOR, B14_COLOR, done);
    });
  });
});
