const app = document.getElementById('app');
const drawer = document.getElementById('drawer');
const menuButton = document.getElementById('menuButton');
const drawerClose = document.getElementById('drawerClose');

const routes = {};

const dietaryBadges = (items=[]) => `<div class="badges">${items.map(x=>`<span class="badge">${x}</span>`).join('')}</div>`;
const menuItem = (name, desc, badges=[]) => `
  <div class="menu-item">
    <div class="menu-dot"></div>
    <div><strong>${name}</strong><span>${desc}</span>${dietaryBadges(badges)}</div>
  </div>`;

routes.home = () => `
  <section class="hero">
    <div class="kicker">Nicolle's 50th · Bali 2027</div>
    <h1>B.B.B<span class="script">The Big Bali Bash</span></h1>
    <div class="hero-sub">25 January 2027 · Bali</div>
    <div class="hero-tagline">Better. Bolder. Boujier.</div>
    <div class="hero-meta">
      <span class="pill">☀ Sun</span><span class="pill">🍸 Cocktails</span><span class="pill">🌴 Good people</span><span class="pill">✨ Bigger days</span>
    </div>
    <div class="countdown" id="countdown">
      <div><strong id="days">—</strong><span>Days</span></div>
      <div><strong id="hours">—</strong><span>Hours</span></div>
      <div><strong id="minutes">—</strong><span>Minutes</span></div>
      <div><strong id="seconds">—</strong><span>Seconds</span></div>
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Your Bali weekend</h2><div class="section-note">Everything in one place</div></div>
    <div class="grid two">
      <div class="card icon-tile"><div class="icon">✦</div><div><h3>The Big Bali Bash</h3><p>The main event. Food, cocktails, music, games and one very big 50th.</p><button class="cta" data-route="bash">Open event</button></div></div>
      <div class="card icon-tile"><div class="icon">☀</div><div><h3>The Great Aussie Recovery</h3><p>Australia Day in Bali. Pizza, pool, Triple J, massages and absolutely no pressure.</p><button class="cta" data-route="recovery">See recovery day</button></div></div>
    </div>
  </section>

  <section class="section">
    <div class="grid two">
      <div class="card"><h3>Quick links</h3><p>Menus, bookings, villa details and the Bali guide.</p><button class="cta secondary" data-route="menus">View menus</button><button class="cta secondary" data-route="bookings">Bookings & dietary</button></div>
      <div class="card"><h3>New to Bali?</h3><p>We’ll keep the useful arrival notes, transport tips and travel checklist here so nobody has to hunt through the group chat.</p><button class="cta secondary" data-route="bali">Open Bali guide</button></div>
    </div>
  </section>
`;

routes.itinerary = () => `
  <div class="page-head"><div class="kicker">Bali 2027</div><h1 class="page-title">Itinerary</h1><div class="script-line">Good people. Bigger adventures.</div></div>
  <div class="timeline">
    <div class="card timeline-item"><div class="time">23 JAN</div><div class="timeline-copy"><h3>Arrivals & settle in</h3><p>Guests arrive, villas, pool, easy drinks and a relaxed first night.</p></div></div>
    <div class="card timeline-item"><div class="time">24 JAN</div><div class="timeline-copy"><h3>Bali day</h3><p>Open day for beach clubs, shopping, spa time and whatever the group feels like.</p></div></div>
    <div class="card timeline-item"><div class="time">25 JAN</div><div class="timeline-copy"><h3>Nicolle's 50th — The Big Bali Bash</h3><p>The main event. Afternoon finger food, cocktails, games, champagne tower, dinner and DJ.</p></div></div>
    <div class="card timeline-item"><div class="time">26 JAN</div><div class="timeline-copy"><h3>The Great Aussie Recovery</h3><p>From 11:00am. BYO drinks, Triple J, pool, massages and Bali Pizza Party from 1:00–3:00pm.</p></div></div>
    <div class="card timeline-item"><div class="time">27 JAN</div><div class="timeline-copy"><h3>Recover, brunch & departures</h3><p>A slow final morning. Details to come as travel plans are confirmed.</p></div></div>
  </div>
`;

