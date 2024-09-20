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
