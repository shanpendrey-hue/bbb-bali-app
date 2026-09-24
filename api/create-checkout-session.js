const Stripe=require('stripe');
module.exports=async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  if(!process.env.STRIPE_SECRET_KEY)return res.status(503).json({error:'Stripe is not configured'});
  try{
    const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const qty=Math.max(1,Math.min(20,Number(body.qty)||1));
    const email=String(body.email||'').trim();
    const name=String(body.name||'Guest').trim();
    if(!email)return res.status(400).json({error:'Email is required'});
    const proto=req.headers['x-forwarded-proto']||'https';
    const host=req.headers.host;
    const origin=`${proto}://${host}`;
    const session=await stripe.checkout.sessions.create({
      mode:'payment',
      customer_email:email,
      line_items:[{
        quantity:qty,
        price_data:{currency:'idr',unit_amount:249000,product_data:{name:'Bali Pizza Party',description:'The Great Aussie Recovery · 26 January 2027 · 1:00–3:00 PM'}}
      }],
      metadata:{guest_name:name,guest_email:email,quantity:String(qty),event:'Bali Pizza Party'},
      success_url:`${origin}/?paid=1#/profile`,
      cancel_url:`${origin}/#/recovery`
    });
    return res.status(200).json({url:session.url});
  }catch(err){
    console.error(err);
    return res.status(500).json({error:'Unable to start checkout'});
  }
};
