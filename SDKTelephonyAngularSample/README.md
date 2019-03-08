# Rainbow SDK for Web

Preamble
--------
The Rainbow SDK (Software Development Kit) for Web is a pure AngularJS JavaScript library that works on all modern browsers from IE 11 to the latest version of Chrome, Firefox, Safari and Edge. Its powerful APIs enable you to create the best applications that connect to the Rainbow Cloud Services.

SDK Angular Sample
------------------

This demo is provided "as it is" without support.

This demo demonstrates the use of the following Rainbow SDK for Web APIs:

- Connection Service: The demo shows how to use these APIs to connect to Rainbow

- Contacts Service: Using these services, the demo shows how to retrieve the informations from the contacts

- Telephony Service: These APIs are used in the demo to manage telephony calls (make, take and release).

Starting the demo
-----------------

Before running any of the files mentioned below, run `npm install` in the root folder. That will install the latest version of Rainbow Web SDK along with the basic http-server.

Once this is done, update the `appId` and `appSecret` variables in `src/js/components/sdkSampleApp.js` file. If you don't know where can you get your Application ID and Application Secret from, check our [guide](https://hub.openrainbow.com/#/documentation/doc/sdk/web/guides/Adding_id_and_secret_key).

At the end just run `npm start` in your console and open your browser on `http://localhost:8887/`.
