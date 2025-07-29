import { shouldSupressNotication } from "./storage"

export function hookTitleChange() {
  const titleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "title")

  if (!titleDescriptor || !titleDescriptor.configurable) {
    return 
  }
  // tries to hook the function (in case it gets called while we're in the tab)
  Object.defineProperty(document, "title", {
    configurable: true,
    enumerable: true,
    get() {
      return titleDescriptor.get.call(document)
    },
    set(value) {
      const cleanValue = value.replace(/\(\d+\)\s*/, "") // Remove (1), (2), etc
      titleDescriptor.set.call(document, cleanValue)
    }
  })

  // @ts-ignore
  if (window.__fixTitleInterval) return;
  // @ts-ignore
  window.__fixTitleInterval = setInterval(() => {
    if (document.title.includes("(")) {
      document.title = document.title.replace(/\(\d+\)\s*/, "") 
    }
  }, 500)
  
}


export async function handleSupressNotifications() {
  const shouldSupress = await shouldSupressNotication();
  if (shouldSupress) {
    hookTitleChange();
    const notification = document.querySelector('a[href*="https://www.linkedin.com/notifications/"] .notification-badge.notification-badge--show')
    notification?.remove();

    document.title = document.title.replace(/\s*\(\d+\)/, '');
  }

}