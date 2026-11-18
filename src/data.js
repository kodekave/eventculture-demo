/* ===== Demo data: everything here is dummy content ===== */
const M = {
  D: ['Marigold garlands','Diyas (oil lamps)','Rangoli at the entrance','String lights','Warm gold and orange palette'],
  E: ['Crescent and star motifs','Lanterns (fanoos)','Geometric patterns','Gold and green palette','Fairy lights'],
  L: ['Red lanterns','Gold knots and ingots','Plum blossom','Red and gold palette','Couplet banners']
};
const CULTURES = {
  diwali: { id:'diwali', name:'Diwali', tag:'Festival of lights', palette:['#F2A71B','#E4572E','#7A1F3D','#FFE8A3'], must:M.D,
    avoid:['Christmas-style red and green','A white-only colour scheme','Idols placed on the floor'], card:'v0.3' },
  eid: { id:'eid', name:'Eid', tag:'Celebration and gathering', palette:['#1F6F5C','#D9B35B','#0E3B35','#F4EFD8'], must:M.E,
    avoid:['Images of people or animals','Alcohol-related set-ups','Christmas elements'], card:'v0.2' },
  lny: { id:'lny', name:'Lunar New Year', tag:'Red, gold and good fortune', palette:['#C8102E','#F2C14E','#7A0C1E','#FFF1C9'], must:M.L,
    avoid:['A white or black dominant palette','Clock motifs'], card:'v0.2' }
};
const VENUES = [
  { id:'hall', name:'Banquet hall' },
  { id:'garden', name:'Garden marquee' },
  { id:'restaurant', name:'Restaurant room' }
];
const VARIANTS = [
  { name:'Classic glow', key:'classic', d:1.0 },
  { name:'Lavish', key:'lavish', d:1.6 },
  { name:'Minimal', key:'minimal', d:0.55 },
  { name:'Evening lights', key:'evening', d:1.15 }
];
const PREFS = ['Colour palette','Flowers','Lighting','Stage','Seating','Entrance decor'];
const PLANS = [
  { id:'starter', name:'Starter', price:9, credits:10, blurb:'Try it on one event', feats:['10 AI generation credits','Contact up to 3 vendors per event','Download designs'] },
  { id:'plus', name:'Plus', price:24, credits:40, blurb:'For a full event plan', feats:['40 AI generation credits','Contact up to 5 vendors per event','Refine and regenerate designs','Vendor-inspired designs'], pop:true },
  { id:'pro', name:'Pro', price:59, credits:120, blurb:'For planners and teams', feats:['120 AI generation credits','Unlimited vendor requests','All Plus features','Priority support'] }
];
const CATS = ['Decorators','Florists','Lighting','Catering','DJs and music','Photography','Draping and stages'];
const VENDORS = [
  { id:'v1', name:'Marigold & Co', cat:'Decorators', city:'London', rating:4.8, jobs:126, price:'£££', cultures:['diwali'], skills:[M.D[0],M.D[2],M.D[4]], base:1450, c:['#F2A71B','#E4572E'], blurb:'Full-venue Diwali decor with fresh marigold and handmade rangoli.' },
  { id:'v2', name:'Lumen Events', cat:'Lighting', city:'Leicester', rating:4.7, jobs:88, price:'££', cultures:['diwali','eid'], skills:[M.D[1],M.D[3],M.E[4]], base:780, c:['#FFD27A','#C97B2E'], blurb:'Warm festival lighting, diya displays and fairy-light canopies.' },
  { id:'v3', name:'Crescent Lights', cat:'Decorators', city:'Birmingham', rating:4.9, jobs:140, price:'£££', cultures:['eid'], skills:[M.E[0],M.E[1],M.E[2]], base:1650, c:['#1F6F5C','#D9B35B'], blurb:'Eid decor with fanoos lanterns, crescent arches and geometric panels.' },
  { id:'v4', name:'Red Lantern Studio', cat:'Decorators', city:'London', rating:4.8, jobs:97, price:'£££', cultures:['lny'], skills:[M.L[0],M.L[1],M.L[4]], base:1500, c:['#C8102E','#F2C14E'], blurb:'Lunar New Year stages, lantern ceilings and calligraphy couplets.' },
  { id:'v5', name:'Bloom Atelier', cat:'Florists', city:'Manchester', rating:4.6, jobs:64, price:'££', cultures:['diwali','lny'], skills:[M.D[0],M.L[2]], base:620, c:['#F6B6C8','#7A9E5C'], blurb:'Seasonal floral installations and garlands, made to order.' },
  { id:'v6', name:'Saffron Table', cat:'Catering', city:'Leicester', rating:4.7, jobs:210, price:'£££', cultures:['diwali','eid'], skills:['Festival menus','Live counters'], base:2400, c:['#E4572E','#F2A71B'], blurb:'Festival feasts for 50 to 500 guests, with halal and vegetarian menus.' },
  { id:'v7', name:'DJ Raahi', cat:'DJs and music', city:'London', rating:4.5, jobs:75, price:'££', cultures:['diwali','eid'], skills:['Bollywood sets','Live dhol'], base:700, c:['#7A1F3D','#F2A71B'], blurb:'Festival sets, live dhol players and a full PA.' },
  { id:'v8', name:'Golden Hour Photos', cat:'Photography', city:'London', rating:4.9, jobs:180, price:'££', cultures:['diwali','eid','lny'], skills:['Event coverage','Same-week previews'], base:900, c:['#F4EFD8','#8C6A4C'], blurb:'Event photography with a quick-turnaround gallery.' },
  { id:'v9', name:'Silk Road Drapes', cat:'Draping and stages', city:'Birmingham', rating:4.6, jobs:59, price:'££', cultures:['eid','diwali'], skills:[M.E[3],M.D[4]], base:980, c:['#D9B35B','#0E3B35'], blurb:'Ceiling drapes, stage backdrops and entrance arches.' },
  { id:'v10', name:'Petal & Pine', cat:'Florists', city:'London', rating:4.4, jobs:41, price:'£', cultures:['lny'], skills:[M.L[2],M.L[3]], base:430, c:['#F6B6C8','#C8102E'], blurb:'Plum blossom branches and red-and-gold table flowers.' },
  { id:'v11', name:'Festa Sound', cat:'DJs and music', city:'Manchester', rating:4.6, jobs:90, price:'££', cultures:['lny','eid'], skills:['Lion dance booking','Live MC'], base:650, c:['#C8102E','#F2C14E'], blurb:'Sound, MC and performance booking for festival nights.' },
  { id:'v12', name:'Hearth & Spice', cat:'Catering', city:'London', rating:4.5, jobs:120, price:'££', cultures:['lny'], skills:['Banquet menus','Dim sum stations'], base:2100, c:['#7A0C1E','#F2C14E'], blurb:'Banquet menus and dim sum stations for large tables.' }
];
const FAQS = [
  ['How does EventCulture AI work?','You upload a photo of your venue, choose the event and style, and the AI edits your photo into four decor concepts. Each concept is checked against a written culture card before you see it.'],
  ['How do you keep the designs culturally accurate?','Every culture has a card of must-include items and must-avoid mistakes, written with experts. The AI follows it, a second step checks the result, and anything that fails is labelled "needs review". You can also report a mistake on any design.'],
  ['Can I use my own venue photos?','Yes. Upload up to three photos of the real venue. The design keeps the structure and layout of your room.'],
  ['What does a subscription give me?','AI generation credits, refine and regenerate, and the ability to contact vendors. When you subscribe you get a subscription key that unlocks everything.'],
  ['How do vendors get paid?','You pay through the platform and the money is held until the service is complete. The vendor then requests a payout and the platform deducts its commission.'],
  ['Can I negotiate with vendors?','Yes. You can request quotes from several vendors, compare them, and negotiate for up to three rounds each.'],
  ['What if a design looks wrong?','Use "Report an inaccuracy" on the design. It goes to the admin team and the expert reviewer for that culture.']
];
const ADMIN_CUSTOMERS = [
  ['Priya Shah','priya@example.com','London','Plus','Active'],['Omar Farouk','omar@example.com','Birmingham','Starter','Active'],
  ['Mei Lin','mei@example.com','Manchester','Pro','Active'],['Daniel Reed','daniel@example.com','Leeds','None','Active'],
  ['Sana Iqbal','sana@example.com','Leicester','Plus','Suspended']
];
const ADMIN_PENDING = [
  { id:'p1', name:'Henna Hub', cat:'Decorators', city:'Leicester', status:'Pending' },
  { id:'p2', name:'Pearl Events', cat:'Draping and stages', city:'London', status:'Pending' },
  { id:'p3', name:'Jade Garden Florals', cat:'Florists', city:'Manchester', status:'Pending' }
];
const ADMIN_DISPUTES = [
  { id:'d1', who:'Priya Shah vs Lumen Events', reason:'Lights arrived two hours late', status:'Open' },
  { id:'d2', who:'Omar Farouk vs DJ Raahi', reason:'Set shorter than booked', status:'Open' }
];
const ADMIN_PAYOUTS = [
  { id:'po1', vendor:'Crescent Lights', amount:1485, status:'Requested' },
  { id:'po2', vendor:'Golden Hour Photos', amount:810, status:'Requested' }
];
const VENDOR_LEADS = [
  { id:'l1', customer:'Priya Shah', event:'Diwali dinner, 120 guests', city:'London', budget:'£1,500', status:'New' },
  { id:'l2', customer:'Rahul Mehta', event:'Office Diwali party, 80 guests', city:'London', budget:'£900', status:'New' },
  { id:'l3', customer:'Anita Rao', event:'Temple fundraiser, 200 guests', city:'London', budget:'£2,000', status:'New' }
];
