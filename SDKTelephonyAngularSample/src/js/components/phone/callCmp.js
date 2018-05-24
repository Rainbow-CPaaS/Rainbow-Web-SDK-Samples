angular.module('sample').component('rbxCall', {
    bindings: {
        item: '='
    },
    controller : function(rainbowSDK, $scope, $interval, Notification) {

        var ctrl = $scope;

        var that = this;

        this.$onInit = function() {
        };

        $scope.state = this.item.status.value;

        $scope.clear = function clear() {

            if(that.item.status.value === rainbowSDK.telephony.RAINBOW_TELEPHONYINCOMING) {
                rainbowSDK.telephony.deflectToVM(that.item);
            }
            else {
                rainbowSDK.telephony.release(that.item);
            }
        };

        $scope.answer = function answer() {
            rainbowSDK.telephony.answer(that.item)
            .then(function() {

            }).catch(function(err) {
                Notification.error({
                    title: "Telephony Service",
                    message: "Impossible to answer the call:<br>" + err,
                    positionY: 'bottom'
                });
            });
        };

        $scope.hold = function hold() {
            rainbowSDK.telephony.hold(that.item)
            .then(function() {

            }).catch(function(err) {
                Notification.error({
                    title: "Telephony Service",
                    message: "Impossible to hold the call:<br>" + err,
                    positionY: 'bottom'
                });
            });
        };

        $scope.retrieve = function retrieve() {
            rainbowSDK.telephony.retrieve(that.item)
            .then(function() {

            }).catch(function(err) {
                Notification.error({
                    title: "Telephony Service",
                    message: "Impossible to retrieve the call:<br>" + err,
                    positionY: 'bottom'
                });
            });
        };

        $scope.deflect = function deflect() {
            rainbowSDK.telephony.deflectToVM(that.item)
            .then(function() {

            }).catch(function(err) {
                Notification.error({
                    title: "Telephony Service",
                    message: "Impossible to deflect the call:<br>" + err,
                    positionY: 'bottom'
                });
            });
        };
    },
    templateUrl: './src/js/components/phone/callCmp.template.html'
});