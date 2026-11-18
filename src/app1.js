/* ===== App core ===== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const money=n=>'£'+Number(n).toLocaleString('en-GB');
const DEF={role:'visitor',user:null,plan:null,key:null,unlocked:false,credits:0,freeUsed:false,
 draft:{step:1,name:'',type:'diwali',date:'',guests:100,budget:1500,venueName:'',venueCity:'London',photos:[],primary:0,prefs:[],prompt:'',keep:'',inspo:'',vendorInspo:''},
 events:[],cur:null,designs:[],quotes:[],bookings:[],payouts:[],disputes:[],notes:[],flags:{},sel:[],vAct:'v1',
 pend:{},leadSt:{},dispSt:{},payoutSt:{},avail:{},cmp:[],ids:{q:0,b:0,d:0,e:0,g:0},vf:{q:'',cat:'',city:''},gf:{c:'all'},sub:{stage:'plans',plan:'premium'}};
let S;try{S=Object.assign(clone(DEF),JSON.parse(localStorage.getItem('ecdemo')||'{}'))}catch(e){S=clone(DEF)}
const MEM={imgs:{}};
function save(){try{localStorage.setItem('ecdemo',JSON.stringify(S))}catch(e){}}
function toast(m){const t=document.createElement('div');t.textContent=m;$('#toast').appendChild(t);setTimeout(()=>t.remove(),3400)}
function openModal(html,wide){$('#modal').innerHTML='<div class="mback" data-act="mback"><div class="mbox'+(wide?' wide':'')+'"><button class="mx" data-act="closeModal" aria-label="Close">&times;</button>'+html+'</div></div>';paintAll($('#modal'))}
function closeModal(){$('#modal').innerHTML=''}
function notify(text){S.notes.unshift({t:Date.now(),text,read:false});save();header()}
function flag(k){if(!S.flags[k]){S.flags[k]=1;save();guide()}}
function go(p){if(location.hash==='#'+p)render();else location.hash='#'+p}
const iso=d=>d.toISOString().slice(0,10);
function inDays(n){const d=new Date();d.setDate(d.getDate()+n);return iso(d)}
const niceDate=s=>s?new Date(s+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'';
const vend=id=>VENDORS.find(v=>v.id===id);
const cult=id=>CULTURES[id];
function initials(n){return n.split(/[ &]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()}

/* ----- demo bar, header, guide ----- */
function demobar(){
  $('#demobar').innerHTML='<div class="in"><span class="tagd">DEMO</span><span>Dummy data only. Nothing here is real, and nothing leaves your browser.</span><div class="roles">'+
  ['visitor','customer','vendor','admin'].map(r=>'<button class="'+(S.role===r?'on':'')+'" data-act="role" data-r="'+r+'">'+r[0].toUpperCase()+r.slice(1)+'</button>').join('')+
  '<button data-act="reset">Reset demo</button></div></div>';
}
function header(){
  const path=location.hash.slice(1)||'/',r=S.role;
  const on=p=>(p==='/'?path==='/':path===p||path.startsWith(p+'/'))?'on':'';
  let nav=[],right='';
  if(r==='visitor'){nav=[['/','Home'],['/how','How it works'],['/explore','Explore designs'],['/vendors','Find vendors'],['/pricing','Pricing'],['/for-vendors','For vendors'],['/about','About'],['/faq','FAQ']];
    right='<a class="btn sm" href="#/login">Log in</a><a class="btn sm p" href="#/signup">Get started</a>'}
  else if(r==='customer'){nav=[['/dashboard','Dashboard'],['/create','Create design'],['/events','My events'],['/vendors','Vendors'],['/quotes','Quotes'],['/bookings','Bookings']];
    const un=S.notes.filter(n=>!n.read).length;
    right='<a class="btn sm" href="#/notifications" title="Notifications">Alerts'+(un?' <span class="badge draft">'+un+'</span>':'')+'</a><a class="btn sm" href="#/profile">'+esc(S.user?S.user.name.split(' ')[0]:'Profile')+'</a>'}
  else if(r==='vendor'){nav=[['/v','Dashboard'],['/v/leads','Leads and quotes'],['/v/bookings','Bookings'],['/v/availability','Availability'],['/v/earnings','Earnings']];right='<span class="badge">Acting as '+esc(vend(S.vAct).name)+'</span>'}
  else{nav=[['/a','Admin panel']];right='<span class="badge">Super admin</span>'}
  $('#hdr').innerHTML='<div class="in"><a class="logo" href="#/'+(r==='visitor'?'':r==='customer'?'dashboard':r==='vendor'?'v':'a')+'">EventCulture AI</a><nav class="nav">'+nav.map(n=>'<a class="'+on(n[0])+'" href="#'+n[0]+'">'+n[1]+'</a>').join('')+'</nav><div class="hr">'+right+'</div></div>';
}
const GUIDE=[['upload','Pick or upload a venue photo','/create'],['gen','Generate four designs','/create'],['paywall','See the vendor paywall','/results'],['key','Subscribe and get your key','/results'],['quote','Request a vendor quote','/results'],['book','Negotiate, book and pay','/quotes'],['payout','Complete the job, then approve the payout as Admin','/bookings']];
let guideOpen=false;
function guide(){
  const done=GUIDE.filter(g=>S.flags[g[0]]).length;
  $('#guide').innerHTML=(guideOpen?'<div class="pn"><b>Demo walkthrough</b><div class="small muted">Follow these steps to see the whole product.</div><ol>'+GUIDE.map((g,i)=>'<li class="'+(S.flags[g[0]]?'done':'')+'" data-act="gstep" data-p="'+g[2]+'" data-k="'+g[0]+'"><i>'+(S.flags[g[0]]?'&#10003;':i+1)+'</i><span>'+g[1]+'</span></li>').join('')+'</ol></div>':'')+
  '<button class="tg" data-act="gtoggle">Walkthrough '+done+'/'+GUIDE.length+'</button>';
}

