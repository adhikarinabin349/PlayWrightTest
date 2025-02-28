import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { checkA11y } from 'axe-playwright';

test('Accessibility Scan for WCAG compliance', async ({ page }, testInfo) => {
  const PAGE_FOR_SCAN = 'https://atroverse.com';
  
  await page.goto(PAGE_FOR_SCAN);

  // Run the accessibility scan using AxeBuilder
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  // Attach scan results for later inspection
  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: 'application/json',
  });

  // Run additional accessibility checks using axe-playwright
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });

  // Assert no accessibility violations
  expect(accessibilityScanResults.violations).toEqual([]);
});