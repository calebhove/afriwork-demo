'use strict';
const cfg=window.AFRIWORK_CONFIG||{}, connected=!!(cfg.url&&cfg.key);
const icons={home:'M3 10l9-7 9 7v11h-6v-7H9v7H3z',jobs:'M8 6V3h8v3M3 7h18v14H3z M3 12h18 M10 11v3h4v-3',hire:'M4 21v-7h16v7 M8 10a4 4 0 1 0 8 0a4 4 0 1 0-8 0',bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5z M10 21h4',plus:'M12 4v16 M4 12h16',chat:'M21 11a9 9 0 0 1-9 9H3v-9a9 9 0 1 1 18 0 M7 10h10 M7 14h6',user:'M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8 M4 22v-3a8 6 0 0 1 16 0v3',search:'M21 21l-6-6 M17 10a7 7 0 1 1-14 0a7 7 0 0 1 14 0',filter:'M3 5h18 M6 12h12 M9 19h6',settings:'M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',arrow:'M5 12h14 M13 6l6 6-6 6',shield:'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M8 12l3 3 5-6',save:'M6 3h12v18l-6-4-6 4z',heart:'M20 5c-4-4-8 1-8 1s-4-5-8-1c-4 4 1 9 8 15 7-6 12-11 8-15',check:'M5 12l4 4L19 6',out:'M14 3H4v18h10 M10 12h11 M17 8l4 4-4 4'};
Object.assign(icons, {
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
    <input id="country" name="country" list="country-suggestions" value="${esc(value)}" placeholder="Type your country" ${required?'required':''}>
    <datalist id="country-suggestions">${countries.map(({name,flag}) => `<option value="${esc(name)}" label="${flag} ${esc(name)}"></option>`).join('')}</datalist>
    <button type="button" class="country-arrow" data-action="countries" aria-label="Choose a country" title="Choose a country"><svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>
  </div>`;
}
const isCompany = profile => profile.role === 'Hire Talent' && profile.hirer_type === 'company';
const profileName = profile => (isCompany(profile) && profile.company?.trim()) || profile.full_name;
function field(name,label,value='',type='text',required=false){if(name==='country')return countryField(value,required);return `<label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''} ${type==='password'?'minlength="10" autocomplete="new-password"':''}>`}
function select(name,label,items,value){return `<label for="${name}">${label}</label><select id="${name}" name="${name}">${items.map(i=>`<option ${i===value?'selected':''}>${esc(i)}</option>`).join('')}</select>`}
function empty(kind,title,text,button=''){return `<div class="card empty"><div class="bubble">${icon(kind)}</div><h3>${title}</h3><p>${text}</p>${button}</div>`}
function title(h,p){return `<div class="pagetitle"><h2>${h}</h2><p>${p}</p></div>`}
async function request(path,options={}){const res=await fetch(cfg.url.replace(/\/$/,'')+path,{...options,headers:{apikey:cfg.key,Authorization:'Bearer '+(token||cfg.key),'Content-Type':'application/json',...options.headers}});let data;try{data=await res.json()}catch{data=null}if(!res.ok)throw new Error(data?.msg||data?.message||data?.error_description||'Request failed ('+res.status+').');return data}
const db=(table,query='',method='GET',body)=>request('/rest/v1/'+table+query,{method,...(body!==undefined?{body:JSON.stringify(body)}:{}),headers:{Prefer:'return=representation'}});
async function load(){if(state.demo)return;const uid=state.user.id;const [posts,jobs,apps,saves,likes,conv]=await Promise.all([db('posts','?select=*&order=created_at.desc&limit=50'),db('jobs','?select=*&order=created_at.desc&limit=100'),db('applications','?select=*&order=created_at.desc'),db('saved_jobs','?select=job_id'),db('post_likes','?user_id=eq.'+uid+'&select=post_id'),db('conversations','?select=*&order=created_at.desc')]);Object.assign(state,{posts:posts||[],jobs:jobs||[],applications:apps||[],saved:(saves||[]).map(s=>s.job_id),liked:(likes||[]).map(s=>s.post_id),conversations:conv||[]})}
let pointerMotion = false;
let modalAnimation = null;
let modalVersion = 0;

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

function modal(heading, body) {
  const dialog = $('#modal');
  modalVersion++;
  modalAnimation?.cancel();
  dialog.innerHTML = `<div class="modalhead"><h2>${heading}</h2>${act('close','×','iconbtn')}</div><div class="modalbody">${body}</div>`;
  if (!dialog.open) dialog.showModal();
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
  if (version === modalVersion) dialog.close();
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
function authView(){if(state.screen==='welcome')return authShell(`<span class="eyebrow">Welcome to Afriwork</span><h2 style="margin-top:17px">Your next chapter<br>starts here.</h2><p class="muted">Find work. Hire talent. Build your professional name.</p><div class="stack" style="margin-top:35px">${act('screen','Create an account '+icon('arrow'),'btn wide','signup')}${act('screen','I already have an account','btn outline wide','login')}${act('demo','Explore the browser preview','link')}</div><p class="muted" style="font-size:11px;margin-top:30px">${connected?'Secure sign-in powered by Supabase.':'Preview available now. Real sign-in becomes available when your Supabase project is connected.'}</p><div class="row">${act('policy','Terms','link','Terms')}${act('policy','Privacy','link','Privacy')}</div>`);
if(state.screen==='onboarding')return onboarding();
const signup=state.screen==='signup',reset=state.screen==='reset',recover=state.screen==='recover';
return authShell(`${act('screen','← Back','link','welcome')}<h2 style="margin-top:25px">${signup?'Make your next move.':reset?'Reset your password.':recover?'Choose a new password.':'Good to see you.'}</h2><p class="muted">${signup?'Create your Afriwork account.':reset?'We’ll send a recovery link to your email.':recover?'Use a strong, unique password.':'Log in to pick up where you left off.'}</p>${!connected?'<div class="notice">Real accounts are not connected in this preview. Use “Explore the browser preview” to try the app without sharing your password.</div>':''}<form id="authform" data-kind="${signup?'signup':reset?'reset':recover?'recover':'login'}">${!recover?field('email','Email address','','email',true):''}${!reset?field('password','Password'+(signup?' · at least 10 characters':''),'','password',true):''}${signup?`${field('age','Age (years)','','number',true)}<small>Afriwork currently accepts adults aged 18+. Your age stays private.</small><label class="check"><input name="terms" type="checkbox" required><span>I agree to the ${act('policy','Terms of Service','link','Terms')}.</span></label><label class="check"><input name="privacy" type="checkbox" required><span>I acknowledge the ${act('policy','Privacy Policy','link','Privacy')}.</span></label>`:''}<p class="error" role="alert" id="formerror"></p><button class="btn wide" ${!connected?'disabled':''}>${signup?'Create account':reset?'Send recovery email':recover?'Save new password':'Log in'}</button></form>${!signup&&!reset&&!recover?act('screen','Forgot your password?','link','reset'):''}<p style="font-size:13px;margin-top:22px">${signup?'Already have an account?':'New to Afriwork?'} ${act('screen',signup?'Log in':'Create an account','link',signup?'login':'signup')}</p><div class="row">${['Google','Apple','Phone'].map(x=>`<button class="btn outline small" disabled title="Not configured">${x}</button>`).join('')}</div><small>Additional sign-in methods aren’t connected yet.</small>`)}
function onboarding(){const d=state.draft,n=state.onboard;let body='';
if(n===0)body=`<h2>What brings you here?</h2><p class="muted">Choose where you’d like to start.</p>${['Find Work','Hire Talent'].map((r,i)=>act('role',`<span class="symbol">${icon(i?'hire':'jobs')}</span><span><strong>${r}</strong><small>${i?'Find the right people for your business or task.':'Discover jobs, freelance projects and local gigs.'}</small></span>`, 'choice '+(d.role===r?'active':''),r)).join('')}`;
if(n===1)body=`<h2>Your work. Your world.</h2><p class="muted">Pick your main professional field or hiring industry.</p>${select('category','Work category',categories,d.category)}${d.role==='Hire Talent'?select('hirer_type','I am hiring as',['individual','company'],d.hirer_type):''}<p class="notice" style="margin-top:20px">Household, childcare and caregiving work needs identity review before participation. That review is not operational yet.</p>`;
if(n===2)body=`<h2>${isCompany(d)?'Introduce your company.':'A little about you.'}</h2><p class="muted">Start with the essentials. You can edit your profile later.</p>${field('full_name','Your full name',d.full_name||'','text',true)}${d.role==='Hire Talent'&&d.hirer_type==='company'?field('company','Company name',d.company||'','text',true):''}<div class="grid2">${field('country','Country',d.country||'Zimbabwe','text',true)}${field('city','City / region',d.city||'','text',true)}</div>${field('headline',isCompany(d)?'Company tagline (optional)':'Professional headline (optional)',d.headline||'')}${isCompany(d)?'':field('skills','Skills (optional, comma separated)',d.skills||'')}`;
if(n===3)body=`<div class="bubble" style="color:var(--orange);margin-bottom:25px">${icon('shield')}</div><h2>Trust starts with clarity.</h2><p class="muted">Identity verification helps describe checks completed. It never guarantees someone’s skills, honesty or safety.</p><div class="notice">Document collection isn’t available yet. Please don’t send your ID through posts or messages. You can return to Verification in Settings later.</div><button class="btn outline wide" disabled style="margin-top:20px">Verification not available yet</button>`;
if(n===4)body=`<h2>You’re ready to begin.</h2><p class="muted">Take a quick look before you step inside.</p><div class="card"><h3>${esc(profileName(d))}</h3><p>${esc(d.headline||d.category)}</p><p class="muted">${esc(d.city)}, ${esc(d.country)}</p><span class="pill orange">${esc(d.role)}</span> <span class="pill">${esc(d.category)}</span><p style="font-size:12px;margin:16px 0 0">Identity: not confirmed</p></div>`;
return authShell(`<span class="eyebrow">${state.demo?'Browser preview · ':''}Step ${n+1} of 5</span><div class="steps">${[0,1,2,3,4].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div><form id="onboardform">${body}<p class="error" role="alert" id="formerror"></p><div class="footer-actions">${n?act('obback','Back','btn outline'):''}<button class="btn" style="flex:1">${n===4?'Enter Afriwork':n===3?'Skip for now':'Continue '+icon('arrow')}</button></div></form>`)}
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
      ${brand()}
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
function postCard(p){return `<article class="card post"><header><div class="avatar">${esc(initials(p.author_name))}</div><div><strong>${esc(p.author_name)}</strong><small>${new Date(p.created_at).toLocaleDateString()} · Professional update</small></div>${p.author_id===state.user.id?act('delpost','Delete','link',p.id):act('report','Report','link','post:'+p.id)}</header><p>${esc(p.body)}</p>${state.demo&&p.photos?.length?`<div class="post-photos">${p.photos.map((url,index)=>`<img src="${esc(url)}" alt="Post photo ${index+1}">`).join('')}</div>`:''}<div class="actions">${act('like',icon('heart')+' '+(state.liked.includes(p.id)?'Liked':'Like'),'',p.id)}${act('comments',icon('chat')+' Comment','',p.id)}${act('share','Share','',p.id)}</div></article>`}
function filteredJobs(){return state.jobs.filter(j=>j.status==='Open'&&(!state.onlySaved||state.saved.includes(j.id))&&(!state.query||[j.title,j.company_name,j.category,j.description,j.city].join(' ').toLowerCase().includes(state.query.toLowerCase()))&&(!state.filter.category||j.category===state.filter.category)&&(!state.filter.arrangement||j.arrangement===state.filter.arrangement)&&(!state.filter.type||j.type===state.filter.type))}
function jobCard(j,mine=false){return `<article class="card job"><div class="row between"><div class="row"><div class="avatar">${esc(initials(j.company_name))}</div><div><strong style="font-size:13px">${esc(j.company_name)}</strong><small style="display:block">${esc(j.city)} · ${esc(j.country)}</small></div></div>${mine?`<span class="pill orange">${esc(j.status)}</span>`:act('savejob',icon('save'),'iconbtn',j.id)}</div><h3>${esc(j.title)}</h3><div class="tags"><span class="pill">${esc(j.type)}</span><span class="pill">${esc(j.arrangement)}</span><span class="pill">${esc(j.category)}</span></div><div class="foot"><small>${esc(j.salary||'Compensation negotiable')}</small>${mine?act('manage','Manage listing →','btn outline small',j.id):act('jobdetail','See opportunity →','btn outline small',j.id)}</div></article>`}
function companyProfileView(profile) {
  const name = profileName(profile);
  const openings = state.jobs.filter(job => job.owner_id === profile.id && job.status === 'Open');
  return title('Company profile', 'Show candidates who you are and what you do.') +
    `<section class="card profile-card"><div class="cover"></div><div class="profile-body">
      <div class="avatar company-avatar">${esc(initials(name))}</div>
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
function profileView(){const p=state.profile;if(isCompany(p))return companyProfileView(p);return title('Your profile','Your work. Your experience. Your story.')+`<div class="card profile-card"><div class="cover"></div><div class="profile-body"><div class="avatar">${esc(initials(profileName(p)))}</div><div class="row between"><h2>${esc(profileName(p))}</h2>${act('editprofile','Edit profile','btn outline small')}</div><p>${esc(p.headline||p.category)}</p><p class="muted" style="font-size:13px">${esc(p.city)}, ${esc(p.country)} · ${esc(p.role)}</p><span class="pill">Identity not confirmed</span><h3 style="margin-top:25px">About</h3><p class="muted" style="font-size:13px;white-space:pre-wrap">${esc(p.bio||'Add a short introduction to tell people about your work.')}</p><h3>Skills</h3><div class="row" style="flex-wrap:wrap">${(p.skills||[]).map(s=>`<span class="pill">${esc(s)}</span>`).join('')||'<small>No skills added yet.</small>'}</div><h3 style="margin-top:25px">Featured link</h3>${p.website?`<a href="${esc(safeURL(p.website))}" target="_blank" rel="noopener noreferrer">${esc(p.website)}</a>`:'<small>Add a portfolio or professional link when you edit your profile.</small>'}</div></div>`}
function safeURL(u){try{const v=new URL(u);return ['https:','http:'].includes(v.protocol)?v.href:'#'}catch{return '#'}}
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
function jobForm(j={}){modal(j.id?'Edit opportunity':'Post an opportunity',`<form id="jobform" data-id="${esc(j.id||'')}">${field('title','Job / project title',j.title||'','text',true)}${field('company_name','Company or individual hiring name',j.company_name||profileName(state.profile),'text',true)}${select('category','Category',categories,j.category||state.profile.category)}<div class="grid2">${field('city','City / region',j.city||state.profile.city,'text',true)}${field('country','Country',j.country||state.profile.country,'text',true)}</div>${select('type','Opportunity type',['Full-time','Part-time','Contract','Temporary','Internship','Freelance','Local gig'],j.type||'Full-time')}${select('arrangement','Work arrangement',['On-site','Hybrid','Remote'],j.arrangement||'On-site')}${field('salary','Compensation (optional: range, currency or negotiable)',j.salary||'')}<label for="description">Description and requirements</label><textarea id="description" name="description" required minlength="30" maxlength="10000">${esc(j.description||'')}</textarea><label class="check"><input type="checkbox" name="rules" required><span>This opportunity follows the ${act('policy','Job Posting Rules','link','Job rules')}. I won’t charge applicants recruitment fees.</span></label><p class="error" role="alert"></p><button class="btn wide">${j.id?'Save changes':'Publish opportunity'}</button></form>`)}
function editProfile(){const p=state.profile;modal(isCompany(p)?'Edit company profile':'Edit your profile',`<form id="profileform">${field('full_name','Full name',p.full_name,'text',true)}${isCompany(p)?field('company','Company name',p.company||'','text',true):''}${field('headline',isCompany(p)?'Company tagline':'Professional headline',p.headline||'')}${field('city','City / region',p.city,'text',true)}${field('country','Country',p.country,'text',true)}${isCompany(p)?'':field('skills','Skills (comma separated)',(p.skills||[]).join(', '))}${field('website',isCompany(p)?'Company website (optional)':'Featured link (optional)',p.website||'','url')}<label for="bio">${isCompany(p)?'Company overview':'About you'}</label><textarea id="bio" name="bio" maxlength="2000">${esc(p.bio||'')}</textarea><p class="error" role="alert"></p><button class="btn wide">Save profile</button></form>`)}
const policies={Terms:`<p class="notice">Working draft · Not approved for public launch. Operator identity, contact details, launch countries and legal review are still required.</p><h3>Using Afriwork</h3><p>Afriwork connects people looking for work with hirers and professional contacts. It is an intermediary, not the employer or a party to your work agreement. You must currently be at least 18 to register. Provide accurate information and keep your account secure.</p><h3>Your responsibilities</h3><p>Publish lawful, accurate content you have permission to share. Do not impersonate people, scam, discriminate, harass, infringe intellectual property or post illegal work. You retain rights to your content and permit Afriwork to display it to provide the service.</p><h3>Opportunities and checks</h3><p>Jobs, income, responses and hiring outcomes are not guaranteed. Identity or business confirmation only describes checks actually completed; it does not guarantee honesty, competence or safety. Assess opportunities independently and put work terms in writing.</p><h3>Moderation and complaints</h3><p>Suspected violations can be reported. Afriwork may review reports, remove prohibited content or restrict accounts, with a route to appeal. Do not use reporting to target people unfairly.</p><h3>Limits and rights</h3><p>The service may experience errors or interruptions. Any limitation of responsibility applies only to the extent permitted by applicable law and does not exclude mandatory consumer rights or liability that cannot lawfully be excluded. No claim is made that these terms prevent legal claims.</p>`,Privacy:`<p class="notice">Working draft · The operator must confirm contact details, data locations, retention periods and rights procedures before public launch.</p><h3>Information and purpose</h3><p>Account email supports sign-in and recovery. Age supports our adults-only account policy and is private. Profile name, location, skills and professional content are shared within the service as described on screen. Applications and messages are restricted to the relevant parties.</p><h3>Storage and access</h3><p>The connected build uses your configured Supabase project for authentication and database storage. Browser preview data stays in memory and disappears on reload. Passwords are not saved by this preview. No ID documents or CV files are collected in this version.</p><h3>Your choices</h3><p>Edit your profile in Profile. Use Privacy &amp; data to request export or deletion. These are requests for operator review, not immediate automatic deletion. No marketing messages are enabled. Never put private identity information in public posts.</p><h3>Still to be finalized</h3><p>Retention schedules, backup deletion, lawful processing grounds, service-provider arrangements, breach handling and country-specific rights must be documented before real users join.</p>`,Safety:`<h3>Keep professional connections safe</h3><p>Never pay to secure a job. Verify company details independently. Do not send identity documents through posts or messages. Avoid payment links, suspicious attachments and requests for account passwords.</p><h3>Respect others</h3><p>Harassment, threats, discrimination, scams, impersonation and exploitative work are prohibited. Share only material you have rights to use. Report suspicious content using its Report control or Support in Settings.</p><h3>Verification</h3><p>No one can award themselves verification. Government-ID collection is disabled until a secure review process is operational. Household, childcare and caregiving opportunities are unavailable until that review is available.</p>`, 'Job rules':`<h3>Post legitimate opportunities</h3><p>Clearly identify the hirer, work, location, arrangement and requirements. Describe pay honestly when provided; do not invent ranges or misleading income claims. No recruitment-fee scams, unlawful discrimination, illegal work, unpaid deceptive trials or requests for sensitive personal information in public listings.</p><h3>Applications</h3><p>Use applicants’ information only to evaluate the advertised opportunity. Keep communication professional. Close or mark a role filled when hiring ends. Status changes should reflect real decisions.</p><h3>Sensitive services</h3><p>Household, childcare and caregiving listings require an operational identity-review process before participation and are currently blocked.</p>`};
async function action(a,v){if(a==='close')return closeModal();if(a==='countries')return modal('Choose your country',`<label for="country-search">Search countries</label><input id="country-search" type="search" placeholder="Search by country name" autocomplete="off"><div class="country-options">${countries.map(({name,flag})=>act('countrychoose',flag+' '+esc(name),'country-option',name)).join('')}</div>`);
if(a==='countrychoose'){const field=$('#country');if(field){field.value=v;field.dispatchEvent(new Event('input',{bubbles:true}));}return closeModal();}
if(a==='policy')return modal(v,policies[v]);if(a==='screen'){state.screen=v;return render()}if(a==='demo'){state.demo=true;state.screen='onboarding';state.onboard=0;state.user={id:id()};return render()}if(a==='exitdemo'||a==='logout'){if(token)try{await request('/auth/v1/logout',{method:'POST'})}catch{}token=null;location.reload();return}if(a==='role'){state.draft.role=v;return render()}if(a==='obback'){captureOnboard();state.onboard--;return render()}if(a==='nav'){const changed=state.route!==v;state.route=v;render();if(changed)animateEntrance($('.content'),4,170);return}if(a==='feedtab'){state.feedTab=v;return render()}if(a==='create')return modal('Create',`<div class="stack">${act('post','Take a picture','choice','camera')}${act('post','Choose photos','choice','photos')}${act('post','Write a text post','choice')}${act('newjob','Post a job, project or local gig','choice')}</div>`);
if(a==='post'){
  const photos=v==='camera'||v==='photos';
  return modal(photos?'Create a photo post':'Write a post',`<form id="postform">
    ${photos?(state.demo?`<label for="postphotos">${v==='camera'?'Open camera':'Choose up to 10 photos'}</label><input id="postphotos" type="file" accept="image/*" ${v==='camera'?'capture="environment"':'multiple'} required><p class="muted">Photos stay in this preview session.</p>`:'<p class="notice">Photo posting is available in browser preview while shared photo storage is being built.</p>'):''}
    <label for="body">${photos?'Caption':'Your update'}</label><textarea id="body" name="body" maxlength="5000" ${photos?'':'required'}></textarea>
    <p class="error" role="alert"></p><button class="btn wide" ${photos&&!state.demo?'disabled':''}>Publish post</button></form>`);
}
if(a==='editprofile')return editProfile();if(a==='newjob')return jobForm();if(a==='saved'){state.onlySaved=!state.onlySaved;return render()}if(a==='filters')return modal('Find the right fit.',`<form id="filterform">${select('category','Category',['',...categories],state.filter.category)}${select('type','Opportunity type',['','Full-time','Part-time','Contract','Temporary','Internship','Freelance','Local gig'],state.filter.type)}${select('arrangement','Arrangement',['','On-site','Hybrid','Remote'],state.filter.arrangement)}<button class="btn wide" style="margin-top:20px">Apply filters</button></form>`);
if(a==='savejob'){const on=state.saved.includes(v);await mutate('saved_jobs','?user_id=eq.'+state.user.id+'&job_id=eq.'+v,on?'DELETE':'POST',on?undefined:{user_id:state.user.id,job_id:v});state.saved=on?state.saved.filter(x=>x!==v):[...state.saved,v];render();return toast(on?'Removed from saved jobs':'Job saved')}
if(a==='like'){const on=state.liked.includes(v);await mutate('post_likes','?user_id=eq.'+state.user.id+'&post_id=eq.'+v,on?'DELETE':'POST',on?undefined:{user_id:state.user.id,post_id:v});state.liked=on?state.liked.filter(x=>x!==v):[...state.liked,v];return render()}
if(a==='share'){const text=state.posts.find(p=>p.id===v)?.body||'Find work and hire talent on Afriwork.';if(navigator.share)try{await navigator.share({title:'Afriwork',text});return}catch(e){if(e.name==='AbortError')return}return modal('Share this update',`<p class="detail">${esc(text)}</p><small>Copy the text above to share it.</small>`)}
if(a==='comments'){const cs=state.demo?(state.comments||[]).filter(c=>c.post_id===v):await db('comments','?post_id=eq.'+v+'&order=created_at.asc');return modal('Conversation',`${(cs||[]).map(c=>`<div class="list-item"><strong>${esc(c.author_name)}</strong><p class="detail">${esc(c.body)}</p></div>`).join('')||'<p class="muted">No comments yet.</p>'}<form id="commentform" data-id="${v}"><label for="comment">Add a comment</label><textarea name="body" id="comment" required maxlength="2000"></textarea><p class="error" role="alert"></p><button class="btn wide">Comment</button></form>`)}
if(a==='delpost')return modal('Delete this post?',`<p>This removes the post and its comments.</p>${act('confirmdelpost','Delete post','btn',v)}`);
if(a==='confirmdelpost'){await mutate('posts','?id=eq.'+v,'DELETE');state.posts.find(p=>p.id===v)?.photos?.forEach(url=>URL.revokeObjectURL(url));state.posts=state.posts.filter(p=>p.id!==v);closeModal();return render()}
if(a==='jobdetail'){const j=state.jobs.find(j=>j.id===v),applied=state.applications.some(a=>a.job_id===v&&a.applicant_id===state.user.id&&a.status!=='Withdrawn');return modal(esc(j.title),`<p>${esc(j.company_name)} · ${esc(j.city)}, ${esc(j.country)}</p><span class="pill">${esc(j.type)}</span> <span class="pill">${esc(j.arrangement)}</span><div class="detail">${esc(j.description)}</div><p>${esc(j.salary||'Compensation negotiable')}</p>${applied?'<div class="notice">You have already applied.</div>':j.owner_id===state.user.id?'<div class="notice">This is your own listing.</div>':act('apply','Apply now','btn wide',v)}${act('report','Report opportunity','link','job:'+v)}`)}
if(a==='apply')return modal('Apply for this opportunity',`<form id="applyform" data-id="${v}"><p>Your name, headline and skills from your profile will be shared with the hirer. CV uploads are not enabled yet.</p><label for="cover">Cover note (optional)</label><textarea name="cover_note" id="cover" maxlength="5000"></textarea><p class="error" role="alert"></p><button class="btn wide">Submit application</button></form>`);
if(a==='withdraw'){await mutate('applications','?id=eq.'+v,'PATCH',{status:'Withdrawn'});state.applications.find(x=>x.id===v).status='Withdrawn';render();return toast('Application withdrawn')}
if(a==='manage'){const j=state.jobs.find(j=>j.id===v);const apps=state.demo?state.applications.filter(a=>a.job_id===v):await db('applications','?job_id=eq.'+v+'&order=created_at.desc');return modal(esc(j.title),`<div class="row" style="flex-wrap:wrap">${act('editjob','Edit','btn outline small',v)}${j.status==='Open'?act('filljob','Mark filled','btn small',v):''}${act('deletejob','Delete','link',v)}</div><h3>Applicants · ${(apps||[]).length}</h3>${(apps||[]).map(ap=>`<div class="list-item"><strong>${esc(ap.applicant_name)}</strong><p>${esc(ap.cover_note||'No cover note.')}</p><form id="status-${ap.id}" class="statusform" data-id="${ap.id}">${select('status','Application status',['Pending','Viewed','Shortlisted','Interview','Not Selected','Closed','Withdrawn'],ap.status)}<button class="btn small" style="margin-top:10px">Update status</button></form>${act('startchat','Message candidate →','link',ap.id)}</div>`).join('')||'<p class="muted">No applications yet.</p>'}`)}
if(a==='editjob')return jobForm(state.jobs.find(j=>j.id===v));if(a==='filljob'){await mutate('jobs','?id=eq.'+v,'PATCH',{status:'Filled'});state.jobs.find(j=>j.id===v).status='Filled';closeModal();render();return toast('Listing marked filled. Existing application statuses are preserved.')}
if(a==='deletejob')return modal('Delete this listing?',`<p>This will also remove its applications and hiring conversations. Close or fill the job instead if you need to keep its records.</p>${act('confirmdeljob','Delete listing','btn',v)}`);
if(a==='confirmdeljob'){await mutate('jobs','?id=eq.'+v,'DELETE');state.jobs=state.jobs.filter(j=>j.id!==v);state.applications=state.applications.filter(j=>j.job_id!==v);closeModal();return render()}
if(a==='report')return modal('Report a concern',`<form id="reportform" data-target="${esc(v)}">${select('reason','Reason',['Suspected scam','Impersonation','Misleading information','Abuse or discrimination','Copyright concern','Other'],'Suspected scam')}<label for="details">Details (optional)</label><textarea id="details" name="details" maxlength="3000"></textarea><p class="error" role="alert"></p><button class="btn wide">${state.demo?'Save preview report':'Submit report'}</button></form>`);
if(a==='setting'){if(v==='Verification')return modal('Identity verification',`<p>Your identity has not been confirmed.</p><div class="notice">Secure identity review is not operational. ID uploads are disabled. You can use ordinary jobs and profiles without uploading identity documents.</div>`);if(v==='Premium')return modal('Afriwork Premium',`<p>Premium is planned. Pricing and billing have not been finalized. There is no checkout in this build.</p><p>Planned featured links: one free, up to three Premium. An Orange Africa Tick also requires actual identity/business confirmation, a complete profile and Afriwork approval.</p>`);if(v==='Security')return modal('Account security',`<p>${state.demo?'Preview mode has no real login or password.':'Passwords are handled by Supabase Auth. Log out and use “Forgot your password?” for recovery.'}</p><p>Additional sign-in methods and two-factor setup are not enabled in this build.</p>`);if(v==='Support')return modal('Support and appeals',`<p>Use this form to record a support request or appeal. Operator contact information and the support review workflow must be finalized before launch.</p>${act('report','Open support / appeal form','btn','support:account')}`);return modal('Privacy & data',`<p>Age is private. Your profile and posts are visible to signed-in members. Applications and messages are restricted to the relevant participants.</p><div class="stack">${act('datarequest','Request data export','btn outline','export')}${act('datarequest','Request account deletion','btn outline','deletion')}</div><p class="muted">Requests require operator review; they do not instantly delete records.</p>`)}
if(a==='datarequest')return modal(v==='deletion'?'Request account deletion?':'Request a data export?',`<p>${state.demo?'This will only demonstrate the request in this browser session.':'The request will be recorded for the operator to process. It is not automatic fulfillment.'}</p>${act('confirmdata','Submit request','btn',v)}`);
if(a==='confirmdata'){if(state.demo)(state.dataRequests||=[]).push({kind:v,created_at:new Date().toISOString()});await mutate('data_requests','','POST',{user_id:state.user.id,kind:v});closeModal();return toast(state.demo?'Preview request recorded for this session only.':'Request received for operator review.')}
if(a==='startchat'){const ap=state.applications.find(x=>x.id===v)||(!state.demo?(await db('applications','?id=eq.'+v))[0]:null),j=state.jobs.find(j=>j.id===ap.job_id);let c=state.conversations.find(c=>c.application_id===v);if(!c){c={id:id(),application_id:v,job_id:j.id,hirer_id:j.owner_id,applicant_id:ap.applicant_id,created_at:new Date().toISOString()};if(!state.demo)c=(await db('conversations','','POST',c))[0];state.conversations.push(c)}return action('thread',c.id)}
if(a==='thread'){const ms=state.demo?state.messages.filter(m=>m.conversation_id===v):await db('messages','?conversation_id=eq.'+v+'&order=created_at.asc&limit=100');return modal('Hiring conversation',`${(ms||[]).map(m=>`<div class="message ${m.sender_id===state.user.id?'me':''}">${esc(m.body)}</div>`).join('')||'<p class="muted">No messages yet.</p>'}${act('block','Block / unblock this contact','link',v)}<form id="messageform" data-id="${v}"><label for="message">Message</label><textarea id="message" name="body" required maxlength="3000"></textarea><p class="error" role="alert"></p><button class="btn wide">Send message</button></form>`)}
if(a==='block'){if(state.demo)return toast('No other real accounts exist in this preview.');const c=state.conversations.find(c=>c.id===v),other=c.hirer_id===state.user.id?c.applicant_id:c.hirer_id;const rows=await db('blocks','?blocker_id=eq.'+state.user.id+'&blocked_id=eq.'+other);await db('blocks',rows.length?'?blocker_id=eq.'+state.user.id+'&blocked_id=eq.'+other:'',rows.length?'DELETE':'POST',rows.length?undefined:{blocker_id:state.user.id,blocked_id:other});return toast(rows.length?'Contact unblocked.':'Contact blocked. Messages between you are disabled.')}
}
function captureOnboard(){for(const el of $$('#onboardform input,#onboardform select'))state.draft[el.name]=el.value}
async function submit(form){const fd=new FormData(form),d=Object.fromEntries(fd),kind=form.dataset.kind;let rerender=true;
if(form.id==='authform'){if(!connected)throw new Error('Connect Supabase first or use the browser preview.');if(kind==='signup'){if(d.terms!=='on'||d.privacy!=='on')throw new Error('Accept the Terms and acknowledge the Privacy Policy first.');const age=Number(d.age);if(!/^\d+$/.test(d.age)||age<18||age>120)throw new Error('Enter a whole-number age from 18 to 120. Afriwork currently accepts adults only.');const r=await request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email:d.email,password:d.password,data:{age,terms_version:'draft-2026-11-02',privacy_version:'draft-2026-11-02',terms_accepted:d.terms==='on',privacy_acknowledged:d.privacy==='on'}})});if(!r.access_token){modal('Check your inbox',`<p>Open the email confirmation link, then return here to log in. Check your spam folder if needed.</p>`);return}token=r.access_token;state.user=r.user}else if(kind==='login'){const r=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:d.email,password:d.password})});token=r.access_token;state.user=r.user}else if(kind==='reset'){await request('/auth/v1/recover',{method:'POST',body:JSON.stringify({email:d.email})});toast('If the address is registered, a recovery email will arrive.');return}else if(kind==='recover'){await request('/auth/v1/user',{method:'PUT',body:JSON.stringify({password:d.password})});toast('Password updated.');state.screen='login';token=null;return render()}
const p=(await db('profiles','?id=eq.'+state.user.id))[0];state.profile=p;if(p?.onboarding_complete){state.screen='app';await load()}else{state.draft={...state.draft,...p,skills:p?.skills?.join(', ')||''};state.screen='onboarding'}render();return}
if(form.id==='onboardform'){captureOnboard();if(state.onboard<4){state.onboard++;return render()}const p={...state.draft,id:state.user.id,onboarding_complete:true,skills:(state.draft.skills||'').split(',').map(x=>x.trim()).filter(Boolean)};delete p.identity_confirmed;delete p.premium;delete p.created_at;if(!state.demo)await db('profiles','?id=eq.'+state.user.id,'PATCH',p);state.profile=p;state.screen='app';await refresh();return}
if(form.id==='searchform'||form.id==='jobsearch'){state.query=d.query.trim();state.route='jobs'}else if(form.id==='filterform'){state.filter=d;closeModal()}else if(form.id==='postform'){const p={id:id(),author_id:state.user.id,author_name:state.profile.full_name,is_company:state.profile.hirer_type==='company'&&state.profile.role==='Hire Talent',body:d.body.trim(),created_at:new Date().toISOString()};const files=Array.from(form.querySelector?.('#postphotos')?.files||[]);
if(files.length>10||files.some(file=>!file.type.startsWith('image/')||file.size>10*1024*1024))throw new Error('Choose up to 10 images, each under 10 MB.');
if(files.length&&state.demo)p.photos=files.map(file=>URL.createObjectURL(file));
if(!p.body&&!p.photos?.length)throw new Error('Write something or add a photo.');await mutate('posts','','POST',p);state.posts.unshift(p);state.route='feed';state.feedTab='For You';closeModal();toast(state.demo?'Post added to this preview session.':'Post published.')}else if(form.id==='profileform'){if(d.website&&safeURL(d.website)==='#')throw new Error('Use a valid https:// or http:// link.');const patch={...d};if(typeof d.skills==='string')patch.skills=d.skills.split(',').map(x=>x.trim()).filter(Boolean);await mutate('profiles','?id=eq.'+state.user.id,'PATCH',patch);Object.assign(state.profile,patch);closeModal();toast('Profile updated.')}else if(form.id==='jobform'){if(sensitive.includes(d.category))throw new Error('This category requires identity review, which is not available yet.');if(d.description.trim().length<30)throw new Error('Add a description of at least 30 characters.');delete d.rules;const j={...d,status:'Open'};if(form.dataset.id){delete j.status;await mutate('jobs','?id=eq.'+form.dataset.id,'PATCH',j);Object.assign(state.jobs.find(j=>j.id===form.dataset.id),j)}else{Object.assign(j,{id:id(),owner_id:state.user.id,created_at:new Date().toISOString()});await mutate('jobs','','POST',j);state.jobs.unshift(j)}closeModal();state.route='hire';toast(state.demo?'Opportunity saved in this preview only.':'Opportunity saved.')}else if(form.id==='applyform'){const j=state.jobs.find(j=>j.id===form.dataset.id);if(j.owner_id===state.user.id)throw new Error('You cannot apply to your own job.');if(j.status!=='Open')throw new Error('This opportunity is closed.');if(state.applications.some(a=>a.job_id===j.id&&a.applicant_id===state.user.id))throw new Error('You have already applied to this opportunity.');const ap={id:id(),job_id:j.id,applicant_id:state.user.id,applicant_name:state.profile.full_name,cover_note:d.cover_note.trim(),status:'Pending',created_at:new Date().toISOString()};await mutate('applications','','POST',ap);state.applications.unshift(ap);closeModal();toast('Application submitted.')}else if(form.id==='commentform'){const c={id:id(),post_id:form.dataset.id,author_id:state.user.id,author_name:state.profile.full_name,body:d.body.trim(),created_at:new Date().toISOString()};if(!c.body)throw new Error('Write a comment first.');await mutate('comments','','POST',c);(state.comments||=[]).push(c);return action('comments',c.post_id)}else if(form.id==='reportform'){await mutate('reports','','POST',{reporter_id:state.user.id,target:form.dataset.target,reason:d.reason,details:d.details});closeModal();toast(state.demo?'Report demonstrated. No moderation team was contacted.':'Report received for review.')}else if(form.classList.contains('statusform')){await mutate('applications','?id=eq.'+form.dataset.id,'PATCH',{status:d.status});const ap=state.applications.find(a=>a.id===form.dataset.id);if(ap)ap.status=d.status;toast('Application status updated.');rerender=false}else if(form.id==='messageform'){const m={id:id(),conversation_id:form.dataset.id,sender_id:state.user.id,body:d.body.trim(),created_at:new Date().toISOString()};if(!m.body)throw new Error('Write a message first.');await mutate('messages','','POST',m);state.messages.push(m);return action('thread',m.conversation_id)}if(rerender)render()}
// Mobile navigation is based on document scroll, not the rendered feed's scroll position.
let mobileLastY=window.scrollY, mobileDistance=0, mobileDirection=0;
window.addEventListener('scroll',()=>{
  if(state.screen!=='app'||window.innerWidth>760||$('#modal').open)return;
  const y=Math.max(0,window.scrollY), diff=y-mobileLastY;
  mobileLastY=y;
  if(y<55){document.body.classList.remove('nav-collapsed');mobileDistance=0;return;}
  if(Math.abs(diff)<1)return;
  const dir=Math.sign(diff);
  if(dir!==mobileDirection){mobileDirection=dir;mobileDistance=0;}
  mobileDistance+=Math.abs(diff);
  if(mobileDistance>=12){
    document.body.classList.toggle('nav-collapsed',dir>0);
    mobileDistance=0;
  }
},{passive:true});

