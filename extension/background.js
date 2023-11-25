import { saveTab, getSavesCount, saveHighlight, getHighlights } from "./backend.js"
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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "save-current-selection") {
    const tab = await getCurrentTab()
    const selection = await chrome.tabs.sendMessage(tab.id, {type: "get-current-selection"})
    console.log("selection", selection)
    saveHighlight(tab, selection)
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "get-page-highlights") {
    //get originator tab from sender
    const tab = sender.tab
    getHighlights(tab.url).then((highlights) => {
      console.log("highlights from the api ============= ", highlights)
      sendResponse(highlights)
    })
    return true
  }
})