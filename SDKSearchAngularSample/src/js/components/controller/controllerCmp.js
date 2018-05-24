angular.module("sample").component("rbxController", {
    bindings: {
        exclude: "<",
        searchPlaceHolder: "<",
        onSelect: "&"
    },

    templateUrl: "./src/js/components/controller/controllerCmp.template.html",

    controller : function rbxControllerCtrl(rainbowSDK) {

        "use strict";

        var listeners = [];

        var ctrl = this;

        this.$onInit = function() {

            ctrl.searchContacts = null;
            ctrl.noResult = false;
            if (!ctrl.searchPlaceHolder) { 
                ctrl.searchPlaceHolder = "Enter a name or a firstname";
            }
        };

        ctrl.onSearchChange = function() {
            ctrl.noResult = false;
            if (ctrl.search.length > 1) {
                rainbowSDK.contacts.searchByName(ctrl.search).then(function(contacts) {
                    var filteredContacts = contacts.filter(function(contact) {
                        return true;
                    });
                    ctrl.searchContacts = filteredContacts;
                    if (contacts.length === 0) {
                        ctrl.noResult = true;
                    }
                }).catch(function(error) {
                    console.error("[DEMO] :: directorySearch failure " + error.message);
                });
            }
            else {
                ctrl.searchContacts = null;
            }
        };

        ctrl.clearSearchInput = function() {
            ctrl.searchContacts = null;
            ctrl.search = "";
            ctrl.noResult = false;
        };

        ctrl.onClick = function(contact) {
            ctrl.onSelect({ $contact: contact });
            ctrl.clearSearchInput();
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