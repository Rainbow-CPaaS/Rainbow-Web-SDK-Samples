angular.module("sample").component("rbxMedia", {
    bindings: {
        name: "@"
    },
    controller : function rbcPhoneCtrl(rainbowSDK, $rootScope, $scope, $timeout) {

        "use strict";

        var listeners = [];

        $scope.microphones = [];

        $scope.speakers = [];

        $scope.cameras = [];

        $scope.isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
        $scope.isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        $scope.isOther = !($scope.isChrome || $scope.isFirefox);

        $timeout(function() {
           initialize();
        }, 1000);

        this.$onInit = function() {
            
        };

        var initialize = function initialize() {
            
            if ($scope.isChrome) {
                $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_START");

                // Enumerate the list of available media device
                navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(function(stream) {
                    console.log("[DEMO] :: Get user media ok... Enumerate devices...");
                    stream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
                }).catch(function(error) {
                    console.log("[DEMO] :: Unable to have access to media devices", error);
                });
            }
            else if($scope.isFirefox) {
                 $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
            }
            else {
                $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_FAILED");
            }

            // Subscribe to WebRTC error
            listeners.push($rootScope.$on(rainbowSDK.webRTC.RAINBOW_ONWEBRTCERRORHANDLED, onWebRTCErrorHandled));
        };

        var onWebRTCErrorHandled = function onWebRTCErrorHandled(__event, error) {
            console.log("[DEMO] :: WebRTC Error", error);
            $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
        };

        var gotDevices = function gotDevices(devices) {
            devices.forEach(function(device) {
                switch (device.kind) {
                    case "audioinput":
                        $scope.microphones.push(device);
                        break;
                    case "audiooutput":
                        $scope.speakers.push(device);
                        break;
                    case "videoinput":
                        $scope.cameras.push(device);
                        break;
                    default:
                        console.log("Strange...", device);
                        break;
                }
            });

            if ($scope.microphones.length === 0) {
                $scope.microphones.push({
                    deviceId: "default",
                    groupId:"2029518264",
                    kind: "audioinput",
                    label: "No microphone"
                });
            }

            if ($scope.speakers.length === 0) {
                $scope.speakers.push({
                    deviceId: "default",
                    groupId:"2029518264",
                    kind: "audioinput",
                    label: "No speaker"
                });
            }

            if ($scope.cameras.length === 0) {
                $scope.cameras.push({
                    deviceId: "default",
                    groupId:"2029518264",
                    kind: "audioinput",
                    label: "No camera"
                });
            }
            $scope.$apply(function() {
                $scope.selectedMicrophone = $scope.microphones[0];
                $scope.selectedSpeaker = $scope.speakers[0];
                $scope.selectedCamera = $scope.cameras[0];
            });

            $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
        }; 

        var handleError = function handleError(error) {
            console.log("[DEMO] :: Devices error", error);
            $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
        };

        this.$onDestroy = function() {
        };

        $scope.changeMicrophone = function() {
            console.log("[DEMO] :: Change microphone to " + $scope.selectedMicrophone.label);
            rainbowSDK.webRTC.useMicrophone($scope.selectedMicrophone.deviceId);
        };

        $scope.changeSpeaker = function() {
            console.log("[DEMO] :: Change speaker to " + $scope.selectedSpeaker.label);
            rainbowSDK.webRTC.useSpeaker($scope.selectedSpeaker.deviceId);
        };

        $scope.changeCamera = function() {
            console.log("[DEMO] :: Change camera to " + $scope.selectedCamera.label);
            rainbowSDK.webRTC.useCamera($scope.selectedCamera.deviceId);
        };

    },
    templateUrl: "./src/js/components/media/mediaCmp.template.html" 
});