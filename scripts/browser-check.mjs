import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
const errors = [];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.PORTAL_URL || 'http://127.0.0.1:5173/');
await page.locator('.simulation').first().waitFor();
assert.equal(await page.locator('.simulation').count(),56);
assert.equal(await page.locator('.form-card').count(),5);
const links = await page.locator('.open').evaluateAll(nodes=>nodes.map(n=>({href:n.href,target:n.target,rel:n.rel})));
assert.equal(new Set(links.map(l=>l.href)).size,56);
assert.ok(links.every(l=>l.target==='_blank' && l.rel.includes('noopener') && l.rel.includes('noreferrer')));
for (const [form,count] of [[1,10],[2,15],[3,4],[4,15],[5,12]]) {
  await page.locator(`[data-form="${form}"]`).click();
  assert.equal(await page.locator('.simulation').count(),count);
  if(form>=4) {
    await page.locator('[data-subject="Chemistry"]').click();
    assert.equal(await page.locator('.simulation').count(),form===4?4:3);
    await page.locator('[data-subject="Physics"]').click();
    assert.equal(await page.locator('.simulation').count(),form===4?11:9);
  }
  await page.locator('#home').click();
  assert.equal(await page.locator('.simulation').count(),56);
}
await page.locator('#search').fill('water displacement');
assert.equal(await page.locator('.simulation').count(),1);
await page.locator('#search').fill('zzzz-no-result');
assert.equal(await page.locator('.simulation').count(),0);
assert.ok(await page.locator('.empty').isVisible());
await page.locator('#reset').click();
await page.locator('#form').selectOption('5');
await page.locator('#subject').selectOption('Chemistry');
assert.equal(await page.locator('.simulation').count(),3);
await page.locator('#form').selectOption('1');
assert.equal(await page.locator('.simulation').count(),10);
await page.locator('#reset').click();
for (const [width,height] of [[1440,900],[1024,768],[820,1180],[768,1024],[390,844],[320,640]]) {
  await page.setViewportSize({width,height});
  await page.locator('#reset').click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`Overflow at ${width}`);
  await page.locator('[data-form="4"]').click();
  await page.locator('[data-subject="Chemistry"]').click();
  assert.equal(await page.locator('.simulation').count(),4);
  const id = await page.locator('#chapter-nav option').nth(1).getAttribute('value');
  if(width<=800) {
    await page.locator('#chapter-nav').selectOption(id);
    await page.waitForTimeout(400);
    assert.ok(await page.locator(`#${id}`).isVisible());
  }
  console.log(`Viewport ${width}×${height}: PASS`);
}
await page.setViewportSize({width:1440,height:1000});
await page.locator('#reset').click();
await page.evaluate(()=>window.scrollTo(0,0));
await page.screenshot({path:'../portal-desktop.png',fullPage:false});
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'../portal-mobile.png',fullPage:false});
assert.deepEqual(errors,[]);
await browser.close();
console.log('Browser interactions, unique external links, responsive layouts, and runtime errors: PASS');
