export function getKeywordsSaved(callback: (keywords: string[]) => void): void {
    chrome.storage.local.get(['keywordsFeed'], function(result) {
        const keywords = result.keywordsFeed || [];
        callback(keywords);
    });
}

export function saveKeywordsStorage(keywords: string[]): void {
    chrome.storage.local.set({ keywordsFeed: keywords }, function() {
        console.log('Keywords saved:', keywords);
    });
}
