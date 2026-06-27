const { chromium } = require('@playwright/test');

(async () => {
  const url = process.argv[2];
  if (!url) {
    console.error('Error: Please provide a target URL.');
    process.exit(1);
  }

  let browser;
  try {
    // Launch headless Chromium
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to URL and wait for network idle
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Retrieve title
    const title = await page.title();

    // Extract interactive elements
    const elements = await page.evaluate(() => {
      // Helper to check if element is visible
      const isVisible = (el) => {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0;
      };

      // Query standard interactive elements
      const selector = 'input, button, select, textarea, a, [role="button"], [role="link"], [role="checkbox"], [role="radio"]';
      const items = Array.from(document.querySelectorAll(selector));

      return items
        .filter(isVisible)
        .map(el => {
          const attributes = {};
          if (el.id) attributes.id = el.id;
          if (el.name) attributes.name = el.name;
          if (el.type) attributes.type = el.type;
          if (el.placeholder) attributes.placeholder = el.placeholder;
          if (el.getAttribute('role')) attributes.role = el.getAttribute('role');
          if (el.getAttribute('aria-label')) attributes.ariaLabel = el.getAttribute('aria-label');
          
          // Capture first 3 classes to avoid long strings
          if (el.className && typeof el.className === 'string') {
            attributes.classes = el.className.split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
          }

          let text = '';
          if (el.tagName.toLowerCase() === 'input' && (el.type === 'button' || el.type === 'submit')) {
            text = el.value || '';
          } else {
            text = el.innerText || el.textContent || '';
          }
          text = text.trim().replace(/\s+/g, ' ').substring(0, 80);

          return {
            tag: el.tagName.toLowerCase(),
            text: text,
            attributes: attributes,
          };
        });
    });

    // Output JSON structure to stdout
    console.log(JSON.stringify({ title, url, elements }, null, 2));

  } catch (err) {
    console.error('Execution Error:', err.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