routes.bash = () => `
  <div class="page-head"><div class="kicker">25 January 2027</div><h1 class="page-title">The Big Bali Bash</h1><div class="script-line">Better. Bolder. Boujier.</div></div>
  <div class="notice">This page will become the guest event hub. We can add the final start time, dress note, villa location and any surprise moments once they are locked in.</div>
  <section class="section">
    <div class="grid two">
      <div class="card"><h3>Afternoon</h3><p>Finger food, cocktails, games and a relaxed villa party atmosphere.</p></div>
      <div class="card"><h3>Evening</h3><p>Champagne tower, buffet dinner, cake moment and DJ into the night.</p></div>
    </div>
  </section>
  <section class="section"><div class="section-head"><h2>Guest highlights</h2></div><div class="grid two">
    <div class="card"><h3>🍸 Cocktail bar</h3><p>Villa bar service with selected cocktails and sparkling.</p></div>
    <div class="card"><h3>🥂 Champagne tower</h3><p>The celebration moment beside Nicolle's cake.</p></div>
    <div class="card"><h3>🎧 DJ</h3><p>Music into the evening. Details to come.</p></div>
    <div class="card"><h3>🎲 Games</h3><p>Party games and a few competitive moments throughout the afternoon.</p></div>
  </div></section>
`;

routes.recovery = () => `
  <div class="page-head"><div class="kicker">Australia Day · 26 January 2027</div><h1 class="page-title">The Great Aussie Recovery</h1><div class="script-line">Pizza. Pool. Triple J.</div></div>
  <div class="notice"><strong>Completely optional.</strong> Come for the pizza, the pool, a massage, or just a little while. If you opt into a paid activity, payment will be required in advance to lock it in.</div>
  <section class="section"><div class="timeline">
    <div class="card timeline-item"><div class="time">10:00</div><div class="timeline-copy"><h3>Massage bookings commence</h3><p>Pre-booked appointments only. Spare room / villa treatment area.</p></div></div>
    <div class="card timeline-item"><div class="time">11:00</div><div class="timeline-copy"><h3>Recovery begins</h3><p>Arrive at the villa, BYO drinks, pool open, Triple J on, floaties out.</p></div></div>
    <div class="card timeline-item"><div class="time">1–3PM</div><div class="timeline-copy"><h3>Bali Pizza Party</h3><p>Fresh pizzas made at the villa for two hours.</p></div></div>
    <div class="card timeline-item"><div class="time">3–4PM</div><div class="timeline-copy"><h3>Pool & recovery mode</h3><p>Final massage appointments. Keep the good times rolling.</p></div></div>
    <div class="card timeline-item"><div class="time">4PM+</div><div class="timeline-copy"><h3>No schedule</h3><p>Stay, swim, listen to Triple J, have a drink, head home, nap — whatever you feel like.</p></div></div>
  </div></section>
  <section class="section"><div class="grid two">
    <div class="card"><h3>🍕 Pizza</h3><p>Specialty package currently planned. Opt-in only.</p></div>
    <div class="card"><h3>💆 Massage & spa</h3><p>10:00am–4:00pm. Book through the app, cash on arrival.</p></div>
    <div class="card"><h3>🛟 Pool float hire</h3><p>From A$8 per float per day. Must be booked in advance.</p></div>
    <div class="card"><h3>🎵 Triple J</h3><p>On all day. Good vibes only.</p></div>
  </div></section>
`;

