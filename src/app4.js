/* ===== Layout overrides: page structure follows the current live site ===== */
PLANS.length=0;
PLANS.push(
 {id:'premium',name:'Premium',price:9.99,credits:40,blurb:'For one big celebration.',feats:['40 AI generation credits a month','Contact up to 5 vendors per event','Refine and regenerate designs','Vendor-inspired designs','Save and share mood boards'],pop:true},
 {id:'elite',name:'Elite',price:29.99,credits:120,blurb:'When you want a human in the loop.',feats:['120 AI generation credits a month','Everything in Premium','Dedicated human planner','Vendor concierge and negotiation','On-the-day coordination']}
);
S.favV=S.favV||[];
const dvf=()=>({ev:[],cat:[],city:[],rating:0,budget:3000,sort:'match'});S.vf=dvf();DEF.vf=dvf();DEF.favV=[];DEF.heroPick=0;DEF.pend={};

/* ----- header with hamburger, centred nav, user icon ----- */
const ICON_USER='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>';
const ICON_BELL='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></svg>';
const _oldHeader=header;
const AUTH=['/login','/signup','/verify'];
header=function(){
  const path=location.hash.slice(1)||'/',r=S.role,first='/'+(path.split('/').filter(Boolean)[0]||'');
  $('#hdr').style.display=(r==='visitor'&&AUTH.includes(first))?'none':'';
  if(r==='vendor'||r==='admin')return _oldHeader();
  const on=p=>(p==='/'?path==='/':(path===p||path.startsWith(p+'/')))?'on':'';
  const nav=[['/','Home'],['/vendors','Vendors'],['/create','Generate Space']].concat(r==='customer'?[['/dashboard','Dashboard']]:[]);
  const un=S.notes.filter(n=>!n.read).length;
  const right=r==='customer'?'<a class="circ" href="#/notifications" title="Alerts">'+ICON_BELL+(un?'<i class="dot">'+un+'</i>':'')+'</a><a class="circ" href="#/profile" title="Profile">'+esc(S.user?S.user.name[0]:'U')+'</a>':'<a class="small" href="#/login" style="font-weight:800;text-decoration:none">Log in</a><a class="circ" href="#/login" title="Log in">'+ICON_USER+'</a>';
  $('#hdr').innerHTML='<div class="in"><button class="circ" data-act="menu" aria-label="Menu">&#9776;</button><a class="logo" href="#/'+(r==='customer'?'dashboard':'')+'">EventCulture AI</a><nav class="nav">'+nav.map(n=>'<a class="'+on(n[0])+'" href="#'+n[0]+'">'+n[1]+'</a>').join('')+'</nav><div class="hr">'+right+'</div></div>';
};
ACT.menu=()=>openModal('<div class="mono">Menu</div><div class="menu">'+[['/','Home'],['/how','How it works'],['/explore','Explore designs'],['/vendors','Find vendors'],['/create','Generate Space'],['/pricing','Pricing'],['/for-vendors','For vendors'],['/about','About us'],['/faq','FAQs'],['/contact','Contact us'],['/terms','Terms and conditions'],['/privacy','Privacy policy']].map(l=>'<a href="#'+l[0]+'" data-act="closeModal">'+l[1]+'</a>').join('')+'</div>');
ACT.slidepick=el=>{S.heroPick=+el.dataset.i;save();render()};
ACT.enterprise=()=>toast('Thanks. The team will be in touch (demo).');
ACT.vfav=el=>{const id=el.dataset.id;S.favV=S.favV.includes(id)?S.favV.filter(x=>x!==id):S.favV.concat(id);save();render()};

