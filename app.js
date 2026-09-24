const APP = {
  state: {
    route: location.hash.replace('#/','') || 'home',
    profile: JSON.parse(localStorage.getItem('bbb_profile') || 'null'),
    checklist: JSON.parse(localStorage.getItem('bbb_checklist') || '{}'),
    cart: JSON.parse(localStorage.getItem('bbb_cart') || '[]'),
    plans: JSON.parse(localStorage.getItem('bbb_plans') || '[]'),
    fxDirection: 'AUD_IDR',
    floatTab: 'featured',
    cartOpen: false,
  },
  config: {
    tripStart: '2027-01-23T15:00:00+08:00',
    birthdayDate: '2027-01-25T12:00:00+08:00',
    villaName: 'Chandra Villas',
    villaAddress: 'Jl. Sari Temuku Gg. Sandat, Seminyak, Kec. Kuta, Kabupaten Badung, Bali 80361, Indonesia',
    villaPhone: '+62 361 738091',
    weather: { lat: -8.691, lon: 115.166, label: 'Seminyak' },
    stripeEnabled: false,
  }
};

const SUNSET = {
  id:'sunset-rsvp', type:'rsvp', title:'Beanbags, Beers & Sunset', price:0, currency:'AUD',
  meta:'Sunday 24 January · From 4:00 PM · RSVP only', badge:'RSVP ONLY'
};

const PIZZA = {
  id:'pizza-party', type:'paid', title:'Bali Pizza Party', price:249000, currency:'IDR',
  meta:'Tuesday 26 January · 1:00–3:00 PM · Per person', badge:'PAY NOW'
};

const MASSAGES = [
  ['Balinese Massage',200000,60],['Relaxing Massage',225000,60],['Foot Reflexology',185000,45],
  ['Anti Stress Massage',185000,45],['Deep Tissue Massage',250000,60],['Four Hand Massage',400000,60],
  ['Thai Massage',250000,60],['Natural Coconut Relaxing Massage',250000,60],['Facial Oriflame',185000,60],
  ['Pedicure',185000,60],['Manicure',185000,60],['Creambath',185000,60],['Head + Foot Massage',250000,60],
  ['Pregnancy Massage',200000,60],['Anti Cellulite Massage',350000,60],['Limfatik Drainase',350000,60],['Hair Braid',125000,45]
].map((x,i)=>({id:`massage-${i}`,name:x[0],price:x[1],mins:x[2]}));

const FLOATS = [
  {id:'xl-unicorn',name:'XL Unicorn',size:'XL',priceAUD:8,img:'https://static.wixstatic.com/media/cb0458_c6a53918657f48aca29cafad3fd9e946~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85/XL%20Unicorn.jpg'},
  {id:'xl-flamingo',name:'XL Flamingo',size:'XL',priceAUD:8,img:'https://static.wixstatic.com/media/cb0458_0f67bb9988bc4efd9cc9bfebad4a20da~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85/XL%20Flamingo.jpg'},
  {id:'l-flamingo',name:'Large Flamingo',size:'L',priceAUD:8,img:'https://static.wixstatic.com/media/cb0458_e60a057d963e422381c14556d5d4f18e~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85/L%20Flamingo.jpg'},
  {id:'m-flamingo',name:'Pink Flamingo',size:'M',priceAUD:8,img:'https://static.wixstatic.com/media/cb0458_f8e73b155f8e47ebafb211b582654ff0~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85/M%20Pink%20Flamingo.jpg'},
  {id:'m-pizza',name:'Pizza Float',size:'M',priceAUD:8,img:'https://static.wixstatic.com/media/cb0458_e19e860c0a2d43c0b5793eaa787d338d~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85/M%20Pizza%20Matt.jpg'},
  {id:'s-donut',name:'Sprinkle Donut',size:'S',priceAUD:8,img:'https://static.wixstatic.com/media/cb0458_c1047ebd29994e58afabe8424cd53003~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85/S%20Sprinkle%20Donut.jpg'},
  {id:'xs-unicorn',name:'Kiddy Unicorn Ring',size:'XS',priceAUD:8,img:'https://static.wixstatic.com/media/cb0458_d9405f3b325e43f6ba93aa7f5d98c1da~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85/XS%20Kiddy%20Unicorn%20Ring.jpg'},
  {id:'volleyball',name:'Pool Volleyball Net',size:'Toy',priceAUD:8,img:'https://static.wixstatic.com/media/cb0458_5cb871a2a0cd4f6ca40473cb065d7b1f~mv2.jpg/v1/fill/w_700,h_700,al_c,q_85/L%20Volleyball%20Net.jpg'}
];

