angular.module("sample").component("rbxSearch", {
    bindings: {
    },

    templateUrl: "./src/js/components/search/searchCmp.template.html",

    controller : function rbxSearchCmp(rainbowSDK, $rootScope) {

        "use strict";

        var ctrl = this;

        var listeners = [];

        ctrl.contact = null;

        ctrl.$onInit = function() {
            this.contact = null;
            listeners.push($rootScope.$on(rainbowSDK.contacts.RAINBOW_ONCONTACTSUBSCRIPTIONAUTOANSWERED, onContactSubscriptionRequest));
        };

        ctrl.$onDestroy = function() {
        };

        this.onSelect = function(contact) {
            ctrl.contact = contact;
        };

        var onContactSubscriptionRequest = function onContactSubscriptionRequest(__event, contact) {
            console.log("[DEMO] :: Subscription request from", contact);
        };
    } 
});