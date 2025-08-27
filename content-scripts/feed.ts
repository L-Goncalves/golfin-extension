import { getKeywordsSaved } from "./storage";

// Global flag to track if feed has been replaced
let feedAlreadyReplaced = false;

// Simple translation helper for this file
const getTranslations = async () => {
  // Import Storage here to avoid issues
  const { Storage } = await import("@plasmohq/storage");
  const storage = new Storage();
  
  try {
    const lang = await storage.get('selectedLanguage') || 'portuguese';
    
    const translations = {
      english: {
        title: "Time to focus! LinkedIn break activated",
        subtitle: "Focus is the weapon of the persistent and the armor of the victorious.",
        hint: "Disable this in GolfIn extension settings"
      },
      portuguese: {
        title: "Chega de LinkedIn por agora! você precisa focar!",
        subtitle: "Foco é a arma dos perseverantes e a armadura dos vitoriosos.",
        hint: "Desative isso nas configurações da extensão GolfIn"
      }
    };
    
    return translations[lang] || translations.portuguese;
  } catch (error) {
    console.error('Error getting language:', error);
    // Fallback to Portuguese
    return {
      title: "Chega de LinkedIn por agora! você precisa focar!",
      subtitle: "Foco é a arma dos perseverantes e a armadura dos vitoriosos.",
      hint: "Desative isso nas configurações da extensão GolfIn"
    };
  }
};

export async function removeFeed() {
  // Try multiple selectors as LinkedIn changes their structure frequently
  const selectors = [
    'main[aria-label="Feed principal"]',
    'main[aria-label="Main feed"]',
    'main[aria-label="Main Feed"]', 
    'main[role="main"]',
    '.scaffold-finite-scroll',
    '[data-test-id="feed"]',
    '.feed-shared-update-v2'
  ];
  
  let targetElement = null;
  
  for (const selector of selectors) {
    targetElement = document.querySelector(selector);
    if (targetElement) {
      console.log(`[removeFeed] Found element with selector: ${selector}`);
      break;
    }
  }
  
  if (!targetElement) {
    console.warn('[removeFeed] Could not find feed element with any selector');
    return;
  }
  
  // Check if feed has already been replaced
  if (feedAlreadyReplaced) {
    // Content already replaced, no need to do it again
    return;
  }
  
  const t = await getTranslations();
  const newContent = `
    <div data-golfin-feed-replaced="true" style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="font-size: 24px; color: #333;">${t.title}</h2>
      <p style="font-size: 18px; color: #666;">${t.subtitle}</p>
      <p style="font-size: 14px; color: #999; margin-top: 20px;">${t.hint}</p>
    </div>
  `;

  try {
    targetElement.innerHTML = newContent;
    feedAlreadyReplaced = true;
    // console.log('[removeFeed] Successfully replaced feed content');
  } catch (error) {
    console.error('[removeFeed] Error replacing content:', error);
  }
}

// Function to reset the feed replacement state (call when user disables the setting)
export function resetFeedReplacement() {
  feedAlreadyReplaced = false;
}

export async function filterFeedPostsByKeywords(){
    try {
        const keywords = await getKeywordsSaved();
        
        if (!Array.isArray(keywords) || keywords.length === 0) {
            console.warn('[filterFeedPostsByKeywords] No valid keywords found');
            return;
        }
        
        [...document.querySelectorAll('.scaffold-finite-scroll__content > div')].forEach(parent => {
          const postTextElement = parent.querySelector('div:not([class]) > .display-flex > .fie-impression-container .break-words');
          if (postTextElement) {
              const postText = postTextElement.textContent?.toLowerCase() || '';
              
              // Check if the post text contains any of the stored keywords
              const containsKeyword = keywords.some(keyword => 
                  typeof keyword === 'string' && keyword.trim() !== '' && 
                  postText.includes(keyword.toLowerCase().trim())
              );
              
              if (containsKeyword) {
                  parent.remove(); // Remove the post if it contains a keyword
              }
          }
        });
    } catch (error) {
        console.error('[filterFeedPostsByKeywords] Error filtering posts:', error);
    }
}