/* ----- router ----- */
const VIEWS={};
function render(){
  const p=location.hash.slice(1)||'/',parts=p.split('/').filter(Boolean),key='/'+(parts[0]||'');
  let html;
  try{html=(VIEWS[key]||notFound)(parts)}catch(err){console.error(err);html='<div class="wrap sec"><h2>Something broke in the demo</h2><pre class="small">'+esc(err.stack||err)+'</pre></div>'}
  $('#app').innerHTML=html;demobar();header();guide();paintAll($('#app'));
}
window.addEventListener('hashchange',()=>{closeModal();render();window.scrollTo(0,0)});

/* ----- canvas painting ----- */
function srcOf(ref){
  if(!ref)return{kind:'sample',id:'hall'};
  if(ref.kind==='sample')return ref;
  const img=MEM.imgs[ref.key];return img?{kind:'img',img}:{kind:'sample',id:'hall'};
}
function paintAll(root){
  $$('canvas[data-paint]',root).forEach(cv=>{
    const a=cv.dataset.paint.split(':');
    try{
      if(a[0]==='sample')paintBase(cv,{kind:'sample',id:a[1]});
      else if(a[0]==='gal')paintDesign(cv,{kind:'sample',id:a[2]},a[1],a[3],+a[4]||7);
      else if(a[0]==='design'){const d=S.designs.find(x=>x.id===a[1]);if(d)paintDesign(cv,srcOf(d.src),d.culture,d.variant,d.seed)}
      else if(a[0]==='orig'){const d=S.designs.find(x=>x.id===a[1]);if(d)paintBase(cv,srcOf(d.src))}
      else if(a[0]==='photo'){const p=S.draft.photos[+a[1]];paintBase(cv,srcOf(p))}
    }catch(e){console.error(e)}
  });
}

