import { getDomainsSaved, getSavedJobUrl, saveJobUrl, saveSearchToStorage } from "./storage"

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
      const url = decodeURIComponent(jobDetails.jobUrl)
      const match = url.match(/url=([^"&]+)/)
      let cleanUrl

      if (match) {
        cleanUrl = decodeURIComponent(match[1])

        // Check if any domain is included in the cleanUrl
        if (domains.some((domain) => cleanUrl.includes(domain))) {
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


async function fetchJobUrlAndSave(jobId: string) {
  const existingJob = await getSavedJobUrl(jobId)

  if (!existingJob) {
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

        saveJobUrl(jobId, jobUrl)
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
    const url = decodeURIComponent(jobDetails.jobUrl)
    const match = url.match(/url=([^"&]+)/)
    let cleanUrl

    if (match) {
      cleanUrl = decodeURIComponent(match[1])
    }

    element.style.flexDirection = "column"

    if (cleanUrl) {
      const domain = getDomainFromUrl(cleanUrl)
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
    const url = decodeURIComponent(jobDetails.jobUrl)
    const match = url.match(/url=([^"&]+)/)
    let cleanUrl

    if (match) {
      cleanUrl = decodeURIComponent(match[1])
    }

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
    console.log(keywords)
    saveSearchToStorage(keywords)
  }
}



export async function fetchJobsUrlsAndSave(){
  const jobList = getJobListWithInfo()
  jobList.forEach(async ({jobId}) => {
    await fetchJobUrlAndSave(jobId)
  })

}