const GUIDE = [
  {
    title:'Before You Fly', icon:'✈️', items:[
      ['Travel insurance','Travel insurance is essential. Check medical cover, delays/cancellations, baggage, any scooter or adventure activity, and pre-existing conditions. Alcohol or drug exclusions can affect claims depending on your policy.'],
      ['Passport','Check that your passport has at least six months validity from entry. Save a digital copy, take a physical copy, and store the original securely at the villa.'],
      ['Visa / e-VOA','For eligible short stays, the B1 Visa on Arrival / e-VOA is the common 30-day option. Applying online before departure can make arrival smoother. Always check your details carefully before payment.'],
      ['Bali Tourist Levy','Pay the Bali tourist levy through the official Love Bali service and save the QR code to your phone.'],
      ['All Indonesia arrival card','Complete the All Indonesia arrival declaration within the allowed pre-arrival window. It combines immigration, customs and health information. Save the QR code sent to your email.'],
      ['Medication','Bring regular medication in original packaging and check Indonesian rules before travelling. For prescription medicine, carry a prescription/doctor letter where appropriate.'],
      ['Money & cards','Notify your bank if required, bring a physical backup card, keep some cash, and consider a dedicated travel card.'],
      ['Packing','Light clothing, bathers, sunscreen, sanitary products, hat, thongs, one nicer outfit, closed-toe shoes for men, insect repellent, Panadol/paracetamol, ibuprofen, electrolytes, anti-diarrhoea medication, charger, power bank and adaptor.']
    ]
  },
  {
    title:'Arriving in Bali', icon:'🛬', items:[
      ['Landing','Follow the IMIGRASI signs after leaving the aircraft. Keep your passport and phone handy.'],
      ['Immigration / e-gates','Use the passport scanners/e-gates where directed. Hold your passport firmly and follow the machine prompts. If a scanner is temperamental, try again or another machine and ask staff if needed.'],
      ['Baggage','After immigration, head to the baggage carousels and check the screens for your flight. Keep your baggage tag until your luggage is collected.'],
      ['Customs / arrival QR','Have your All Indonesia arrival QR accessible for the customs/arrival process. Keep your Bali levy QR available too.'],
      ['Leaving the airport','Follow the crowd to the arrivals hall. If a driver has been arranged, look for their sign and use WhatsApp if needed.']
    ]
  },
  {
    title:'Getting Around', icon:'🚕', items:[
      ['Traffic','Bali traffic can turn a short trip into a long one. Leave extra time when you have a booking, airport transfer or group plan.'],
      ['Gojek / Grab','Useful for cars, motorbikes, food delivery and everyday errands. Pickup rules can vary by venue.'],
      ['Bluebird','A well-known metered taxi option that can be booked by app or hailed where available.'],
      ['Private drivers','Excellent for groups, day trips and longer drives. Confirm the destination, timings and price before setting off.'],
      ['Scooters','Only ride if you meet licensing, safety and insurance requirements. Wearing a helmet and understanding your insurance cover matters.']
    ]
  },
  {
    title:'Money, Shopping & Essentials', icon:'💳', items:[
      ['Rupiah','Indonesia uses Indonesian Rupiah (IDR). Carry some cash even if you mostly pay by card.'],
      ['ATMs','Prefer ATMs attached to banks or inside reputable shops/shopping centres. Cover your PIN and be mindful of fees and currency conversion prompts.'],
      ['Money changers','Use established money changers with professional storefronts. Confirm the rate and count the cash yourself before leaving.'],
      ['Convenience stores','Mini Mart, Circle K and Indomaret are useful for water, snacks, toiletries, phone credit and quick essentials.'],
      ['Supermarkets','Pepito, Bintang and Coco are useful for groceries, drinks, fresh food, imported items and household essentials.'],
      ['Pharmacies','Guardian and professional local apoteks/pharmacies are useful for common OTC medicine, first aid, sunscreen and personal care.']
    ]
  },
  {
    title:'Food, Water & Bali Belly', icon:'🍜', items:[
      ['Tap water','Do not drink Bali tap water. Use bottled or filtered water. Sensitive travellers may also prefer bottled/filtered water for brushing teeth.'],
      ['Ice','Reputable venues generally use safe ice. If you are unsure, ask.'],
      ['Eating out','Restaurants, cafés and busy venues with good recent reviews are generally easier for travellers to assess. Street food is not automatically unsafe, but handling and storage vary.'],
      ['Bali Belly','Traveller stomach illness can come from food, water, unfamiliar bacteria, dehydration or poor hand hygiene. Hydrate, wash hands, and seek medical advice if symptoms are severe or persistent.'],
      ['Dietary needs','Bali caters well for many dietary preferences, but serious allergies require clear communication and awareness of cross-contamination risk.']
    ]
  },
  {
    title:'Health & Medical', icon:'🩺', items:[
      ['Doctor to your villa','Many Bali medical services offer WhatsApp contact and villa/hotel visits. We will add the selected current provider before the trip.'],
      ['Pharmacy delivery','24/7 pharmacy delivery services are available in Bali. The final trusted WhatsApp contact will be added closer to travel.'],
      ['Dehydration','Heat and humidity make dehydration easy. Drink more water than usual and consider electrolytes when needed.'],
      ['Mosquitoes','Use repellent, particularly around dawn/dusk and gardens or still water.'],
      ['Animals','Do not approach unfamiliar street dogs/cats. If bitten or scratched, wash the area immediately and seek medical advice.'],
      ['Emergency','For urgent situations, seek the nearest emergency department and contact your travel insurer as early as practical.']
    ]
  },
  {
    title:'Safety, Law & Culture', icon:'🛕', items:[
      ['Indonesian law','Bali is part of Indonesia. Indonesian laws apply, including strict drug laws, visa conditions and road rules.'],
      ['Respect','Temples, ceremonies, offerings and sacred spaces matter deeply. Follow local instructions and dress modestly where required.'],
      ['Scams & pressure','Agree on prices and destinations before proceeding. Do not feel pressured into a purchase or service. Walk away if something feels unclear.'],
      ['Night-time safety','Use normal travel awareness: keep valuables secure, avoid isolated dark shortcuts and use reputable transport when needed.'],
      ['Offerings','You will see daily offerings on pavements and entrances. Step around them rather than on them.']
    ]
  },
  {
    title:'Bali in January 2027', icon:'🌦️', items:[
      ['Wet season','January falls in Bali’s wetter season. Expect heat, humidity and tropical rain that can be heavy but may pass quickly.'],
      ['What to pack','Light breathable clothing, sunscreen, a compact rain layer/umbrella, shoes that can handle wet paths, and a spare dry outfit are useful.'],
      ['Plans','Outdoor plans can still be great. The app weather section will show the current Seminyak forecast and rain chance closer to each event.']
    ]
  },
  {
    title:'Flying Home', icon:'🏠', items:[
      ['Airport timing','Allow extra time for traffic and airport queues. Confirm your airport transfer well in advance.'],
      ['Check-in','Online check-in can save time where your airline supports it. Save your boarding pass to your phone.'],
      ['Final security','Carry-on can be screened again near the gate. Keep liquids, sharp items and battery/power-bank rules in mind.'],
      ['Flight disruption','If a flight is cancelled, follow airline/airport instructions, keep receipts and contact your insurer where relevant.'],
      ['Home declarations','Your home country controls what must be declared on return. Check the applicable customs rules and declare if unsure.']
    ]
  },
  {
    title:'Staying Longer?', icon:'🌴', items:[
      ['Accommodation','If you extend your trip, compare hotels and villas based on the level of service and independence you want.'],
      ['Day trips','Private drivers are a simple option for longer days and exploring other parts of Bali.'],
      ['Villa life','Laundry, private chefs, bartenders, housekeeping and delivery services are easy to arrange in many tourist areas.'],
      ['Wellness','Massage, beauty, hair and wellness services are widely available. For specialist treatments, look for dedicated studios and recent reviews.'],
      ['Bali hacks','Use recent reviews, WhatsApp, Google Maps, Gojek and local recommendations. Bali is easier when you know where to look rather than over-planning everything.']
    ]
  }
];

