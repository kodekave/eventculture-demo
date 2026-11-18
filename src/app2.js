/* ===== CUSTOMER VIEWS ===== */
function gate(){return '<section class="sec center"><div class="wrap"><h2>This area is for customers</h2><p class="muted">Use the role buttons at the top to switch, or continue as the demo customer.</p><button class="btn p" data-act="role" data-r="customer">Continue as demo customer</button></div></section>'}
const refOf=p=>!p?{kind:'sample',id:'hall'}:(p.kind==='sample'?{kind:'sample',id:p.id}:{kind:'img',key:p.key});

VIEWS['/create']=function(){
  if(S.role!=='customer')return gate();
  const d=S.draft,steps=['Your space','Event details','How it should feel','Review'];
  let b='';
  if(d.step===2){
    b='<div class="card"><h3>Tell us about the event</h3><div class="row"><div class="fld"><label>Event name *</label><input data-bind="name" value="'+esc(d.name)+'" placeholder="e.g. Diwali dinner"></div><div class="fld"><label>Event type *</label><select data-bind="type">'+Object.values(CULTURES).map(c=>'<option value="'+c.id+'" '+(d.type===c.id?'selected':'')+'>'+c.name+'</option>').join('')+'</select></div></div>'+
    '<div class="row"><div class="fld"><label>Event date *</label><input type="date" data-bind="date" value="'+esc(d.date)+'"></div><div class="fld"><label>Guest count *</label><input type="number" min="1" data-bind="guests" value="'+esc(d.guests)+'"></div><div class="fld"><label>Approximate budget (£)</label><input type="number" min="0" data-bind="budget" value="'+esc(d.budget)+'"></div></div>'+
    '<div class="row"><div class="fld"><label>Venue name *</label><input data-bind="venueName" value="'+esc(d.venueName)+'" placeholder="e.g. Hallmark Banquet Hall"></div><div class="fld"><label>Venue city</label><input data-bind="venueCity" value="'+esc(d.venueCity)+'"></div></div><div class="err" id="ferr"></div></div>';
  } else if(d.step===1){
    b='<div class="card"><h3>Add photos of your space</h3><p class="muted small">Upload up to three photos of the real room, or pick a sample venue for the demo. The design keeps your room\'s structure and layout.</p>'+
    '<div class="grid g3" style="margin-bottom:16px">'+VENUES.map(v=>'<div class="tile" data-act="addsample" data-id="'+v.id+'"><canvas class="art" data-paint="sample:'+v.id+'" style="border-radius:0"></canvas><div class="cap"><span>'+v.name+'</span><span class="muted small">+ Use sample</span></div></div>').join('')+'</div>'+
    '<div class="fld"><label>Or upload your own photo</label><input type="file" accept="image/*" data-up="photo"><div class="small muted">JPG or PNG. In this demo the image stays in your browser.</div></div>'+
    (d.photos.length?'<h3 style="margin-top:22px">Your photos</h3><div class="grid g3">'+d.photos.map((p,i)=>'<div class="tile '+(d.primary===i?'sel':'')+'"><canvas class="art" data-paint="photo:'+i+'" style="border-radius:0"></canvas><div class="cap"><label style="margin:0;font-weight:600;display:flex;gap:6px;align-items:center"><input type="radio" name="prim" '+(d.primary===i?'checked':'')+' data-act="primary" data-i="'+i+'"> Primary</label><button class="link" data-act="rmphoto" data-i="'+i+'">Remove</button></div></div>').join('')+'</div>':'<div class="card flat center muted" style="background:var(--mist)">No photos yet. Pick a sample or upload one.</div>')+'<div class="err" id="ferr"></div></div>';
  } else if(d.step===3){
    b='<div class="card"><h3>How should it feel?</h3><p class="muted small">Pick what matters most. The '+cult(d.type).name+' culture card is applied automatically.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">'+PREFS.map(p=>'<span class="chip '+(d.prefs.includes(p)?'on':'')+'" data-act="pref" data-p="'+p+'">'+p+'</span>').join('')+'</div>'+
    '<div class="fld"><label>Tell us how you want it to feel</label><textarea data-bind="prompt" placeholder="e.g. Warm and welcoming, lots of marigold, soft lighting over the dining tables">'+esc(d.prompt)+'</textarea></div>'+
    '<div class="row"><div class="fld"><label>Keep unchanged (optional)</label><input data-bind="keep" value="'+esc(d.keep)+'" placeholder="e.g. the stage and the windows"></div><div class="fld"><label>Inspiration image (optional)</label><input type="file" accept="image/*" data-up="inspo"><div class="small muted">'+(d.inspo?'Added: '+esc(d.inspo):'No image added')+'</div></div></div>'+
    '<div class="fld"><label>Vendor-inspired design (optional)</label><select data-bind="vendorInspo"><option value="">No, use the culture card only</option>'+VENDORS.filter(v=>v.cat==='Decorators'||v.cat==='Florists').map(v=>'<option value="'+v.id+'" '+(d.vendorInspo===v.id?'selected':'')+'>Use '+v.name+'\'s portfolio as extra reference</option>').join('')+'</select></div></div>';
  } else {
    const c=cult(d.type),p=d.photos[d.primary];
    b='<div class="grid g2"><div class="card"><h3>Review your brief</h3><table class="t"><tbody>'+[['Event',d.name+' ('+c.name+')'],['Date',niceDate(d.date)],['Guests',d.guests],['Budget',d.budget?money(d.budget):'Not set'],['Venue',d.venueName+', '+d.venueCity],['Preferences',d.prefs.join(', ')||'None selected'],['Your prompt',d.prompt||'None'],['Keep unchanged',d.keep||'None'],['Vendor reference',d.vendorInspo?vend(d.vendorInspo).name:'None']].map(r=>'<tr><td style="width:36%"><b>'+r[0]+'</b></td><td>'+esc(r[1])+'</td></tr>').join('')+'</tbody></table></div>'+
    '<div><div class="card"><canvas class="art" data-paint="photo:'+d.primary+'"></canvas><div class="small muted" style="margin-top:8px">Primary venue photo</div></div><div class="card" style="margin-top:14px"><b>What happens next</b><ul class="checklist" style="margin-top:8px"><li><span class="tick">&#10003;</span>The '+c.name+' culture card ('+c.card+', draft) is applied</li><li><span class="tick">&#10003;</span>Four concepts are generated from your photo</li><li><span class="tick">&#10003;</span>Each is checked against the card</li></ul><div class="small muted">'+(S.unlocked?'This generation uses 1 of your '+S.credits+' credits.':(S.freeUsed?'Your free preview is used. A subscription is needed to generate again.':'Your first preview is free.'))+'</div></div></div></div>';
  }
  return '<section class="sec" style="padding-top:36px"><div class="wrap"><div class="mono">Generate Space</div><h2>Generate a space</h2><div class="stepper">'+steps.map((s,i)=>'<div class="'+(d.step===i+1?'on':(d.step>i+1?'done':''))+'">'+(i+1)+'. '+s+'</div>').join('')+'</div>'+b+
  '<div style="display:flex;justify-content:space-between;margin-top:20px;gap:10px"><button class="btn" '+(d.step===1?'disabled':'')+' data-act="cback">Back</button>'+(d.step<4?'<button class="btn p" data-act="cnext">Continue</button>':'<button class="btn p lg" data-act="generate">Generate my designs</button>')+'</div></div></section>';
};

