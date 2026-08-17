const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runTests() {
  const prefix = process.argv[2] || `file://${process.cwd()}/`;

  let suites = process.argv.slice(3);
  if (suites.length === 0) {
    const modules = 'zepto ajax callbacks data deferred ajax_deferred detect touch event form fx selector stack'.split(/\s+/);
    suites = modules.map(name => `test/${name}.html`);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log(msg.text()));
  page.on('pageerror', err => console.log('ERROR: ' + err.message));

  let allPassed = true;

  for (const suite of suites) {
    let url = suite;
    if (!/:\/\//.test(url)) {
      url = prefix + url;
    }
    url += '?verbosity=WARN';

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Wait for results element to have 'finished' class
      await page.waitForFunction(
        () => {
          const res = document.getElementById('results');
          return res && /finished/.test(res.className);
        },
        { timeout: 30000 }
      );

      // Check if tests passed
      const passed = await page.evaluate(() => {
        const res = document.getElementById('results');
        const paths = location.pathname.split('/');
        console.log((paths[paths.length - 1] + " - ") + res.textContent);
        return /passed/.test(res.className);
      });

      if (!passed) {
        allPassed = false;
      }
    } catch (err) {
      console.log(`Failed to run tests for ${url}`);
      allPassed = false;
    }
  }

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
