angular.module('sample').component('rbxShortcut', {
    bindings: {
        item: '=',
    },
    controller : function(rainbowSDK, $rootScope, $scope, $interval, localStorageService) {

        var ctrl = $scope;
        var that = this;

        this.$onInit = function() {
            $scope.editable = false;
            $scope.phone = {value: "Empty"};

            var oldValue = $scope.phone.value;

            $scope.edit = function() {
                oldValue = $scope.phone.value;
                $scope.editable = true;
                setTimeout(function() {
                    angular.element('#phone').select();
                }, 100);
            };

            $scope.save = function() {
                oldValue = $scope.phone.value;
                saveToStorage();
                $scope.editable = false;
            };

            $scope.cancel = function() {
                $scope.editable = false;
                $scope.phone.value = oldValue;
            };

            $scope.call = function() {
                $rootScope.$broadcast("ON_TELEPHONYDEMOAPP_CALL", $scope.phone.value);
            };
        }

        var saveToStorage = function () {

            localStorageService.set($scope.$ctrl.item, $scope.phone);
        };

        var readFromStorage = function () {
            $scope.phone = localStorageService.get($scope.$ctrl.item) || {value: "Empty"};
        };

        readFromStorage();

    },
    templateUrl: './src/js/components/shortcut/shortcutCmp.template.html' 
});