angular.module('sample').component('rbxPresence', {
    bindings: {
        name: '@'
    },
    controller : function rbcConnectionCtrl (rainbowSDK, $rootScope, $scope) {

        $scope.isConnected = false;

        $scope.presence = "offline";

        var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(event, status) {
            
            if(status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
                $scope.isConnected = true;
            }
            else {
                $scope.isConnected = false;
                $scope.presence = "offline";
            }
        };

        var onPresenceChanged = function onPresenceChanged(event, json) {
            $scope.presence = json.status;
        };

        $scope.online = function() {
            rainbowSDK.presence.setPresenceTo(rainbowSDK.presence.RAINBOW_PRESENCE_ONLINE);
        };

        $scope.away = function() {
            rainbowSDK.presence.setPresenceTo(rainbowSDK.presence.RAINBOW_PRESENCE_AWAY);
        };

        $scope.dnd = function() {
            rainbowSDK.presence.setPresenceTo(rainbowSDK.presence.RAINBOW_PRESENCE_DONOTDISTURB);
        };

        // Subscribe to XMPP connection change
        $rootScope.$on(rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED, onConnectionStateChangeEvent);

        // Subscribe to XMPP connection change
        $rootScope.$on(rainbowSDK.presence.RAINBOW_ONPRESENCECHANGED, onPresenceChanged);
    },
    templateUrl: './src/js/components/presence/presenceCmp.template.html' 
});