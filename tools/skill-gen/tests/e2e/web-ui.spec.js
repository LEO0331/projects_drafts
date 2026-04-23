const { test, expect } = require('@playwright/test');

test.describe('skill-gen web UI', () => {
  test('generates SKILL.md from pasted content', async ({ page }) => {
    await page.goto('/web/index.html');

    await page.getByLabel('Feature Name').fill('E2EFeature');
    await page.locator('#indexHtml').fill('<html><head><title>E2E Title</title></head><body><div id="app"></div></body></html>');
    await page.locator('#styleCss').fill('#app { color: red; }');
    await page.locator('#scriptJs').fill("document.getElementById('app').addEventListener('click', function () {});");
    await page.getByRole('button', { name: 'Generate SKILL.md' }).click();

    const output = page.locator('#output');
    await expect(output).toHaveValue(/# E2EFeature Skill/);
    await expect(output).toHaveValue(/## Feature Summary/);
    await expect(output).toHaveValue(/## Integration Steps/);
    await expect(page.locator('#statusText')).toContainText('Generated SKILL.md for E2EFeature.');
    await expect(page.getByRole('button', { name: 'Download' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Copy' })).toBeEnabled();
  });

  test('loads inputs via upload files', async ({ page }) => {
    await page.goto('/web/index.html');

    await page.locator('#fileInput').setInputFiles([
      {
        name: 'index.html',
        mimeType: 'text/html',
        buffer: Buffer.from('<html><head><title>Upload Sample</title></head><body><main id="root"></main></body></html>')
      },
      {
        name: 'style.css',
        mimeType: 'text/css',
        buffer: Buffer.from(':root { --c: #000; } #root { color: var(--c); }')
      },
      {
        name: 'script.js',
        mimeType: 'text/javascript',
        buffer: Buffer.from("document.getElementById('root').addEventListener('click', function () {});")
      }
    ]);

    await expect(page.locator('#statusText')).toContainText('Loaded 3/3 expected files from Upload files.');
    await expect(page.locator('#indexHtml')).toHaveValue(/Upload Sample/);
    await expect(page.locator('#styleCss')).toHaveValue(/--c/);
    await expect(page.locator('#scriptJs')).toHaveValue(/addEventListener/);
  });

  test('language switch works in both directions', async ({ page }) => {
    await page.goto('/web/index.html');

    await page.getByRole('button', { name: '繁中' }).click();
    await expect(page).toHaveURL(/index\.zh-TW\.html$/);
    await expect(page.getByRole('heading', { name: /把 3 個靜態檔案轉成可重用的 SKILL\.md/i })).toBeVisible();

    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page).toHaveURL(/index\.html$/);
    await expect(page.getByRole('heading', { name: /Turn 3 Static Files Into a Reusable/i })).toBeVisible();
  });

  test('help modal opens and closes', async ({ page }) => {
    await page.goto('/web/index.html');

    const modal = page.locator('#helpModal');
    await expect(modal).toHaveAttribute('hidden', '');

    await page.locator('#helpBtn').click();
    await expect(modal).not.toHaveAttribute('hidden', '');
    await expect(page.getByRole('heading', { name: 'How to Use' })).toBeVisible();

    await page.locator('#closeHelpBtn').click();
    await expect(modal).toHaveAttribute('hidden', '');
  });

  test('folder input label and hint are english on english page', async ({ page }) => {
    await page.goto('/web/index.html');

    await expect(page.locator('label:has(#folderInput)')).toContainText('Folder Input');
    await expect(page.locator('#folderInput')).toHaveAttribute('title', 'Folder input');
    await expect(page.locator('#folderInput')).toHaveAttribute('aria-label', 'Folder input');
  });

  test('output textarea has accessible label in both languages', async ({ page }) => {
    await page.goto('/web/index.html');
    await expect(page.locator('#outputHeading')).toHaveText('Generated Output');
    await expect(page.locator('#output')).toHaveAttribute('aria-labelledby', 'outputHeading');
    await expect(page.locator('#output')).toHaveAttribute('title', 'Generated output');

    await page.goto('/web/index.zh-TW.html');
    await expect(page.locator('#outputHeading')).toHaveText('產生結果');
    await expect(page.locator('#output')).toHaveAttribute('aria-labelledby', 'outputHeading');
    await expect(page.locator('#output')).toHaveAttribute('title', '產生結果');
  });
});
