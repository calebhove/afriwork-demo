'use strict';
const cfg=window.AFRIWORK_CONFIG||{}, connected=!!(cfg.url&&cfg.key);
const icons={home:'M3 10l9-7 9 7v11h-6v-7H9v7H3z',jobs:'M8 6V3h8v3M3 7h18v14H3z M3 12h18 M10 11v3h4v-3',hire:'M4 21v-7h16v7 M8 10a4 4 0 1 0 8 0a4 4 0 1 0-8 0',bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5z M10 21h4',plus:'M12 4v16 M4 12h16',chat:'M21 11a9 9 0 0 1-9 9H3v-9a9 9 0 1 1 18 0 M7 10h10 M7 14h6',user:'M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8 M4 22v-3a8 6 0 0 1 16 0v3',search:'M21 21l-6-6 M17 10a7 7 0 1 1-14 0a7 7 0 0 1 14 0',filter:'M3 5h18 M6 12h12 M9 19h6',settings:'M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',arrow:'M5 12h14 M13 6l6 6-6 6',shield:'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M8 12l3 3 5-6',save:'M6 3h12v18l-6-4-6 4z',heart:'M20 5c-4-4-8 1-8 1s-4-5-8-1c-4 4 1 9 8 15 7-6 12-11 8-15',check:'M5 12l4 4L19 6',out:'M14 3H4v18h10 M10 12h11 M17 8l4 4-4 4'};
Object.assign(icons, {
  settings: 'M9.5 2h5l.6 2.6 1.8 1 2.6-.8 2.5 4.4-2 1.8v2l2 1.8-2.5 4.4-2.6-.8-1.8 1-.6 2.6h-5l-.6-2.6-1.8-1-2.6.8L2 14.8 4 13v-2L2 9.2l2.5-4.4 2.6.8 1.8-1L9.5 2z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  share: 'M22 2 9 15 M22 2l-7 20-4-9-9-4 20-7z',
  edit: 'M4 20l4-1 12-12-3-3L5 16l-1 4z M15 6l3 3',
  camera: 'M3 7h4l2-3h6l2 3h4v14H3z M16 13a4 4 0 1 1-8 0a4 4 0 0 1 8 0',
  chart: 'M4 20h16 M7 16v-5 M12 16V5 M17 16V8',
});
const icon=n=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[n]||icons.jobs}"/></svg>`;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brand = () => '<div class="brand"><img src="logo.png" alt="Afriwork" width="2048" height="375"></div>';
const categories=['Technology','Design & creative','Finance & business','Retail & sales','Hospitality & food','Construction & trades','Transport & logistics','Agriculture','Education','Domestic & household','Childcare & nanny','Healthcare & caregiving','Other'];
const sensitive=['Domestic & household','Childcare & nanny','Healthcare & caregiving'];
let state={screen:'welcome',demo:false,user:null,profile:null,route:'feed',feedTab:'For You',onboard:0,draft:{role:'Find Work',hirer_type:'individual',category:categories[0]},posts:[],jobs:[],applications:[],messages:[],conversations:[],saved:[],liked:[],query:'',filter:{},busy:false};
let token=null,toastTimer;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',3800)}
function errorMessage(e){return e.message||'Something went wrong. Please try again.'}
function id(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function initials(n){return (n||'You').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
function act(action, label, className = '', value = '') {
  const accessibleNames = { savejob: 'Save job', filters: 'Filter jobs', close: 'Close' };
  const accessibleName = accessibleNames[action];
  return `<button class="${className}" data-action="${action}" data-value="${esc(value)}"${accessibleName ? ` aria-label="${accessibleName}"` : ''}>${label}</button>`;
}
const regionNames = new Intl.DisplayNames(['en'], {type:'region'});
const countries = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW'.split(' ').map(code => ({
  name: regionNames.of(code),
  flag: String.fromCodePoint(...[...code].map(letter => 127397 + letter.charCodeAt(0))),
})).sort((a,b) => a.name.localeCompare(b.name));
function countryField(value, required) {
  return `<label for="country">Country</label><div class="country-field">
    <input id="country" name="country" value="${esc(value)}" placeholder="Type your country" ${required?'required':''}>
    <button type="button" class="country-arrow" data-action="countries" aria-label="Choose a country"><svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>
  </div>`;
}
const isCompany = profile => profile.role === 'Hire Talent' && profile.hirer_type === 'company';
const profileName = profile => (isCompany(profile) && profile.company?.trim()) || profile.full_name;
const skillGroups = {
  'Home & care': ['House cleaning', 'Nannying', 'Caregiving', 'Gardening', 'Laundry', 'Security'],
  'Trades & repair': ['Plumbing', 'Electrical work', 'Carpentry', 'Tiling', 'Welding', 'Painting', 'Solar installation', 'Motor mechanics', 'AC repair', 'Phone repair'],
  'Food & hospitality': ['Cooking', 'Baking', 'Catering', 'Waiting tables', 'Housekeeping', 'Front desk'],
  'Transport & logistics': ['Driving', 'Delivery', 'Stock control', 'Forklift operation'],
  'Farming': ['Crop farming', 'Poultry keeping', 'Livestock care', 'Irrigation'],
  'Sales & office': ['Retail sales', 'Customer service', 'Cash handling', 'Bookkeeping', 'Data entry', 'Office administration'],
  'Technology & creative': ['Graphic design', 'Photography', 'Video editing', 'Digital marketing', 'Web development', 'IT support'],
  'Health & education': ['Nursing', 'First aid', 'Teaching', 'Tutoring'],
  'Beauty & clothing': ['Hairdressing', 'Braiding', 'Barbering', 'Makeup', 'Tailoring'],
};
const skillLimit = 5;
const skillKey = text => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
function skillMatches(skill, query) {
  const label = skillKey(skill);
  if (label.includes(query)) return true;
  if (query.length < 4) return false;
  // Match a single omitted, extra, substituted, or swapped letter.
  for (let i = 0; i < query.length; i++) {
    const before = query.slice(0, i), after = query.slice(i + 1);
    if (label.includes(before + after)) return true;
    if (i + 1 < query.length && label.includes(before + query[i + 1] + query[i] + query.slice(i + 2))) return true;
    for (const word of label.split(' ')) {
      if (word.length < query.length) continue;
      if (word.startsWith(before) &&
          (word.slice(i + 1).startsWith(after) || word.slice(i + 1).startsWith(query.slice(i)))) return true;
    }
  }
  return false;
}
function skillPicker(skills = []) {
  return `<fieldset class="skill-picker" data-group="">
    <legend>Skills <span>(optional)</span></legend>
    <p class="skill-help">Choose up to ${skillLimit} skills. Browse by category or search for the work you do.</p>
    <div class="skill-search">${icon('search')}<input id="skills" type="search" aria-label="Search skills" placeholder="Try driving, plumbing or design" maxlength="60" autocomplete="off"></div>
    <div class="skill-groups" role="group" aria-label="Skill categories">
      ${['', ...Object.keys(skillGroups)].map(group => `<button type="button" data-skill-group="${esc(group)}" aria-pressed="${!group}">${esc(group || 'All')}</button>`).join('')}
    </div>
    <input type="hidden" name="skills" value="${esc(JSON.stringify(skills))}">
    <div class="skill-selections" data-skill-selections role="group" aria-label="Selected skills"></div>
    <p class="skill-status" role="status"></p>
    <div class="skill-results" data-skill-results role="group" aria-label="Suggested skills"></div>
  </fieldset>`;
}
function updateSkills(picker) {
  const selected = JSON.parse(picker.querySelector('[name=skills]').value);
  const query = skillKey(picker.querySelector('#skills').value);
  const group = picker.dataset.group;
  const pool = group ? skillGroups[group] : Object.values(skillGroups).flat();
  const suggestions = pool.filter(skill => skillMatches(skill, query));
  const options = query || group ? suggestions : [
    ...Object.values(skillGroups).map(skills => skills[0]), 'Nannying', 'Electrical work', 'Graphic design',
  ];
  picker.querySelector('.skill-status').textContent = selected.length > skillLimit
    ? `${selected.length} saved skills. Remove skills to add new ones.`
    : `${selected.length} of ${skillLimit} selected`;
  picker.querySelector('[data-skill-selections]').innerHTML = selected.map(skill =>
    `<button type="button" data-skill="${esc(skill)}" aria-label="Remove ${esc(skill)}">${esc(skill)} <span aria-hidden="true">×</span></button>`
  ).join('');
  const custom = picker.querySelector('#skills').value.trim();
  const exact = Object.values(skillGroups).flat().some(skill => skillKey(skill) === query);
  const customOption = query && !exact && !options.length && !selected.some(skill => skillKey(skill) === query)
    ? `<button type="button" data-skill="${esc(custom)}" ${selected.length >= skillLimit ? 'disabled' : ''}>Add “${esc(custom)}”</button>` : '';
  picker.querySelector('[data-skill-results]').innerHTML = options.map(skill => {
    const active = selected.some(saved => skillKey(saved) === skillKey(skill));
    return `<button type="button" data-skill="${esc(skill)}" aria-pressed="${active}" ${!active && selected.length >= skillLimit ? 'disabled' : ''}>${esc(skill)}${active ? icon('check') : ''}</button>`;
  }).join('') || (query ? `<p>No matching suggestions in this view.</p>${customOption}` : '');
}
function toggleSkill(picker, button) {
  const value = button.dataset.skill;
  const input = picker.querySelector('[name=skills]');
  const selected = JSON.parse(input.value);
  const index = selected.findIndex(skill => skillKey(skill) === skillKey(value));
  if (index >= 0) selected.splice(index, 1);
  else if (selected.length < skillLimit) selected.push(value);
  input.value = JSON.stringify(selected);
  const container = button.parentElement;
  updateSkills(picker);
  const replacement = [...container.querySelectorAll('[data-skill]')].find(option => option.dataset.skill === value);
  (replacement || picker.querySelector('#skills')).focus();
}
function onboardingSteps() {
  return isCompany(state.draft) ? ['role', 'category', 'details', 'verification', 'review']
    : ['role', 'category', 'details', 'skills', 'verification', 'review'];
}
function field(name,label,value='',type='text',required=false){if(name==='country')return countryField(value,required);return `<label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''} ${type==='password'?'minlength="10" autocomplete="new-password"':''}>`}
function select(name,label,items,value){return `<label for="${name}">${label}</label><select id="${name}" name="${name}">${items.map(i=>`<option ${i===value?'selected':''}>${esc(i)}</option>`).join('')}</select>`}
function empty(kind,title,text,button=''){return `<div class="card empty"><div class="bubble">${icon(kind)}</div><h3>${title}</h3><p>${text}</p>${button}</div>`}
function title(h,p){return `<div class="pagetitle"><h2>${h}</h2><p>${p}</p></div>`}
async function request(path,options={}){const res=await fetch(cfg.url.replace(/\/$/,'')+path,{...options,headers:{apikey:cfg.key,Authorization:'Bearer '+(token||cfg.key),'Content-Type':'application/json',...options.headers}});let data;try{data=await res.json()}catch{data=null}if(!res.ok)throw new Error(data?.msg||data?.message||data?.error_description||'Request failed ('+res.status+').');return data}
const db=(table,query='',method='GET',body)=>request('/rest/v1/'+table+query,{method,...(body!==undefined?{body:JSON.stringify(body)}:{}),headers:{Prefer:'return=representation'}});
async function load(){if(state.demo)return;const uid=state.user.id;const [posts,jobs,apps,saves,likes,conv]=await Promise.all([db('posts','?select=*&order=created_at.desc&limit=50'),db('jobs','?select=*&order=created_at.desc&limit=100'),db('applications','?select=*&order=created_at.desc'),db('saved_jobs','?select=job_id'),db('post_likes','?user_id=eq.'+uid+'&select=post_id'),db('conversations','?select=*&order=created_at.desc')]);Object.assign(state,{posts:posts||[],jobs:jobs||[],applications:apps||[],saved:(saves||[]).map(s=>s.job_id),liked:(likes||[]).map(s=>s.post_id),conversations:conv||[]});if(state.posts.length){const rows=await db('rpc/post_engagement','','POST',{post_ids:state.posts.map(post=>post.id)});for(const row of rows||[]){const post=state.posts.find(item=>item.id===row.post_id);if(post)post.engagement=row;}}}
let pointerMotion = false;
let modalAnimation = null;
let modalVersion = 0;
let modalScrollPosition;

