import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { checkA11y } from 'axe-playwright';

test.describe('Achieving WCAG Standard with Playwright Accessibility Tests', () => {
  test('Accessibility Scan', async ({ page }, testInfo) => {

    const PAGE_FOR_SCAN = 'https://atroverse.com';
    
    await page.goto(PAGE_FOR_SCAN);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Attach the accessibility scan results as a log for later analysis
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json',
    });

    // Perform detailed accessibility checks and generate a detailed report
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });

    // Assert that there are no accessibility violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});