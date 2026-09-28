(()=>{
'use strict';
const KEY='bbb_nicky_tour_seen_v1';
const NICKY='/assets/nicky-profile.png';
let active=false,index=0,mark=null,card=null,shade=null,resizeTimer=null,currentTarget=null,busy=false,runId=0;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const $=s=>document.querySelector(s);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const steps=[
 {route:'home',target:'.hero',title:'Hey! I’m Nicky 👋',text:'I’m your B.B.B Bali guru. Let me show you around — I’ll take you to the important bits and you just tap Next when you’re ready.'},
 {route:'home',target:'.sunset-card',title:'Your home base',text:'Home keeps the important stuff easy to find. Next Up shows what’s coming, and your trip shortcuts live here too.'},
 {route:'bbb',target:'.bbb-hero',place:'bottom',title:'The B.B.B 🎂',text:'This is where the Big Bali Bash lives — the birthday plans, what’s happening and all the fun stuff for Nicolle’s 50th.'},
 {route:'bbb',target:'.itinerary-head',closest:'.section',place:'top',spot:'section-top',title:'The itinerary',text:'I’ll automatically scroll you to the next thing. Your B.B.B itinerary has the times and plans for the day — no group-chat archaeology required.'},
 {route:'bbb',target:'.cocktail-section',place:'top',spot:'section-top',title:'Cocktails 🍸',text:'Browse the B.B.B cocktail menu, choose your drinks and build your order. You can have a practice before the big day too.'},
 {route:'bbb',action:'drink-order',target:'.drink-drawer',place:'top',spot:'drawer-order',title:'My Order',text:'Your drinks collect here. When the B.B.B Bar is open on the day, Send order to the bar sends your order directly to our B.B.B bartenders. Until then, you can practise — I just won’t let you send it.'},
 {route:'bbb',target:'.bbb-photo-card',place:'top',title:'The B.B.B Media Roll 📸',text:'Please share your photos! B.B.B photos are collected in our private B.B.B Google Drive so Nicolle can keep the memories together and everyone can view the collection later.'},
 {route:'bash',target:'.bash-board-top',title:'The Bash Board',text:'Think of this as our little B.B.B Facebook feed. See what everyone’s up to, post updates and keep the trip chatter together.'},
 {route:'bash',target:'.bash-quick-compose',title:'Create a post',text:'Tap “What’s happening?” to post to the crew. You can add photos, check in somewhere or add how you’re feeling.'},
 {route:'bash',action:'chat',target:'.bash-chat-top',title:'B.B.B Group Chat 💬',text:'This is the crew chat. Send messages, reply and react. It’s the quick place to keep everyone together.'},
 {route:'bash',action:'chat',target:'.bash-chat-compose',title:'Share the photos!',text:'Use the camera or photo button to share your shots — including multiple photos at once. Tap photo bundles to open them, swipe through and save the ones you want. B.B.B media can also be saved into the shared Google Drive collection.'},
 {route:'travel',target:'.pagehead',title:'Travel ✈️',text:'Before Bali, this is an important one. Your flights, airport pickup and villa information all live in the Travel area.'},
 {route:'ready',target:'.pagehead',title:'Bali Ready',text:'Use Bali Ready for your visa, tourist levy, arrival declaration, insurance, passport and saved flight details. Work through it before you fly.'},
 {route:'travel',target:'.pickup-card, [class*="pickup-card"]',title:'Airport pickup',text:'Need a lift from the airport? Your Made airport pickup can be organised and managed here, along with your arrival details.'},
 {route:'travel',target:'.villa-actions',closest:'.card',place:'top',reveal:'card-below',title:'Chandra Villas',text:'Your Bali base is easy to find — open it in Maps, jump to the Chandra website or call from here.'},
 {route:'bali',target:'.section-head',findText:'The Bali Guide',closest:'.section',place:'top',title:'The Bali Guide 🌴',text:'Food, drinks, practical Bali info and Shannon’s recommendations are all here. Open a guide whenever you need it.'},
 {route:'profile',target:'.pagehead',place:'bottom',title:'Your Profile 👤',text:'This bit is all about YOU. Your profile is where you’ll find everything you’ve organised for the trip.'},
 {route:'profile',target:'.section-head',findText:'My Plans',closest:'.section',place:'top',spot:'plans-card',reveal:'section-below',title:'All your plans',text:'Your bookings and plans will appear here. If plans change and you need to reschedule, edit or cancel something, head back to your Profile and manage it here.'},
 {route:'profile',target:'#nicky-tour-profile-card',place:'top',spot:'tight',title:'Need the tour again?',text:'Haven’t had a chance to explore properly — or want another look? Come back to Profile and tap Take the tour with Nicky. I’ll start this walkthrough again anytime.'},
 {route:'home',target:'.nicky-launcher',place:'top',spot:'tight',title:'If you’re not sure… Ask Nicky! ✨',text:'I’m your number one B.B.B Bali guru. Ask me about the trip, itinerary, villa, Bali, where to go or what you’ve booked. I’m always hanging out here in the corner — tap me and chat whenever you need me.',finish:true}
];

function addProfileCard(){
 if(location.hash!=='#/profile'||$('#nicky-tour-profile-card'))return;
 const sections=[...document.querySelectorAll('#app .section')];
 const host=sections[0]||$('.pagehead'); if(!host)return;
 const section=document.createElement('section'); section.className='section nicky-tour-profile-section'; section.id='nicky-tour-profile-card';
 section.innerHTML=`<article class="card nicky-tour-profile-card"><div class="nicky-tour-profile-avatar"><img src="${NICKY}" alt="Nicky"></div><div class="nicky-tour-profile-copy"><div class="meta">NEED A QUICK TOUR?</div><h3>Haven’t explored the app yet?</h3><p>Click here and I’ll show you around — where everything is and how the good stuff works.</p><button class="btn olive" type="button" data-nicky-tour-start>Take the tour with Nicky <span aria-hidden="true">→</span></button></div></article>`;
 host.insertAdjacentElement('afterend',section);
}

function ensureUI(){
 if(shade)return;
 shade=document.createElement('div'); shade.className='nicky-tour-shade'; shade.innerHTML='<div class="nicky-tour-dim"></div>';
 mark=document.createElement('div'); mark.className='nicky-tour-mark';
 card=document.createElement('section'); card.className='nicky-tour-card'; card.setAttribute('role','dialog'); card.setAttribute('aria-live','polite');
 document.body.append(shade,mark,card);
}
function clearTarget(){mark?.classList.remove('show'); currentTarget=null; document.querySelectorAll('.nicky-tour-target').forEach(x=>x.classList.remove('nicky-tour-target'));}
function findTarget(step){
 let els=[...document.querySelectorAll(step.target||'')];
 if(step.findHeading) els=els.filter(el=>[...el.querySelectorAll('h1,h2,h3,.section-title')].some(h=>h.textContent.trim()===step.findHeading));
 if(step.findText) els=els.filter(el=>el.textContent.includes(step.findText));
 let el=els[0]||null;
 if(el&&step.closest) el=el.closest(step.closest)||el;
 return el;
}
async function waitForTarget(step,timeout=1200){
 const started=Date.now(); let t=null;
 while(Date.now()-started<timeout){t=findTarget(step);if(t)return t;await sleep(40)}
 return findTarget(step);
}
async function waitForScroll(){await sleep(360);await new Promise(resolve=>{let timer=setTimeout(resolve,160);const done=()=>{clearTimeout(timer);resolve()};if('onscrollend' in window)window.addEventListener('scrollend',done,{once:true});else{let last=window.scrollY,stable=0;const tick=()=>{const now=window.scrollY;if(Math.abs(now-last)<1)stable++;else stable=0;last=now;if(stable>=3)return done();timer=setTimeout(tick,45)};tick()}})}
function setBusy(on){busy=on;card?.classList.toggle('is-moving',on);document.body.classList.toggle('nicky-tour-moving',on)}
async function setRoute(route){
 const wanted='#/'+route;
 if(location.hash!==wanted){location.hash=wanted; await sleep(220);} else await sleep(50);
 addProfileCard();
}
async function prep(step){
 // Close tour-opened transient UI before moving to another feature.
 if(step.action!=='chat' && document.body.classList.contains('bash-chat-open')) $('[data-action="bash-chat-close"]')?.click();
 if(step.action!=='drink-order') $('[data-action="close-drink-cart"]')?.click();
 await setRoute(step.route);
 if(step.action==='chat'){
   if(!document.body.classList.contains('bash-chat-open')){await sleep(120); $('[data-action="bash-chat-open"]')?.click(); await sleep(260);}
 }
 if(step.action==='drink-order'){
   await sleep(140);
   const basket=$('.drink-basket-btn');
   if(basket){basket.click(); await sleep(240);}
 }
 addProfileCard();
}
function viewportRoom(r){
 const safeTop=18,safeBottom=18;
 return {above:Math.max(0,r.top-safeTop),below:Math.max(0,innerHeight-r.bottom-safeBottom)};
}
function placeCard(target){
 if(!card)return;
 const gap=14, edge=12, safeBottom=14;
 const h=Math.max(190,card.offsetHeight||240);
 card.style.top='auto'; card.style.bottom='auto';
 card.classList.remove('place-top','place-bottom');
 if(!target){card.style.bottom=`calc(${safeBottom}px + env(safe-area-inset-bottom))`;card.classList.add('place-bottom');return;}
 const r=target.getBoundingClientRect();
 const above=Math.max(0,r.top-gap-edge);
 const below=Math.max(0,innerHeight-r.bottom-gap-edge);
 let top;
 const forced=steps[index]?.place;
 if(forced==='top' && above>=Math.min(h,170)){top=Math.max(edge,r.top-gap-h);card.classList.add('place-top');}
 else if(forced==='bottom' && below>=Math.min(h,170)){top=Math.min(innerHeight-h-edge,r.bottom+gap);card.classList.add('place-bottom');}
 else if(below>=h) { top=Math.min(innerHeight-h-edge,r.bottom+gap); card.classList.add('place-bottom'); }
 else if(above>=h) { top=Math.max(edge,r.top-gap-h); card.classList.add('place-top'); }
 else {
   // Neither side fits perfectly: use the larger clear area and keep the bubble on-screen.
   if(above>=below){top=Math.max(edge,Math.min(r.top-gap-h,innerHeight-h-edge));card.classList.add('place-top');}
   else {top=Math.max(edge,Math.min(r.bottom+gap,innerHeight-h-edge));card.classList.add('place-bottom');}
 }
 card.style.top=Math.round(top)+'px';
}
function position(target){
 clearTarget(); if(!target){placeCard(null);return;}
 currentTarget=target; target.classList.add('nicky-tour-target');
 let r=target.getBoundingClientRect();
 const step=steps[index]||{};
 if(step.spot==='drawer-order'){
   const head=target.querySelector('.section-head');
   const profile=target.querySelector('.drink-profile');
   const orderState=target.querySelector('.drink-empty, .drink-order-lines, .drink-order-line, .bar-closed, [class*="bar-closed"]');
   const hr=head?.getBoundingClientRect(),pr=profile?.getBoundingClientRect(),orr=orderState?.getBoundingClientRect();
   if(hr){
     const b=Math.min(innerHeight-10,Math.max(pr?.bottom||0,orr?.bottom||0,hr.bottom+250));
     r={left:r.left,right:r.right,top:hr.top,bottom:b,width:r.width,height:b-hr.top};
   }
 } else if(step.spot==='plans-card'){
   const planCard=target.querySelector('.card');
   if(planCard) r=planCard.getBoundingClientRect();
 } else if(step.spot==='section-top'){
   const head=target.querySelector('.section-head')||target;
   const hr=head.getBoundingClientRect();
   const first=target.querySelector('.timeline-row, .cocktail');
   const fr=first?.getBoundingClientRect();
   const b=Math.min(innerHeight-10,fr?Math.min(fr.bottom,hr.bottom+340):hr.bottom+80);
   r={left:r.left,right:r.right,top:hr.top,bottom:b,width:r.width,height:b-hr.top};
 }
 const pad=step.spot==='tight'?4:Math.min(10,Math.max(6,r.width*.02));
 const left=Math.max(8,r.left-pad),top=Math.max(8,r.top-pad);
 const right=Math.min(innerWidth-8,r.right+pad),bottom=Math.min(innerHeight-8,r.bottom+pad);
 mark.style.left=left+'px'; mark.style.top=top+'px'; mark.style.width=Math.max(20,right-left)+'px'; mark.style.height=Math.max(20,bottom-top)+'px';
 const radius=parseFloat(getComputedStyle(target).borderRadius)||16; mark.style.borderRadius=Math.min(26,Math.max(12,radius+4))+'px';
 mark.classList.add('show'); placeCard(target);
}
async function revealTarget(target,step){
 if(!target)return;
 const cardH=Math.max(190,card?.offsetHeight||235),gap=18,topSafe=18,bottomSafe=18;
 let r=target.getBoundingClientRect();
 let desiredTop;
 if(step?.action==='drink-order'){
   // Put Nicky above the visible order content instead of covering the order state.
   desiredTop=Math.max(topSafe,Math.min(innerHeight-r.height-bottomSafe,cardH+18));
 } else if(step?.spot==='section-top'){
   // Keep the section heading and first useful content visible below the bubble.
   desiredTop=Math.max(cardH+gap+topSafe,Math.min(innerHeight-r.height-bottomSafe,innerHeight*.50));
 } else if(step?.reveal==='card-below' || step?.reveal==='section-below'){
   // These larger cards should begin directly below the tour bubble, not underneath it.
   desiredTop=Math.min(innerHeight-r.height-bottomSafe,cardH+24);
 } else if(step?.target==='.bash-chat-compose'){
   desiredTop=Math.max(topSafe,innerHeight-cardH-r.height-gap-bottomSafe);
 } else if(step?.place==='top'){
   // Bubble above: move the feature into the lower half so the whole feature can be seen.
   desiredTop=Math.max(cardH+gap+topSafe,Math.min(innerHeight-r.height-bottomSafe,innerHeight*.52));
 } else if(step?.place==='bottom'){
   // Bubble below: keep the feature high and unobscured.
   desiredTop=Math.max(topSafe,Math.min(92,innerHeight*.12));
 } else {
   const roomBelow=Math.max(0,innerHeight-r.bottom-bottomSafe);
   desiredTop=roomBelow>=cardH+gap?Math.max(topSafe,Math.min(r.top,innerHeight-cardH-r.height-gap-bottomSafe)):Math.max(topSafe,Math.min(innerHeight-r.height-bottomSafe,r.top));
 }
 const delta=r.top-desiredTop;
 if(Math.abs(delta)>8){window.scrollBy({top:delta,behavior:'smooth'});await waitForScroll();}
}

function draw(step){
 const pct=Math.round(((index+1)/steps.length)*100);
 card.innerHTML=`<div class="nicky-tour-card-top"><div class="nicky-tour-avatar"><img src="${NICKY}" alt="Nicky"></div><div class="nicky-tour-heading"><small>NICKY’S APP TOUR · ${index+1} OF ${steps.length}</small><h3>${esc(step.title)}</h3></div><button class="nicky-tour-skip" data-nicky-tour-skip>Skip tour</button></div><p>${esc(step.text)}</p><div class="nicky-tour-progress"><i style="width:${pct}%"></i></div><div class="nicky-tour-actions">${index?'<button class="nicky-tour-back" data-nicky-tour-back>← Back</button>':'<span></span>'}<button class="nicky-tour-next" data-nicky-tour-next>${step.finish?'LET’S B.B.B. 🍸':'Next →'}</button></div>`;
 card.classList.add('show'); shade.classList.add('show'); requestAnimationFrame(()=>placeCard(currentTarget));
}
async function show(){
 if(!active||busy)return;
 const id=++runId,step=steps[index];
 setBusy(true); clearTarget(); mark?.classList.remove('show'); card?.classList.remove('settled');
 try{
   await prep(step); if(!active||id!==runId)return;
   let target=await waitForTarget(step);
   draw(step); await sleep(40);
   if(target){await revealTarget(target,step); if(!active||id!==runId)return; target=findTarget(step)||target; position(target);}
   else position(null);
   await sleep(90); if(target)position(findTarget(step)||target);
   card?.classList.add('settled');
 } finally { if(id===runId)setBusy(false); }
}

function start(){
 if(active)return; active=true; index=0; runId++; ensureUI();
 if(card){card.style.display='block';card.style.pointerEvents=''} if(shade)shade.style.display=''; if(mark)mark.style.display='';
 document.body.classList.add('nicky-tour-active'); show();
}
function end(completed=false){
 active=false; runId++; busy=false; clearTarget(); shade?.classList.remove('show'); card?.classList.remove('show'); mark?.classList.remove('show'); document.body.classList.remove('nicky-tour-active','nicky-tour-moving');
 if(card){card.style.display='none';card.style.pointerEvents='none'}
 if(shade)shade.style.display='none';
 if(mark)mark.style.display='none';
 try{localStorage.setItem(KEY,completed?'completed':'skipped')}catch{}
 if(document.body.classList.contains('bash-chat-open')) $('[data-action="bash-chat-close"]')?.click();
 $('[data-action="close-drink-cart"]')?.click();
}
function offer(){
 if(active||$('.nicky-tour-welcome'))return;
 try{if(localStorage.getItem(KEY))return}catch{}
 const el=document.createElement('section'); el.className='nicky-tour-welcome';
 el.innerHTML=`<div class="nicky-tour-welcome-card"><button class="nicky-tour-welcome-x" data-nicky-tour-dismiss aria-label="Close">×</button><div class="nicky-tour-welcome-avatar"><img src="${NICKY}" alt="Nicky"></div><div class="meta">HEY! I’M NICKY 👋</div><h2>Your B.B.B Bali guru.</h2><p>Want me to show you around? I’ll give you a quick interactive tour so you know where everything is and how the good stuff works.</p><button class="btn olive full" data-nicky-tour-start>Take the tour →</button><button class="nicky-tour-later" data-nicky-tour-dismiss>Skip for now</button></div>`;
 document.body.appendChild(el); requestAnimationFrame(()=>el.classList.add('show'));
}
function dismissOffer(){const el=$('.nicky-tour-welcome');if(el){el.classList.remove('show');setTimeout(()=>el.remove(),180)}try{localStorage.setItem(KEY,'skipped')}catch{}}

document.addEventListener('click',e=>{
 if(e.target.closest('[data-nicky-tour-start]')){e.preventDefault(); $('.nicky-tour-welcome')?.remove(); start(); return;}
 if(e.target.closest('[data-nicky-tour-dismiss]')){dismissOffer();return;}
 if(e.target.closest('[data-nicky-tour-skip]')){if(busy)return;end(false);return;}
 if(e.target.closest('[data-nicky-tour-next]')){e.preventDefault();e.stopPropagation();if(index>=steps.length-1){end(true);setTimeout(()=>{location.hash='#/home'},30);return;}if(busy)return; card?.classList.remove('settled'); index++;show();return;}
 if(e.target.closest('[data-nicky-tour-back]')){if(busy)return;if(index>0){card?.classList.remove('settled');index--;show();}return;}
});
const obs=new MutationObserver(()=>{addProfileCard();if(active){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const t=findTarget(steps[index]);if(t)position(t)},80)}});
obs.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('resize',()=>{if(active){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const t=findTarget(steps[index]);if(t)position(t)},80)}});
window.addEventListener('load',()=>{addProfileCard();setTimeout(offer,1100)});
})();