function runGen(opts){
  opts=opts||{};const d=S.draft,c=cult(d.type);
  const steps=['Reading your venue photo','Applying the '+c.name+' culture card ('+c.card+', draft)','Generating four concepts'+(d.vendorInspo?' with '+vend(d.vendorInspo).name+' as reference':''),'Checking each concept against the card','Retrying a concept that missed an item','Done'];
  openModal('<h3>Creating your designs</h3><div class="bar"><i id="gbar"></i></div><ul class="gsteps" id="gsteps">'+steps.map((s,i)=>'<li data-i="'+i+'">'+s+'</li>').join('')+'</ul>');
  let i=0;
  const tick=()=>{
    $$('#gsteps li').forEach((li,k)=>{li.className=k<i?'done':(k===i?'on':'')});
    const bar=$('#gbar');if(bar)bar.style.width=Math.round(i/(steps.length-1)*100)+'%';
    if(i>=steps.length-1){setTimeout(()=>{finishGen(opts);},500);return}
    i++;setTimeout(tick,i===3?1100:800);
  };tick();
}
function mkDesigns(ev,vendorInspo,src){
  const c=cult(ev.type),base=100+(S.ids.g+1)*13;
  return VARIANTS.map((v,i)=>{
    const miss=v.key==='minimal'?[c.must[4]]:[];
    return{id:'g'+(++S.ids.g),eventId:ev.id,culture:ev.type,variant:v.key,vname:v.name,seed:base+i*17,src:src,
      checks:c.must.map(m=>!miss.includes(m)),retried:v.key==='minimal'?2:(v.key==='lavish'?1:0),status:miss.length?'review':'passed',fav:false,ver:1,vendorInspo:vendorInspo||''};
  });
}
function finishGen(opts){
  const d=S.draft;
  const ev={id:'e'+(++S.ids.e),name:d.name||'My event',type:d.type,date:d.date,guests:d.guests,budget:d.budget,venueName:d.venueName,venueCity:d.venueCity,status:'Designs ready',final:null,created:Date.now()};
  S.events.unshift(ev);S.cur=ev.id;
  const src=refOf(d.photos[d.primary]);
  S.designs=mkDesigns(ev,d.vendorInspo,src).concat(S.designs);
  if(S.unlocked)S.credits=Math.max(0,S.credits-1);else S.freeUsed=true;
  S.viewD=S.designs[0].id;flag('gen');flag('paywall');
  notify('Four designs are ready for "'+ev.name+'".');save();closeModal();go('/results');
}
function ticksFor(d){const c=cult(d.culture);return d.checks.filter(Boolean).length+' of '+c.must.length}
function maxVendors(){return !S.plan?3:(S.plan.id==='premium'?5:6)}