/* ----- footer ----- */
footer=function(){
  const col=(t,l)=>'<div><div class="mono" style="color:var(--lilac)">'+t+'</div>'+l.map(x=>'<a href="#'+x[0]+'">'+x[1]+'</a>').join('')+'</div>';
  return '<footer><div class="wrap"><div class="grid g4" style="grid-template-columns:1.4fr 1fr 1fr 1fr 1fr"><div><div class="logo" style="color:#fff">EventCulture AI</div><p class="small" style="opacity:.7;margin-top:10px">The calm, visual way to design unforgettable celebrations.</p></div>'+
  col('Celebrations',[['/explore','Cultural'],['/explore','Diwali'],['/explore','Eid'],['/explore','Lunar New Year']])+
  col('Platform',[['/how','How it works'],['/vendors','Marketplace'],['/pricing','Pricing'],['/vendor-signup','Vendor Portal']])+
  col('Resources',[['/explore','Design gallery'],['/for-vendors','For vendors'],['/about','About us'],['/faq','FAQs']])+
  col('Support',[['/contact','Contact'],['/privacy','Privacy'],['/terms','Terms']])+
  '</div><p class="small" style="opacity:.6;margin:28px 0 0">&copy; 2026 EventCulture AI &middot; <a style="display:inline" href="#/privacy">Privacy</a> &middot; <a style="display:inline" href="#/terms">Terms</a> &middot; Interactive demo with dummy data</p></div></footer><style>@media(max-width:900px){footer .g4{grid-template-columns:repeat(2,1fr)!important}}</style>';
};

/* ----- plans and pricing ----- */
planCard=function(p){
  return '<div class="card plan '+(p.pop?'pop':'')+'">'+(p.pop?'<span class="badge draft" style="position:absolute;top:-12px;right:16px">Most Popular</span>':'')+'<h3>'+p.name+'</h3><div class="muted small">'+p.blurb+'</div><div class="pr">'+money(p.price)+'<span class="small muted"> /month</span></div><ul>'+p.feats.map(f=>'<li>'+f+'</li>').join('')+'</ul><button class="btn '+(p.pop?'p':'')+'" style="width:100%;justify-content:center" data-act="choosePlan" data-id="'+p.id+'">'+(p.id==='elite'?'Start Elite':'Start Premium')+'</button></div>';
};
function pricingBlock(){
  const free='<div class="card plan"><h3>Free</h3><div class="muted small">Try it on your space.</div><div class="pr">&pound;0<span class="small muted"> /forever</span></div><ul><li>Your first set of four AI concepts</li><li>Upload your own venue photo</li><li>Explore vendor recommendations</li><li>Save one mood board</li><li>Basic event customisation</li></ul><a class="btn" style="width:100%;justify-content:center" href="#/create">Get Started</a></div>';
  return '<div class="grid g3">'+free+PLANS.map(planCard).join('')+'</div><div class="card" style="margin-top:18px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:center;background:var(--lilac)"><div><span class="badge draft">Coming soon &middot; For teams</span><h3 style="margin:8px 0 2px">Planning 50+ events a year? Let\'s talk Enterprise.</h3><div class="small">Custom workspaces, brand controls, dedicated account management and invoicing.</div></div><button class="btn" data-act="enterprise">Request Enterprise Access</button></div>';
}
VIEWS['/pricing']=function(){
  return pageHead('Start free. <span class="acc">Upgrade if you need more.</span>','Your first set of designs is free. Bookings cost only what vendors quote. Plan prices are demo values.','Pricing')+'<section class="sec"><div class="wrap">'+pricingBlock()+
  '<div class="grid g2" style="margin-top:34px"><div class="card"><h3>Billing and renewal</h3><p class="muted small" style="margin:0">Plans renew monthly. Credits reset on renewal. Cancel before the next billing date. Taxes are shown at checkout.</p></div><div class="card"><h3>What uses a credit?</h3><p class="muted small" style="margin:0">One generation of four designs, or one refinement of a single design. Vendor requests and downloads do not use credits.</p></div></div><div style="max-width:760px;margin:40px auto 0">'+faqList(4)+'</div></div></section>'+footer();
};

