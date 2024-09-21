import { getSavedJobUrl, saveJobUrl, saveSearchToStorage } from "./storage"

export function deleteJobPost(jobId: string) {
  const jobPost = document.querySelector(`[data-job-id="${jobId}"]`)

  if (jobPost) {
    jobPost.remove()
    console.log(`Job post with ID ${jobId} has been removed.`)
  } else {
    console.log(`Job post with ID ${jobId} not found.`)
  }
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
    // job-card-list__footer-wrapper
    return { jobId, company, jobTitle, isSimpleApply, footerElement }
  })

  return jobList
}

export function filterJobsByDomains(domains: string[]) {}

function getDefaultFavicon(pageUrl) {
  // Assume favicon is located at /favicon.ico
  const defaultFaviconUrl = `https://${pageUrl}/favicon.ico`

  return defaultFaviconUrl;
}

async function getJobActualUrl(jobId) {

  const existingJob = await getSavedJobUrl(jobId);

  if(!existingJob){
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`

    return fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.text()
        } else {
          throw new Error("Network response was not ok.")
        }
      })
      .then((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")
  
        const applyUrlElement = doc.querySelector("#applyUrl")
        let jobUrl = "Not Found"
        if (applyUrlElement) {
          const applyUrl = applyUrlElement
            ? applyUrlElement.innerHTML.trim()
            : "Apply URL not found."
  
          const match = applyUrl.match(/"(https:\/\/[^"]+)"/)
          if (match) {
            jobUrl = match[1]
          }
        }

        
        saveJobUrl(jobId, jobUrl);
        return { jobId, jobUrl }
      })
      .catch((error) => {
        console.error(
          `There was a problem with fetching job details for jobId ${jobId}:`,
          error
        )
        return { jobId, jobUrl: "Error fetching apply URL" }
      })
  }

  return existingJob

 
}

function getDomainFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostnameParts = parsedUrl.hostname.split('.');
    
    // List of known ccTLDs
    const ccTLDs = ['com.br', 'co.uk', 'gov.br', 'edu.br', 'net.br']; // Add more as needed

    if (hostnameParts.length > 2) {
      const lastPart = hostnameParts.slice(-1)[0]; // Get the last part
      const secondLastPart = hostnameParts.slice(-2).join('.'); // Join last two parts

      // Check if the last two parts form a known ccTLD
      if (ccTLDs.includes(secondLastPart)) {
        return hostnameParts.slice(-3).join('.'); // Return the domain including subdomain
      }
      
      return secondLastPart; // Return only the last two parts
    }

    return parsedUrl.hostname; // Return as-is if no subdomain
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}


export async function showIcons() {
  const jobList = getJobListWithInfo()

  const nonSimpleApply = jobList.filter(
    (jobPost) => jobPost.isSimpleApply == false
  )

  for (let index = 0; index < nonSimpleApply.length; index++) {
    const jobPost = nonSimpleApply[index]
    const footerElement = jobPost.footerElement  as HTMLElement;

    // Check if the <li> already exists by a unique class or ID
    if (!footerElement.querySelector(".non-simple-apply")) {
      // Fetch the job details asynchronously
      const jobDetails = await getJobActualUrl(jobPost.jobId) // Pass job ID or other identifier

    
      // Create a new <li> element
      const newListItem = document.createElement("li")

      const url = decodeURIComponent(jobDetails.jobUrl)
      const match = url.match(/url=([^"&]+)/)
      let cleanUrl;

      if (match) {
        cleanUrl = decodeURIComponent(match[1])
      }

      // Customize the content to include the job's URL and any other details
      newListItem.innerHTML = `URL: <a href="${cleanUrl}" target="_blank">${cleanUrl}</a>`

      // Add a class to identify it
      newListItem.classList.add("non-simple-apply")

      // Append the new <li> element to the footerElement
      footerElement.style.flexDirection = "column";

      if (cleanUrl) {
        const domain = getDomainFromUrl(cleanUrl);
        const favicon = getDefaultFavicon(domain);
    
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = favicon;
        img.style.width = "10px";
        
        // Event handlers
        img.onerror = function() {
          img.style.display = 'none';
        };
    
        img.onload = function() {
            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
              img.style.display = 'none';
            }
        };
    
        li.innerHTML = `${domain}`;
        li.style.maxHeight = "10px";
        li.style.gap = "10px";
        li.style.alignItems = "center";
        li.style.display = "flex";
        li.style.marginTop = "5px";
        li.style.marginBottom = "5px";
        
        // Append the image to the list item
        li.insertBefore(img, li.firstChild);
    
        footerElement.appendChild(li);
    }

      footerElement.appendChild(newListItem)
    }
  }

  console.log(nonSimpleApply)
}

export async function saveJobSearch() {
  const url = document.URL
  if (url.includes("keywords")) {
    const keywordsRegex = /[?&]keywords=([^&#]*)/

    const match = url.match(keywordsRegex)

    const keywords = match ? decodeURIComponent(match[1]) : null
    console.log(keywords)
    saveSearchToStorage(keywords)
  }
}
