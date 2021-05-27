import rainbowSDK from '../../../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js';
angular.module('sample').component('rbxConversation', {
  bindings: {
    item: '=',
  },
  controller: function ($rootScope, $scope) {
    var ctrl = $scope;

    var handlers = [];

    $scope.message = '';

    $scope.onSend = function () {
      rainbowSDK.im.sendMessageToConversation(
        $scope.conversation.id,
        $scope.message,
      );
      $scope.message = '';
    };

    var onConversationChanged = function onConversationChanged() {
      if (ctrl.conversation) {
        setTimeout(function () {
          var container = angular.element(
            '.conversation-' + ctrl.conversation.id,
          );
          var containerHeight = $('.conversation-' + ctrl.conversation.id)
            .scrollHeight;
          container.animate({scrollTop: containerHeight}, 100);
        }, 100);
      }
    };

    this.$onInit = function () {
      setTimeout(() => {
        rainbowSDK.contacts
          .getContactById(this.item.contactId)
          .then(contact => {
            $scope.contact = contact;
            $scope.conversation = this.item;
            rainbowSDK.im
              .getMessagesFromConversation(this.item.id, 50)
              .then(_messages => {
                onConversationChanged();
              });

            // Subscribe to XMPP connection change
            handlers.push($rootScope.$on(this.item.id, onConversationChanged));

            var container = angular.element(
              '.conversation-' + $scope.conversation.id,
            );

            container.on('scroll', __event => {
              if (container.scrollTop() <= 0) {
                //Load older messages
                rainbowSDK.im
                  .getMessagesFromConversation($scope.conversation, 30)
                  .then(function () {})
                  .catch(function () {});
              }
            });
          });
      }, 200);
    };

    this.$onDestroy = function () {
      var handler = handlers.pop();
      while (handler) {
        handler();
        handler = handlers.pop();
      }
    };
  },
  templateUrl:
    './src/js/components/conversations/conversationCmp.template.html',
});
