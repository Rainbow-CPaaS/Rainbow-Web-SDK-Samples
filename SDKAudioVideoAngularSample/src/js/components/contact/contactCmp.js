angular.module("sample").component("rbxContact", {
  bindings: {
    name: "@"
  },
  controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope) {
    "use strict";

    var listeners = [];

    $scope.contacts = [
      {
        _displayName: "No recipient",
        id: "no",
        status: "offline",
        avatar: { src: null }
      }
    ];

    $scope.selectedItem = null;

    $scope.actionAudio = "Not available";
    $scope.actionVideo = "Not available";
    $scope.actionSharing = "Not available";

    $scope.presenceValue = "notAvailable";

    $scope.isAvailable = false;

    this.$onInit = function() {
      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONSTARTED,
          onStart
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
          onConnectionStateChangeEvent
        )
      );

      // Subscribe to contact change
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
          onContactsInformationChanged
        )
      );

      // Subscribe to contact change
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONINFORMATIONCHANGED,
          onContactsInformationChanged
        )
      );
    };

    this.$onDestroy = function() {
      var listener = listeners.pop();
      while (listener) {
        listener();
        listener = listeners.pop();
      }
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      __event
    ) {
      var status = event.detail;

      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else if (
        status === rainbowSDK.connection.RAINBOW_CONNECTIONDISCONNECTED
      ) {
        $scope.isConnected = false;
        $scope.contacts = [
          {
            _displayName: "No recipient",
            id: "no",
            status: "offline",
            avatar: { src: null }
          }
        ];
        $scope.selectedItem = $scope.contacts[0];
        changeRecipientValue();
      }
    };

    var onStart = function onStart() {
      var contacts = rainbowSDK.contacts.getAll();

      contacts = contacts.filter(function(contact) {
        return contact.id !== rainbowSDK.contacts.getConnectedUser().id;
      });

      if (contacts && contacts.length) {
        $scope.contacts = contacts;
        $scope.selectedItem = $scope.contacts[0];
        changeRecipientValue();
      }
    };

    var onContactsInformationChanged = function onContactsInformationChanged(
      event
    ) {
      var contact = event.detail;
      if ($scope.selectedItem) {
        if ($scope.selectedItem.id === contact.id) {
          changeRecipientValue();
        }
      }
    };

    var changeRecipientValue = function changeRecipientValue() {
      if ($scope.selectedItem) {
        $scope.avatar = $scope.selectedItem.avatar.src;
        $scope.presenceValue = displayPresenceOfContact();
        $scope.actionAudio =
          $scope.presenceValue === "notAvailable"
            ? "Not Available"
            : $scope.presenceValue === "busy"
            ? "Busy"
            : "Audio call";
        $scope.actionVideo =
          $scope.presenceValue === "notAvailable"
            ? "Not Available"
            : $scope.presenceValue === "busy"
            ? "Busy"
            : "Call";
        $scope.actionSharing =
          $scope.presenceValue === "notAvailable"
            ? "Not Available"
            : $scope.presenceValue === "busy"
            ? "Busy"
            : "Sharing Call";
        $scope.isAvailable =
          $scope.presenceValue === "available" ? true : false;
      }
    };

    var displayPresenceOfContact = function displayPresenceOfContact() {
      switch ($scope.selectedItem.status) {
        case "online":
        case "away":
          return "available";
        case "busy":
        case "dnd":
          return "busy";
        case "offline":
        case "unknown":
        default:
          return "notAvailable";
      }
    };

    $scope.changeValue = function() {
      console.log("DEMO :: Selected recipient changed", $scope.selectedItem);
      changeRecipientValue();
    };

    $scope.callAudio = function callAudio() {
      if ($scope.selectedItem) {
        if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
          rainbowSDK.webRTC.callInAudio($scope.selectedItem);
        } else {
          console.log("DEMO :: Your browser can't make audio and video call!");
        }
      }
    };

    $scope.callVideo = function callVideo() {
      if ($scope.selectedItem) {
        if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
          rainbowSDK.webRTC.callInVideo($scope.selectedItem);
        } else {
          console.log("DEMO :: Your browser can't make audio and video call!");
        }
      }
    };

    $scope.callSharing = function callSharing() {
      if ($scope.selectedItem) {
        rainbowSDK.webRTC
          .canMakeDesktopSharingCall()
          .then(function() {
            rainbowSDK.webRTC.callInSharing($scope.selectedItem);
          })
          .catch(function() {
            console.log("DEMO :: Your browser can't make sharing call!");
          });
      }
    };
  },
  templateUrl: "./src/js/components/contact/contactCmp.template.html"
});

