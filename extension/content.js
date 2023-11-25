const guest = new Guest(document.body)

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "get-current-selection") {
        const annotation = await guest.createAnnotation({highlight: true})
        console.log("selection", annotation)
        sendResponse(annotation);
    }
})

async function applyHighlights() {
    const highlights = await chrome.runtime.sendMessage({type: "get-page-highlights"})
    hls = (highlights ?? []).map(h => JSON.parse(h.highlight))
    console.log("Applying highlights:", hls)
    guest.loadAnnotations(hls)
}

applyHighlights().then(() => {
    console.log("Highlights applied")
})