VIEWS['/results']=function(){
  if(S.role!=='customer')return gate();
  const ev=S.events.find(e=>e.id===S.cur);
  if(!ev)return '<section class="sec center"><div class="wrap"><h2>No designs yet</h2><p class="muted">Create your first design to see results here.</p><a class="btn p" href="#/create">Create a design</a></div></section>';
  const ds=S.designs.filter(d=>d.eventId===ev.id),c=cult(ev.type),vd=ds.find(d=>d.id===S.viewD)||ds[0];
  const ms=matchVendors(ev.type);
  const dcs=ds.map(d=>'<div class="dc"><canvas class="art" data-paint="design:'+d.id+'" style="border-radius:0"></canvas><div class="bd"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b>'+esc(d.vname)+(d.ver>1?' v'+d.ver:'')+'</b>'+(d.status==='review'?'<span class="badge warn">Needs review '+ticksFor(d)+'</span>':'<span class="badge ok">&#10003; Checked '+ticksFor(d)+'</span>')+'</div>'+
    '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap"><span class="badge draft">Draft rules '+c.card+'</span>'+(d.retried?'<span class="badge">'+d.retried+' retr'+(d.retried>1?'ies':'y')+'</span>':'')+(d.vendorInspo?'<span class="badge">Inspired by '+esc(vend(d.vendorInspo).name)+'</span>':'')+(ev.final===d.id?'<span class="badge ok">Selected design</span>':'')+'</div>'+
    '<div class="ac"><button class="btn sm" data-act="dcompare" data-id="'+d.id+'">Compare</button><button class="btn sm" data-act="dcheck" data-id="'+d.id+'">Cultural check</button><button class="btn sm '+(d.fav?'b':'')+'" data-act="dfav" data-id="'+d.id+'">'+(d.fav?'&#9829; Saved':'&#9825; Save')+'</button><button class="btn sm" data-act="ddl" data-id="'+d.id+'">Download</button><button class="btn sm" data-act="drefine" data-id="'+d.id+'">Refine</button><button class="btn sm" data-act="dreport" data-id="'+d.id+'">Report</button><button class="btn sm p" data-act="dfinal" data-id="'+d.id+'">Use this design</button></div></div></div>').join('');
  const chk='<div class="card" style="margin-top:20px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><h3 style="margin:0">Cultural check: '+esc(vd.vname)+'</h3><span class="badge draft">Draft rules '+c.card+'. Pending expert sign-off</span></div><div class="grid g2" style="margin-top:12px"><div><div class="mono">Must include</div><ul class="checklist">'+c.must.map((m,i)=>'<li>'+(vd.checks[i]?'<span class="tick">&#10003;</span>':'<span class="cross">&#10007;</span>')+'<span>'+esc(m)+(vd.checks[i]?'':' <span class="badge warn">missing after 2 retries</span>')+'</span></li>').join('')+'</ul></div><div><div class="mono">Must avoid</div><ul class="checklist">'+c.avoid.map(a=>'<li><span class="tick">&#10003;</span><span>'+esc(a)+' <span class="muted">(none found)</span></span></li>').join('')+'</ul><p class="small muted" style="margin:8px 0 0">The automatic check can miss things. Report anything that looks wrong and an expert will review it.</p></div></div></div>';
  const vgrid='<div class="grid g3">'+ms.map(v=>vcard(v,{cid:ev.type,select:true})).join('')+'</div>';
  const locked=!S.unlocked;
  return '<section class="sec" style="padding-top:30px"><div class="wrap"><div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px"><div><div class="mono">Your designs</div><h2 style="margin:0">'+esc(ev.name)+'</h2><div class="muted small">'+c.name+' &middot; '+niceDate(ev.date)+' &middot; '+ev.guests+' guests &middot; '+esc(ev.venueName)+'</div></div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="badge '+(S.unlocked?'ok':'draft')+'">'+(S.unlocked?S.credits+' credits left':(S.freeUsed?'Free preview used':'Free preview'))+'</span><button class="btn sm" data-act="regen">Regenerate all</button><a class="btn sm" href="#/create" data-act="editbrief">Edit brief</a></div></div>'+
  (locked?'<div class="banner"><div class="grow"><b>Your vendor shortlist is ready.</b><div class="small">Six vendors match this design. Subscribe to unlock contact details and send quote requests.</div></div><button class="btn p" data-act="paywall">Unlock vendors</button></div>':'<div class="banner" style="background:#dff1e4"><div class="grow"><b>Vendors unlocked.</b><div class="small">Select up to '+maxVendors()+' vendors and request quotes with your chosen design.</div></div><button class="btn p" data-act="rqsel">Request quotes ('+S.sel.length+')</button></div>')+
  '<div class="grid g2">'+dcs+'</div>'+chk+
  '<div style="margin-top:44px"><div class="mono">Matched to your design</div><h2>Vendors who can bring this to life</h2></div>'+
  (locked?'<div class="lockwrap"><div class="locked">'+vgrid+'</div><div class="lockcard"><div class="ic">&#128274;</div><h3>Subscribe to contact vendors</h3><p class="muted small">Your design is saved. A subscription unlocks vendor contact, quote requests and more credits. You get a subscription key straight away.</p><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn p" data-act="paywall">See plans</button><button class="btn" data-act="haveKey">I have a key</button></div></div></div>':vgrid)+'</div></section>';
};

