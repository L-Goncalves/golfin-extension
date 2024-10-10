import { isDev } from "~global";
import { changeUIColor, getCurrentColors } from "./colors";



export function listen(){
    chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
        isDev && console.log("[APP] Received message from background script:", message);


        if (message.name === "get-theme-color") {
            const colors = await getCurrentColors();
    
            sendResponse({ colors });
          }

        if(message.name === "update-theme-color"){
            changeUIColor(message.body.color)
            
        }
    });
}