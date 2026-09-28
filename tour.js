(()=>{
'use strict';
const KEY='bbb_nicky_tour_seen_v1';
const NICKY='/assets/nicky-profile.png';
let active=false,index=0,mark=null,card=null,shade=null,resizeTimer=null,currentTarget=null;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const $=s=>document.querySelector(s);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const steps=[
 {route:'home',target:'.hero',title:'Hey! I’m Nicky 👋',text:'I’m your B.B.B Bali guru. Let me show you around — I’ll take you to the important bits and you just tap Next when you’re ready.'},
 {route:'home',target:'.sunset-card',title:'Your home base',text:'Home keeps the important stuff easy to find. Next Up shows what’s coming, and your trip shortcuts live here too.'},
 {route:'bbb',target:'.bbb-hero',title:'The B.B.B 🎂',text:'This is where the Big Bali Bash lives — the birthday plans, what’s happening and all the fun stuff for Nicolle’s 50th.'},
 {route:'bbb',target:'.itinerary-head',title:'The itinerary',text:'I’ll automatically scroll you to the next thing. Your B.B.B itinerary has the times and plans for the day — no group-chat archaeology required.'},
 {route:'bbb',target:'.cocktail-head',title:'Cocktails 🍸',text:'Browse the B.B.B cocktail menu, choose your drinks and build your order. You can have a practice before the big day too.'},
 {route:'bbb',target:'.drink-basket-btn',title:'My Order',text:'Your drinks collect here. When the B.B.B Bar is open on the day, Send order to the bar sends your order directly to our B.B.B bartenders. Until then, you can practise — I just won’t let you send it.'},
 {route:'bbb',target:'.bbb-photo-card',title:'The B.B.B Media Roll 📸',text:'Please share your photos! B.B.B photos are collected in our private B.B.B Google Drive so Nicolle can keep the memories together and everyone can view the collection later.'},
 {route:'bash',target:'.bash-board-top',title:'The Bash Board',text:'Think of this as our little B.B.B Facebook feed. See what everyone’s up to, post updates and keep the trip chatter together.'},
 {route:'bash',target:'.bash-quick-compose',title:'Create a post',text:'Tap “What’s happening?” to post to the crew. You can add photos, check in somewhere or add how you’re feeling.'},
 {route:'bash',action:'chat',target:'.bash-chat-top',title:'B.B.B Group Chat 💬',text:'This is the crew chat. Send messages, reply and react. It’s the quick place to keep everyone together.'},
 {route:'bash',action:'chat',target:'.bash-chat-compose',title:'Share the photos!',text:'Use the camera or photo button to share your shots — including multiple photos at once. Tap photo bundles to open them, swipe through and save the ones you want. B.B.B media can also be saved into the shared Google Drive collection.'},
 {route:'travel',target:'.pagehead',title:'Travel ✈️',text:'Before Bali, this is an important one. Your flights, airport pickup and villa information all live in the Travel area.'},
 {route:'ready',target:'.pagehead',title:'Bali Ready',text:'Use Bali Ready for your visa, tourist levy, arrival declaration, insurance, passport and saved flight details. Work through it before you fly.'},
 {route:'travel',target:'.pickup-card, [class*="pickup-card"]',title:'Airport pickup',text:'Need a lift from the airport? Your Made airport pickup can be organised and managed here, along with your arrival details.'},
 {route:'travel',target:'.villa-actions',title:'Chandra Villas',text:'Your Bali base is easy to find — open it in Maps, jump to the Chandra website or call from here.'},
 {route:'bali',target:'.section-head',title:'The Bali Guide 🌴',text:'Food, drinks, practical Bali info and Shannon’s recommendations are all here. Open a guide whenever you need it.'},
 {route:'profile',target:'.pagehead',title:'Your Profile 👤',text:'This bit is all about YOU. Your profile is where you’ll find everything you’ve organised for the trip.'},
 {route:'profile',target:'.section:nth-of-type(5), .section',findText:'My Plans',title:'All your plans',text:'Your bookings and plans will appear here. If plans change and you need to reschedule, edit or cancel something, head back to your Profile and manage it here.'},
 {route:'profile',target:'#nicky-tour-profile-card',title:'Need the tour again?',text:'Haven’t had a chance to explore properly — or want another look? Come back to Profile and tap Take the tour with Nicky. I’ll start this walkthrough again anytime.'},
 {route:'home',target:'.nicky-launcher',title:'If you’re not sure… Ask Nicky! ✨',text:'I’m your number one B.B.B Bali guru. Ask me about the trip, itinerary, villa, Bali, where to go or what you’ve booked. I’m always hanging out here in the corner — tap me and chat whenever you need me.',finish:true}
];

function addProfileCard(){
 if(location.hash!=='#/profile'||$('#nicky-tour-profile-card'))return;
 const sections=[...document.querySelectorAll('#app .section')];
 const host=sections[0]||$('.pagehead'); if(!host)return;
 const section=document.createElement('section'); section.className='section nicky-tour-profile-section'; section.id='nicky-tour-profile-card';
 section.innerHTML=`<article class="card nicky-tour-profile-card"><div class="nicky-tour-profile-avatar"><img src="${NICKY}" alt="Nicky"></div><div class="nicky-tour-profile-copy"><div class="meta">NEED A QUICK TOUR?</div><h3>Haven’t explored the app yet?</h3><p>Click here and I’ll show you around — where everything is and how the good stuff works.</p><button class="btn olive" type="button" data-nicky-tour-start>Take the tour with Nicky →</button></div></article>`;
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
 if(step.findText) els=els.filter(el=>el.textContent.includes(step.findText));
 return els[0]||null;
}
async function setRoute(route){
 const wanted='#/'+route;
 if(location.hash!==wanted){location.hash=wanted; await sleep(260);} else await sleep(80);
 addProfileCard();
}
async function prep(step){
 if(step.action!=='chat' && document.body.classList.contains('bash-chat-open')) $('[data-action="bash-chat-close"]')?.click();
 await setRoute(step.route);
 if(step.action==='chat'){
   if(!document.body.classList.contains('bash-chat-open')){await sleep(120); $('[data-action="bash-chat-open"]')?.click(); await sleep(220);}
 }
 addProfileCard();
}
function viewportRoom(r){
 const safeTop=12,safeBottom=12;
 return {above:Math.max(0,r.top-safeTop),below:Math.max(0,innerHeight-r.bottom-safeBottom)};
}
function placeCard(target){
 if(!card)return;
 card.classList.remove('place-top','place-bottom','place-center');
 if(!target){card.classList.add('place-bottom');return;}
 const r=target.getBoundingClientRect();
 const room=viewportRoom(r);
 // Put Nicky on the opposite side of the thing she is explaining.
 // Prefer a side with enough room for the card; otherwise use the larger side.
 const estimated=Math.min(300,Math.max(205,card.offsetHeight||235));
 let placement;
 if(room.below>=estimated+28) placement='bottom';
 else if(room.above>=estimated+28) placement='top';
 else placement=room.above>room.below?'top':'bottom';
 card.classList.add('place-'+placement);
 // If the target is very tall, keep the card on the side furthest from its centre.
 if(r.height>innerHeight*.48){
   card.classList.remove('place-top','place-bottom');
   card.classList.add(r.top+r.height/2>innerHeight/2?'place-top':'place-bottom');
 }
}
function position(target){
 clearTarget(); if(!target){placeCard(null);return;}
 currentTarget=target; target.classList.add('nicky-tour-target');
 const r=target.getBoundingClientRect(),pad=Math.min(10,Math.max(6,r.width*.02));
 const left=Math.max(8,r.left-pad),top=Math.max(8,r.top-pad);
 const right=Math.min(innerWidth-8,r.right+pad),bottom=Math.min(innerHeight-8,r.bottom+pad);
 mark.style.left=left+'px'; mark.style.top=top+'px'; mark.style.width=Math.max(20,right-left)+'px'; mark.style.height=Math.max(20,bottom-top)+'px';
 const radius=parseFloat(getComputedStyle(target).borderRadius)||16; mark.style.borderRadius=Math.min(26,Math.max(12,radius+4))+'px';
 mark.classList.add('show'); placeCard(target);
}
async function revealTarget(target){
 if(!target)return;
 const r=target.getBoundingClientRect();
 // Reserve space for Nicky so the feature is not hidden behind the bubble.
 const desiredTop=Math.max(92,Math.min(innerHeight*.34,(innerHeight-r.height)/2));
 const delta=r.top-desiredTop;
 if(Math.abs(delta)>18){window.scrollBy({top:delta,behavior:'smooth'});await sleep(470);}
}
function draw(step){
 const pct=Math.round(((index+1)/steps.length)*100);
 card.innerHTML=`<div class="nicky-tour-card-top"><div class="nicky-tour-avatar"><img src="${NICKY}" alt="Nicky"></div><div class="nicky-tour-heading"><small>NICKY’S APP TOUR · ${index+1} OF ${steps.length}</small><h3>${esc(step.title)}</h3></div><button class="nicky-tour-skip" data-nicky-tour-skip>Skip tour</button></div><p>${esc(step.text)}</p><div class="nicky-tour-progress"><i style="width:${pct}%"></i></div><div class="nicky-tour-actions">${index?'<button class="nicky-tour-back" data-nicky-tour-back>← Back</button>':'<span></span>'}<button class="nicky-tour-next" data-nicky-tour-next>${step.finish?'LET’S B.B.B. 🍸':'Next →'}</button></div>`;
 card.classList.add('show'); shade.classList.add('show'); requestAnimationFrame(()=>placeCard(currentTarget));
}
async function show(){
 if(!active)return; const step=steps[index]; clearTarget(); mark.classList.remove('show');
 await prep(step); if(!active)return;
 let target=findTarget(step);
 if(target){await revealTarget(target); target=findTarget(step); position(target);}
 draw(step); await sleep(40); if(target) position(findTarget(step)||target);
}
function start(){
 if(active)return; active=true; index=0; ensureUI(); document.body.classList.add('nicky-tour-active'); show();
}
function end(completed=false){
 active=false; clearTarget(); shade?.classList.remove('show'); card?.classList.remove('show'); document.body.classList.remove('nicky-tour-active');
 try{localStorage.setItem(KEY,completed?'completed':'skipped')}catch{}
 if(document.body.classList.contains('bash-chat-open')) $('[data-action="bash-chat-close"]')?.click();
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
 if(e.target.closest('[data-nicky-tour-skip]')){end(false);return;}
 if(e.target.closest('[data-nicky-tour-next]')){if(index>=steps.length-1){end(true);location.hash='#/home';return;} index++;show();return;}
 if(e.target.closest('[data-nicky-tour-back]')){if(index>0){index--;show();}return;}
});
const obs=new MutationObserver(()=>{addProfileCard();if(active){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const t=findTarget(steps[index]);if(t)position(t)},80)}});
obs.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('resize',()=>{if(active){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const t=findTarget(steps[index]);if(t)position(t)},80)}});
window.addEventListener('load',()=>{addProfileCard();setTimeout(offer,1100)});
})();
