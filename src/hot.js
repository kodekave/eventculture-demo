/* ===== Shop the look: blinking hotspots on a design, linked to vendor categories ===== */
const HOTS={
  diwali:[
    {x:.50,y:.10,item:'Marigold garlands',cat:'Florists',note:'Fresh or artificial marigold garlands and strands.'},
    {x:.74,y:.21,item:'String lights',cat:'Lighting',note:'Warm fairy lights and canopy lighting.'},
    {x:.50,y:.84,item:'Rangoli at the entrance',cat:'Decorators',note:'Hand-made or powder rangoli designs.'},
    {x:.22,y:.91,item:'Diyas (oil lamps)',cat:'Lighting',note:'Diya displays and lamp arrangements.'},
    {x:.20,y:.36,item:'Hanging strands',cat:'Decorators',note:'Floral and bead strands that hang from the ceiling.'}
  ],
  eid:[
    {x:.50,y:.20,item:'Crescent and star centrepiece',cat:'Decorators',note:'Backdrops and arches with crescent and star motifs.'},
    {x:.08,y:.30,item:'Draped curtains',cat:'Draping and stages',note:'Ceiling drapes, curtains and stage backdrops.'},
    {x:.30,y:.22,item:'Lanterns (fanoos)',cat:'Lighting',note:'Fanoos lanterns and warm lighting.'},
    {x:.72,y:.08,item:'Greenery garland',cat:'Decorators',note:'Green and gold garlands along the top.'},
    {x:.68,y:.64,item:'Table lanterns',cat:'Decorators',note:'Lanterns and centrepieces for the tables.'}
  ],
  lny:[
    {x:.30,y:.18,item:'Red lanterns',cat:'Lighting',note:'Hanging lantern ceilings and lighting.'},
    {x:.06,y:.40,item:'Couplet banners',cat:'Decorators',note:'Red and gold banners with calligraphy.'},
    {x:.13,y:.70,item:'Plum blossom',cat:'Florists',note:'Blossom branches and red-and-gold flowers.'},
    {x:.50,y:.29,item:'Gold knots',cat:'Decorators',note:'Chinese knots and gold accents.'},
    {x:.50,y:.91,item:'Gold ingots',cat:'Decorators',note:'Gold ingot table and floor decor.'}
  ]
};
let HOT=-1;
function hotDesign(){
  const ev=S.events.find(e=>e.id===S.cur);if(!ev)return null;
  const ds=S.designs.filter(d=>d.eventId===ev.id);return ds.find(d=>d.id===S.viewD)||ds[0]||null;
}
function hotVendors(h,cid){
  const inCat=VENDORS.filter(v=>v.cat===h.cat);
  const match=inCat.filter(v=>v.cultures.includes(cid));
  return {all:inCat,match:match.length?match:inCat,exact:match.length>0};
}
function hotSide(){
  const d=hotDesign();if(!d)return '';
  const hs=HOTS[d.culture]||[];
  if(HOT<0||!hs[HOT]){
    return '<div class="mono">Shop the look</div><h3 style="margin:.2em 0 .4em">Explore vendors for each item</h3><p class="muted small">Click a blinking circle on the image to see the vendors who can supply that item.</p><div class="hotlist">'+hs.map((h,i)=>'<button class="hotitem" data-act="hot" data-i="'+i+'"><span class="hn">'+(i+1)+'</span><span><b>'+esc(h.item)+'</b><small>'+esc(h.cat)+' &middot; '+(n=>n+' vendor'+(n>1?'s':''))(hotVendors(h,d.culture).match.length)+'</small></span></button>').join('')+'</div>';
  }
  const h=hs[HOT],v=hotVendors(h,d.culture),nm=cult(d.culture).name;
  return '<button class="link small" data-act="hotback">&larr; All items</button><div class="mono" style="margin-top:8px">Selected item</div><h3 style="margin:.2em 0 .3em">'+esc(h.item)+'</h3><p class="muted small">'+esc(h.note)+'</p>'+
  '<div class="small" style="margin:6px 0 10px"><b>'+v.match.length+' vendor'+(v.match.length>1?'s':'')+'</b> in '+esc(h.cat.toLowerCase())+(v.exact?', listed for '+esc(nm)+' events':' (none list '+esc(nm)+' yet)')+'</div>'+
  '<div class="hotv">'+v.match.slice(0,3).map(x=>'<button class="hv" data-act="vprofile" data-id="'+x.id+'"><span class="sw" style="background:linear-gradient(135deg,'+x.c[0]+','+x.c[1]+')"></span><span><b>'+esc(x.name)+'</b><small>'+esc(x.city)+' &middot; &#9733; '+x.rating+' &middot; '+x.price+'</small></span></button>').join('')+'</div>'+
  '<button class="btn p" style="width:100%;margin-top:12px" data-act="hotgo">See all '+esc(h.cat.toLowerCase())+' &rarr;</button>';
}
function hotViewer(){
  const d=hotDesign();if(!d)return '';
  const hs=HOTS[d.culture]||[];
  return '<div class="shop"><div class="shopimg"><canvas class="art" data-paint="design:'+d.id+'" style="border-radius:0"></canvas>'+
  hs.map((h,i)=>'<button class="hspot'+(i===HOT?' on':'')+'" style="left:'+(h.x*100)+'%;top:'+(h.y*100)+'%" data-act="hot" data-i="'+i+'" aria-label="Explore vendors for '+esc(h.item)+'"></button>').join('')+
  '<span class="shoptag">'+esc(d.vname)+'</span></div><aside class="shopside" id="shopside">'+hotSide()+'</aside></div>';
}
function hotRefresh(){
  const s=$('#shopside');if(s)s.innerHTML=hotSide();
  $$('.shopimg .hspot').forEach((b,i)=>b.classList.toggle('on',i===HOT));
}
ACT.hot=el=>{HOT=+el.dataset.i;hotRefresh()};
ACT.hotback=()=>{HOT=-1;hotRefresh()};
ACT.dview=el=>{S.viewD=el.dataset.id;HOT=-1;save();render();window.scrollTo({top:0,behavior:'smooth'})};
ACT.hotgo=()=>{
  const d=hotDesign();if(!d||HOT<0)return;const h=HOTS[d.culture][HOT],v=hotVendors(h,d.culture);
  S.vf=dvf();S.vf.cat=[h.cat];if(v.exact)S.vf.ev=[d.culture];
  S.vfFrom={item:h.item,cat:h.cat,culture:d.culture};save();go('/vendors');
};
const _results=VIEWS['/results'];
VIEWS['/results']=function(){
  HOT=-1;S.vfFrom=null;
  let html=_results();
  if(S.role!=='customer'||html.indexOf('<div class="grid g2"><div class="dc">')<0)return html;
  html=html.replace('<div class="grid g2"><div class="dc">',hotViewer()+'<div class="grid g2"><div class="dc">');
  html=html.replace(/<canvas class="art" data-paint="design:([^"]+)" style="border-radius:0"><\/canvas><div class="bd">/g,'<canvas class="art" data-act="dview" data-id="$1" data-paint="design:$1" style="border-radius:0;cursor:pointer" title="Click to open this design above"></canvas><div class="bd">');
  return html;
};
const _vendors=VIEWS['/vendors'];
VIEWS['/vendors']=function(){
  let html=_vendors();const f=S.vfFrom;
  if(f)html=html.replace('<div class="vlayout">','<div class="banner" style="background:#fdeaf3"><div class="grow"><b>Showing '+esc(f.cat.toLowerCase())+' for &ldquo;'+esc(f.item)+'&rdquo;</b><div class="small">Filtered from your '+esc(cult(f.culture).name)+' design. Change the filters on the left to widen it.</div></div><a class="btn sm" href="#/results" data-act="hotclear">Back to my design</a></div><div class="vlayout">');
  return html;
};
ACT.hotclear=()=>{S.vfFrom=null};
const _vclear=ACT.vclear;ACT.vclear=()=>{S.vfFrom=null;_vclear()};
