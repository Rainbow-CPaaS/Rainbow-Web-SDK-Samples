angular.module("sample").component("rbxController", {
    bindings: {
        name: "@"
    },
    templateUrl: "./src/js/components/controller/controllerCmp.template.html",
    controller : function rbcPhoneCtrl(rainbowSDK, $rootScope, $scope, Call) {

        "use strict";

        $scope.isConnected = false;

        $scope.isInCommunication = false;

        $scope.isPIPDisplayed = true;

        $scope.isRemoteVideoDisplayed = true;

        $scope.isSpectrumDisplayed = false;

        $scope.hasLocalVideo = false;        //Compute local

        $scope.hasRemoteVideo = false;  // compute remote

        $scope.isCheckedDisplayed = true;

        $scope.title = "Please wait...";

        $scope.message = "The browser is checking your audio and video devices";

        var currentCall = null;

        this.$onInit = function() {
            // Subscribe to XMPP connection change
            $rootScope.$on("$destroy", ($rootScope.$on(rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED, onConnectionStateChangeEvent)));

            // Subscribe to webrtc state change
            $rootScope.$on("$destroy", ($rootScope.$on(rainbowSDK.webRTC.RAINBOW_ONWEBRTCCALLSTATECHANGED, onWebRTCCallChanged)));

            // Subscribe to getUserMedia error
            $rootScope.$on("$destroy", ($rootScope.$on(rainbowSDK.webRTC.RAINBOW_ONWEBRTCTMEDIAERROROCCURED, onWebRTCGetUserMediaErrorOccured)));

            // Subscribe to webrtc track change
            $rootScope.$on("$destroy", ($rootScope.$on(rainbowSDK.webRTC.RAINBOW_ONWEBRTCTRACKCHANGED, onWebRTCTrackChanged)));

            // Subscribe to conversation change
            $rootScope.$on("$destroy", ($rootScope.$on(rainbowSDK.webRTC.RAINBOW_ONCONVERSATIONCHANGED, onConversationChanged)));

            $rootScope.$on("$destroy", ($rootScope.$on("DEMO_ON_CHECK_DEVICES_START", onDeviceCheckStart)));

            $rootScope.$on("$destroy", ($rootScope.$on("DEMO_ON_CHECK_DEVICES_END", onDeviceCheckEnd)));

            $rootScope.$on("$destroy", ($rootScope.$on("DEMO_ON_CHECK_DEVICES_FAILED", onDeviceCheckFailed)));
        };

        this.$onDestroy = function() {
        };

        var onDeviceCheckStart = function onDeviceCheckStart() {
            console.log("[DEMO] :: Start checking devices...");
        };

        var onDeviceCheckEnd = function onDeviceCheckEnd() {
            $scope.$apply(function() {
                console.log("[DEMO] :: Devices checking finished!");
                $scope.isCheckedDisplayed = false;
            });
        };

        var onDeviceCheckFailed = function onDeviceCheckFailed() {
            $scope.title = "WARNING !";
            $scope.message = "This demo will not work on this browser (not compatible)";
        };

        var onConversationChanged = function onConversationChanged(__event, conversation) {
            console.log("[DEMO] :: Conversation changed", conversation);
        };

        var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(__event, status) {
            
            if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
                $scope.isConnected = true;
            }
            else if (status === rainbowSDK.connection.RAINBOW_CONNECTIONDISCONNECTED) {
                $scope.isConnected = false;
            }
        };

        var onWebRTCGetUserMediaErrorOccured = function onWebRTCGetUserMediaErrorOccured(__event, error) {
            console.log("[DEMO] :: WebRTC GetUserMedia error occurs", error);
        };

        var onWebRTCCallChanged = function onWebRTCCallChanged(__event, call) {
            console.log("[DEMO] :: WebRTC Call state changed to " + call.status.value, call);

            switch (call.status.value) {
                
                case Call.Status.RINGING_INCOMMING.value:
                    if (call.remoteMedia & Call.Media.VIDEO) {
                        answerInVideo(call);
                    }
                    else {
                        answerInAudio(call);
                    }
                    break;
                
                case Call.Status.ACTIVE.value:
                    if (call.remoteMedia & Call.Media.VIDEO) {
                        displayRemoteVideo(call);
                    }
                    else {
                        hideRemoteVideo(call);
                    }

                    if (call.localMedia & Call.Media.VIDEO) {
                        displayLocalVideo(call);
                    } else {
                        hideLocalVideo(call);
                    }
                    $scope.isInCommunication = true;
                    break;
                
                case Call.Status.UNKNOWN.value:
                    hideLocalVideo();
                    hideRemoteVideo(call);
                    $scope.isInCommunication = false;
                    break;
                
                default:
                    console.log("[DEMO] :: Nothing to do with that event...");
                    break;
            }

            currentCall = call;
        };

        var onWebRTCTrackChanged = function onWebRTCTrackChanged(__event, call) {
            console.log("[DEMO] :: WebRTC Track changed local|remote " + call.localMedia + '|' + call.remoteMedia);
            // Manage remote video
            if (call.remoteMedia & Call.Media.VIDEO) {
                displayRemoteVideo(call);
            }
            else {
                hideRemoteVideo(call);
            }
            // Manage local video
            if (call.localMedia & Call.Media.VIDEO) {
                displayLocalVideo(call);
            }
            else {
                hideLocalVideo(call);
            }
        };

        var answerInVideo = function answerInVideo(call) {
            console.log("[DEMO] :: Answer in video");
            rainbowSDK.webRTC.answerInVideo(call);
        };

        var answerInAudio = function answerInAudio(call) {
            console.log("[DEMO] :: Answer in audio");
            rainbowSDK.webRTC.answerInAudio(call);
        };

        var displayRemoteVideo = function displayRemoteVideo(call) {
            console.log("[DEMO] :: Display remote video");
            rainbowSDK.webRTC.showRemoteVideo(call);
            $scope.hasRemoteVideo = true;
        };

        var hideRemoteVideo = function hideRemoteVideo(call) {
            console.log("[DEMO] :: Hide remote video");
            rainbowSDK.webRTC.hideRemoteVideo(call);
            $scope.hasRemoteVideo = false;
        };

        var displayLocalVideo = function displayLocalVideo() {
            console.log("[DEMO] :: Display local video");
            rainbowSDK.webRTC.showLocalVideo();
            $scope.hasLocalVideo = true;
        };

        var hideLocalVideo = function hideLocalVideo() {
            console.log("[DEMO] :: Hide local video");
            rainbowSDK.webRTC.hideLocalVideo();
            $scope.hasLocalVideo = false;
        };

        $scope.hidePIP = function hidePIP() {
            rainbowSDK.webRTC.hideLocalVideo();
            $scope.isPIPDisplayed = false;
        };

        $scope.showPIP = function showPIP() {
            rainbowSDK.webRTC.showLocalVideo();
            $scope.isPIPDisplayed = true;
        };

        $scope.hideRemote = function hideRemote() {
            rainbowSDK.webRTC.hideRemoteVideo(currentCall);
            $scope.isRemoteVideoDisplayed = false;
        };

        $scope.showRemote = function showRemote() {
            rainbowSDK.webRTC.showRemoteVideo(currentCall);
            $scope.isRemoteVideoDisplayed = true;
        };

        $scope.addVideo = function addVideo() {
            rainbowSDK.webRTC.addVideoToCall(currentCall);
        };

        $scope.removeVideo = function removeVideo() {
            rainbowSDK.webRTC.removeVideoFromCall(currentCall);
        };

        $scope.release = function release() {
            rainbowSDK.webRTC.release(currentCall);
        };

        $scope.showSpectrum = function showSpectrum() {
            $scope.isSpectrumDisplayed = true;
            $rootScope.$broadcast("DEMO_ON_SPECTRUM_DISPLAY", $scope.isSpectrumDisplayed);
        };

        $scope.hideSpectrum = function hideSpectrum() {
            $scope.isSpectrumDisplayed = false;
            $rootScope.$broadcast("DEMO_ON_SPECTRUM_DISPLAY", $scope.isSpectrumDisplayed);
        };

        $scope.mute = function mute() {
            var conversationId = currentCall.conversationId;
            var conversation = rainbowSDK.conversations.getConversationById(conversationId);

            if (conversation) {
                rainbowSDK.webRTC.muteVideoCall(conversation);
                $scope.isMuted = true;
            }
        };

        $scope.unmute = function unmute() {
            var conversationId = currentCall.conversationId;
            var conversation = rainbowSDK.conversations.getConversationById(conversationId);

            if (conversation) {
                rainbowSDK.webRTC.unmuteVideoCall(conversation);
                $scope.isMuted = false;
            }
        };
    }
});
