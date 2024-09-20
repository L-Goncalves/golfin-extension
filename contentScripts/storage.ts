import { Storage } from "@plasmohq/storage";

export async function getCompaniesBlacklisted(){
    const storage = new Storage();
    const storedCompanies: any = (await storage.get("companies")) || []; // Fallback to an empty array

    return storedCompanies;
}

export async function shouldRemoveAllFeedPosts(): Promise<boolean> {
    const storage = new Storage();
    const shouldRemove: boolean = (await storage.get("removeFeedPosts")) || false; // Default to false if not found
    return shouldRemove;
}

export async function shouldRemoveFeedPosts(): Promise<boolean> {
    const storage = new Storage();
    const shouldRemove: boolean = (await storage.get("removeFeedPostsByWords")) || false; // Default to false if not found
    return shouldRemove;
}

export async function shouldFilterByCompany(): Promise<boolean> {
    const storage = new Storage();
    const shouldFilter: boolean = (await storage.get("shouldFilterByCompany")) || false; // Default to false if not found
    return shouldFilter;
}


export async function getKeywordsSaved(): Promise<string[]> {
    const storage = new Storage();
    const keywords = (await storage.get('keywords')) as string[] || [];
    return keywords;
}

export async function shouldAutoConnect(): Promise<boolean> {
    const storage = new Storage();
    const autoConnect: boolean = (await storage.get('autoConnect')) || false;
    return autoConnect;
}

export async function shouldSaveJobSearch(): Promise<boolean> {
    const storage = new Storage();
    const saveJobSearch: boolean = (await storage.get('saveJobSearch')) || false;
    return saveJobSearch;
}

export async function shouldFilterByDomain(): Promise<boolean> {
    const storage = new Storage();
    const filterByDomain: boolean = (await storage.get('filterJobsByDomain')) || false;
    return filterByDomain;
}


export async function saveSearchToStorage(search: string){

}