/* ----- paywall and subscription ----- */
function mkKey(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='EC';for(let i=0;i<3;i++){s+='-';for(let j=0;j<4;j++)s+=a[Math.floor(Math.random()*a.length)]}return s}
function subHtml(){
  const st=S.sub.stage,p=PLANS.find(x=>x.id===S.sub.plan)||PLANS[0];
  if(st==='plans')return '<div class="mono">Subscription</div><h3>Unlock vendors and credits</h3><p class="muted small">Pick a plan. You get a subscription key immediately. Demo prices; no real payment is taken.</p><div class="grid" style="gap:10px">'+PLANS.map(x=>'<div class="card" style="display:flex;justify-content:space-between;gap:10px;align-items:center;cursor:pointer;'+(x.pop?'border-color:var(--ink)':'')+'" data-act="choosePlan" data-id="'+x.id+'"><div><b>'+x.name+'</b> '+(x.pop?'<span class="badge draft">Popular</span>':'')+'<div class="small muted">'+x.credits+' credits &middot; '+x.feats[1]+'</div></div><div><b>'+money(x.price)+'</b><span class="small muted">/mo</span></div></div>').join('')+'</div><hr style="border:0;border-top:1px solid var(--chalk);margin:18px 0"><div class="fld"><label>Already have a subscription key?</label><div class="row" style="flex-wrap:nowrap"><input id="keyin" placeholder="EC-XXXX-XXXX-XXXX" style="flex:2"><button class="btn" style="flex:1;min-width:90px" data-act="applyKey">Apply</button></div><div class="small muted">Demo tip: <b>EC-DEMO-2026</b> always works.</div><div class="err" id="kerr"></div></div>';
  if(st==='pay')return '<div class="mono">Checkout</div><h3>'+p.name+' plan</h3><table class="t" style="margin-bottom:14px"><tbody><tr><td>'+p.name+' plan, monthly</td><td style="text-align:right">'+money(p.price)+'</td></tr><tr><td>Included</td><td style="text-align:right">'+p.credits+' AI credits</td></tr><tr><td>VAT (shown at checkout)</td><td style="text-align:right">'+money(Math.round(p.price*0.2*100)/100)+'</td></tr><tr><td><b>Total today</b></td><td style="text-align:right"><b>'+money(Math.round(p.price*1.2*100)/100)+'</b></td></tr></tbody></table><div class="card flat" style="background:var(--mist)"><b>Payment method</b><div class="small muted">Test card &bull;&bull;&bull;&bull; 4242. This is a demo; no money moves.</div></div><p class="small muted" style="margin-top:10px">Renews monthly. Cancel before the next billing date. By paying you accept the subscription Terms.</p><div style="display:flex;gap:8px;justify-content:space-between"><button class="btn" data-act="subback">Back</button><button class="btn p" data-act="payNow" id="paybtn">Pay '+money(Math.round(p.price*1.2*100)/100)+' (test mode)</button></div>';
  return '<div class="center"><div style="width:46px;height:46px;border-radius:50%;background:var(--yellow);border:1.5px solid var(--ink);display:grid;place-items:center;margin:0 auto 10px;font-size:1.2rem">&#10003;</div><h3>You\'re subscribed</h3><p class="muted">Here is your subscription key. Keep it safe: you can enter it on any device to unlock vendors.</p><div class="keybox" id="keybox">'+esc(S.key)+'</div><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn" data-act="copyKey">Copy key</button><button class="btn p" data-act="subdone">Unlock my vendors</button></div><p class="small muted" style="margin-top:12px">'+S.credits+' credits added to your account.</p></div>';
}
function paywall(){S.sub.stage='plans';openModal(subHtml())}
function unlock(planId){
  const p=PLANS.find(x=>x.id===planId)||PLANS[0];S.plan={id:p.id,name:p.name};S.credits=(S.credits||0)+p.credits;S.unlocked=true;
}

