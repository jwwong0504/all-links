import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export const expected = {'1 Science':10,'2 Science':15,'3 Science':4,'4 Physics':11,'4 Chemistry':4,'5 Physics':9,'5 Chemistry':3};
export function validate(records) {
  const errors = [], urls = new Set(), sites = new Set(), counts = {};
  if (records.length !== 56) errors.push(`Expected 56 simulations; found ${records.length}`);
  for (const s of records) {
    if (!s.title?.trim() || !s.siteName?.trim()) errors.push('Missing title or site name');
    if (!Number.isInteger(s.form) || s.form < 1 || s.form > 5) errors.push(`Invalid Form: ${s.title}`);
    if (!s.subject || !Object.hasOwn(expected,`${s.form} ${s.subject}`)) errors.push(`Invalid subject: ${s.title}`);
    if (!Number.isInteger(s.chapter) || s.chapter < 1 || !s.chapterTitle?.trim()) errors.push(`Missing chapter: ${s.title}`);
    if (typeof s.url !== 'string' || !/^https:\/\/[a-z0-9-]+\.netlify\.app\/$/.test(s.url)) errors.push(`Invalid URL: ${s.title}`);
    if (s.url !== `https://${s.siteName}.netlify.app/`) errors.push(`URL/site name mismatch: ${s.title}`);
    if (urls.has(s.url)) errors.push(`Duplicate URL: ${s.url}`);
    if (sites.has(s.siteName)) errors.push(`Duplicate site name: ${s.siteName}`);
    urls.add(s.url); sites.add(s.siteName);
    const key = `${s.form} ${s.subject}`; counts[key] = (counts[key] || 0) + 1;
  }
  for (const [key,count] of Object.entries(expected)) if (counts[key] !== count) errors.push(`Form ${key}: expected ${count}, found ${counts[key] || 0}`);
  return {errors,counts};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const records = JSON.parse(readFileSync(new URL('../src/data/simulations.json',import.meta.url)));
  const {errors,counts} = validate(records);
  for (const key of Object.keys(expected)) console.log(`Form ${key}: ${counts[key] || 0}`);
  console.log(`TOTAL: ${records.length}\nValidation: ${errors.length ? 'FAIL' : 'PASS'}`);
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
}
