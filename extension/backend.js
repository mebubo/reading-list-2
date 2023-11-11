export async function saveTab(tab) {
    console.log("Saving tab", tab)
    return await fetch("http://localhost:3000/api/saves", {
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
    const response = await fetch(`http://localhost:3000/api/saves?url=${encodeURIComponent(url)}`)
    console.log('response', response)
    const json = await response.json()
    console.log('json', json)
    return json.details.savesCount
}