/* ----- shared page pieces ----- */
function footer(){
  return '<footer><div class="wrap"><div class="grid g4"><div><div class="logo" style="color:#fff">EventCulture AI</div><p class="small" style="opacity:.7;margin-top:10px">Culturally accurate decor concepts for your actual venue, with vendors who can deliver them.</p></div>'+
  '<div><div class="mono" style="color:var(--lilac)">Platform</div><a href="#/how">How it works</a><a href="#/explore">Explore designs</a><a href="#/vendors">Find vendors</a><a href="#/pricing">Pricing</a></div>'+
  '<div><div class="mono" style="color:var(--lilac)">Company</div><a href="#/about">About us</a><a href="#/for-vendors">For vendors</a><a href="#/faq">FAQ</a><a href="#/contact">Contact us</a></div>'+
  '<div><div class="mono" style="color:var(--lilac)">Legal</div><a href="#/terms">Terms and conditions</a><a href="#/privacy">Privacy policy</a></div></div>'+
  '<p class="small" style="opacity:.6;margin:28px 0 0">&copy; 2026 EventCulture AI. Interactive demo with dummy data.</p></div></footer>';
}
function pageHead(t,s,eyebrow){return '<section class="sec alt" style="padding:48px 0"><div class="wrap">'+(eyebrow?'<div class="mono">'+eyebrow+'</div>':'')+'<h1 style="font-size:clamp(2rem,4.6vw,3.2rem)">'+t+'</h1>'+(s?'<p class="muted" style="max-width:680px;margin:0">'+s+'</p>':'')+'</div></section>'}
function cmpSlider(base,deco){
  return '<div class="cmp"><canvas data-paint="'+base+'"></canvas><canvas class="top" data-paint="'+deco+'"></canvas><div class="hd"></div><span class="lab l1">After</span><span class="lab l2">Your venue</span><input type="range" min="0" max="100" value="50" data-act="slide" aria-label="Compare before and after"></div>';
}
function startCta(label){return S.role==='customer'?'<a class="btn p lg" href="#/create">'+(label||'Start designing')+'</a>':'<a class="btn p lg" href="#/signup">'+(label||'Start designing')+'</a>'}
function faqList(n){return FAQS.slice(0,n||FAQS.length).map(f=>'<details><summary>'+esc(f[0])+'</summary><p>'+esc(f[1])+'</p></details>').join('')}

/* ----- vendor card / matching ----- */
function reasonFor(v,cid){
  const m=v.skills.filter(s=>cult(cid).must.includes(s));
  if(m.length)return 'Matches: '+m.slice(0,2).join(', ');
  return v.cultures.includes(cid)?v.cat+' who work with '+cult(cid).name+' events':v.cat+' in your area';
}
function matchVendors(cid){
  const sc=v=>(v.cultures.includes(cid)?10:0)+v.skills.filter(s=>cult(cid).must.includes(s)).length*3+v.rating;
  const all=VENDORS.slice().sort((a,b)=>sc(b)-sc(a));const out=[],cats={};
  all.forEach(v=>{if(out.length<6&&!cats[v.cat]){out.push(v);cats[v.cat]=1}});
  all.forEach(v=>{if(out.length<6&&!out.includes(v))out.push(v)});
  return out;
}
function vcard(v,o){
  o=o||{};const open=S.unlocked&&S.role==='customer';
  const cid=o.cid;const ev=cid?'<div class="small" style="color:var(--maroon);font-weight:600">'+esc(reasonFor(v,cid))+'</div>':'';
  return '<div class="vcard"><div class="ph" style="background:linear-gradient(135deg,'+v.c[0]+','+v.c[1]+')"><span style="position:absolute;left:14px;bottom:10px;font:400 1.6rem Bricolage Grotesque,sans-serif;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.35)">'+esc(initials(v.name))+'</span><span class="badge" style="position:absolute;right:10px;top:10px">Sample vendor</span></div>'+
  '<div class="bd"><div style="display:flex;justify-content:space-between;gap:8px"><b>'+esc(v.name)+'</b><span class="small">&#9733; '+v.rating+'</span></div><div class="small muted">'+esc(v.cat)+' &middot; '+esc(v.city)+' &middot; '+v.price+'</div>'+ev+'<div class="small muted">'+esc(v.blurb)+'</div>'+
  '<div class="ft"><button class="btn sm" data-act="vprofile" data-id="'+v.id+'">View profile</button>'+
  (o.select&&open?'<label style="display:inline-flex;gap:6px;align-items:center;margin:0;font-weight:500"><input type="checkbox" data-act="vsel" data-id="'+v.id+'" '+(S.sel.includes(v.id)?'checked':'')+'> Select</label>':'')+
  (open?'<button class="btn sm p" data-act="rq" data-id="'+v.id+'">Request quote</button>':'<button class="btn sm b" data-act="paywall">&#128274; Subscribe to contact</button>')+'</div></div></div>';
}