/* ----- vendors page: filter sidebar + cards ----- */
const CITIES=[...new Set(VENDORS.map(v=>v.city))];
const vcount=f=>VENDORS.filter(f).length;
vcard=function(v,o){
  o=o||{};const open=S.unlocked&&S.role==='customer';
  const badge=v.rating>=4.8?'Top rated':(v.price==='£££'?'Premium':'Verified');
  const reason=o.cid?'<div class="small" style="color:var(--maroon);font-weight:700">'+esc(reasonFor(v,o.cid))+'</div>':'';
  return '<div class="vcard2"><div class="vph" style="background:linear-gradient(135deg,'+v.c[0]+','+v.c[1]+')"><span class="vb">'+badge+'</span><button class="heart" data-act="vfav" data-id="'+v.id+'" aria-label="Save">'+(S.favV.includes(v.id)?'&#9829;':'&#9825;')+'</button><span class="vi">'+esc(initials(v.name))+'</span></div>'+
  '<div class="vbd"><div class="small muted">'+esc(v.cat)+'</div><b style="font:600 1.1rem Bricolage Grotesque,sans-serif">'+esc(v.name)+'</b><div class="small muted" style="font-style:italic">&ldquo;'+esc(v.blurb)+'&rdquo;</div>'+reason+'<div class="small">'+esc(v.city)+' &bull; <b>&#9733; '+v.rating+'</b> &bull; '+v.price+'</div>'+
  '<div class="vft"><button class="btn sm p" data-act="'+(open?'rq':'paywall')+'" data-id="'+v.id+'">'+(open?'':'&#128274; ')+'Send Brief</button><button class="btn sm" data-act="vprofile" data-id="'+v.id+'">View Work</button>'+(o.select&&open?'<label style="display:inline-flex;gap:6px;align-items:center;margin:0;font-weight:600"><input type="checkbox" data-act="vsel" data-id="'+v.id+'" '+(S.sel.includes(v.id)?'checked':'')+'> Select</label>':'')+'</div></div></div>';
};
function vFiltered(){
  const f=S.vf;
  let l=VENDORS.filter(v=>(!f.ev.length||v.cultures.some(c=>f.ev.includes(c)))&&(!f.cat.length||f.cat.includes(v.cat))&&(!f.city.length||f.city.includes(v.city))&&v.rating>=f.rating&&v.base<=f.budget);
  if(f.sort==='rating')l.sort((a,b)=>b.rating-a.rating);else if(f.sort==='price')l.sort((a,b)=>a.base-b.base);else l.sort((a,b)=>(b.cultures.length>a.cultures.length?0:0)||b.rating-a.rating);
  return l;
}
vlist=function(){const l=vFiltered();return l.length?'<div class="grid g3">'+l.map(v=>vcard(v)).join('')+'</div>':'<div class="card center muted">No vendors match these filters. <button class="link" data-act="vclear">Clear all</button></div>'};
function vTop(){
  const f=S.vf,chips=[];f.ev.forEach(x=>chips.push(['ev',x,cult(x).name]));f.cat.forEach(x=>chips.push(['cat',x,x]));f.city.forEach(x=>chips.push(['city',x,x]));if(f.rating)chips.push(['rating',f.rating,f.rating+' & above']);if(f.budget<3000)chips.push(['budget',f.budget,'Up to '+money(f.budget)]);
  return '<div class="vtop" style="margin:6px 0"><div><b>'+vFiltered().length+' vendors</b> <span class="muted small">matching your filters</span></div><div style="display:flex;gap:8px;align-items:center"><span class="small muted">Sort by:</span><select data-vsort><option value="match" '+(f.sort==='match'?'selected':'')+'>Best Match</option><option value="rating" '+(f.sort==='rating'?'selected':'')+'>Top rated</option><option value="price" '+(f.sort==='price'?'selected':'')+'>Lowest price</option></select></div></div><div class="fchips">'+chips.map(c=>'<span class="fchip" data-act="vfrm" data-k="'+c[0]+'" data-v="'+c[1]+'">'+esc(c[2])+' &times;</span>').join('')+'</div>';
}
function vSide(){
  const f=S.vf,cb=(k,val,label,n)=>'<label class="cbx"><input type="checkbox" data-vfa="'+k+'" data-v="'+esc(val)+'" '+(f[k].includes(val)?'checked':'')+'><span>'+esc(label)+'</span><i>'+n+'</i></label>';
  return '<aside class="filters card" style="align-self:start"><div class="fh"><b>Filters</b><button class="link small" data-act="vclear">Clear all</button></div>'+
  '<div class="fg"><b>Event type</b>'+Object.values(CULTURES).map(c=>cb('ev',c.id,c.name,vcount(v=>v.cultures.includes(c.id)))).join('')+'<label class="cbx" style="opacity:.5"><input type="checkbox" disabled><span>Wedding</span><i>soon</i></label></div>'+
  '<div class="fg"><b>Budget</b><div class="small muted">Up to '+money(f.budget)+'</div><input type="range" min="300" max="3000" step="100" value="'+f.budget+'" data-vfr="budget"><div class="small muted" style="display:flex;justify-content:space-between"><span>&pound;300</span><span>&pound;3,000+</span></div></div>'+
  '<div class="fg"><b>Vendor category</b>'+CATS.map(c=>cb('cat',c,c,vcount(v=>v.cat===c))).join('')+'</div>'+
  '<div class="fg"><b>Rating</b>'+[[4.5,'4.5 & above'],[4,'4.0 & above'],[0,'Any rating']].map(r=>'<label class="cbx"><input type="radio" name="rt" data-vfr="rating" value="'+r[0]+'" '+(f.rating===r[0]?'checked':'')+'><span>'+r[1]+'</span></label>').join('')+'</div>'+
  '<div class="fg"><b>Location</b>'+CITIES.map(c=>cb('city',c,c,vcount(v=>v.city===c))).join('')+'</div></aside>';
}
VIEWS['/vendors']=function(){
  return '<section class="sec" style="padding:52px 0 18px"><div class="wrap center"><h1 style="font-size:clamp(2rem,4.4vw,3.2rem);max-width:760px;margin:0 auto .3em">Vendors ready to bring <span class="acc">your vision to life.</span></h1><p class="muted">Discover verified vendors who match your aesthetic, budget and event style. These are sample vendors for the demo.</p></div></section>'+
  '<section class="sec" style="padding-top:10px"><div class="wrap">'+(S.role==='customer'&&!S.unlocked?'<div class="banner"><div class="grow"><b>Subscribe to send briefs to vendors.</b><div class="small">You can browse every profile now. Contact needs a subscription key.</div></div><button class="btn p sm" data-act="paywall">See plans</button></div>':'')+
  '<div class="vlayout">'+vSide()+'<div><h2 style="font-size:1.7rem;margin-bottom:.2em">Meet the vendors who can build it for real.</h2><div id="vtop">'+vTop()+'</div><div id="vlist">'+vlist()+'</div></div></div></div></section>'+footer();
};
function vRefresh(){const a=$('#vtop'),b=$('#vlist');if(a)a.innerHTML=vTop();if(b)b.innerHTML=vlist()}
ACT.vclear=()=>{S.vf=dvf();render()};
ACT.vfrm=el=>{const k=el.dataset.k,v=el.dataset.v;if(k==='rating')S.vf.rating=0;else if(k==='budget')S.vf.budget=3000;else S.vf[k]=S.vf[k].filter(x=>x!==v);render()};
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.vfa){const k=t.dataset.vfa,v=t.dataset.v;S.vf[k]=t.checked?S.vf[k].concat(v):S.vf[k].filter(x=>x!==v);vRefresh()}
  else if(t.dataset.vfr==='rating'){S.vf.rating=+t.value;vRefresh()}
  else if(t.dataset.vsort!==undefined){S.vf.sort=t.value;vRefresh()}
});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset.vfr==='budget'){S.vf.budget=+t.value;vRefresh();const b=t.parentNode.querySelector('.small');if(b)b.textContent='Up to '+money(S.vf.budget)}});