const CHECKS = [
  'Passport checked — 6+ months validity','Travel insurance organised','B1 / e-VOA organised (if applicable)',
  'Visa saved to phone','Bali Tourist Levy paid','Tourist Levy QR saved','All Indonesia completed','Arrival QR saved',
  'Medication checked','Doctor letter / prescription copy if needed','Bank / travel card ready','WhatsApp installed','Power adaptor packed'
];

const APP_CARDS = [
  ['Gojek','Rides · food · delivery','https://cdn.simpleicons.org/gojek/00AA13','https://www.gojek.com/en-id/'],
  ['Grab','Rides · food · delivery','https://cdn.simpleicons.org/grab/00B14F','https://www.grab.com/id/en/'],
  ['Bluebird','Metered taxis','https://cdn.simpleicons.org/bluebird/2563EB','https://www.bluebirdgroup.com/'],
  ['WhatsApp','Villa · drivers · bookings','https://cdn.simpleicons.org/whatsapp/25D366','https://www.whatsapp.com/download'],
  ['Wise','Travel money','https://cdn.simpleicons.org/wise/9FE870','https://wise.com/'],
  ['Google Translate','Menus · signs · language','https://cdn.simpleicons.org/googletranslate/4285F4','https://translate.google.com/']
];

function money(n,c='IDR'){
  if(c==='AUD') return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(n);
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}
function escapeHTML(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function save(key,val){localStorage.setItem(key,JSON.stringify(val));}
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
function routeTo(r){location.hash = '#/' + r;window.scrollTo({top:0,behavior:'smooth'});}
function setRoute(){APP.state.route=location.hash.replace('#/','')||'home';render();}
window.addEventListener('hashchange',setRoute);

function topbar(){
  const p=APP.state.profile;
  return `<header class="topbar"><div class="topbar-inner">
    <a class="brandmark" href="#/home"><div class="brand-round">BBB<br>2027</div><div class="brand-text"><strong>NICOLLE'S 50TH</strong><span>The Big Bali Bash</span></div></a>
    <div class="top-actions"><button class="icon-btn" onclick="APP_UI.openCart()" aria-label="Cart">🛒${APP.state.cart.length?`<sup>${APP.state.cart.length}</sup>`:''}</button><button class="icon-btn" onclick="routeTo('profile')" aria-label="Profile">${p?.photo?`<img src="${p.photo}" style="width:34px;height:34px;border-radius:50%;object-fit:cover">`:'👤'}</button></div>
  </div></header>`;
}
function nav(){
  const items=[['home','⌂','Home'],['trip','☀','The Trip'],['bali','🌴','Bali'],['tools','⌖','Tools'],['plans','✓','My Plans']];
  return `<nav class="navbar">${items.map(([r,i,l])=>`<button class="nav-item ${APP.state.route===r?'active':''}" onclick="routeTo('${r}')"><span class="ico">${i}</span><span>${l}</span></button>`).join('')}</nav>`;
}
function pageWrap(content,opts={}){return `${opts.aus?'':'<div>'+topbar()+'</div>'}<main class="${opts.aus?'aus-shell ':''}"><div class="shell">${content}</div></main>${opts.aus?'':nav()}${cartMarkup()}${modalMarkup()}`;}

function homePage(){
  const p=APP.state.profile;
  return pageWrap(`
    <section class="hero">
      <div class="kicker">BALI · 23–27 JANUARY 2027</div>
      <h1>NICOLLE'S<br>50TH</h1>
      <div class="script">Better. Bolder. Boujier.</div>
      <p class="hero-copy">The Big Bali Bash — a few days of good people, villa life, sunset drinks, cocktails, games and one very big birthday.</p>
      <div class="hero-actions"><button class="primary-btn" onclick="routeTo('trip')">See the trip</button><button class="ghost-btn" onclick="routeTo('bali')">Bali guide</button></div>
      <div class="countdown" id="countdown"></div>
    </section>
    <section class="section">
      <div class="section-head"><div><div class="kicker">YOUR BALI DASHBOARD</div><h2 class="section-title">${p?`Hi ${escapeHTML(p.name.split(' ')[0])}`:'Everything in one place'}</h2></div><div class="section-sub">Events, Bali essentials, bookings, live weather, currency and useful tools.</div></div>
      <div class="grid grid-3">
        <div class="card quick-card"><div class="quick-icon">🌦️</div><div><h4>Live weather</h4><p id="homeWeather">Loading Seminyak…</p><div class="actions-row"><button class="ghost-btn" onclick="routeTo('tools')">View forecast</button></div></div></div>
        <div class="card quick-card"><div class="quick-icon">💱</div><div><h4>Live exchange rate</h4><p id="homeFx">Loading AUD → IDR…</p><div class="actions-row"><button class="ghost-btn" onclick="routeTo('tools')">Open converter</button></div></div></div>
        <div class="card quick-card"><div class="quick-icon">📍</div><div><h4>Find near me</h4><p>Pharmacy, ATM, clinic, supermarket and more.</p><div class="actions-row"><button class="ghost-btn" onclick="routeTo('tools')">Find something</button></div></div></div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><div class="kicker">WHAT'S ON</div><h2 class="section-title">The three days</h2></div></div>
      <div class="grid grid-3">
        <div class="card event-card sunset"><span class="date">Sun 24 Jan</span><div class="meta">FROM 4PM · OPTIONAL</div><h3>Beanbags, Beers & Sunset</h3><p>A short walk from Chandra. Beanbags by the beach, sunset drinks and absolutely no pressure.</p><div class="actions-row"><button class="secondary-btn" onclick="APP_UI.addItem(${JSON.stringify(SUNSET).replace(/"/g,'&quot;')})">I'm in · RSVP</button></div></div>
        <div class="card event-card bbb"><span class="date">Mon 25 Jan</span><div class="meta">THE MAIN EVENT</div><h3>The Big Bali Bash</h3><p>Nicolle's 50th. Cocktails, food, Bali Games, champagne, cake and the birthday we've been waiting for.</p><div class="actions-row"><button class="primary-btn" onclick="routeTo('birthday')">Open birthday day</button></div></div>
        <div class="card event-card aus"><span class="date">Tue 26 Jan</span><div class="meta">DIFFERENT DAY · DIFFERENT BRAND</div><h3>The Great Aussie Recovery</h3><p>Pizza. Pool. Triple J. Massages. Floaties. Zero urgency.</p><div class="actions-row"><button class="aus-btn" onclick="routeTo('ausday')">Enter Aus Day</button></div></div>
      </div>
    </section>
    <section class="section"><div class="section-head"><div><div class="kicker">STAYING AT</div><h2 class="section-title">Chandra Villas</h2></div></div>
      <div class="card"><div class="grid grid-2"><div><div class="meta">SEMINYAK, BALI</div><h3>Private pools. Breakfast. Butler service.</h3><p>${APP.config.villaAddress}</p><div class="actions-row"><button class="primary-btn" onclick="APP_UI.maps('${encodeURIComponent(APP.config.villaAddress)}')">Open in Maps</button><a class="ghost-btn" href="tel:${APP.config.villaPhone.replace(/\s/g,'')}">Call villa</a></div></div><div class="info-strip"><b>Take me home 🏡</b><br><br>Save this page. If you are out and need to get back, use the Maps button or show the address to your driver.</div></div></div>
    </section>
  `);
}

function tripPage(){
  return pageWrap(`<div class="page-head"><div class="kicker">THE TRIP</div><h1 class="page-title">Bali, but make it Nicolle.</h1><p class="page-copy">Everything guests need for the birthday week — without the organiser clutter.</p></div>
    <div class="grid grid-3">
      <div class="card event-card sunset"><span class="date">24 JAN · 4PM</span><h3>Beanbags, Beers & Sunset</h3><p>Walk down from Chandra for a relaxed beach sunset. RSVP so we know how many beanbags to reserve.</p><div class="actions-row"><button class="secondary-btn" onclick="APP_UI.addItem(${JSON.stringify(SUNSET).replace(/"/g,'&quot;')})">I'm in · Add to My Plans</button></div></div>
      <div class="card event-card bbb"><span class="date">25 JAN</span><h3>The Big Bali Bash</h3><p>The main birthday day — full guest-facing overview, food, cocktails and games.</p><div class="actions-row"><button class="primary-btn" onclick="routeTo('birthday')">Open</button></div></div>
      <div class="card event-card aus"><span class="date">26 JAN · 11AM</span><h3>The Great Aussie Recovery</h3><p>A separate Australia Day takeover with its own style, bookings and cart.</p><div class="actions-row"><button class="aus-btn" onclick="routeTo('ausday')">Open</button></div></div>
    </div>
    <section class="section"><div class="section-head"><div><div class="kicker">THE VILLA</div><h2 class="section-title">Chandra Villas</h2></div></div>
      <div class="card"><h3>Seminyak home base</h3><p>High-end villas with kitchens, butler service, private pools and complimentary breakfast.</p><div class="hr"></div><p><b>Address</b><br>${APP.config.villaAddress}</p><p style="margin-top:10px"><b>Phone</b><br>${APP.config.villaPhone}</p><div class="actions-row"><button class="primary-btn" onclick="APP_UI.maps('${encodeURIComponent(APP.config.villaAddress)}')">Directions</button><button class="ghost-btn" onclick="APP_UI.copy('${APP.config.villaAddress.replace(/'/g,"\\'")}')">Copy address</button></div></div>
    </section>`);
}

function birthdayPage(){
  const foods=[
    ['Pumpkin, chickpea & coconut curry','Coconut milk, mild spices, fresh herbs','VG · GF'],
    ['Grilled halloumi & vegetable skewers','Zucchini, capsicum, red onion, herb dressing','V · GF'],
    ['Charred corn','Lime butter & herbs','V · GF'],['Fresh garden salad','Avocado & vinaigrette','VG · GF'],['Rice','',''],
    ['Chicken satay sticks','Peanut sauce & sambal','GF'],['Slow-cooked pulled beef','Garlic & herb gravy, kept in its juices','GF'],
    ['Garlic butter chicken thighs','Lemon, garlic & herbs','GF'],['Beef rendang','Slow-cooked coconut, chilli & spices','GF'],
    ['Balinese-style shredded chicken','Aromatic spices, lime & herbs','GF'],['Balinese pork skewers','Sweet soy, garlic & chilli',''],
    ['Roast pork belly','Crispy crackling with apple/chilli relish','GF'],['Fresh fruit','','']
  ];
  const cocktails=[['Berry Bouji','Strawberry Daiquiri'],['Mint Condition','Mojito'],['After Hours','Espresso Martini'],['Tropic Like It’s Hot','Piña Colada'],['Mini Beers','A taste of goodness — you’ll be wanting more.']];
  return pageWrap(`<div class="page-head"><div class="kicker">MONDAY · 25 JANUARY 2027</div><h1 class="page-title">The Big Bali Bash</h1><div class="script">Better. Bolder. Boujier.</div><p class="page-copy">The main event. This page is guest-facing only — the supplier and bump-in details stay behind the scenes.</p></div>
    <section class="section"><div class="grid grid-2"><div class="card"><div class="meta">THE FLOW</div><h3>Birthday day</h3><p>Free morning → get ready → cocktails & canapés → Bali Games → dinner → champagne & cake → party.</p><div class="info-strip" style="margin-top:14px">Exact guest timings will be added as they are locked in. No bump-in or supplier detail will appear here.</div></div><div class="card"><div class="meta">DRINKS</div><h3>What's included</h3><p>Cocktails and mini beers are included. Everyone is encouraged to bring their favourite drinks for anything outside the cocktail menu.</p></div></div></section>
    <section class="section"><div class="section-head"><div><div class="kicker">FOOD</div><h2 class="section-title">The menu</h2></div><span class="tag">GF · DF · V · VG options</span></div><div class="grid grid-3">${foods.map(f=>`<div class="card"><h3 style="font-size:22px">${f[0]}</h3><p>${f[1]}</p>${f[2]?`<div style="margin-top:10px"><span class="tag">${f[2]}</span></div>`:''}</div>`).join('')}</div></section>
    <section class="section"><div class="section-head"><div><div class="kicker">COCKTAILS</div><h2 class="section-title">The good stuff</h2></div></div><div class="grid grid-3">${cocktails.map(c=>`<div class="card"><h3>${c[0]}</h3><p>${c[1]}</p></div>`).join('')}</div></section>
    <section class="section"><div class="section-head"><div><div class="kicker">BALI GAMES</div><h2 class="section-title">A little healthy competition</h2></div></div><div class="grid grid-3">${['Carry the Bintang','Bali Thong Toss','Lime & Spoon Race','Nasi Goreng Relay','Massage Race'].map((g,i)=>`<div class="card"><div class="meta">GAME ${i+1}</div><h3>${g}</h3><p>Full instructions will appear on the day.</p></div>`).join('')}</div></section>`);
}

function baliPage(){
  return pageWrap(`<div class="page-head"><div class="kicker">BALI BASICS</div><h1 class="page-title">Everything useful. Nothing you don't need.</h1><p class="page-copy">Tap a section to open it. The broader guide stays out of the way unless it is genuinely useful for this trip or for anyone staying longer.</p></div>
    <div class="info-strip" style="margin-bottom:16px"><b>Important:</b> Entry, visa, medication and travel requirements can change. Critical items should always be checked against official government and airline advice before departure.</div>
    ${GUIDE.map((s,si)=>`<div class="accordion"><button onclick="APP_UI.acc(this)"><span class="acc-title"><span>${s.icon}</span>${s.title}</span><span class="chev">⌄</span></button><div class="acc-body">${s.items.map(([t,b])=>`<div style="margin-bottom:16px"><b style="color:var(--ink)">${t}</b><br>${b}</div>`).join('')}${si===0?officialLinks():''}</div></div>`).join('')}
    <section class="section"><div class="section-head"><div><div class="kicker">BALI READY</div><h2 class="section-title">My checklist</h2></div></div><div class="checklist">${CHECKS.map((c,i)=>`<label class="checkrow"><input type="checkbox" ${APP.state.checklist[i]?'checked':''} onchange="APP_UI.check(${i},this.checked)"><span>${c}</span></label>`).join('')}</div></section>`);
}

function officialLinks(){return `<div class="hr"></div><div class="actions-row"><a class="primary-btn" target="_blank" rel="noopener" href="https://evisa.imigrasi.go.id/">Official eVisa</a><a class="ghost-btn" target="_blank" rel="noopener" href="https://allindonesia.imigrasi.go.id/">All Indonesia</a><a class="ghost-btn" target="_blank" rel="noopener" href="https://lovebali.baliprov.go.id/">Bali Tourist Levy</a><a class="ghost-btn" target="_blank" rel="noopener" href="https://www.smartraveller.gov.au/destinations/asia/indonesia">Smartraveller</a></div><div class="actions-row"><a class="ghost-btn" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=7neeR2ZH00c">Visa video</a><a class="ghost-btn" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=zUqUaEwJj3A">All Indonesia video</a><a class="ghost-btn" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=L-0qquSH5yA">Bali levy video</a></div>`}

function toolsPage(){
  return pageWrap(`<div class="page-head"><div class="kicker">USEFUL TOOLS</div><h1 class="page-title">The stuff you'll actually use.</h1><p class="page-copy">Live weather, exchange rate, nearby essentials, apps and quick directions back to the villa.</p></div>
    <div class="grid grid-2">
      <div class="card weather-card"><div class="meta">LIVE · SEMINYAK</div><div id="weatherBox"><p>Loading weather…</p></div></div>
      <div class="card"><div class="meta">LIVE · AUD ⇄ IDR</div><h3>Currency converter</h3><div class="converter"><div class="field"><label id="fromLabel">AUD</label><input id="fxInput" inputmode="decimal" value="10" oninput="APP_UI.convertFX()"></div><button class="swap" onclick="APP_UI.swapFX()">⇄</button><div class="field"><label id="toLabel">IDR</label><input id="fxOutput" readonly></div></div><p class="small" id="fxRate" style="margin-top:10px">Loading rate…</p></div>
    </div>
    <section class="section"><div class="section-head"><div><div class="kicker">NEAR ME</div><h2 class="section-title">Find something nearby</h2></div></div><div class="find-grid">${[['💊','Pharmacy','pharmacy'],['🏧','ATM','ATM'],['🏥','Medical clinic','medical clinic'],['🛒','Supermarket','supermarket'],['🏪','Convenience store','convenience store'],['💱','Money changer','money changer'],['☕','Coffee','coffee'],['🏖️','Beach','beach']].map(x=>`<button class="find-btn" onclick="APP_UI.nearMe('${x[2]}')"><span>${x[0]}</span><span>${x[1]}</span></button>`).join('')}</div></section>
    <section class="section"><div class="section-head"><div><div class="kicker">ESSENTIAL APPS</div><h2 class="section-title">Know what you're looking for</h2></div></div><div class="app-grid">${APP_CARDS.map(a=>`<a class="app-card" href="${a[3]}" target="_blank" rel="noopener" style="text-decoration:none"><img src="${a[2]}" alt="${a[0]} logo" onerror="this.style.display='none'"><b>${a[0]}</b><small>${a[1]}</small></a>`).join('')}</div></section>
    <section class="section"><div class="grid grid-2"><div class="card"><div class="meta">GET BACK</div><h3>Take me to Chandra Villas</h3><p>${APP.config.villaAddress}</p><div class="actions-row"><button class="primary-btn" onclick="APP_UI.maps('${encodeURIComponent(APP.config.villaAddress)}')">Directions</button><button class="ghost-btn" onclick="APP_UI.copy('${APP.config.villaAddress.replace(/'/g,"\\'")}')">Copy address</button></div></div><div class="card"><div class="meta">NEED HELP?</div><h3>Medical & pharmacy</h3><p>Current pharmacy-delivery and doctor-to-villa WhatsApp contacts will be added here once the providers are locked in.</p><div class="actions-row"><button class="ghost-btn" onclick="APP_UI.nearMe('pharmacy')">Nearest pharmacy</button><button class="ghost-btn" onclick="APP_UI.nearMe('hospital')">Nearest hospital</button></div></div></div></section>`);
}

function plansPage(){
  const items=[...APP.state.plans,...APP.state.cart];
  return pageWrap(`<div class="page-head"><div class="kicker">MY PLANS</div><h1 class="page-title">Your Bali, saved.</h1><p class="page-copy">Your RSVPs, bookings and paid/cash-on-day items appear here on this device.</p></div>
    ${items.length?`<div class="grid grid-2">${items.map(it=>`<div class="card"><div class="meta">${it.meta||''}</div><h3>${escapeHTML(it.title||it.name)}</h3><p>${it.detail||''}</p><div style="margin-top:10px">${it.type==='paid'?'<span class="badge badge-paid">PAY NOW</span>':it.type==='cash'?'<span class="badge badge-cash">CASH ON DAY</span>':'<span class="badge badge-free">RSVP / FREE</span>'}</div></div>`).join('')}</div>`:`<div class="empty">Nothing saved yet. Add Sunday sunset, pizza, a massage or a floaty and it will appear here.</div>`}
    <section class="section"><div class="section-head"><div><div class="kicker">BALI READY</div><h2 class="section-title">Checklist progress</h2></div></div><div class="card"><h3>${Object.values(APP.state.checklist).filter(Boolean).length} of ${CHECKS.length} complete</h3><p>Open the Bali Guide to continue your checklist.</p><div class="actions-row"><button class="secondary-btn" onclick="routeTo('bali')">Open checklist</button></div></div></section>`);
}

function profilePage(){
  const p=APP.state.profile||{};
  return pageWrap(`<div class="page-head"><div class="kicker">YOUR PROFILE</div><h1 class="page-title">Make it yours.</h1><p class="page-copy">Your name, 4-digit PIN and profile photo are stored on this device. This keeps your checklist and My Plans personalised.</p></div>
    <div class="card profile-card"><div>${p.photo?`<img class="avatar" src="${p.photo}">`:`<div class="avatar">📷</div>`}</div><div><h3>${p.name?escapeHTML(p.name):'Guest profile'}</h3><p>${p.name?'Update your details or photo below.':'Set up once, then the app remembers you on this device.'}</p></div></div>
    <section class="section"><div class="card"><div class="form-grid"><div class="field"><label>Name</label><input id="profileName" value="${escapeHTML(p.name||'')}" placeholder="Your name"></div><div class="field"><label>4-digit PIN</label><input id="profilePin" type="password" inputmode="numeric" maxlength="4" value="${escapeHTML(p.pin||'')}" placeholder="••••"></div><div class="field"><label>Profile photo</label><input id="profilePhoto" type="file" accept="image/*"></div><button class="primary-btn" onclick="APP_UI.saveProfile()">Save profile</button></div></div></section>`);
}

function ausDayPage(){
  return pageWrap(`<button class="ghost-btn" onclick="routeTo('home')" style="margin-bottom:14px">← Back to Big Bali Bash</button>
    <section class="aus-banner"><div class="aus-kicker">AUSTRALIA DAY · TUESDAY 26 JANUARY 2027 · BALI</div><h1>THE GREAT<br>AUSSIE RECOVERY</h1><div class="scribble">Pizza. Pool. Triple J.</div><p style="max-width:650px;line-height:1.7">Yesterday was the Big Bali Bash. Today, we recover. Come down from 11, bring whatever you want to drink, grab a spot by the pool and do as much — or as little — as you like.</p></section>
    <section class="section"><div class="grid grid-3"><div class="aus-card"><div class="meta">1–3PM</div><h3>🍕 Bali Pizza Party</h3><p>Private pizza service at the villa. Completely optional.</p><div class="actions-row"><button class="aus-btn" onclick="APP_UI.addItem(${JSON.stringify(PIZZA).replace(/"/g,'&quot;')})">Add pizza · ${money(PIZZA.price)}</button></div></div><div class="aus-card"><div class="meta">10AM–4PM</div><h3>💆 Massage</h3><p>Choose your treatment and time. Reserve in the app, then pay your therapist cash on the day.</p><div class="actions-row"><button class="aus-btn" onclick="APP_UI.openMassage()">Book massage</button></div></div><div class="aus-card"><div class="meta">ALL DAY</div><h3>🛟 Floaties</h3><p>Choose a float for the villa pool. Paid online with pizza at checkout.</p><div class="actions-row"><button class="aus-btn" onclick="APP_UI.scrollTo('float-shop')">Choose float</button></div></div></div></section>
    <section class="section"><div class="aus-card"><div class="meta">THE DAY</div><h3 style="font-size:34px">No schedule. No pressure.</h3><p>10AM massages begin · 11AM pool, Triple J, BYO drinks and floaties · 1–3PM pizza · from 4PM stay, swim, nap, drink or head home.</p></div></section>
    <section id="float-shop" class="section"><div class="section-head"><div><div class="kicker" style="color:var(--aus-red)">GET FLOAT BALI</div><h2 class="section-title" style="color:var(--aus-teal)">Choose your floaty</h2></div><a class="ghost-btn" target="_blank" rel="noopener" href="https://www.getfloatbali.com/pricelist">Supplier price list</a></div><div class="product-grid">${FLOATS.map(f=>`<div class="product"><div class="product-img"><img src="${f.img}" alt="${f.name}" loading="lazy" onerror="this.parentNode.innerHTML='🛟'"></div><div class="product-body"><span class="badge badge-free">${f.size}</span><h4>${f.name}</h4><p>24-hour hire · final supplier availability applies.</p><div class="price">From ${money(f.priceAUD,'AUD')}</div><button class="aus-btn" onclick='APP_UI.addFloat(${JSON.stringify(f)})'>Add to cart</button></div></div>`).join('')}</div><p class="small" style="margin-top:10px">Float pricing is currently shown from AUD $8/day as the working guest price. Update this list once final supplier prices are locked. Seminyak is listed by the supplier as free delivery/pickup.</p></section>
    <section class="section"><div class="aus-card"><h3>Float hire terms</h3><p>Supplier terms include a 24-hour rental period, electric pump, no deposit and damage charges if a float is punctured or torn. Full terms remain available on the supplier website.</p></div></section>`,{aus:true});
}

function cartMarkup(){
  const c=APP.state.cart;
  const aud=c.filter(x=>x.type==='paid'&&x.currency==='AUD').reduce((s,x)=>s+(x.price||0)*(x.qty||1),0);
  const idr=c.filter(x=>x.type==='paid'&&x.currency==='IDR').reduce((s,x)=>s+(x.price||0)*(x.qty||1),0);
  const cash=c.filter(x=>x.type==='cash').reduce((s,x)=>s+(x.price||0),0);
  return `<div class="cart-overlay ${APP.state.cartOpen?'open':''}" onclick="APP_UI.closeCart()"></div><aside class="cart-drawer ${APP.state.cartOpen?'open':''}"><div style="display:flex;justify-content:space-between;align-items:center"><div><div class="kicker">YOUR PLANS</div><h2 class="section-title" style="font-size:36px">Cart</h2></div><button class="icon-btn" onclick="APP_UI.closeCart()">✕</button></div>
    ${c.length?c.map((x,i)=>`<div class="cart-line"><div><b>${escapeHTML(x.title||x.name)}</b><small>${x.meta||x.detail||''}</small><div style="margin-top:5px">${x.type==='paid'?'<span class="badge badge-paid">PAY NOW</span>':x.type==='cash'?'<span class="badge badge-cash">CASH ON DAY</span>':'<span class="badge badge-free">RSVP ONLY</span>'}</div></div><div style="text-align:right"><b>${x.type==='paid'?money((x.price||0)*(x.qty||1),x.currency):x.type==='cash'?money(x.price,'IDR'):'FREE'}</b><br><button style="border:0;background:none;color:#8a5d50;font-size:10px;margin-top:5px" onclick="APP_UI.removeCart(${i})">Remove</button></div></div>`).join(''):'<div class="empty" style="margin-top:18px">Your cart is empty.</div>'}
    ${c.length?`<div class="cart-summary"><div class="cart-total"><span>Pay now · AUD</span><b>${money(aud,'AUD')}</b></div><div class="cart-total"><span>Pay now · IDR</span><b>${money(idr,'IDR')}</b></div><div class="cart-total"><span>Cash on day</span><b>${money(cash,'IDR')}</b></div><div class="hr"></div><p class="small">Massage is reserved now but paid directly to the therapist in cash. RSVP-only items are not charged.</p></div><button class="primary-btn" style="width:100%;margin-top:12px" onclick="APP_UI.checkout()">Confirm / Checkout</button>`:''}
  </aside>`;
}

function modalMarkup(){return `<div id="modal" class="modal" onclick="if(event.target===this)APP_UI.closeModal()"><div class="modal-card" id="modalCard"></div></div>`;}

function render(){
  const pages={home:homePage,trip:tripPage,birthday:birthdayPage,bali:baliPage,tools:toolsPage,plans:plansPage,profile:profilePage,ausday:ausDayPage};
  document.getElementById('app').innerHTML=(pages[APP.state.route]||homePage)();
  setTimeout(()=>{
    if(APP.state.route==='home'){runCountdown();loadHomeLive();}
    if(APP.state.route==='tools'){loadWeather();loadFX();}
  },20);
}

async function loadHomeLive(){
  try{const w=await weatherData();document.getElementById('homeWeather').textContent=`${Math.round(w.current.temperature_2m)}°C · ${weatherLabel(w.current.weather_code)} · rain ${w.daily.precipitation_probability_max[0]??0}%`; }catch(e){document.getElementById('homeWeather').textContent='Weather available online';}
  try{const r=await fxRate();document.getElementById('homeFx').textContent=`A$10 ≈ Rp ${Math.round(10*r).toLocaleString('id-ID')}`;}catch(e){document.getElementById('homeFx').textContent='Converter available online';}
}
function runCountdown(){
  const el=document.getElementById('countdown');if(!el)return;
  const draw=()=>{const diff=new Date(APP.config.tripStart)-new Date();if(diff<=0){el.innerHTML='<div class="countbox"><b>IT\'S ON</b><span>Bali time</span></div>';return;}const d=Math.floor(diff/864e5),h=Math.floor(diff%864e5/36e5),m=Math.floor(diff%36e5/6e4);el.innerHTML=`<div class="countbox"><b>${d}</b><span>days</span></div><div class="countbox"><b>${h}</b><span>hours</span></div><div class="countbox"><b>${m}</b><span>mins</span></div>`};draw();setInterval(draw,60000);
}
async function weatherData(){
  const {lat,lon}=APP.config.weather;
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FMakassar&forecast_days=7`;
  const r=await fetch(u);if(!r.ok)throw new Error('weather');return r.json();
}
function weatherLabel(code){if(code===0)return'Clear';if([1,2].includes(code))return'Partly cloudy';if(code===3)return'Cloudy';if([45,48].includes(code))return'Fog';if(code>=51&&code<=67)return'Rain';if(code>=80&&code<=82)return'Showers';if(code>=95)return'Thunderstorms';return'Tropical weather';}
async function loadWeather(){
  const box=document.getElementById('weatherBox');if(!box)return;
  try{const w=await weatherData();const c=w.current;box.innerHTML=`<div class="weather-main"><div><div class="weather-temp">${Math.round(c.temperature_2m)}°</div><div class="weather-desc">${weatherLabel(c.weather_code)} · feels ${Math.round(c.apparent_temperature)}° · humidity ${c.relative_humidity_2m}%</div></div><div class="tag">Rain ${w.daily.precipitation_probability_max[0]??0}%</div></div><div class="forecast">${w.daily.time.map((d,i)=>`<div class="forecast-day">${new Date(d+'T00:00:00').toLocaleDateString('en-AU',{weekday:'short'})}<b>${Math.round(w.daily.temperature_2m_max[i])}° / ${Math.round(w.daily.temperature_2m_min[i])}°</b><span>${w.daily.precipitation_probability_max[i]??0}% rain</span></div>`).join('')}</div>`}catch(e){box.innerHTML='<p>Live weather needs an internet connection.</p>'}
}
async function fxRate(){
  const cache=JSON.parse(sessionStorage.getItem('bbb_fx')||'null');if(cache&&Date.now()-cache.t<36e5)return cache.rate;
  const r=await fetch('https://open.er-api.com/v6/latest/AUD');if(!r.ok)throw new Error('fx');const j=await r.json();const rate=j.rates.IDR;sessionStorage.setItem('bbb_fx',JSON.stringify({t:Date.now(),rate}));return rate;
}
async function loadFX(){await APP_UI.convertFX();}

const APP_UI = {
  acc(btn){btn.closest('.accordion').classList.toggle('open')},
  check(i,v){APP.state.checklist[i]=v;save('bbb_checklist',APP.state.checklist)},
  maps(q){window.open(`https://www.google.com/maps/search/?api=1&query=${q}`,'_blank')},
  copy(t){navigator.clipboard?.writeText(t);toast('Copied')},
  scrollTo(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'})},
  openCart(){APP.state.cartOpen=true;render()},closeCart(){APP.state.cartOpen=false;render()},
  addItem(item){
    const existing=APP.state.cart.find(x=>x.id===item.id);
    if(existing&&item.type==='paid'){existing.qty=(existing.qty||1)+1}else if(!existing){APP.state.cart.push({...item,qty:1})}
    save('bbb_cart',APP.state.cart);toast(item.type==='rsvp'?'RSVP added to My Plans':'Added to cart');render();
  },
  addFloat(f){this.addItem({id:'float-'+f.id,type:'paid',title:f.name,price:f.priceAUD,currency:'AUD',meta:'Australia Day float hire · 26 Jan',badge:'PAY NOW',qty:1,img:f.img})},
  removeCart(i){APP.state.cart.splice(i,1);save('bbb_cart',APP.state.cart);render()},
  async saveProfile(){
    const name=document.getElementById('profileName').value.trim();const pin=document.getElementById('profilePin').value.trim();
    if(!name)return toast('Add your name');if(!/^\d{4}$/.test(pin))return toast('PIN must be 4 digits');
    let photo=APP.state.profile?.photo||'';const file=document.getElementById('profilePhoto').files[0];if(file)photo=await compressImage(file);
    APP.state.profile={name,pin,photo};save('bbb_profile',APP.state.profile);toast('Profile saved');render();
  },
  nearMe(term){
    if(!navigator.geolocation){return window.open(`https://www.google.com/maps/search/${encodeURIComponent(term)}`,'_blank')}
    navigator.geolocation.getCurrentPosition(p=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(term)}&center=${p.coords.latitude},${p.coords.longitude}`,'_blank'),()=>window.open(`https://www.google.com/maps/search/${encodeURIComponent(term+' near me')}`,'_blank'),{enableHighAccuracy:false,timeout:7000});
  },
  async convertFX(){
    const i=document.getElementById('fxInput'),o=document.getElementById('fxOutput'),rt=document.getElementById('fxRate');if(!i||!o)return;
    try{const rate=await fxRate(),v=parseFloat(i.value)||0;if(APP.state.fxDirection==='AUD_IDR'){o.value=Math.round(v*rate).toLocaleString('id-ID');rt.textContent=`Live indicative rate: A$1 ≈ Rp ${Math.round(rate).toLocaleString('id-ID')}`;}else{o.value=(v/rate).toFixed(2);rt.textContent=`Live indicative rate: Rp ${Math.round(rate).toLocaleString('id-ID')} ≈ A$1`;}}catch(e){rt.textContent='Live rate unavailable. Check your connection.'}
  },
  swapFX(){APP.state.fxDirection=APP.state.fxDirection==='AUD_IDR'?'IDR_AUD':'AUD_IDR';document.getElementById('fromLabel').textContent=APP.state.fxDirection==='AUD_IDR'?'AUD':'IDR';document.getElementById('toLabel').textContent=APP.state.fxDirection==='AUD_IDR'?'IDR':'AUD';document.getElementById('fxInput').value=APP.state.fxDirection==='AUD_IDR'?'10':'100000';this.convertFX()},
  openMassage(){
    const times=[];for(let h=10;h<16;h++){times.push(`${String(h).padStart(2,'0')}:00`,`${String(h).padStart(2,'0')}:30`)}
    const m=document.getElementById('modal'),card=document.getElementById('modalCard');
    card.innerHTML=`<div style="display:flex;justify-content:space-between"><div><div class="kicker">AUSTRALIA DAY</div><h2>Book a massage</h2></div><button class="icon-btn" onclick="APP_UI.closeModal()">✕</button></div><p class="page-copy">Reserve your treatment and time now. Payment is cash directly to the therapist on the day.</p><div class="form-grid"><div class="field"><label>Treatment</label><select id="massageType">${MASSAGES.map(x=>`<option value="${x.id}">${x.name} · ${money(x.price)} · ${x.mins} min</option>`).join('')}</select></div><div class="field"><label>Time</label><select id="massageTime">${times.map(t=>`<option>${t}</option>`).join('')}</select></div><button class="aus-btn" onclick="APP_UI.addMassage()">Reserve & add to cart</button></div><p class="small" style="margin-top:10px">Time slots shown here are the working booking grid. Final therapist capacity can be connected to a shared booking database later to prevent double-booking across devices.</p>`;m.classList.add('open');
  },
  addMassage(){const x=MASSAGES.find(m=>m.id===document.getElementById('massageType').value),t=document.getElementById('massageTime').value;APP.state.cart.push({id:`${x.id}-${t}`,type:'cash',title:x.name,price:x.price,currency:'IDR',meta:`Australia Day · ${t} · cash on day`,detail:`${x.mins} minutes`});save('bbb_cart',APP.state.cart);this.closeModal();toast('Massage reserved in your cart');render()},
  closeModal(){document.getElementById('modal')?.classList.remove('open')},
  async checkout(){
    const profile=APP.state.profile;
    if(!profile){this.closeCart();routeTo('profile');return toast('Create your guest profile first')}
    const paid=APP.state.cart.filter(x=>x.type==='paid');
    const nonPaid=APP.state.cart.filter(x=>x.type!=='paid');
    if(!paid.length){APP.state.plans=[...APP.state.plans,...APP.state.cart];APP.state.cart=[];save('bbb_plans',APP.state.plans);save('bbb_cart',[]);toast('Plans confirmed');return render()}
    try{
      const res=await fetch('/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:paid,profile,nonPaid,successUrl:location.origin+'/#/plans',cancelUrl:location.href})});
      if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error||'Checkout is not configured yet')}
      const j=await res.json();if(j.url)location.href=j.url;
    }catch(e){alert('The booking cart is working, but live Stripe checkout still needs your Stripe secret key added in Vercel. Your selections are saved.\n\n'+e.message)}
  }
};
window.APP_UI=APP_UI;window.routeTo=routeTo;

function compressImage(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas'),size=400;c.width=size;c.height=size;const ctx=c.getContext('2d');const s=Math.min(img.width,img.height),sx=(img.width-s)/2,sy=(img.height-s)/2;ctx.drawImage(img,sx,sy,s,s,0,0,size,size);resolve(c.toDataURL('image/jpeg',.82))};img.onerror=reject;img.src=r.result};r.onerror=reject;r.readAsDataURL(file)})}

if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
render();
