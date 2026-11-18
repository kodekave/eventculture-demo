/* ===== Image drawing: dummy venue photos and decor outputs, all drawn in the browser ===== */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hex2rgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]}
function rgba(h,a){const[r,g,b]=hex2rgb(h);return 'rgba('+r+','+g+','+b+','+a+')'}
function glow(ctx,x,y,r,c,a){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(c,a));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore()}

function roundTable(ctx,x,y,s,cloth){
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(x,y+s*.16,s*.62,s*.2,0,0,7);ctx.fill();
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const cx=x+Math.cos(a)*s*.78,cy=y+Math.sin(a)*s*.27;ctx.fillStyle='#6b5a4a';ctx.beginPath();ctx.ellipse(cx,cy,s*.1,s*.075,0,0,7);ctx.fill()}
  ctx.fillStyle=cloth;ctx.beginPath();ctx.ellipse(x,y,s*.6,s*.2,0,0,7);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(x,y-s*.02,s*.3,s*.08,0,0,7);ctx.fill();
}
function drawVenue(ctx,w,h,type){
  let g;
  if(type==='garden'){
    g=ctx.createLinearGradient(0,0,0,h*.5);g.addColorStop(0,'#bfe3f2');g.addColorStop(1,'#eaf6fb');ctx.fillStyle=g;ctx.fillRect(0,0,w,h*.55);
    ctx.fillStyle='#8fbf86';ctx.beginPath();ctx.moveTo(0,h*.52);ctx.quadraticCurveTo(w*.25,h*.4,w*.5,h*.5);ctx.quadraticCurveTo(w*.8,h*.6,w,h*.46);ctx.lineTo(w,h*.6);ctx.lineTo(0,h*.6);ctx.fill();
    g=ctx.createLinearGradient(0,h*.55,0,h);g.addColorStop(0,'#7fb069');g.addColorStop(1,'#5f9150');ctx.fillStyle=g;ctx.fillRect(0,h*.55,w,h*.45);
    ctx.fillStyle='#f6f3ec';ctx.beginPath();ctx.moveTo(0,h*.3);ctx.lineTo(w*.5,h*.02);ctx.lineTo(w,h*.3);ctx.lineTo(w,h*.34);ctx.lineTo(0,h*.34);ctx.fill();
    ctx.fillStyle='#e6e0d2';ctx.beginPath();ctx.moveTo(0,h*.34);ctx.lineTo(w*.5,h*.12);ctx.lineTo(w,h*.34);ctx.lineTo(w,h*.37);ctx.lineTo(w*.5,h*.16);ctx.lineTo(0,h*.37);ctx.fill();
    ctx.fillStyle='#d8d0bd';[.08,.5,.92].forEach(p=>ctx.fillRect(w*p-5,h*.3,10,h*.3));
    [[.2,.74],[.5,.82],[.8,.74],[.36,.92],[.66,.92]].forEach(p=>roundTable(ctx,w*p[0],h*p[1],w*.17,'#fbf8f1'));
  } else if(type==='restaurant'){
    g=ctx.createLinearGradient(0,0,0,h*.62);g.addColorStop(0,'#8a6048');g.addColorStop(1,'#6b4a3a');ctx.fillStyle=g;ctx.fillRect(0,0,w,h*.62);
    ctx.fillStyle='#5b3f31';ctx.fillRect(0,0,w,h*.07);
    for(let i=0;i<6;i++){ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(w*(.04+i*.16),h*.14,w*.12,h*.36)}
    for(let i=0;i<4;i++){const x=w*(.15+i*.23);ctx.strokeStyle='#2c2118';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h*.18);ctx.stroke();ctx.fillStyle='#d9b27a';ctx.beginPath();ctx.arc(x,h*.2,w*.025,0,Math.PI,false);ctx.fill();glow(ctx,x,h*.22,w*.05,'#FFD27A',.35)}
    g=ctx.createLinearGradient(0,h*.62,0,h);g.addColorStop(0,'#3b2a20');g.addColorStop(1,'#271b14');ctx.fillStyle=g;ctx.fillRect(0,h*.62,w,h*.38);
    ctx.fillStyle='#a9744f';ctx.fillRect(w*.1,h*.7,w*.8,h*.07);ctx.fillStyle='#8c5d3d';ctx.fillRect(w*.1,h*.77,w*.8,h*.03);
    ctx.fillStyle='#4a3326';[.14,.32,.5,.68,.86].forEach(p=>{ctx.fillRect(w*p-16,h*.8,32,h*.12)});
    ctx.fillStyle='#7a5238';[.14,.32,.5,.68,.86].forEach(p=>ctx.fillRect(w*p-22,h*.62,44,h*.08));
  } else {
    g=ctx.createLinearGradient(0,0,0,h*.58);g.addColorStop(0,'#e9e1d2');g.addColorStop(1,'#d6c9b3');ctx.fillStyle=g;ctx.fillRect(0,0,w,h*.58);
    ctx.fillStyle='#cfc3ae';ctx.fillRect(0,0,w,h*.06);
    for(let i=0;i<4;i++){const x=w*(.09+i*.23),y=h*.14,ww=w*.13,hh=h*.32;ctx.fillStyle='#b9cde0';ctx.beginPath();ctx.moveTo(x,y+hh);ctx.lineTo(x,y+ww*.5);ctx.arc(x+ww/2,y+ww*.5,ww/2,Math.PI,0);ctx.lineTo(x+ww,y+hh);ctx.closePath();ctx.fill();ctx.strokeStyle='#a89a82';ctx.lineWidth=4;ctx.stroke()}
    ctx.fillStyle='#8a6f55';ctx.fillRect(w*.3,h*.5,w*.4,h*.08);ctx.fillStyle='#e8dfcf';ctx.fillRect(w*.33,h*.27,w*.34,h*.23);ctx.strokeStyle='#cfc3ae';ctx.lineWidth=3;ctx.strokeRect(w*.33,h*.27,w*.34,h*.23);
    g=ctx.createLinearGradient(0,h*.58,0,h);g.addColorStop(0,'#b08968');g.addColorStop(1,'#8c6a4c');ctx.fillStyle=g;ctx.fillRect(0,h*.58,w,h*.42);
    ctx.strokeStyle='rgba(0,0,0,.08)';ctx.lineWidth=2;for(let i=1;i<9;i++){ctx.beginPath();ctx.moveTo(w*.5,h*.58);ctx.lineTo(w*(i/9)*1.0,h);ctx.stroke()}
    [[.2,.74],[.5,.8],[.8,.74],[.34,.92],[.66,.92]].forEach(p=>roundTable(ctx,w*p[0],h*p[1],w*.17,'#f3eee3'));
  }
}
function drawCover(ctx,img,w,h){const r=Math.max(w/img.width,h/img.height);const iw=img.width*r,ih=img.height*r;ctx.drawImage(img,(w-iw)/2,(h-ih)/2,iw,ih)}