/* ===== PUBLIC VIEWS ===== */
VIEWS['/']=function(){
  return '<section class="hero"><div class="wrap grid"><div><div class="mono">AI venue visualisation + vendor booking</div><h1>See your venue decorated, and <span class="acc">culturally right.</span></h1>'+
  '<p class="muted" style="font-size:1.15rem;max-width:520px">Upload a photo of your actual venue. Get four decor concepts for Diwali, Eid or Lunar New Year, checked against rules written with cultural experts. Then request quotes from vendors who can build it.</p>'+
  '<div style="display:flex;gap:10px;flex-wrap:wrap">'+startCta('Start designing')+'<a class="btn lg" href="#/how">How it works</a></div>'+
  '<p class="small muted" style="margin-top:18px">Drag the slider &rarr; the same banquet hall, before and after.</p></div>'+
  '<div>'+cmpSlider('sample:hall','gal:diwali:hall:classic:11')+'</div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="center"><div class="mono">How it works</div><h2>From a photo to a booked vendor</h2></div><div class="grid g4" style="margin-top:28px">'+
  [['1','Upload your venue','Add photos of the real room. We keep its structure and layout.'],['2','Describe your event','Choose the culture, style, guests and budget.'],['3','Pick a design','Four concepts, each checked against the culture card.'],['4','Book vendors','Request quotes, negotiate, book and pay in one place.']].map(s=>'<div class="card"><div class="mono">Step '+s[0]+'</div><h3>'+s[1]+'</h3><p class="muted small" style="margin:0">'+s[2]+'</p></div>').join('')+'</div></div></section>'+
  '<section class="sec alt"><div class="wrap grid g2" style="align-items:center;gap:40px"><div><div class="mono">Cultural accuracy</div><h2>Rules written down, checked every time</h2><p class="muted">Every culture has a card of must-include items and must-avoid mistakes. The AI follows it, a second step checks the result, and anything that fails is labelled &ldquo;needs review&rdquo;.</p><a class="btn" href="#/explore">See example designs</a></div>'+
  '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><b>Diwali culture card</b><span class="badge draft">Draft rules v0.3, pending expert sign-off</span></div><ul class="checklist" style="margin-top:12px">'+CULTURES.diwali.must.map(m=>'<li><span class="tick">&#10003;</span>'+esc(m)+'</li>').join('')+'</ul><div class="small muted" style="margin-top:8px">Must avoid: '+CULTURES.diwali.avoid.map(esc).join(' &middot; ')+'</div></div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="center"><div class="mono">Event types</div><h2>Built for cultural celebrations</h2></div><div class="grid g4" style="margin-top:26px">'+
  Object.values(CULTURES).map(c=>'<div class="tile" data-act="tryculture" data-c="'+c.id+'"><canvas class="art" data-paint="gal:'+c.id+':'+(c.id==='eid'?'garden':c.id==='lny'?'restaurant':'hall')+':classic:'+(c.id==='eid'?21:c.id==='lny'?31:11)+'" style="border-radius:0"></canvas><div class="cap"><span>'+c.name+'</span><span class="muted small">Try it</span></div></div>').join('')+
  '<div class="tile" style="opacity:.6;cursor:default"><div style="aspect-ratio:3/2;display:grid;place-items:center;background:var(--mist)" class="muted">Weddings</div><div class="cap"><span>More event types</span><span class="badge">Coming soon</span></div></div></div></div></section>'+
  '<section class="sec dark"><div class="wrap grid g2" style="gap:40px;align-items:center"><div><div class="mono" style="color:var(--lilac)">Vendor booking</div><h2>Quote, negotiate, book, pay</h2><p style="opacity:.8">Send your chosen design to several vendors. Compare quotes, negotiate for up to three rounds, and pay through the platform. Your money is held until the job is done.</p><a class="btn b" href="#/vendors">Browse vendors</a></div>'+
  '<div class="grid g2">'+['Vendor categories','Decorators, florists, lighting, catering, DJs, photography','Verified vendors','Every vendor is approved by our team before going live','Multiple vendors','Book different services for the same event','Held payments','Released to the vendor when the service is complete'].reduce((a,x,i,arr)=>i%2?a:a.concat('<div style="border:1px solid rgba(246,245,239,.25);border-radius:14px;padding:16px"><b>'+x+'</b><div class="small" style="opacity:.75;margin-top:4px">'+arr[i+1]+'</div></div>'),[]).join('')+'</div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="center"><div class="mono">Plans</div><h2>Subscribe to contact vendors</h2><p class="muted">Your first preview is free. A subscription gives you a key that unlocks vendors and credits.</p></div><div class="grid g3" style="margin-top:26px">'+PLANS.map(planCard).join('')+'</div></div></section>'+
  '<section class="sec alt"><div class="wrap" style="max-width:780px"><div class="center"><h2>Questions</h2></div>'+faqList(5)+'<div class="center" style="margin-top:20px"><a class="btn" href="#/faq">All FAQs</a></div></div></section>'+
  '<section class="sec center"><div class="wrap"><h2>See your venue in its best light</h2><p class="muted">Free first preview. No card needed.</p>'+startCta('Create your first design')+'</div></section>'+footer();
};
function planCard(p){
  return '<div class="card plan '+(p.pop?'pop':'')+'">'+(p.pop?'<span class="badge draft" style="position:absolute;top:-12px;right:16px">Most popular</span>':'')+'<h3>'+p.name+'</h3><div class="muted small">'+p.blurb+'</div><div class="pr">'+money(p.price)+'<span class="small muted"> / month</span></div><ul>'+p.feats.map(f=>'<li>'+f+'</li>').join('')+'</ul><button class="btn '+(p.pop?'p':'')+'" style="width:100%;justify-content:center" data-act="choosePlan" data-id="'+p.id+'">Choose '+p.name+'</button></div>';
}
VIEWS['/how']=function(){
  const cj=[['Create an account','Sign up with email or a social account and verify it.'],['Upload your venue photos','Add photos of the real room.'],['Describe your event and decor','Pick the culture, style, preferences and any custom prompt.'],['Review the four designs','Each one is checked against the culture card.'],['Choose a design and share it','Send it to several vendors to get quotations.'],['Negotiate, book and pay','Compare quotes, book the vendors you want and pay through the platform.']];
  const vj=[['Register','Create a business profile and upload your portfolio.'],['Get verified','Our team reviews and approves your application.'],['Receive leads','Customers send you designs with their event requirements.'],['Send quotations','Quote, negotiate for up to three rounds, and win the booking.'],['Deliver the service','Upload completion evidence when the job is done.'],['Request your payout','Receive your earnings, minus the platform commission.']];
  const col=(t,a)=>'<div><h2>'+t+'</h2>'+a.map((s,i)=>'<div class="card" style="margin-bottom:12px"><div class="step"><b>0'+(i+1)+'</b><div><h3 style="margin:0">'+s[0]+'</h3><div class="muted small">'+s[1]+'</div></div></div></div>').join('')+'</div>';
  return pageHead('How EventCulture AI works','Two journeys: the customer planning an event, and the vendor delivering it.','How it works')+'<section class="sec"><div class="wrap grid g2" style="gap:40px">'+col('Customer journey',cj)+col('Vendor journey',vj)+'</div><div class="wrap center" style="margin-top:36px">'+startCta('Start creating a design')+' <a class="btn lg" href="#/vendor-signup">Join as a vendor</a></div></section>'+footer();
};
VIEWS['/explore']=function(){
  const f=S.gf.c;const combos=[];
  Object.keys(CULTURES).forEach((c,i)=>VENUES.forEach((v,j)=>VARIANTS.slice(0,2).forEach((vr,k)=>combos.push({c,v:v.id,vr:vr.key,seed:11+i*10+j*3+k}))));
  const list=combos.filter(x=>f==='all'||x.c===f).slice(0,9);
  return pageHead('Explore designs','Examples of AI-generated concepts on sample venues. Open one to compare it with the original.','Design gallery')+'<section class="sec"><div class="wrap"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px"><span class="chip '+(f==='all'?'on':'')+'" data-act="gfilter" data-c="all">All</span>'+Object.values(CULTURES).map(c=>'<span class="chip '+(f===c.id?'on':'')+'" data-act="gfilter" data-c="'+c.id+'">'+c.name+'</span>').join('')+'</div>'+
  '<div class="grid g3">'+list.map(x=>'<div class="tile" data-act="gopen" data-c="'+x.c+'" data-v="'+x.v+'" data-vr="'+x.vr+'" data-seed="'+x.seed+'"><canvas class="art" data-paint="gal:'+x.c+':'+x.v+':'+x.vr+':'+x.seed+'" style="border-radius:0"></canvas><div class="cap"><span>'+cult(x.c).name+' &middot; '+VENUES.find(v=>v.id===x.v).name+'</span><span class="muted small">'+VARIANTS.find(v=>v.key===x.vr).name+'</span></div></div>').join('')+'</div>'+
  '<p class="center muted small" style="margin-top:26px">Results vary with the venue photo and your preferences.</p><div class="center" style="margin-top:10px">'+startCta('Create my own design')+'</div></div></section>'+footer();
};
VIEWS['/vendors']=function(){
  const cities=[...new Set(VENDORS.map(v=>v.city))];
  return pageHead('Find vendors','Approved vendors for decor, flowers, lighting, catering, music and photography. These are sample vendors for the demo.','Vendor directory')+'<section class="sec"><div class="wrap">'+
  (S.role==='customer'&&!S.unlocked?'<div class="banner"><div class="grow"><b>Subscribe to contact vendors.</b><div class="small">You can browse profiles now. Contacting vendors needs a subscription key.</div></div><button class="btn p sm" data-act="paywall">See plans</button></div>':'')+
  '<div class="row" style="margin-bottom:20px"><div><label>Search</label><input data-vf="q" placeholder="Business name or keyword" value="'+esc(S.vf.q)+'"></div><div><label>Service</label><select data-vf="cat"><option value="">All services</option>'+CATS.map(c=>'<option '+(S.vf.cat===c?'selected':'')+'>'+c+'</option>').join('')+'</select></div><div><label>City</label><select data-vf="city"><option value="">All cities</option>'+cities.map(c=>'<option '+(S.vf.city===c?'selected':'')+'>'+c+'</option>').join('')+'</select></div></div><div id="vlist">'+vlist()+'</div></div></section>'+footer();
};
function vlist(){
  const q=S.vf.q.toLowerCase();const l=VENDORS.filter(v=>(!S.vf.cat||v.cat===S.vf.cat)&&(!S.vf.city||v.city===S.vf.city)&&(!q||(v.name+' '+v.blurb+' '+v.skills.join(' ')).toLowerCase().includes(q)));
  return l.length?'<div class="grid g3">'+l.map(v=>vcard(v)).join('')+'</div>':'<div class="card center muted">No vendors match these filters. Try clearing one.</div>';
}
VIEWS['/pricing']=function(){
  return pageHead('Pricing','Your first design preview is free. Subscribe for credits, vendor contact and refinements. Demo prices only.','Plans')+'<section class="sec"><div class="wrap"><div class="grid g3">'+PLANS.map(planCard).join('')+'</div>'+
  '<div class="grid g2" style="margin-top:34px"><div class="card"><h3>Billing and renewal</h3><p class="muted small" style="margin:0">Plans renew monthly. Your credits reset on renewal. Cancel any time before the next billing date. Applicable taxes are shown at checkout.</p></div><div class="card"><h3>What uses a credit?</h3><p class="muted small" style="margin:0">One generation of four designs, or one refinement of a single design. Vendor requests and downloads do not use credits.</p></div></div>'+
  '<div style="max-width:760px;margin:40px auto 0">'+faqList(4)+'</div></div></section>'+footer();
};
VIEWS['/for-vendors']=function(){
  return pageHead('Grow your business with EventCulture AI','Receive leads that arrive with the customer\'s chosen design, venue photos and requirements.','For vendors')+'<section class="sec"><div class="wrap"><div class="grid g3">'+
  [['Qualified leads','Customers share their AI design and event details with you.'],['Quote and negotiate','Send quotations and negotiate for up to three rounds.'],['Confirmed bookings','Bookings are confirmed through the platform, with payment held.'],['Commission-based','The platform deducts a single commission from successful bookings.'],['Verified profile','Applications are reviewed and approved by our admin team.'],['Clear payouts','Upload completion evidence and request your payout.']].map(c=>'<div class="card"><h3>'+c[0]+'</h3><p class="muted small" style="margin:0">'+c[1]+'</p></div>').join('')+'</div><div class="center" style="margin-top:32px"><a class="btn p lg" href="#/vendor-signup">Join as a vendor</a> <button class="btn lg" data-act="role" data-r="vendor">See the vendor dashboard</button></div></div></section>'+footer();
};
VIEWS['/about']=function(){
  return pageHead('About EventCulture AI','We turn a photo of your venue into culturally accurate decor concepts, and connect you with vendors who can build them.','About us')+'<section class="sec"><div class="wrap grid g2" style="gap:40px"><div><h2>Our mission</h2><p class="muted">Cultural events deserve decor that gets the details right. Generic AI images often miss them. We start from your real venue and a written culture card, so concepts are specific, checkable and buildable.</p><h2 style="margin-top:28px">Venue-specific, not generic</h2><p class="muted">Every design is anchored to the structure and layout of your room.</p></div><div class="card"><h3>The team</h3><p class="muted small">Team and company information will be provided by the client.</p><div class="grid g2">'+['Founder','Cultural lead','Engineering','Vendor partnerships'].map(t=>'<div class="card flat" style="background:var(--mist)"><b>'+t+'</b><div class="small muted">Placeholder</div></div>').join('')+'</div></div></div></section>'+footer();
};
VIEWS['/faq']=function(){return pageHead('Frequently asked questions','Answers about designs, subscriptions, vendors, quotations, payments and bookings.','FAQ')+'<section class="sec"><div class="wrap" style="max-width:800px">'+faqList()+'</div></section>'+footer()};
VIEWS['/contact']=function(){
  return pageHead('Contact us','Send us a message and the team will get back to you.','Contact')+'<section class="sec"><div class="wrap grid g2" style="gap:40px"><form data-form="contact" novalidate><div class="fld"><label>Name *</label><input name="name"></div><div class="fld"><label>Email *</label><input name="email" type="email"></div><div class="fld"><label>Enquiry type</label><select name="type"><option>General</option><option>Customer support</option><option>Vendor enquiry</option><option>Partnerships</option></select></div><div class="fld"><label>Message *</label><textarea name="msg"></textarea></div><div class="err" id="ferr"></div><button class="btn p">Send message</button></form>'+
  '<div class="card"><h3>Get in touch</h3><p class="muted small">hello@eventculture.example<br>+44 20 0000 0000<br>Mon to Fri, 9:00 to 17:30 UK time</p><a class="link" href="#/faq">Read the FAQs first</a></div></div></section>'+footer();
};
const LEGAL=(t,d)=>pageHead(t,'Last updated: '+d+' (demo placeholder)','Legal')+'<section class="sec"><div class="wrap" style="max-width:780px"><p class="muted">This is placeholder text for the demo. The final wording will be supplied by the client and their legal adviser. It will cover customer, vendor, subscription, booking, payment and platform-use terms, and how personal data and uploaded venue photos are handled.</p>'+['Using the platform','Accounts and verification','Subscriptions and credits','Bookings, held payments and payouts','Uploaded content and AI-generated designs','Contact'].map((h,i)=>'<h3 style="margin-top:24px">'+(i+1)+'. '+h+'</h3><p class="muted small">Placeholder section.</p>').join('')+'</div></section>'+footer();
VIEWS['/terms']=()=>LEGAL('Terms and conditions','19 November 2026');
VIEWS['/privacy']=()=>LEGAL('Privacy policy','19 November 2026');
function notFound(){return '<section class="sec center"><div class="wrap"><h2>Page not found</h2><p class="muted">This page isn\'t part of the demo.</p><a class="btn p" href="#/">Back to home</a></div></section>'}

