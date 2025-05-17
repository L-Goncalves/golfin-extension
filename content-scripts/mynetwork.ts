export async function autoConnect(){
    const list = document.querySelector('.mn-invitation-list.artdeco-list');

    if (list) {
      const buttons = [...list.querySelectorAll('li button:not(.artdeco-button--muted)')];
  
      for (const btn of buttons) {
        (btn as HTMLButtonElement).click();
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay of 500ms between clicks
      }
    } else {
       console.log("No invitation list found.");
    }
}