import plant from '@phosphor-icons/core/assets/duotone/plant-duotone.svg?raw';
import microscope from '@phosphor-icons/core/assets/duotone/microscope-duotone.svg?raw';
import lightbulb from '@phosphor-icons/core/assets/duotone/lightbulb-duotone.svg?raw';
import magnet from '@phosphor-icons/core/assets/duotone/magnet-duotone.svg?raw';
import atom from '@phosphor-icons/core/assets/duotone/atom-duotone.svg?raw';
import flask from '@phosphor-icons/core/assets/duotone/flask-duotone.svg?raw';
import scales from '@phosphor-icons/core/assets/duotone/scales-duotone.svg?raw';
import battery_charging from '@phosphor-icons/core/assets/duotone/battery-charging-duotone.svg?raw';
import arrow_square_out from '@phosphor-icons/core/assets/duotone/arrow-square-out-duotone.svg?raw';
const formArtwork = [[], [plant,microscope], [lightbulb,magnet], [atom,flask], [scales,flask], [atom,battery_charging]];
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
export function SimulationCard(s) {
  return `<article class="simulation"><span class="badge">Form ${s.form} · ${escapeHtml(s.subject)}</span><h3>${escapeHtml(s.title)}</h3><a class="open" href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(s.title)} simulation in a new tab">Open Simulation <span class="external-icon" aria-hidden="true">${arrow_square_out}</span></a></article>`;
}
export function ChapterSection(items) {
  const first = items[0];
  return `<section class="chapter" id="chapter-${first.form}-${first.subject}-${first.chapter}"><div class="chapter-heading"><span class="chapter-number">${String(first.chapter).padStart(2,'0')}</span><div><p>Form ${first.form} · ${escapeHtml(first.subject)} · Chapter ${first.chapter}</p><h2>${escapeHtml(first.chapterTitle)}</h2></div><span class="chapter-count">${items.length} ${items.length === 1 ? 'simulation' : 'simulations'}</span></div><div class="simulation-grid">${items.map(SimulationCard).join('')}</div></section>`;
}
export function FormCard(form, items) {
  const subjects = [...new Set(items.map(s => s.subject))];
  return `<button class="form-card form-${form}" data-form="${form}"><span class="form-title">Form ${form}</span><span class="form-art" aria-hidden="true">${formArtwork[form].join('')}</span><span>${subjects.join(' & ')}</span><span class="form-count">${items.length} simulations</span><span class="subject-counts">${subjects.map(subject => `${subject}: ${items.filter(s => s.subject === subject).length}`).join(' · ')}</span></button>`;
}