/* ----- vendor profile + quote request ----- */
function vAvail(v){const off=S.avail[v.id]||[];const out=[];for(let i=8;out.length<6&&i<40;i+=2){const dt=inDays(i);if(!off.includes(dt))out.push(dt)}return out}
function profileModal(id){
  const v=vend(id),open=S.unlocked&&S.role==='customer';
  openModal('<div style="height:110px;border-radius:12px;background:linear-gradient(135deg,'+v.c[0]+','+v.c[1]+');margin:-6px 0 14px;position:relative"><span class="badge" style="position:absolute;right:10px;top:10px">Sample vendor</span></div><h3>'+esc(v.name)+'</h3><div class="muted small">'+esc(v.cat)+' &middot; '+esc(v.city)+' &middot; &#9733; '+v.rating+' ('+v.jobs+' jobs, sample data) &middot; '+v.price+'</div><p style="margin-top:10px">'+esc(v.blurb)+'</p>'+
  '<div class="mono">Specialties</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 14px">'+v.skills.map(s=>'<span class="badge">'+esc(s)+'</span>').join('')+v.cultures.map(c=>'<span class="badge ok">'+cult(c).name+'</span>').join('')+'</div>'+
  '<div class="mono">Portfolio</div><div class="grid g3" style="margin:6px 0 14px">'+[0,1,2].map(i=>'<div style="aspect-ratio:1;border-radius:10px;background:linear-gradient('+(120+i*50)+'deg,'+v.c[i%2]+','+v.c[(i+1)%2]+');display:grid;place-items:end start;padding:8px;color:#fff;font-size:.75rem;text-shadow:0 1px 4px rgba(0,0,0,.4)">Past work '+(i+1)+'</div>').join('')+'</div>'+
  '<div class="mono">Next available dates</div><div class="small muted" style="margin:6px 0 16px">'+vAvail(v).slice(0,4).map(niceDate).join(' &middot; ')+'</div>'+
  (open?'<button class="btn p" data-act="rq" data-id="'+v.id+'">Request a quote</button>':'<button class="btn b" data-act="paywall">&#128274; Subscribe to contact this vendor</button>'));
}
function rqModal(){
  const ev=S.events.find(e=>e.id===S.cur);
  if(!ev){openModal('<h3>Create a design first</h3><p class="muted">Quote requests include your chosen design, so make one first.</p><a class="btn p" href="#/create">Create a design</a>');return}
  const des=S.designs.find(d=>d.id===ev.final)||S.designs.find(d=>d.eventId===ev.id);
  const vs=S.sel.map(vend);
  openModal('<div class="mono">Quote request</div><h3>Ask '+vs.length+' vendor'+(vs.length>1?'s':'')+' for a quote</h3><div class="grid g2"><div><canvas class="art" data-paint="design:'+des.id+'"></canvas><div class="small muted" style="margin-top:6px">Attached: '+esc(des.vname)+(ev.final===des.id?' (your selected design)':'')+'</div></div><div><b>'+esc(ev.name)+'</b><div class="small muted">'+cult(ev.type).name+' &middot; '+niceDate(ev.date)+' &middot; '+ev.guests+' guests &middot; '+esc(ev.venueName)+', '+esc(ev.venueCity)+'</div><div style="margin:10px 0;display:flex;gap:6px;flex-wrap:wrap">'+vs.map(v=>'<span class="badge">'+esc(v.name)+'</span>').join('')+'</div><div class="fld"><label>Anything the vendor should know?</label><textarea id="rqnote" placeholder="Access times, must-have items, dietary needs...">Please quote for the full design shown, including setup and take-down.</textarea></div></div></div><div style="display:flex;justify-content:flex-end"><button class="btn p" data-act="sendQuotes">Send request</button></div>');
}
function vendorPrice(v,ev,i){const f=.9+((v.base+i*37)%30)/100;return Math.round(v.base*f*(ev.guests>150?1.15:1)/10)*10}
function sendQuotes(){
  const ev=S.events.find(e=>e.id===S.cur),des=S.designs.find(d=>d.id===ev.final)||S.designs.find(d=>d.eventId===ev.id),note=($('#rqnote')||{}).value||'';
  S.sel.forEach((vid,i)=>{
    const v=vend(vid),q={id:'q'+(++S.ids.q),vendorId:vid,eventId:ev.id,designId:des.id,service:v.cat,price:null,status:'Awaiting quote',rc:0,rv:0,chat:[{f:'me',t:note||'Hi, we would like a quote for this design.'}],created:Date.now()};
    S.quotes.unshift(q);
    setTimeout(()=>{const qq=S.quotes.find(x=>x.id===q.id);if(!qq)return;qq.price=vendorPrice(v,ev,i);qq.status='Quote received';qq.chat.push({f:'v',t:'Thanks for the details. Our quote is '+money(qq.price)+' including setup and take-down.'});notify(v.name+' sent you a quote: '+money(qq.price));save();if((location.hash||'').indexOf('quotes')>-1)render()},1600+i*1100);
  });
  ev.status='Quotes requested';flag('quote');S.sel=[];closeModal();save();notify('Quote requests sent to '+S.quotes.filter(q=>q.eventId===ev.id).length+' vendor(s).');go('/quotes');toast('Quote requests sent. Replies arrive in a moment.');
}

