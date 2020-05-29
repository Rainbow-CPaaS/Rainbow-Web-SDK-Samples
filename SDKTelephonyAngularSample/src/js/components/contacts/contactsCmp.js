import rainbowSDK from "../../../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js";

angular.module("sample").component("rbxContacts", {
  bindings: {
    name: "@",
  },
  controller: function rbcConnectionCtrl($rootScope, $scope) {
    $scope.isConnected = false;

    $scope.nbContacts = 0;

    $scope.contacts = [];

    var listeners = [];

    this.$onInit = function () {
      // Subscribe to XMPP connection change
      document.addEventListener(
        rainbowSDK.connection.RAINBOW_ONSTARTED,
        onStarted
      );

      // Subscribe to XMPP connection change
      document.addEventListener(
        rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
        onConnectionStateChangeEvent
      );

      // Subscribe to XMPP connection change
      document.addEventListener(
        rainbowSDK.presence.RAINBOW_ONCONTACTPRESENCECHANGED,
        onContactPresenceChangeEvent
      );

      // Subscribe to Contact information change connection changes
      document.addEventListener(
        rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
        onContactInformationChangeEvent
      );

      // Subscribe to XMPP connection change
      document.addEventListener(
        rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
        onContactsInformationChanged
      );
    };

    this.$onDestroy = function () {
      var listener = listeners.pop();
      while (listener) {
        listener();
        listener = listeners.pop();
      }
    };

    var onContactInformationChangeEvent = function onContactInformationChangeEvent(
      event
    ) {
      var contact = event.detail;
      console.log("DEMO :: Contact information changed to ", contact);
    };

    var onContactPresenceChangeEvent = function onContactPresenceChangeEvent(
      event
    ) {
      var status = event.detail;
      console.log("DEMO :: presence changed to ", status);
    };

    var countNumberOfContacts = function countNumberOfContacts() {
      $scope.nbContacts = Object.keys($scope.contacts).length;
    };

    var onStarted = function onReady() {
      $scope.contacts = rainbowSDK.contacts.getAll();
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else {
        $scope.isConnected = false;
        $scope.nbContacts = 0;
        $scope.contacts = {};
      }
    };

    var onContactsInformationChanged = function onContactsInformationChanged(
      event
    ) {
      var contact = event.detail;
      if (!(contact.id in $scope.contacts)) {
        $scope.contacts[contact.id] = contact;
        countNumberOfContacts();
      } else {
        // Track changes
      }
    };
  },
  templateUrl: "./src/js/components/contacts/contactsCmp.template.html",
});
