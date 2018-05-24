angular.module("sample").component("rbxDetails", {
    bindings: {
        contact: "<"
    },

    templateUrl: "./src/js/components/details/detailsCmp.template.html",

    controller : function rbxDetailsCmp(rainbowSDK, $scope) {

        "use strict";

         var ctrl = this;

        var fieldList = [
            { name: "title"},
            { name: "nickname"},
            { name: "country"},
            { name: "phonePro"},
            { name: "mobilePro"},
            { name: "groups"},
            { name: "phonePerso"},
            { name: "mobilePerso"},
            { name: "emailPro"},
            { name: "emailPerso"}
        ];

        ctrl.fields = {};

        ctrl.$onInit = function() {
            // Fill fields
            ctrl.fillFields();

            $scope.$on("$destroy", $scope.$watch(
                function() { return ctrl.contact; },
                function() { ctrl.fillFields(); }
            ));
        };

        ctrl.$onChanges = function(changes) {
            if (changes.contact) {
                //ctrl.contact = changes.contact.currentValue
                ctrl.fillFields();
            } 
        };

        ctrl.fillFields = function() {
            ctrl.fields = {};

            fieldList.forEach(function(field) {
                if (!ctrl.contact) {
                    return;
                }
                var value = this.contact[field.name];
                if (value) {
                    ctrl.fields[field.name] = {
                        value: value
                    };
                }
                else {
                    console.log("field not found", field);
                }
            }, ctrl);
        };

        ctrl.removeContact = function removeContact() {
            console.log("remove", ctrl.contact);
            rainbowSDK.contacts.removeFromContactsList(ctrl.contact).then(function() {
                console.log("[DEMO] :: Removed!");
            }).catch(function(err) {
                console.log("[DEMO] :: Error when removing a contact", err);
            });
        };

        ctrl.addContact = function addContact() {
            console.log("add", ctrl.contact);
            rainbowSDK.contacts.addToContactsList(ctrl.contact).then(function() {
                console.log("[DEMO] :: Added!");
            }).catch(function(err) {
                console.log("[DEMO] :: Error when adding a contact", err);
            });
        };

        ctrl.loadUserGroups = function() {
            //groupService.getUserGroups(ctrl.contact).then(function(groups) {
                //ctrl.groups = groups;
            //});
        };

    } 
});