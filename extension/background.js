import { saveTab, getSavesCount } from "./backend.js"
import { getCurrentTab } from "./tabs.js"

chrome.runtime.onInstalled.addListener(({reason}) => {
    console.log("onInstalled", reason)
})

async function updateBadge(tab) {
    const savesCount = await getSavesCount(tab.url)
    chrome.action.setBadgeText({
      text: `${savesCount}`,
      tabId: tab.id
    })
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log("onUpdated", tabId, changeInfo, tab)
    if (changeInfo.status === 'complete' && tab.active) {
      updateBadge(tab)
    }
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "save-current-tab") {
    const tab = await getCurrentTab()
    await saveTab(tab)
    await updateBadge(tab)
  }
})