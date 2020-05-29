import rainbowSDK from "../../../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js";

angular.module("sample").component("rbxPhone", {
  bindings: {
    name: "@",
  },
  controller: function rbcPhoneCtrl($rootScope, $scope, Notification) {
    $scope.isConnected = false;

    $scope.state = "- - -";
    $scope.system = "Service not available";
    $scope.agentVersion = "unknown";
    $scope.agentXmpp = "unknown";
    $scope.phoneAPI = "unknown";

    $scope.phoneCmpAgentVersion = "phoneCmp-agent-color-warning";
    $scope.phoneCmpAgentXmpp = "phoneCmp-agent-color-warning";
    $scope.phoneCmpAgentPhone = "phoneCmp-agent-color-warning";

    $scope.calls = {};

    var handlers = [];

    $scope.call = function call() {
      rainbowSDK.telephony
        .callByNumber($scope.phoneNumber)
        .then(function (data) {})
        .catch(function (err) {
          Notification.error({
            title: "Telephony Service",
            message: "The phone number is not correct:<br>" + err,
            positionY: "bottom",
          });
        });
    };

    var onTelephonyStarted = function onTelephonyStarted() {
      Notification.success({
        title: "Telephony Service",
        message: "The telephony service is successfully started",
        positionY: "bottom",
      });

      onTelephonyStateChanged();
    };

    var onTelephonyStopped = function onTelephonyStopped() {
      Notification.error({
        title: "Telephony Service",
        message: "The telephony service has been stopped",
        positionY: "bottom",
      });

      onTelephonyStateChanged();
    };

    var onTelephonyStateChanged = function onTelephonyStateChanged() {
      $scope.agentVersion = rainbowSDK.telephony.getAgentVersion();
      $scope.agentXmpp = rainbowSDK.telephony.getXMPPAgentStatus();
      $scope.phoneAPI = rainbowSDK.telephony.getPhoneAPIStatus();

      $scope.phoneCmpAgentVersion =
        $scope.agentVersion === "unknown"
          ? "phoneCmp-agent-color-warning"
          : "phoneCmp-agent-color-ok";
      $scope.phoneCmpAgentXmpp =
        $scope.agentXmpp === "unknown"
          ? "phoneCmp-agent-color-warning"
          : $scope.agentXmpp === "stopped"
          ? "phoneCmp-agent-color-error"
          : "phoneCmp-agent-color-ok";
      $scope.phoneCmpAgentPhone =
        $scope.phoneAPI === "unknown"
          ? "phoneCmp-agent-color-warning"
          : $scope.phoneAPI === "disconnected"
          ? "phoneCmp-agent-color-error"
          : "phoneCmp-agent-color-ok";

      if (rainbowSDK.telephony.isTelephonyAvailable()) {
        var monitoredPhone = rainbowSDK.contacts.getConnectedUserPhone();

        if (monitoredPhone) {
          $scope.state = monitoredPhone.phoneNumber;
          $scope.system = monitoredPhone.pbxId;
          $scope.isConnected = true;
        } else {
          $scope.state = "?";
          $scope.system = "No device and system information";
          $scope.isConnected = false;

          Notification.warning({
            title: "Telephony Service",
            message:
              "There is no information on the associated phone and PBX system",
            positionY: "bottom",
          });
        }
      } else {
        $scope.state = "- - -";
        $scope.system = "Service not available";
        $scope.isConnected = false;
      }

      if ($scope.agentVersion === "unknown") {
        Notification.warning({
          title: "Telephony Service",
          message: "There is no information on the associated PBX system",
          positionY: "bottom",
        });
      }
    };

    var onTelephonyCallChanged = function onTelephonyCallChanged(event) {
      var call = event.detail;
      if (call.id in $scope.calls) {
        console.log("DEMO", "Call " + call.id + " --> " + call.status.value);

        if (
          call.status.value === rainbowSDK.telephony.RAINBOW_TELEPHONYUNKNOW
        ) {
          $scope.calls[call.id] = null;
          delete $scope.calls[call.id];
          console.log(
            "DEMO",
            "Call " + call.id + ": " + call.status.value + " (removed)"
          );
        }
      } else {
        // don't add call in case of releasing or Unknown
        if (
          call.status.value !== rainbowSDK.telephony.RAINBOW_TELEPHONYUNKNOW
        ) {
          console.log(
            "DEMO",
            "Call " + call.id + ": " + call.status.value + " (added)"
          );
          $scope.calls[call.id] = call;
        } else {
          console.log(
            "DEMO",
            "Call " + call.id + ": " + call.status.value + " (already removed)"
          );
        }
      }

      console.log("DEMO", "Active calls: " + Object.keys($scope.calls).length);
    };

    var onCallNumber = function (event, phoneNumber) {
      $scope.phoneNumber = phoneNumber;
      if ($scope.isConnected) {
        $scope.call();
      }
    };

    this.$onInit = function () {
      handlers.push($rootScope.$on("ON_TELEPHONYDEMOAPP_CALL", onCallNumber));
      document.addEventListener(
        rainbowSDK.telephony.RAINBOW_ONTELEPHONYSTARTED,
        onTelephonyStarted
      );
      document.addEventListener(
        rainbowSDK.telephony.RAINBOW_ONTELEPHONYSTOPPED,
        onTelephonyStopped
      );
      document.addEventListener(
        rainbowSDK.telephony.RAINBOW_ONTELEPHONYCALLSTATECHANGED,
        onTelephonyCallChanged
      );
    };

    this.$onDestroy = function () {
      var handler = handlers.pop();
      while (handler) {
        handler();
        handler = handlers.pop();
      }
    };
  },
  templateUrl: "./src/js/components/phone/phoneCmp.template.html",
});
