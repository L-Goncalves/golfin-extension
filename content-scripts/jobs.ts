import { fetchOpenAIResponse } from "./ai"
import { getDomainsSaved, getSavedJobUrl, saveJobUrl, saveSearchToStorage } from "./storage"
import { curriculum } from './cv'
export function deleteJobPost(jobId: string) {
  const jobPost = document.querySelector(`[data-job-id="${jobId}"]`)

  if (jobPost) {
    jobPost.remove()
    // console.log(`Job post with ID ${jobId} has been removed.`)
  } else {
    // console.log(`Job post with ID ${jobId} not found.`)
  }
}

export function removeAppliedJobs(){
  const jobList = getJobListWithInfo()
  //console.log({jobList})

  const jobPostingsToBeDeleted = jobList.filter((job) =>
      job.footerElement?.textContent.toLowerCase().trim().includes("candidatou-se")
  )


  jobPostingsToBeDeleted.forEach((jobPost) => {
    deleteJobPost(jobPost.jobId)
  })

}

export function removePromotedJobs(){
  const jobList = getJobListWithInfo()

  const jobPostingsToBeDeleted = jobList.filter((job) =>
      job.footerElement.textContent.toLowerCase().trim().includes("promovida")
  )


  jobPostingsToBeDeleted.forEach((jobPost) => {
    deleteJobPost(jobPost.jobId)
  })

}

export function filterJobsByCompanyNames(blacklist: string[]) {
  const jobList = getJobListWithInfo()

  const jobPostingsToBeDeleted = jobList.filter((job) =>
    blacklist.some((company) =>
      job.company.toLowerCase().includes(company.toLowerCase())
    )
  )

  jobPostingsToBeDeleted.forEach((jobPost) => {
    deleteJobPost(jobPost.jobId)
  })
}

export function getJobListWithInfo() {
  const jobList = [
    ...document.querySelectorAll(
      ".jobs-search-results-list > ul > li > div > div"
    )
  ].map((jobPost) => {
    const jobId = jobPost.getAttribute("data-job-id")
    const company = jobPost
      .querySelector(".job-card-container__primary-description")
      .textContent.trim()
    const jobTitle = jobPost
      .querySelector(".job-card-list__title")
      .getAttribute("aria-label")
    const isSimpleApply = !!jobPost.querySelector(
      ".job-card-container__apply-method"
    )
    const footerElement = jobPost.querySelector(
      ".job-card-list__footer-wrapper"
    )
    return { jobId, company, jobTitle, isSimpleApply, footerElement }
  })

  return jobList;
}



export async function filterJobsByDomains() {
  const domains = await getDomainsSaved();
  const jobList = getJobListWithInfo()

  const nonSimpleApply = jobList.filter(
    (jobPost) => jobPost.isSimpleApply == false
  )

  nonSimpleApply.forEach(async (jobPost) => {
    const jobDetails = await getSavedJobUrl(jobPost.jobId)
    
    if (jobDetails) {
     
      if (jobDetails.jobUrl) {
    

        // Check if any domain is included in the cleanUrl
        if (domains.some((domain) => jobDetails.jobUrl.includes(domain))) {
          deleteJobPost(jobDetails.jobId);
        }
      }
    }
  })
}

function getDefaultFavicon(pageUrl: string) {
  // Assume favicon is located at /favicon.ico
  const defaultFaviconUrl = `https://${pageUrl}/favicon.ico`

  return defaultFaviconUrl
}
function showFallback(img: HTMLImageElement) {
  const icon = getWarningIcon();
  img.src = icon; // Path to your PNG fallback image
  img.style.width = "16px"
  img.alt = "Unable to Load"; // Alt text for accessibility
}


function getWarningIcon(){
   return 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.69-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-15.38 310.18l-2.51-31.62c-4.26-52.99-8.07-94.08-8.08-149.34-.01-1.26.51-2.41 1.34-3.24.83-.83 1.98-1.35 3.24-1.35h42.77c1.27 0 2.41.52 3.24 1.35a4.54 4.54 0 011.35 3.24c0 55.01-3.58 96.75-7.53 149.85l-2.31 31.32a4.584 4.584 0 01-1.43 2.97c-.83.77-1.94 1.24-3.13 1.24H245.2a4.52 4.52 0 01-3.21-1.32c-.8-.79-1.32-1.89-1.37-3.1zm-6.01 72.6v-30.2c0-1.25.51-2.4 1.34-3.23a4.54 4.54 0 013.24-1.35h33.61c1.26 0 2.41.51 3.24 1.34l.08.09c.78.83 1.27 1.95 1.27 3.15v30.2c0 1.27-.52 2.41-1.35 3.24-.83.83-1.98 1.35-3.24 1.35h-33.61c-1.26 0-2.41-.52-3.24-1.35a4.556 4.556 0 01-1.34-3.24z"/></svg>`);
}



function getDomainFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url)
    const hostnameParts = parsedUrl.hostname.split(".")

    // List of known ccTLDs
    const ccTLDs = ["com.br", "co.uk", "gov.br", "edu.br", "net.br"] // Add more as needed

    if (hostnameParts.length > 2) {
      const lastPart = hostnameParts.slice(-1)[0] // Get the last part
      const secondLastPart = hostnameParts.slice(-2).join(".") // Join last two parts

      // Check if the last two parts form a known ccTLD
      if (ccTLDs.includes(secondLastPart)) {
        return hostnameParts.slice(-3).join(".")
      }

      return secondLastPart
    }

    return parsedUrl.hostname
  } catch (error) {
    console.error("Invalid URL:", error)
    return null
  }
}


function createDomainLabel(element, jobDetails) {
  if (!element.querySelector(".domain")) {
    


    element.style.flexDirection = "column"

    if (jobDetails.jobUrl) {
      const domain = getDomainFromUrl(jobDetails.jobUrl)
      const favicon = getDefaultFavicon(domain)

      const li = document.createElement("li")
      const img = document.createElement("img")
      img.src = favicon
      img.style.width = "10px"

      // Event handlers
      img.onerror = function () {
        showFallback(img);
      }

      img.onload = function () {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          img.style.display = "none"
        }
      }

      li.innerHTML = `${domain}`

      li.classList.add("domain")
      // Append the image to the list item
      li.insertBefore(img, li.firstChild)

      element.appendChild(li)
    }
  }
  return
}

function createFullUrlLink(element, jobDetails) {
  if (!element.querySelector(".full-url")) {

    let cleanUrl = jobDetails.jobUrl


    element.style.flexDirection = "column"

    if (cleanUrl) {
      const li = document.createElement("li")

      li.innerHTML = `URL: <a href="${cleanUrl}" target="_blank">${cleanUrl}</a>`
      li.classList.add("full-url")

      element.appendChild(li)
    }
  }
  return
}

export async function showIcons() {
  const jobList = getJobListWithInfo()

  const nonSimpleApply = jobList.filter(
    (jobPost) => jobPost.isSimpleApply == false
  ).filter((job) =>
    !job.footerElement?.textContent.toLowerCase().trim().includes("candidatou-se")
  )
  
  nonSimpleApply.forEach(async (jobPost) => {
    const footerElement = jobPost.footerElement as HTMLElement
    const jobDetails = await getSavedJobUrl(jobPost.jobId);
    if(jobDetails){
      createDomainLabel(footerElement, jobDetails)
      createFullUrlLink(footerElement, jobDetails)
    }
  
  })
}