/* ---- decor primitives ---- */
function garland(ctx,x1,y1,x2,y2,sag,cols,r,R){
  const len=Math.hypot(x2-x1,y2-y1)+sag;const n=Math.max(8,Math.floor(len/(r*1.5)));
  ctx.strokeStyle='rgba(60,40,20,.5)';ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<=n;i++){const t=i/n;const x=x1+(x2-x1)*t,y=y1+(y2-y1)*t+Math.sin(Math.PI*t)*sag;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
  for(let i=0;i<=n;i++){const t=i/n;const x=x1+(x2-x1)*t+(R()-.5)*3,y=y1+(y2-y1)*t+Math.sin(Math.PI*t)*sag+(R()-.5)*4;const rr=r*(.85+R()*.35);
    ctx.fillStyle=cols[i%cols.length];ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.28)';ctx.beginPath();ctx.arc(x-rr*.3,y-rr*.3,rr*.35,0,7);ctx.fill()}
}
function strand(ctx,x,y1,y2,cols,r,R){const n=Math.floor((y2-y1)/(r*1.5));for(let i=0;i<=n;i++){const y=y1+i*(y2-y1)/n;ctx.fillStyle=cols[i%cols.length];ctx.beginPath();ctx.arc(x+(R()-.5)*3,y,r*(.85+R()*.3),0,7);ctx.fill()}}
function lights(ctx,x1,y1,x2,y2,sag,n,col,R,gl){
  ctx.strokeStyle='rgba(30,20,10,.55)';ctx.lineWidth=1.2;ctx.beginPath();
  for(let i=0;i<=40;i++){const t=i/40;const x=x1+(x2-x1)*t,y=y1+(y2-y1)*t+Math.sin(Math.PI*t)*sag;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
  for(let i=0;i<=n;i++){const t=i/n;const x=x1+(x2-x1)*t,y=y1+(y2-y1)*t+Math.sin(Math.PI*t)*sag;
    ctx.fillStyle='#fff6d6';ctx.beginPath();ctx.arc(x,y+3,2.6,0,7);ctx.fill();glow(ctx,x,y+3,gl,col,.55)}
}
function lantern(ctx,x,top,y,s,col,R){
  ctx.strokeStyle='rgba(60,20,10,.6)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,y-s*.45);ctx.stroke();
  glow(ctx,x,y,s*1.1,'#FF6A3D',.35);
  const g=ctx.createRadialGradient(x-s*.2,y-s*.2,s*.1,x,y,s*.6);g.addColorStop(0,'#ff6b5a');g.addColorStop(1,col);
  ctx.fillStyle='#E0B04A';ctx.fillRect(x-s*.17,y-s*.5,s*.34,s*.08);
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,s*.5,s*.42,0,0,7);ctx.fill();
  ctx.strokeStyle='rgba(120,10,10,.45)';ctx.lineWidth=1.2;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.ellipse(x,y,s*.5*Math.abs(i)/2.2+.1,s*.42,0,0,7);ctx.stroke()}
  ctx.fillStyle='#E0B04A';ctx.fillRect(x-s*.17,y+s*.4,s*.34,s*.07);
  ctx.strokeStyle='#E0B04A';ctx.lineWidth=1.4;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(x+i*s*.05,y+s*.47);ctx.lineTo(x+i*s*.07,y+s*.47+s*.28+R()*4);ctx.stroke()}
}
function fanoos(ctx,x,top,y,s,col,gl,R){
  ctx.strokeStyle='rgba(20,30,25,.6)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,y-s*.62);ctx.stroke();
  glow(ctx,x,y,s*1.2,'#FFD27A',.38);
  ctx.fillStyle='#D9B35B';ctx.beginPath();ctx.arc(x,y-s*.62,s*.06,0,7);ctx.fill();
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-s*.34,y-s*.28);ctx.quadraticCurveTo(x,y-s*.95,x+s*.34,y-s*.28);ctx.fill();
  ctx.fillStyle=gl;ctx.beginPath();ctx.moveTo(x-s*.34,y-s*.28);ctx.lineTo(x+s*.34,y-s*.28);ctx.lineTo(x+s*.25,y+s*.38);ctx.lineTo(x-s*.25,y+s*.38);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,230,160,.9)';for(let i=-1;i<=1;i++)for(let j=0;j<2;j++){ctx.beginPath();ctx.arc(x+i*s*.14,y-s*.08+j*s*.28,s*.05,0,7);ctx.fill()}
  ctx.strokeStyle='#8a6a1f';ctx.lineWidth=2;ctx.strokeRect(x-s*.34+2,y-s*.28,s*.68-4,s*.1);
  ctx.fillStyle='#D9B35B';ctx.fillRect(x-s*.28,y+s*.38,s*.56,s*.06);
}
function diya(ctx,x,y,s,R){
  glow(ctx,x,y-s*.4,s*2.1,'#FF9A3D',.5);
  ctx.fillStyle='#B5532A';ctx.beginPath();ctx.ellipse(x,y,s,s*.45,0,0,Math.PI);ctx.fill();
  ctx.fillStyle='#8f3d1d';ctx.beginPath();ctx.ellipse(x,y,s,s*.2,0,0,7);ctx.fill();
  ctx.fillStyle='#FFD27A';ctx.beginPath();ctx.moveTo(x,y-s*1.1);ctx.quadraticCurveTo(x+s*.4,y-s*.4,x,y-s*.1);ctx.quadraticCurveTo(x-s*.4,y-s*.4,x,y-s*1.1);ctx.fill();
}
function rangoli(ctx,cx,cy,r,P,R){
  ctx.save();ctx.translate(cx,cy);ctx.scale(1,.34);
  ctx.fillStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.arc(0,0,r*1.08,0,7);ctx.fill();
  const rings=[[1,16,.11],[.78,14,.1],[.56,12,.09],[.36,10,.08]];
  rings.forEach((rg,k)=>{const n=rg[1];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;ctx.fillStyle=[P[0],P[1],P[2],'#fff'][(i+k)%4];ctx.beginPath();ctx.arc(Math.cos(a)*r*rg[0],Math.sin(a)*r*rg[0],r*rg[2],0,7);ctx.fill()}});
  ctx.fillStyle=P[0];ctx.beginPath();for(let i=0;i<16;i++){const a=i/16*Math.PI*2,rr=i%2?r*.12:r*.24;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}ctx.fill();
  ctx.restore();
}
function crescentStar(ctx,x,y,r,col){
  glow(ctx,x,y,r*1.8,col,.35);ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.arc(x+r*.38,y,r*.82,0,Math.PI*2,true);ctx.fill('evenodd');
  const sx=x+r*.62,sy=y-r*.05,sr=r*.3;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?sr*.45:sr;ctx.lineTo(sx+Math.cos(a)*rr,sy+Math.sin(a)*rr)}ctx.closePath();ctx.fill();
}
function geoStar(ctx,x,y,r,col,n){
  ctx.save();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<n*2;i++){const a=i/(n*2)*Math.PI*2,rr=i%2?r*.58:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,r*.38,0,7);ctx.stroke();ctx.beginPath();ctx.arc(x,y,r*1.08,0,7);ctx.stroke();ctx.restore();
}
function blossom(ctx,x1,y1,x2,y2,R){
  ctx.strokeStyle='#4a2c20';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo((x1+x2)/2,y1-30,x2,y2);ctx.stroke();
  for(let i=0;i<46;i++){const t=R();const x=x1+(x2-x1)*t+(R()-.5)*70,y=y1+(y2-y1)*t-Math.sin(Math.PI*t)*22+(R()-.5)*60;ctx.fillStyle=R()>.4?'#F6B6C8':'#fbd6e0';ctx.beginPath();ctx.arc(x,y,4+R()*4,0,7);ctx.fill();ctx.fillStyle='#E8A33D';ctx.beginPath();ctx.arc(x,y,1.5,0,7);ctx.fill()}
}
function couplet(ctx,x,y,w,h,ch){
  ctx.fillStyle='#C8102E';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#F2C14E';ctx.lineWidth=3;ctx.strokeRect(x+5,y+5,w-10,h-10);
  ctx.fillStyle='#F2C14E';ctx.font='700 '+(w*.5)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=0;i<ch.length;i++)ctx.fillText(ch[i],x+w/2,y+h*(.2+i*.3));
}
function ingot(ctx,x,y,s){
  glow(ctx,x,y,s*1.6,'#F2C14E',.3);ctx.fillStyle='#E0A82A';ctx.beginPath();ctx.moveTo(x-s,y-s*.2);ctx.quadraticCurveTo(x-s*.6,y+s*.55,x,y+s*.45);ctx.quadraticCurveTo(x+s*.6,y+s*.55,x+s,y-s*.2);ctx.quadraticCurveTo(x+s*.5,y-s*.45,x,y-s*.35);ctx.quadraticCurveTo(x-s*.5,y-s*.45,x-s,y-s*.2);ctx.fill();
  ctx.fillStyle='#F7D56E';ctx.beginPath();ctx.ellipse(x,y-s*.15,s*.55,s*.2,0,0,7);ctx.fill();
}
function knot(ctx,x,y,s){ctx.strokeStyle='#E0B04A';ctx.lineWidth=3;ctx.fillStyle='#C8102E';ctx.beginPath();ctx.arc(x,y,s*.26,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x,y+s*.26);for(let i=-1;i<=1;i++){ctx.moveTo(x+i*s*.1,y+s*.26);ctx.lineTo(x+i*s*.12,y+s*.7)}ctx.stroke()}
function drape(ctx,x,w,h,col,R){for(let i=0;i<8;i++){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,rgba(col,.5));g.addColorStop(1,rgba(col,.12));ctx.fillStyle=g;ctx.fillRect(x+i*w/8,0,w/8+1,h*(.85+R()*.1))}}

