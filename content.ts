import type { PlasmoCSConfig } from "plasmo"
import { filterFeedPostsByKeywords, removeFeed } from "~contentScripts/feed"
import {
  fetchJobUrlsAndSave,
  filterJobsByCompanyNames,
  filterJobsByDomains,
  removeAppliedJobs,
  removePromotedJobs,
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
  shouldRemoveAppliedJobs,
  shouldRemoveFeedPosts,
  shouldRemovePromotedJobs,
  shouldRun,
  shouldSaveJobSearch
} from "~contentScripts/storage"
import { migrateJobData } from "~contentScripts/storage-data/migrate-jobs"

export {}
export const config: PlasmoCSConfig = {
  matches: [ "*://www.linkedin.com/*"],
  all_frames: true
}
// console.log("Hi!")

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
  migrateJobData()
  const shouldFilterByCompanies = await shouldFilterByCompany()
  const shouldSaveSearches = await shouldSaveJobSearch()
  const shouldShowIcons = await shouldDisplayIcons()
  const shouldFilterDomains = await shouldFilterByDomain()
  const removeApplied = await shouldRemoveAppliedJobs();
  const removePromoted = await shouldRemovePromotedJobs();
  if (shouldFilterByCompanies) {
    const list = await getCompaniesBlacklisted()
    filterJobsByCompanyNames(list)
  }

  if (shouldSaveSearches) {
    saveJobSearch()
  }

  // THIS ENSURES THAT API IS CALLED ONLY ONCE AND SAVED, IF SAVED IT WON'T CALL AGAIN (AVOID 429)
  if (shouldFilterDomains || shouldShowIcons) {
    fetchJobUrlsAndSave()
  }

  if (shouldShowIcons) {
    showIcons()
  }

  if (shouldFilterDomains) {
    filterJobsByDomains()
  }

  if(removeApplied){
    removeAppliedJobs()
  }

  if(removePromoted){
    removePromotedJobs();
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
