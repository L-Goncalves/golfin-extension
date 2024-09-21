import { filterFeedPostsByKeywords, removeFeed } from "~contentScripts/feed"
import {
  fetchJobsUrlsAndSave,
  filterJobsByCompanyNames,
  filterJobsByDomains,
  saveJobSearch,
  showIcons
} from "~contentScripts/jobs"
import { autoConnect } from "~contentScripts/mynetwork"
import {
  getCompaniesBlacklisted,
  shouldAutoConnect,
  shouldDisplayIcons,
  shouldFilterByCompany,
  shouldFilterByDomain,
  shouldRemoveAllFeedPosts,
  shouldRemoveFeedPosts,
  shouldRun,
  shouldSaveJobSearch
} from "~contentScripts/storage"

export {}

async function handleFeed() {
  const shouldRemoveAllPosts = await shouldRemoveAllFeedPosts()
  const shouldRemoveByWords = await shouldRemoveFeedPosts()

  // is feed and Focus mode.
  if (shouldRemoveAllPosts) {
    removeFeed()
  }
  if (shouldRemoveByWords) {
    filterFeedPostsByKeywords()
  }
}

async function handleJobs() {
  // if blacklist companies
  const shouldFilterByCompanies = await shouldFilterByCompany()
  const shouldSaveSearches = await shouldSaveJobSearch()
  const shouldShowIcons = await shouldDisplayIcons()
  const shouldFilterDomains = await shouldFilterByDomain()
  if (shouldFilterByCompanies) {
    const list = await getCompaniesBlacklisted()
    filterJobsByCompanyNames(list)
  }

  if (shouldSaveSearches) {
    saveJobSearch()
  }

  // THIS ENSURES THAT API IS CALLED ONLY ONCE AND SAVED, IF SAVED IT WON'T CALL AGAIN (AVOID 429)
  if (shouldFilterDomains || shouldShowIcons) {
    fetchJobsUrlsAndSave()
  }

  if (shouldShowIcons) {
    showIcons()
  }

  if (shouldFilterDomains) {
    filterJobsByDomains()
  }
}

async function handleConnections() {
  const shouldConnect = await shouldAutoConnect()

  if (shouldConnect) {
    autoConnect()
  }
}

async function mainLoop() {
  const shouldExecute = await shouldRun()
  if (shouldExecute) {
    const url = document.URL

    if (url == "https://www.linkedin.com/feed/") {
      handleFeed()
    }
    if (url.includes("/jobs/collections") || url.includes("/jobs/search")) {
      handleJobs()
    }

    if (url.includes("/mynetwork/grow/")) {
      handleConnections()
    }
  }
}

setInterval(mainLoop, 2000)