// iOS Safari fallback: react to vertical finger movement even when scroll events are delayed.
let mobileTouchY=null, mobileTouchX=null, mobileTouchDirection=0;
document.addEventListener('touchstart',e=>{
  if(e.touches.length!==1){mobileTouchY=null;return;}
  mobileTouchY=e.touches[0].clientY;
  mobileTouchX=e.touches[0].clientX;
  mobileTouchDirection=0;
},{passive:true});
document.addEventListener('touchmove',e=>{
  if(mobileTouchY===null||state.screen!=='app'||innerWidth>760||$('#modal').open)return;
  if(e.touches.length!==1)return;
  const y=e.touches[0].clientY,x=e.touches[0].clientX;
  const dy=y-mobileTouchY,dx=x-mobileTouchX;
  if(Math.abs(dx)>Math.abs(dy)*1.2)return;
  if(Math.abs(dy)<16)return;
  if(window.scrollY>55){
    const dir=Math.sign(dy);
    if(dir!==mobileTouchDirection){
      document.body.classList.toggle('nav-collapsed',dir<0);
      mobileTouchDirection=dir;
    }
  }else document.body.classList.remove('nav-collapsed');
  mobileTouchY=y;mobileTouchX=x;
},{passive:true});
document.addEventListener('touchend',()=>{mobileTouchY=null;},{passive:true});
document.addEventListener('touchcancel',()=>{mobileTouchY=null;},{passive:true});

