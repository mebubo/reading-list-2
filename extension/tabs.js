export async function getCurrentTab() {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true})
    const tab = tabs[0]
    return tab
}