function lockModalScroll() {
  const body = document.body;
  if (!body || modalScrollPosition !== undefined) return;
  modalScrollPosition = window.scrollY || 0;
  body.style.setProperty('--modal-scroll-top', `-${modalScrollPosition}px`);
  body.classList.add('modal-open');
}

function unlockModalScroll() {
  if ($('#modal').open || modalScrollPosition === undefined) return;
  const top = modalScrollPosition;
  modalScrollPosition = undefined;
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('--modal-scroll-top');
  window.scrollTo(0, top);
}

function canAnimate() {
  return pointerMotion && typeof matchMedia === 'function' &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function animateEntrance(element, distance = 6, duration = 200) {
  if (!canAnimate() || !element?.animate) return;
  return element.animate([
    { opacity: 0, transform: `translateY(${distance}px)`, filter: 'blur(2px)' },
    { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
  ], { duration, easing: 'cubic-bezier(.22,1,.36,1)' });
}

let postPhotoPreviewUrls = [];

function clearPostPhotoPreview() {
  for (const url of postPhotoPreviewUrls) URL.revokeObjectURL(url);
  postPhotoPreviewUrls = [];
}

function postPhotoFiles(input) {
  const files = Array.from(input?.files || []);
  if (files.length > 10 || files.some(file => !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024)) {
    throw new Error('Choose up to 10 images, each under 10 MB.');
  }
  return files;
}

function previewPostPhotos(input) {
  clearPostPhotoPreview();
  const form = input.form;
  const preview = form.querySelector('.post-photo-preview');
  const error = form.querySelector('.error');
  preview.hidden = true;
  preview.querySelector('.post-photos').replaceChildren();
  error.textContent = '';
  try {
    const files = postPhotoFiles(input);
    postPhotoPreviewUrls = files.map(file => URL.createObjectURL(file));
    for (const [index, url] of postPhotoPreviewUrls.entries()) {
      const image = document.createElement('img');
      image.src = url;
      image.alt = 'Photo ' + (index + 1) + ' preview';
      preview.querySelector('.post-photos').append(image);
    }
    preview.hidden = !files.length;
  } catch (failure) {
    error.textContent = errorMessage(failure);
  }
}

function modal(heading, body, variant = '') {
  clearPostPhotoPreview();
  const dialog = $('#modal');
  modalVersion++;
  dialog.className = variant;
  modalAnimation?.cancel();
  dialog.innerHTML = `<div class="modalhead"><h2 id="modal-title">${heading}</h2>${act('close','×','iconbtn')}</div><div class="modalbody">${body}</div>`;
  dialog.setAttribute('aria-labelledby', 'modal-title');
  if (!dialog.open) {
    lockModalScroll();
    dialog.showModal();
  }
  dialog.scrollTop = 0;
  modalAnimation = animateEntrance(dialog, 10, 220) || null;
}

async function closeModal() {
  const dialog = $('#modal');
  const version = ++modalVersion;
  modalAnimation?.cancel();
  if (!dialog.open) return;
  if (canAnimate() && dialog.animate) {
    modalAnimation = dialog.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(4px)' },
    ], { duration: 110, easing: 'cubic-bezier(.4,0,1,1)' });
    try { await modalAnimation.finished; } catch { return; }
  }
  if (version === modalVersion) {
    dialog.close();
    clearPostPhotoPreview();
    unlockModalScroll();
  }
}

function authShell(content) {
  return `<div class="auth"><section class="auth-art">
    ${brand()}<div class="auth-story"><span class="eyebrow">A continent of possibility</span>
    <h1>Your talent.<br>Your people.<br><em>Your next move.</em></h1>
    <p>Find meaningful work, build your network and make things happen. Together.</p>
    <div class="art-tags"><span>Jobs</span><span>Freelance</span><span>Local opportunities</span></div></div>
    <div class="auth-orbit" aria-hidden="true"><span>afriwork</span></div>
    <div class="note">Made for Africa. Built around you.</div>
  </section><section class="auth-form"><div>${brand()}${content}</div></section></div>`;
}
function socialSignIn() {
  return `<div class="social-signin" role="group" aria-label="Social sign-in" aria-describedby="social-status">
    <button type="button" class="social-button social-google" disabled>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.24 5.48-4.76 7.18l7.73 6C44.42 38.04 46.98 31.9 46.98 24.55Z"/>
        <path fill="#FBBC05" d="M10.53 28.59C10.05 27.14 9.77 25.6 9.77 24s.28-3.14.76-4.59l-7.98-6.19a24.05 24.05 0 0 0 0 21.56l7.98-6.19Z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6C30.03 37.65 27.25 38.5 24 38.5c-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/>
      </svg>
      <span>Continue with Google</span>
    </button>
    <button type="button" class="social-button social-apple" disabled>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.51-3.74 4.25z"/>
      </svg>
      <span>Continue with Apple</span>
    </button>
    <small id="social-status">Google and Apple sign-in are currently unavailable.</small>
  </div>`;
}
function authView(){if(state.screen==='welcome')return authShell(`<span class="eyebrow">Welcome to Afriwork</span><h2 style="margin-top:17px">Your next chapter<br>starts here.</h2><p class="muted">Find work. Hire talent. Build your professional name.</p><div class="stack" style="margin-top:35px">${act('screen','Create an account '+icon('arrow'),'btn wide','signup')}${act('screen','I already have an account','btn outline wide','login')}${act('demo','Explore the browser preview','link')}</div><p class="muted" style="font-size:11px;margin-top:30px">${connected?'Secure sign-in powered by Supabase.':'Preview available now. Real sign-in becomes available when your Supabase project is connected.'}</p><div class="row">${act('policy','Terms','link','Terms')}${act('policy','Privacy','link','Privacy')}</div>`);
if(state.screen==='onboarding')return onboarding();
const signup=state.screen==='signup',reset=state.screen==='reset',recover=state.screen==='recover';
return authShell(`${act('screen','← Back','link','welcome')}<h2 style="margin-top:25px">${signup?'Make your next move.':reset?'Reset your password.':recover?'Choose a new password.':'Good to see you.'}</h2><p class="muted">${signup?'Create your Afriwork account.':reset?'We’ll send a recovery link to your email.':recover?'Use a strong, unique password.':'Log in to pick up where you left off.'}</p>${!connected?'<div class="notice">Real accounts are not connected in this preview. Use “Explore the browser preview” to try the app without sharing your password.</div>':''}<form id="authform" data-kind="${signup?'signup':reset?'reset':recover?'recover':'login'}">${!recover?field('email','Email address','','email',true):''}${!reset?field('password','Password'+(signup?' · at least 10 characters':''),'','password',true):''}${signup?`${field('age','Age (years)','','number',true)}<small>Afriwork currently accepts adults aged 18+. Your age stays private.</small><label class="check"><input name="terms" type="checkbox" required><span>I agree to the ${act('policy','Terms of Service','link','Terms')}.</span></label><label class="check"><input name="privacy" type="checkbox" required><span>I acknowledge the ${act('policy','Privacy Policy','link','Privacy')}.</span></label>`:''}<p class="error" role="alert" id="formerror"></p><button class="btn wide" ${!connected?'disabled':''}>${signup?'Create account':reset?'Send recovery email':recover?'Save new password':'Log in'}</button></form>${!signup&&!reset&&!recover?act('screen','Forgot your password?','link','reset'):''}<p style="font-size:13px;margin-top:22px">${signup?'Already have an account?':'New to Afriwork?'} ${act('screen',signup?'Log in':'Create an account','link',signup?'login':'signup')}</p>${!reset&&!recover?socialSignIn():''}`)}
function onboarding(){const d=state.draft,n=state.onboard,steps=onboardingSteps(),step=steps[n];let body='';
if(step==='role')body=`<h2>What brings you here?</h2><p class="muted">Choose where you’d like to start.</p>${['Find Work','Hire Talent'].map((r,i)=>act('role',`<span class="symbol">${icon(i?'hire':'jobs')}</span><span><strong>${r}</strong><small>${i?'Find the right people for your business or task.':'Discover jobs, freelance projects and local gigs.'}</small></span>`, 'choice '+(d.role===r?'active':''),r)).join('')}`;
if(step==='category')body=`<h2>Your work. Your world.</h2><p class="muted">Pick your main professional field or hiring industry.</p>${select('category','Work category',categories,d.category)}${d.role==='Hire Talent'?select('hirer_type','I am hiring as',['individual','company'],d.hirer_type):''}<p class="notice" style="margin-top:20px">Household, childcare and caregiving work needs identity review before participation. That review is not operational yet.</p>`;
if(step==='details')body=`<h2>${isCompany(d)?'Introduce your company.':'A little about you.'}</h2><p class="muted">Start with the essentials. You can edit your profile later.</p>${field('full_name','Your full name',d.full_name||'','text',true)}${d.role==='Hire Talent'&&d.hirer_type==='company'?field('company','Company name',d.company||'','text',true):''}<div class="grid2"><div>${field('country','Country',d.country||'Zimbabwe','text',true)}</div><div>${field('city','City / region',d.city||'','text',true)}</div></div>${field('headline',isCompany(d)?'Company tagline (optional)':'Professional headline (optional)',d.headline||'')}`;
if(step==='skills')body=`<h2>Your skills</h2><p class="muted">What kind of work can you do?</p>${skillPicker(d.skills)}`;
if(step==='verification')body=`<div class="bubble" style="color:var(--orange);margin-bottom:25px">${icon('shield')}</div><h2>Trust starts with clarity.</h2><p class="muted">Identity verification helps describe checks completed. It never guarantees someone’s skills, honesty or safety.</p><div class="notice">Document collection isn’t available yet. Please don’t send your ID through posts or messages. You can return to Verification in Settings later.</div><button class="btn outline wide" disabled style="margin-top:20px">Verification not available yet</button>`;
if(step==='review')body=`<h2>You’re ready to begin.</h2><p class="muted">Take a quick look before you step inside.</p><div class="card"><h3>${esc(profileName(d))}</h3><p>${esc(d.headline||d.category)}</p><p class="muted">${esc(d.city)}, ${esc(d.country)}</p><span class="pill orange">${esc(d.role)}</span> <span class="pill">${esc(d.category)}</span><p style="font-size:12px;margin:16px 0 0">Identity: not confirmed</p></div>`;
return authShell(`<span class="eyebrow">${state.demo?'Browser preview · ':''}Step ${n+1} of ${steps.length}</span><div class="steps">${steps.map((_,i)=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div><form id="onboardform">${body}<p class="error" role="alert" id="formerror"></p><div class="footer-actions">${n?act('obback','Back','btn outline'):''}<button class="btn" style="flex:1">${step==='review'?'Enter Afriwork':step==='verification'?'Skip for now':'Continue '+icon('arrow')}</button></div></form>`)}
function nav(route, label, glyph) {
  const selected = state.route === route;
  const button = act('nav', icon(glyph) + label, 'navitem ' + (selected ? 'active' : ''), route);
  return selected ? button.replace('<button ', '<button aria-current="page" ') : button;
}
function dashboardRoute() {
  return state.profile?.role === 'Hire Talent' ? 'hire' : 'applications';
}

