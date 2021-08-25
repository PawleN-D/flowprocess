import { IRIS } from "@databalk/iris-sdk-js";
export var SDK;
(function (SDK) {
  SDK.client = new IRIS("https://TeamBP-VeraDev.azurewebsites.net");
})(SDK || (SDK = {}));
