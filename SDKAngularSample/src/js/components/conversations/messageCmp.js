angular.module('sample').component('rbxMessage', {
    bindings: {
        item: '<'
    },
    controller : function(rainbowSDK, $scope, $interval) {

        var ctrl = $scope;

        this.$onInit = function () {
            var updateDateFields = function() {

                var mdate = moment($scope.$ctrl.item.date);
    
                if (moment().diff(mdate, 'days') == 0) {
                    return mdate.fromNow();
                } else {
                    return mdate.format('lll');
                }
                return d;    
            };
    
            $scope.date = updateDateFields();
    
            // Arm update date timer
            $interval(function ($scope) {
                ctrl.date = updateDateFields();
                ctrl.$apply();
            }, 30000, 0, false);
        }
        
    },
    templateUrl: './src/js/components/conversations/messageCmp.template.html' 
});