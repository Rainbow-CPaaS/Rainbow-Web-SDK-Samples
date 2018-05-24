angular.module("sample").component("rbxSpectrum", {
    
    bindings: {
    },
    
    templateUrl: "./src/js/components/spectrum/spectrumCmp.template.html",
    
    controller : function rbcPhoneCtrl(rainbowSDK, $rootScope, $scope, Call) {

        "use strict";

        var audioContext = new AudioContext();
        var ctx = null;
        var gradient = null;
        var javascriptNode = null;
        var remoteMediaStream = null;
        var analyser = null;
        var isSpectrumStarted = false;

        $scope.isInCommunication = false;
        $scope.isSpectrumDisplayed = false;

        this.$onInit = function() {

            // get the context from the canvas to draw on
            ctx = $("#canvasSound").get()[0].getContext("2d");

            // create a gradient for the fill. Note the strange
            // offset, since the gradient is calculated based on
            // the canvas, not the specific element we draw
            gradient = ctx.createLinearGradient(0, 0, 100, 0);

            gradient.addColorStop(1, "red");
            gradient.addColorStop(0.83, "orange");
            gradient.addColorStop(0.66, "yellow");
            gradient.addColorStop(0.50, "green");
            gradient.addColorStop(0.33, "blue");
            gradient.addColorStop(0.16, "indigo");
            gradient.addColorStop(0, "violet");

            // Subscribe to contact change
            $rootScope.$on("$destroy", ($rootScope.$on(rainbowSDK.webRTC.RAINBOW_ONWEBRTCCALLSTATECHANGED, onWebRTCCallChanged)));

            $rootScope.$on("$destroy", ($rootScope.$on(rainbowSDK.webRTC.RAINBOW_ONWEBRTCSTREAMADDED, onWebRTCStreamAdded)));

            $rootScope.$on("$destroy", ($rootScope.$on("DEMO_ON_SPECTRUM_DISPLAY", onSpectrumDisplayChanged)));

        };

        this.$onDestroy = function() {
        
        };

        var onWebRTCStreamAdded = function onWebRTCStreamAdded(__event, streams) {
            console.log("[DEMO] :: >>> WebRTC stream added", streams);
            if (!isSpectrumStarted) {
                startSpectrum(streams);
            }
        };

        var onSpectrumDisplayChanged = function onSpectrumDisplayChanged(__event, isDisplayed) {
            $scope.isSpectrumDisplayed = isDisplayed;
        };
        
        var onWebRTCCallChanged = function onWebRTCCallChanged(__event, call) {

            switch (call.status.value) {
                
                case Call.Status.RINGING_INCOMMING.value:
                    break;
                
                case Call.Status.ACTIVE.value:
                    $scope.isInCommunication = true;
                    break;
                
                case Call.Status.UNKNOWN.value:
                    $scope.isInCommunication = false;
                    stopSpectrum();
                    break;
                
                default:
                    break;
            }
        };

        var drawSpectrum = function drawSpectrum(array) {
            for ( var i = 0; i < (array.length); i++ ) {
                var value = array[i];
                ctx.fillRect( 0, i * 3, value / 2.56, 2 );
            }
        };

        var stopSpectrum = function stopSpectrum() {
            isSpectrumStarted = false;
            
            if (javascriptNode) {
                javascriptNode.disconnect();
            }

            if (remoteMediaStream) {
                remoteMediaStream.disconnect();
            }
            
            if (analyser) {
                analyser.disconnect();
            }
        };

        var startSpectrum = function manageSpectrum(streams) {

            console.log("[DEMO] :: WebRTC manageSpectrum");

            var listOfRemoteStreams = streams;

            var nWhichStream = 0;

            // Error ?  Bad call ?
            if ( listOfRemoteStreams.length > 0 ) {

                console.log("[DEMO] :: WebRTC manageSpectrum streams", listOfRemoteStreams);
                
                // Which stream ?
                if (listOfRemoteStreams.length > 1) {
                    // TODO
                    nWhichStream = 0;
                }

                // check for the stream
                var audioTracks = listOfRemoteStreams[nWhichStream].getAudioTracks();

                console.log("[DEMO] :: WebRTC manageSpectrum streams", audioTracks);

                if ( audioTracks && audioTracks.length === 1 ) {

                    // Get the remote stream and use it in the Audio stream
                    remoteMediaStream = audioContext.createMediaStreamSource(listOfRemoteStreams[nWhichStream]);
                    javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);
                    
                    remoteMediaStream.connect(javascriptNode);
                    
                    // setup a analyzer
                    analyser = audioContext.createAnalyser();
                    analyser.smoothingTimeConstant = 0.3;
                    analyser.fftSize = 512;

                    // create a buffer source node
                    remoteMediaStream.connect(analyser);
                    analyser.connect(javascriptNode);
                    javascriptNode.connect(audioContext.destination);

                    isSpectrumStarted = true;

                    javascriptNode.onaudioprocess = function(__event){
                        
                        // get the average for the first channel
                        var array =  new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);

                        // clear the current state
                        //ctx.clearRect(0, 0, 500, 100);
                        ctx.clearRect(0, 0, 100, 500);
                        //ctx.fillRect(0, 0, 500, 20);

                        // set the fill style
                        ctx.fillStyle = gradient;
                        drawSpectrum(array);
                    };

                }
            }
            else {
                console.log("[DEMO] :: WebRTC manageSpectrum no stream found");
            }
        };
    }

});