export async function saveJobSearch() {
  const url = document.URL
  if (url.includes("keywords")) {
    const keywordsRegex = /[?&]keywords=([^&#]*)/

    const match = url.match(keywordsRegex)

    const keywords = match ? decodeURIComponent(match[1]) : null
    // console.log(keywords)
    saveSearchToStorage(keywords)
  }
}



export async function fetchJobUrlsAndSave(){
  const jobList = getJobListWithInfo()
  jobList.filter((job) => !job.isSimpleApply).forEach(async ({jobId}) => {
    await fetchJobUrlAndSave(jobId)
  })

}


async function fetchJobUrl2(jobId: string) {

  const COOKIE_STR = document.cookie;
  let csfr = '';
  COOKIE_STR.split(';').forEach(cookie => {
    const [name, value] = cookie.split('=').map(c => c.trim());
    // Exclude JSESSIONID from the string
    if (name === 'JSESSIONID') {
        csfr = `${value}`.replaceAll('"', "");
    }
  });


    
    try {
        const response = await fetch(`https://www.linkedin.com/voyager/api/graphql?variables=(cardSectionTypes:List(TOP_CARD),jobPostingUrn:urn%3Ali%3Afsd_jobPosting%3A${jobId},includeSecondaryActionsV2:true)&queryId=voyagerJobsDashJobPostingDetailSections.62b71d68e059121ffcfb4c068d73d6d1`, {
            headers: {
                "accept": "application/vnd.linkedin.normalized+json+2.1",
                "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
                 "csrf-token": `${csfr}`,
                "cookie": `${COOKIE_STR}`,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            method: "GET"
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let data = '';
  
        // Read the response body as a stream
        const processText = async () => {
            const { done, value } = await reader.read();
            if (done) {
                // Parse the full response and filter for companyApplyUrl
                const jsonResponse = JSON.parse(data);
                const companyUrl = jsonResponse.included
                    .filter(item => item.companyApplyUrl)
                    .map(item => item.companyApplyUrl)[0]; // Get the first matching companyApplyUrl
               // console.log(companyUrl)
                return companyUrl; // Return the value
            }
            data += decoder.decode(value, { stream: true });
            return processText(); // Continue reading
        };
  
        return await processText(); // Start processing the stream
    } catch (err) {
        console.error('Fetch error:', err);
        throw err; // Propagate the error
    }
  }

  export async function fetchJobUrlAndSave(jobId: string) {
    const existingJob = await getSavedJobUrl(jobId);
  
    if (!existingJob) {
         // console.log('JOBID NOT SAVED:', jobId);
          const jobUrl = await fetchJobUrl2(jobId)
          await saveJobUrl(jobId, jobUrl);
          return { jobId, jobUrl };

    }

    return existingJob;
  }
  

let hasRequested = false;
export async function autoApply() { 
  const overallQuestions = document.querySelectorAll('.jobs-easy-apply-content form .jobs-easy-apply-form-section__grouping');
  const textAreaQuestions =[...overallQuestions].map((question: HTMLElement) => { return question.querySelector('div[data-test-multiline-text-form-component]')}).filter((el) => el != null);;
  const dropdownQuestions = [...overallQuestions].map((question: HTMLElement) => { return question.querySelector('div[data-test-text-entity-list-form-component]')});
  const formQuestions =  [...overallQuestions].map((question: HTMLElement) => { return question.querySelector('div[data-test-single-line-text-form-component]')}).filter((el) => el != null);
  const typeAheadQuestions =[...overallQuestions].map((question: HTMLElement) => { return question.querySelector('div[data-test-single-typeahead-entity-form-component]')}); 



console.log({formQuestions});
  const questions = [...formQuestions, ...textAreaQuestions].map((element: HTMLElement) => {
      const label = element.querySelector('label');
      const question = label.textContent.trim();
      const isMandatory = window.getComputedStyle(label, '::after').content !== 'none';
      let input: HTMLInputElement | HTMLTextAreaElement = element.querySelector('input');
      if(!input){
        input = element.querySelector('textarea');
      }
      return { question, isMandatory, input };
  });


  if (!hasRequested && questions.length > 0) {
    hasRequested = false; // Set the flag to true
    console.log(questions)
    // Iterate through each question
    for (let i = 0; i < questions.length; i++) {
        if(questions[i].input.value.length > 0 || !questions[i].isMandatory){
          continue;
        }

        if(questions[i].question?.includes('phone') || questions[i].question?.includes('celular')){
          continue;
        }
        // Fetch the answer for the current question
        const answer = await fetchOpenAIResponse(curriculum, questions[i].question);

        // Fill in the input field with the received answer, if applicable
        if (questions[i].input) {
            questions[i].input.value = answer;

             // Create a new event
            const event = new Event('input', {
              bubbles: true, // Ensure the event bubbles up to parent elements
              cancelable: true // Allows the event to be canceled
          });
          
          // Dispatch the event to mimic user input
          questions[i].input.dispatchEvent(event);
        }
    }
}


}

  // export async function autoApply(){
  //   // const jobId = '3983185893'
  //   // const li = document.querySelector(`[data-job-id]="${jobId}"`) as HTMLDListElement;   
    
  //   // console.log('applying')
  //   // li.click()
  //   const dropdownQuestions = document.querySelectorAll('.jobs-easy-apply-content form .jobs-easy-apply-form-section__grouping div[data-test-text-entity-list-form-component]');
  //   const formQuestions = document.querySelectorAll('.jobs-easy-apply-content form .jobs-easy-apply-form-section__grouping div[data-test-single-line-text-form-component]');
  
  //   const questions = [...formQuestions].map((element: HTMLElement) => {
  //     const label = element.querySelector('label');
  //     const question = label.textContent;
  //     const isMandatory = window.getComputedStyle(label, '::after').content !== 'none';
  //     const input = element.querySelector('input');
   
  //     return {question, isMandatory, input};
  //   })

  //   console.log(questions)
  // //   const apply = document.querySelector('.jobs-apply-button--top-card > button') as HTMLElement;

  // //   const errors = document.querySelectorAll('.artdeco-inline-feedback__message')
  // //   if(apply){
  // //     apply.click();
  // //   }

  // // // #avançar
    
  // //   if(errors.length == 0){
  // //     const nextBtn = document.querySelector('.jobs-easy-apply-content button.artdeco-button--primary') as HTMLElement;

  // //     nextBtn?.click()
  // //   }

  
  // }

  // autoApply();