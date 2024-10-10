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
    const removeApplied: boolean = (await storage.get('remove-applied-jobs')) || false;
    return removeApplied;
}

export async function shouldRemovePromotedJobs(): Promise<boolean>{
    const storage = new Storage();
    const removePromoted: boolean = (await storage.get('remove-promoted-jobs')) || false;
    return removePromoted;
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
            lastSeen: datetime,
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
        await updateJobLastAccess(storage, jobId, existingJob);
        return existingJob;
    } catch (error) {
        console.error('Error parsing job data:', {existingJobItem, error});
        return null;
    }
}

export async function updateJobLastAccess(storage: Storage, jobId: string, job: JobData): Promise<void> {
    try {
        const lastSeenDate = new Date(job.lastSeen).getTime();
        
        const lastHour = Date.now() - 60 * 60 * 1000; 
        if(lastSeenDate < lastHour){
            job.lastSeen = new Date().toISOString();
            await storage.setItem(`job_${jobId}`, JSON.stringify(job)); 
            // console.log('Successfully updated Last Seen:', {job})
        }
    } catch (error) {
        console.warn('An Error Ocurred updating the Last Seen Job Data!');
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

export async function deleteJobsNotSeenInTime(hours: number) {
    const storage = new Storage();

    const allItems = await storage.getAll();

    const jobKeys = Object.keys(allItems).filter((key) => key.includes("job_"));

    jobKeys.forEach(async (jobKey: string) => {
        const jobStored = await storage.get(jobKey);
        const job: JobData = JSON.parse(jobStored);
        const givenDate = new Date(job.lastSeen);
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - givenDate.getTime();
        const hourInMs = hours * 60 * 60 * 1000;
        const isWithinAmountHours = timeDiff >= 0 && timeDiff <= hourInMs;
         if (!isWithinAmountHours) {
            deleteFromCacheStorage(jobKey);
        }
    })
}

async function deleteFromCacheStorage(jobkey: string){
    if(jobkey.includes("job_")){
        const storage = new Storage();
        const job = await storage.getItem(jobkey)
        console.log('deleting', {job})
        await storage.remove(jobkey);
    } else{
        console.warn('Unable to delete from Cache Storage! Make sure your key has job_ prefix in it.')
    }

}

export async function getAllStorageItems(){
    const storage = new Storage();

    const allItems = await storage.getAll();
    const migration_key = await storage.getItem('migration_v1')

    console.log({migration_key, allItems});
   
}

export async function getAllJobStorage(): Promise<JobData[]> {
    const storage = new Storage();

    const allItems = await storage.getAll();
    const items = Object.keys(allItems).filter((item) => item.includes('job_'));

    
    const jobPromises = items.map(async (jobKey: string) => {
        const jobStored = await storage.get(jobKey);
        const job: JobData = JSON.parse(jobStored);
        return {...job};
    })

    const jobs: JobData[] = await Promise.all(jobPromises);

    return jobs;

}

export async function shouldRun(){
    const storage = new Storage();
    const storedEnabledState = await storage.get("enabled");
    const isEnabledValue = !!storedEnabledState
    // console.log(isEnabledValue)
    return isEnabledValue;
}

export async function shouldAutoApply(){
    const storage = new Storage();
    const autoApply: boolean = (await storage.get('auto-apply')) || false;
    return autoApply;
}

export async function getLastColor(): Promise<string | null | undefined>{
    const storage = new Storage();
    const lastColor: string | undefined | null = (await storage.get('lastColor'));
    return lastColor;
}