routes.menus = () => `
  <div class="page-head"><div class="kicker">Food & drinks</div><h1 class="page-title">Menus</h1><div class="script-line">Good food. Great company.</div></div>
  <section class="section"><div class="section-head"><h2>Finger food</h2><div class="section-note">Afternoon · adults</div></div><div class="menu-section">
    ${menuItem('Mini beef cheeseburger sliders','Cheese, pickle, caramelised onion & burger sauce')}
    ${menuItem('Sticky crispy chicken bites','Sweet chilli & honey glaze, sesame & spring onion')}
    ${menuItem('Sticky pork belly bites','Pineapple, chilli & lime',['GF option'])}
    ${menuItem('Mozzarella arancini','Pesto aioli',['V'])}
    ${menuItem('Crispy vegetable rice-paper rolls','Sweet chilli dipping sauce',['VG','GF'])}
    ${menuItem('Loaded baby potatoes','Avocado, corn salsa, lime & herbs',['VG','GF'])}
  </div></section>
  <section class="section"><div class="section-head"><h2>Buffet dinner</h2></div><div class="menu-section">
    ${menuItem('Pumpkin, chickpea & coconut curry','Coconut milk, mild spices & fresh herbs',['VG','GF'])}
    ${menuItem('Grilled halloumi & vegetable skewers','Zucchini, capsicum, red onion & herb dressing',['V','GF'])}
    ${menuItem('Charred corn','Lime butter & herbs',['V','GF'])}
    ${menuItem('Fresh garden salad','Avocado & vinaigrette',['VG','GF'])}
    ${menuItem('Steamed jasmine rice','Light, fluffy & fragrant',['VG','GF'])}
    ${menuItem('Chicken satay sticks','Peanut sauce & sambal',['GF'])}
    ${menuItem('Slow-cooked pulled beef','Garlic & herb gravy, kept tender in its cooking juices',['GF'])}
    ${menuItem('Garlic butter chicken thighs','Lemon, garlic & fresh herbs',['GF'])}
    ${menuItem('Beef rendang','Slow-cooked coconut, chilli & aromatic spices',['GF'])}
    ${menuItem('Balinese-style shredded chicken','Aromatic spices, lime & fresh herbs',['GF'])}
    ${menuItem('Balinese pork skewers','Sweet soy, garlic & chilli')}
    ${menuItem('Roast pork belly','Crispy crackling with apple & chilli relish',['GF'])}
    ${menuItem('Fresh tropical fruit platter','Seasonal tropical fruit',['VG','GF'])}
  </div></section>
  <section class="section"><div class="section-head"><h2>Kids</h2><div class="section-note">Simple crowd favourites</div></div><div class="menu-section">
    ${menuItem('Napoli pasta','Simple tomato sauce & parmesan',['V'])}
    ${menuItem('Crispy chicken tenders','Sauce on the side')}
    ${menuItem('Hot chips','Classic and easy',['V'])}
  </div></section>
`;

routes.bookings = () => `
  <div class="page-head"><div class="kicker">Guest options</div><h1 class="page-title">Bookings</h1><div class="script-line">Choose what suits you.</div></div>
  <div class="notice">Version 1 saves selections on this device only. When we connect the database later, Shan will be able to see everyone's submissions in one admin view.</div>
  <section class="section">
    <form class="card form-card" id="guestForm">
      <h3>Your details</h3>
      <label for="guestName">Name</label><input id="guestName" name="guestName" placeholder="Your name" required />
      <label for="pizza">Great Aussie Recovery pizza</label><select id="pizza" name="pizza"><option value="">Choose</option><option>Yes please</option><option>No thanks</option><option>Maybe / decide later</option></select>
      <label for="massage">Massage / spa</label><select id="massage" name="massage"><option value="">Choose</option><option>Interested</option><option>Not interested</option></select>
      <label for="float">Pool float hire</label><select id="float" name="float"><option value="">Choose</option><option>Interested</option><option>Not interested</option></select>
      <label for="dietary">Dietary requirements / allergies</label><textarea id="dietary" name="dietary" placeholder="Vegetarian, vegan, gluten free, allergies, none, etc."></textarea>
      <button class="cta" type="submit">Save my selections</button>
      <div class="saved" id="savedMessage">Saved on this device ✓</div>
    </form>
  </section>
`;

