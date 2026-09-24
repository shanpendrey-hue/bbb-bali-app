const Stripe=require('stripe');
const ADMIN='shanpendrey@gmail.com';
async function bodyBuffer(req){const chunks=[];for await(const c of req)chunks.push(Buffer.isBuffer(c)?c:Buffer.from(c));return Buffer.concat(chunks)}
async function sendAdmin(subject,html){const key=process.env.RESEND_API_KEY,from=process.env.EMAIL_FROM;if(!key||!from)return;await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:ADMIN,subject,html})})}
module.exports=async function handler(req,res){
  if(req.method!=='POST')return res.status(405).end();
  if(!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET)return res.status(503).end();
  try{
    const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
    const raw=await bodyBuffer(req);
    const event=stripe.webhooks.constructEvent(raw,req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET);
    if(event.type==='checkout.session.completed'){
      const s=event.data.object;
      const name=s.metadata?.guest_name||'Guest';
      const qty=s.metadata?.quantity||'1';
      const total=typeof s.amount_total==='number'?`Rp${s.amount_total.toLocaleString('id-ID')}`:'';
      await sendAdmin(`Paid Pizza Party order — ${name}`,`<h2>New paid B.B.B order</h2><p><b>${name}</b> purchased <b>${qty} x Bali Pizza Party</b>.</p><p><b>Total paid:</b> ${total}</p><p><b>Guest email:</b> ${s.customer_details?.email||s.customer_email||''}</p><p>Payment was completed through Stripe.</p>`);
    }
    return res.status(200).json({received:true});
  }catch(err){console.error(err);return res.status(400).send('Webhook error')}
};
module.exports.config={api:{bodyParser:false}};
