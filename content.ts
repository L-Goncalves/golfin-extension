import { Storage } from "@plasmohq/storage"

import { filterFeedPostsByKeywords, removeFeed } from "~contentScripts/feed"
import { fetchJobsUrlsAndSave, filterJobsByCompanyNames, filterJobsByDomains, saveJobSearch, showIcons } from "~contentScripts/jobs"
import {
  getCompaniesBlacklisted,
  shouldDisplayIcons,
  shouldFilterByCompany,
  shouldFilterByDomain,
  shouldRemoveAllFeedPosts,
  shouldRemoveFeedPosts,
  shouldSaveJobSearch
} from "~contentScripts/storage"

export {}

const storage = new Storage()

console.log(
  "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
)

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
  const shouldSaveSearches = await shouldSaveJobSearch();
  const shouldShowIcons = await shouldDisplayIcons()
  const shouldFilterDomains = await shouldFilterByDomain()
  if (shouldFilterByCompanies) {
    const list = await getCompaniesBlacklisted()
    filterJobsByCompanyNames(list)
  }

  if(shouldSaveSearches){
    saveJobSearch()
  }

  // THIS ENSURES THAT API IS CALLED ONLY ONCE AND SAVED, IF SAVED IT WON'T CALL AGAIN (AVOID 429)
  if(shouldFilterDomains || shouldShowIcons){
    fetchJobsUrlsAndSave()
  }


  if(shouldShowIcons){
    showIcons()
  }

  if(shouldFilterDomains){
    filterJobsByDomains()
  }



}

async function handleConnections() {
  console.log("ready to accept new connections");
  const list = document.querySelector('.mn-invitation-list.artdeco-list');

  if (list) {
    const buttons = [...list.querySelectorAll('li button:not(.artdeco-button--muted)')];

    for (const btn of buttons) {
      (btn as HTMLButtonElement).click();
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay of 500ms between clicks
    }
  } else {
    console.log("No invitation list found.");
  }
}

function mainLoop() {
  const url = document.URL

  if (url == "https://www.linkedin.com/feed/") {
    handleFeed()
  }
  if (url.includes("/jobs/collections") || url.includes('/jobs/search')) {
    handleJobs()
  }

  if(url.includes("/mynetwork/grow/")){
    handleConnections()
  }
}

const intervalId = setInterval(mainLoop, 2000) 


const stopPolling = async () => {
  clearInterval(intervalId)
  console.log("Stopped polling for elements.")
}
