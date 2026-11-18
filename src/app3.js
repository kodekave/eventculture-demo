/* ===== VENDOR + ADMIN VIEWS ===== */
['vSt','payoutSt','dispSt','leadSt','avail'].forEach(k=>{S[k]=S[k]||{}});['reports','contacts','extraPend'].forEach(k=>{S[k]=S[k]||[]});
const tbl=(h,rows,empty)=>rows.length?'<div class="tw"><table class="t"><thead><tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>':'<div class="card center muted">'+(empty||'Nothing here yet.')+'</div>';
const sideNav=(base,items,cur)=>'<div class="sidenav">'+items.map(i=>'<a class="'+(cur===i[0]?'on':'')+'" href="#'+base+(i[0]?'/'+i[0]:'')+'">'+i[1]+'</a>').join('')+'</div>';
const COMM=0.10;

function vLeads(){
  const id=S.vAct;
  const dummy=VENDOR_LEADS.map(l=>({id:l.id,customer:l.customer,event:l.event,budget:l.budget,status:S.leadSt[l.id]||'New',live:false}));
  const live=S.quotes.filter(q=>q.vendorId===id).map(q=>{const ev=S.events.find(e=>e.id===q.eventId);return{id:q.id,customer:S.user?S.user.name:'Customer',event:(ev?ev.name+', '+ev.guests+' guests':''),budget:ev&&ev.budget?money(ev.budget):'',status:q.status,live:true,price:q.price}});
  return live.concat(dummy);
}
VIEWS['/v']=function(parts){
  if(S.role!=='vendor')return '<section class="sec center"><div class="wrap"><h2>This area is for vendors</h2><button class="btn p" data-act="role" data-r="vendor">Continue as demo vendor</button></div></section>';
  const tab=parts[1]||'',v=vend(S.vAct),nav=sideNav('/v',[['','Dashboard'],['leads','Leads and quotes'],['bookings','Bookings'],['availability','Availability'],['earnings','Earnings'],['profile','Profile']],tab);
  const sw='<div style="display:flex;gap:8px;align-items:center;margin-bottom:18px;flex-wrap:wrap"><span class="small muted">Demo: act as</span><select data-vact style="width:auto">'+VENDORS.map(x=>'<option value="'+x.id+'" '+(x.id===S.vAct?'selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></div>';
  const leads=vLeads(),bks=S.bookings.filter(b=>b.vendorId===S.vAct),pays=S.payouts.filter(p=>p.vendorId===S.vAct);
  let body='';
  if(tab===''){
    const paid=pays.filter(p=>S.payoutSt[p.id]==='Paid').reduce((a,p)=>a+p.amount-p.commission,0);
    body='<div class="grid g4"><div class="stat"><b>'+leads.filter(l=>l.status==='New'||l.status==='Awaiting quote').length+'</b><span>New leads</span></div><div class="stat"><b>'+leads.filter(l=>l.status==='Quote received'||l.status==='Quoted'||l.status==='Negotiation').length+'</b><span>Quotes sent</span></div><div class="stat"><b>'+bks.length+'</b><span>Bookings</span></div><div class="stat"><b>'+money(paid)+'</b><span>Paid out</span></div></div><h3 style="margin-top:26px">Latest leads</h3>'+tbl(['Customer','Event','Budget','Status'],leads.slice(0,4).map(l=>[esc(l.customer),esc(l.event),esc(l.budget),'<span class="badge">'+l.status+'</span>']));
  } else if(tab==='leads'){
    body='<h3>Leads and quotes</h3>'+tbl(['Customer','Event','Budget','Status',''],leads.map(l=>[esc(l.customer),esc(l.event),esc(l.budget),'<span class="badge '+(l.live&&l.price?'ok':'')+'">'+l.status+(l.price?' ('+money(l.price)+')':'')+'</span>',(!l.live&&l.status==='New')?'<button class="btn sm p" data-act="vlead" data-id="'+l.id+'">Send quote</button>':(l.live?'<span class="small muted">Customer designs attached</span>':'')]),'No leads yet.');
  } else if(tab==='bookings'){
    body='<h3>Bookings</h3>'+tbl(['Customer','Service','Date','Amount','Status',''],bks.map(b=>[esc(S.user?S.user.name:'Customer'),esc(b.service),niceDate(b.date),money(b.amount),'<span class="badge">'+b.status+'</span>',b.status==='Confirmed'?'<button class="btn sm" data-act="vevid">Upload completion evidence</button>':'']),'No bookings yet. Book this vendor as the customer to see it here.');
  } else if(tab==='availability'){
    const off=S.avail[S.vAct]||[];let cells='<div class="h">Mon</div><div class="h">Tue</div><div class="h">Wed</div><div class="h">Thu</div><div class="h">Fri</div><div class="h">Sat</div><div class="h">Sun</div>';
    const start=new Date();const pad=(start.getDay()+6)%7;for(let i=0;i<pad;i++)cells+='<div style="visibility:hidden"></div>';
    for(let i=0;i<28;i++){const dt=inDays(i);cells+='<div class="'+(off.includes(dt)?'off':'')+'" data-act="vday" data-d="'+dt+'">'+new Date(dt+'T12:00:00').getDate()+'</div>'}
    body='<h3>Availability calendar</h3><p class="muted small">Click a day to mark it unavailable. Customers only see and reschedule to available dates.</p><div class="cal">'+cells+'</div>';
  } else if(tab==='earnings'){
    body='<h3>Earnings and payouts</h3><p class="muted small">Commission: '+Math.round(COMM*100)+'% (demo). Payouts are requested when the customer marks a job complete and approved by admin.</p>'+tbl(['Booking','Amount','Commission','You receive','Status'],pays.map(p=>['#'+p.bid,money(p.amount),money(p.commission),'<b>'+money(p.amount-p.commission)+'</b>','<span class="badge '+(S.payoutSt[p.id]==='Paid'?'ok':'')+'">'+(S.payoutSt[p.id]||'Requested')+'</span>']),'No payouts yet. Complete a booking as the customer to create one.');
  } else {
    body='<h3>Business profile</h3><div class="grid g2"><div class="card"><b>'+esc(v.name)+'</b><div class="muted small">'+esc(v.cat)+' &middot; '+esc(v.city)+'</div><p style="margin-top:10px">'+esc(v.blurb)+'</p><div style="display:flex;gap:6px;flex-wrap:wrap">'+v.skills.map(s=>'<span class="badge">'+esc(s)+'</span>').join('')+'</div></div><div class="card"><b>Portfolio</b><div class="grid g3" style="margin-top:8px">'+[0,1,2].map(i=>'<div style="aspect-ratio:1;border-radius:10px;background:linear-gradient('+(120+i*50)+'deg,'+v.c[i%2]+','+v.c[(i+1)%2]+')"></div>').join('')+'</div></div></div>';
  }
  return '<section class="sec" style="padding-top:30px"><div class="wrap"><div class="mono">Vendor dashboard</div><h2>'+esc(v.name)+'</h2>'+sw+nav+body+'</div></section>';
};
VIEWS['/a']=function(parts){
  if(S.role!=='admin')return '<section class="sec center"><div class="wrap"><h2>This area is for admins</h2><button class="btn p" data-act="role" data-r="admin">Continue as demo admin</button></div></section>';
  const tab=parts[1]||'';
  const nav=sideNav('/a',[['','Dashboard'],['customers','Customers'],['vendors','Vendors'],['plans','Subscription plans'],['events','Events'],['bookings','Bookings'],['disputes','Disputes'],['payouts','Payouts'],['cms','CMS and settings'],['staff','Staff and roles']],tab);
  const pend=ADMIN_PENDING.concat(S.extraPend),disp=ADMIN_DISPUTES.map(d=>({id:d.id,who:d.who,reason:d.reason})).concat(S.disputes.map(d=>({id:d.id,who:d.who,reason:d.reason}))),pays=ADMIN_PAYOUTS.map(p=>({id:p.id,vendor:p.vendor,amount:p.amount,commission:Math.round(p.amount*COMM)})).concat(S.payouts.map(p=>({id:p.id,vendor:vend(p.vendorId).name,amount:p.amount,commission:p.commission})));
  let body='';
  if(tab===''){
    const gmv=S.bookings.reduce((a,b)=>a+b.amount,0);
    body='<div class="grid g4"><div class="stat"><b>'+(ADMIN_CUSTOMERS.length+(S.user?1:0))+'</b><span>Customers</span></div><div class="stat"><b>'+(VENDORS.length+pend.filter(p=>S.vSt[p.id]==='Approved').length)+'</b><span>Approved vendors</span></div><div class="stat"><b>'+pend.filter(p=>!S.vSt[p.id]).length+'</b><span>Vendor applications</span></div><div class="stat"><b>'+disp.filter(d=>!S.dispSt[d.id]).length+'</b><span>Open disputes</span></div></div>'+
    '<div class="grid g2" style="margin-top:20px"><div class="card"><h3>Bookings value (demo)</h3><div class="kpi">'+[40,55,48,70,62,85,gmv?Math.min(100,30+gmv/60):90].map(h=>'<i style="height:'+h+'%"></i>').join('')+'</div><div class="small muted" style="margin-top:6px">Live bookings: '+money(gmv)+' &middot; Commission at '+Math.round(COMM*100)+'%: '+money(Math.round(gmv*COMM))+'</div></div><div class="card"><h3>Reports</h3><p class="muted small">Export customers, vendors, bookings, transactions and payouts.</p><button class="btn" data-act="export">Export report (CSV)</button></div></div>'+
    '<h3 style="margin-top:24px">Needs your attention</h3>'+tbl(['Item','Detail',''],pend.filter(p=>!S.vSt[p.id]).map(p=>['Vendor application',esc(p.name)+' ('+esc(p.cat)+')','<a class="btn sm" href="#/a/vendors">Review</a>']).concat(S.reports.map(r=>['Design report',esc(r),'<span class="badge warn">Expert review queue</span>'])).concat(S.contacts.map(c=>['Contact enquiry',esc(c),''])),'Nothing waiting.');
  } else if(tab==='customers'){
    body='<h3>Customers</h3>'+tbl(['Name','Email','City','Plan','Status'],ADMIN_CUSTOMERS.map(c=>[esc(c[0]),esc(c[1]),esc(c[2]),c[3],'<span class="badge '+(c[4]==='Active'?'ok':'bad')+'">'+c[4]+'</span>']).concat(S.user?[[esc(S.user.name)+' <span class="badge draft">you</span>',esc(S.user.email),'London',S.plan?S.plan.name:'None','<span class="badge ok">Active</span>']]:[]));
  } else if(tab==='vendors'){
    body='<h3>Vendor applications</h3>'+tbl(['Business','Category','City','Status',''],pend.map(p=>[esc(p.name),esc(p.cat),esc(p.city||''),'<span class="badge '+(S.vSt[p.id]==='Approved'?'ok':(S.vSt[p.id]==='Rejected'?'bad':'warn'))+'">'+(S.vSt[p.id]||'Pending')+'</span>',S.vSt[p.id]?'':'<button class="btn sm p" data-act="aappr" data-id="'+p.id+'">Approve</button> <button class="btn sm" data-act="arej" data-id="'+p.id+'">Reject</button>']))+'<h3 style="margin-top:24px">Approved vendors</h3>'+tbl(['Business','Category','City','Rating'],VENDORS.map(v=>[esc(v.name),esc(v.cat),esc(v.city),'&#9733; '+v.rating]));
  } else if(tab==='plans'){
    body='<h3>Subscription plans</h3>'+tbl(['Plan','Price / month','AI credits','Status',''],PLANS.map(p=>[p.name,money(p.price),p.credits,'<span class="badge ok">Active</span>','<button class="btn sm" data-act="aedit" data-n="'+p.name+' plan">Edit</button>']));
  } else if(tab==='events'){
    body='<h3>Events</h3>'+tbl(['Event','Type','Date','Guests','Status'],S.events.map(e=>[esc(e.name),cult(e.type).name,niceDate(e.date),e.guests,'<span class="badge">'+e.status+'</span>']),'No customer events yet. Create one as the customer.')+'<h3 style="margin-top:24px">Event types and vendor categories</h3><div class="grid g2"><div class="card">'+Object.values(CULTURES).map(c=>'<span class="badge ok" style="margin:2px">'+c.name+'</span>').join('')+'<span class="badge" style="margin:2px">Weddings (coming soon)</span></div><div class="card">'+CATS.map(c=>'<span class="badge" style="margin:2px">'+c+'</span>').join('')+'</div></div>';
  } else if(tab==='bookings'){
    body='<h3>Bookings and transactions</h3>'+tbl(['Booking','Vendor','Amount','Held','Commission','Status'],S.bookings.map(b=>['#'+b.id,esc(vend(b.vendorId).name),money(b.amount),money(b.paid),money(Math.round(b.amount*COMM)),'<span class="badge">'+b.status+'</span>']),'No bookings yet.');
  } else if(tab==='disputes'){
    body='<h3>Disputes</h3>'+tbl(['Parties','Reason','Status',''],disp.map(d=>[esc(d.who),esc(d.reason),'<span class="badge '+(S.dispSt[d.id]?'ok':'warn')+'">'+(S.dispSt[d.id]||'Open')+'</span>',S.dispSt[d.id]?'':'<button class="btn sm" data-act="adres" data-id="'+d.id+'" data-w="customer">Favour customer</button> <button class="btn sm" data-act="adres" data-id="'+d.id+'" data-w="vendor">Favour vendor</button>']));
  } else if(tab==='payouts'){
    body='<h3>Vendor payouts</h3><p class="muted small">Commission: '+Math.round(COMM*100)+'% (demo). Approve a payout to release the held funds, minus commission.</p>'+tbl(['Vendor','Amount','Commission','Net payout','Status',''],pays.map(p=>[esc(p.vendor),money(p.amount),money(p.commission),'<b>'+money(p.amount-p.commission)+'</b>','<span class="badge '+(S.payoutSt[p.id]==='Paid'?'ok':'warn')+'">'+(S.payoutSt[p.id]||'Requested')+'</span>',S.payoutSt[p.id]==='Paid'?'':'<button class="btn sm p" data-act="apay" data-id="'+p.id+'">Approve payout</button>']));
  } else if(tab==='cms'){
    body='<h3>Content pages</h3>'+tbl(['Page','Last updated',''],['Landing page','About us','FAQs','Terms and conditions','Privacy policy'].map(n=>[n,'19 Nov 2026','<button class="btn sm" data-act="aedit" data-n="'+n+'">Edit</button>']))+'<h3 style="margin-top:24px">Platform settings</h3><div class="grid g2"><div class="card"><div class="fld"><label>Commission</label><input value="10%" disabled></div><div class="fld"><label>Currency</label><input value="GBP (pounds)" disabled></div></div><div class="card"><div class="fld"><label>Negotiation rounds per side</label><input value="3" disabled></div><div class="fld"><label>Max vendors per quote request</label><input value="5" disabled></div></div></div><h3 style="margin-top:24px">Contact form requests</h3>'+tbl(['Message'],S.contacts.map(c=>[esc(c)]),'No contact enquiries yet. Send one from the Contact page.');
  } else {
    body='<h3>Staff and roles</h3>'+tbl(['Role','Dashboard','Vendors','Payouts','Disputes','CMS'],[['Super admin','Yes','Yes','Yes','Yes','Yes'],['Support','Yes','View','No','Yes','No'],['Finance','Yes','View','Yes','View','No']])+'<div class="sp"></div>'+tbl(['Staff','Email','Role','Status'],[['Nora Ellis','nora@eventculture.example','Super admin','Active'],['Sam Okoye','sam@eventculture.example','Support','Active'],['Lia Chen','lia@eventculture.example','Finance','Active']]);
  }
  return '<section class="sec" style="padding-top:30px"><div class="wrap"><div class="mono">Admin panel</div><h2>Platform admin</h2>'+nav+body+'</div></section>';
};

/* ===== ACTIONS ===== */
const ACT={};
function setRole(r){
  S.role=r;if(r==='customer'&&!S.user)S.user={name:'Aisha Khan',email:'aisha@example.com',mobile:'07700 900123'};
  if(r==='vendor'){const q=S.quotes[0];if(q)S.vAct=q.vendorId}
  save();go(r==='visitor'?'/':r==='customer'?'/dashboard':r==='vendor'?'/v':'/a');
}
ACT.role=el=>setRole(el.dataset.r);
ACT.reset=()=>{try{localStorage.removeItem('ecdemo')}catch(e){}S=clone(DEF);['vSt','payoutSt','dispSt','leadSt','avail'].forEach(k=>{S[k]={}});['reports','contacts','extraPend'].forEach(k=>{S[k]=[]});MEM.imgs={};closeModal();toast('Demo reset');go('/');render()};
ACT.mback=(el,e)=>{if(e.target===el)closeModal()};ACT.closeModal=()=>closeModal();
ACT.gtoggle=()=>{guideOpen=!guideOpen;guide()};
ACT.gstep=el=>{guideOpen=false;const k=el.dataset.k;if(k==='quote'||k==='key'||k==='paywall'){if(S.role!=='customer'||!S.cur)return go(S.role==='customer'?'/create':'/signup')}if(k==='payout'){setRole('admin');go('/a/payouts');return}if(S.role!=='customer'&&k!=='payout'){setRole('customer');}go(el.dataset.p)};
ACT.slide=()=>{};
ACT.tryculture=el=>{S.draft.type=el.dataset.c;save();go(S.role==='customer'?'/create':'/signup')};
ACT.gfilter=el=>{S.gf.c=el.dataset.c;save();render()};
ACT.gopen=el=>{const c=el.dataset.c,v=el.dataset.v,vr=el.dataset.vr,s=el.dataset.seed;openModal('<div class="mono">'+cult(c).name+' &middot; '+VENUES.find(x=>x.id===v).name+'</div><h3>'+VARIANTS.find(x=>x.key===vr).name+'</h3>'+cmpSlider('sample:'+v,'gal:'+c+':'+v+':'+vr+':'+s)+'<p class="muted small" style="margin-top:12px">Drag to compare the original venue with the AI-generated concept. Results vary with your own venue photo and preferences.</p><button class="btn p" data-act="tryculture" data-c="'+c+'">Create a design like this</button>',true)};
ACT.choosePlan=el=>{S.sub.plan=el.dataset.id;if(S.role!=='customer'){toast('Create an account first, then choose a plan.');return go('/signup')}S.sub.stage='pay';openModal(subHtml())};
ACT.paywall=()=>{if(S.role!=='customer'){toast('Log in as a customer first.');return go('/signup')}paywall()};
ACT.haveKey=()=>{paywall();setTimeout(()=>{const k=$('#keyin');if(k)k.focus()},50)};
ACT.subback=()=>{S.sub.stage='plans';openModal(subHtml())};
ACT.payNow=()=>{const b=$('#paybtn');if(b){b.textContent='Processing payment...';b.disabled=true}setTimeout(()=>{S.key=mkKey();unlock(S.sub.plan);S.sub.stage='done';flag('key');save();notify('Subscription active. Your key is '+S.key);header();openModal(subHtml())},1200)};
ACT.applyKey=()=>{const v=(($('#keyin')||{}).value||'').trim().toUpperCase();if(v&&(v===S.key||v==='EC-DEMO-2026')){if(!S.key)S.key=v;if(!S.unlocked)unlock('premium');flag('key');save();closeModal();toast('Key accepted. Vendors unlocked.');render()}else{const e=$('#kerr');if(e)e.textContent='That key was not recognised.'}};
ACT.copyKey=()=>{try{navigator.clipboard.writeText(S.key)}catch(e){}toast('Key copied')};
ACT.subdone=()=>{closeModal();render();toast('Vendors unlocked')};
ACT.forgot=()=>openModal('<h3>Reset your password</h3><div class="fld"><label>Email</label><input value="aisha@example.com"></div><button class="btn p" data-act="closeModal" onclick="toast(\'Reset link sent (demo)\')">Send reset link</button>');
ACT.social=el=>{S.role='customer';S.user={name:'Aisha Khan',email:'aisha@example.com',mobile:'07700 900123'};save();toast('Signed in with '+el.dataset.p+' (demo)');go('/dashboard')};
ACT.resend=()=>toast('A new code was sent (demo)');
ACT.vprofile=el=>profileModal(el.dataset.id);
ACT.vsel=(el,e)=>{const id=el.dataset.id;if(e.target.checked){if(S.sel.length>=maxVendors()){e.target.checked=false;toast('Your plan allows up to '+maxVendors()+' vendors per request.');return}S.sel.push(id)}else S.sel=S.sel.filter(x=>x!==id);save();render()};
ACT.rq=el=>{S.sel=[el.dataset.id];closeModal();rqModal()};
ACT.rqsel=()=>{if(!S.sel.length){toast('Select at least one vendor first.');return}rqModal()};
ACT.sendQuotes=()=>sendQuotes();
ACT.addsample=el=>{const d=S.draft;if(d.photos.length>=3){toast('You can add up to three photos.');return}d.photos.push({kind:'sample',id:el.dataset.id,name:'Sample venue'});flag('upload');save();render()};
ACT.primary=el=>{S.draft.primary=+el.dataset.i;save();render()};
ACT.rmphoto=el=>{const d=S.draft;d.photos.splice(+el.dataset.i,1);d.primary=0;save();render()};
ACT.pref=el=>{const d=S.draft,p=el.dataset.p;d.prefs=d.prefs.includes(p)?d.prefs.filter(x=>x!==p):d.prefs.concat(p);save();render()};
ACT.cback=()=>{S.draft.step=Math.max(1,S.draft.step-1);save();render()};
ACT.cnext=()=>{
  const d=S.draft,err=m=>{const e=$('#ferr');if(e)e.textContent=m};
  if(d.step===2){if(!d.name.trim())return err('Please add an event name.');if(!d.date)return err('Please choose an event date.');if(!(d.guests>0))return err('Guest count must be more than zero.');if(!d.venueName.trim())return err('Please add the venue name.')}
  if(d.step===1&&!d.photos.length)return err('Add at least one venue photo to continue.');
  d.step++;save();render();window.scrollTo(0,0);
};
ACT.generate=()=>{
  const d=S.draft;if(!d.photos.length){toast('Add a venue photo first.');return}
  if(!S.unlocked&&S.freeUsed){toast('Your free preview is used. Subscribe to generate again.');return paywall()}
  if(S.unlocked&&S.credits<1){toast('You are out of credits.');return paywall()}
  runGen({});
};
ACT.regen=()=>{
  if(!S.unlocked){toast('Regenerating needs a subscription.');return paywall()}
  if(S.credits<1){toast('You are out of credits.');return paywall()}
  runGen({regen:true});
};
const _finishGen=finishGen;
finishGen=function(o){
  if(o&&o.regen){const ev=S.events.find(e=>e.id===S.cur),first=S.designs.find(d=>d.eventId===ev.id);const nd=mkDesigns(ev,first.vendorInspo,first.src);S.designs=nd.concat(S.designs);S.credits=Math.max(0,S.credits-1);S.viewD=nd[0].id;notify('New designs generated for "'+ev.name+'".');save();closeModal();render();toast('Four new designs added. Your earlier ones are kept.')}
  else _finishGen(o);
};
ACT.editbrief=()=>{S.draft.step=1;save()};
ACT.dcompare=el=>{const id=el.dataset.id,d=S.designs.find(x=>x.id===id);openModal('<div class="mono">Compare</div><h3>'+esc(d.vname)+'</h3>'+cmpSlider('orig:'+id,'design:'+id)+'<p class="muted small" style="margin-top:10px">The design keeps your venue\'s structure and layout. Drag to compare.</p>',true)};
ACT.dcheck=el=>{S.viewD=el.dataset.id;save();render();setTimeout(()=>{const x=$$('.card h3').find(h=>h.textContent.indexOf('Cultural check')===0);if(x)x.scrollIntoView({behavior:'smooth',block:'center'})},30)};
ACT.dfav=el=>{const d=S.designs.find(x=>x.id===el.dataset.id);d.fav=!d.fav;save();render()};
ACT.ddl=el=>{const d=S.designs.find(x=>x.id===el.dataset.id),cv=document.createElement('canvas');paintDesign(cv,srcOf(d.src),d.culture,d.variant,d.seed);cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='eventculture-'+d.variant+'.png';a.click();toast('Design downloaded')})};
ACT.drefine=el=>{
  if(!S.unlocked){toast('Refining needs a subscription.');return paywall()}
  if(S.credits<1){toast('You are out of credits.');return paywall()}
  openModal('<h3>Refine this design</h3><p class="muted small">Describe what to change. A new version is added and your original is kept. Uses 1 credit ('+S.credits+' left).</p><div class="fld"><textarea id="rtext" placeholder="e.g. More marigold, softer lighting, keep the stage as is"></textarea></div><button class="btn p" data-act="doRefine" data-id="'+el.dataset.id+'">Generate new version</button>');
};
ACT.doRefine=el=>{const d=S.designs.find(x=>x.id===el.dataset.id),t=($('#rtext')||{}).value||'';const nd=Object.assign({},d,{id:'g'+(++S.ids.g),ver:d.ver+1,seed:d.seed+7,checks:d.checks.map(()=>true),retried:0,status:'passed',fav:false,note:t});S.designs.unshift(nd);S.credits=Math.max(0,S.credits-1);S.viewD=nd.id;notify('Refined design ready: '+d.vname+' v'+nd.ver);save();closeModal();render();toast('New version added')};
ACT.dreport=el=>openModal('<h3>Report an inaccuracy</h3><p class="muted small">Tell us what looks culturally wrong. It goes to the admin queue and the expert reviewer for this culture.</p><div class="fld"><select id="rtype"><option>An item looks wrong</option><option>Something important is missing</option><option>Something offensive or inappropriate</option><option>Other</option></select></div><div class="fld"><textarea id="rdet" placeholder="What did you notice?"></textarea></div><button class="btn p" data-act="doReport" data-id="'+el.dataset.id+'">Send report</button>');
ACT.doReport=el=>{const d=S.designs.find(x=>x.id===el.dataset.id);S.reports.unshift(d.vname+' ('+cult(d.culture).name+'): '+$('#rtype').value);save();closeModal();toast('Thanks. Your report is in the expert review queue.')};
ACT.dfinal=el=>{const d=S.designs.find(x=>x.id===el.dataset.id),ev=S.events.find(e=>e.id===d.eventId);ev.final=d.id;save();render();toast('Design selected. It will be attached to quote requests.')};
ACT.qcmp=(el,e)=>{const id=el.dataset.id;S.cmp=e.target.checked?S.cmp.concat(id):S.cmp.filter(x=>x!==id);save()};
ACT.qcompare=()=>compareModal();
ACT.qopen=el=>qModal(el.dataset.id);
ACT.qcounter=el=>counter(el.dataset.id);
ACT.qreject=el=>{const q=S.quotes.find(x=>x.id===el.dataset.id);q.status='Rejected';q.chat.push({f:'me',t:'Thanks, we will pass on this one.'});save();closeModal();render()};
ACT.qaccept=el=>{const q=S.quotes.find(x=>x.id===el.dataset.id);q.status='Accepted';q.chat.push({f:'me',t:'We accept your quote.'});save();qModal(q.id);render()};
ACT.qbook=el=>bookModal(el.dataset.id);
ACT.payBooking=el=>payBooking(el.dataset.id);
ACT.bres=el=>reschedModal(el.dataset.id);
ACT.doRes=el=>{const b=S.bookings.find(x=>x.id===el.dataset.id);b.date=$('#newdate').value;b.rs++;notify('Booking moved to '+niceDate(b.date)+' with '+vend(b.vendorId).name+'.');save();closeModal();render();toast('Booking rescheduled')};
ACT.bcomplete=el=>{const b=S.bookings.find(x=>x.id===el.dataset.id);b.status='Completed';S.payouts.unshift({id:'po'+b.id,bid:b.id,vendorId:b.vendorId,amount:b.amount,commission:Math.round(b.amount*COMM)});notify('Job marked complete. '+vend(b.vendorId).name+' can now be paid.');save();render();toast('Marked complete. A payout request was created for the vendor.')};
ACT.bdispute=el=>disputeModal(el.dataset.id);
ACT.doDispute=el=>{const b=S.bookings.find(x=>x.id===el.dataset.id),t=($('#dreason')||{}).value||'No details given';b.status='Disputed';S.disputes.unshift({id:'dx'+(++S.ids.d),who:(S.user?S.user.name:'Customer')+' vs '+vend(b.vendorId).name,reason:t});notify('Dispute raised. The payment stays held while we review.');save();closeModal();render()};
ACT.export=()=>{const rows=[['type','name','detail','status']].concat(S.events.map(e=>['event',e.name,cult(e.type).name+' '+e.date,e.status])).concat(S.quotes.map(q=>['quote',vend(q.vendorId).name,q.price||'',q.status])).concat(S.bookings.map(b=>['booking',vend(b.vendorId).name,b.amount,b.status]));const csv=rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='eventculture-summary.csv';a.click();toast('Summary exported')};
ACT.eopen=el=>eventModal(el.dataset.id);
ACT.eresults=el=>{S.cur=el.dataset.id;save();closeModal();go('/results')};
ACT.eedit=el=>{const e=S.events.find(x=>x.id===el.dataset.id);openModal('<h3>Edit event</h3><div class="fld"><label>Name</label><input id="en" value="'+esc(e.name)+'"></div><div class="row"><div class="fld"><label>Date</label><input id="ed" type="date" value="'+esc(e.date)+'"></div><div class="fld"><label>Guests</label><input id="eg" type="number" value="'+esc(e.guests)+'"></div></div><button class="btn p" data-act="doEdit" data-id="'+e.id+'">Save changes</button>')};
ACT.doEdit=el=>{const e=S.events.find(x=>x.id===el.dataset.id);e.name=$('#en').value||e.name;e.date=$('#ed').value||e.date;e.guests=+$('#eg').value||e.guests;save();closeModal();render();toast('Event updated')};
ACT.chpw=()=>toast('Password reset email sent (demo)');
ACT.logout=()=>{S.role='visitor';save();go('/')};
ACT.cancelSub=()=>{S.unlocked=false;S.plan=null;S.credits=0;save();render();toast('Subscription cancelled. Vendors are locked again.')};
ACT.vlead=el=>openModal('<h3>Send a quote</h3><div class="fld"><label>Your price (£)</label><input id="vlp" type="number" value="1200"></div><div class="fld"><label>Message</label><textarea>Happy to help. This includes setup and take-down.</textarea></div><button class="btn p" data-act="doVL" data-id="'+el.dataset.id+'">Send quote</button>');
ACT.doVL=el=>{S.leadSt[el.dataset.id]='Quoted';save();closeModal();render();toast('Quote sent to the customer')};
ACT.vday=el=>{const d=el.dataset.d,a=S.avail[S.vAct]=S.avail[S.vAct]||[];const i=a.indexOf(d);i>-1?a.splice(i,1):a.push(d);save();render()};
ACT.vevid=()=>toast('Completion evidence uploaded (demo). The customer can now mark the job complete.');
ACT.aappr=el=>{S.vSt[el.dataset.id]='Approved';save();render();toast('Vendor approved. Their profile is now live.')};
ACT.arej=el=>{S.vSt[el.dataset.id]='Rejected';save();render()};
ACT.adres=el=>{S.dispSt[el.dataset.id]='Resolved ('+el.dataset.w+')';save();render();toast('Dispute resolved')};
ACT.apay=el=>{S.payoutSt[el.dataset.id]='Paid';flag('payout');save();render();toast('Payout approved. Held funds released, minus commission.')};
ACT.aedit=el=>openModal('<h3>Edit: '+esc(el.dataset.n)+'</h3><div class="fld"><textarea>Content for "'+esc(el.dataset.n)+'" goes here. In the real build, admins edit this with a rich text editor.</textarea></div><button class="btn p" data-act="closeModal" onclick="toast(\'Saved (demo)\')">Save</button>');