function render() {
  if (state.screen !== 'app') {
    $('#app').innerHTML = authView();
    const picker = state.screen === 'onboarding' && onboardingSteps()[state.onboard] === 'skills' && $('.skill-picker');
    if (picker) updateSkills(picker);
    return;
  }
  const profile = state.profile;
  const name = profileName(profile);
  const company = isCompany(profile);
  const dashboard = dashboardRoute();
  const checklist = company
    ? [['Company essentials', true], ['Company overview', !!profile.bio], ['Website', !!profile.website]]
    : [['Profile essentials', true], ['Skills', !!profile.skills?.length], ['Introduction', !!profile.bio]];
  $('#app').innerHTML = `
    ${state.demo ? `<div class="previewbar">Browser preview · This session only ${act('exitdemo','Exit preview')}</div>` : ''}
    <header class="header">
      <button type="button" class="brand brand-home" data-action="home" aria-label="Afriwork home"><img src="logo.png" alt="" width="2048" height="375"></button>
      <form id="searchform" class="global-search">${icon('search')}<input name="query" aria-label="Search jobs" placeholder="Find your next opportunity" value="${esc(state.query)}"></form>
      <div class="right row">
        ${act('nav',icon('bell')+'<span class="sr">Activity</span>','iconbtn','activity')}
        ${act('nav',icon('settings')+'<span class="sr">Settings</span>','iconbtn','settings')}
        <button class="avatar" data-action="nav" data-value="profile" aria-label="Your profile">${esc(initials(name))}</button>
      </div>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <section class="identity-card card">
          <div class="identity-cover"></div>
          <div class="avatar ${company ? 'company-avatar' : ''}">${esc(initials(name))}</div>
          <strong>${esc(name)}</strong><p>${esc(profile.headline || profile.category)}</p>
          <small>${esc(profile.city)}, ${esc(profile.country)}</small>
          ${act('nav','View profile '+icon('arrow'),'identity-link','profile')}
        </section>
        <nav class="side-nav" aria-label="Workspace">
          ${nav(dashboard, 'Dashboard', 'chart')}
          ${nav('messages', 'Messages', 'chat')}
          ${nav('activity', 'Activity', 'bell')}
          ${nav('settings', 'Settings', 'settings')}
        </nav>
        ${act('create',icon('plus')+' Create something','btn wide sidebar-create')}
        <footer>${act('policy','Terms','','Terms')}${act('policy','Privacy','','Privacy')}<br>${act('policy','Safety','','Safety')}${act('policy','Job rules','','Job rules')}<br>© ${new Date().getFullYear()} Afriwork</footer>
      </aside>
      <main class="content">
        ${!['profile','messages'].includes(state.route)?`<nav class="primary-tabs" aria-label="Explore Afriwork">
          ${[['feed','Feed','home'],['jobs','Jobs','jobs'],['hire','Hire','hire']].map(([route,label,glyph]) => nav(route,label,glyph)).join('')}
        </nav>`:''}
        ${mainView()}
      </main>
      <aside class="rail">
        <section class="card checklist-card"><span class="eyebrow">A good place to start</span>
          <h3>${company ? 'Tell your company’s story.' : 'Let your profile do the talking.'}</h3>
          ${checklist.map(([label,done]) => `<div class="checklist"><span class="circle ${done?'done':''}">${done?'✓':'·'}</span>${label}</div>`).join('')}
          ${act('nav',company?'Edit company profile '+icon('arrow'):'Build your profile '+icon('arrow'),'link','profile')}
        </section>
        <section class="card welcome"><span class="eyebrow">Room for ambition</span><h3>Your next chapter<br>is yours to create.</h3>
          <p>Every skill has a place. Discover where yours can take you.</p>
          ${act('nav','Explore jobs '+icon('arrow'),'btn outline small','jobs')}
        </section>
        <section class="safety-note"><div class="row">${icon('shield')}<strong>Opportunity, with care.</strong></div><p>Never pay to secure a job. Report suspicious requests and keep your documents private.</p>${act('policy','Safety guidelines ↗','link','Safety')}</section>
      </aside>
    </div>
    <nav class="dock" aria-label="Main navigation">
      ${[['feed','home','Home'],[dashboard,'chart','Dashboard'],['create','plus','Create'],['messages','chat','Messages'],['profile','user','Profile']].map(([route,glyph,label]) => act(route==='create'?'create':'nav',icon(glyph)+`<span class="${route==='create'?'sr':''}">${label}</span>`,route==='create'?'create':state.route===route?'active':'',route)).join('')}
    </nav>`;
  if (!state.demo && state.route === 'profile') loadProfileImages();
}

function feedWelcome() {
  const company = isCompany(state.profile);
  return `<section class="feed-welcome"><div><span class="eyebrow">${company?'Good people. Great possibilities.':'Your next chapter starts here'}</span>
    <h2>${company?'A world of talent.<br><em>Within your reach.</em>':'Big ambitions.<br><em>Meet your next move.</em>'}</h2>
    <p>${company?'Find the people who will help your business grow.':'Find work, share your journey and build your professional world.'}</p>
    ${act('nav',(company?'Find your next hire':'Explore opportunities')+' '+icon('arrow'),'btn',company?'hire':'jobs')}</div>
    <div class="opportunity-orbit" aria-hidden="true"><i></i><i></i><i></i><span>${icon('arrow')}</span></div>
  </section>`;
}
function mainView(){const r=state.route;if(r==='feed')return feedWelcome()+`<div class="card composer"><div class="avatar">${esc(initials(profileName(state.profile)))}</div>${act('post','Share an update or an opportunity…')}<div class="composer-shortcuts">${act('post',icon('camera')+'<span>Photo</span>','btn outline small','photos')}</div></div><div class="top-tabs">${['For You','Following','Companies'].map(v=>act('feedtab',v,state.feedTab===v?'active':'',v)).join('')}</div>`+(feedPosts().length?feedPosts().map(postCard).join('<div style="height:15px"></div>'):empty('chat',state.feedTab==='Following'?'Your network starts here.':'Be part of the first conversation.',state.feedTab==='Following'?'Posts from people you follow will appear here.':'Share what you’re working on, an achievement or a professional idea.',act('post','Write your first post','btn')));
if(r==='jobs')return title('Good work starts here.','Full-time, freelance or your next local project.')+`<form id="jobsearch" class="filterbar"><input aria-label="Search jobs" name="query" placeholder="Job title, skill or company" value="${esc(state.query)}"><button class="btn small">${icon('search')}<span class="sr">Search</span></button>${act('filters',icon('filter'),'btn outline small')}</form><div class="row between" style="margin-bottom:18px"><small>${filteredJobs().length} opportunities</small>${act('saved',state.onlySaved?'Show all jobs':'Saved jobs','link')}</div>`+(filteredJobs().length?filteredJobs().map(jobCard).join('<div style="height:15px"></div>'):empty('jobs','Your next opportunity is on its way.',state.query||state.onlySaved?'No matching jobs. Try another search or remove your filters.':'There are no open listings yet. Real opportunities will appear here when hirers post them.',act('nav','Go to Hire Talent','btn outline','hire')));
if(r==='hire'){const mine=state.jobs.filter(j=>j.owner_id===state.user.id);return title('Build your next great team.','Your opportunities and applications, in one place.')+`<div class="row between" style="margin-bottom:22px"><span class="pill">${mine.length} listings</span>${act('newjob','+ Post an opportunity','btn small')}</div>`+(mine.length?mine.map(j=>jobCard(j,true)).join('<div style="height:15px"></div>'):empty('hire','Great teams start with one person.','Post a job, a freelance project or a local gig to find your next collaborator.',act('newjob','Post your first opportunity','btn')))}
if(r==='applications')return title('Your applications.','Follow your next chapter, one step at a time.')+(state.applications.filter(a=>a.applicant_id===state.user.id).length?state.applications.filter(a=>a.applicant_id===state.user.id).map(a=>`<div class="card"><h3>${esc(state.jobs.find(j=>j.id===a.job_id)?.title||'Opportunity')}</h3><span class="pill orange">${esc(a.status)}</span><p class="muted" style="font-size:12px;margin-top:12px">Submitted ${new Date(a.created_at).toLocaleDateString()}</p>${a.status==='Pending'?act('withdraw','Withdraw application','link',a.id):''}</div>`).join(''):empty('save','A fresh start.','Applications you submit will appear here. You’ll be able to check their progress.',act('nav','Explore jobs','btn','jobs')));
if(r==='activity')return title('Activity.','The updates that matter to your work.')+empty('bell','You’re all caught up.','There are no new notifications. Check Applications for your current application status.');
if(r==='messages')return title('Your conversations.','Keep work moving, together.')+(state.conversations.length?state.conversations.map(c=>`<div class="card"><h3>${esc(state.jobs.find(j=>j.id===c.job_id)?.title||'Hiring conversation')}</h3>${act('thread','Open conversation →','link',c.id)}</div>`).join(''):empty('chat','Your conversations start here.','Messages become available between applicants and the hirer of an opportunity. No conversations yet.'));
if(r==='profile')return profileView();if(r==='settings')return settingsView();return ''}
function feedPosts(){return state.posts.filter(p=>state.feedTab==='Companies'?p.is_company:state.feedTab==='Following'?false:true)}
function postCounts(post) {
  if (!state.demo) return post.engagement || {};
  return {
    likes: Number(state.liked.includes(post.id)),
    comments: (state.comments || []).filter(comment => comment.post_id === post.id).length,
    shares: Number((state.sharedPosts || []).includes(post.id)),
  };
}

