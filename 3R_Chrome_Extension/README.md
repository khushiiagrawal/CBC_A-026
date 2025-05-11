# 3RVision Chrome Extension

3RVision is a Chrome extension that helps users find eco-friendly products on e-commerce websites. It automatically modifies search queries to include eco-friendly terms and filters results to show only sustainable products.


## Product Filtering Process

1. **Product Detection**:

   - Uses site-specific selectors to identify product containers
   - Supports multiple e-commerce site layouts
   - Handles dynamic content loading

2. **Content Analysis**:

   - Extracts product titles and descriptions
   - Checks for eco-friendly keywords
   - Analyzes product attributes and specifications

3. **Filtering Logic**:
   - Hides non-eco-friendly products
   - Shows only products matching eco-friendly criteria
   - Maintains product visibility when filter is disabled

## Dynamic Content Handling

- Uses MutationObserver to detect new products
- Automatically applies filtering to dynamically loaded content
- Handles infinite scroll implementations
- Updates filter when page content changes

## Usage Guide

1. **Installation**:

   - Download the extension files
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension directory <br/>
   ```
   # clone the repository 3RVision and while doing Load unpacked, select 3R_Chrome_Extension folder
   ```

2. **Basic Usage**:

   - Go to any supported e-commerce site
   - Search for a product (e.g., "water bottle")
   - Click the extension icon
   - Toggle the switch to ON
   - The extension will automatically modify your search and filter results

3. **Customizing Keywords**:
   - Click the extension icon
   - Modify the keywords in the text area
   - Click "Save Keywords" to apply changes
   - Click "Reset to Default" to restore original keywords

## Supported Websites

- Amazon 
- Flipkart
- Myntra



