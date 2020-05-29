import rainbowSDK from "../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js";
var sample = angular.module("sample", ["sdk"]);

sample.controller("sampleController", [
  "$rootScope",
  function ($rootScope) {
    "use strict";

    /*********************************************************/
    /**                INITIALIZATION STUFF                 **/
    /*********************************************************/
    console.log("[DEMO] :: Rainbow Search Application");

    var appId = "";
    var appSecret = "";

    var ctrl = this;

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
]);
