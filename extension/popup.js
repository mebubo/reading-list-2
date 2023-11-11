document.getElementById('save-current-tab').addEventListener('click', async () => {
    await chrome.runtime.sendMessage({type: "save-current-tab"})
    window.close()
});