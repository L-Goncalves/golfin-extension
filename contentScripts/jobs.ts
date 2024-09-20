import { saveSearchToStorage } from "./storage";

export function deleteJobPost(jobId: string){
    const jobPost = document.querySelector(`[data-job-id="${jobId}"]`);
  
    if (jobPost) {
        jobPost.remove();
        console.log(`Job post with ID ${jobId} has been removed.`);
    } else {
        console.log(`Job post with ID ${jobId} not found.`);
    }
  }



export function filterJobsByCompanyNames(blacklist: string[]){
    const jobList = getJobListWithInfo();
  
    const jobPostingsToBeDeleted = jobList.filter((job) => 
        blacklist.some((company) => job.company.toLowerCase().includes(company.toLowerCase()))
    );

    jobPostingsToBeDeleted.forEach((jobPost) => {
        deleteJobPost(jobPost.jobId);
    })

  }


export function getJobListWithInfo(){

    
    const jobList = [...document.querySelectorAll('.jobs-search-results-list > ul > li > div > div')].map((jobPost) => {
        const jobId =  jobPost.getAttribute('data-job-id') 
        const company = jobPost.querySelector('.job-card-container__primary-description').textContent.trim();
        const jobTitle = jobPost.querySelector('.job-card-list__title').getAttribute('aria-label');
        const isSimpleApply = !!jobPost.querySelector('.job-card-container__apply-method');

        return {jobId, company, jobTitle, isSimpleApply}
    })

    return jobList;

}

export function filterJobsByDomains(domains: string[]){
  
}


export async function saveJobSearch(){
    const url = document.URL
    if(url.includes('keywords')){
       
        const keywordsRegex = /[?&]keywords=([^&#]*)/;


        const match = url.match(keywordsRegex);
    
        const keywords = match ? decodeURIComponent(match[1]) : null;
        console.log(keywords)
        saveSearchToStorage(keywords)
    }

 
}