import rainbowSDK from '../../../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js';
angular.module('sample').component('rbxContact', {
  bindings: {
    item: '<',
  },
  controller: function ($scope) {
    this.$onInit = function () {
      var ctrl = $scope;

      $scope.isConnectedUser = false;

      $scope.createConversation = function () {
        if ($scope.$ctrl.item) {
          rainbowSDK.conversations
            .getConversationByContactId($scope.$ctrl.item.id)
            .then(function (conversation) {})
            .catch(function () {
              console.log('ERROR');
            });
        } else {
          console.error('No contact to open conversation with');
        }
      };

      $scope.closeConversation = function () {
        rainbowSDK.conversations
          .openConversationForContact($scope.$ctrl.item)
          .then(conversation => {
            rainbowSDK.conversations
              .closeConversation(conversation)
              .then(conversation => {
                console.log('Conversation closed', conversation);
              })
              .catch(function () {
                console.log('ERROR');
              });
          });
      };

      if (
        $scope.$ctrl.item &&
        $scope.$ctrl.item.id === rainbowSDK.contacts.getConnectedUser().id
      ) {
        console.log('Remove button');
        $scope.isConnectedUser = true;
      }
    };
  },
  templateUrl: './src/js/components/contacts/contactCmp.template.html',
});
