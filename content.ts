
import type { PlasmoCSConfig } from "plasmo"
import { changeUIColor } from "~content-scripts/colors"
import { filterFeedPostsByKeywords, removeFeed } from "~content-scripts/feed"
import {
  // autoApply,
  fetchJobUrlsAndSave,
  filterJobsByCompanyNames,
  filterJobsByDomains,
  removeAppliedJobs,
  removePromotedJobs,
  saveJobSearch,
  showIcons
} from "~content-scripts/jobs"
import { autoConnect } from "~content-scripts/mynetwork"
import { listen } from "~content-scripts/setup-listeners"
import {
  deleteJobsNotSeenInTime,
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
  shouldSaveJobSearch,
  shouldAutoApply,
  getLastColor
} from "~content-scripts/storage"
import { migrateJobData } from "~content-scripts/storage-data/migrate-jobs"

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
  migrateJobData();
  deleteJobsNotSeenInTime(24);
  const shouldFilterByCompanies = await shouldFilterByCompany()
  const shouldSaveSearches = await shouldSaveJobSearch()
  const shouldShowIcons = await shouldDisplayIcons()
  const shouldFilterDomains = await shouldFilterByDomain()
  const removeApplied = await shouldRemoveAppliedJobs();
  const removePromoted = await shouldRemovePromotedJobs();
  const shouldAutoApplyJob = await shouldAutoApply();
  if (shouldFilterByCompanies) {
    const list = await getCompaniesBlacklisted()
    filterJobsByCompanyNames(list)
  }

  // if(shouldAutoApplyJob){
  //   // autoApply()
  // }

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




async function onLoad(){
  setInterval(mainLoop, 2000)
  listen();
  const lastColor = await getLastColor()
  
  if(lastColor){
    changeUIColor(lastColor)
  }

}

onLoad();