/* ---- decorate: apply a culture and a variant over a base image ---- */
function decorate(ctx,w,h,cid,variant,seed){
  const R=mulberry(seed),C=CULTURES[cid],P=C.palette,V=VARIANTS.find(v=>v.key===variant)||VARIANTS[0],d=V.d,ev=V.key==='evening';
  // colour grade
  ctx.save();ctx.globalCompositeOperation=ev?'multiply':'soft-light';ctx.fillStyle=rgba(ev?'#3a2550':P[0],ev?.55:.38);ctx.fillRect(0,0,w,h);ctx.restore();
  if(V.key==='lavish'){const g=ctx.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,h*.95);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.28)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
  const top=0;
  if(cid==='diwali'){
    const cols=['#F2A71B','#E4572E','#F7C948','#E8851C'];
    const sw=[[.01,.34],[.34,.67],[.67,.99]];
    sw.forEach((s,i)=>garland(ctx,w*s[0],h*.1,w*s[1],h*.1,h*(.07+(i===1?.02:0)),cols,w*.011,R));
    if(d>1.2){sw.forEach(s=>garland(ctx,w*s[0],h*.17,w*s[1],h*.17,h*.06,cols,w*.009,R))}
    const nStr=Math.round(5*d);for(let i=0;i<nStr;i++){const x=w*(.04+i*(.92/Math.max(1,nStr-1)));strand(ctx,x,h*.1,h*(.28+R()*.22),cols,w*.008,R)}
    lights(ctx,w*.02,h*.21,w*.98,h*.21,h*.05,Math.round(34*d),'#FFC76B',R,w*.02);
    const nd=Math.round(12*d);for(let i=0;i<nd;i++){const t=i/(nd-1);diya(ctx,w*(.12+t*.76),h*(.9+Math.sin(t*Math.PI)*.04),w*.011,R)}
    if(d>.8){const n2=Math.round(7*d);for(let i=0;i<n2;i++){const t=i/(n2-1);diya(ctx,w*(.2+t*.6),h*.68,w*.008,R)}}
    rangoli(ctx,w*.5,h*(d>1?.83:.85),w*(d>1?.13:.1),P,R);
  } else if(cid==='eid'){
    const dr=d>1?.2:.14;drape(ctx,0,w*dr,h*.6,'#F4EFD8',R);drape(ctx,w*(1-dr),w*dr,h*.6,'#F4EFD8',R);
    crescentStar(ctx,w*.5,h*.2,h*(d>1?.1:.085),'#E8C468');
    ctx.save();ctx.globalAlpha=.7;geoStar(ctx,w*.5,h*.38,h*.1,'#E8C468',8);geoStar(ctx,w*.12,h*.3,h*.05,'#E8C468',8);geoStar(ctx,w*.88,h*.3,h*.05,'#E8C468',8);ctx.restore();
    const nl=Math.round(7*d);for(let i=0;i<nl;i++){const t=i/(nl-1);const x=w*(.08+t*.84);if(Math.abs(x-w*.5)<w*.07)continue;fanoos(ctx,x,0,h*(.18+R()*.2),h*(.1+R()*.03),P[0],'#F7D58A',R)}
    garland(ctx,w*.02,h*.07,w*.98,h*.07,h*.05,['#1F6F5C','#2F8F73','#D9B35B'],w*.008,R);
    lights(ctx,w*.0,h*.12,w*1,h*.12,h*.06,Math.round(36*d),'#FFE29A',R,w*.018);
    ctx.fillStyle=rgba(P[1],.6);ctx.fillRect(w*.3,h*.575,w*.4,h*.012);
    const nd=Math.round(6*d);for(let i=0;i<nd;i++){const t=i/(nd-1);fanoos(ctx,w*(.18+t*.64),h*.62,h*.9,h*.05,P[0],'#F7D58A',R)}
  } else {
    const nl=Math.round(9*d);for(let i=0;i<nl;i++){const t=i/(nl-1);lantern(ctx,w*(.05+t*.9),0,h*(.12+R()*.2),h*(.075+R()*.03),'#C8102E',R)}
    if(d>1.2){for(let i=0;i<5;i++)lantern(ctx,w*(.12+i*.19),0,h*(.34+R()*.1),h*.06,'#E0201C',R)}
    garland(ctx,w*.0,h*.05,w*1,h*.05,h*.035,['#F2C14E','#C8102E'],w*.007,R);
    couplet(ctx,w*.02,h*.2,w*.06,h*.42,'福春');couplet(ctx,w*.92,h*.2,w*.06,h*.42,'喜年');
    blossom(ctx,w*.0,h*.62,w*.26,h*.74,R);blossom(ctx,w*1,h*.62,w*.74,h*.74,R);
    const nk=Math.round(4*d);for(let i=0;i<nk;i++)knot(ctx,w*(.2+i*(.6/Math.max(1,nk-1))),h*.28,h*.09);
    const ni=Math.round(5*d);for(let i=0;i<ni;i++)ingot(ctx,w*(.3+i*(.4/Math.max(1,ni-1))),h*(.9+(i%2)*.03),h*.03);
    lights(ctx,w*.0,h*.15,w*1,h*.15,h*.05,Math.round(30*d),'#FFB36B',R,w*.018);
  }
  if(ev){ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<14;i++)glow(ctx,w*R(),h*(.1+R()*.3),w*.09,P[0],.18);ctx.restore()}
}

/* ---- public renderers ---- */
function paintBase(canvas,src){
  canvas.width=960;canvas.height=640;const ctx=canvas.getContext('2d');
  if(src&&src.kind==='img'&&src.img)drawCover(ctx,src.img,960,640);else drawVenue(ctx,960,640,src&&src.id||'hall');
  return ctx;
}
function paintDesign(canvas,src,cid,variant,seed){const ctx=paintBase(canvas,src);decorate(ctx,960,640,cid,variant,seed)}