/* ----- customer account tab bar ----- */
function acct(cur){return '<div class="wrap" style="padding-top:26px"><div class="sidenav" style="margin:0">'+[['/dashboard','Overview'],['/events','My events'],['/quotes','Quotes'],['/bookings','Bookings'],['/notifications','Alerts'],['/profile','Profile']].map(i=>'<a class="'+(cur===i[0]?'on':'')+'" href="#'+i[0]+'">'+i[1]+'</a>').join('')+'</div></div>'}
['/dashboard','/events','/quotes','/bookings','/notifications','/profile'].forEach(k=>{const o=VIEWS[k];VIEWS[k]=function(p){const h=o(p);return S.role==='customer'?acct(k)+h:h}});

/* ----- split-screen login, signup and verify ----- */
const mosaic=()=>'<div class="mosaic">'+[['diwali','hall','lavish',12],['eid','garden','classic',22],['lny','restaurant','classic',32],['eid','hall','evening',24],['lny','garden','lavish',34],['diwali','restaurant','evening',14],['eid','restaurant','classic',26],['lny','hall','evening',36],['diwali','garden','classic',16]].map(x=>'<canvas data-paint="gal:'+x.join(':')+'"></canvas>').join('')+'</div>';
function authPage(inner){
  return '<div class="auth"><div class="aform"><a class="logo" href="#/">EventCulture AI</a><div class="ain">'+inner+'</div><div class="small muted">&copy; 2026 EventCulture AI &middot; <a href="#/privacy">Privacy</a> &middot; <a href="#/terms">Terms</a></div></div><div class="aside">'+mosaic()+'<div class="ov"><div class="big">Your venue.<br>Four concepts.<br>One calm next step.</div><div class="stats"><div><b>4</b><span>designs per request</span></div><div><b>3</b><span>cultures at launch</span></div><div><b>Free</b><span>first preview</span></div></div></div></div></div>';
}
const sso=t=>'<button class="sso" data-act="social" data-p="Google"><span class="gi">G</span>'+t+' with Google</button><button class="sso" data-act="social" data-p="Apple"><span class="ai">A</span>'+t+' with Apple</button><div class="or">OR USE YOUR EMAIL</div>';
VIEWS['/login']=function(){
  return authPage('<a class="tab" href="#/signup">Create account</a><h1 style="font-size:clamp(2rem,4vw,3rem)">Welcome <span class="acc">back.</span></h1><p class="muted">Pick up where you left off: your saved mood boards and quotes are waiting.</p>'+sso('Sign in')+
  '<form data-form="login" novalidate><div class="fld"><label>EMAIL</label><input name="email" type="email" value="aisha@example.com" placeholder="Sarah@example.com"></div><div class="fld"><label>PASSWORD</label><input name="pw" type="password" value="demo-password" placeholder="Your password"></div><div class="fld"><label style="font-weight:600;display:flex;gap:8px;align-items:center"><input type="checkbox" checked> Keep me signed in</label></div><div class="err" id="ferr"></div><button class="btn p lg" style="width:100%;justify-content:center">Log In</button></form><p class="small muted" style="margin-top:16px">New here? <a class="link" href="#/signup">Create Account &rarr;</a> &middot; <button class="link" data-act="forgot">Forgot password?</button></p>');
};
VIEWS['/signup']=function(){
  return authPage('<a class="tab" href="#/login">Log in instead</a><h1 style="font-size:clamp(2rem,4vw,3rem)">Create your <span class="acc">account.</span></h1><p class="muted">Free to start. Your first set of designs is on us.</p>'+sso('Sign up')+
  '<form data-form="signup" novalidate><div class="row"><div class="fld"><label>FIRST NAME *</label><input name="fn" value="Aisha"></div><div class="fld"><label>LAST NAME *</label><input name="ln" value="Khan"></div></div><div class="fld"><label>EMAIL *</label><input name="email" type="email" value="aisha@example.com"></div><div class="fld"><label>UK MOBILE NUMBER *</label><input name="mob" value="07700 900123"></div><div class="row"><div class="fld"><label>PASSWORD *</label><input name="pw" type="password" value="demo-password"></div><div class="fld"><label>CONFIRM PASSWORD *</label><input name="pw2" type="password" value="demo-password"></div></div><div class="fld"><label style="font-weight:600;display:flex;gap:8px;align-items:center"><input type="checkbox" name="tc" checked> I accept the&nbsp;<a class="link" href="#/terms">Terms</a>&nbsp;and&nbsp;<a class="link" href="#/privacy">Privacy Policy</a></label></div><div class="err" id="ferr"></div><button class="btn p lg" style="width:100%;justify-content:center">Create account</button></form>');
};
VIEWS['/verify']=function(){
  return authPage('<a class="tab" href="#/signup">Back</a><h1 style="font-size:clamp(2rem,4vw,3rem)">Verify your <span class="acc">email.</span></h1><p class="muted">We sent a code to <b>'+esc(S.pend.email||'your email')+'</b>. In this demo the code is filled in for you.</p><form data-form="verify"><div class="fld"><label>VERIFICATION CODE</label><input name="code" value="123456"></div><div class="err" id="ferr"></div><button class="btn p lg" style="width:100%;justify-content:center">Verify and continue</button></form><p class="small muted" style="margin-top:14px"><button class="link" data-act="resend">Resend code</button></p>');
};

