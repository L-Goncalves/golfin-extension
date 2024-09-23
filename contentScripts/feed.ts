import { getKeywordsSaved } from "./storage";


export function removeFeed() {
 
  const newContent = `
  <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
    <h2 style="font-size: 24px; color: #333;">Chega de LinkedIn por agora! você precisa focar!</h2>
    <p style="font-size: 18px; color: #666;">Foco é a arma dos perseverantes e a armadura dos vitoriosos.</p>
  </div>
`;

  const selector = `main.scaffold-layout__main`
  document.querySelector(selector).innerHTML =newContent;
}


export async function filterFeedPostsByKeywords(){

    const keywords = await getKeywordsSaved();
    [...document.querySelectorAll('.scaffold-finite-scroll__content > div')].forEach(parent => {
      const postTextElement = parent.querySelector('div:not([class]) > .display-flex > #fie-impression-container .break-words'); // Selects <div> without a class
      
      if (postTextElement) {
          const postText = postTextElement.textContent.toLowerCase();
          
          // Check if the post text contains any of the stored keywords
          const containsKeyword = keywords.some(keyword => postText.includes(keyword.toLowerCase().trim()));
          
          if (containsKeyword) {

              parent.remove(); // Remove the post if it contains a keyword
          }
      }
  });
  }