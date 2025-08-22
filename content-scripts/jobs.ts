// import { fetchOpenAIResponse } from "./ai"
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
      ".scaffold-layout__list > div > ul > li > div > div"
    )
  ].map((jobPost) => {
    const jobId = jobPost.getAttribute("data-job-id")
    const company = jobPost
      .querySelector(".artdeco-entity-lockup__subtitle.ember-view")
      .textContent.trim()
    const jobTitle = jobPost
      .querySelector(".artdeco-entity-lockup__title.ember-view a")
      .getAttribute("aria-label")
    const isSimpleApply = !!jobPost.querySelector(
      ".job-card-list__footer-wrapper li:last-of-type > span"
    ) && !!jobPost.querySelector(
      ".job-card-list__footer-wrapper li:last-of-type > svg"
    );
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
    element.style.flexDirection = "column";

    if (jobDetails.jobUrl) {
      const domain = getDomainFromUrl(jobDetails.jobUrl);
      const favicon = getDefaultFavicon(domain);

      // Create list item for domain
      const li = document.createElement("li");
      li.classList.add("domain");

      // Create image for favicon
      const img = document.createElement("img");
      img.src = favicon;
      img.style.width = "10px";

      // Event handlers for favicon
      img.onerror = function () {
        showFallback(img);
      };

      img.onload = function () {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          img.style.display = "none";
        }
      };

      // Create custom tooltip
      const tooltip = document.createElement("span");
      tooltip.classList.add("tooltip");
      tooltip.textContent = jobDetails.jobUrl;

      // Append elements to list item
      li.appendChild(img);
      li.appendChild(document.createTextNode(domain)); // Add domain text
      li.appendChild(tooltip); // Add tooltip

      // Append list item to the parent element
      element.appendChild(li);
    }
  }
  return;
}


function createTooltipTip(element) {

  
  if (!element.querySelector(".tooltip-tip")) {
    element.style.flexDirection = "column"
      const li = document.createElement("li")

      li.innerHTML = `Passe o mouse sobre o site para ver o Link completo`
      li.classList.add("tooltip-tip")

      element.appendChild(li)
    
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
      createDomainLabel(footerElement, jobDetails);
      createTooltipTip(footerElement);
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