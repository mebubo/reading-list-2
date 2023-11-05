async function saveTab(tab) {
    console.log("Saving tab", tab)
    return await fetch("http://localhost:3000/api/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: tab.title,
            url: tab.url,
            saveType: "manual"
        })
    });
}

export async function saveCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, async tabs => {
        const tab = tabs[0];
        await saveTab(tab);
    });
}
