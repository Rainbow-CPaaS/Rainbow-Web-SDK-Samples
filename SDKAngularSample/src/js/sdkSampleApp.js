import rainbowSDK from "../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js";
var sample = angular.module("sample", []);

sample.controller("sampleController", 
  function () {
    "use strict";

    /*********************************************************/
    /**                INITIALIZATION STUFF                 **/
    /*********************************************************/
    var appId = "";
    var appSecret = "";

    var onReady = function onReady() {
      console.log("[DEMO] :: Rainbow SDK is ready!");
    };

    rainbowSDK
      .initialize(appId, appSecret)
      .then(function () {
        console.log("[DEMO] :: Rainbow SDK is initialized!");
      })
      .catch(function () {
        console.log("[DEMO] :: Something went wrong with the SDK...");
      });

    this.initialize = function () {
      console.log("DEMO :: Rainbow Demo Application");

      document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
    };

    this.initialize();

    return true;
  },
);