function postActions(post) {
  const counts = postCounts(post);
  const liked = state.liked.includes(post.id);
  return `<div class="actions" data-post-engagement="${esc(post.id)}">
    <button type="button" data-action="like" data-value="${esc(post.id)}" aria-pressed="${liked}" class="${liked?'post-liked':''}">${icon('heart')} Like <span>${counts.likes || 0}</span></button>
    ${act('comments', icon('chat') + ' Comment <span>' + (counts.comments || 0) + '</span>', '', post.id)}
    ${act('share', icon('share') + ' Share <span>' + (counts.shares || 0) + '</span>', '', post.id)}
  </div>`;
}

function updatePostCount(postId, key, delta) {
  const post = state.posts.find(item => item.id === postId);
  if (!post) return;
  if (!state.demo) {
    const counts = post.engagement ||= {};
    counts[key] = Math.max(0, Number(counts[key] || 0) + delta);
  }
  const action = {likes:'like', comments:'comments', shares:'share'}[key];
  const actions = $$('[data-post-engagement]').find(row => row.dataset.postEngagement === postId);
  const count = actions?.querySelector(`[data-action="${action}"] span`);
  if (count) count.textContent = postCounts(post)[key] || 0;
}

async function recordPostShare(postId) {
  if (state.demo) {
    const shares = state.sharedPosts ||= [];
    if (!shares.includes(postId)) shares.push(postId);
    updatePostCount(postId, 'shares', 0);
    return;
  }
  const rows = await request('/rest/v1/post_shares?on_conflict=user_id,post_id', {
    method:'POST', headers:{Prefer:'resolution=ignore-duplicates,return=representation'},
    body:JSON.stringify({user_id:state.user.id, post_id:postId}),
  });
  updatePostCount(postId, 'shares', rows?.length || 0);
}

function postCard(p){return `<article class="card post"><header><div class="avatar">${esc(initials(p.author_name))}</div><div><strong>${esc(p.author_name)}</strong><small>${new Date(p.created_at).toLocaleDateString()} · Professional update</small></div>${p.author_id===state.user.id?act('delpost','Delete','link',p.id):act('report','Report','link','post:'+p.id)}</header><p>${esc(p.body)}</p>${state.demo&&p.photos?.length?`<div class="post-photos">${p.photos.map((url,index)=>`<img src="${esc(url)}" alt="Post photo ${index+1}">`).join('')}</div>`:''}${postActions(p)}</article>`}
function filteredJobs(){return state.jobs.filter(j=>j.status==='Open'&&(!state.onlySaved||state.saved.includes(j.id))&&(!state.query||[j.title,j.company_name,j.category,j.description,j.city].join(' ').toLowerCase().includes(state.query.toLowerCase()))&&(!state.filter.category||j.category===state.filter.category)&&(!state.filter.arrangement||j.arrangement===state.filter.arrangement)&&(!state.filter.type||j.type===state.filter.type))}
const jobCurrencies = {
  USD: 'US$', ZAR: 'R', NGN: '₦', ZWG: 'ZiG', BWP: 'P', ZMW: 'ZK',
  KES: 'KSh', UGX: 'USh', TZS: 'TSh', GHS: 'GH₵', RWF: 'FRw',
  MZN: 'MT', NAD: 'N$', MWK: 'MK', AOA: 'Kz', ETB: 'Br',
  XOF: 'CFA', XAF: 'FCFA', EGP: 'E£', MAD: 'DH', EUR: '€', GBP: '£',
};

function jobPayParts(salary = '') {
  const match = /^([A-Z]{3})\s+(.+)$/.exec(salary);
  return match && Object.hasOwn(jobCurrencies, match[1])
    ? {currency:match[1], amount:match[2]}
    : {currency:'', amount:salary};
}

function jobPayLabel(salary) {
  const {currency, amount} = jobPayParts(salary || '');
  if (!amount) return 'Compensation negotiable';
  return currency ? `${jobCurrencies[currency]}${amount} · ${currency}` : amount;
}

function jobPayFields(salary) {
  const {currency, amount} = jobPayParts(salary || '');
  return `<div class="grid2 job-pay-fields">
    <div><label for="currency">Currency</label><select id="currency" name="currency">
      <option value="">Select currency</option>
      ${Object.entries(jobCurrencies).map(([code, symbol]) => `<option value="${code}" ${currency === code ? 'selected' : ''}>${code} · ${esc(symbol)}</option>`).join('')}
    </select></div>
    <div>${field('salary','Pay amount or range (optional)',amount)}</div>
  </div>`;
}

function jobSaveButton(jobId) {
  const saved = state.saved.includes(jobId);
  return `<button type="button" class="iconbtn job-save ${saved ? 'is-saved' : ''}" data-action="savejob" data-value="${esc(jobId)}" aria-label="Save job" aria-pressed="${saved}">${icon('save')}</button>`;
}

function jobCard(j,mine=false){return `<article class="card job"><div class="row between"><div class="row"><div class="avatar">${esc(initials(j.company_name))}</div><div><strong style="font-size:13px">${esc(j.company_name)}</strong><small style="display:block">${esc(j.city)} · ${esc(j.country)}</small></div></div>${mine?`<span class="pill orange">${esc(j.status)}</span>`:jobSaveButton(j.id)}</div><h3>${esc(j.title)}</h3><div class="tags"><span class="pill">${esc(j.type)}</span><span class="pill">${esc(j.arrangement)}</span><span class="pill">${esc(j.category)}</span></div><div class="foot"><small>${esc(jobPayLabel(j.salary))}</small>${mine?act('manage','Manage listing →','btn outline small',j.id):act('jobdetail','See opportunity →','btn outline small',j.id)}</div></article>`}
const profileMediaBucket = 'profile-media';
const profileMediaTypes = {'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp'};

function profileMediaLabel(kind, profile) {
  return kind === 'banner' ? 'Banner' : isCompany(profile) ? 'Company logo' : 'Profile photo';
}

function profileImage(profile, kind) {
  const path = profile[kind + '_path'];
  const label = profileMediaLabel(kind, profile);
  const image = path ? `<img class="profile-media-image" alt="" ${state.demo ? `src="${esc(path)}"` : `data-profile-media="${esc(path)}" hidden`}>` : '';
  const edit = `<button type="button" class="profile-media-edit" data-action="editmedia" data-value="${kind}" aria-label="Edit ${label.toLowerCase()}">${icon('edit')}</button>`;
  return kind === 'banner'
    ? `<div class="cover">${image}${edit}</div>`
    : `<div class="avatar profile-avatar ${isCompany(profile) ? 'company-avatar' : ''}">${esc(initials(profileName(profile)))}${image}${edit}</div>`;
}