/* ----- quotes ----- */
const stBadge=s=>'<span class="badge '+({'Quote received':'ok','Accepted':'ok','Booked':'ok','Rejected':'bad','Negotiation':'warn'}[s]||'')+'">'+s+'</span>';
VIEWS['/quotes']=function(){
  if(S.role!=='customer')return gate();
  const rows=S.quotes.map(q=>{const v=vend(q.vendorId),ev=S.events.find(e=>e.id===q.eventId);return '<tr><td><input type="checkbox" data-act="qcmp" data-id="'+q.id+'" '+(S.cmp.includes(q.id)?'checked':'')+'></td><td><b>'+esc(v.name)+'</b><div class="small muted">'+esc(q.service)+'</div></td><td>'+esc(ev?ev.name:'')+'</td><td>'+(q.price?money(q.price):'<span class="muted">Waiting...</span>')+'</td><td>'+stBadge(q.status)+'</td><td><button class="btn sm" data-act="qopen" data-id="'+q.id+'">Open</button></td></tr>'}).join('');
  return '<section class="sec" style="padding-top:36px"><div class="wrap"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:flex-end"><div><div class="mono">Quotations</div><h2>Your quote requests</h2></div><button class="btn" data-act="qcompare">Compare selected</button></div>'+
  (rows?'<div class="tw"><table class="t"><thead><tr><th></th><th>Vendor</th><th>Event</th><th>Quote</th><th>Status</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>':'<div class="card center muted">No quote requests yet. Find vendors from your results page.<div class="sp"></div><a class="btn p" href="#/results">See my designs</a></div>')+'</div></section>';
};
function qModal(id){
  const q=S.quotes.find(x=>x.id===id);if(!q)return;const v=vend(q.vendorId);
  const live=q.status==='Quote received'||q.status==='Negotiation';
  openModal('<div class="mono">Quotation</div><h3>'+esc(v.name)+'</h3><div class="muted small">'+esc(q.service)+' &middot; '+stBadge(q.status)+'</div><div style="display:flex;justify-content:space-between;align-items:baseline;margin:10px 0"><span class="muted small">Current quote</span><b style="font:400 2rem Bricolage Grotesque,sans-serif">'+(q.price?money(q.price):'Waiting for reply')+'</b></div>'+
  '<div class="small muted">Negotiation: you have used '+q.rc+' of 3 rounds; vendor '+q.rv+' of 3.</div><div class="chat" id="chatbox">'+q.chat.map(m=>'<div class="msg '+(m.f==='me'?'me':'')+'">'+esc(m.t)+'</div>').join('')+'</div>'+
  (live?'<div class="row" style="flex-wrap:nowrap;align-items:flex-end"><div class="fld" style="margin:0;flex:2"><label>Counter offer (£)</label><input id="counter" type="number" min="1" placeholder="e.g. '+Math.round(q.price*.85/10)*10+'"></div><button class="btn" style="flex:1;min-width:110px" data-act="qcounter" data-id="'+q.id+'" '+(q.rc>=3?'disabled':'')+'>Send offer</button></div><div class="err" id="qerr"></div><div style="display:flex;gap:8px;justify-content:space-between;margin-top:14px"><button class="btn" data-act="qreject" data-id="'+q.id+'">Reject</button><button class="btn p" data-act="qaccept" data-id="'+q.id+'">Accept this quote</button></div>':'')+
  (q.status==='Accepted'?'<button class="btn p" style="margin-top:10px" data-act="qbook" data-id="'+q.id+'">Book and pay</button>':''));
  const cb=$('#chatbox');if(cb)cb.scrollTop=cb.scrollHeight;
}
function counter(id){
  const q=S.quotes.find(x=>x.id===id),v=vend(q.vendorId),val=+($('#counter')||{}).value;
  if(!val||val<=0){$('#qerr').textContent='Enter an amount.';return}
  if(val>=q.price){$('#qerr').textContent='Your offer should be lower than the current quote.';return}
  if(q.rc>=3){$('#qerr').textContent='You have used all three negotiation rounds.';return}
  q.rc++;q.chat.push({f:'me',t:'Could you do '+money(val)+'?'});save();qModal(id);
  setTimeout(()=>{
    if(val>=q.price*.9||q.rv>=3){q.price=val;q.chat.push({f:'v',t:'That works. '+money(val)+' it is.'});q.status='Quote received'}
    else{q.rv++;const np=Math.round((q.price+val)/2/10)*10;q.price=np;q.chat.push({f:'v',t:'We can meet you at '+money(np)+'.'});q.status='Negotiation'}
    notify(v.name+' replied to your offer.');save();const m=$('.mbox');if(m&&m.textContent.indexOf(v.name)>-1&&m.textContent.indexOf('Quotation')>-1)qModal(id);if(location.hash.indexOf('quotes')>-1)render()
  },1300);
}
function compareModal(){
  const qs=S.quotes.filter(q=>S.cmp.includes(q.id)&&q.price);
  if(qs.length<2){toast('Tick at least two quotes that have a price.');return}
  openModal('<h3>Compare quotes</h3><div class="tw"><table class="t"><thead><tr><th>Vendor</th><th>Service</th><th>City</th><th>Rating</th><th>Quote</th><th>Status</th></tr></thead><tbody>'+qs.map(q=>{const v=vend(q.vendorId);return '<tr><td><b>'+esc(v.name)+'</b></td><td>'+esc(q.service)+'</td><td>'+esc(v.city)+'</td><td>&#9733; '+v.rating+'</td><td><b>'+money(q.price)+'</b></td><td>'+stBadge(q.status)+'</td></tr>'}).join('')+'</tbody></table></div>',true);
}
function bookModal(id){
  const q=S.quotes.find(x=>x.id===id),v=vend(q.vendorId),ev=S.events.find(e=>e.id===q.eventId);
  openModal('<div class="mono">Booking</div><h3>Book '+esc(v.name)+'</h3><table class="t" style="margin:10px 0"><tbody><tr><td>Service</td><td>'+esc(q.service)+'</td></tr><tr><td>Event</td><td>'+esc(ev.name)+', '+niceDate(ev.date)+'</td></tr><tr><td>Agreed price</td><td><b>'+money(q.price)+'</b></td></tr></tbody></table><div class="fld"><label>Payment arrangement (to be confirmed with the client)</label><select id="payopt"><option value="full">Pay in full now</option><option value="dep">Pay a 30% deposit now, the rest later</option></select></div><div class="card flat" style="background:var(--mist)"><b>Your money is held safely.</b><div class="small muted">Payment is held by the platform until the service is complete. Then the vendor requests a payout. Test mode: no real payment.</div></div><div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn p" data-act="payBooking" data-id="'+id+'">Pay and confirm booking (test)</button></div>');
}
function payBooking(id){
  const q=S.quotes.find(x=>x.id===id),opt=$('#payopt').value,ev=S.events.find(e=>e.id===q.eventId);
  const paid=opt==='dep'?Math.round(q.price*.3):q.price;
  S.bookings.unshift({id:'b'+(++S.ids.b),quoteId:id,vendorId:q.vendorId,eventId:ev.id,service:q.service,amount:q.price,paid:paid,date:ev.date||inDays(14),status:'Confirmed',rs:0});
  q.status='Booked';ev.status='Booked';flag('book');notify('Booking confirmed with '+vend(q.vendorId).name+'. '+money(paid)+' is held.');save();closeModal();go('/bookings');toast('Booking confirmed. Funds are held until the job is done.');
}
VIEWS['/bookings']=function(){
  if(S.role!=='customer')return gate();
  const rows=S.bookings.map(b=>{const v=vend(b.vendorId),ev=S.events.find(e=>e.id===b.eventId);
    return '<tr><td><b>'+esc(v.name)+'</b><div class="small muted">'+esc(b.service)+'</div></td><td>'+esc(ev?ev.name:'')+'</td><td>'+niceDate(b.date)+'</td><td>'+money(b.amount)+'<div class="small muted">'+money(b.paid)+' held</div></td><td><span class="badge '+(b.status==='Completed'?'ok':(b.status==='Disputed'?'bad':''))+'">'+b.status+'</span></td><td>'+(b.status==='Confirmed'?'<button class="btn sm" data-act="bres" data-id="'+b.id+'">Reschedule</button> <button class="btn sm p" data-act="bcomplete" data-id="'+b.id+'">Mark complete</button> <button class="btn sm" data-act="bdispute" data-id="'+b.id+'">Raise dispute</button>':'')+'</td></tr>'}).join('');
  return '<section class="sec" style="padding-top:36px"><div class="wrap"><div class="mono">Bookings</div><h2>My bookings</h2>'+(rows?'<div class="tw"><table class="t"><thead><tr><th>Vendor</th><th>Event</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>':'<div class="card center muted">No bookings yet. Accept a quote to book a vendor.<div class="sp"></div><a class="btn p" href="#/quotes">See my quotes</a></div>')+'</div></section>';
};
function reschedModal(id){
  const b=S.bookings.find(x=>x.id===id),v=vend(b.vendorId);
  openModal('<h3>Reschedule with '+esc(v.name)+'</h3><p class="muted small">Only dates this vendor has marked available are shown.</p><div class="fld"><select id="newdate">'+vAvail(v).map(d=>'<option value="'+d+'">'+niceDate(d)+'</option>').join('')+'</select></div><button class="btn p" data-act="doRes" data-id="'+id+'">Confirm new date</button>');
}
function disputeModal(id){openModal('<h3>Raise a dispute</h3><p class="muted small">Tell us what went wrong. The payment stays held while our team reviews it.</p><div class="fld"><textarea id="dreason" placeholder="What happened?"></textarea></div><button class="btn p" data-act="doDispute" data-id="'+id+'">Submit dispute</button>')}

