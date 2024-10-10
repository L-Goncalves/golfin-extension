
export async function changeUIColor(color:string){
      
        document.documentElement.style.setProperty('--color-action', color);
        document.documentElement.style.setProperty('--color-brand', color);
        document.documentElement.style.setProperty('--color-alert', color);
        document.documentElement.style.setProperty('--voyager-color-background-badge-new', color);
        document.documentElement.style.setProperty('--color-background-new', hexToRGBA(color, 0.2));
        document.documentElement.style.setProperty('--color-signal-positive', color);
        document.documentElement.style.setProperty('--color-action-on-dark', color);
        
        
}

function hexToRGBA(hex: string, alpha: number) {

  let cleanHex = hex.replace("#", "");
  
 
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  
  // Convert to RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Return the rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function getCurrentColors() {
    const actionColor = getComputedStyle(document.documentElement).getPropertyValue('--color-action').trim();
    const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--color-brand').trim();
    const alertColor = getComputedStyle(document.documentElement).getPropertyValue('--color-alert').trim();
  
    return {
      actionColor,
      brandColor,
      alertColor
    };
  }