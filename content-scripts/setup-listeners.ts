import { isDev } from "~global";
import { changeUIColor, getCurrentColors } from "./colors";
import { getUrl } from "./misc";

function updateURLParameter(seconds: number) {
    const currentUrl = window.location.href;
    
    // Only update URL if we're on job pages
    if (!currentUrl.includes('/jobs/collections') && !currentUrl.includes('/jobs/search')) {
        return;
    }
    
    const url = new URL(currentUrl);
    const fTPRValue = `r${seconds}`;
    
    // Update or add the f_TPR parameter
    url.searchParams.set('f_TPR', fTPRValue);
    
    // Navigate to the new URL to trigger page update
    window.location.href = url.toString();
    
    isDev && console.log(`[APP] Updated URL parameter f_TPR to: ${fTPRValue} and refreshed page`);
}

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
                    const { seconds } = message.body;
                    updateURLParameter(seconds);
                    break;
            }
        })();

        return true; // <--- keeps the message channel open for async sendResponse
    });
}