/* ----- home page ----- */
const PICKS=[['diwali','hall','classic',11,'Diwali, banquet hall'],['eid','garden','evening',23,'Eid, garden marquee'],['lny','restaurant','lavish',35,'Lunar New Year, restaurant']];
VIEWS['/']=function(){
  const pi=S.heroPick||0,pk=PICKS[pi];
  const cl=[['diwali','hall','lavish',12,'t1'],['eid','garden','classic',22,'t2'],['lny','restaurant','classic',32,'t3'],['diwali','restaurant','evening',14,'t4']];
  const cat=(c,k,t,p,soon)=>'<div class="cat '+c+'"><span class="k">'+k+'</span><h3>'+t+'</h3><p>'+p+'</p>'+(soon?'<span class="soon">Coming soon</span>':'')+'</div>';
  const steps=[['Step 01','Upload your space','Add a photo of your room, venue, rooftop or garden.'],['Step 02','Describe the atmosphere','"Warm candlelit dinner with soft florals."'],['Step 03','Watch it transform','Get four AI concepts, each checked against the culture card.'],['Step 04','Bring it to life','Connect with decorators, florists and planners.']];
  return '<section class="hero"><div class="wrap grid"><div><div class="mono">AI venue visualisation + vendor booking</div><h1>Picture your celebration, before you <span class="acc">plan it.</span></h1><p class="muted" style="font-size:1.1rem;max-width:500px">Upload a photo of your space. Tell us how you want it to feel. See four culturally checked concepts of your actual room in about 90 seconds, then book the vendors who can make them real.</p><div style="display:flex;gap:10px;flex-wrap:wrap">'+startCta('Start with your space')+'<a class="btn lg" href="#/how">How it works</a></div><p class="small muted" style="margin-top:16px">Free to try &middot; No card required &middot; Diwali, Eid and Lunar New Year at launch</p></div>'+
  '<div class="collage">'+cl.map(c=>'<canvas class="'+c[4]+'" data-paint="gal:'+c.slice(0,4).join(':')+'"></canvas>').join('')+'</div></div></section>'+
  '<section class="sec alt"><div class="wrap center"><div class="mono">Design showcase</div><h2>Your venue, styled by AI.</h2><div style="max-width:820px;margin:22px auto 14px">'+cmpSlider('sample:'+pk[1],'gal:'+pk[0]+':'+pk[1]+':'+pk[2]+':'+pk[3])+'</div><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">'+PICKS.map((p,i)=>'<span class="chip '+(i===pi?'on':'')+'" data-act="slidepick" data-i="'+i+'">'+p[4]+'</span>').join('')+'</div><p class="small muted" style="margin-top:14px">Results vary with your venue photo and preferences. The design keeps your room\'s structure and layout.</p></div></section>'+
  '<section class="sec"><div class="wrap"><div class="grid g2" style="align-items:end"><div><div class="mono">How it works</div><h2 style="margin:0">Four steps. Ninety seconds. One celebration to remember.</h2></div><p class="muted" style="margin:0">No mood boards. No spreadsheets. No expensive planner. Four steps to your first results.</p></div><div class="grid g4" style="margin-top:28px">'+steps.map(s=>'<div class="card"><div class="mono" style="font-style:normal">'+s[0]+'</div><h3>'+s[1]+'</h3><p class="muted small" style="margin:0">'+s[2]+'</p></div>').join('')+'</div></div></section>'+
  '<section class="sec alt"><div class="wrap"><div class="center"><div class="mono">Event types</div><h2>Designed for the moments that matter to you.</h2></div><div class="cats" style="margin-top:26px">'+
  cat('c1','Category 1','Weddings','Ceremonies, receptions, welcome dinners, brunches.',1)+cat('c2','Category 2','Milestone Birthdays','Landmark birthdays at home or in a venue.',1)+
  '<a class="cat c3" href="#/explore"><div class="th"><canvas data-paint="gal:diwali:hall:classic:11"></canvas><canvas data-paint="gal:eid:garden:classic:21"></canvas><canvas data-paint="gal:lny:restaurant:classic:31"></canvas></div><span class="k">Category 3 &middot; Available now</span><h3>Cultural Celebrations</h3><p>Diwali, Eid and Lunar New Year, with culture cards and expert sign-off.</p></a>'+
  cat('c4','Category 4','Corporate and Brand Events','Launches, galas and team celebrations.',1)+cat('c5','Category 5','At-home Gatherings','Dinner parties, anniversaries, baby welcomes.',1)+cat('c6','Category 6','Anniversaries and Reunions','Family and friends, together again.',1)+'</div></div></section>'+
  '<section class="sec"><div class="wrap"><div style="display:flex;justify-content:space-between;align-items:end;gap:10px;flex-wrap:wrap;margin-bottom:20px"><div><div class="mono">Marketplace</div><h2 style="margin:0">Top event vendors near you</h2></div><a class="btn" href="#/vendors">See all</a></div><div class="grid g4">'+VENDORS.filter(v=>v.rating>=4.8).slice(0,4).map(v=>vcard(v)).join('')+'</div></div></section>'+
  '<section class="sec dark"><div class="wrap grid g2" style="gap:40px;align-items:center"><div><div class="mono" style="color:var(--lilac)">Vendor booking</div><h2>Quote, negotiate, book, pay.</h2><p style="opacity:.8">Send your chosen design to several vendors. Compare quotes, negotiate for up to three rounds, and pay through the platform. Your money is held until the job is done.</p><a class="btn b" href="#/how">See the booking process</a></div><div class="grid g2">'+[['Vendor categories','Decorators, florists, lighting, catering, DJs, photography'],['Verified vendors','Every vendor is approved by our team before going live'],['Multiple vendors','Book different services for the same event'],['Held payments','Released to the vendor when the service is complete']].map(x=>'<div style="border:1px solid rgba(255,255,255,.25);border-radius:16px;padding:16px"><b>'+x[0]+'</b><div class="small" style="opacity:.75;margin-top:4px">'+x[1]+'</div></div>').join('')+'</div></div></section>'+
  '<section class="sec"><div class="wrap"><div class="center"><div class="mono">Plans</div><h2>Start free. Upgrade if you need more.</h2><p class="muted">Your first set of four designs is free. Bookings cost only what vendors quote.</p></div><div style="margin-top:26px">'+pricingBlock()+'</div></div></section>'+
  '<section class="sec alt"><div class="wrap center"><h2>Join hosts planning with EventCulture.</h2><div class="grid g3 trio" style="margin-top:22px;text-align:left">'+[['It\'s instant','Upload a photo, describe the feeling. Four concepts in about 90 seconds, no planner required.'],['It\'s worth it','Free to try. You pay a vendor\'s quote through the platform, and it is held until the job is done.'],['You\'re protected','Every vendor is verified by our team. Payments are held until the service is complete. Your photos stay yours.']].map(x=>'<div class="card" style="background:#fff"><h3>'+x[0]+'</h3><p class="muted small" style="margin:0">'+x[1]+'</p></div>').join('')+'</div></div></section>'+
  '<section class="sec"><div class="wrap" style="max-width:780px"><div class="center"><h2>Questions</h2></div>'+faqList(5)+'<div class="center" style="margin-top:20px"><a class="btn" href="#/faq">All FAQs</a></div></div></section>'+
  '<section class="sec center" style="background:var(--lilac)"><div class="wrap"><h2>Now let\'s see your celebration.</h2><p>Take one photo of the space. Tell us how you want it to feel. Four visions in about 90 seconds, then a calm next step.</p>'+startCta('Start with your space')+'<p class="small" style="margin-top:12px">Free to try &middot; No card required &middot; 90-second visualisation</p></div></section>'+footer();
};
