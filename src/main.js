import simulations from './data/simulations.json';
import { ChapterSection, FormCard, escapeHtml } from './components/cards.js';
import './styles/main.css';

const app = document.querySelector('#app');
app.innerHTML = `<a class="skip-link" href="#main">Skip to simulations</a><main id="main" tabindex="-1"><section class="intro"><h1><span>Dr. CS Wong</span><strong>Science Simulations</strong></h1><p class="author-tag">#Dr. CS Wong</p><p>Interactive Science, Physics and Chemistry Learning</p><div class="intro-meta"><span>56 interactive simulations</span><span>5 Forms</span></div></section><section id="forms" class="forms" aria-label="Choose your Form">${[1,2,3,4,5].map(f => FormCard(f, simulations.filter(s => s.form === f))).join('')}</section><section class="library"><div class="library-heading"><div><h2 id="view-title">Explore the library</h2></div><button id="home" class="secondary" hidden>Back to Home</button></div><div class="controls"><label class="search">Search simulations<input id="search" name="search" autocomplete="off" type="search" placeholder="Try circuits, pressure or waves…"></label><label>Form<select id="form" name="form"><option value="">All Forms</option>${[1,2,3,4,5].map(f=>`<option value="${f}">Form ${f}</option>`).join('')}</select></label><label>Subject<select id="subject" name="subject"><option value="">All subjects</option><option>Science</option><option>Physics</option><option>Chemistry</option></select></label></div><div id="subject-tabs" class="subject-tabs" aria-label="Choose subject"></div><div class="results-bar"><p id="result-count" role="status" aria-live="polite"></p><button id="reset" class="text-button">Clear filters</button></div><div class="library-layout"><aside><label for="chapter-nav">Jump to chapter</label><select id="chapter-nav" name="chapter"><option value="">Choose a chapter</option></select><nav id="chapter-links" aria-label="Chapter navigation"></nav></aside><div id="results"></div></div></section></main><footer><strong>Dr CS Wong Science Simulations</strong><span>KSSM Science · Physics · Chemistry</span><small>Simulations open in a new tab.</small></footer>`;
const search = document.querySelector('#search');
const form = document.querySelector('#form');
const subject = document.querySelector('#subject');
function render({historyMode = 'replace'} = {}) {
  const selectedForm = Number(form.value);
  const allowed = selectedForm ? (selectedForm <= 3 ? ['Science'] : ['Physics','Chemistry']) : ['Science','Physics','Chemistry'];
  for (const option of subject.options) option.disabled = option.value && !allowed.includes(option.value);
  if (!allowed.includes(subject.value)) subject.value = '';
  const query = search.value.trim().toLowerCase();
  const items = simulations.filter(s => (!selectedForm || s.form === selectedForm) && (!subject.value || s.subject === subject.value) && (!query || [s.title,s.siteName,s.chapterTitle,s.subject,`Form ${s.form}`,`Chapter ${s.chapter}`].join(' ').toLowerCase().includes(query)));
  const groups = new Map();
  for (const item of items) {
    const key = `${item.form}-${item.subject}-${item.chapter}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  document.querySelector('#view-title').textContent = selectedForm ? `Form ${selectedForm} ${subject.value || (selectedForm <= 3 ? 'Science' : 'simulations')}` : 'Explore the library';
  document.querySelector('#home').hidden = !selectedForm;
  document.querySelector('#result-count').textContent = `${items.length} ${items.length === 1 ? 'simulation' : 'simulations'} · ${groups.size} ${groups.size === 1 ? 'chapter' : 'chapters'}`;
  document.querySelector('#results').innerHTML = items.length ? [...groups.values()].map(ChapterSection).join('') : '<div class="empty"><h2>No simulations found</h2><p>Try another search or clear the filters.</p></div>';
  const entries = [...groups.entries()];
  document.querySelector('#chapter-nav').innerHTML = '<option value="">Choose a chapter</option>' + entries.map(([key,g]) => `<option value="chapter-${key}">F${g[0].form} ${escapeHtml(g[0].subject)} · Ch ${g[0].chapter}: ${escapeHtml(g[0].chapterTitle)}</option>`).join('');
  document.querySelector('#chapter-links').innerHTML = entries.map(([key,g]) => `<a href="#chapter-${key}"><small>Form ${g[0].form} · ${escapeHtml(g[0].subject)} · ${g[0].chapter}</small>${escapeHtml(g[0].chapterTitle)}</a>`).join('');
  document.querySelector('#subject-tabs').innerHTML = selectedForm >= 4 ? ['',...allowed].map(value => `<button class="secondary ${subject.value === value ? 'active' : ''}" aria-pressed="${subject.value === value}" data-subject="${value}">${value || 'All subjects'} <span>${simulations.filter(s => s.form === selectedForm && (!value || s.subject === value)).length}</span></button>`).join('') : '';
  const url = new URL(window.location.href);
  for (const [key, value] of [['form',form.value],['subject',subject.value],['q',search.value.trim()]]) { if(value) url.searchParams.set(key,value); else url.searchParams.delete(key); }
  if(historyMode !== 'none') window.history[historyMode === 'push' ? 'pushState' : 'replaceState']({},'',url);
  for (const card of document.querySelectorAll('.form-card')) { const selected = Number(card.dataset.form) === selectedForm; card.classList.toggle('selected', selected); card.setAttribute('aria-pressed', String(selected)); }
}
function reset() { form.value = ''; subject.value = ''; search.value = ''; render(); }
search.addEventListener('input', render);
form.addEventListener('change', () => render({historyMode:'push'}));
subject.addEventListener('change', () => render({historyMode:'push'}));
app.addEventListener('click', event => {
  const card = event.target.closest('[data-form]');
  if (card) { form.value = card.dataset.form; subject.value = ''; search.value = ''; render({historyMode:'push'}); document.querySelector('.library').scrollIntoView({behavior:'smooth'}); }
  const tab = event.target.closest('[data-subject]');
  if (tab) { subject.value = tab.dataset.subject; render({historyMode:'push'}); }
});
document.querySelector('#reset').addEventListener('click', reset);
document.querySelector('#home').addEventListener('click', () => { reset(); window.scrollTo({top:0,behavior:'smooth'}); });
document.querySelector('#chapter-nav').addEventListener('change', event => { if (event.target.value) document.getElementById(event.target.value)?.scrollIntoView({behavior:'smooth'}); });
function restoreUrl() {
  const params = new URL(window.location.href).searchParams;
  form.value = ['1','2','3','4','5'].includes(params.get('form')) ? params.get('form') : '';
  subject.value = ['Science','Physics','Chemistry'].includes(params.get('subject')) ? params.get('subject') : '';
  search.value = params.get('q') || '';
  render({historyMode:'none'});
}
window.addEventListener('popstate',restoreUrl);
restoreUrl();