routes.bali = () => `
  <div class="page-head"><div class="kicker">Travel help</div><h1 class="page-title">Bali Guide</h1><div class="script-line">Easy in. Easy out.</div></div>
  <div class="grid two">
    <div class="card"><h3>Passport & entry</h3><p>We’ll add the final 2027 entry checklist here closer to travel so everyone is working from current information.</p></div>
    <div class="card"><h3>Airport arrival</h3><p>Where to meet drivers, what to expect, and the easiest process for getting from the airport to the villas.</p></div>
    <div class="card"><h3>Money</h3><p>IDR basics, card use, cash tips and safe money-changing guidance.</p></div>
    <div class="card"><h3>Phone & transport</h3><p>eSIM/SIM tips plus Grab and Gojek notes for getting around.</p></div>
    <div class="card"><h3>What to pack</h3><p>Light clothing, swimwear, sunscreen, suitable footwear and anything needed for the main event.</p></div>
    <div class="card"><h3>Group updates</h3><p>Important event notices will live here as plans are finalised.</p></div>
  </div>
`;

routes.villa = () => `
  <div class="page-head"><div class="kicker">Where we're staying</div><h1 class="page-title">Villa Info</h1><div class="script-line">Home base in Bali.</div></div>
  <div class="notice">Add the confirmed villa address, map link, Wi‑Fi, room allocations and check-in instructions here once final.</div>
  <section class="section"><div class="grid two">
    <div class="card"><h3>Check-in</h3><p>Details to come.</p></div>
    <div class="card"><h3>Check-out</h3><p>Details to come.</p></div>
    <div class="card"><h3>Wi‑Fi</h3><p>Password to come.</p></div>
    <div class="card"><h3>Villa contact</h3><p>Host / manager details to come.</p></div>
  </div></section>
`;

routes.contact = () => `
  <div class="page-head"><div class="kicker">Need help?</div><h1 class="page-title">Contact Shan</h1><div class="script-line">I've got you.</div></div>
  <div class="card"><h3>Questions before Bali?</h3><p>For anything about the birthday, itinerary, bookings or travel information, message Shan directly.</p><button class="cta" onclick="alert('Add Shan\'s preferred WhatsApp link here when ready.')">Message Shan</button></div>
`;

function routeTo(name) {
  const route = routes[name] ? name : 'home';
  app.innerHTML = routes[route]();
  document.querySelectorAll('[data-route]').forEach(btn => btn.classList.toggle('active', btn.dataset.route === route && btn.closest('.bottom-nav')));
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
  window.scrollTo({top:0, behavior:'smooth'});
  history.replaceState({},'',`#${route}`);
  bindDynamic();
}

function bindDynamic() {
  document.querySelectorAll('[data-route]').forEach(btn => btn.onclick = () => routeTo(btn.dataset.route));
  if (document.getElementById('countdown')) startCountdown();
  const form = document.getElementById('guestForm');
  if (form) {
    const saved = JSON.parse(localStorage.getItem('bbbGuest') || '{}');
    ['guestName','pizza','massage','float','dietary'].forEach(id => { if (saved[id] !== undefined) document.getElementById(id).value = saved[id]; });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      localStorage.setItem('bbbGuest', JSON.stringify(data));
      const msg = document.getElementById('savedMessage'); msg.style.display='block';
      setTimeout(()=>msg.style.display='none',2200);
    });
  }
}

function startCountdown() {
  const target = new Date('2027-01-25T16:00:00+08:00').getTime();
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    ['days','hours','minutes','seconds'].forEach((id,i)=>{ const el=document.getElementById(id); if(el) el.textContent=[d,h,m,s][i]; });
  };
  tick();
  clearInterval(window.__bbbCountdown);
  window.__bbbCountdown = setInterval(tick,1000);
}

menuButton.addEventListener('click',()=>{ drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); });
drawerClose.addEventListener('click',()=>{ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); });
drawer.addEventListener('click',e=>{ if(e.target===drawer){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');} });

if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
routeTo(location.hash.replace('#','') || 'home');
