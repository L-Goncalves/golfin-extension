import { isDev } from "~global";
import { changeUIColor, getCurrentColors } from "./colors";
import { getUrl } from "./misc";

export function listen() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        isDev && console.log("[APP] Received message from background script:", message);

        (async () => {
            switch (message.name) {
                case "get-theme-color":
                    const colors = await getCurrentColors();
                    sendResponse({ colors });
                    break;
                case "update-theme-color":
                    changeUIColor(message.body.color);
                    break;
                case "get-current-url":
                    const { url } = await getUrl();
                    console.log("[APP] Current url:", url);
                    sendResponse({ url });
                    break;
                case "update-dropdown-timestamp":
                    break;
            }
        })();

        return true; // <--- keeps the message channel open for async sendResponse
    });
}