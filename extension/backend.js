const saves = "http://localhost:3000/api/saves"
const highlights = "http://localhost:3000/api/highlights"

export async function saveTab(tab) {
    console.log("Saving tab", tab)
    return await fetch(saves, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: tab.title,
            url: tab.url,
            saveType: "manual"
        })
    })
}

export async function getSavesCount(url) {
    console.log('fetching saves count for', url)
    const response = await fetch(`${saves}?url=${encodeURIComponent(url)}`)
    console.log('response', response)
    const json = await response.json()
    console.log('json', json)
    return json.details.savesCount
}

export async function saveHighlight(tab, highlight) {
    console.log("Saving highlight", tab, highlight)
    return await fetch(highlights, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: tab.title,
            url: tab.url,
            highlight
        })
    })
}

export async function getHighlights(url) {
    console.log('getting highlights for', url)
    const response = await fetch(`${highlights}?url=${encodeURIComponent(url)}`)
    console.log('response', response)
    const json = await response.json()
    console.log('json', json)
    return json.details.highlights
}
