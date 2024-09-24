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

export async function shouldDisplayIcons(): Promise<boolean> {
    const storage = new Storage();
    const showIcons: boolean = (await storage.get('shouldShowIcons')) || false;
    return showIcons;
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

export async function shouldRemoveAppliedJobs(): Promise<boolean>{
    const storage = new Storage();
    const filterByDomain: boolean = (await storage.get('remove-applied-jobs')) || false;
    return filterByDomain;
}

export async function getSearchesSaved(): Promise<string[]> {
    const storage = new Storage();
    const searches = (await storage.get('searches')) as string[] || [];
    return searches;
}

export async function getDomainsSaved(): Promise<string[]> {
    const storage = new Storage();
    const domains = (await storage.get('domains')) as string[] || [];
    return domains;
}

export async function saveSearchToStorage(search: string) {
    const storage = new Storage();
    

    const searches = await getSearchesSaved();
  

    if (!searches.includes(search)) {
      // Adiciona a nova pesquisa à lista
      const updatedSearches = [...searches, search];
      
      // Salva a lista atualizada no armazenamento
      await storage.set('searches', updatedSearches);
    }
}


export async function saveJobUrl(jobId: string, jobUrl: string) {
    const storage = new Storage();
    const datetime = new Date().toISOString(); 


    const existingJob = await storage.getItem(`job_${jobId}`); 

    if (!existingJob) {

        const jobData: JobData = {
            jobId: jobId,
            jobUrl: jobUrl,
            timestamp: datetime,
        };

   
        // console.log({jobData})
        await storage.setItem(`job_${jobId}`, JSON.stringify(jobData));
    } else {
        // console.log(`Job with ID ${jobId} already exists in storage.`);
    }
}

export async function getSavedJobUrl(jobId: string): Promise<JobData | null> {
    const storage = new Storage();

    const existingJobItem = await storage.getItem(`job_${jobId}`);

   
    if (!existingJobItem) {
        return null;
    } 

    try {
        const existingJob: JobData = JSON.parse(existingJobItem);
        return existingJob;
    } catch (error) {
        console.error('Error parsing job data:', {existingJobItem, error});
        return null;
    }
}



export async function deleteAllStorage() {
    const storage = new Storage();

    const allItems = await storage.getAll();
 //   console.log(allItems)

    const items = Object.keys(allItems);


    await storage.removeMany(items);
    // console.log(`Deleted ${items.length} items from storage.`);
}

export async function getAllStorage() {
    const storage = new Storage();

    const allItems = await storage.getAll();

    const items = Object.keys(allItems);

    console.log(items)

}

export async function shouldRun(){
    const storage = new Storage();
    const storedEnabledState = await storage.get("enabled");
    const isEnabledValue = !!storedEnabledState
    // console.log(isEnabledValue)
    return isEnabledValue;
}