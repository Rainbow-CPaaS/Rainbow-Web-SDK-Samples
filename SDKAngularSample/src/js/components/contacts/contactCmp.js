angular.module('sample').component('rbxContact', {
    bindings: {
        item: '<'
    },
    controller : function(rainbowSDK, $scope) {

		this.$onInit = function () {
			var ctrl = $scope;

			$scope.isConnectedUser = false;

			$scope.createConversation = function() {
				rainbowSDK.conversations.openConversationForContact($scope.$ctrl.item)
				.then(function(conversation) {
				}).catch(function() {
					console.log("ERROR");
				});
			};

			$scope.closeConversation = function() {
				rainbowSDK.conversations.closeConversation($scope.$ctrl.item.conversation).then(function(conversation) {
				}).catch(function() {
					console.log("ERROR");
				});
			}

			if(this.item.id === rainbowSDK.contacts.getConnectedUser().id) {
				console.log("Remove button");
				$scope.isConnectedUser = true;
			}
		}
    },
    templateUrl: './src/js/components/contacts/contactCmp.template.html' 
});