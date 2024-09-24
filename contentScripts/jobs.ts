import { getDomainsSaved, getSavedJobUrl, saveJobUrl, saveSearchToStorage } from "./storage"

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
  console.log({jobList})

  const jobPostingsToBeDeleted = jobList.filter((job) =>
      job.footerElement?.textContent.toLowerCase().trim().includes("candidatou-se")
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
        img.style.display = "none"
      }

      img.onload = function () {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          img.style.display = "none"
        }
      }

      li.innerHTML = `${domain}`
      li.style.maxHeight = "10px"
      li.style.gap = "10px"
      li.style.alignItems = "center"
      li.style.display = "flex"
      li.style.marginTop = "5px"
      li.style.marginBottom = "5px"
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


async function fetchJobUrl2(jobId) {

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
                // "Referer": "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4025765247&discover=recommended&discoveryOrigin=JOBS_HOME_JYMBII&eBP=CwEAAAGSJD57Ycb-GiCRk0ZMheXcQhzc_KHaK1PtCpIE0vgzBzJbdyjUvaXbeoT3W3VN9AHDbSVBFBosVN6_e_bBmvGB6zDdcFLcBGCAqC5M760qjf5__UOfdC2JhmQBkyO8IxXtp5MJ4yUBOwu7kTwmNMUJkQG-MM6PcR6TkAumJI5dxi3O_Dby9UHO1h4m9CVEmG9f_nQWK5etMgqs05Hxfo7uQBIbfra_hpeKUnPzubOZ6v9Iwx6aJYoeRfk7Qm-jGYywlCrGXJzktLwKdSg7APqjVrzMYS2d4_ASP-moxA3FrXbmBKd9FmhSab5kwSvX6NMkKN2_gP3h9Tr5a90IoaFkiGuS15SyyHo4cU9DiZICD8IaW17oCFfZ8IPa6ZLs2dbR-RuE97Gv2UElTrHhR7-R_xQQu1MpUxRku9qVY9aLFBgewA&refId=VelrwFw0OzyJrBs0iwSlig%3D%3D&trackingId=0cJ0mkgtSwRWLnX2pqCxnw%3D%3D",
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
                console.log(companyUrl)
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
          console.log('JOBID NOT SAVED:', jobId);
          const jobUrl = await fetchJobUrl2(jobId)
          await saveJobUrl(jobId, jobUrl);
          return { jobId, jobUrl };

    }

    return existingJob;
  }
  