/* ----- dashboard, events, profile, notifications ----- */
VIEWS['/dashboard']=function(){
  if(S.role!=='customer')return gate();
  const act=S.quotes.filter(q=>q.status!=='Rejected'&&q.status!=='Booked').length,conf=S.bookings.filter(b=>b.status==='Confirmed').length;
  const stats=[[S.events.length,'Active events'],[S.designs.length,'AI designs'],[act,'Open quote requests'],[conf,'Confirmed bookings'],[S.unlocked?S.credits:(S.freeUsed?0:1),S.unlocked?'AI credits left':'Free previews left']];
  return '<section class="sec" style="padding-top:36px"><div class="wrap"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:flex-end"><div><div class="mono">Dashboard</div><h2>Welcome back, '+esc(S.user.name.split(' ')[0])+'</h2></div><div style="display:flex;gap:8px"><button class="btn" data-act="export">Export summary</button><a class="btn p" href="#/create">Create event</a></div></div><div class="grid g4" style="grid-template-columns:repeat(5,1fr);margin:20px 0" id="stats">'+stats.map(s=>'<div class="stat"><b>'+s[0]+'</b><span>'+s[1]+'</span></div>').join('')+'</div><style>@media(max-width:900px){#stats{grid-template-columns:repeat(2,1fr)!important}}</style>'+
  '<div class="grid g2"><div><h3>Recent and upcoming events</h3>'+(S.events.length?S.events.slice(0,4).map(e=>'<div class="card" style="margin-bottom:10px;display:flex;justify-content:space-between;gap:10px;align-items:center"><div><b>'+esc(e.name)+'</b><div class="small muted">'+cult(e.type).name+' &middot; '+niceDate(e.date)+' &middot; '+esc(e.venueName)+'</div></div><div><span class="badge">'+e.status+'</span> <button class="btn sm" data-act="eopen" data-id="'+e.id+'">Open</button></div></div>').join(''):'<div class="card center muted">No events yet.<div class="sp"></div><a class="btn p sm" href="#/create">Create your first event</a></div>')+'</div>'+
  '<div><h3>Recent activity</h3>'+(S.notes.length?'<div class="card">'+S.notes.slice(0,6).map(n=>'<div style="padding:8px 0;border-bottom:1px solid var(--chalk)">'+esc(n.text)+'<div class="small muted">'+new Date(n.t).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})+'</div></div>').join('')+'</div>':'<div class="card center muted">No activity yet.</div>')+'</div></div></div></section>';
};
VIEWS['/events']=function(){
  if(S.role!=='customer')return gate();
  return '<section class="sec" style="padding-top:36px"><div class="wrap"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:flex-end"><div><div class="mono">My events</div><h2>Your events</h2></div><a class="btn p" href="#/create">Create event</a></div><div class="grid g3" style="margin-top:20px">'+
  (S.events.length?S.events.map(e=>{const d=S.designs.find(x=>x.eventId===e.id);return '<div class="dc"><canvas class="art" style="border-radius:0" data-paint="design:'+(d?d.id:'')+'"></canvas><div class="bd"><b>'+esc(e.name)+'</b><div class="small muted">'+cult(e.type).name+' &middot; '+niceDate(e.date)+' &middot; '+e.guests+' guests</div><div style="margin:6px 0"><span class="badge">'+e.status+'</span> <span class="badge">'+S.designs.filter(x=>x.eventId===e.id).length+' designs</span> <span class="badge">'+S.quotes.filter(x=>x.eventId===e.id).length+' quotes</span></div><div class="ac"><button class="btn sm p" data-act="eopen" data-id="'+e.id+'">Open</button><button class="btn sm" data-act="eresults" data-id="'+e.id+'">Designs</button></div></div></div>'}).join(''):'<div class="card center muted" style="grid-column:1/-1">No events yet. Create one to get started.</div>')+'</div></div></section>';
};
function eventModal(id){
  const e=S.events.find(x=>x.id===id),bk=S.bookings.filter(b=>b.eventId===id);
  openModal('<div class="mono">Event details</div><h3>'+esc(e.name)+'</h3><table class="t"><tbody>'+[['Type',cult(e.type).name],['Date',niceDate(e.date)],['Guests',e.guests],['Budget',e.budget?money(e.budget):'Not set'],['Venue',e.venueName+', '+e.venueCity],['Status',e.status],['Designs',S.designs.filter(d=>d.eventId===id).length],['Quote requests',S.quotes.filter(q=>q.eventId===id).length],['Confirmed bookings',bk.length]].map(r=>'<tr><td style="width:40%"><b>'+r[0]+'</b></td><td>'+esc(r[1])+'</td></tr>').join('')+'</tbody></table>'+(bk.length?'<p class="small muted">This event has a confirmed booking. Changing the date may affect the vendor.</p>':'')+'<div style="display:flex;gap:8px;margin-top:12px"><button class="btn" data-act="eresults" data-id="'+id+'">View designs</button><button class="btn" data-act="eedit" data-id="'+id+'">Edit details</button></div>');
}
VIEWS['/profile']=function(){
  if(S.role!=='customer')return gate();
  return '<section class="sec" style="padding-top:36px"><div class="wrap grid g2" style="gap:30px"><div class="card"><div class="mono">Profile</div><h3>'+esc(S.user.name)+'</h3><table class="t"><tbody><tr><td><b>Email</b></td><td>'+esc(S.user.email)+'</td></tr><tr><td><b>Mobile</b></td><td>'+esc(S.user.mobile||'')+'</td></tr><tr><td><b>Status</b></td><td><span class="badge ok">Verified</span></td></tr></tbody></table><div style="display:flex;gap:8px;margin-top:14px"><button class="btn" data-act="chpw">Change password</button><button class="btn" data-act="logout">Log out</button></div></div>'+
  '<div class="card"><div class="mono">Subscription</div>'+(S.unlocked?'<h3>'+esc(S.plan?S.plan.name:'Premium')+' plan</h3><p class="muted small">'+S.credits+' credits left. Renews monthly.</p><div class="mono">Your subscription key</div><div class="keybox" style="font-size:1.05rem">'+esc(S.key||'EC-DEMO-2026')+'</div><button class="btn sm" data-act="cancelSub">Cancel subscription (demo)</button>':'<h3>No active plan</h3><p class="muted small">Subscribe to unlock vendors, refinements and more credits.</p><button class="btn p" data-act="paywall">See plans</button>')+'</div></div></section>';
};
VIEWS['/notifications']=function(){
  if(S.role!=='customer')return gate();
  S.notes.forEach(n=>n.read=true);save();
  return '<section class="sec" style="padding-top:36px"><div class="wrap" style="max-width:720px"><div class="mono">Notifications</div><h2>Alerts</h2>'+(S.notes.length?S.notes.map(n=>'<div class="card" style="margin-bottom:10px">'+esc(n.text)+'<div class="small muted">'+new Date(n.t).toLocaleString('en-GB')+'</div></div>').join(''):'<div class="card center muted">Nothing yet.</div>')+'</div></section>';
};