/* ===== EVENT WIRING ===== */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el)return;const f=ACT[el.dataset.act];if(!f)return;if(el.tagName==='A'&&el.dataset.act==='editbrief'){f(el,e);return}f(el,e)});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.bind){const d=S.draft;d[t.dataset.bind]=t.type==='number'?+t.value:t.value;save();return}
  if(t.dataset.vf!==undefined){S.vf[t.dataset.vf]=t.value;save();const l=$('#vlist');if(l)l.innerHTML=vlist();return}
  if(t.dataset.act==='slide'){const w=t.closest('.cmp'),v=+t.value;w.querySelector('.top').style.clipPath='inset(0 '+(100-v)+'% 0 0)';w.querySelector('.hd').style.left=v+'%'}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.bind&&t.tagName==='SELECT'){S.draft[t.dataset.bind]=t.value;save();if(t.dataset.bind==='type')render();return}
  if(t.dataset.vf!==undefined){S.vf[t.dataset.vf]=t.value;save();const l=$('#vlist');if(l)l.innerHTML=vlist();return}
  if(t.dataset.vact!==undefined){S.vAct=t.value;save();render();return}
  if(t.dataset.up&&t.files&&t.files[0]){
    const f=t.files[0],kind=t.dataset.up;
    if(kind==='inspo'){S.draft.inspo=f.name;save();render();return}
    if(S.draft.photos.length>=3){toast('You can add up to three photos.');return}
    const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const key='u'+Date.now();MEM.imgs[key]=img;S.draft.photos.push({kind:'up',key,name:f.name});flag('upload');save();render();toast('Photo added')};img.onerror=()=>toast('That file could not be read as an image.');img.src=r.result};r.readAsDataURL(f);
  }
});
document.addEventListener('submit',e=>{
  const f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();
  const v=n=>(f.elements[n]?f.elements[n].value.trim():''),err=m=>{const x=$('#ferr');if(x)x.textContent=m};
  const mail=/^[^@\s]+@[^@\s]+\.[^@\s]+$/,uk=/^(\+44\s?7\d{3}|07\d{3})\s?\d{3}\s?\d{3}$/;
  const k=f.dataset.form;
  if(k==='contact'){if(!v('name')||!v('msg'))return err('Name and message are required.');if(!mail.test(v('email')))return err('Please enter a valid email address.');S.contacts.unshift(v('name')+': '+v('msg').slice(0,60));save();toast('Message sent. We will reply soon.');f.reset();err('')}
  else if(k==='login'){if(!mail.test(v('email'))||!v('pw'))return err('Enter your email and password.');setRole('customer')}
  else if(k==='signup'){
    if(!v('fn')||!v('ln'))return err('Please enter your first and last name.');if(!mail.test(v('email')))return err('Please enter a valid email address.');if(!uk.test(v('mob')))return err('Please enter a valid UK mobile number, for example 07700 900123.');if(v('pw').length<8)return err('Password must be at least 8 characters.');if(v('pw')!==v('pw2'))return err('Passwords do not match.');if(!f.elements.tc.checked)return err('Please accept the Terms and Privacy Policy.');
    S.pend={email:v('email'),name:v('fn')+' '+v('ln'),mobile:v('mob')};save();go('/verify')}
  else if(k==='verify'){if(v('code')!=='123456')return err('That code is not right. In this demo it is 123456.');S.role='customer';S.user={name:S.pend.name||'Aisha Khan',email:S.pend.email||'aisha@example.com',mobile:S.pend.mobile||''};notify('Welcome to EventCulture AI. Your account is verified.');save();go('/dashboard')}
  else if(k==='vsignup'){if(!v('bn'))return err('Business name is required.');if(!mail.test(v('email')))return err('Please enter a valid email address.');S.extraPend.push({id:'px'+Date.now(),name:v('bn'),cat:v('cat'),city:v('city'),status:'Pending'});save();openModal('<h3>Application submitted</h3><p class="muted">Thanks, '+esc(v('bn'))+'. Our admin team will review your application. You can approve it yourself in the Admin view of this demo.</p><button class="btn p" data-act="role" data-r="admin">Open admin view</button>')}
});

