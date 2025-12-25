// Content script for page interactions
console.log("Clueso Clone extension loaded")

// Declare chrome variable
const chrome = window.chrome

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PAGE_INFO") {
    sendResponse({
      title: document.title,
      url: window.location.href,
    })
  }
})