// Gesture ownership: post galleries always own horizontal drags.
// Outside galleries, horizontal swipes switch feed categories without hijacking vertical scroll.
let feedGesture=null;
document.addEventListener('touchstart',e=>{
  if(state.screen!=='app'||state.route!=='feed'||e.touches.length!==1||!e.target.closest('.content')){feedGesture=null;return;}
  const t=e.touches[0];
  feedGesture={x:t.clientX,y:t.clientY,locked:null,
    blocked:!!e.target.closest('.post-photos,button,a,input,textarea,select,.top-tabs,[role="dialog"]')};
},{passive:true});
document.addEventListener('touchmove',e=>{
  if(!feedGesture||feedGesture.blocked||e.touches.length!==1)return;
  const t=e.touches[0],dx=t.clientX-feedGesture.x,dy=t.clientY-feedGesture.y;
  if(!feedGesture.locked&&Math.hypot(dx,dy)>12)
    feedGesture.locked=Math.abs(dx)>Math.abs(dy)*1.35?'horizontal':'vertical';
  if(feedGesture.locked==='horizontal'&&e.cancelable)e.preventDefault();
},{passive:false});
document.addEventListener('touchcancel',()=>{feedGesture=null;},{passive:true});
document.addEventListener('touchend',e=>{
  const g=feedGesture;feedGesture=null;
  if(!g||g.blocked||g.locked!=='horizontal'||!e.changedTouches.length||state.route!=='feed'||$('#modal').open)return;
  const dx=e.changedTouches[0].clientX-g.x;
  if(Math.abs(dx)<55)return;
  const tabs=['For You','Following','Companies'],next=tabs.indexOf(state.feedTab)+(dx<0?1:-1);
  if(next<0||next>=tabs.length)return;
  state.feedTab=tabs[next];render();
},{passive:true});
document.addEventListener('pointerdown', () => { pointerMotion = true; });
document.addEventListener('keydown', () => { pointerMotion = false; });
$('#modal').addEventListener('cancel', event => {
  event.preventDefault();
  closeModal();
});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b)return;e.preventDefault();if(b.disabled)return;b.disabled=true;try{await action(b.dataset.action,b.dataset.value)}catch(err){toast(errorMessage(err))}finally{b.disabled=false}});
document.addEventListener('input', event => {
  if(event.target.id!=='country-search')return;
  const query=event.target.value.trim().toLocaleLowerCase();
  document.querySelectorAll('.country-options .country-option').forEach(button=>{
    button.hidden=!button.textContent.toLocaleLowerCase().includes(query);
  });
});
document.addEventListener('change', event => {
  const picker = event.target;
  if (!picker.matches('[data-country-picker]') || !picker.value) return;
  picker.closest('.country-field').querySelector('input').value = picker.value;
  picker.value = '';
});
document.addEventListener('submit',async e=>{e.preventDefault();const f=e.target,button=f.querySelector('button:not([data-action])'),err=f.querySelector('.error');if(f.dataset.pending)return;f.dataset.pending='true';if(button)button.disabled=true;if(err)err.textContent='';try{await submit(f)}catch(ex){if(err)err.textContent=errorMessage(ex);else toast(errorMessage(ex))}finally{delete f.dataset.pending;if(button)button.disabled=false}});
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal()}});
// Sessions intentionally live in memory; no passwords, age or personal data in browser storage.
const hash=new URLSearchParams(location.hash.slice(1));if(connected&&hash.get('type')==='recovery'&&hash.get('access_token')){token=hash.get('access_token');state.screen='recover';history.replaceState(null,'',location.pathname)}render();