/* ----- auth views (demo) ----- */
VIEWS['/login']=function(){
  return '<section class="sec"><div class="wrap" style="max-width:440px"><h2>Log in</h2><form data-form="login" novalidate><div class="fld"><label>Email</label><input name="email" type="email" value="aisha@example.com"></div><div class="fld"><label>Password</label><input name="pw" type="password" value="demo-password"></div><div class="err" id="ferr"></div><button class="btn p" style="width:100%;justify-content:center">Log in</button></form><p class="small muted" style="margin-top:14px"><a class="link" href="#/signup">Create an account</a> &middot; <button class="link" data-act="forgot">Forgot password?</button></p></div></section>'+footer();
};
VIEWS['/signup']=function(){
  return '<section class="sec"><div class="wrap" style="max-width:520px"><h2>Create your account</h2><form data-form="signup" novalidate><div class="row"><div class="fld"><label>First name *</label><input name="fn" value="Aisha"></div><div class="fld"><label>Last name *</label><input name="ln" value="Khan"></div></div><div class="fld"><label>Email *</label><input name="email" type="email" value="aisha@example.com"></div><div class="fld"><label>UK mobile number *</label><input name="mob" value="07700 900123"></div><div class="row"><div class="fld"><label>Password *</label><input name="pw" type="password" value="demo-password"></div><div class="fld"><label>Confirm password *</label><input name="pw2" type="password" value="demo-password"></div></div><div class="fld"><label style="font-weight:500"><input type="checkbox" name="tc" checked> I accept the <a class="link" href="#/terms">Terms</a> and <a class="link" href="#/privacy">Privacy Policy</a></label></div><div class="err" id="ferr"></div><button class="btn p" style="width:100%;justify-content:center">Create account</button></form><div class="center muted small" style="margin:16px 0 8px">or</div><div class="row"><button class="btn" data-act="social" data-p="Google">Continue with Google</button><button class="btn" data-act="social" data-p="Apple">Continue with Apple</button></div></div></section>'+footer();
};
VIEWS['/verify']=function(){
  return '<section class="sec"><div class="wrap" style="max-width:440px"><h2>Verify your email</h2><p class="muted">We sent a code to <b>'+esc(S.pend.email||'your email')+'</b>. In this demo the code is filled in for you.</p><form data-form="verify"><div class="fld"><label>Verification code</label><input name="code" value="123456"></div><div class="err" id="ferr"></div><button class="btn p" style="width:100%;justify-content:center">Verify and continue</button></form><p class="small muted" style="margin-top:12px"><button class="link" data-act="resend">Resend code</button></p></div></section>'+footer();
};
VIEWS['/vendor-signup']=function(){
  return pageHead('Join as a vendor','Register your business. Our admin team reviews every application before your profile goes live.','Vendor registration')+'<section class="sec"><div class="wrap" style="max-width:640px"><form data-form="vsignup" novalidate><div class="row"><div class="fld"><label>Business name *</label><input name="bn" value="Henna Hub"></div><div class="fld"><label>Service category *</label><select name="cat">'+CATS.map(c=>'<option>'+c+'</option>').join('')+'</select></div></div><div class="row"><div class="fld"><label>Email *</label><input name="email" type="email" value="hello@hennahub.example"></div><div class="fld"><label>City and travel radius</label><input name="city" value="Leicester, 40 miles"></div></div><div class="fld"><label>About your business</label><textarea name="about">Mehndi, entrance decor and floral arches for festival events.</textarea></div><div class="fld"><label>Portfolio images</label><input type="file" multiple accept="image/*"><div class="small muted">Upload is not stored in this demo.</div></div><div class="fld"><label style="font-weight:500"><input type="checkbox" name="tc" checked> I accept the vendor Terms and conditions</label></div><div class="err" id="ferr"></div><button class="btn p lg">Submit application</button></form></div></section>'+footer();
};
