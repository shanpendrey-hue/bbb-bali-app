const Stripe = require('stripe');

module.exports = async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(!process.env.STRIPE_SECRET_KEY) return res.status(503).json({error:'Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel.'});
  try{
    const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
    const {items=[],profile={},nonPaid=[],successUrl,cancelUrl}=req.body||{};
    if(!items.length)return res.status(400).json({error:'No paid items in cart'});

    // Stripe Checkout cannot settle two currencies in the same Session.
    // The app therefore converts AUD float-hire working prices to AUD line items and
    // requires the host to keep paid cart items in one settlement currency before launch.
    const currencies=[...new Set(items.map(i=>(i.currency||'AUD').toLowerCase()))];
    if(currencies.length>1){
      return res.status(400).json({error:'Your paid cart currently contains both AUD and IDR. Before launch, choose one Stripe checkout currency for pizza + floaties.'});
    }
    const currency=currencies[0];
    const line_items=items.map(i=>({
      quantity:i.qty||1,
      price_data:{
        currency,
        unit_amount:Math.round(Number(i.price||0)*(currency==='idr'?1:100)),
        product_data:{name:i.title||i.name,description:i.meta||undefined}
      }
    }));
    const metadata={
      guest_name:String(profile.name||'').slice(0,200),
      guest_pin:String(profile.pin||'').slice(0,20),
      non_paid_items:JSON.stringify(nonPaid.map(x=>({title:x.title,meta:x.meta,type:x.type,price:x.price}))).slice(0,450)
    };
    const session=await stripe.checkout.sessions.create({
      mode:'payment',
      line_items,
      success_url:successUrl||'https://example.com',
      cancel_url:cancelUrl||successUrl||'https://example.com',
      metadata,
      allow_promotion_codes:false
    });
    res.status(200).json({url:session.url});
  }catch(err){res.status(500).json({error:err.message})}
}
