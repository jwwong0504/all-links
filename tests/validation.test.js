import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate} from '../scripts/validate.mjs';
const data = JSON.parse(readFileSync(new URL('../src/data/simulations.json',import.meta.url)));
test('complete source dataset passes',()=>assert.deepEqual(validate(data).errors,[]));
for (const [name,change] of Object.entries({count:d=>d.pop(),duplicateURL:d=>d[1].url=d[0].url,duplicateSite:d=>d[1].siteName=d[0].siteName,missingForm:d=>delete d[0].form,missingSubject:d=>delete d[0].subject,missingChapter:d=>delete d[0].chapter,missingChapterTitle:d=>delete d[0].chapterTitle,insecureURL:d=>d[0].url=d[0].url.replace('https','http'),wrongDomain:d=>d[0].url='https://example.com/',biologyForm4:d=>d.find(s=>s.form===4).subject='Biology',biologyForm5:d=>d.find(s=>s.form===5).subject='Biology',misclassification:d=>d[0].form=2})) {
  test(`rejects ${name}`,()=>{const copy=structuredClone(data);change(copy);assert.ok(validate(copy).errors.length>0);});
}
