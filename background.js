function scrape() {
    browser.tabs.executeScript({
        file: "/content_scripts/scrape.js"
    });
}

browser.pageAction.onClicked.addListener(scrape);