angular.module("sample").component("rbxConversation", {
  bindings: {
    item: "="
  },
  controller: function(rainbowSDK, $rootScope, $scope) {
    var ctrl = $scope;

    var handlers = [];

    $scope.message = "";

    $scope.onSend = function() {
      rainbowSDK.im.sendMessageToConversation(
        $scope.conversation,
        $scope.message
      );
      $scope.message = "";
    };

    var onConversationChanged = function onConversationChanged() {
      setTimeout(function() {
        var containerHeight = $(".conversation-" + ctrl.conversation.dbId)[0]
          .scrollHeight;
        var container = angular.element(
          ".conversation-" + ctrl.conversation.dbId
        );
        container.animate({ scrollTop: containerHeight }, 100);
      }, 100);
    };

    this.$onInit = function() {
      $scope.contact = this.item.contact;

      $scope.conversation = this.item;

      rainbowSDK.im
        .getMessagesFromConversation(this.item, 50)
        .then(function(__messages) {
          onConversationChanged();
        });

      // Subscribe to XMPP connection change
      handlers.push($rootScope.$on(this.item.id, onConversationChanged));

      var container = angular.element(
        ".conversation-" + ctrl.conversation.dbId
      );

      container.on("scroll", function(__event) {
        if (container.scrollTop() <= 0) {
          //Load older messages
          rainbowSDK.im
            .getMessagesFromConversation($scope.conversation, 30)
            .then(function() {})
            .catch(function() {});
        }
      });
    };

    this.$onDestroy = function() {
      var handler = handlers.pop();
      while (handler) {
        handler();
        handler = handlers.pop();
      }
    };
  },
  templateUrl: "./src/js/components/conversations/conversationCmp.template.html"
});

