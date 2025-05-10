// Set default values on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("3RVision Extension Installed ✅");

  chrome.storage.local.get(["enabled"], function (result) {
    if (result.enabled === undefined) {
      chrome.storage.local.set({ enabled: false });
    }
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Check if the URL is an e-commerce site
    const ecommercePatterns = [
      "amazon",
      "myntra",
      "jiomart",
      "flipkart",
      "ebay",
      "walmart",
      "etsy",
      "target",
      "shop",
      "store",
      "product",
    ];

    // Only send message to content script if likely an e-commerce site
    const isEcommerce = ecommercePatterns.some((pattern) =>
      tab.url.toLowerCase().includes(pattern)
    );

    if (isEcommerce) {
      chrome.storage.local.get(["enabled"], function (result) {
        const enabled = result.enabled !== undefined ? result.enabled : false;

        if (enabled) {
          // Give some time for the page to fully load
          setTimeout(() => {
            try {
              chrome.tabs
                .sendMessage(tabId, {
                  action: "toggleFilter",
                  enabled: enabled,
                })
                .catch((error) => {
                  console.log("Content script not ready yet:", error);
                });
            } catch (error) {
              console.log("Error sending message to tab:", error);
            }
          }, 1500);
        }
      });
    }
  }
});

// Listen for content script ready message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "contentScriptReady") {
    console.log("Content script ready in tab:", sender.tab.id);
    // Check if filtering should be enabled for this tab
    chrome.storage.local.get(["enabled"], function (result) {
      if (result.enabled) {
        try {
          chrome.tabs
            .sendMessage(sender.tab.id, {
              action: "toggleFilter",
              enabled: true,
            })
            .catch((error) => {
              console.log("Error sending initial filter message:", error);
            });
        } catch (error) {
          console.log("Error sending message to content script:", error);
        }
      }
    });
  }
});
