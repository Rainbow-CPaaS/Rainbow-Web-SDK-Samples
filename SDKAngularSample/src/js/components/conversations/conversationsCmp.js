angular.module("sample").component("rbxConversations", {
  bindings: {
    name: "@",
    conversations: "="
  },
  controller: function rbcConnectionsCtrl(
    rainbowSDK,
    $rootScope,
    $scope,
    $timeout
  ) {
    $scope.conversations = [];

    var getAllOneToOneConversations = function getAllOneToOneConversations() {
      var conversations = rainbowSDK.conversations.getAllConversations();

      var oneToOneConversations = [];

      conversations.forEach(function(conversation) {
        if (conversation.type === 0) {
          oneToOneConversations.push(conversation);
        }
      });

      return oneToOneConversations;
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event,
      status
    ) {
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.conversations = getAllOneToOneConversations();
      } else {
        $scope.conversations = [];
      }
    };

    var onConversationsListChanged = function onConversationsListChanged(
      event,
      conversation
    ) {
      $scope.conversations = $scope.conversations = getAllOneToOneConversations();
    };

    var onConversationChanged = function(__event, conversationID) {
      $rootScope.$broadcast(conversationID, null);
    };

    document.addEventListener(
      rainbowSDK.conversations.RAINBOW_ONCONVERSATIONSCHANGED,
      onConversationsListChanged
    );

    document.addEventListener(
      rainbowSDK.conversations.RAINBOW_ONCONVERSATIONREMOVED,
      onConversationsListChanged
    );

    document.addEventListener(
      rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
      onConnectionStateChangeEvent
    );

    document.addEventListener(
      rainbowSDK.conversations.RAINBOW_ONCONVERSATIONCHANGED,
      onConversationChanged
    );
  },
  templateUrl:
    "./src/js/components/conversations/conversationsCmp.template.html"
});

