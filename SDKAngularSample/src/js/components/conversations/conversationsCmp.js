import rainbowSDK from '../../../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js';
angular.module('sample').component('rbxConversations', {
  bindings: {
    name: '@',
    conversations: '=',
  },
  controller: function rbcConnectionsCtrl($rootScope, $scope, $timeout) {
    $scope.conversations = [];
    $scope.openConversations = [];

    var getAllOneToOneConversations = function getAllOneToOneConversations() {
      var oneToOneConversations = [];
      rainbowSDK.conversations.getAllConversations().then(conversations => {
        conversations.forEach(function (conversation) {
          if (conversation.type === 0) {
            oneToOneConversations.push(conversation);
          }
        });
      });
      return oneToOneConversations;
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event,
      status,
    ) {
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.conversations = getAllOneToOneConversations();
      } else {
        $scope.conversations = [];
      }
    };

    var onConversationsListChanged = function onConversationsListChanged(
      event,
      conversation,
    ) {
      $scope.conversations = $scope.conversations = getAllOneToOneConversations();
    };

    var onConversationChanged = function (__event, conversationID) {
      $rootScope.$broadcast(conversationID, null);
    };

    document.addEventListener(
      rainbowSDK.conversations.RAINBOW_ONCONVERSATIONSCHANGED,
      onConversationsListChanged,
    );

    document.addEventListener(
      rainbowSDK.conversations.RAINBOW_ONCONVERSATIONREMOVED,
      onConversationsListChanged,
    );

    document.addEventListener(
      rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
      onConnectionStateChangeEvent,
    );

    document.addEventListener(
      rainbowSDK.conversations.RAINBOW_ONCONVERSATIONCHANGED,
      onConversationChanged,
    );
  },
  templateUrl:
    './src/js/components/conversations/conversationsCmp.template.html',
});
