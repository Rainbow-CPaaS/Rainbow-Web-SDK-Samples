import rainbowSDK from "../../../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js";
angular.module("sample").component("rbxUser", {
  bindings: {
    name: "@",
  },
  controller: function rbcConnectionCtrl($rootScope, $scope) {
    $scope.isConnected = false;

    $scope.user = false;

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
        onStarted();
      } else {
        $scope.isConnected = false;
        $scope.user = null;
      }
    };

    var onInformationChanged = function onInformationChanged(event) {
      var user = event.detail;
      if (!$scope.user) {
        $scope.user = user;
      } else {
        // Track changes
      }
    };

    var onStarted = function onReady() {
      // Get the connected user information
      $scope.user = rainbowSDK.contacts.getConnectedUser();

      // Subscribe to XMPP connection change
      document.addEventListener(
        rainbowSDK.contacts.RAINBOW_ONINFORMATIONCHANGED,
        onInformationChanged
      );
    };

    // Subscribe to XMPP connection change
    document.addEventListener(
      rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
      onConnectionStateChangeEvent
    );

    // Subscribe to XMPP connection change
  },
  templateUrl: "./src/js/components/user/userCmp.template.html",
});
