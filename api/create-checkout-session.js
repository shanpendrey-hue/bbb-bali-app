const Stripe=require('stripe');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.STRIPE_SECRET_KEY)return res.status(503).json({error:'Stripe is not configured yet'});
 const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
 const {items=[],guest='Guest'}=req.body||{};
 // IMPORTANT: final production prices/currencies must be locked here server-side before payments are enabled.
 const allowed={pizza:{name:'Bali Pizza Party',currency:'idr',unit_amount:24900000}}; // 249,000 IDR in smallest unit
 const paid=items.filter(i=>i.type==='pizza').map(i=>({price_data:{currency:allowed.pizza.currency,product_data:{name:allowed.pizza.name,description:`Guest: ${guest}`},unit_amount:allowed.pizza.unit_amount},quantity:1}));
 if(!paid.length)return res.status(400).json({error:'No configured paid items in cart'});
 const base=`https://${req.headers.host}`;
 const s=await stripe.checkout.sessions.create({mode:'payment',line_items:paid,success_url:`${base}/#/profile?paid=1`,cancel_url:`${base}/#/recovery`,customer_creation:'always'});
 res.status(200).json({url:s.url});
};
