const ADMIN='shanpendrey@gmail.com';
function clean(value){return String(value??'').replace(/[<>]/g,'').slice(0,2000)}
async function sendEmail(to,subject,html){
  const key=process.env.RESEND_API_KEY;
  const from=process.env.EMAIL_FROM;
  if(!key||!from)throw new Error('Email service not configured');
  const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to,subject,html})});
  if(!r.ok)throw new Error(`Email failed ${r.status}`);
  return r.json();
}
module.exports=async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const type=clean(body.type);
    const p=body.payload||{};
    const guest=clean(p.guest||'Guest');
    const guestEmail=clean(p.email||'');
    if(!guestEmail)return res.status(400).json({error:'Guest email required'});
    let subject='',adminHtml='',guestHtml='';
    if(type==='massage'){
      subject=`New massage booking — ${guest}`;
      adminHtml=`<h2>${subject}</h2><p><b>Treatment:</b> ${clean(p.treatment)}</p><p><b>Time:</b> ${clean(p.slot)}</p><p><b>Duration:</b> ${clean(p.duration)}</p><p><b>Price:</b> ${clean(p.price)}</p><p><b>Payment:</b> Cash on the day</p><p><b>Guest email:</b> ${guestEmail}</p>`;
      guestHtml=`<h2>Your massage is booked</h2><p>Hi ${guest},</p><p><b>${clean(p.treatment)}</b><br>26 January 2027 · ${clean(p.slot)} · ${clean(p.duration)}</p><p><b>${clean(p.price)}</b> — cash on the day.</p><p>This booking has also been added to My Plans in the B.B.B app.</p>`;
    }else if(type==='driver'){
      subject=`New airport pickup — ${guest}`;
      adminHtml=`<h2>${subject}</h2><p><b>Flight:</b> ${clean(p.flight)}</p><p><b>Arrival:</b> ${clean(p.arrival)}</p><p><b>Drop-off:</b> ${clean(p.area)}</p><p><b>Sign:</b> ${clean(p.sign)}</p><p><b>Arrival drinks:</b> ${clean(p.drinks)}</p><p><b>Total cash due:</b> ${clean(p.total)}</p><p><b>Made:</b> ${clean(p.made)}</p><p><b>Guest email:</b> ${guestEmail}</p>`;
      guestHtml=`<h2>Your airport pickup request is saved</h2><p>Hi ${guest},</p><p><b>Flight:</b> ${clean(p.flight)}<br><b>Arrival:</b> ${clean(p.arrival)}<br><b>Drop-off:</b> ${clean(p.area)}</p><p><b>Drinks:</b> ${clean(p.drinks)}</p><p><b>Total:</b> ${clean(p.total)} — cash on delivery.</p><p>Your request is in My Plans. Shannon will organise the pickup with Made.</p>`;
    }else return res.status(400).json({error:'Unknown notification type'});
    await Promise.all([sendEmail(ADMIN,subject,adminHtml),sendEmail(guestEmail,`B.B.B confirmation — ${subject.replace(/^New /,'')}`,guestHtml)]);
    return res.status(200).json({ok:true});
  }catch(err){
    console.error(err);
    return res.status(503).json({error:'Email service not configured or unavailable'});
  }
};