function storageMediaPath(path) {
  return `${profileMediaBucket}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

async function loadProfileImages() {
  for (const image of $$('[data-profile-media]')) {
    void request('/storage/v1/object/sign/' + storageMediaPath(image.dataset.profileMedia), {
      method: 'POST', body: JSON.stringify({expiresIn: 300})
    }).then(({signedURL}) => {
      if (image.isConnected && signedURL?.startsWith('/object/sign/')) {
        image.onload = () => { image.hidden = false; };
        image.src = cfg.url.replace(/\/$/, '') + '/storage/v1' + signedURL;
      }
    }).catch(() => { /* Keep the profile fallback if a photo is unavailable. */ });
  }
}

function editProfileImage(kind) {
  const label = profileMediaLabel(kind, state.profile);
  modal('Edit ' + label.toLowerCase(), `<form id="profilemediaform" data-kind="${kind}">
    <label for="profile-image-file">Choose a ${label.toLowerCase()}</label>
    <input id="profile-image-file" name="image" type="file" accept="image/jpeg,image/png,image/webp" required>
    <small>JPG, PNG or WebP · Up to 5 MB</small>
    ${state.demo ? '<small class="profile-media-preview">Preview photos last for this browser session.</small>' : ''}
    <fieldset class="photo-crop" hidden>
      <legend>Crop photo</legend>
      <small>Drag the photo to reposition it, or use the sliders.</small>
      <canvas aria-label="Photo crop preview" width="${kind === 'banner' ? 1200 : 640}" height="${kind === 'banner' ? 400 : 640}"></canvas>
      <label>Zoom<input type="range" data-crop="zoom" min="1" max="3" step=".01" value="1"></label>
      <div class="grid2">
        <label>Horizontal position<input type="range" data-crop="x" min="0" max="1" step=".01" value=".5"></label>
        <label>Vertical position<input type="range" data-crop="y" min="0" max="1" step=".01" value=".5"></label>
      </div>
    </fieldset>
    <p class="error" role="alert"></p>
    <button class="btn wide" disabled>Save photo</button>
  </form>`);
}

function photoCropBounds(imageWidth, imageHeight, canvasWidth, canvasHeight, zoom) {
  const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight) * zoom;
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {width, height, maxX:Math.max(0, width - canvasWidth), maxY:Math.max(0, height - canvasHeight)};
}

async function preparePhotoCrop(input) {
  const form = input.form;
  const file = input.files[0];
  const controls = form.querySelector('.photo-crop');
  const save = form.querySelector('button[type="submit"], .btn');
  const error = form.querySelector('.error');
  controls.hidden = true;
  save.disabled = true;
  error.textContent = '';
  if (!file) return;
  if (!Object.hasOwn(profileMediaTypes, file.type) || !file.size || file.size > 5242880) {
    error.textContent = 'Choose a JPG, PNG or WebP image up to 5 MB.';
    return;
  }
  const image = new Image();
  const url = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
  } catch {
    if (form.isConnected && input.files[0] === file) error.textContent = 'This photo could not be opened.';
    return;
  } finally {
    URL.revokeObjectURL(url);
  }
  if (!form.isConnected || input.files[0] !== file) return;
  const canvas = controls.querySelector('canvas');
  const context = canvas.getContext('2d');
  const zoom = controls.querySelector('[data-crop="zoom"]');
  const x = controls.querySelector('[data-crop="x"]');
  const y = controls.querySelector('[data-crop="y"]');
  zoom.value = 1;
  x.value = y.value = .5;
  const bounds = () => photoCropBounds(image.naturalWidth, image.naturalHeight, canvas.width, canvas.height, Number(zoom.value));
  const draw = () => {
    const {width, height, maxX, maxY} = bounds();
    x.disabled = maxX < 1;
    y.disabled = maxY < 1;
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, -maxX * Number(x.value), -maxY * Number(y.value), width, height);
  };
  controls.oninput = draw;
  let drag;
  canvas.onpointerdown = event => {
    if (!event.isPrimary || event.button !== 0) return;
    canvas.setPointerCapture(event.pointerId);
    drag = {id:event.pointerId, left:event.clientX, top:event.clientY, x:Number(x.value), y:Number(y.value)};
  };
  canvas.onpointermove = event => {
    if (drag?.id !== event.pointerId) return;
    const {maxX, maxY} = bounds();
    const clamp = value => Math.min(1, Math.max(0, value));
    if (!x.disabled) x.value = clamp(drag.x - (event.clientX - drag.left) * canvas.width / canvas.clientWidth / maxX);
    if (!y.disabled) y.value = clamp(drag.y - (event.clientY - drag.top) * canvas.height / canvas.clientHeight / maxY);
    draw();
  };
  canvas.onlostpointercapture = () => { drag = null; };
  controls.hidden = false;
  draw();
  save.disabled = false;
}

async function saveCroppedProfileImage(form) {
  const controls = form.querySelector('.photo-crop');
  if (controls.hidden) throw new Error('Choose a photo first.');
  const canvas = controls.querySelector('canvas');
  const file = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .9));
  if (!file) throw new Error('Could not crop this photo. Try a different image.');
  return saveProfileImage(form.dataset.kind, file);
}

async function saveProfileImage(kind, file) {
  if (kind !== 'avatar' && kind !== 'banner') throw new Error('Choose a profile photo or banner.');
  const extension = file && Object.hasOwn(profileMediaTypes, file.type) && profileMediaTypes[file.type];
  if (!extension || !file.size || file.size > 5242880) {
    throw new Error('Choose a JPG, PNG or WebP image up to 5 MB.');
  }
  const key = kind + '_path';
  const previous = state.profile[key];
  if (state.demo) {
    state.profile[key] = URL.createObjectURL(file);
    if (previous) URL.revokeObjectURL(previous);
  } else {
    const path = `${state.user.id}/${kind}/${id()}.${extension}`;
    await request('/storage/v1/object/' + storageMediaPath(path), {
      method: 'POST', headers: {'Content-Type': file.type}, body: file
    });
    const rows = await db('profiles', '?id=eq.' + state.user.id, 'PATCH', {[key]:path});
    if (rows?.[0]?.[key] !== path) throw new Error('The profile photo could not be saved. Try again.');
    state.profile[key] = path;
    if (previous) {
      void request('/storage/v1/object/' + storageMediaPath(previous), {method:'DELETE'}).catch(() => {});
    }
  }
  closeModal();
  render();
  toast('Photo saved.');
}

function companyProfileView(profile) {
  const name = profileName(profile);
  const openings = state.jobs.filter(job => job.owner_id === profile.id && job.status === 'Open');
  return title('Company profile', 'Show candidates who you are and what you do.') +
    `<section class="card profile-card">${profileImage(profile,'banner')}<div class="profile-body">
      ${profileImage(profile,'avatar')}
      <div class="row between"><h2>${esc(name)}</h2>${act('editprofile','Edit company','btn outline small')}</div>
      <p>${esc(profile.headline || profile.category)}</p>
      <div class="row company-meta"><span class="pill">${esc(profile.category)}</span>
        <span class="muted">${esc([profile.city, profile.country].filter(Boolean).join(', '))}</span></div>
      <h3>About the company</h3>
      <p class="muted company-about">${esc(profile.bio || 'Add an overview of your company and the work you do.')}</p>
      ${profile.website && safeURL(profile.website)!=='#' ? `<a class="link" href="${esc(safeURL(profile.website))}" target="_blank" rel="noopener noreferrer">Company website ↗</a>` : ''}
    </div></section><section class="company-openings"><div class="row between">
      <h3>Open roles</h3>${act('nav','Manage jobs','btn outline small','hire')}</div>
      ${openings.length ? openings.map(job => jobCard(job, true)).join('') : '<p class="muted">No open roles yet.</p>'}
    </section>`;
}
function profileView(){const p=state.profile;if(isCompany(p))return companyProfileView(p);return title('Your profile','Your work. Your experience. Your story.')+`<div class="card profile-card">${profileImage(p,'banner')}<div class="profile-body">${profileImage(p,'avatar')}<div class="row between"><h2>${esc(profileName(p))}</h2>${act('editprofile','Edit profile','btn outline small')}</div>${p.headline?`<p>${esc(p.headline)}</p>`:''}<p class="muted" style="font-size:13px">${esc(p.city)}, ${esc(p.country)} · ${esc(p.role)}</p><span class="pill">Identity not confirmed</span><h3 style="margin-top:25px">About</h3><span class="pill">${esc(p.category)}</span><p class="muted" style="font-size:13px;white-space:pre-wrap">${esc(p.bio||'Add a short introduction to tell people about your work.')}</p><h3>Skills</h3><div class="row" style="flex-wrap:wrap">${(p.skills||[]).map(s=>`<span class="pill">${esc(s)}</span>`).join('')||'<small>No skills added yet.</small>'}</div><h3 style="margin-top:25px">Featured link</h3>${p.website?`<a href="${esc(safeURL(p.website))}" target="_blank" rel="noopener noreferrer">${esc(p.website)}</a>`:'<small>Add a portfolio or professional link when you edit your profile.</small>'}</div></div>`}
function safeURL(u){try{const v=new URL(u);return ['https:','http:'].includes(v.protocol)?v.href:'#'}catch{return '#'}}
const verificationStatuses = {
  pending: 'Pending review', approved: 'Test approved',
  changes_requested: 'Changes requested', rejected: 'Test rejected',
};
const verificationKind = kind => kind === 'business' ? 'Business confirmation' : 'Identity confirmation';
const verificationSample = 'Afriwork verification pilot\nSample document for workflow testing. Contains no identity or business information.';
const verificationPath = (userId, requestId) => `verification-pilot/${userId}/${requestId}.txt`;

async function verificationView() {
  const [rows, roles] = state.demo
    ? [state.verificationRequests || [], [true]]
    : await Promise.all([
      db('verification_requests', '?user_id=eq.' + state.user.id + '&order=created_at.desc'),
      db('verification_reviewers', '?user_id=eq.' + state.user.id),
    ]);
  const kinds = isCompany(state.profile) ? ['identity', 'business'] : ['identity'];
  modal('Verification', `<p class="notice">Verification pilot. Submit a generated sample to try the review flow. Keep real identity and business documents private.</p>
    <div class="stack verification-list">${kinds.map(kind => {
      const current = rows.find(row => row.kind === kind);
      const blocked = ['pending', 'approved'].includes(current?.status);
      return `<section class="card">
        <h3>${verificationKind(kind)}</h3>
        <p class="muted">${verificationStatuses[current?.status] || 'No request yet'}</p>
        ${current?.reason ? `<p class="verification-note">${esc(current.reason)}</p>` : ''}
        ${blocked ? '' : act('submitverification', current ? 'Submit a new sample' : 'Submit a test sample', 'btn outline', kind)}
      </section>`;
    }).join('')}</div>
    ${roles.length ? act('verificationqueue', state.demo ? 'Try the reviewer queue' : 'Open reviewer queue', 'btn verification-queue-link') : ''}`);
}

async function submitVerification(kind) {
  if (kind !== 'identity' && (kind !== 'business' || !isCompany(state.profile))) throw new Error('This verification type is unavailable.');
  const row = {id:id(), user_id:state.user.id, kind};
  if (state.demo) {
    const rows = state.verificationRequests ||= [];
    if (rows.some(item => item.kind === kind && ['pending', 'approved'].includes(item.status))) return verificationView();
    rows.unshift({...row, status:'pending', created_at:new Date().toISOString()});
  } else {
    const path = '/storage/v1/object/' + verificationPath(row.user_id, row.id);
    await request(path, {method:'POST', headers:{'Content-Type':'text/plain'}, body:verificationSample});
    try {
      await db('verification_requests', '', 'POST', row);
    } catch (failure) {
      // The storage policy preserves the sample if the request was committed.
      void request(path, {method:'DELETE'}).catch(() => {});
      throw failure;
    }
  }
  await verificationView();
  toast('Test request submitted.');
}

async function verificationQueue() {
  const rows = state.demo
    ? (state.verificationRequests || []).filter(row => row.status === 'pending')
    : await db('verification_requests', '?status=eq.pending&user_id=neq.' + state.user.id + '&order=created_at.asc&limit=50');
  modal('Verification review queue', `<p class="notice">Pilot decisions apply to test requests only.</p>
    <div class="stack verification-list">${rows.map(row => `<section class="card">
      <h3>${verificationKind(row.kind)}</h3>
      <p class="muted">Submitted ${esc(new Date(row.created_at).toLocaleString())}</p>
      ${act('reviewverification', 'Review sample', 'btn outline', row.id)}
    </section>`).join('') || '<p>No pending requests.</p>'}</div>
    ${act('setting', 'Back to verification', 'link verification-queue-link', 'Verification')}`);
}

async function reviewVerification(requestId) {
  const row = state.demo
    ? state.verificationRequests?.find(item => item.id === requestId)
    : (await db('verification_requests', '?id=eq.' + encodeURIComponent(requestId) + '&status=eq.pending&user_id=neq.' + state.user.id))[0];
  if (!row || row.status !== 'pending') throw new Error('This request is no longer available for review.');
  let sample = verificationSample;
  if (!state.demo) {
    const response = await fetch(cfg.url.replace(/\/$/, '') + '/storage/v1/object/authenticated/' + verificationPath(row.user_id, row.id), {
      headers:{apikey:cfg.key, Authorization:'Bearer ' + token},
    });
    if (!response.ok) throw new Error('The test document could not be opened.');
    sample = await response.text();
  }
  modal('Review ' + verificationKind(row.kind).toLowerCase(), `<form id="verificationreviewform" data-id="${esc(row.id)}">
    <pre class="verification-sample">${esc(sample)}</pre>
    <label for="verification-decision">Decision</label>
    <select id="verification-decision" name="status" required>
      <option value="">Choose a decision</option>
      <option value="approved">Approve test request</option>
      <option value="changes_requested">Request changes</option>
      <option value="rejected">Reject test request</option>
    </select>
    <label for="verification-reason">Reason (required for changes or rejection)</label>
    <textarea id="verification-reason" name="reason" maxlength="500"></textarea>
    <p class="error" role="alert"></p>
    <button class="btn wide">Save decision</button>
  </form>`);
}

async function saveVerificationDecision(requestId, status, reason) {
  if (!['approved', 'changes_requested', 'rejected'].includes(status)) throw new Error('Choose a review decision.');
  const note = reason?.trim() || null;
  if (status !== 'approved' && !note) throw new Error('Enter a reason for this decision.');
  const decision = {status, reason:note};
  if (state.demo) {
    const row = state.verificationRequests?.find(item => item.id === requestId && item.status === 'pending');
    if (!row) throw new Error('This request has already been reviewed.');
    Object.assign(row, decision);
  } else {
    const rows = await db('verification_requests', '?id=eq.' + encodeURIComponent(requestId) + '&status=eq.pending', 'PATCH', decision);
    if (!rows?.length) throw new Error('This request has already been reviewed or you lack permission.');
  }
  await verificationQueue();
  toast('Test decision saved.');
}

function settingsView() {
  const groups = [
    ['Account and trust', [
      ['Verification', 'Identity status and verification requirements', 'shield'],
      ['Privacy & data', 'Visibility, data export and deletion requests', 'user'],
      ['Security', 'Password recovery and sign-in options', 'settings'],
      ['Premium', 'Planned benefits and badge eligibility', 'check'],
    ]],
    ['Help and policies', [
      ['Support', 'Send a support request or appeal', 'chat'],
      ['Terms', 'Rules for using Afriwork', 'jobs', 'policy'],
      ['Privacy', 'How Afriwork handles your information', 'shield', 'policy'],
      ['Safety', 'Guidelines for safer interactions', 'shield', 'policy'],
      ['Job rules', 'Requirements for posting opportunities', 'jobs', 'policy'],
    ]],
  ];
  return title('Settings', 'Manage your account, privacy and support.') +
    groups.map(([heading, rows]) => `<section class="settings-group">
      <h3>${heading}</h3>
      <div class="card settings-list">${rows.map(([name, description, glyph, action = 'setting']) =>
        act(action, `<span class="settings-icon">${icon(glyph)}</span>
          <span class="settings-label"><strong>${name}</strong><small>${description}</small></span>
          <span class="settings-arrow" aria-hidden="true">›</span>`, 'settings-row', name)
      ).join('')}</div>
    </section>`).join('') +
    act('logout', icon('out') + ' Log out', 'btn outline settings-logout');
}
async function mutate(table,query,method,body){if(!state.demo)return db(table,query,method,body)}
async function refresh(){try{await load();render()}catch(e){toast(errorMessage(e))}}
function jobForm(j={}){modal(j.id?'Edit opportunity':'Post an opportunity',`<form id="jobform" data-id="${esc(j.id||'')}">${field('title','Job / project title',j.title||'','text',true)}${field('company_name','Company or individual hiring name',j.company_name||profileName(state.profile),'text',true)}${select('category','Category',categories,j.category||state.profile.category)}<div class="grid2"><div>${field('city','City / region',j.city||state.profile.city,'text',true)}</div><div>${field('country','Country',j.country||state.profile.country,'text',true)}</div></div>${select('type','Opportunity type',['Full-time','Part-time','Contract','Temporary','Internship','Freelance','Local gig'],j.type||'Full-time')}${select('arrangement','Work arrangement',['On-site','Hybrid','Remote'],j.arrangement||'On-site')}${jobPayFields(j.salary)}<label for="description">Description and requirements</label><textarea id="description" name="description" required minlength="30" maxlength="10000">${esc(j.description||'')}</textarea><label class="check"><input type="checkbox" name="rules" required><span>This opportunity follows the ${act('policy','Job Posting Rules','link','Job rules')}. I won’t charge applicants recruitment fees.</span></label><p class="error" role="alert"></p><button class="btn wide">${j.id?'Save changes':'Publish opportunity'}</button></form>`)}
function editProfile(){const p=state.profile;modal(isCompany(p)?'Edit company profile':'Edit your profile',`<form id="profileform">${field('full_name','Full name',p.full_name,'text',true)}${isCompany(p)?field('company','Company name',p.company||'','text',true):''}${field('headline',isCompany(p)?'Company tagline':'Professional headline',p.headline||'')}${select('category',isCompany(p)?'Industry':'Work category',categories.includes(p.category)?categories:[p.category,...categories],p.category)}${field('city','City / region',p.city,'text',true)}${field('country','Country',p.country,'text',true)}${isCompany(p)?'':skillPicker(p.skills)}${field('website',isCompany(p)?'Company website (optional)':'Featured link (optional)',p.website||'','url')}<label for="bio">${isCompany(p)?'Company overview':'About you'}</label><textarea id="bio" name="bio" maxlength="2000">${esc(p.bio||'')}</textarea><p class="error" role="alert"></p><button class="btn wide">Save profile</button></form>`);const picker=$('#profileform .skill-picker');if(picker)updateSkills(picker)}
const policies={Terms:`<p class="notice">Working draft · Not approved for public launch. Operator identity, contact details, launch countries and legal review are still required.</p><h3>Using Afriwork</h3><p>Afriwork connects people looking for work with hirers and professional contacts. It is an intermediary, not the employer or a party to your work agreement. You must currently be at least 18 to register. Provide accurate information and keep your account secure.</p><h3>Your responsibilities</h3><p>Publish lawful, accurate content you have permission to share. Do not impersonate people, scam, discriminate, harass, infringe intellectual property or post illegal work. You retain rights to your content and permit Afriwork to display it to provide the service.</p><h3>Opportunities and checks</h3><p>Jobs, income, responses and hiring outcomes are not guaranteed. Identity or business confirmation only describes checks actually completed; it does not guarantee honesty, competence or safety. Assess opportunities independently and put work terms in writing.</p><h3>Moderation and complaints</h3><p>Suspected violations can be reported. Afriwork may review reports, remove prohibited content or restrict accounts, with a route to appeal. Do not use reporting to target people unfairly.</p><h3>Limits and rights</h3><p>The service may experience errors or interruptions. Any limitation of responsibility applies only to the extent permitted by applicable law and does not exclude mandatory consumer rights or liability that cannot lawfully be excluded. No claim is made that these terms prevent legal claims.</p>`,Privacy:`<p class="notice">Working draft · The operator must confirm contact details, data locations, retention periods and rights procedures before public launch.</p><h3>Information and purpose</h3><p>Account email supports sign-in and recovery. Age supports our adults-only account policy and is private. Profile name, location, skills and professional content are shared within the service as described on screen. Applications and messages are restricted to the relevant parties.</p><h3>Storage and access</h3><p>The connected build uses your configured Supabase project for authentication and database storage. Browser preview data stays in memory and disappears on reload. Passwords are not saved by this preview. No ID documents or CV files are collected in this version.</p><h3>Your choices</h3><p>Edit your profile in Profile. Use Privacy &amp; data to request export or deletion. These are requests for operator review, not immediate automatic deletion. No marketing messages are enabled. Never put private identity information in public posts.</p><h3>Still to be finalized</h3><p>Retention schedules, backup deletion, lawful processing grounds, service-provider arrangements, breach handling and country-specific rights must be documented before real users join.</p>`,Safety:`<h3>Keep professional connections safe</h3><p>Never pay to secure a job. Verify company details independently. Do not send identity documents through posts or messages. Avoid payment links, suspicious attachments and requests for account passwords.</p><h3>Respect others</h3><p>Harassment, threats, discrimination, scams, impersonation and exploitative work are prohibited. Share only material you have rights to use. Report suspicious content using its Report control or Support in Settings.</p><h3>Verification</h3><p>No one can award themselves verification. Government-ID collection is disabled until a secure review process is operational. Household, childcare and caregiving opportunities are unavailable until that review is available.</p>`, 'Job rules':`<h3>Post legitimate opportunities</h3><p>Clearly identify the hirer, work, location, arrangement and requirements. Describe pay honestly when provided; do not invent ranges or misleading income claims. No recruitment-fee scams, unlawful discrimination, illegal work, unpaid deceptive trials or requests for sensitive personal information in public listings.</p><h3>Applications</h3><p>Use applicants’ information only to evaluate the advertised opportunity. Keep communication professional. Close or mark a role filled when hiring ends. Status changes should reflect real decisions.</p><h3>Sensitive services</h3><p>Household, childcare and caregiving listings require an operational identity-review process before participation and are currently blocked.</p>`};
function commentRow(comment) {
  const date = new Date(comment.created_at);
  return `<li class="comment-row">
    <div class="avatar" aria-hidden="true">${esc(initials(comment.author_name))}</div>
    <div><div class="comment-meta"><strong>${esc(comment.author_name)}</strong><time datetime="${esc(comment.created_at)}">${esc(date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))}</time></div>
    <p>${esc(comment.body)}</p></div>
  </li>`;
}

async function openComments(postId) {
  const version = modalVersion;
  const comments = state.demo
    ? (state.comments || []).filter(comment => comment.post_id === postId)
    : await db('comments', '?post_id=eq.' + encodeURIComponent(postId) + '&order=created_at.asc');
  if (version !== modalVersion) return;
  modal('Comments', `
    <div class="comment-thread" tabindex="0" aria-label="Comment thread">
      <ol class="comment-list">${(comments || []).map(commentRow).join('')}</ol>
      <div class="comment-empty" ${comments?.length ? 'hidden' : ''}>
        <span class="bubble">${icon('chat')}</span>
        <strong>Start the conversation</strong><p>Be the first to leave a comment.</p>
      </div>
    </div>
    <form id="commentform" data-id="${esc(postId)}">
      <p class="error" role="alert"></p><span class="visually-hidden" role="status"></span>
      <div class="comment-composer">
        <div class="avatar" aria-hidden="true">${esc(initials(state.profile.full_name))}</div>
        <div class="comment-input">
          <textarea name="body" id="comment" aria-label="Add a comment" placeholder="Add a comment…" rows="1" required maxlength="2000"></textarea>
          <button class="comment-send" aria-label="Comment" disabled>${icon('arrow')}</button>
        </div>
      </div>
    </form>`, 'comment-sheet');
}
async function addComment(form, body) {
  if (!body) throw new Error('Write a comment first.');
  const comment = {
    id: id(), post_id: form.dataset.id, author_id: state.user.id,
    author_name: state.profile.full_name, body, created_at: new Date().toISOString(),
  };
  const rows = await mutate('comments', '', 'POST', comment);
  const saved = rows?.[0] || comment;
  if (state.demo) (state.comments ||= []).push(saved);
  updatePostCount(saved.post_id, 'comments', 1);
  if (!form.isConnected || !$('#modal').open) return;
  const thread = $('.comment-thread');
  thread.querySelector('.comment-empty').hidden = true;
  thread.querySelector('.comment-list').insertAdjacentHTML('beforeend', commentRow(saved));
  thread.scrollTop = thread.scrollHeight;
  form.reset();
  form.querySelector('[role="status"]').textContent = 'Comment posted.';
}
async function action(a,v){if(a==='close')return closeModal();if(a==='home'){state.route='feed';state.feedTab='For You';render();window.scrollTo(0,0);return;}if(a==='countries')return modal('Choose your country',`<label for="country-search">Search countries</label><input id="country-search" type="search" placeholder="Search countries"><div class="country-options">${countries.map(({name,flag})=>act('countrychoose',flag+' '+esc(name),'country-option',name)).join('')}</div>`);
if(a==='countrychoose'){const field=$('#country');if(field){field.value=v;field.dispatchEvent(new Event('input',{bubbles:true}));}return closeModal();}
if(a==='policy')return modal(v,policies[v]);if(a==='screen'){state.screen=v;return render()}if(a==='demo'){state.demo=true;state.screen='onboarding';state.onboard=0;state.user={id:id()};return render()}if(a==='exitdemo'||a==='logout'){if(token)try{await request('/auth/v1/logout',{method:'POST'})}catch{}token=null;location.reload();return}if(a==='role'){state.draft.role=v;return render()}if(a==='obback'){captureOnboard(new FormData($('#onboardform')));state.onboard--;return render()}if(a==='nav'){const changed=state.route!==v;state.route=v;render();if(changed)animateEntrance($('.content'),4,170);return}if(a==='feedtab'){state.feedTab=v;return render()}if(a==='create')return modal('Create',`<div class="stack">${act('post','Take a picture','choice','camera')}${act('post','Choose photos','choice','photos')}${act('post','Write a text post','choice')}${act('newjob','Post a job, project or local gig','choice')}</div>`);
if(a==='post'){
  const photos=v==='camera'||v==='photos';
  return modal(photos?'Create a photo post':'Write a post',`<form id="postform">
    ${photos?(state.demo?`<label for="postphotos">${v==='camera'?'Open camera':'Choose up to 10 photos'}</label><input id="postphotos" type="file" accept="image/*" ${v==='camera'?'capture="environment"':'multiple'} required><div class="post-photo-preview" hidden><small>Photos are center-cropped to fill the square. Swipe to preview each photo.</small><div class="post-photos"></div></div><p class="muted">Photos stay in this preview session.</p>`:'<p class="notice">Photo posting is available in browser preview while shared photo storage is being built.</p>'):''}
    <label for="body">${photos?'Caption':'Your update'}</label><textarea id="body" name="body" maxlength="5000" ${photos?'':'required'}></textarea>
    <p class="error" role="alert"></p><button class="btn wide" ${photos&&!state.demo?'disabled':''}>Publish post</button></form>`);
}
if(a==='editmedia')return editProfileImage(v);
if(a==='editprofile')return editProfile();if(a==='newjob')return jobForm();if(a==='saved'){state.onlySaved=!state.onlySaved;return render()}if(a==='filters')return modal('Find the right fit.',`<form id="filterform">${select('category','Category',['',...categories],state.filter.category)}${select('type','Opportunity type',['','Full-time','Part-time','Contract','Temporary','Internship','Freelance','Local gig'],state.filter.type)}${select('arrangement','Arrangement',['','On-site','Hybrid','Remote'],state.filter.arrangement)}<button class="btn wide" style="margin-top:20px">Apply filters</button></form>`);
if(a==='savejob'){const on=state.saved.includes(v);await mutate('saved_jobs','?user_id=eq.'+state.user.id+'&job_id=eq.'+v,on?'DELETE':'POST',on?undefined:{user_id:state.user.id,job_id:v});state.saved=on?state.saved.filter(x=>x!==v):[...state.saved,v];render();return toast(on?'Removed from saved jobs':'Job saved')}
if(a==='like'){const on=state.liked.includes(v);await mutate('post_likes','?user_id=eq.'+state.user.id+'&post_id=eq.'+v,on?'DELETE':'POST',on?undefined:{user_id:state.user.id,post_id:v});state.liked=on?state.liked.filter(x=>x!==v):[...state.liked,v];updatePostCount(v,'likes',on?-1:1);return render()}
if(a==='share'){
  const post=state.posts.find(item=>item.id===v);
  if (!post) return;
  if (navigator.share) {
    try { await navigator.share({title:'Afriwork',text:post.body}); }
    catch (error) {
      if (error.name === 'AbortError') return;
      return modal('Share this update', `<p class="detail">${esc(post.body)}</p>${act('copyshare','Copy post text','btn',v)}`);
    }
    return recordPostShare(v);
  }
  return modal('Share this update', `<p class="detail">${esc(post.body)}</p>${act('copyshare','Copy post text','btn',v)}`);
}
if(a==='copyshare'){
  const post=state.posts.find(item=>item.id===v);
  if (!post) return;
  if (!navigator.clipboard?.writeText) throw new Error('Select and copy the post text above.');
  try { await navigator.clipboard.writeText(post.body); }
  catch { throw new Error('Select and copy the post text above.'); }
  await recordPostShare(v);
  closeModal();
  return toast('Post text copied.');
}
if(a==='comments')return openComments(v);
if(a==='delpost')return modal('Delete this post?',`<p>This removes the post and its comments.</p>${act('confirmdelpost','Delete post','btn',v)}`);
if(a==='confirmdelpost'){await mutate('posts','?id=eq.'+v,'DELETE');state.posts.find(p=>p.id===v)?.photos?.forEach(url=>URL.revokeObjectURL(url));state.posts=state.posts.filter(p=>p.id!==v);closeModal();return render()}
if(a==='jobdetail'){const j=state.jobs.find(j=>j.id===v),applied=state.applications.some(a=>a.job_id===v&&a.applicant_id===state.user.id&&a.status!=='Withdrawn');return modal(esc(j.title),`<p>${esc(j.company_name)} · ${esc(j.city)}, ${esc(j.country)}</p><span class="pill">${esc(j.type)}</span> <span class="pill">${esc(j.arrangement)}</span><div class="detail">${esc(j.description)}</div><p>${esc(jobPayLabel(j.salary))}</p>${applied?'<div class="notice">You have already applied.</div>':j.owner_id===state.user.id?'<div class="notice">This is your own listing.</div>':act('apply','Apply now','btn wide',v)}${act('report','Report opportunity','link','job:'+v)}`)}
if(a==='apply')return modal('Apply for this opportunity',`<form id="applyform" data-id="${v}"><p>Your name, headline and skills from your profile will be shared with the hirer. CV uploads are not enabled yet.</p><label for="cover">Cover note (optional)</label><textarea name="cover_note" id="cover" maxlength="5000"></textarea><p class="error" role="alert"></p><button class="btn wide">Submit application</button></form>`);
if(a==='withdraw'){await mutate('applications','?id=eq.'+v,'PATCH',{status:'Withdrawn'});state.applications.find(x=>x.id===v).status='Withdrawn';render();return toast('Application withdrawn')}
if(a==='manage'){const j=state.jobs.find(j=>j.id===v);const apps=state.demo?state.applications.filter(a=>a.job_id===v):await db('applications','?job_id=eq.'+v+'&order=created_at.desc');return modal(esc(j.title),`<div class="row" style="flex-wrap:wrap">${act('editjob','Edit','btn outline small',v)}${j.status==='Open'?act('filljob','Mark filled','btn small',v):''}${act('deletejob','Delete','link',v)}</div><h3>Applicants · ${(apps||[]).length}</h3>${(apps||[]).map(ap=>`<div class="list-item"><strong>${esc(ap.applicant_name)}</strong><p>${esc(ap.cover_note||'No cover note.')}</p><form id="status-${ap.id}" class="statusform" data-id="${ap.id}">${select('status','Application status',['Pending','Viewed','Shortlisted','Interview','Not Selected','Closed','Withdrawn'],ap.status)}<button class="btn small" style="margin-top:10px">Update status</button></form>${act('startchat','Message candidate →','link',ap.id)}</div>`).join('')||'<p class="muted">No applications yet.</p>'}`)}
if(a==='editjob')return jobForm(state.jobs.find(j=>j.id===v));if(a==='filljob'){await mutate('jobs','?id=eq.'+v,'PATCH',{status:'Filled'});state.jobs.find(j=>j.id===v).status='Filled';closeModal();render();return toast('Listing marked filled. Existing application statuses are preserved.')}
if(a==='deletejob')return modal('Delete this listing?',`<p>This will also remove its applications and hiring conversations. Close or fill the job instead if you need to keep its records.</p>${act('confirmdeljob','Delete listing','btn',v)}`);
if(a==='confirmdeljob'){await mutate('jobs','?id=eq.'+v,'DELETE');state.jobs=state.jobs.filter(j=>j.id!==v);state.applications=state.applications.filter(j=>j.job_id!==v);closeModal();return render()}
if(a==='report')return modal('Report a concern',`<form id="reportform" data-target="${esc(v)}">${select('reason','Reason',['Suspected scam','Impersonation','Misleading information','Abuse or discrimination','Copyright concern','Other'],'Suspected scam')}<label for="details">Details (optional)</label><textarea id="details" name="details" maxlength="3000"></textarea><p class="error" role="alert"></p><button class="btn wide">${state.demo?'Save preview report':'Submit report'}</button></form>`);
if(a==='submitverification')return submitVerification(v);
if(a==='verificationqueue')return verificationQueue();
if(a==='reviewverification')return reviewVerification(v);
if(a==='setting'){if(v==='Verification')return verificationView();if(v==='Premium')return modal('Afriwork Premium',`<p>Premium is planned. Pricing and billing have not been finalized. There is no checkout in this build.</p><p>Planned featured links: one free, up to three Premium.</p><p class="row"><img src="verification.png" width="19" height="20" alt=""><strong>Orange Africa Tick</strong></p><p>Requires active Premium, identity or business confirmation, a complete profile and Afriwork approval.</p>`);if(v==='Security')return modal('Account security',`<p>${state.demo?'Preview mode has no real login or password.':'Passwords are handled by Supabase Auth. Log out and use “Forgot your password?” for recovery.'}</p><p>Additional sign-in methods and two-factor setup are not enabled in this build.</p>`);if(v==='Support')return modal('Support and appeals',`<p>Use this form to record a support request or appeal. Operator contact information and the support review workflow must be finalized before launch.</p>${act('report','Open support / appeal form','btn','support:account')}`);return modal('Privacy & data',`<p>Age is private. Your profile and posts are visible to signed-in members. Applications and messages are restricted to the relevant participants.</p><div class="stack">${act('datarequest','Request data export','btn outline','export')}${act('datarequest','Request account deletion','btn outline','deletion')}</div><p class="muted">Requests require operator review; they do not instantly delete records.</p>`)}
if(a==='datarequest')return modal(v==='deletion'?'Request account deletion?':'Request a data export?',`<p>${state.demo?'This will only demonstrate the request in this browser session.':'The request will be recorded for the operator to process. It is not automatic fulfillment.'}</p>${act('confirmdata','Submit request','btn',v)}`);
if(a==='confirmdata'){if(state.demo)(state.dataRequests||=[]).push({kind:v,created_at:new Date().toISOString()});await mutate('data_requests','','POST',{user_id:state.user.id,kind:v});closeModal();return toast(state.demo?'Preview request recorded for this session only.':'Request received for operator review.')}
if(a==='startchat'){const ap=state.applications.find(x=>x.id===v)||(!state.demo?(await db('applications','?id=eq.'+v))[0]:null),j=state.jobs.find(j=>j.id===ap.job_id);let c=state.conversations.find(c=>c.application_id===v);if(!c){c={id:id(),application_id:v,job_id:j.id,hirer_id:j.owner_id,applicant_id:ap.applicant_id,created_at:new Date().toISOString()};if(!state.demo)c=(await db('conversations','','POST',c))[0];state.conversations.push(c)}return action('thread',c.id)}
if(a==='thread'){const ms=state.demo?state.messages.filter(m=>m.conversation_id===v):await db('messages','?conversation_id=eq.'+v+'&order=created_at.asc&limit=100');return modal('Hiring conversation',`${(ms||[]).map(m=>`<div class="message ${m.sender_id===state.user.id?'me':''}">${esc(m.body)}</div>`).join('')||'<p class="muted">No messages yet.</p>'}${act('block','Block / unblock this contact','link',v)}<form id="messageform" data-id="${v}"><label for="message">Message</label><textarea id="message" name="body" required maxlength="3000"></textarea><p class="error" role="alert"></p><button class="btn wide">Send message</button></form>`)}
if(a==='block'){if(state.demo)return toast('No other real accounts exist in this preview.');const c=state.conversations.find(c=>c.id===v),other=c.hirer_id===state.user.id?c.applicant_id:c.hirer_id;const rows=await db('blocks','?blocker_id=eq.'+state.user.id+'&blocked_id=eq.'+other);await db('blocks',rows.length?'?blocker_id=eq.'+state.user.id+'&blocked_id=eq.'+other:'',rows.length?'DELETE':'POST',rows.length?undefined:{blocker_id:state.user.id,blocked_id:other});return toast(rows.length?'Contact unblocked.':'Contact blocked. Messages between you are disabled.')}
}
function captureOnboard(fields) {
  for (const [name, value] of fields) {
    state.draft[name] = name === 'skills' ? JSON.parse(value) : value;
  }
}
async function submit(form){const fd=new FormData(form),d=Object.fromEntries(fd),kind=form.dataset.kind;let rerender=true;
if(form.id==='verificationreviewform')return saveVerificationDecision(form.dataset.id,d.status,d.reason);
if(form.id==='profilemediaform')return saveCroppedProfileImage(form);
if(form.id==='authform'){if(!connected)throw new Error('Connect Supabase first or use the browser preview.');if(kind==='signup'){if(d.terms!=='on'||d.privacy!=='on')throw new Error('Accept the Terms and acknowledge the Privacy Policy first.');const age=Number(d.age);if(!/^\d+$/.test(d.age)||age<18||age>120)throw new Error('Enter a whole-number age from 18 to 120. Afriwork currently accepts adults only.');const r=await request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email:d.email,password:d.password,data:{age,terms_version:'draft-2026-11-02',privacy_version:'draft-2026-11-02',terms_accepted:d.terms==='on',privacy_acknowledged:d.privacy==='on'}})});if(!r.access_token){modal('Check your inbox',`<p>Open the email confirmation link, then return here to log in. Check your spam folder if needed.</p>`);return}token=r.access_token;state.user=r.user}else if(kind==='login'){const r=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:d.email,password:d.password})});token=r.access_token;state.user=r.user}else if(kind==='reset'){await request('/auth/v1/recover',{method:'POST',body:JSON.stringify({email:d.email})});toast('If the address is registered, a recovery email will arrive.');return}else if(kind==='recover'){await request('/auth/v1/user',{method:'PUT',body:JSON.stringify({password:d.password})});toast('Password updated.');state.screen='login';token=null;return render()}
const p=(await db('profiles','?id=eq.'+state.user.id))[0];state.profile=p;if(p?.onboarding_complete){state.screen='app';await load()}else{state.draft={...state.draft,...p,skills:p?.skills||[]};state.screen='onboarding'}render();return}
if(form.id==='onboardform'){captureOnboard(fd);if(state.onboard<onboardingSteps().length-1){state.onboard++;return render()}const p={...state.draft,id:state.user.id,onboarding_complete:true,skills:Array.isArray(state.draft.skills)?state.draft.skills:[]};delete p.identity_confirmed;delete p.premium;delete p.created_at;if(!state.demo)await db('profiles','?id=eq.'+state.user.id,'PATCH',p);state.profile=p;state.screen='app';await refresh();return}
if(form.id==='searchform'||form.id==='jobsearch'){state.query=d.query.trim();state.route='jobs'}else if(form.id==='filterform'){state.filter=d;closeModal()}else if(form.id==='postform'){const p={id:id(),author_id:state.user.id,author_name:state.profile.full_name,is_company:state.profile.hirer_type==='company'&&state.profile.role==='Hire Talent',body:d.body.trim(),created_at:new Date().toISOString()};const files=postPhotoFiles(form.querySelector?.('#postphotos'));
if(files.length&&state.demo)p.photos=files.map(file=>URL.createObjectURL(file));
if(!p.body&&!p.photos?.length)throw new Error('Write something or add a photo.');await mutate('posts','','POST',p);state.posts.unshift(p);state.route='feed';state.feedTab='For You';closeModal();toast(state.demo?'Post added to this preview session.':'Post published.')}else if(form.id==='profileform'){if(d.website&&safeURL(d.website)==='#')throw new Error('Use a valid https:// or http:// link.');const patch={...d};if(typeof d.skills==='string')patch.skills=JSON.parse(d.skills);await mutate('profiles','?id=eq.'+state.user.id,'PATCH',patch);Object.assign(state.profile,patch);closeModal();toast('Profile updated.')}else if(form.id==='jobform'){if(sensitive.includes(d.category))throw new Error('This category requires identity review, which is not available yet.');if(d.description.trim().length<30)throw new Error('Add a description of at least 30 characters.');delete d.rules;const currency=d.currency;delete d.currency;const amount=d.salary?.trim()||'';d.salary=amount&&Object.hasOwn(jobCurrencies,currency)?currency+' '+amount:amount;const j={...d,status:'Open'};if(form.dataset.id){delete j.status;await mutate('jobs','?id=eq.'+form.dataset.id,'PATCH',j);Object.assign(state.jobs.find(j=>j.id===form.dataset.id),j)}else{Object.assign(j,{id:id(),owner_id:state.user.id,created_at:new Date().toISOString()});await mutate('jobs','','POST',j);state.jobs.unshift(j)}closeModal();state.route='hire';toast(state.demo?'Opportunity saved in this preview only.':'Opportunity saved.')}else if(form.id==='applyform'){const j=state.jobs.find(j=>j.id===form.dataset.id);if(j.owner_id===state.user.id)throw new Error('You cannot apply to your own job.');if(j.status!=='Open')throw new Error('This opportunity is closed.');if(state.applications.some(a=>a.job_id===j.id&&a.applicant_id===state.user.id))throw new Error('You have already applied to this opportunity.');const ap={id:id(),job_id:j.id,applicant_id:state.user.id,applicant_name:state.profile.full_name,cover_note:d.cover_note.trim(),status:'Pending',created_at:new Date().toISOString()};await mutate('applications','','POST',ap);state.applications.unshift(ap);closeModal();toast('Application submitted.')}else if(form.id==='commentform'){return addComment(form,d.body.trim())}else if(form.id==='reportform'){await mutate('reports','','POST',{reporter_id:state.user.id,target:form.dataset.target,reason:d.reason,details:d.details});closeModal();toast(state.demo?'Report demonstrated. No moderation team was contacted.':'Report received for review.')}else if(form.classList.contains('statusform')){await mutate('applications','?id=eq.'+form.dataset.id,'PATCH',{status:d.status});const ap=state.applications.find(a=>a.id===form.dataset.id);if(ap)ap.status=d.status;toast('Application status updated.');rerender=false}else if(form.id==='messageform'){const m={id:id(),conversation_id:form.dataset.id,sender_id:state.user.id,body:d.body.trim(),created_at:new Date().toISOString()};if(!m.body)throw new Error('Write a message first.');await mutate('messages','','POST',m);state.messages.push(m);return action('thread',m.conversation_id)}if(rerender)render()}
document.addEventListener('pointerdown', () => { pointerMotion = true; });
document.addEventListener('keydown', () => { pointerMotion = false; });
$('#modal').addEventListener('close', unlockModalScroll);
$('#modal').addEventListener('cancel', event => {
  event.preventDefault();
  closeModal();
});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b)return;e.preventDefault();if(b.disabled)return;b.disabled=true;try{await action(b.dataset.action,b.dataset.value)}catch(err){toast(errorMessage(err))}finally{b.disabled=false}});
document.addEventListener('click', event => {
  const button = event.target.closest('[data-skill-group], [data-skill]');
  if (!button) return;
  const picker = button.closest('.skill-picker');
  if ('skill' in button.dataset) return toggleSkill(picker, button);
  picker.dataset.group = button.dataset.skillGroup;
  picker.querySelectorAll('[data-skill-group]').forEach(option =>
    option.setAttribute('aria-pressed', String(option === button))
  );
  updateSkills(picker);
});
document.addEventListener('input', event => {
  const input = event.target;
  if (input.matches('.skill-search input')) updateSkills(input.closest('.skill-picker'));
  if (input.id === 'comment') {
    const send = input.form.querySelector('.comment-send');
    send.disabled = !input.value.trim() || !!input.form.dataset.pending;
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.isComposing && event.target.matches('.skill-search input')) {
    event.preventDefault();
  }
});
document.addEventListener('input', event => {
 if(event.target.id!=='country-search')return;
 const q=event.target.value.trim().toLowerCase();
 document.querySelectorAll('.country-option').forEach(b=>{b.hidden=!b.textContent.toLowerCase().includes(q);});
});
document.addEventListener('change', event => {
  const picker = event.target;
  if (picker.id === 'postphotos') { previewPostPhotos(picker); return; }
  if (picker.id === 'profile-image-file') { void preparePhotoCrop(picker); return; }
  if (!picker.matches('[data-country-picker]') || !picker.value) return;
  picker.closest('.country-field').querySelector('input').value = picker.value;
  picker.value = '';
});
document.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.target;
  if (form.dataset.pending) return;
  const button = form.querySelector('button:not([data-action])');
  const error = form.querySelector('.error');
  const commentInput = form.id === 'commentform' ? form.elements.body : null;
  form.dataset.pending = 'true';
  if (button) button.disabled = true;
  if (commentInput) commentInput.readOnly = true;
  if (error) error.textContent = '';
  try {
    await submit(form);
  } catch (failure) {
    if (error) error.textContent = errorMessage(failure);
    else toast(errorMessage(failure));
  } finally {
    delete form.dataset.pending;
    if (commentInput) commentInput.readOnly = false;
    if (button) button.disabled = !!commentInput && !commentInput.value.trim();
  }
});
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal()}});
// Sessions intentionally live in memory; no passwords, age or personal data in browser storage.
const hash=new URLSearchParams(location.hash.slice(1));if(connected&&hash.get('type')==='recovery'&&hash.get('access_token')){token=hash.get('access_token');state.screen='recover';history.replaceState(null,'',location.pathname)}
// Mobile reading mode: hide the top navigation on downward scroll, reveal on upward scroll.
let afriworkLastY=scrollY,afriworkTravel=0,afriworkDirection=0;
window.addEventListener('scroll',()=>{
 const y=Math.max(0,scrollY),delta=y-afriworkLastY;afriworkLastY=y;
 if(state.screen!=='app'||innerWidth>760||$('#modal').open)return;
 if(y<75){document.body.classList.remove('nav-collapsed');afriworkTravel=0;return;}
 if(Math.abs(delta)<1)return;
 const dir=Math.sign(delta);if(dir!==afriworkDirection){afriworkDirection=dir;afriworkTravel=0;}
 afriworkTravel+=Math.abs(delta);
 if(afriworkTravel>=24){document.body.classList.toggle('nav-collapsed',dir>0);afriworkTravel=0;}
},{passive:true});
render();
