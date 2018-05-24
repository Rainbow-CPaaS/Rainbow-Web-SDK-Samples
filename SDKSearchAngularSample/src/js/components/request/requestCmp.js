angular.module("sample").component("rbxRequest", {
    bindings: {
    },

    templateUrl: "./src/js/components/request/requestCmp.template.html",

    controller : function rbxControllerCtrl(rainbowSDK, $rootScope) {

        "use strict";

        var listeners = [];

        var ctrl = this;

        ctrl.autoAnswered = {};
        ctrl.pending = {};

        ctrl.nbAnswered = 0;
        ctrl.nbPending = 0;

        this.$onInit = function() {
            // Listening to contacts auto-subscriptions
            listeners.push($rootScope.$on(rainbowSDK.contacts.RAINBOW_ONCONTACTSUBSCRIPTIONAUTOANSWERED, onContactSubscriptionAutoAnswered));

            // Listening to subscription requests
            listeners.push($rootScope.$on(rainbowSDK.contacts.RAINBOW_ONCONTACTSUBSCRIPTIONREQUESTED, onContactSubscriptionRequest));
        };

        var onContactSubscriptionAutoAnswered = function onContactSubscriptionAutoAnswered(__event, contact) {
            ctrl.autoAnswered[contact.id] = {
                contact: contact
            };
            ctrl.nbAnswered++;
        };

        var onContactSubscriptionRequest = function onContactSubscriptionRequest(__event, contact) {
            ctrl.pending[contact.id] = {
                contact: contact
            };
            ctrl.nbPending++;
        };

        ctrl.accept = function(contact) {
            console.log("Accept", contact);
            rainbowSDK.contacts.acceptInvitation(contact).then(function() {
                console.log("[DEMO] :: Accepted!");
                delete ctrl.pending[contact.id];
                ctrl.nbPending = Object.keys(ctrl.pending).length;
            }).catch(function(err) {
                console.log("[DEMO] :: Error when accepting the invitation", err);
            });
        };

        ctrl.decline = function(contact) {
            rainbowSDK.contacts.declineInvitation(contact).then(function() {
                console.log("[DEMO] :: Declined!");
                delete ctrl.pending[contact.id];
                ctrl.nbPending = Object.keys(ctrl.pending).length;
            }).catch(function(err) {
                console.log("[DEMO] :: Error when declining the invitation", err);
            });
        };

        this.$onDestroy = function() {
            var listener = listeners.pop();
            while (listener) {
                listener();
                listener = listeners.pop();
            }
        };
    } 
});